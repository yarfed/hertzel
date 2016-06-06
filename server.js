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
var Server = require('./models/server');
var ping = require('ping');
var port = process.env.PORT || 80;
mongoose.connect(config.database);
app.set('superSecret', config.secret);
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

var apiRoutes = express.Router();

//set jwt token into cookies
apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({name: req.body.login}, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({success: false, message: 'User not found!'});
        } else if (user) {

            if (user.password != req.body.password) {
                res.status(401).json({success: false, message: 'Wrong password!'});
            } else {

                var token = jwt.sign({'name': user.name, 'ip': user.ip}, app.get('superSecret'), {
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
            var ip = req.ip.replace(/[^\\.0-9]/gim, '');
            new User({name: req.body.login, password: req.body.password, 'ip': ip}).save(function (err) {
                if (err) throw err;
                res.json({success: true, message: 'User created!'});
                io.sockets.emit('update', ['users']);
            });

        } else {
            res.status(403).json({success: false, message: 'Name already in use!'});
        }
    });
});

var ssh = {};
apiRoutes.post('/monitor', function (req, res) {
    var sshKey = req.body.ssh;
    if (ssh[sshKey]) {
        ssh[sshKey] = +new Date() + 3000;
    } else {
        ssh[sshKey] = +new Date() + 3000;
        io.sockets.emit('update', 'ssh');
    }
    res.status(200).send();
});
setInterval(function cleaner() {
    var upd = false;
    for (var k in ssh) {
        if (ssh[k] < +new Date()) {
            delete ssh[k];
            upd = true;
        }
    }
    if (upd) {
        io.sockets.emit('update', 'ssh');
    }
}, 1000);

//secure check token on every request defined below
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
    res.json({name: req.decoded.name, ip: req.decoded.ip});
});

apiRoutes.get('/logout', function (req, res) {
    res.clearCookie('access_token');
    res.sendStatus(200);
});

apiRoutes.get('/ping/:host', function (req, res) {
    ping.sys.probe(req.params.host, function (isAlive) {
        if (isAlive) {
            res.status(200).send();
        }
        else {
            res.status(404).send();
        }
    });
});
apiRoutes.get('/users', function (req, res) {
    User.find({}, {name: 1, ip: 1}, function (err, users) {
        res.json(users);
    });
});

apiRoutes.route('/servers')

    .get(function (req, res) {
        Server.find({}, function (err, servers) {
            res.json(servers);
        });
    })

    .post(function (req, res) {
        Server.findOne({ip: req.body.ip}, function (err, server) {

            if (err) throw err;

            if (!server) {

                new Server({
                    ip: req.body.ip,
                    type: req.body.type,
                    description: req.body.description,
                    owner: req.body.owner
                }).save(function (err) {
                    if (err) throw err;
                    res.json({success: true, message: 'Server created!'});
                    io.sockets.emit('update', ['servers']);
                });
            } else {
                res.status(403).json({success: false, message: 'Ip already in use!'});
            }
        });
    });

apiRoutes.route('/users/:name')
    .get(function (req, res) {
        //get user
    })

    .delete(function (req, res) {

        User.remove({name: req.params.name}, function (err) {
            if (err) {
                res.sendStatus(404);
            }
            Server.update({owner: req.params.name}, {$set: {owner: null}}, {multi: true}).exec();
            res.sendStatus(200);
            io.sockets.emit('update', ['users']);
        });
    });

apiRoutes.route('/servers/:ip')

    .delete(function (req, res) {

        Server.findOne({ip: req.params.ip}, function (err, model) {
            if (err) {
                throw err;
            }
            model.remove(function (err) {
                if (err) {
                    throw err;
                }
                res.sendStatus(200);
                io.sockets.emit('update', ['servers']);
            });
        });
    });

apiRoutes.route('/servers/owner').post(function (req, res) {
    var ip=req.body.ip;
    var oldOwner=req.body.oldOwner;
    var newOwner=req.body.newOwner;
    var changer=req.body.changer;
    if (oldOwner==newOwner){
        res.sendStatus(401);
        return;
    }

    Server.update({ip: ip}, {$set: {owner: newOwner}}, function(err){
        if (err) {
            throw err;
        }
        res.sendStatus(200);
        io.sockets.emit('update', ['servers']);
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


