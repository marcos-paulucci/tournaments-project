var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var fixtureSchema = new Schema({
    battles:     { type: Array },
    style:     { type: String },
    date:  { type: Date }
});


module.exports = mongoose.model('Fixture', fixtureSchema);