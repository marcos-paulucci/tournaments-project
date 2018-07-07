import {baseApiUrl} from "../../config/properties";
import axios from "axios/index";


class PlayersService {

    async getCurrentBattlePlayers() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'battlePlayers');

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

}

let playersService = new PlayersService();
export default playersService;