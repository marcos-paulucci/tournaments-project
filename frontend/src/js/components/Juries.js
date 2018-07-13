import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from "axios/index";
import JuryService from "../services/JuryService";
import {baseImagesUri} from "../../config/frontendConfig";
import { ToastContainer, toast } from 'react-toastify';
const juryDefaultImg = "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1515995/1160/772/m1/fpnw/wm0/jury-icon-01-.jpg?1470143664&s=d57a204b6b3f50b9eaa79deb077610ca";

class Juries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            juries: [{name: ''}]
        };
        this.subirJurados = this.subirJurados.bind(this);
        this.subirFotos = this.subirFotos.bind(this);
        this.validateImagesAndJurys = this.validateImagesAndJurys.bind(this);
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
            const response = await axios.post('http://localhost:3000/api/upload', data);
        } catch (err){
            console.log(err);
        }
    }

    async subirJurados(ev) {
        ev.preventDefault();
        var files = this.uploadInput.files;
        if (!this.validateImagesAndJurys())
            return;
        this.setState({
            uploading: true
        });
        try {
            await this.subirJurysNames();
            await this.subirFotos(files);
            toast("Jurados subidos exitosamente!");
        } catch (err){
            console.log(err);
        } finally {
            this.setState({
                uploading: false
            });
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
            const response = await axios.post('http://localhost:3000/api/juriesNames', this.state.juries);
            if (response.status !== 200){
                console.error("Error subiendo fotos!" + response.message);
            }
        } catch (err){
            console.log(err);
        }
    }

    async componentDidMount() {
        let juriesResponse = await JuryService.getAllJurys();
        debugger;
        let serverJurys = juriesResponse.map(function(p){ return {name: p.name};}),
            finalJurys = serverJurys.length > 0 ? serverJurys : [{name: ""}];
        this.setState({
            juries: finalJurys
        });
    }

    fixJuryBrokenImgSrc(target) {
        target.target.src = juryDefaultImg;
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
            <form className="juriesUploadContainer" onSubmit={this.subirJurados}>
                Primero subir las fotos de los jurados. El nombre del archivo debe coincidir con el nombre del competidor.
                <div className="container">
                    <div>
                        <div className="form-group">
                            <input ref={(ref) => { this.uploadInput = ref; }} className="form-control"  type="file" name="photos" multiple />
                        </div>
                    </div>
                </div>
                Luego subir las nombres de los jurados. Debe coincidir con el nombre que se uso para su archivo de imagen
                <div className="juriesDataContainer">
                    <button type="button" onClick={this.anadirJurado.bind(this)}>Agregar jurado</button>
                    {this.state.juries.length > 1 && <button type="button" onClick={this.quitarJurado.bind(this)}>Quitar jurado</button>}
                    <div className="juriesAddList">
                        {this.state.juries.map(function(jury, index){
                            return <li className="juryLi" key={ index }>
                                    <input className="juryName" id={"juryName" + index}  type="text" name="juryName" value={jury.name} onChange={self.juryNameChanged.bind(self)}/>
                                <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixJuryBrokenImgSrc}  src={baseImagesUri + jury.name + ".jpg"} />
                                    </li>;
                        })}
                    </div>
                    <input type="submit" value="Subir jurados!" />
                </div>
            </form>
        )
    }
}

export default Juries
