/**
 * Created by User on 26.05.2016.
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');

var port = process.env.PORT || 80;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function (req, res) {

    // find the user
    User.findOne({
        name: req.body.login
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({success: false, message: 'User not found!'});
        } else if (user) {

            if (user.password != req.body.password) {
                res.status(401).json({success: false, message: 'Wrong password!'});
            } else {

                var token = jwt.sign({'name': user.name,'ip':user.ip}, app.get('superSecret'), {
                    expiresIn: "1d"
                });

                res.cookie('access_token', token, {maxAge: 86400000, httpOnly: true});//24h
                res.json({
                    success: true,
                    message: 'Enjoy your token!'
                });
            }
        }
    });
});

apiRoutes.post('/users', function (req, res) {

    User.findOne({
        name: req.body.login
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            new User({name: req.body.login, password: req.body.password, 'ip':req.ip}).save(function (err) {
                if (err) throw err;
                res.json({success: true, message: 'User created!'});
                io.sockets.emit('update','users');
            });

        } else {
            res.status(403).json({success: false, message: 'Name already in use!'});
        }
    });
});
var ssh =[];
apiRoutes.post('/monitor', function (req, res) {
    console.log(req.body);
    res.status(200).send();
});

//secure
apiRoutes.use(function (req, res, next) {

    var token = req.cookies['access_token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: 'bad token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

apiRoutes.get('/login', function (req, res) {
    res.json({name:req.decoded.name,ip:req.decoded.ip});
});

apiRoutes.get('/logout', function (req, res) {
    res.clearCookie('access_token');
    res.sendStatus(200);
});

apiRoutes.get('/users', function (req, res) {
    User.find({},{ name: 1, ip: 1 }, function (err, users) {
        res.json(users);
    });
});

apiRoutes.route('/users/:name')

    .get(function (req, res) {
       //get user
    })

    .delete(function (req, res) {
        User.findOne({ name : req.params.name}, function (err, model) {
            if (err) {
                throw err;
            }
            model.remove(function (err) {
                if (err){
                    throw err;
                }
                res.sendStatus(200);
                io.sockets.emit('update','users');
            });
        });
    });

apiRoutes.get('/ssh', function (req, res) {
        res.json(ssh);
});

app.use('/api', apiRoutes);

server.listen(port);

// non secure, only for notifications.
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(socket.id);

});

console.log('started:' + port);


