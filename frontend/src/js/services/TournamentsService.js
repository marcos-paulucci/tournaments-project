import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class TournamentsService {

    async getAllTournaments() {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'tournaments');

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async uploadTournament(name){
        let response = "";
        try {
            const response = await axios.post(baseApiUrl + 'tournaments', {name});
            if (response.status !== 200){
                console.error("Error subiendo nuevo torneo!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
        return response.status;
    };

    async checkExistingName(name){
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'tournaments', {name});
        } catch (error) {
            console.error(error);
        }
        return response.data;
    };



    async delete(name){
        let response = "";
        try {
            const response = await axios.delete(baseApiUrl + 'tournaments', {
                params: {
                    name
                }
            });
        } catch (err){
            console.log(err);
        }
        return response.status;
    }

}

let tournasService = new TournamentsService();
export default tournasService;