var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Jury  = require('../models/jury');
var TournamentsService  = require('./tournamentService');
var BattleService  = require('./battleService');
var nextBattleCalculator = require('./nextBattleCalculator');
class FixtureService {

    async createInitialFixture(callback, tournamentName, style, top, points) {
        let tournament,
            battlesToCreate = [];
        await TournamentsService.getTournamentByName(tournamentName, function(trn){tournament = trn;});
        await Fixture.create({
            style: style,
            date: Date.now(),
            tournamentId: tournament._id,
            top: top,
            points: points
        }, function (err, fx) {
            if (err) {
                console.log('Fixture CREATE Error: ' + err);
                callback(null, err);
            } else {
                callback(fx);
            }
        });
    };

    async removeFixtureBattles(callback, fixtureId){
        await Fixture.findById(fixtureId, async function (err, fxt) {
            if (err) {
                console.log("Error searching fixture by id", err);
            }
            await Battle.remove({
                '_id': { $in: fxt.battles}
            }, function(err) {
                if (err) {
                    console.log("error removing fixture battles!");
                }
            });
            fxt.battles = [];
            fxt.save(function (err, updatedFx) {
                if (err) {
                    console.log("Error removing fixture battles", err);
                }
                callback(updatedFx);
            });
        });
    }

    async fixtureCreateBattles(cli, fixtureId) {
        await this.removeFixtureBattles(async function(){
            var battlesArr = [],
                players = [],
                fixtureToUpdate = null;

            await Fixture.findById(fixtureId, function (err, fxt) {
                if (err) {
                    console.log("Error searching fixture by id", err);
                }
                fixtureToUpdate = fxt;
            });
            await Player.find({
                'style': fixtureToUpdate.style,
                '_id': { $in: fixtureToUpdate.players}
            }, async function(err, pls){
                for (let i = 0; i < pls.length; i++){
                    players.push(pls[i]);
                }
            });

            for (let i = 0, idForFixture = 1; i < fixtureToUpdate.top; i+= 2, idForFixture++){
                let playerOne = players[i]? players[i].name : "dummy",
                    playerTwo = players[i+1]? players[i+1].name : "dummy";
                battlesArr.push({
                    fixtureId: fixtureToUpdate._id,
                    style: fixtureToUpdate.style,
                    player1: playerOne,
                    player2: playerTwo,
                    isCurrent: false,
                    idForFixture: idForFixture,
                    nextBattleIdFix: nextBattleCalculator(idForFixture, fixtureToUpdate.top)
                });
            }

            //creacion de las batallas de cuartos, semis, etc, con competidores por ahora indefinidos
            const totalBattles = fixtureToUpdate.top - 1,
                createdBattles = fixtureToUpdate.top / 2,
                remainingBattlesToCreate = totalBattles - createdBattles;
            for (let j = createdBattles + 1; j < remainingBattlesToCreate + createdBattles + 1; j++){
                battlesArr.push({
                    fixtureId: fixtureToUpdate._id,
                    style: fixtureToUpdate.style,
                    player1: "",
                    player2: "",
                    isCurrent: false,
                    idForFixture: j,
                    nextBattleIdFix: nextBattleCalculator(j, fixtureToUpdate.top)
                });
            }
            BattleService.createAllBattles(fixtureToUpdate._id, fixtureToUpdate.style, battlesArr, async function(btls){
                fixtureToUpdate.battles = btls;
                fixtureToUpdate.save(async function (err, updatedFx) {
                    if (err) {
                        console.log("Error updating fixture ", err);
                    }
                });
                await BattleService.closeDummiesBattles(fixtureToUpdate._id);
                cli.callback();
            });
        }, fixtureId);


    };

    async getFixture(cli, tourName, style) {
        var battlesArr = [];
        let fx;
        await TournamentsService.getTourFixture(tourName, style, async function(fxt){
            fx = fxt;
            for (let i = 0; i < fx.battles.length; i++){
                await Battle.findById(fx.battles[i], function (err, bt) {
                    if (err) {
                        console.log('Battle search Error: ' + err);
                    } else {
                        battlesArr.push(bt);
                    }
                });
            }
            cli.callback({
                id: fx._id,
                style: fx.style,
                date: fx.date,
                battles: battlesArr,
                points: fx.points,
                juries: fx.juries
            });
        });

    };

    async getAllFixtures(cli) {
        Fixture.find({}, async function(err, fxs) {
            if (err) {
                console.log('Fixtures search Error: ' + err);
            } else if (fxs) {
                cli.callback(fxs);
            } else {
                //not found
                cli.callback({ });
            }
        });
    };


    async getTournamentFixtures(tournamentId, callback) {
        let tourFixts = null;
        await Fixture.find({tournamentId: tournamentId}, async function(err, fxs) {
            if (err) {
                console.log('Fixtures search Error: ' + err);
            } else {
                tourFixts = fxs;
                callback(tourFixts);
            }
        });
    };

    async removeFixture(callback, id) {
        await Fixture.findById(id, async function(err, fx) {
            for (let i = 0; i < fx.battles.length; i++){
                await BattleService.deleteBattle( fx.battles[i]);
            }
        });
        await Fixture.findByIdAndRemove(id);
        callback();
    };

    async getFixtureJuryPoints(callback, tournName, style) {
        let fxt;
        await TournamentsService.getTourFixture(tournName, style, function(fx){
            fxt = fx;
            callback(fxt.points);
        });

    };

}

let fixtureService = new FixtureService();
module.exports = fixtureService;
