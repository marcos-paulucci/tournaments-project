var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var battleSchema = new Schema({
    player1:     { type: String, default: '' },
    player2:     { type: String, default: '' },
    juryScores: {type: Array, default: []},
    winner:  { type: String, default: '' }
});


module.exports = mongoose.model('Battle', battleSchema);