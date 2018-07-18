var Player  = require('../models/player');
var TournamentsService  = require('./tournamentService');
var FixtureService  = require('./fixtureService');
const imagesPath = 'public/uploads/';
var fs = require('fs');

class PlayersService {

    async createPlayers(callback, names, style, torneoName){
        let createdPlayers = [];
        names.forEach(async function(p){
            await Player.create({
                name: p.name,
                style: style
            }, function (err, player) {
                if (err) {
                    console.log('CREATE Error: ' + err);
                } else {
                    createdPlayers.push(player._id);
                }
            });
        });
        let fixtureUpdate = TournamentsService.getTourFixture(torneoName, style);
        fixtureUpdate.players = createdPlayers;
        fixtureUpdate.save(function (err, updatedFx) {
            if (err) {
                console.log("Error updating fixture ", err);
            }
            callback(updatedFx);
        });
    };

    async deletePlayer(id){
        await Player.findByIdAndRemove(id);
    };

    async getTournamentPlayers(callback, tournamentName, style){
        let fixture = TournamentsService.getTourFixture(tournamentName, style);
        Player.find({
            '_id': { $in: fixture.players}
        }, function(err, pls){
            callback(pls);
        });
    }

    async deleteAllPlayers(callback){
        await Player.find({}, function(err, p) {
            p.forEach(function(j) {
                var target_path = imagesPath + p.name + ".jpg";
                fs.unlinkSync(target_path);
            });
        });
        await Player.remove({}, function(){
            callback();
        });
    };

    async setPlayersForTournament(callback, tournName, style, playersIds){
        let fx = await TournamentsService.getTourFixture(tournName, style);
        fx.players = playersIds;
        fx.save(function (err, updatedFx) {
            if (err) {
                console.log("Error updating fixture ", err);
            }
            callback(updatedFx);
        });
    }

}

let playersService = new PlayersService();
module.exports = playersService;