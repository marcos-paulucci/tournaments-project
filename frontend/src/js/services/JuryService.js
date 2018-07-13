import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class JuryService {

    async getAllJurys() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'juriesNames');

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

}

let juryService = new JuryService();
export default juryService;