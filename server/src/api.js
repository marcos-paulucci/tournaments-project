var Battle  = require('./models/battle');
var Player  = require('./models/player');
var Jury  = require('./models/jury');
var Fixture  = require('./models/fixture');
var express = require('express');
var router = express.Router();
let multer = require('multer');
let upload = multer();
var path = require('path');
var fs = require('fs');
const imagesPath = 'public/uploads/';
const battleService = require('./services/battleService');
const fixtureService = require('./services/fixtureService');
const juryService = require('./services/juryService');

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
        res.status(200).send('Ok');
    })

    .get((req, res) => {
        Player.find({}, function(err, ps) {
            var players = [];
            ps.forEach(function(p) {
                players.push(p);
            });

            res.send(players);
        });
    })
    .delete(async (req, res) => {
        Player.remove({}, function(){
            res.status(200).send('Deleted');
        });
    });

router.route('/juriesNames')
    .post((req, res) => {

        req.body.forEach(function(j){
            Jury.create({
                name: j.name
            }, function (err, player) {
                if (err) {
                    console.log('CREATE Error: ' + err);
                    res.status(500).send('Error');
                }
            });
        });
        res.status(200).send('Ok');
    })

    .get((req, res) => {
        Jury.find({}, function(err, js) {
            var juries = [];
            js.forEach(function(j) {
                juries.push(j);
            });

            res.send(juries);
        });
    })
    .delete(async (req, res) => {
        await juryService.deleteAllJuries(function(){
            res.status(200).send('Deleted');
        });
    })
;

router.route('/checkJuryName')

    .get((req, res) => {
        Jury.findOne({name: req.query.name}, function(err, jury) {
            if (err) {
                console.log('Jury search Error: ' + err);
            } else if (jury) {
                res.status(200).send('Jury found!');
            } else {
                res.status(404).send('Jury Not found');
            }
        });
    });

router.route('/fixture')
    .post(async (req, res) => {
        await fixtureService.createFixture({callback: function(){}}, "breaking");
        res.status(200).send('Ok');
    })

    .get(async (req, res) => {
        await fixtureService.getFixture({callback: function(fx){
                res.send(fx);
            }});
    })
    .delete(async (req, res) => {
        await fixtureService.removeFixture(function(){
                res.status(200).send('Deleted');
            }, req.query.id);
    })
    ;



module.exports = router;