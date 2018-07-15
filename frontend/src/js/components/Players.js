import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from "axios/index";
import PlayersService from "../services/PlayersService";
import { ToastContainer, toast } from 'react-toastify';
import {baseImagesUri} from "../../config/frontendConfig";
import JuryService from "../services/JuryService";
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";


class Players extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            players: [{name: ''}],
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
            const response = await axios.post('http://localhost:3000/api/upload', data);
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
            const response = await axios.post('http://localhost:3000/api/playersNames', this.state.players);
            if (response.status !== 200){
                console.error("Error subiendo fotos!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
    }

    async getPlayersFromServer() {
        let playersResponse = await PlayersService.getAllPlayers();
        let serverPlayers = playersResponse.map(function(p){ return {name: p.name};}),
            finalPlayers = serverPlayers.length > 0 ? serverPlayers : [{name: ""}];
        this.setState({
            players: finalPlayers
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



    render() {
        let self = this;
        let isPowerOfTwo = this.powerOfTwo(this.state.players.length);
        let displayTostify = this.state.tostifyAlert ? "block" : "none";
        return(
            <div>
                <ToastContainer style={{display: displayTostify,fontSize: '2em' ,height: '100%', width: '100%', textAlign: 'center', position: 'absolute', paddingTop: '5em', backgroundColor: '#bcd85f'}} />
                {this.state.uploading ?
            <div style={{height: '100%', width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', position: 'relative', top: '25%' }}>
                    <ReactLoading type="spin" color="#fff" height={200} width={200} />
                </div>
            </div> :
            <form className="playersUploadContainer" onSubmit={this.subirJugadores}>
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
                                <input className="playerName" id={"playerName" + index}  type="text" name="playerName" value={player.name} onChange={self.playerNameChanged.bind(self)}/>
                                <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixPlayerBrokenImgSrc}  src={baseImagesUri + player.name + ".jpg"} />
                            </li>;
                        })}
                    </div>
                    {isPowerOfTwo ? <input type="submit" value="Subir competidores!" /> : <span>Aun no puedes subir los competidores, deben ser potencia de 2</span>}
                    <button type="button" value="Eliminar competidores actuales" onClick={this.eliminarCompetidores.bind(this)} >Eliminar todos los competidores del servidor</button>
                </div>
            </form>}
            </div>
        )
    }
}

export default Players
