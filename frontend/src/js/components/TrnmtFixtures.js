import React, { Component } from 'react';
import FixtureService from '../services/FixtureService';
import { Link } from 'react-router-dom';

class TrnmtFixtures extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fixtures: [],
            newStyle: '',
            newTop: '',
            newPoints: ''
        };
    }

    async createFixture(ev) {
        ev.preventDefault();
        const self = this;
        if (this.state.newStyle.length === 0 || this.state.newTop <= 0 || this.state.newPoints <= 0 ){
            alert("Debe usar un nombre correcto y numeros validos");
            return;
        }

        try {
            let exists = await FixtureService.checkExistingStyle(this.props.match.params.torneoName, this.state.newStyle);
            if (exists){
                alert("Este torneo ya tiene un fixture con ese estilo.");
                return;
            }

            await FixtureService.createFixture(this.state.newStyle, this.props.match.params.torneoName, this.state.newTop, this.state.newPoints);
            this.setState({
                newStyle: '',
                newTop: '',
                newPoints: ''
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

    fixtureTopChanged(e) {
        this.setState({
            newTop: e.target.value.replace(/\D/g,'')
        });
    }

    fixturePointsChanged(e) {
        this.setState({
            newPoints: e.target.value.replace(/\D/g,'')
        });
    }

    async getFixturesFromServer() {
        let fixturesResponse = await FixtureService.getAllTournamentFixtures(this.props.match.params.torneoName);
        if (!fixturesResponse || fixturesResponse.length === 0)
            return;
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
        await FixtureService.eliminarFixtureById(ev.target.id);
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
                                    <Link className="Nav__link" to={self.props.location.pathname + '/' + fixture.style +  "/jurados"} >Ir al fixture de este estilo</Link>
                                    <button type='button' id={fixture.id} onClick={self.eliminarFixture.bind(self)} >Eliminar este estilo del torneo</button>
                                </li>;
                            })}
                        </div>
                        <div className="fixtureDataSection">
                            <span>Agregar estilo:</span>
                            <input style={{display: 'block'}} placeholder="nombre del estilo" className="fixtureAddName" type="text" name="fixtureAddName" value={this.state.newStyle} onChange={self.fixtureStyleChanged.bind(self)}/>
                            <input style={{display: 'block'}} placeholder="cantidad players top" className="fixtureAddTop" type="text" name="fixtureAddTop" value={this.state.newTop} onChange={self.fixtureTopChanged.bind(self)}/>
                            <input style={{display: 'block'}} placeholder="puntaje jurado" type="text" name="fixtureAddPoints" value={this.state.newPoints} onChange={self.fixturePointsChanged.bind(self)}/>
                        </div>
                        <button type='button' onClick={self.createFixture.bind(self)}>Agregar este estilo al torneo</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TrnmtFixtures
