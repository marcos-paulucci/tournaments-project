import React, { Component } from 'react';
import FlexView from 'react-flexview';
import Pusher from 'pusher-js'
import {PUSHER_APP_KEY, baseImagesUri, baseApiUrl, puntosPorBatalla} from '../../config/properties'
import axios from 'axios';
import PlayersService from '../services/PlayersService';
import Background from '../../images/fondoDoup2.jpg';
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";

class JuryScreen extends Component{


    constructor () {
        super()
        this.state = {
            points: [0, 0],
            juryName: "",
            p1Name: "",
            p2Name: "",
            imgPlayer1: "",
            imgPlayer2: ""
        }
    }

    fixJuryCompetitorImgSrc(target) {
        target.target.src = playerDefaultImg;
    }


    componentWillMount() {
        this.pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: 'us2',
            encrypted: true,
        });
        this.channel = this.pusher.subscribe('battle_points');
    }



    async componentDidMount() {
        let location = window.location.href,
            juryName = location.substring(location.lastIndexOf("/") + 1, location.length);
        let response = await PlayersService.getCurrentBattlePlayers(),
            imgPlayer1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEQu7wCXuXxqEXkNkcxFQiApEaaWVi6UGlHRMT4-DExpNvIrJvw",
            imgPlayer2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEQu7wCXuXxqEXkNkcxFQiApEaaWVi6UGlHRMT4-DExpNvIrJvw";
        try {
            imgPlayer1 =  baseImagesUri + response.player1 + ".jpg";
        } catch (err){
            console.log(err);
        }
        try {
            imgPlayer2 = baseImagesUri + response.player2 + ".jpg";
        } catch (err){
            console.log(err);
        }
        this.setState({
            juryName: juryName,
            imgPlayer1: imgPlayer1,
            imgPlayer2: imgPlayer2,
            p1Name: response.player1,
            p2Name: response.player2
        });
        //this.channel.bind('newPoints', this.updateEvents, this);
    }

    componentWillUnmount() {
        this.channel.unbind();

        this.pusher.unsubscribe(this.channel);
    }

    updateEvents(data) {
        // let newArray = this.state.points.slice(0);
        // newArray.unshift(data);

        this.setState({
            points: [data.p1, data.p2],
        });
    }

    async sumarJugador(index){
        let { points, juryName } = this.state;
        if (points[index] === puntosPorBatalla)
            return;
        let currentTotalPoints = points[0] + points[1],
            mustSubstract = (currentTotalPoints === puntosPorBatalla);
        points[index] ++;
        if (mustSubstract){
            let subsIndex = (index === 0 ? 1 : 0);
            points[subsIndex] --;
        }
        try {
            const response = await axios.post(baseApiUrl + 'new', { author: juryName, p1: points[0], p2: points[1] });
            console.log(response);
            this.setState({
                points: points
            })
        } catch (err) {
            console.log(err);
        }
    }

    async sumarJugador1(){
        await this.sumarJugador(0);
    }

    async sumarJugador2(){
        await this.sumarJugador(1);
    }

    render() {
        let imgSrcIcon = "https://s3.amazonaws.com/ionic-marketplace/ion-floating-menu/icon.png";
        let c1 = 'grey', c2 = 'grey';
        if (this.state.points[0] > this.state.points[1]) {
            c1 = 'red';
            c2 = 'blue';
        } else if (this.state.points[0] < this.state.points[1]){
            c1 = 'blue';
            c2 = 'red';
        }
        return (
            <div style={{ backgroundImage: `linear-gradient(to bottom, rgba(188,216,95,0.6) 0%,rgba(255,255,255,0.6) 100%), url(${Background})` }}>
                <FlexView
                    grow={1}
                    height={50}
                    hAlignContent='center'
                    vAlignContent='center'
                    style={{ fontSize: '1.3em', fontWeight: '700', textAlign: 'center'}}
                >
                    Juez {this.state.juryName}
                </FlexView>

                <div>
                    <div style={{ textAlign: 'center', marginBottom: '1em'}}>
                        <span style={{display: 'inline-block', fontSize: '1.5em', marginRight: '0.5em'}}>
                            {this.state.p1Name}
                        </span>
                        <span style={{display: 'inline-block', fontSize: '3em', color: c1}}>
                            {this.state.points[0]}
                        </span>
                        <div>
                            <img style={{borderRadius: '10px', width: '140px', height: '140px'}} onError={this.fixJuryCompetitorImgSrc} src={this.state.imgPlayer1} />
                        </div>
                        <img src={imgSrcIcon} className="sumarJugador1" style={{width: '60px', height: '60px'}} onClick={this.sumarJugador1.bind(this)} />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '1em'}}>
                        <span style={{display: 'inline-block', fontSize: '1.5em', marginRight: '0.5em'}}>
                            {this.state.p2Name}
                        </span>
                        <span style={{display: 'inline-block', fontSize: '3em', color: c2}}>
                            {this.state.points[1]}
                        </span>
                        <div>
                            <img style={{borderRadius: '10px', width: '140px', height: '140px'}} onError={this.fixJuryCompetitorImgSrc} src={this.state.imgPlayer2} />
                        </div>
                        <img src={imgSrcIcon} className="sumarJugador2" style={{width: '60px', height: '60px'}}  onClick={this.sumarJugador2.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default JuryScreen
