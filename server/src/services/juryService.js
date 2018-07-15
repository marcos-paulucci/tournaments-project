var Jury  = require('../models/jury');
const imagesPath = 'public/uploads/';
var fs = require('fs');

class JuryService {

    async deleteJury(juryId){

    };

    async deleteAllJuries(callback){
        await Jury.find({}, function(err, js) {
            js.forEach(function(j) {
                var target_path = imagesPath + j.name + ".jpg";
                fs.unlinkSync(target_path);
            });
        });
        await Jury.remove({}, function(){
            callback();
        });
    };

}

let juryService = new JuryService();
module.exports = juryService;