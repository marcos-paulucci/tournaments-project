import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class BattleService {

    async setNextBattle(battleId) {
        try {
            await axios.post(baseApiUrl +  'currentBattle', {battleId: battleId});
        } catch (error) {
            console.error(error);
        }
    };

    async getCurrentBattle() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'currentBattle');

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async sendCurBattleJuryPoints(battleId, juryName, p1, p2) {
        try {
            await axios.post(baseApiUrl +  'currentBattlePoints', {battleId, juryName, p1, p2  });
        } catch (error) {
            console.error(error);
        }
    };

    async getCurBattlePoints(battleId) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'currentBattlePoints', {
                params: {
                    id: battleId
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

}

let battleService = new BattleService();
export default battleService;