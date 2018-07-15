var Player  = require('./models/player');
const imagesPath = 'public/uploads/';
var fs = require('fs');

class PlayersService {

    async deletePlayer(id){

    };

    async deleteAllPlayers(callback){
        await Player.find({}, function(err, p) {
            p.forEach(function(j) {
                var target_path = imagesPath + p.name + ".jpg";
                fs.unlinkSync(target_path);
            });
        });
        await Player.remove({}, function(){
            callback();
        });
    };

}

let playersService = new PlayersService();
module.exports = playersService;