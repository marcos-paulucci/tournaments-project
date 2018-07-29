var Player  = require('../models/player');
var TournamentsService  = require('./tournamentService');
var FixtureService  = require('./fixtureService');
const filesPath = 'public/uploads/';
var fs = require('fs');

class PlayersService {

    async getExistingPlayers(callback, style, names){
        await Player.find({
            'style': style,
            'name': { $in: names.map(p => p.name)}
        }, async function(err, pls){
            await callback(pls);
        });
    }

    async createPlayers(callback, names, style, tournamentName){
        let createdPlayers = [],
            existingPlayers = [];
        await this.getExistingPlayers(async function(pls){
                existingPlayers = pls;
            }, style, names );
        let existingPlayersNames = existingPlayers.map(p => p.name);
        let notExistingNames = names.map(p => p.name).filter(newName => existingPlayersNames.indexOf(newName) < 0),
            notExistingObjects = notExistingNames.map(n => {return {name: n, style: style}});
        Player.insertMany(notExistingObjects)
            .then(async function (pls) {
                createdPlayers = pls;
                let fixture;
                await TournamentsService.getTourFixture(tournamentName, style, async function(fx){
                    fixture = fx;
                    let previousPlayers = fixture.allPlayers && fixture.allPlayers.length > 0 ? fixture.allPlayers : [];
                    let allPlayers = previousPlayers.concat(createdPlayers);
                    for (let i = 0; i < existingPlayers.length; i++){
                        let needsToBeAdded = true;
                        for (let j = 0; j < previousPlayers.length; j++){
                            if (existingPlayers[i]._id.toString() === previousPlayers[j].toString()){
                                needsToBeAdded = false;
                            }
                        }
                        if (needsToBeAdded){
                            allPlayers.push(existingPlayers[i]._id);
                        }

                    }
                    fixture.allPlayers = allPlayers;
                    await fixture.save(function (err, updatedFx) {
                        if (err) {
                            console.log("Error adding all players to fixture ", err);
                        } else {
                            callback(updatedFx);
                        }
                    });
                });


            })
            .catch(function (err) {
                console.error(err)
            });

    };

    async deletePlayer(id){
        await Player.findByIdAndRemove(id);
    };

    async getTournamentPlayers(callback, tournamentName, style){
        let fixture;
        await TournamentsService.getTourFixture(tournamentName, style, async function(fx){
            fixture = fx;
            await Player.find({
                '_id': { $in: fixture.allPlayers}
            }, function(err, pls){
                callback(pls);
            });
        });

    }

    async getTopTournamentPlayers(callback, tournamentName, style){
        let fixture;
        await TournamentsService.getTourFixture(tournamentName, style, async function(fx){
            fixture = fx;
            await Player.find({
                '_id': { $in: fixture.players.map(function(p){return p.player})}
            }, function(err, pls){
                let finalPlayers = fixture.players.sort(function(p1,p2){
                    return p1.index - p2.index;
                })
                    .map(function(p){return p.player}).map(function(pid){
                    return pls.find(p => p.id === pid)
                });
                callback(finalPlayers);
            });
        });

    }


    async setTopPlayersForTournament(callback, tournName, style, playersIds){
        let fx;
        await TournamentsService.getTourFixture(tournName, style, function(fxt){
            fx = fxt;
            fx.players = playersIds.map(function(p, i){return {player: p, index: i};});
            fx.save(function (err, updatedFx) {
                if (err) {
                    console.log("Error updating fixture ", err);
                }
                callback(updatedFx);
            });
        });

    };


}

let playersService = new PlayersService();
module.exports = playersService;