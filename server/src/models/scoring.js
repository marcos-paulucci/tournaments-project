var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var scoringSchema = new Schema({
    author: { type: String },
    scorePlayer1:     { type: Number },
    scorePlayer2:     { type: Number }
});

// var scoringSchema = new Schema({
//     author          : String,
//     scorePlayer1   : {
//         name        : String,
//         app_key     : String,
//         app_secret  : String
//     }
// })

module.exports = mongoose.model('Scoring', scoringSchema);