import React, { Component } from 'react';
import axios from 'axios';
import {baseApiUrl} from '../../config/frontendConfig';
import FlexView from 'react-flexview';

class NewPlayers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newP1Name: "",
            newP2Name: ""
        };
        this.handleP1Change = this.handleP1Change.bind(this);
        this.handleP2Change = this.handleP2Change.bind(this);

    }


    async submitNewPlayers(ev) {
        ev.preventDefault();
        if (!this.state.newP1Name.trim() || !this.state.newP2Name.trim()) {
            return
        }
        try {
            const response = await axios.post(baseApiUrl + 'battlePlayers', { p1: this.state.newP1Name, p2: this.state.newP2Name});
            console.log(response);
            alert("Nuevos competidores enviados exitosamente");
        } catch (err) {
            console.log(err);
            alert("Error enviando los nuevos competidores!");
        }
    }

    handleP1Change(e) {
        this.setState({ newP1Name: e.target.value })
    }
    handleP2Change(e) {
        this.setState({ newP2Name: e.target.value })
    }



    render() {
        return(
            <FlexView style={{textAlign: 'center', marginTop: '2em', width: '100%'}}  className="container">
                <form style={{textAlign: 'center', marginTop: '2em', width: '100%'}}>
                    <FlexView style={{fontSize: '1.3em', textAlign: 'center', marginTop: '2em', paddingTop: '3em '}} className="newPlayersContainer">
                        <input style={{ display: 'block', textAlign: 'center', margin: '0.5em'}} className="newP1" placeholder={'Nombre competidor 1'} type="text" onChange={this.handleP1Change} value={this.state.newP1Name} />
                        <input style={{ display: 'block', textAlign: 'center', margin: '0.5em'}} className="newP2" placeholder={'Nombre competidor 2'} type="text" onChange={this.handleP2Change} value={this.state.newP2Name} />
                        <button style={{ display: 'block', textAlign: 'center', margin: '0.5em', border: '1px solid black', background: 'grey', color: 'white'}} type="submit" className="submitNewPlayersButton" onClick={this.submitNewPlayers.bind(this)}>
                            Enviar nuevos jugadores!
                        </button>

                    </FlexView>
                </form>
            </FlexView>


        )
    }
}

export default NewPlayers
