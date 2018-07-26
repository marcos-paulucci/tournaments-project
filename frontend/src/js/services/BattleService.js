import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class BattleService {

    async setNextBattle(battleId, style, fixtureId) {
        try {
            await axios.post(baseApiUrl +  'currentBattle', {battleId: battleId, style: style, fixtureId: fixtureId});
        } catch (error) {
            console.error(error);
        }
    };

    async getCurrentBattle(style) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'currentBattle', {
                params: {
                    style
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async getBattleById(id) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'battle', {
                params: {
                    id: id
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async updateBattle(id, votes, winner) {
        let response = "";
        try {
            response = await axios.put(baseApiUrl +  'battle', {id, votes, winner});

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

    async closeBattle(battleId, fixtureId) {
        try {
            await axios.post(baseApiUrl +  'closeBattle', {battleId, fixtureId} );
        } catch (error) {
            console.error(error);
        }
    };

}

let battleService = new BattleService();
export default battleService;