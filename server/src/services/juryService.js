var Jury  = require('../models/jury');
var TournamentsService  = require('./tournamentService');
const filesPath = 'public/uploads/';
var fs = require('fs');

class JuryService {

    async deleteJury(juryId){

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
        let fx;
        await TournamentsService.getTourFixture(tournName, style, function(fxt){
            fx = fxt;
            fx.juries = juriesIds;
            fx.save(function (err, updatedFx) {
                if (err) {
                    console.log("Error updating fixture ", err);
                }
                callback(updatedFx);
            });
        });

    }

    async getJuries(callback, torneoName, style){
        let fxt;
        await TournamentsService.getTourFixture(torneoName, style, async function(fx){
            fxt = fx;
            await Jury.find({style: style}, function(err, js) {
                var juries = [];
                js.forEach(function(j) {
                    j.isJury = fxt.juries.indexOf(j._id) >= 0;
                    juries.push({name: j.name, _id: j._id, isJury: j.isJury});
                });
                callback(juries);
            });
        });


    };

}

let juryService = new JuryService();
module.exports = juryService;