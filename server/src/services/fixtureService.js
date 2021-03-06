var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Jury  = require('../models/jury');
var TournamentsService  = require('./tournamentService');
var BattleService  = require('./battleService');
var xlsService  = require('./xlsService');
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
                '_id': { $in: fixtureToUpdate.players.map(function(p){return p.player;})}
            }, async function(err, pls){
                for (let i = 0; i < pls.length; i++){
                    players.push(pls[i]);
                }
                let finalPlayers = fixtureToUpdate.players.sort(function(p1,p2){return p1.index - p2.index;})
                    .map(function(pid){
                        return players.find(p => p.id === pid.player)
                    });

                for (let i = 0, idForFixture = 1; i < fixtureToUpdate.top; i+= 2, idForFixture++){
                    let playerOne = finalPlayers[i]? finalPlayers[i].name : "dummy",
                        playerTwo = finalPlayers[i+1]? finalPlayers[i+1].name : "dummy";
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

    async exportFixture(cli, tourName, style) {
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
            let fileName = tourName + '-' + style + '.xls',
                dataset = battlesArr.map(function(bt) {
                    let juryScores = bt.juryScores.map(function (vote) {
                        let juryscoresitem = [];
                        let strP1 = vote.name + ' -> ' + bt.player1,
                            strP2 = vote.name + ' -> ' + bt.player2;
                        juryscoresitem[strP1] = vote.p1;
                        juryscoresitem[strP2] = vote.p2;
                        return juryscoresitem;
                    });
                    let totalP1 = bt.juryScores.reduce((acum, score2) => {
                            return acum + score2.p1;
                        }, 0),
                        totalP2 = bt.juryScores.reduce((acum, score2) => {
                            return acum + score2.p2;
                        }, 0);
                    let battleXls = {
                        'Batalla #': bt.idForFixture,
                        'Competidor 1': bt.player1,
                        'Competidor 2': bt.player2,
                        'Ganador': bt.winner,
                        'Puntos competidor 1': totalP1,
                        'Puntos competidor 2': totalP2
                    };
                    for (let k = 0; k < juryScores.length; k++){
                        let juryScore = juryScores[k];
                        for (let prop in juryScore) {
                            if (juryScore.hasOwnProperty(prop)) {
                                battleXls[prop] = juryScore[prop];
                            }
                        }
                    }
                    return battleXls;
                });
            xlsService.createXls(fileName,dataset);
            cli(fileName);
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
