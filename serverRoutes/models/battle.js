var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var battleSchema = new Schema({
    player1:     { type: String },
    player2:     { type: String }
});


module.exports = mongoose.model('Battle', battleSchema);