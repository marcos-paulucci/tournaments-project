var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var TournamentSchema = new Schema({
    name:     { type: String },
    date: { type: Date, default: Date.now() },
    fixtures:     { type: Array, default: [] }
});


module.exports = mongoose.model('Tournament', TournamentSchema);