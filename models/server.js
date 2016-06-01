/**
 * Created by User on 30.05.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Server', new Schema({
    ip: String,
    description: String,
    owners:[],
    connections:[]
}));