import React, { Component } from 'react';
import TournamentsService from '../services/TournamentsService';
import { Link } from 'react-router-dom';

class Tournaments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournaments: [],
            newTournament: ''
        };
    }

    async uploadTournament(ev) {
        ev.preventDefault();
        const self = this;
        try {
            let exists = await TournamentsService.checkExistingName(this.state.newTournament);
            if (exists.tournament){
                alert("Ya existe un torneo previo con ese nombre. Elija otro.");
                return;
            }

            await TournamentsService.uploadTournament(this.state.newTournament);
            this.setState({
                newTournament: ''
            });
            await this.getTournamentsFromServer();
        } catch (err){
            console.log(err);
        }
    }


    tournamentNameChanged(e) {
        this.setState({
            newTournament: e.target.value
        });
    }

    async getTournamentsFromServer() {
        let tournamentsResponse = await TournamentsService.getAllTournaments();
        let serverTours = tournamentsResponse.map(function(t){ return {name: t.name};}),
            finalTournaments = serverTours.length > 0 ? serverTours : [];
        this.setState({
            tournaments: finalTournaments
        });
    }

    async componentDidMount() {
        await this.getTournamentsFromServer();
    }

    async eliminarTorneo (ev){
        await TournamentsService.delete();
        //await this.getTournamentsFromServer();
        window.location.reload();
    }


    render() {
        const self = this;
        return(
            <div>
                <div className="tournamentsUploadContainer">
                    Torneos!
                    <div className="tournamentsDataContainer">
                        <div className="tournamentsList">
                            {this.state.tournaments.map(function(tournament, index){
                                return<li className="tournamentLi" key={ index }>
                                    <span style={{marginRight: '1em', fontSize: '2em' , textAlign: 'center'}} className="tournamentName" >{tournament.name}</span>
                                    <Link style={{fontSize: '2em' , textAlign: 'center', border: '1px solid black', borderRadius: '10px', backgroundColor: 'white'}} className="Nav__link" to={"/torneos/" + tournament.name} > Ir a los fixtures fixture de este torneo</Link>
                                </li>;
                            })}
                        </div>
                        <div className="tournamentDataSection" style={{marginTop: '1em', fontSize: '2em' , textAlign: 'center'}}>
                            <span>Agregar torneo:</span>
                            <input className="tournamentAddName" style={{fontSize: '1.1em'}} type="text" name="tournamentAddName" value={this.state.newTournament} onChange={self.tournamentNameChanged.bind(self)}/>
                            <button type='button' style={{fontSize: '1.1em', textAlign: 'center', border: '1px solid black', borderRadius: '10px', backgroundColor: 'white'}}  onClick={self.uploadTournament.bind(self)}>Crear torneo!</button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Tournaments
