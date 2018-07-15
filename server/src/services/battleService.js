var Battle  = require('../models/battle');
var loki = require('lokijs');
var lokiDb = new loki('lokiInMemoryDb.db');
var currentBattlesInMemo;
var Jury  = require('../models/jury');
lokiDb.loadDatabase({}, function() {
    currentBattlesInMemo = lokiDb.getCollection("currentBattles");
    if(!currentBattlesInMemo){
        currentBattlesInMemo = lokiDb.addCollection('currentBattles');
    }
});


class BattleService {

    async setCurrentBattle(callback, battleId){
        const self = this;
        await Battle.update({},{isCurrent: false},{multi: true});

        await Battle.findById(battleId, async function (err, bt) {
            if (err) {
                console.log('Battle search Error: ' + err);
            } else if (bt) {
                bt.isCurrent = true;
                await bt.save(function (savedBt) { });
                const {id, player1, player2, juryScores} = bt;
                await self.insertInmemoActiveBattle({id, player1, player2, juryScores});
                callback();
            } else {
                console.log('Battle search Error: 400: not found');
            }
        });
    }

    getCurrentBattle(callback){
        Battle.findOne({isCurrent: true}, function(err, battle) {
            if (err) {
                console.log('Get current battle error : ' + err);
            } else if (battle) {
                callback(battle);
            } else {
                console.log('Current Battle not found ');
            }
        });
    }

    closeBattle(battleId, j1p1, j1p2, j2p1, j2p2, winner, cli) {
        Battle.findById(battleId, function (err, battle) {
            if (err) {
                console.log('PUT Error: ' + err);
                cli.callback(null, err);
            } else if (battle) {
                battle.jury1P1 = j1p1;
                battle.jury1P2 = j1p2;
                battle.jury2P1 = j2p1;
                battle.jury2P2 = j2p2;
                battle.winner = winner;
                battle.save(function () { });
            } else {
                cli.callback(null, null);
            }
        });
    };

    async getInmemoActiveBattleById(callback, battleId) {
        var battle = await currentBattlesInMemo.findObject({'id': battleId.toString()});
        if (callback)
            callback(battle);
        return battle;
    };

    insertInmemoActiveBattle(battle) {
        currentBattlesInMemo.insert(battle);
        lokiDb.saveDatabase();
    };

    async updateInmemoActiveBattlePoints(battleId, newJuryScores){
        var bt = await this.getInmemoActiveBattleById(null, battleId);
        let newScores = bt.juryScores.map(function(score, index) {
            if (score.name == newJuryScores.name){
                return newJuryScores;
            }
            return score;
        });
        bt.juryScores = newScores;
        currentBattlesInMemo.save(bt);
        lokiDb.saveDatabase();
    };

    deleteInmemoActiveBattle(battleId){
        var bt = this.getInmemoActiveBattleById(battleId);
        currentBattlesInMemo.remove(bt);
        lokiDb.saveDatabase();
    };

    async deleteBattle(battleId){
        await Battle.findByIdAndRemove(battleId);
    };

    async createBattle( p1, p2, isCurrent){
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
        let createdBattleId = null;
        let curr = false;
        if (isCurrent !== null && isCurrent !== undefined){
            curr = isCurrent;
        }
        await Battle.create({
            player1: p1 ? p1 : "",
            player2: p2 ? p2 : "",
            juryScores: initialJuryScores,
            isCurrent: curr
        }, function (err, battle) {
            if (err) {
                console.log('CREATE Error: ' + err);
            } else {
                createdBattleId = battle._id;
            }
        });
        return createdBattleId;
    }
}

let battleService = new BattleService();
module.exports = battleService;