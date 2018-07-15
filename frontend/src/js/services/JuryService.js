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

    async checkJuryName(name) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'checkJuryName', {
                params: {
                    name: name
                }
            });
        } catch (error) {
            console.error(error);
            return 500;
        }
        return response.status;
    };

    async postJuriesNames(juriesNames){
        let response = "";
        try {
            const response = await axios.post('http://localhost:3000/api/juriesNames', juriesNames);
            if (response.status !== 200){
                console.error("Error subiendo nombres de jurados!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
        return response.status;
    };

    async deleteAllJuries(){
        let response = "";
        try {
            const response = await axios.delete('http://localhost:3000/api/juriesNames');
        } catch (err){
            console.log(err);
        }
        return response.status;
    }

}

let juryService = new JuryService();
export default juryService;