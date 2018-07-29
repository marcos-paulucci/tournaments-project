import React, { Component } from 'react';
import BattleService from '../services/BattleService';
import FixtureService from "../services/FixtureService";
class EditBattle extends Component{

    constructor () {
        super();
        this.state = {
            battleId: -1,
            p1Name: "",
            p2Name: "",
            votes: [],
            winner: ""
        }
    }

    async componentDidMount() {
        try {
            let response = await BattleService.getBattleById(this.props.match.params.battleId);
            this.setState({
                battleId: this.props.match.params.battleId,
                p1Name: response.player1,
                p2Name: response.player2,
                votes: response.juryScores,
                winner: response.winner
            });
        } catch(err){
            console.log(err);
        }
    }

    juryVoteChanged(e) {
        const self = this;
        let id = e.target.id.split("-")[0],
            px =  e.target.id.split("-")[1].toString();
        let votesChanged = this.state.votes.map((vote, _idx) => {
                if (_idx.toString() !== id.toString()) return vote;
                if (px === "p1"){
                    return { ...vote, p1: e.target.value };
                } else {
                    return { ...vote, p2: e.target.value };
                }
            });
        this.setState({ votes: votesChanged });
    }

    winnerChanged(e) {
        this.setState({ winner: e.target.value });
    }



    async subirPuntos() {
        const self = this;
        try {
            const response = await BattleService.updateBattle(this.state.battleId, this.state.votes, this.state.winner);
            alert('guardado exitosamente!');
        } catch (err){
            console.log(err);
        }
    }

    render() {
        const self = this;

        return (
            <div style={{  }}>
                <div style={{fontSize: '2em', display: 'block', width: '100%', textAlign: 'center'}}>
                    <span style={{display: 'block', marginRight: '0.5em'}}> Competidor 1: {this.state.p1Name}</span>
                </div>
                <div style={{fontSize: '2em', display: 'block', width: '100%', textAlign: 'center'}}>
                    <span style={{display: 'block', marginRight: '0.5em'}}> Competidor 2: {this.state.p2Name}</span>
                </div>
                <div className="juriesBorderTop" width="99%" style={{display:'block', borderRadius: '5px', paddingTop: '1em'}}>
                    {this.state.votes.map((jscore, i) =>
                        <div style={{display: 'block', textAlign: 'center'}} key={jscore.name}>
                            <div style={{display: 'block'}}>
                                <span style={{display: 'block', fontSize: '2em'}}>
                                    {jscore.name}
                                </span>
                                <span style={{}}>
                                    Puntaje asignado a {this.state.p1Name}:
                                   <input className="playerName" id={i + "-p1" }  type="text" name="playerName" value={jscore.p1} onChange={self.juryVoteChanged.bind(self)}/>
                                </span>
                                <span style={{}}>
                                    Puntaje asignado a {this.state.p2Name}:
                                    <input className="playerName" id={i + "-p2" }  type="text" name="playerName" value={jscore.p2} onChange={self.juryVoteChanged.bind(self)}/>
                                </span>
                            </div>
                        </div>)}
                </div>
                <span style={{display: 'block', width: '100%', textAlign: 'center'}}>
                    <span style={{display: 'block', fontSize: '1.8em'}}>Ganador:</span>
                    <input className="playerName" type="text" name="playerName" value={this.state.winner} onChange={self.winnerChanged.bind(self)}/>
                </span>
                <div style={{width: '100%', textAlign: 'center' }}>
                    <button style={{display: 'inline-block',  width: '25%', fontSize: '1.5em', border: '1px solid black', borderRadius: '10px' }} type="button" onClick={self.subirPuntos.bind(self)}>Subir puntos de la batalla</button>
                </div>
            </div>
        );
    }
}

export default EditBattle
