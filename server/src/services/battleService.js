var Battle  = require('../models/battle');
var loki = require('lokijs');
var lokiDb = new loki('lokiInMemoryDb.db');
var currentBattlesInMemo;
lokiDb.loadDatabase({}, function() {
    currentBattlesInMemo = lokiDb.getCollection("currentBattles");
});


class BattleService {

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

    getInmemoActiveBattleById(battleId) {
        //Read user's age
        var battle = currentBattlesInMemo.findObject({'battleId': battleId.toString()});
    };

    insertInmemoActiveBattle(battle) {
        currentBattlesInMemo.insert(battle);
        lokiDb.saveDatabase();
    };

    updateInmemoActiveBattlePoints(battleId, newJuryScores){
        var bt = this.getInmemoActiveBattleById(battleId);
        let newScores = bt.juryScores.map(function(score, index) {
            if (score.juryName == newJuryScores.juryName){
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

}

let battleService = new BattleService();
module.exports = battleService;