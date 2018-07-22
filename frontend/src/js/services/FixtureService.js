import {baseApiUrl} from '../../config/frontendConfig';
import axios from "axios/index";


class FixtureService {

    async createFixture(style, torneoName, top, points) {
        try {
            await axios.post(baseApiUrl +  'tournaments/'+ torneoName + '/' + style, {
                top,
                points
            });
        } catch (error) {
            console.error(error);
        }
    };

    async crearBatallasFixture(fixtureId) {
        try {
            await axios.post(baseApiUrl +  'fixtures/' + fixtureId);
        } catch (error) {
            console.error(error);
        }
    };

    async eliminarBatallasFixture(fixtureId) {
        try {
            await axios.delete(baseApiUrl +  'fixtures/' + fixtureId);
        } catch (error) {
            console.error(error);
        }
    };

    async eliminarFixture(fixtureId) {
        try {
            await axios.delete(baseApiUrl +  'fixtures/' + fixtureId);
        } catch (error) {
            console.error(error);
        }
    };

    async eliminarFixtureById(fixtureId) {
        try {
            await axios.delete(baseApiUrl +  'fixtures', {
                params: {
                    id: fixtureId
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    async getFixture(tourName, style) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'fixtures/' + tourName + '/' + style);

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

    async checkExistingStyle(tournamentName, style){
        let fixtures = await this.getAllTournamentFixtures(tournamentName);
        return fixtures.filter(f => f.style === style).length > 0;

    }

    async getAllTournamentFixtures(tournamentName) {
        let response = "";
        try {
            response = await axios.get(baseApiUrl +  'fixtures', {
                params: {
                    tournamentName: tournamentName
                }
            });

        } catch (error) {
            console.error(error);
        }
        return response.data;
    };

}

let fixtureService = new FixtureService();
export default fixtureService;