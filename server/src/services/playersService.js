var Player  = require('../models/player');
var TournamentsService  = require('./tournamentService');
var FixtureService  = require('./fixtureService');
const imagesPath = 'public/uploads/';
var fs = require('fs');

class PlayersService {

    async createPlayers(callback, names, style){
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
        callback();
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


    async setPlayersForTournament(callback, tournName, style, playersIds){
        let fx = await TournamentsService.getTourFixture(tournName, style);
        fx.players = playersIds;
        fx.save(function (err, updatedFx) {
            if (err) {
                console.log("Error updating fixture ", err);
            }
            callback(updatedFx);
        });
    };

    async getPlayers(callback, torneoName, style){
        let fxt = await TournamentsService.getTourFixture(torneoName, style);

        await Player.find({style: style}, function(err, pls) {
            var players = [];
            pls.forEach(function(p) {
                p.plays = fxt.players.indexOf(p._id) >= 0;
                players.push({name: p.name, _id: p._id, plays: p.plays});
            });
            callback(players);
        });
    };

}

let playersService = new PlayersService();
module.exports = playersService;