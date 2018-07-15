var mongoose = require('mongoose');  
var Schema   = mongoose.Schema;

var jurySchema = new Schema({
    name:     { type: String, default: '' },
    style:     { type: String },
    sportName:     { type: String, default: '' }
});


module.exports = mongoose.model('Jury', jurySchema);