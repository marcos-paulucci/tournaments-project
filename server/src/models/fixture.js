var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var fixtureSchema = new Schema({
    battles:     { type: Array, default: [] },
    players: {type: Array, default: []},
    juries: {type: Array, default: []},
    style:     { type: String },
    date:  { type: Date },
    tournamentId: { type: Schema.ObjectId }
});


module.exports = mongoose.model('Fixture', fixtureSchema);