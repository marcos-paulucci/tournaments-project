import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from "axios/index";
import JuryService from "../services/JuryService";
import {baseImagesUri} from "../../config/frontendConfig";
import { ToastContainer, toast } from 'react-toastify';
import {baseApiUrl} from '../../config/frontendConfig';
const juryDefaultImg = "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1515995/1160/772/m1/fpnw/wm0/jury-icon-01-.jpg?1470143664&s=d57a204b6b3f50b9eaa79deb077610ca";

class Checky extends React.Component {
    render() {
        return (<input type="checkbox" disabled="disabled" checked={this.props.checked} />);
    }
}


class Juries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            juries: [],
            existentJuries: [],
            tostifyAlert : false
        };
        this.subirJurados = this.subirJurados.bind(this);
        this.subirFotos = this.subirFotos.bind(this);
        this.validateImagesAndJurys = this.validateImagesAndJurys.bind(this);
        this.getJuriesFromServer = this.getJuriesFromServer.bind(this);

    }

    photosChanged(){
        if (this.state.juries.length > 0 && this.state.juries[0].name !== ""){
            return
        }
        this.loadJuriesByPhoto();
    }

    loadJuriesByPhoto(){
        let newJuriesNames = [];
        for (let i = 0; i < this.uploadInput.files.length; i++){
            newJuriesNames.push({name: this.uploadInput.files[i].name.split(".")[0]});
        }
        this.setState({juries: newJuriesNames});
    }

    validateImagesAndJurys() {
        let allMatched = true;
        let juriesWithoutImage = "Error: Hay jurados sin imagen: ";
        let self = this;
        this.state.juries.forEach(function(p){
            let juryimgfound = false;
            for (let i = 0; i < self.uploadInput.files.length; i++){
                if (self.uploadInput.files[i].name.startsWith(p.name)){
                    juryimgfound = true;
                }
            }
            if (!juryimgfound){
                juriesWithoutImage += "'" + p.name + "' , ";
                allMatched = juryimgfound;
            }
        });
        if (!allMatched){
            juriesWithoutImage = juriesWithoutImage.substring(0, juriesWithoutImage.lastIndexOf(","));
            alert(juriesWithoutImage);
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


    async subirJurados(ev) {
        ev.preventDefault();
        const self = this;
        var files = this.uploadInput.files;
        if (!this.validateImagesAndJurys())
            return;
        this.setState({
            uploading: true
        });
        try {
            await this.subirJurysNames();
            await this.subirFotos(files);

            setTimeout(function(){
                self.setState({
                    tostifyAlert : true
                });
                toast("Jurados subidos exitosamente!");
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
            window.location.reload();
        }
    }

    anadirJurado(e) {
        this.setState({
            juries: this.state.juries.concat([{ name: '' }])
        });
    }
    quitarJurado(e) {
        this.setState({ juries: this.state.juries.slice(0, -1) });
    }

    juryNameChanged(e) {
        let id = e.target.id[e.target.id.length - 1];
        this.setState({ juries: this.state.juries.map((jury, _idx) => {
                if (_idx.toString() !== id.toString()) return jury;
                // this is gonna create a new object, that has the fields from
                // `s`, and `name` set to `newName`
                return { ...jury, name: e.target.value };
            }) });
    }

    async subirJurysNames () {

        this.setState({
            uploading: true
        });
        try {
            const response =  await JuryService.postJuriesNames(this.state.juries, this.props.match.params.style);
            if (!response || response.status !== 200){
                console.error("Error subiendo nombres de jurados!" + response.message);
            } else {

            }
        } catch (err){
            console.log(err);
        }
    }

    async getJuriesFromServer() {
        let juriesResponse = await JuryService.getAllJurys(this.props.match.params.torneoName, this.props.match.params.style);
        let serverJurys = juriesResponse.map(function(j){ return {id: j._id, name: j.name, isJury: j.isJury};}),
            finalJurys = serverJurys.length > 0 ? serverJurys : [];
        this.setState({
            existentJuries: finalJurys
        });
    }

    async componentDidMount() {
        await this.getJuriesFromServer();
    }

    fixJuryBrokenImgSrc(target) {
        target.target.src = juryDefaultImg;
    }

    juryIsjuryChanged(e) {
        e.preventDefault();
        let id = e.target.id;
        let juriesChanged = this.state.existentJuries.map((jury, _idx) => {
            if (jury.id.toString() !== id.toString()) return jury;
            // this is gonna create a new object, that has the fields from
            // `s`, and `name` set to `newName`
            return { ...jury, isJury: !jury.isJury };
        });
        this.setState({ existentJuries: juriesChanged.sort((j1,j2) => j1.name > j2.name)  });
    }

    async selectJuriesTournament(e) {
        try {
            const response =  await JuryService.setJuriesTournament(this.state.existentJuries.filter(j => j.isJury), this.props.match.params.torneoName,this.props.match.params.style);
            if (!response || response.status !== 200){
                console.error("Error estableciendo jurados al fixture!" + response.message);
            } else {
                await this.getJuriesFromServer();
            }
        } catch (err){
            console.log(err);
        }
    }


render() {
        let self = this;
        let displayTostify = this.state.tostifyAlert ? "block" : "none";
        let enableSubirJurados = this.state.existentJuries.length > 0 && this.state.existentJuries.filter(j => j.isJury).length > 0;
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
                    <div className="existentJuries">
                        {this.state.existentJuries.length === 0 ? "No hay jurados en el sistema para este estilo" :
                            <div>
                                Jurados existentes en el sistema. Seleccionar los que seran jueces en este torneo para este deporte
                                {this.state.existentJuries.map(function(jury, index){
                                    return <li className="juryLi" key={ jury.id }>
                                        <span className="juryName" >{jury.name}</span>
                                        <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixJuryBrokenImgSrc}  src={baseImagesUri + jury.name + ".jpg"} />
                                        <div>
                                            <a style={{display: 'inline-block'}} href="#" id={jury.id} onClick={self.juryIsjuryChanged.bind(self)}>Seleccionar para el torneo</a>
                                            <Checky style={{display: 'inline-block'}} checked={jury.isJury} />
                                        </div>

                                    </li>;
                                })}
                                {enableSubirJurados && <input type="button" value="Subir jurados!" onClick={this.selectJuriesTournament.bind(this)} />}
                            </div>}

                    </div>

                        <form className="juriesUploadContainer" onSubmit={this.subirJurados}>
                            <h1>Subir nuevos jurados</h1>
                        Las fotos de los jurados deben tener el nombre que usaran en la aplicacion!
                        <div className="container">
                            <div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.uploadInput = ref; }} className="form-control"  type="file" name="photos" onChange={self.photosChanged.bind(self)} multiple />
                                </div>
                            </div>
                        </div>

                        <div className="juriesDataContainer">
                            <div className="juriesAddList">
                                {this.state.juries.map(function(jury, index){
                                    return <li className="juryLi" key={ index }>
                                        <input className="juryName" disabled='disabled' id={"juryName" + index}  type="text" name="juryName" value={jury.name} onChange={self.juryNameChanged.bind(self)}/>
                                        <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixJuryBrokenImgSrc}  src={baseImagesUri + jury.name + ".jpg"} />
                                    </li>;
                                })}
                            </div>
                            {this.state.juries.length > 0 && <input type="submit" value="Subir jurados al sistema!" />}
                        </div>

                        </form></div>}
            </div>
        )
    }
}

export default Juries
