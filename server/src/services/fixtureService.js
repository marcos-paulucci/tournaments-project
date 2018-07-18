var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Jury  = require('../models/jury');
var TournamentsService  = require('./tournamentService');
var BattleService  = require('./battleService');
var nextBattleCalculator = require('./nextBattleCalculator');
class FixtureService {

    async createInitialFixture(cli, tournamentName, style) {
        let tournament = await TournamentsService.getTournamentByName(tournamentName);
        await Fixture.create({
            style: style,
            date: Date.now(),
            tournamentId: tournament._id
        }, function (err, fx) {
            if (err) {
                console.log('Fixture CREATE Error: ' + err);
                cli.callback(null, err);
            } else {
                cli.callback(fx);
            }
        });
    };

    async fixtureCreateBattles(cli, fixtureId) {
        var battlesArr = [],
            players = [],
            fixtureToUpdate = null;

        await Fixture.findById(fixtureId, function (err, fxt) {
            if (err) {
                console.log("Error searching fixture by id", err);
            }
            fixtureToUpdate = fxt;
        });

        await Player.find({style: fixtureToUpdate.style }, function(err, ps) {
            //creacion de las batallas de primera ronda
            for (let i = 0; i < ps.length; i++){
                players.push(ps[i]);
            }
        });

        for (let i = 0, idForFixture = 1; i < players.length; i+= 2, idForFixture++){
            let newBattleId = await BattleService.createBattle(
                players[i].name,players[i+1].name,
                false,
                idForFixture,
                nextBattleCalculator(idForFixture, players.length));
            battlesArr.push(newBattleId);
        }

        //creacion de las batallas de cuartos, semis, etc, con competidores por ahora indefinidos
        const totalBattles = players.length - 1,
            createdBattles = players.length / 2,
            remainingBattlesToCreate = totalBattles - createdBattles;
        for (let j = createdBattles + 1; j < remainingBattlesToCreate + createdBattles + 1; j++){
            let newBattleId = await BattleService.createBattle( "","", false, j, nextBattleCalculator(j, players.length));
            battlesArr.push(newBattleId);
        }

        fixtureToUpdate.battles = battlesArr;
        fixtureToUpdate.save(function (err, updatedFx) {
            if (err) {
                console.log("Error updating fixture ", err);
            }
            cli.callback(updatedFx);
        });
    };

    async getFixture(cli, tourName, style) {
        var battlesArr = [];
        let fx = await TournamentsService.getTourFixture(tourName, style);
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
            battles: battlesArr
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


    async getTournamentFixtures(tournamentId) {
        let tourFixts = null;
        await Fixture.find({tournamentId: tournamentId}, async function(err, fxs) {
            if (err) {
                console.log('Fixtures search Error: ' + err);
            } else {
                tourFixts = fxs;
            }
        });
        return tourFixts;
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

}

let fixtureService = new FixtureService();
module.exports = fixtureService;
