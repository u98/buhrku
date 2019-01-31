let mongoose = require('mongoose')
let Schema = mongoose.Schema;
let logger = new Schema({
    time: String,
    ip: String,
    url: String
})
module.exports = mongoose.model('logger', logger)