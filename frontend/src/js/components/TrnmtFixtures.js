import React, { Component } from 'react';
import FixtureService from '../services/FixtureService';
import { Link } from 'react-router-dom';

class TrnmtFixtures extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fixtures: [],
            newStyle: ''
        };
    }

    async createFixture(ev) {
        ev.preventDefault();
        const self = this;
        try {
            let exists = await FixtureService.checkExistingStyle(this.props.match.params.torneoName, this.state.newStyle);
            if (exists){
                alert("Este torneo ya tiene un fixture con ese estilo.");
                return;
            }

            await FixtureService.createFixture(this.state.newStyle, this.props.match.params.torneoName);
            this.setState({
                newStyle: ''
            });
            await this.getFixturesFromServer();
        } catch (err){
            console.log(err);
        }
    }


    fixtureStyleChanged(e) {
        this.setState({
            newStyle: e.target.value
        });
    }

    async getFixturesFromServer() {
        let fixturesResponse = await FixtureService.getAllTournamentFixtures(this.props.match.params.torneoName);
        let serverfixtures = fixturesResponse.map(function(f){ return {id: f._id, style: f.style};}),
            finalFixtures = serverfixtures.length > 0 ? serverfixtures : [];
        this.setState({
            fixtures: finalFixtures
        });
    }

    async componentDidMount() {
        await this.getFixturesFromServer();
    }

    async eliminarFixture (ev){
        await FixtureService.delete(ev.target.id);
        //await this.getFixturesFromServer();
        window.location.reload();
    }


    render() {
        const self = this;
        return(
            <div>
                <div className="fixturesUploadContainer">
                    <h1>Torneo: {this.props.match.params.torneoName}</h1>
                    Estilos
                    <div className="fixturesDataContainer">
                        <div className="fixturesList">
                            {this.state.fixtures.map(function(fixture, index){
                                return<li className="fixtureLi" key={ index }>
                                    <span className="fixtureName" >{fixture.style}</span>
                                    <Link className="Nav__link" to={this.props.location.pathname + '/' + fixture.style +  "/juries"} >Ir al fixture de este estilo</Link>
                                    <button type='button' id={fixture.id} onClick={self.eliminarFixture.bind(self)} >Eliminar este estilo del torneo</button>
                                </li>;
                            })}
                        </div>
                        <div className="fixtureDataSection">
                            <span>Agregar estilo:</span>
                            <input className="fixtureAddName" type="text" name="fixtureAddName" value={this.state.newStyle} onChange={self.fixtureStyleChanged.bind(self)}/>
                        </div>
                        <button type='button' onClick={self.createFixture.bind(self)}>Agregar este estilo al torneo</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TrnmtFixtures
