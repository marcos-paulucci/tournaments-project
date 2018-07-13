var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var index = require('./src/index');
var api = require('./src/api');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//loki in memory db for quick battle status responses
var loki = require('lokijs');
var lokiDb = new loki('lokiInMemoryDb.db');
var currentBattlesInMemo = lokiDb.getCollection('currentBattles');
if(!currentBattlesInMemo){
    currentBattlesInMemo = lokiDb.addCollection('currentBattles');
}


app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/api', api);


app.use(fileUpload());

mongoose.connect('mongodb://localhost/tournament');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function () {
  app.listen(3000, function () {
    console.log('Node server running on port 3000');
  });
});


