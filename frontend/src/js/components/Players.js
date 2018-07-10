import React, { Component } from 'react';
import FileUpload from './FileUpload';
import axios from "axios/index";
import PlayersService from "../services/PlayersService";


class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [{name: ''}]
        };
    }

    anadirJugador(e) {
        this.setState({
            players: this.state.players.concat([{ name: '' }])
        });
    }
    quitarJugador(e) {
        this.setState({ players: this.state.players.slice(0, -1) });
    }

    playerNameChanged(e) {
        let id = e.target.id[e.target.id.length - 1];
        this.setState({ players: this.state.players.map((player, _idx) => {
                if (_idx.toString() !== id.toString()) return player;
                // this is gonna create a new object, that has the fields from
                // `s`, and `name` set to `newName`
                return { ...player, name: e.target.value };
            }) });
    }

    async subirPlayersNames () {

        this.setState({
            uploading: true
        });
        try {
            debugger;
            const response = await axios.post('http://localhost:3000/api/playersNames', this.state.players);
            if (response.code !== 200){
                debugger;
                console.error("Error subiendo fotos!" + response.message);
            }
        } catch (err){
            console.log(err);
        } finally {
            this.setState({
                uploading: false
            });
        }
    }

    async componentDidMount() {
        let playersResponse = await PlayersService.getAllPlayers();
        debugger;
        this.setState({
            players: playersResponse.map(function(p){ return {name: p.name};})
        });
    }


    render() {
        let self = this;
        return(
            <div className="playersUploadContainer">
                <FileUpload />
                <div className="playersDataContainer">
                    <button onClick={this.anadirJugador.bind(this)}>Agregar jugador</button>
                    {this.state.players.length > 1 && <button onClick={this.quitarJugador.bind(this)}>Quitar jugador</button>}
                    <div className="playersAddList">
                        {this.state.players.map(function(player, index){
                            return <li className="playerLi" key={ index }>
                                    <input className="playerName" id={"playerName" + index}  type="text" name="playerName" value={player.name} onChange={self.playerNameChanged.bind(self)}/>
                                    </li>;
                        })}
                    </div>
                    <button onClick={this.subirPlayersNames.bind(this)}>Guardar nombres</button>
                </div>
            </div>
        )
    }
}

export default Players
