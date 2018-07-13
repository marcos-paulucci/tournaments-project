import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class FixtureService {

    async createFixture() {
        try {
            await axios.post(baseApiUrl +  'fixture');
        } catch (error) {
            console.error(error);
        }
    };

    async getFixture() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'fixture');

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

}

let fixtureService = new FixtureService();
export default fixtureService;