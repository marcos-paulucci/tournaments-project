import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class PlayersService {

    async postPlayersNames(names, style){
        let response = "";
        try {
            const response = await axios.post(baseApiUrl + 'playersNames', {
                names: names,
                style: style
            });
            if (response.status !== 200){
                console.error("Error subiendo jugadores al sistema!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
        return response.status;
    };

    async getAllPlayers(tournamentName, style) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'playersNames', {
                params: {
                    tourName: tournamentName,
                    style: style
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async deleteAllPlayers() {
        let response = "";
        try {
            response = await axios.delete(baseApiUrl +  'playersNames');

        } catch (err){
            console.log(err);
        }
        return response.status;
    };

    async setPlayersTournament(playersIds, torneoName, style){
        let response = "";
        try {
            const response = await axios.post(baseApiUrl + 'playersForTournament', {
                tournName: torneoName,
                style: style,
                playersIds: playersIds.map(p => p.id)
            });
            if (response.status !== 200){
                console.error("Error seteando jugadores al torneo!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
        return response.status;
    };


}

let playersService = new PlayersService();
export default playersService;