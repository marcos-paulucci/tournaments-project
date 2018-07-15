import React, { Component } from 'react';
import FixtureService from "../services/FixtureService";
import BattleService from "../services/BattleService";

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
        let battles = fixtureResponse.battles.map(function(b){ return {isCurrent: b.isCurrent, battleId: b._id ,p1: b.player1, p2: b.player2};});
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


    render() {
        const self = this;
        return(
            <div className="fixtureContainer">
                <button type="button" onClick={this.crearFixture.bind(this)}>Crear fixture!</button>
                {this.state.fixtureId ? <button type="button" onClick={this.borrarFixture.bind(this)}>Borrar fixture</button> : <span></span>}
                <div className="battlesList">
                    {this.state.battles.map(function(battle, index){
                        return <li className="battleLi" key={ index }>
                            <div>Battle # {index + 1}</div>
                            <div>{battle.p1}</div>
                            <div>{battle.p2}</div>
                            <div>{battle.isCurrent ? "Proxima batalla!" : ""}</div>
                            <button type="button" id={battle.battleId} onClick={self.setCurrentBattle.bind(self)}> Proxima batalla!</button>
                        </li>;
                    })}
                </div>
            </div>
        )
    }
}

export default FixtureView
