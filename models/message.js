/**
 * Created by User on 06.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    name: String,
    date:Date,
    text: String,
    sender:String,
}));
