var Battle  = require('../models/battle');
var Fixture  = require('../models/fixture');
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

    async setCurrentBattle(callback, battleId, style, fixtureId){
        const self = this;
        await Battle.update({style: style},{isCurrent: false},{multi: true});

        await Battle.findById(battleId, async function (err, bt) {
            if (err) {
                console.log('Battle search Error: ' + err);
            } else if (bt) {
                bt.isCurrent = true;
                await bt.save(function (savedBt) { });
                const {id, style, player1, player2, juryScores} = bt;
                await self.insertInmemoActiveBattle({id, style, fixtureId, player1, player2, juryScores});
                callback();
            } else {
                console.log('Battle search Error: 400: not found');
            }
        });
    }

    async getCurrentBattle(callback, style){
        Battle.findOne({isCurrent: true, style: style}, function(err, battle) {
            if (err) {
                console.log('Get current battle error : ' + err);
            } else if (battle) {
                callback(battle);
            } else {
                console.log('Current Battle not found ');
            }
        });
    }

    async closeDummiesBattles(fixtureId) {
        const self = this;
        let fxt = null;
        Battle.find({ fixtureId: fixtureId}, async function(err, bts) {
            if (err) {
                console.log('Dummy battles search error: ' + err);
            } else {
                bts.forEach(async function(bt){
                    if (!bt.winner && (bt.player1 === "dummy" || bt.player2 === "dummy") ){
                        let winner = null;
                        if (bt.player1 === "dummy"){
                            bt.winner = bt.player2;
                            winner = bt.player2;
                        }
                        if (bt.player2 === "dummy"){
                            bt.winner = bt.player1;
                            winner = bt.player1;
                        }
                        await bt.save(function () { });
                        await self.setPlayerNextBattle(fixtureId, bt.nextBattleIdFix, winner);
                    }
                });

            }
        });
    };


    async closeBattle(callback, battleId, fixtureId) {
        const self = this;
        Battle.findById(battleId, async function (err, battle) {
            if (err) {
                console.log('Closing battle error, battle not found. Error: ' + err);
            } else if (battle) {
                let battleInMemory = await self.getInmemoActiveBattleById(null, battleId),
                    p1Total = 0,
                    p2Total = 0;
                for (let j = 0; j < battleInMemory.juryScores.length; j++){
                    p1Total += battleInMemory.juryScores[j].p1;
                    p2Total += battleInMemory.juryScores[j].p2;
                }
                let winner = p1Total > p2Total ? battle.player1 : battle.player2;
                battle.juryScores = battleInMemory.juryScores;
                battle.isCurrent = false;
                battle.winner = winner;

                await battle.save(function () { });
                await self.deleteInmemoActiveBattle(battleId);
                await self.setPlayerNextBattle(fixtureId, battle.nextBattleIdFix, winner);
                await self.closeDummiesBattles(fixtureId);
                const currentBattleIdFix = battle.idForFixture;
                await Battle.findOne({ fixtureId: fixtureId, idForFixture: currentBattleIdFix + 1 }, async function(err, bt) {
                    if (err) {
                        console.log('Next battle error, not found to set current: ' + err);
                    } else if (bt) {
                        await self.setCurrentBattle(callback, bt._id, bt.style, fixtureId)
                    } else {
                        console.log('Next battle not found! : ' + err);
                        callback();
                    }
                });
            } else {
                callback();
            }
        });
    };

    async setPlayerNextBattle(fixtureId, nextBattleId, player) {
        const self = this;
        Battle.findOne({ fixtureId: fixtureId, idForFixture: nextBattleId }, async function(err, bt) {
            if (err) {
                console.log('Next battle error, not found to set player: ' + err);
            } else if (bt) {
                if (bt.winner !== null && bt.winner !== undefined && bt.winner !== ""){
                    await self.setPlayerNextBattle(fixtureId, nextBattleId + 1, player);
                } else {
                    if (bt.player1 === null || bt.player1 === undefined || bt.player1 === ""){
                        bt.player1 = player
                    } else {
                        bt.player2 = player
                    }
                    await bt.save(function () { });
                }

            } else {
                console.log('Next battle not found! : ' + err);
            }
        });
    };

    async getInmemoActiveBattleById(callback, battleId) {
        var battle = await currentBattlesInMemo.findObject({'id': battleId.toString()}),
            self = this;
        if (!battle){
            //may be the system went down and the inmemo db lost the current battles, but they should be saved in mongo
            await this.getCurrentBattle(async function(b){
                battle = b;
                const {id, player1, player2, juryScores} = b;
                await self.insertInmemoActiveBattle({id, player1, player2, juryScores});
            });
        }
        if (callback)
            callback(battle);
        return battle;
    };

    async insertInmemoActiveBattle(battle) {
        if (battle.juryScores.length === 0 || battle.juryScores[0].name === ""){
            throw Error("que carajo que llega sin scores?????");
        }
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
        currentBattlesInMemo.update(bt);
        lokiDb.saveDatabase();
    };

    async deleteInmemoActiveBattle(battleId){
        var bt = await this.getInmemoActiveBattleById(null, battleId);
        currentBattlesInMemo.remove(bt);
        lokiDb.saveDatabase();
    };


    async deleteBattle(battleId){
        await Battle.findByIdAndRemove(battleId);
    };

    async createAllBattles(fixtureId, style, allBattles, callback){
        var juries = [],
            initialJuryScores = [],
            fixture;
        await Fixture.findById(fixtureId, async function (err, fxt) {
            if (err) {
                console.log("Error searching fixture by id", err);
            }
            fixture = fxt;
            const myCllback = callback;
            await Jury.find({style: style, '_id': { $in: fixture.juries}}, async function(err, js) {
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
                let finalBattles = allBattles.map(function(b) {
                    return {
                        fixtureId: b.fixtureId,
                        style: style,
                        player1: b.player1,
                        player2: b.player2,
                        juryScores: initialJuryScores,
                        isCurrent: b.isCurrent,
                        idForFixture: b.idForFixture,
                        nextBattleIdFix: b.nextBattleIdFix
                    }
                });
                await Battle.create(finalBattles, function (err, battles) {
                    if (err) {
                        console.log('CREATE Error: ' + err);
                    } else {
                        myCllback(battles.map(b => b._id));
                    }
                });

            });
        });
    }

    async createBattle(fixtureId, style, p1, p2, isCurrent, idForFixture, nextBattleIdFix, callback){
        var juries = [],
            initialJuryScores = [],
            fixture;
        await Fixture.findById(fixtureId, async function (err, fxt) {
            if (err) {
                console.log("Error searching fixture by id", err);
            }
            fixture = fxt;
            const myCllback = callback;
            await Jury.find({style: style, '_id': { $in: fixture.juries}}, async function(err, js) {
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
                let createdBattleId = null;
                let curr = false,
                    idFix = false;
                if (isCurrent !== null && isCurrent !== undefined){
                    curr = isCurrent;
                }
                if (idForFixture!== null && idForFixture !== undefined){
                    idFix = idForFixture;
                }

                await Battle.create({
                    fixtureId: fixtureId,
                    style: style,
                    player1: p1 ? p1 : "",
                    player2: p2 ? p2 : "",
                    juryScores: initialJuryScores,
                    isCurrent: curr,
                    idForFixture: idFix,
                    nextBattleIdFix: nextBattleIdFix
                }, function (err, battle) {
                    if (err) {
                        console.log('CREATE Error: ' + err);
                    } else {
                        createdBattleId = battle._id;
                        myCllback(createdBattleId);
                    }
                });

            });
        });
    }
}

let battleService = new BattleService();
module.exports = battleService;