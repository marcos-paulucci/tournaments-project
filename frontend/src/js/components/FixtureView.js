import React, { Component } from 'react';
import FixtureService from "../services/FixtureService";
import BattleService from "../services/BattleService";
import {getLevel, getLevelsRange} from "../services/fixtureUtilities";
import {baseFilesUri} from "../../config/frontendConfig";
import { Link } from 'react-router-dom';
const playerDefaultImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrvl6Xc4xHqKSt9zIBl768acXKMdXSI8XNsD_8VDkAXDXy3sPNmg";
class FixtureView extends Component {

    initialState(){
        this.setState({
            fixtureId: null,
            style: "",
            battles: [],
            puntosPorBatalla: 0,
            numberJuries: 0
        });
    }
    constructor(props) {
        super(props);
        this.initialState = this.initialState.bind(this);

        this.prepareFixtureForView = this.prepareFixtureForView.bind(this);

        this.state = {
            style: "",
            battles: [],
            puntosPorBatalla: 0,
            numberJuries: 0
        };
    }


    async componentDidMount() {
        await this.fetchFixture();
    }

    async fetchFixture() {
        let fixtureResponse = await FixtureService.getFixture(this.props.match.params.torneoName, this.props.match.params.style);
        this.setState({
            fixtureId: fixtureResponse.id,
            style: fixtureResponse.style,
            puntosPorBatalla: fixtureResponse.points

        });
        if (fixtureResponse.battles.length === 0 ){
            return;
        }

        let battles = fixtureResponse.battles.map(function(b){ return {idForFixture: b.idForFixture ,winner: b.winner, isCurrent: b.isCurrent, battleId: b._id ,p1: b.player1, p2: b.player2};});
        this.setState({
            battles: battles
        });
    }

    // shouldComponentUpdate(nextState) {
    //     return this.state.fixtureId !== nextState.fixtureId;
    // }

    async crearBatallasFixture(){
        try {
            await FixtureService.crearBatallasFixture(this.state.fixtureId);
            await this.fetchFixture();
        } catch (err) {
            console.log(err);
        }
    }

    async borrarFixture (){
        const self = this;
        try {
            await FixtureService.eliminarBatallasFixture(this.state.fixtureId);
            await self.fetchFixture();

        } catch (err) {
            console.log(err);
        }
    }

    async setCurrentBattle(e) {
        let battleId = e.target.id;
        try {
            await BattleService.setNextBattle(battleId, this.props.match.params.style, this.state.fixtureId);
            await this.fetchFixture();
        } catch (err){
            console.log(err);
        }
    }

    async closeBattle(e) {
        let battleId = e.target.id.split(".")[0];
        try {
            await BattleService.closeBattle(battleId, this.state.fixtureId);
            await this.fetchFixture();
        } catch (err){
            console.log(err);
        }
    }

    prepareFixtureForView(){

        if (this.state.battles.length === 0){
            return [];
        }

        let levels = getLevelsRange(this.state.battles.length + 1),
            fixtureSerialized = [],
            battlesByLevel = [],
            totalPlayers = this.state.battles.length + 1;
        for (let i = 0; i < this.state.battles.length; i++){
            let batLevel = getLevel(this.state.battles[i].idForFixture, totalPlayers / 2);
            if (!battlesByLevel[batLevel]){
                battlesByLevel[batLevel] = [];
            }
            battlesByLevel[batLevel].push(this.state.battles[i]);
        }

        for (let level in battlesByLevel) {
            if (battlesByLevel.hasOwnProperty(level)) {
                fixtureSerialized.push({
                    level: level,
                    levelName: levels[level],
                    battles: battlesByLevel[level]
                });
            }
        }
        return fixtureSerialized.sort(
            function(l1, l2){
                return l1.level >  l2.level;
            });
    }

    fixPlayerBrokenImgSrc(target) {
        target.target.src = playerDefaultImg;
    }

    async exportBattles() {
        let fileName = await FixtureService.getExport(this.props.match.params.torneoName, this.props.match.params.style);
        debugger;
        window.open("http://localhost:3005/uploads/" + fileName.data, '_blank');
    }


    render() {

        const self = this;
        let serialized = this.prepareFixtureForView();
        return(
            <div className="fixtureContainer" style={{width: '100%', textAlign: 'center'}}>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <button style={{fontSize: '2em'}} type="button" onClick={this.crearBatallasFixture.bind(this)}>Crear/Recrear fixture!</button>
                </div>

                <div className="battlesList" style={{width: '100%', textAlign: 'center', padding: '1em'}}>
                    {serialized.map(function(lvl, index){
                        return <div className="fixtureLevel" style={{borderRadius: '20px', border: '2px solid black', display: 'block',  width: '100%', textAlign: 'center' }} key={ index + 'lvl.level'}>
                            <div style={{fontSize: '2em' }}>{lvl.levelName}</div>
                            <ul>
                            {lvl.battles.map(function(battle, index){
                                return <li className="battleLi" style={{width: '100%', height: '10em', textAlign: 'left', borderBottom: '1px solid black' }} key={ index }>
                                    <div style={{width: '80%', margin: 'auto' }}>
                                        <div style={{float: 'left', width: '60%' }}>
                                            <div>Battle # {battle.idForFixture}</div>
                                            <div>Competidor 1: {battle.p1}</div>
                                            <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixPlayerBrokenImgSrc}  src={baseFilesUri + battle.p1 + ".jpg"} />
                                            <div>Competidor 2: {battle.p2}</div>
                                            <img style={{width: '40px', height: '40px', borderRadius: '10px'}} onError={self.fixPlayerBrokenImgSrc}  src={baseFilesUri + battle.p2 + ".jpg"} />
                                            {battle.winner !== "" ? <div> Ganador: {battle.winner} </div> : ""}
                                        </div>

                                        <div className="battleFixtureButtonCont" style={{float: 'right', width: '30%' }}>
                                            {battle.isCurrent ? <div><div style={{fontSize: '1.2em' }}>Esta es la proxima batalla!</div>
                                                <button style={{fontSize: '1.2em' }} type="button" id={battle.battleId + '.Close'} onClick={self.closeBattle.bind(self)}> Terminar batalla</button></div>  : ""}
                                            {battle.winner === "" && battle.p1 !== "" && battle.p2 !== ""  && (!battle.isCurrent)? <button type="button" style={{fontSize: '1.2em' }} id={battle.battleId} onClick={self.setCurrentBattle.bind(self)}> Marcar como proxima batalla!</button> : ""}
                                        </div>
                                    </div>
                                </li>;
                            })}
                            </ul>
                        </div>;
                    })}
                </div>
                <div style={{width: '100%', textAlign: 'center' }}>
                    <button style={{display: 'inline-block',  width: '25%', fontSize: '1.5em', border: '1px solid black', borderRadius: '10px' }} type="button" onClick={self.exportBattles.bind(self)}>Exportar batallas de este torneo</button>
                </div>

            </div>
        )
    }
}

export default FixtureView
