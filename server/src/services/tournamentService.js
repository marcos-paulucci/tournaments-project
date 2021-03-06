var Battle  = require('../models/battle');
var Player  = require('../models/player');
var Fixture  = require('../models/fixture');
var Tournament  = require('../models/tournament');
var Jury  = require('../models/jury');
var BattleService  = require('./battleService');
var FixtureService = require('./FixtureService');
var nextBattleCalculator = require('./nextBattleCalculator');
class TournamentService {

    async createTournament(name) {
        await Tournament.create({
            name: name,
            date: Date.now()
        }, function (err, trn) {
            if (err) {
                console.log('Tournament CREATE Error: ' + err);
            }
        });
    };

    async addStyleToTournament(tournamentId, name) {
        await Tournament.create({
            name: name,
            date: Date.now(),
            tournamentId: tournamentId,

        }, function (err, trn) {
            if (err) {
                console.log('Tournament CREATE Error: ' + err);
                cli.callback(null, err);
            } else {
                cli.callback(trn);
            }
        });
    };

    async getAllTournaments(callback){
        Tournament.find({}, function(err, ts) {
            var tournaments = [];
            ts.forEach(function(t) {
                tournaments.push(t);
            });
            callback(tournaments);
        });
    };

    async removeTournament(name){
        let tournament;
        await Tournament.find({name: name}, function(err, trn) {
            tournament = trn;
        });
        await Tournament.findByIdAndRemove(tournament._id);
    }

    async getTournamentByName(name, callback){
        let tournament;
        await Tournament.findOne({'name': name}, async function(err, trn) {
            callback(trn);
        });
    }

    async getTourFixture(tournName, style, callback){
        let tournament;
        await this.getTournamentByName(tournName, async function(trn){
            tournament = trn;
            let fixtures;
            await FixtureService.getTournamentFixtures(tournament._id, function(fxts){
                fixtures = fxts;
                let fixture = fixtures.find(f => f.style === style);
                callback(fixture);
            });

        });

    }

    async getTourAllFixtures(callback, tournName){
        let tournament;
        await this.getTournamentByName(tournName, function(trn){tournament = trn;});
        let fixtures;
        await FixtureService.getTournamentFixtures(tournament._id, function(fxts){fixtures = fxts;});
        if (callback)
            callback(fixtures);
        return fixtures;
    }

}

let tournService = new TournamentService();
module.exports = tournService;
