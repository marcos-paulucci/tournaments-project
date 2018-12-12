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
                    <h3 style={{ display: 'block', textAlign: 'center', fontSize: '2em'}}>
                        Admin de torneos
                    </h3>
                    <div className="tournamentsDataContainer">
                        {this.state.tournaments.length > 0 &&<div style={{fontSize: '1.5em', margin: '1em'}}>
                            Torneos existentes
                        </div>}

                        <div className="tournamentsList">
                            {this.state.tournaments.map(function(tournament, index){
                                return<li className="tournamentLi" key={ index } style={{height: '4em'}}>
                                    <span style={{marginRight: '1em', fontSize: '2em' , textAlign: 'center'}} className="tournamentName" >{tournament.name}</span>
                                    <Link style={{padding: '0.2em', backgroundImage: 'linear-gradient(to right ,transparent, #2E8B57)', fontSize: '2em' , textAlign: 'center', borderRadius: '10px', color: 'black'}} className="Nav__link" to={"/torneos/" + tournament.name} >

                                        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>Ir a los fixtures fixture de este torneo</div>
                                        <img style={{display: 'inline-block', verticalAlign: 'middle', width: '35px', height: '35px'}}  src={require("../../images/arrow-right-solid.svg")} /></Link>
                                </li>;
                            })}
                        </div>'
                        <div className="tournamentDataSection" style={{margin: '1em', marginTop: '1em'}}>
                            <div style={{fontSize: '1.5em'}}>
                                Nuevo torneo
                            </div>
                            <input className="tournamentAddName" placeholder="nombre del torneo" style={{margin: '0.5em 0', fontSize: '1.1em', display: 'block'}} type="text" name="tournamentAddName" value={this.state.newTournament} onChange={self.tournamentNameChanged.bind(self)}/>
                            <button type='button' style={{fontSize: '1.1em', display: 'block', textAlign: 'center', border: '1px solid black', borderRadius: '10px', backgroundColor: 'white'}}  onClick={self.uploadTournament.bind(self)}>Crear torneo</button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Tournaments
