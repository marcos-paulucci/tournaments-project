var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Jury  = require('../models/jury');

class FixtureService {

        async createFixture(cli, style) {
            debugger;
            var battlesArr = [];
            var juries = [];
            var initialJuryScores = [];
            await Jury.find({}, function(err, js) {
                js.forEach(function(j) {
                    juries.push(j);
                });
                initialJuryScores = juries.map(function(j){
                    return {
                        name: j.name,
                        p1: 0,
                        p2: 0
                    }
                });
            });
            var players = [];
            await Player.find({}, function(err, ps) {

                //creacion de las batallas de primera ronda
                for (let i = 0; i < ps.length; i++){
                    players.push(ps[i]);
                }
            });

            for (let i = 0; i < players.length; i+= 2){
                await Battle.create({
                    player1: players[i].name,
                    player2: players[i+1].name,
                    juryScores: initialJuryScores
                }, function (err, battle) {
                    if (err) {
                        console.log('CREATE Error: ' + err);
                    } else {
                        battlesArr.push({battleId: battle._id, player1: battle.player1, player2: battle.player2 });
                    }
                });
            }

            //creacion de las batallas de cuartos, semis, etc, con competidores por ahora indefinidos
            const totalBattles = players.length - 1,
                createdBattles = players.length / 2,
                remainingBattlesToCreate = totalBattles - createdBattles;
            for (let j = 0; j < remainingBattlesToCreate; j++){
                await Battle.create({  }, function (err, battle) {
                    if (err) {
                        console.log('CREATE Error: ' + err);
                    } else {
                        battlesArr.push({battleiD: battle._id, player1: "", player2: ""});
                    }
                });
            }

            await Fixture.create({
                battles: battlesArr,
                style: style,
                date: Date.now()
            }, function (err, fx) {
                if (err) {
                    console.log('CREATE Error: ' + err);
                    cli.callback(null, err);
                } else {
                    debugger;
                    cli.callback(fx);
                }
            });
        };

    }

let fixtureService = new FixtureService();
module.exports = fixtureService;
