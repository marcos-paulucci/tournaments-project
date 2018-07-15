import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class PlayersService {

    async getAllPlayers() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'playersNames');

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

}

let playersService = new PlayersService();
export default playersService;