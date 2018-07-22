var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var fixtureSchema = new Schema({
    battles:     { type: Array, default: [] },
    players: {type: Array, default: []},
    allPlayers: {type: Array, default: []},
    juries: {type: Array, default: []},
    style:     { type: String },
    date:  { type: Date },
    tournamentId: { type: Schema.ObjectId },
    top: {type: Number},
    points: {type: Number}
});


module.exports = mongoose.model('Fixture', fixtureSchema);