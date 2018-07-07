var Pusher = require('pusher');
var Scoring  = require('./models/scoring');
var Battle  = require('./models/battle');
var express = require('express');
var router = express.Router();
let multer = require('multer');
let upload = multer();
var path = require('path');
var fs = require('fs');


var pusher = new Pusher({
  appId      : process.env.PUSHER_APP_ID,
  key        : process.env.PUSHER_APP_KEY,
  secret     : process.env.PUSHER_APP_SECRET,
    encrypted  : true,
    cluster: 'us2'
});
var channel = 'battle_points';

/* CREATE */
router.post('/new', function (req, res) {
    Scoring.create({
        author: req.body.author,
        scorePlayer1: req.body.p1,
        scorePlayer2: req.body.p2
  }, function (err, scoring) {
    if (err) {
      console.log('CREATE Error: ' + err);
        res.status(500).send('Error');
    } else {
      pusher.trigger(
        channel,
        'newPoints',
        {
          name: 'newPoints',
          id: scoring._id,
            author: scoring.author,
            p1: scoring.scorePlayer1,
            p2: scoring.scorePlayer2,
        },
          function (err, req, respo){
            console.log(err);
          }
      );

      res.status(200).json(scoring);
    }
  });
});

router.post('/upload', upload.single('file'), (req, res, next) => {
    let imageFile = req.file;

    //
    // imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function(err) {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //
    //     res.json({file: `public/${req.body.filename}.jpg`});
    // });
    //

    var tmp_path = req.file.buffer;

    /** The original name of the uploaded file
     stored in the variable "originalname". **/
    var target_path = 'public/uploads/' + req.body.filename + ".jpg";

    /** A better way to copy the uploaded file. **/
    // var src = fs.createReadStream(tmp_path);
    // var dest = fs.createWriteStream(target_path);
    // src.pipe(dest);
    // src.on('end', function() { res.render('complete'); });
    // src.on('error', function(err) { res.render('error'); });

    fs.writeFile(target_path, req.file.buffer);

});


router.route('/battlePlayers')

    .post((req, res) => {

        Battle.remove({}, function(){});

        Battle.create({
            player1: req.body.p1,
            player2: req.body.p2
        }, function (err, battle) {
            if (err) {
                console.log('CREATE Error: ' + err);
                res.status(500).send('Error');
            } else {
                res.status(200).json(battle);
            }
        });
    })

    .get((req, res) => {
        Battle.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, battle) {
            if (err) {
                console.log('PUT Error: ' + err);
                res.status(500).send('Error');
            } else if (battle) {
                res.status(200).json(battle);
            } else {
                res.status(404).send('Not found');
            }
        });

    });



router.route('/:id')

  /* UPDATE */
  .put((req, res) => {
    Scoring.findById(req.params.id, function (err, scoring) {
      if (err) {
        console.log('PUT Error: ' + err);
        res.status(500).send('Error');
      } else if (scoring) {
        scoring.updatedAt = Date.now();
        scoring.scoring = req.body.scoring;
        scoring.unit = req.body.unit;

        scoring.save(function () {
          pusher.trigger(
            channel,
            'updated', 
            {
              name: 'updated',
              id: scoring._id,
              date: scoring.updatedAt,
              scoring: scoring.scoring,
              unit: scoring.unit,
            }
          );

          res.status(200).json(scoring);
        });
     } else {
        res.status(404).send('Not found');
      }
    });
  })

  /* DELETE */
  .delete((req, res) => {
    Scoring.findById(req.params.id, function (err, scoring) {
      if (err) { 
        console.log('DELETE Error: ' + err);
        res.status(500).send('Error');
      } else if (scoring) {
        scoring.remove(function () {
          pusher.trigger(
            channel,
            'deleted', 
            {
              name: 'deleted',
              id: scoring._id,
              date: scoring.updatedAt ? scoring.updatedAt : scoring.insertedAt,
              scoring: scoring.scoring,
              unit: scoring.unit,
            }
          );

          res.status(200).json(scoring);
        });
     } else {
        res.status(404).send('Not found');
      }
    });
  });

module.exports = router;