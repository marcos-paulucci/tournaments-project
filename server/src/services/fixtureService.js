var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');

class FixtureService {

        getCurrentBattlePlayers() {
            Player.find({}, function(err, ps) {
                var battlesIds = [];
                for (let i = 0; i < ps.length; i+= 2){
                    Battle.create({
                        player1: ps[i].name,
                        player2: ps[i+1].name
                    }, function (err, battle) {
                        if (err) {
                            console.log('CREATE Error: ' + err);
                        } else {
                            battlesIds.push(battle._id);
                        }
                    });
                }

                res.send(players);
            });
        };

        getAllPlayers() {
            Player.remove({}, function(){});
            req.body.forEach(function(p){
                Player.create({
                    name: p.name
                }, function (err, player) {
                    if (err) {
                        console.log('CREATE Error: ' + err);
                        res.status(500).send('Error');
                    }
                });
            });
        };

    }

let playersService = new FixtureService();
export default playersService;
