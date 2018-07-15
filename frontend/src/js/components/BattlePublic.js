import React, { Component } from 'react';
import FlexView from 'react-flexview';
import Pusher from 'pusher-js'
import {PUSHER_APP_KEY, baseImagesUri} from '../../config/frontendConfig';
import BattleService from '../services/BattleService';
import Background from '../../images/fondoDoup2.jpg';
const juryDefaultImg = "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/1515995/1160/772/m1/fpnw/wm0/jury-icon-01-.jpg?1470143664&s=d57a204b6b3f50b9eaa79deb077610ca";
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";
class BattlePublic extends Component{

    constructor () {
        super();
        let juriesStart = [];
        this.state = {
            battleId: -1,
            p1Name: "",
            p2Name: "",
            imgPlayer1: "",
            imgPlayer2: "",
            juriesScores: juriesStart
        }
    }

    async componentDidMount() {
        let response = await BattleService.getCurrentBattle(),
            self = this;
        this.setState({
            battleId: response._id,
            imgPlayer1: baseImagesUri + response.player1 + ".jpg",
            imgPlayer2: baseImagesUri + response.player2 + ".jpg",
            p1Name: response.player1,
            p2Name: response.player2,
            juriesScores: response.juryScores
        });
        setInterval(async function(){
            await self.updatePointsFromserver();
        }, 5000);
    }

    async updatePointsFromserver() {
        let battle = await BattleService.getCurBattlePoints(this.state.battleId);
        this.setState({
                juriesScores: battle.juryScores.map(function(score){return {
                    name: score.name,
                    p1: score.p1,
                    p2: score.p2
                };})
        });
    }

    fixJuryCompetitorImgSrc(target) {
        target.target.src = playerDefaultImg;
    }

    fixJuryBrokenImgSrc(target) {
        target.target.src = juryDefaultImg;
    }

    render() {
        let totalP1 = this.state.juriesScores.reduce((acum, score2) => {
            return acum + score2.p1;
        }, 0),
        totalP2 = this.state.juriesScores.reduce((acum, score2) => {
            return acum + score2.p2;
        }, 0),
            juryItemWidth = (95 / this.state.juriesScores.length).toString() + "%";
        let c1 = 'grey', c2 = 'grey';
        if (totalP1 > totalP2) {
            c1 = 'red';
            c2 = 'blue';
        } else if (totalP1 < totalP2){
            c1 = 'blue';
            c2 = 'red';
        }

        return (
            <div style={{ height: '100%', fontSize: '30px', backgroundImage: `linear-gradient(to bottom, rgba(188,216,95,0.9) 0%,rgba(255,255,255,0.6) 100%), url(${Background})` }}>

                <FlexView width="100%" style={{height: '50%', position: 'relative', textAlign: 'center' }}>
                    <FlexView
                        grow={1}
                        hAlignContent='center'
                        style={{display: 'inline-block', textAlign: 'center'}}
                        shrink={false}
                        width="35%"
                    >
                        <FlexView hAlignContent='center' style={{display: 'block', textAlign: 'center'}}>
                            <span style={{display: 'inline-block', fontSize: '2em', marginRight: '0.5em'}}> {this.state.p1Name}</span>
                            <span style={{display: 'inline-block', fontSize: '4em', color: c1}}> {totalP1}</span>
                        </FlexView>
                        <FlexView hAlignContent='center' style={{display: 'inline-block'}}>
                            <img style={{width: '80%', height: '80%', borderRadius: '10px'}} onError={this.fixJuryCompetitorImgSrc}  src={this.state.imgPlayer1} />
                        </FlexView>
                    </FlexView>
                    <FlexView style={{position: 'absolute', left: '40%', top: '0', width: '20%', height: '20%', display: 'inline-block', marginRight: '0.5em'}} hAlignContent='center' style={{display: 'inline-block',  textAlign: 'center'}}>
                        <img style={{width: '150px', height: '150px'}}  src={require("../../images/LogoLigaDOUP.png")} />
                    </FlexView>
                    <FlexView
                        grow={1}
                        hAlignContent='center'
                        style={{display: 'inline-block', textAlign: 'center'}}
                        shrink={false}
                        width="35%">
                        <FlexView hAlignContent='center' style={{display: 'block', textAlign: 'center'}}>
                            <span style={{display: 'inline-block', fontSize: '2em', marginRight: '0.5em'}}> {this.state.p2Name}</span>
                            <span style={{display: 'inline-block', fontSize: '4em', color: c2}}> {totalP2}</span>
                        </FlexView>
                        <FlexView hAlignContent='center' style={{display: 'inline-block'}}>
                            <img style={{width: '80%', height: '80%', borderRadius: '10px'}} onError={this.fixJuryCompetitorImgSrc} src={this.state.imgPlayer2} />
                        </FlexView>
                    </FlexView>
                </FlexView>

                <FlexView width="99%" style={{borderRadius: '5px', border: '6px solid grey'}}>
                    <FlexView style={{display: 'block', textAlign: 'center'}}> JURADO </FlexView>
                    {this.state.juriesScores.map(jscore =>
                        <FlexView grow={1} hAlignContent='center' style={{width: juryItemWidth, fontSize: '1.72em', display: 'inline-block', textAlign: 'center'}} key={jscore.name}>
                            <div>
                                {jscore.name}
                            </div>
                            <div>
                                <img style={{width: '150px', height: '150px', borderRadius: '10px'}} onError={this.fixJuryBrokenImgSrc}  src={baseImagesUri + jscore.name + ".jpg"} />
                            </div>
                            <div>
                                {this.state.p1Name} : {jscore.p1}
                            </div>
                            <div>
                                {this.state.p2Name} : {jscore.p2}
                            </div>
                        </FlexView>)}
                </FlexView>

            </div>
        );
    }
}

export default BattlePublic
