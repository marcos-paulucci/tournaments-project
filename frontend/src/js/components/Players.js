import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from "axios/index";
import { ToastContainer, toast } from 'react-toastify';
import {baseImagesUri} from "../../config/frontendConfig";
    import {baseApiUrl} from '../../config/frontendConfig';
import JuryService from "../services/JuryService";
import PlayersService from "../services/PlayersService";
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";

class Checky extends React.Component {
    render() {
        return (<input type="checkbox" disabled="disabled" checked={this.props.checked} />);
    }
}

class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            existentPlayers: [],
            players: [],
            tostifyAlert : false
        };
        this.subirJugadores = this.subirJugadores.bind(this);
        this.subirFotos = this.subirFotos.bind(this);
        this.validateImagesAndPlayers = this.validateImagesAndPlayers.bind(this);
        this.getPlayersFromServer = this.getPlayersFromServer.bind(this);

    }

    photosChanged(){
        if (this.state.players.length > 0 && this.state.players[0].name !== ""){
            return
        }
        this.loadPlayersByPhoto();
    }
    loadPlayersByPhoto(){
        let newPlayersNames = [];
        for (let i = 0; i < this.uploadInput.files.length; i++){
            newPlayersNames.push({name: this.uploadInput.files[i].name.split(".")[0]});
        }
        this.setState({players: newPlayersNames});
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
        const data = new FormData();
        for (let i = 0; i < files.length; i++){
            data.append('photos', files[i]);
        }
        try {
            const response = await axios.post(baseApiUrl + 'upload', data);
        } catch (err){
            console.log(err);
        }
    }

    async subirJugadores(ev) {
        ev.preventDefault();
        const self = this;
        var files = this.uploadInput.files;
        if (!this.validateImagesAndPlayers())
            return;
        this.setState({
            uploading: true
        });
        try {
            await this.subirPlayersNames();
            await this.subirFotos(files);
            setTimeout(function(){
                self.setState({
                    tostifyAlert : true
                });
                toast("Competidores subidos exitosamente!");
                setTimeout(function(){
                    toast.dismiss();
                    self.setState({
                        tostifyAlert : false
                    });
                    window.location.reload();
                }, 3000);
            }, 300);

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
            const response = PlayersService.postPlayersNames(this.state.players, this.props.match.params.style);
            if (response.status !== 200){
                console.error("Error subiendo fotos!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
    }

    async getPlayersFromServer() {
        let playersResponse = await PlayersService.getAllPlayers(this.props.match.params.torneoName, this.props.match.params.style);
        let serverPlayers = playersResponse.map(function(p){ return {id: p._id, name: p.name, plays: p.plays};}),
            finalPlayers = serverPlayers.length > 0 ? serverPlayers : [];
        this.setState({
            existentPlayers: finalPlayers
        });
    }

    async componentDidMount() {
        await this.getPlayersFromServer();
    }

    async eliminarCompetidores (){
        await PlayersService.deleteAllPlayers();
        //await this.getPlayersFromServer();
        window.location.reload();
    }

    fixPlayerBrokenImgSrc(target) {
        target.target.src = playerDefaultImg;
    }

    powerOfTwo(x) {
        return (Math.log(x)/Math.log(2)) % 1 === 0;
    }

    playerPlaysChanged(e) {
        e.preventDefault();
        let id = e.target.id;
        this.setState({ existentPlayers: this.state.existentPlayers.map((p, _idx) => {
                if (p.id.toString() !== id.toString()) return p;
                // this is gonna create a new object, that has the fields from
                // `s`, and `name` set to `newName`
                return { ...p, plays: !p.plays };
            }) });
    }

    async selectPlayersTournament(e) {
        try {
            const response =  await PlayersService.setPlayersTournament(this.state.existentPlayers.filter(p => p.plays), this.props.match.params.torneoName,this.props.match.params.style);
            if (!response || response.status !== 200){
                console.error("Error estableciendo jugadores al fixture!" + response.message);
            } else {
                await this.getPlayersFromServer();
            }
        } catch (err){
            console.log(err);
        }
    }



    render() {
        let self = this;
        let isPowerOfTwo = this.powerOfTwo(this.state.players.length);
        let displayTostify = this.state.tostifyAlert ? "block" : "none";
        let enableSubirCompetidores = this.state.existentPlayers.length > 0 && this.state.existentPlayers.filter(p => p.plays).length > 0;
        return(
            <div>
                <ToastContainer style={{display: displayTostify,fontSize: '2em' ,height: '100%', width: '100%', textAlign: 'center', position: 'absolute', paddingTop: '5em', backgroundColor: '#bcd85f'}} />
                {this.state.uploading ?
            <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', position: 'relative', top: '25%' }}>
                    <ReactLoading type="spin" color="#fff" height={200} width={200} />
                </div>
            </div> :
            <div>
                <div className="existingPlayers">
                    {this.state.existentPlayers.length === 0 ? "No hay competidores en el sistema para este estilo" :
                        <div>
                    Competidores existentes en el sistema. Seleccionar los que participaran en este torneo para este deporte
                    {this.state.existentPlayers.map(function(player, index){
                        return <li className="playerLi" key={ player.id }>
                            <span>{player.name}</span>
                            <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixPlayerBrokenImgSrc}  src={baseImagesUri + player.name + ".jpg"} />

                            <div>
                                <a style={{display: 'inline-block'}} href="#" id={player.id} onClick={self.playerPlaysChanged.bind(self)}>Seleccionar para el torneo</a>
                                <Checky style={{display: 'inline-block'}} checked={player.plays} />
                            </div>

                        </li>;
                    })}
                            <input type="button" value="Subir competidores!" onClick={this.selectPlayersTournament.bind(this)} />
                        </div>}
                </div>

                    <form className="playersUploadContainer" onSubmit={this.subirJugadores}>
                        <h1>Subir nuevos competidores</h1>
                Las fotos de los jurados deben tener el nombre que se mostrara para el mismo en la aplicacion!
                <div className="container">
                    <div>
                        <div className="form-group">
                            <input ref={(ref) => { this.uploadInput = ref; }} className="form-control"  type="file" name="photos" onChange={self.photosChanged.bind(self)} multiple />
                        </div>
                    </div>
                </div>
                <div className="playersDataContainer">
                    <div className="playersAddList">
                        {this.state.players.map(function(player, index){
                            return <li className="playerLi" key={ index }>
                                <span>Player # {index}</span>
                                <input className="playerName" disabled='disabled' id={"playerName" + index}  type="text" name="playerName" value={player.name} onChange={self.playerNameChanged.bind(self)}/>
                                <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixPlayerBrokenImgSrc}  src={baseImagesUri + player.name + ".jpg"} />
                            </li>;
                        })}
                    </div>
                    {isPowerOfTwo ? <input type="submit" value="Subir competidores!" /> : <span>Aun no puedes subir los competidores, deben ser potencia de 2</span>}
                    {this.state.existentPlayers.length > 0 &&  <button type="button" value="Eliminar competidores actuales" onClick={this.eliminarCompetidores.bind(this)} >Eliminar todos los competidores del servidor</button>}
                </div>
            </form></div>}
            </div>
        )
    }
}

export default Players
