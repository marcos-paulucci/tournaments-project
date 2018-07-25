import React, { Component } from 'react';
import FlexView from 'react-flexview';
import {baseFilesUri, baseApiUrl} from '../../config/frontendConfig'
import axios from 'axios';
import PlayersService from '../services/PlayersService';
import FixtureService from '../services/FixtureService';
import JuryService from '../services/JuryService';
import BattleService from '../services/BattleService';
import Background from '../../images/fondoDoup2.jpg';
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";

class JuryScreen extends Component{


    constructor () {
        super();
        this.state = {
            battleId: -1,
            points: [0, 0],
            juryName: "",
            p1Name: "",
            p2Name: "",
            imgPlayer1: "",
            imgPlayer2: "",
            juryNameValid: true,
            puntosPorBatalla: 0,
            existentJuries: []
        }
    }

    fixJuryCompetitorImgSrc(target) {
        target.target.src = playerDefaultImg;
    }

    async getJuriesFromServer() {
        let juriesResponse = await JuryService.getAllJurys(this.props.match.params.torneoName, this.props.match.params.style);
        let serverJurys = juriesResponse.filter(function(j){ return j.isJury}).map(function(j){ return {id: j._id, name: j.name, isJury: j.isJury};}),
            finalJurys = serverJurys.length > 0 ? serverJurys : [];
        this.setState({
            existentJuries: finalJurys
        });
    }

    async componentDidMount() {
        let location = window.location.href,
            juryName = location.substring(location.lastIndexOf("/") + 1, location.length);
        let isJuryNameValid = await JuryService.checkJuryName(juryName, this.props.match.params.style);
        if (isJuryNameValid !== 200) {
            this.setState({
                juryNameValid: false
            });
            this.getJuriesFromServer();
            return;
        }
        let fixtureResponse = await FixtureService.getFixture(this.props.match.params.torneoName, this.props.match.params.style);
        let response = await BattleService.getCurrentBattle(this.props.match.params.style),
            imgPlayer1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEQu7wCXuXxqEXkNkcxFQiApEaaWVi6UGlHRMT4-DExpNvIrJvw",
            imgPlayer2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEQu7wCXuXxqEXkNkcxFQiApEaaWVi6UGlHRMT4-DExpNvIrJvw";
        try {
            imgPlayer1 =  baseFilesUri + response.player1 + ".jpg";
        } catch (err){
            console.log(err);
        }
        try {
            imgPlayer2 = baseFilesUri + response.player2 + ".jpg";
        } catch (err){
            console.log(err);
        }
        this.setState({
            battleId: response._id,
            juryName: juryName,
            imgPlayer1: imgPlayer1,
            imgPlayer2: imgPlayer2,
            p1Name: response.player1,
            p2Name: response.player2,
            puntosPorBatalla: fixtureResponse.points
        });
        let battleSavedPoints = await BattleService.getCurBattlePoints(this.state.battleId);

        const self = this,
            myscore = battleSavedPoints.juryScores.filter(function(score){
            return score.name === self.state.juryName
        });
        if (myscore && myscore.length > 0){
            this.setState({
                points: [myscore[0].p1, myscore[0].p2]
            });
        }
    }


    async sendPointsToServer(){
        let { battleId, points, juryName } = this.state;
        alert("Puntos enviados!");
        await BattleService.sendCurBattleJuryPoints(battleId, juryName, points[0], points[1]);

    }

    sumarJugador(index){
        let { points, juryName } = this.state;
        if (points[index] === this.state.puntosPorBatalla)
            return;
        let currentTotalPoints = points[0] + points[1],
            mustSubstract = (currentTotalPoints === this.state.puntosPorBatalla);
        points[index] ++;
        if (mustSubstract){
            let subsIndex = (index === 0 ? 1 : 0);
            points[subsIndex] --;
        }
        this.setState({
            points: points
        });
    }

    sumarJugador1(){
        this.sumarJugador(0);
    }

    sumarJugador2(){
        this.sumarJugador(1);
    }

    selectedJuryName(e){
        window.location.href = window.location.href + "/" + e.target.value;
        window.location.reload();
    }

    render() {
        let imgSrcIcon = "https://s3.amazonaws.com/ionic-marketplace/ion-floating-menu/icon.png";
        let c1 = 'grey', c2 = 'grey',
            enableSubmitButton = this.state.points[0] + this.state.points[1] === this.state.puntosPorBatalla;
        if (this.state.points[0] > this.state.points[1]) {
            c1 = 'red';
            c2 = 'blue';
        } else if (this.state.points[0] < this.state.points[1]){
            c1 = 'blue';
            c2 = 'red';
        }
        return (

            <div style={{ backgroundImage: `linear-gradient(to bottom, rgba(188,216,95,0.6) 0%,rgba(255,255,255,0.6) 100%), url(${Background})` }}>


                { !this.state.juryNameValid ? <select style={{ fontSize: '1.3em', fontWeight: '700', textAlign: 'center', width: '60%'}} name="selectJuryName" value="" onChange={this.selectedJuryName.bind(this)}>
                        <option key="" selected="selected" value="">Seleccione su nombre de jurado!</option>
                        {this.state.existentJuries.map(ejn =>
                            <option key={ejn.id} value={ejn.name}>{ejn.name}</option>
                        )};
                    </select> :
                    <div>
                        <FlexView
                            grow={1}
                            height={50}
                            hAlignContent='center'
                            vAlignContent='center'
                            style={{ fontSize: '1.3em', fontWeight: '700', textAlign: 'center'}}
                        >
                            Juez {this.state.juryName}
                        </FlexView>
                        {this.state.juryNameValid &&
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
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <button disabled={enableSubmitButton ? "" : "disabled"} style={{borderRadius: '10px', width: '60%', fontSize: '2em'}} type="button" onClick={this.sendPointsToServer.bind(this)}> Enviar puntos!</button>
                            </div>
                        </div>}
                    </div>    }
            </div>
        );
    }
}

export default JuryScreen
