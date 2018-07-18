var Jury  = require('../models/jury');
var TournamentsService  = require('./tournamentService');
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

    async deleteJuryById(juryId){
        await Jury.findByIdAndRemove(juryId);
    };

    async deleteJuryByNameStyle(callback, name, style){
        await Jury.find({name: name, style: style}, function(err, js) {
            js.remove({}, function(){
                callback();
            });
        });
    }

    async setJuriesForTournament(callback, tournName, style, juriesIds){
        let fx = await TournamentsService.getTourFixture(tournName, style);
        fx.juries = juriesIds;
        fx.save(function (err, updatedFx) {
            if (err) {
                console.log("Error updating fixture ", err);
            }
            callback(updatedFx);
        });
    }

    async getJuries(callback, torneoName, style){
        let fxt = await TournamentsService.getTourFixture(torneoName, style),
            juries = [];

        Jury.find({style: style}, function(err, js) {
            var juries = [];
            js.forEach(function(j) {
                j.isJury = fxt.juries.find(j._id)
                juries.push(j);
            });
            callback(juries);
        });
    };

}

let juryService = new JuryService();
module.exports = juryService;