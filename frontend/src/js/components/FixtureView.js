import React, { Component } from 'react';
import FixtureService from "../services/FixtureService";
import BattleService from "../services/BattleService";
import {getLevel, getLevelsRange} from "../services/fixtureUtilities";

class FixtureView extends Component {

    initialState(){
        this.setState({
            fixtureId: null,
            style: "",
            battles: []
        });
    }
    constructor(props) {
        super(props);
        this.initialState = this.initialState.bind(this);

        this.prepareFixtureForView = this.prepareFixtureForView.bind(this);

        this.state = {
            fixtureId: null,
            style: "",
            battles: []
        };
    }


    async componentDidMount() {
        await this.fetchFixture();
    }

    async fetchFixture() {
        let fixtureResponse = await FixtureService.getFixture();
        if (fixtureResponse == null || fixtureResponse.battles == null || fixtureResponse.battles.length == 0 ){
            this.initialState();
            return;
        }

        let battles = fixtureResponse.battles.map(function(b){ return {idForFixture: b.idForFixture ,winner: b.winner, isCurrent: b.isCurrent, battleId: b._id ,p1: b.player1, p2: b.player2};});
        this.setState({
            fixtureId: fixtureResponse.id,
            style: fixtureResponse.style,
            battles: battles
        });
    }

    // shouldComponentUpdate(nextState) {
    //     return this.state.fixtureId !== nextState.fixtureId;
    // }

    async crearFixture(){
        try {
            await FixtureService.createFixture();
            await this.fetchFixture();
        } catch (err) {
            console.log(err);
        }
    }

    async borrarFixture (){
        const self = this;
        try {
            await FixtureService.eliminarFixture(this.state.fixtureId);
            await self.fetchFixture();

        } catch (err) {
            console.log(err);
        }
    }

    async setCurrentBattle(e) {
        let battleId = e.target.id;
        try {
            await BattleService.setNextBattle(battleId);
            await this.fetchFixture();
        } catch (err){
            console.log(err);
        }
    }

    async closeBattle(e) {
        let battleId = e.target.id.split(".")[0];
        try {
            await BattleService.closeBattle(battleId);
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




    render() {

        const self = this;
        let serialized = this.prepareFixtureForView();
        return(
            <div className="fixtureContainer" style={{width: '100%', textAlign: 'center'}}>
                <div style={{width: '100%', textAlign: 'center'}}>
                    {!this.state.fixtureId ? <button style={{fontSize: '2em'}} type="button" onClick={this.crearFixture.bind(this)}>Crear fixture!</button> : <span></span>}
                    {this.state.fixtureId ? <button style={{fontSize: '2em'}} type="button" onClick={this.borrarFixture.bind(this)}>Borrar fixture</button> : <span></span>}
                </div>

                <div className="battlesList" style={{width: '100%', textAlign: 'center', padding: '1em'}}>
                    {serialized.map(function(lvl, index){
                        return <div className="fixtureLevel" style={{borderRadius: '20px', border: '2px solid black', display: 'block',  width: '100%', textAlign: 'center' }} key={ index + 'lvl.level'}>
                            <div style={{fontSize: '2em' }}>{lvl.levelName}</div>
                            <ul>
                            {lvl.battles.map(function(battle, index){
                                return <li className="battleLi" style={{width: '100%', height: '7em', textAlign: 'left', borderBottom: '1px solid black' }} key={ index }>
                                    <div style={{width: '80%', margin: 'auto' }}>
                                        <div style={{float: 'left', width: '60%' }}>
                                            <div>Battle # {battle.idForFixture}</div>
                                            <div>Competidor 1: {battle.p1}</div>
                                            <div>Competidor 2: {battle.p2}</div>
                                            {battle.winner !== "" ? <div> Ganador: {battle.winner} </div> : ""}
                                        </div>

                                        <div class="battleFixtureButtonCont" style={{float: 'right', width: '30%' }}>
                                            {battle.isCurrent ? <div><div style={{fontSize: '1.2em' }}>Esta es la proxima batalla!</div>
                                                <button style={{fontSize: '1.2em' }} type="button" id={battle.battleId + '.Close'} onClick={self.closeBattle.bind(self)}> Terminar batalla</button></div>  : ""}
                                            {battle.winner === "" && battle.p1 !== "" ? <button type="button" style={{fontSize: '1.2em' }} id={battle.battleId} onClick={self.setCurrentBattle.bind(self)}> Marcar como proxima batalla!</button> : ""}
                                        </div>
                                    </div>
                                </li>;
                            })}
                            </ul>
                        </div>;
                    })}
                </div>
            </div>
        )
    }
}

export default FixtureView
