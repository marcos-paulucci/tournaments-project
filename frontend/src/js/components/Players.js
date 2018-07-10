import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from "axios/index";
import PlayersService from "../services/PlayersService";


class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            players: [{name: ''}]
        };
        this.subirJugadores = this.subirJugadores.bind(this);
        this.subirFotos = this.subirFotos.bind(this);
        this.validateImagesAndPlayers = this.validateImagesAndPlayers.bind(this);
    }

    validateImagesAndPlayers() {
        let allMatched = true;
        let playersWithoutImage = "Error: Hay competidores sin imagen: ";
        let self = this;
        this.state.players.forEach(function(p){
            let playerimgfound = false;
            for (let i = 0; i < self.uploadInput.files.length; i++){
                if (self.uploadInput.files[i].name.startsWith(p.name)){
                    playerimgfound = true;
                }
            }
            if (!playerimgfound){
                playersWithoutImage += "'" + p.name + "' , ";
                allMatched = playerimgfound;
            }
        });
        if (!allMatched){
            playersWithoutImage = playersWithoutImage.substring(0, playersWithoutImage.lastIndexOf(","));
            alert(playersWithoutImage);
        }
        return allMatched;
    }

    async subirFotos(files) {
        debugger;
        const data = new FormData();
        for (let i = 0; i < files.length; i++){
            data.append('photos', files[i]);
        }
        try {
            const response = await axios.post('http://localhost:3000/api/upload', data);
            debugger;
            let a = response;
        } catch (err){
            console.log(err);
        }
    }

    async subirJugadores(ev) {
        ev.preventDefault();
        debugger;
        var files = this.uploadInput.files;
        if (!this.validateImagesAndPlayers())
            return;
        this.setState({
            uploading: true
        });
        try {
            await this.subirPlayersNames();
            debugger;
            await this.subirFotos(files);
        } catch (err){
            console.log(err);
        } finally {
            this.setState({
                uploading: false
            });
        }
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
            const response = await axios.post('http://localhost:3000/api/playersNames', this.state.players);
            if (response.status !== 200){
                console.error("Error subiendo fotos!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
    }

    async componentDidMount() {
        let playersResponse = await PlayersService.getAllPlayers();
        let serverPlayers = playersResponse.map(function(p){ return {name: p.name};}),
            finalPlayers = serverPlayers.length > 0 ? serverPlayers : [{name: ""}];
        this.setState({
            players: finalPlayers
        });
    }


    render() {
        let self = this;
        return(
            this.state.uploading ?
            <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', position: 'relative', top: '25%' }}>
                    <ReactLoading type="spin" color="#fff" height={200} width={200} />
                </div>
            </div> :
            <form className="playersUploadContainer" onSubmit={this.subirJugadores}>
                Primero subir las fotos de los competidores. El nombre del archivo debe coincidir con el nombre del competidor.
                <div className="container">
                    <div>
                        <div className="form-group">
                            <input ref={(ref) => { this.uploadInput = ref; }} className="form-control"  type="file" name="photos" multiple />
                        </div>
                    </div>
                </div>
                Luego subir las nombres de los competidores. Debe coincidir con el nombre que se uso para su archivo de imagen
                <div className="playersDataContainer">
                    <button type="button" onClick={this.anadirJugador.bind(this)}>Agregar jugador</button>
                    {this.state.players.length > 1 && <button type="button" onClick={this.quitarJugador.bind(this)}>Quitar jugador</button>}
                    <div className="playersAddList">
                        {this.state.players.map(function(player, index){
                            return <li className="playerLi" key={ index }>
                                    <input className="playerName" id={"playerName" + index}  type="text" name="playerName" value={player.name} onChange={self.playerNameChanged.bind(self)}/>
                                    </li>;
                        })}
                    </div>
                    <input type="submit" value="Subir competidores!" />
                </div>
            </form>
        )
    }
}

export default Players
