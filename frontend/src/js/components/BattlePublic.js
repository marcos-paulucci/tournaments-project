import React, { Component } from 'react';
import FlexView from 'react-flexview';
import {baseFilesUri} from '../../config/frontendConfig';
import BattleService from '../services/BattleService';
import Background from '../../images/FondoCordoba.jpg';
import AnimatedNumber from 'react-animated-number';
import FixtureService from "../services/FixtureService";
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
        function isEmptyObject(obj) {
            for(let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    return false;
                }
            }
            return true;
        }

        let responseViewBattle = await BattleService.getViewBattle(this.props.match.params.style),
            response = await BattleService.getCurrentBattle(this.props.match.params.style),
            self = this;
        if (!isEmptyObject(responseViewBattle)){
            this.setState({
                battleId: responseViewBattle._id,
                imgPlayer1: baseFilesUri + responseViewBattle.player1 + ".jpg",
                imgPlayer2: baseFilesUri + responseViewBattle.player2 + ".jpg",
                p1Name: responseViewBattle.player1,
                p2Name: responseViewBattle.player2,
                juriesScores: responseViewBattle.juryScores
            });
            return;
        }
        setInterval(async function(){
            await self.updatePointsFromserver();
        }, 4000);
        try {
            this.setState({
                battleId: response._id,
                imgPlayer1: baseFilesUri + response.player1 + ".jpg",
                imgPlayer2: baseFilesUri + response.player2 + ".jpg",
                p1Name: response.player1,
                p2Name: response.player2,
                juriesScores: response.juryScores
            });
        } catch(err){
            console.log(err);
            this.setState = ({
                battleId: -1,
                p1Name: "",
                p2Name: "",
                imgPlayer1: "",
                imgPlayer2: "",
                juriesScores: []
            });
        }


    }

    async updatePointsFromserver() {
        try {
            let battle = await BattleService.getCurBattlePoints(this.state.battleId);
            this.setState({
                juriesScores: battle.juryScores.map(function(score){return {
                    name: score.name,
                    p1: score.p1,
                    p2: score.p2
                };})
            });
        } catch(err){
            this.setState = ({
                battleId: -1,
                p1Name: "",
                p2Name: "",
                imgPlayer1: "",
                imgPlayer2: "",
                juriesScores: []
            });
        }

    }

    fixJuryCompetitorImgSrc(target) {
        target.target.src = playerDefaultImg;
    }

    fixJuryBrokenImgSrc(target) {
        target.target.src = juryDefaultImg;
    }

    render() {
        let totalP1 = this.state.juriesScores.reduce((acum, score2) => {
            return acum + parseInt(score2.p1, 10);
        }, 0),
        totalP2 = this.state.juriesScores.reduce((acum, score2) => {
            return acum + parseInt(score2.p2, 10);
        }, 0),
            juryItemWidth = (95 / this.state.juriesScores.length).toString() + "%";
        let c1 = 'white', c2 = 'white';
        if (totalP1 > totalP2) {
            c1 = 'red';
            c2 = 'blue';
        } else if (totalP1 < totalP2){
            c1 = 'blue';
            c2 = 'red';
        }

        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        totalP1 = pad(totalP1, 2);
        totalP2 = pad(totalP2, 2);

        return (
            <div style={{ fontFamily: 'Wanted', height: '100%', fontSize: '30px', backgroundImage: `linear-gradient(to bottom, rgba(188,216,95,0.1) 0%,rgba(255,255,255,0.2) 100%), url(${Background})` }}>

                <FlexView width="100%" style={{height: '62%', position: 'relative', textAlign: 'center' }}>
                    <FlexView
                        grow={1}
                        hAlignContent='center'
                        style={{display: 'inline-block', textAlign: 'center', height: '100%'}}
                        shrink={false}
                        width="40%">
                        <FlexView style={{textAlign: 'left', height: '80%'}}>
                            <FlexView hAlignContent='center' style={{display: 'inline-block', verticalAlign: 'middle', width: '50%', height: '100%'}}>
                                <img style={{width: '90%', height: '67%', borderRadius: '10px', marginTop: '26%'}} onError={this.fixJuryCompetitorImgSrc}  src={this.state.imgPlayer1} />
                            </FlexView>
                            <FlexView hAlignContent='center' style={{display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', height: '100%'}}>

                                <span style={{display: 'inline-block', fontSize: '9.7em', color: c1 ? c1 : 'white', marginTop: '37%'}}>
                                    <AnimatedNumber
                                        style={{
                                            transition: '3s ease-out',
                                            transitionProperty:
                                                'background-color, color'
                                        }}
                                        frameStyle={perc => (
                                            perc === 100 ? {} : {backgroundColor: 'transparent'}
                                        )}
                                        stepPrecision={0}
                                        value={totalP1}
                                        formatValue={n => n}/>
                                    </span>
                            </FlexView>
                        </FlexView>
                        <FlexView hAlignContent='center' style={{display: 'block', width: '100%', textAlign: 'left', color: 'rgb(188, 216, 95)'}}>
                            <span style={{display: 'inline-block', fontSize: '3em', marginRight: '0.5em'}}> {this.state.p1Name}</span>
                        </FlexView>
                    </FlexView>
                    <FlexView style={{position: 'absolute', left: '40%', top: '0', width: '20%', height: '20%', display: 'inline-block', marginRight: '0.5em'}} hAlignContent='center' style={{display: 'inline-block',  textAlign: 'center'}}>
                        <img style={{width: '150px', height: '150px'}}  src={require("../../images/LogoLigaDOUP.png")} />
                    </FlexView>
                    <FlexView
                        grow={1}
                        hAlignContent='center'
                        style={{display: 'inline-block', textAlign: 'center', height: '100%'}}
                        shrink={false}
                        width="40%">
                        <FlexView style={{textAlign: 'right', height: '80%'}}>
                            <FlexView hAlignContent='center' style={{display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', height: '100%'}}>

                                <span style={{display: 'inline-block', fontSize: '9.7em', color: c2 ? c2 : 'white', marginTop: '37%'}}>
                                    <AnimatedNumber
                                        style={{
                                            transition: '3s ease-out',
                                            transitionProperty:
                                                'background-color, color'
                                        }}
                                        frameStyle={perc => (
                                            perc === 100 ? {} : {backgroundColor: 'transparent'}
                                        )}
                                        stepPrecision={0}
                                        value={totalP2}
                                        formatValue={n => n}/>
                                    </span>
                            </FlexView>
                            <FlexView hAlignContent='center' style={{display: 'inline-block', verticalAlign: 'middle', width: '50%', height: '100%'}}>
                                <img style={{width: '90%', height: '67%', borderRadius: '10px', marginTop: '26%'}} onError={this.fixJuryCompetitorImgSrc}  src={this.state.imgPlayer2} />
                            </FlexView>
                        </FlexView>
                        <FlexView hAlignContent='center' style={{display: 'block', width: '100%', textAlign: 'right', color: 'rgb(188, 216, 95)'}}>
                            <span style={{display: 'inline-block', fontSize: '3em', marginRight: '0.5em'}}> {this.state.p2Name}</span>
                        </FlexView>
                    </FlexView>
                </FlexView>

                <FlexView className="juriesBorderTop" width="99%" style={{borderRadius: '5px', paddingTop: '1em'}}>
                    {this.state.juriesScores.map(jscore =>
                        <FlexView grow={1} hAlignContent='center' style={{width: juryItemWidth, fontSize: '1.55em', display: 'inline-block', textAlign: 'center'}} key={jscore.name}>
                            <div style={{display: 'block'}}>
                                <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                    <img style={{width: '100px', height: '100px', borderRadius: '10px'}} onError={this.fixJuryBrokenImgSrc}  src={baseFilesUri + jscore.name + ".jpg"} />
                                </div>
                                <span style={{color: '#DC9600', fontSize: '1.5em', fontFamily: 'Poplar', display: 'inline-block', verticalAlign: 'middle', paddingLeft: '0.5em'}}>
                                    {jscore.name.toUpperCase()}
                                </span>
                            </div>
                            <div style={{display: 'block', color: 'white'}}>
                                <div style={{display: 'block', paddingLeft: '0.5em'}}>
                                    {this.state.p1Name} : {jscore.p1}
                                </div>
                                <div style={{display: 'block', paddingLeft: '0.5em'}}>
                                    {this.state.p2Name} : {jscore.p2}
                                </div>
                            </div>

                        </FlexView>)}
                </FlexView>

            </div>
        );
    }
}

export default BattlePublic
