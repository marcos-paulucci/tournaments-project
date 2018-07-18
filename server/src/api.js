var Battle  = require('./models/battle');
var Player  = require('./models/player');
var Jury  = require('./models/jury');
var Fixture  = require('./models/fixture');
var Tournament  = require('./models/tournament');
var express = require('express');
var router = express.Router();
let multer = require('multer');
let upload = multer();
var path = require('path');
var fs = require('fs');
const imagesPath = 'public/uploads/';
const battleService = require('./services/battleService');
const fixtureService = require('./services/fixtureService');
const playersService = require('./services/playersService');
const juryService = require('./services/juryService');
const tournamentService = require('./services/tournamentService');

router.route('/currentBattlePoints')
    .post( (req, res) => {
        battleService.updateInmemoActiveBattlePoints(req.body.battleId, {
            name: req.body.juryName,
            p1: req.body.p1,
            p2: req.body.p2
        });
    })
    .get(async (req, res) => {
        await battleService.getInmemoActiveBattleById(function(bt){
            res.status(200).json(bt);
        }, req.query.id);
    });

router.post('/upload', upload.array('photos',16), (req, res, next) => {

    var files = req.files;
    for (var i = 0; i < files.length; i++){
        var file = files[i];
        var nameLastDot = file.originalname.lastIndexOf("."),
            nameWithJpgName =  file.originalname.substring(0, nameLastDot);
        var target_path = imagesPath + nameWithJpgName + ".jpg";
        fs.writeFile(target_path, file.buffer);
    }
    res.status(200).send('subido exitosamente!');

});




router.route('/currentBattle')
.post(async (req, res) => {
    await battleService.setCurrentBattle(function(){
        res.status(200).send('current battle set succesfully!');
    }, req.body.battleId);
})

.get(async (req, res) => {
    await battleService.getCurrentBattle(function(bt){
        res.status(200).json(bt);
    });
});

router.route('/closeBattle')
    .post(async (req, res) => {
        await battleService.closeBattle(function(){
            res.status(200).send('Batalla cerrada y guardada con exito!');
        }, req.body.battleId);
    });




router.route('/playersNames')
    .post((req, res) => {
        playersService.createPlayers(function(){
            res.status(200).send('Ok');
        },req.body.names, req.body.style, req.body.tournamentName );

    })

    .get((req, res) => {
        playersService.getTournamentPlayers(function(plys){
            res.status(200).json(plys);
        }, req.query.tourName, req.query.style);
    })
    .delete(async (req, res) => {
        Player.remove({}, function(){
            res.status(200).send('Deleted');
        });
    });

router.route('/juriesNames')
    .post((req, res) => {

        req.body.juriesNames.forEach(function(j){
            Jury.create({
                name: j.name,
                style: req.body.style
            }, function (err, player) {
                if (err) {
                    console.log('CREATE Error: ' + err);
                    res.status(500).send('Error');
                }
            });
        });
        res.status(200).send('Ok');
    })

    .get(async (req, res) => {
        await juryService.getJuries(function(){res.send(), req.query.torneoName, req.query.style})
    })
;


router.route('/juriesForTournament')
    .post(async (req, res) => {
        await juryService.setJuriesForTournament(function(){
            res.status(200).send('Ok');
        }, req.body.tournName, req.body.style, req.body.juriesIds );
    })
;

router.route('/playersForTournament')
    .post(async (req, res) => {
        await playersService.setPlayersForTournament(function(){
            res.status(200).send('Ok');
        }, req.body.tournName, req.body.style, req.body.playersIds );
    })
;

router.route('/checkJuryName')

    .get((req, res) => {
        Jury.findOne({name: req.query.name, style: req.query.style}, function(err, jury) {
            if (err) {
                console.log('Jury search Error: ' + err);
            } else if (jury) {
                res.status(200).send('Jury found!');
            } else {
                res.status(404).send('Jury Not found');
            }
        });
    });

router.route('/fixtures/:tourName/:style')
    .get(async (req, res) => {
        await fixtureService.getFixture({callback: function(fx){
            res.send(fx);
        }}, req.params.tourName, req.params.style);
    })
    .post(async (req, res) => {
        await fixtureService.fixtureCreateBattles({callback: function(){}}, req.params.id);
        res.status(200).send('Ok');
    })
;

router.route('/fixtures')
    .get(async (req, res) => {
        await tournamentService.getTourAllFixtures(function(fxs){
                res.send(fxs);
            }, req.query.tournamentName);
    })
    .delete(async (req, res) => {
        await fixtureService.removeFixture(function(){
                res.status(200).send('Deleted');
            }, req.query.id);
    })
    ;

router.route('/tournaments/:name/:style')
    .post(async (req, res) => {
        await fixtureService.createInitialFixture(function(){
            res.status(200).send('Created!');
        },req.query.name, req.query.style);

    });

router.route('/tournaments')
    .post(async (req, res) => {
        await tournamentService.createTournament(req.body.name);
        res.status(200).send('Ok');
    })
    .get((req, res) => {
        tournamentService.getAllTournaments(function(trnms){res.send(trnms);});
    })
    .delete(async (req, res) => {
        await tournamentService.removeTournament(req.query.name);
        res.status(200).send('Deleted');
    });


module.exports = router;