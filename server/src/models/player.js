var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var PlayerSchema = new Schema({
    name:     { type: String }
});


module.exports = mongoose.model('Player', PlayerSchema);