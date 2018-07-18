var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var battleSchema = new Schema({
    player1:     { type: String, default: '' },
    player2:     { type: String, default: '' },
    style: { type: String },
    fixtureId:  { type: Schema.ObjectId },
    juryScores: {type: Array, default: []},
    winner:  { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    idForFixture: {type: Number, default: 0},
    nextBattleIdFix: {type: Number, default: 0}
});


module.exports = mongoose.model('Battle', battleSchema);