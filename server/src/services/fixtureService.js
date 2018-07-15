var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Jury  = require('../models/jury');
var BattleService  = require('./battleService');

class FixtureService {

        async createFixture(cli, style) {
            var battlesArr = [];
            var players = [];
            await Player.find({}, function(err, ps) {
                //creacion de las batallas de primera ronda
                for (let i = 0; i < ps.length; i++){
                    players.push(ps[i]);
                }
            });

            for (let i = 0; i < players.length; i+= 2){
                let newBattleId = await BattleService.createBattle( players[i].name,players[i+1].name);
                battlesArr.push(newBattleId);
            }

            //creacion de las batallas de cuartos, semis, etc, con competidores por ahora indefinidos
            const totalBattles = players.length - 1,
                createdBattles = players.length / 2,
                remainingBattlesToCreate = totalBattles - createdBattles;
            for (let j = 0; j < remainingBattlesToCreate; j++){
                let newBattleId = await BattleService.createBattle( );
                battlesArr.push(newBattleId);
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
                    cli.callback(fx);
                }
            });
        };

    async getFixture(cli) {
        var battlesArr = [];
        Fixture.findOne({}, {}, { sort: { 'created_at' : -1 } }, async function(err, fx) {

            if (err) {
                console.log('Fixture search Error: ' + err);
            } else if (fx) {
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
            } else {
                //not found
                cli.callback({ });
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

}

let fixtureService = new FixtureService();
module.exports = fixtureService;
