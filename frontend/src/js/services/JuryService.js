import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class JuryService {

    async getAllJurys(torneoName, style) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'juriesNames', {
                params: {
                    torneoName: torneoName,
                    style: style
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async checkJuryName(name, style) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'checkJuryName', {
                params: {
                    name,
                    style
                }
            });
        } catch (error) {
            console.error(error);
            return 500;
        }
        return response.status;
    };

    async postJuriesNames(juriesNames, style){
        let response = "";
        try {
            const response = await axios.post(baseApiUrl + 'juriesNames', {
                juriesNames: juriesNames,
                style: style
            });
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
            const response = await axios.delete(baseApiUrl + 'juriesNames');
        } catch (err){
            console.log(err);
        }
        return response.status;
    }

    async setJuriesTournament(juries, tournName, style){
        let response = "";
        try {
            const response = await axios.post(baseApiUrl + 'juriesForTournament', {
                tournName: tournName,
                style: style,
                juriesIds: juries.map(j => j.id)
            });
            if (response.status !== 200){
                console.error("Error seteando jurados al torneo!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
        return response.status;
    }

}

let juryService = new JuryService();
export default juryService;