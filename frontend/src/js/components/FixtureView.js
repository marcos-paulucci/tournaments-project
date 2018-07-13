import React, { Component } from 'react';
import FixtureService from "../services/FixtureService";


class FixtureView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            battles: []
        };
    }


    async componentDidMount() {
        await this.fetchFixture();
    }

    async fetchFixture() {
        let fixtureResponse = await FixtureService.getFixture();
        if (fixtureResponse == null || fixtureResponse.battles == null || fixtureResponse.battles.length == 0 ){
            return;
        }
        let battles = fixtureResponse.battles.map(function(b){ return {p1: b.player1, p2: b.player2};});
        this.setState({
            battles: battles
        });
    }

    async crearFixture(){
        try {
            await FixtureService.createFixture();
            await this.fetchFixture();
        } catch (err) {
            console.log(err);
        }
    }


    render() {
        return(
            <div className="fixtureContainer">
                <button type="button" onClick={this.crearFixture.bind(this)}>Crear fixture!</button>
                <div className="battlesList">
                    {this.state.battles.map(function(battle, index){
                        return <li className="battleLi" key={ index }>
                            <span>Battle # {index}</span>
                            <span>{battle.p1}</span>
                            <span>{battle.p2}</span>
                        </li>;
                    })}
                </div>
            </div>
        )
    }
}

export default FixtureView
