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
                <div className="fixturesUploadContainer" style={{marginLeft: '1em'}}>
                    <h3 style={{ display: 'block', fontSize: '2em', textAlign: 'center'}}>
                        Torneo: {this.props.match.params.torneoName}
                    </h3>
                    <div className="fixturesDataContainer">
                        <div className="fixturesList">
                            {this.state.fixtures.length > 0 &&  <div style={{fontSize: '1.5em', margin: '1em'}}>
                                Deportes de este torneo
                            </div>}



                            {this.state.fixtures.map(function(fixture, index){
                                return<li className="fixtureLi" key={ index } style={{height: '4em'}}>
                                    <span style={{marginRight: '1em', fontSize: '2em' , display: 'inline-block', verticalAlign: 'middle'}} className="fixtureName" >{fixture.style}</span>
                                    <Link style={{display: 'inline-block', verticalAlign: 'middle', padding: '0.2em', backgroundImage: 'linear-gradient(to right ,transparent, #2E8B57)', fontSize: '2em' , borderRadius: '10px', color: 'black'}} className="Nav__link" to={self.props.location.pathname + '/' + fixture.style +  "/jurados"} >

                                        <div style={{display: 'inline-block', verticalAlign: 'middle'}}>Ir al fixture de este deporte</div>
                                        <img style={{display: 'inline-block', verticalAlign: 'middle', width: '35px', height: '35px'}}  src={require("../../images/arrow-right-solid.svg")} /></Link>
                                    <img id={fixture.id} onClick={self.eliminarFixture.bind(self)} style={{padding: '3px', display: 'inline-block', marginLeft: '0.5em', border: '1px solid black' , borderRadius: '50px', verticalAlign: 'middle', width: '40px', height: '40px'}}  src={require("../../images/delIcon.svg")} />

                                </li>;
                            })}
                        </div>
                        <div className="fixtureDataSection" style={{fontSize: '1.4em'}}>
                            <h4>Agregar deporte</h4>
                            <input style={{display: 'block', marginTop: '0.5em'}} placeholder="nombre del deporte" className="fixtureAddName" type="text" name="fixtureAddName" value={this.state.newStyle} onChange={self.fixtureStyleChanged.bind(self)}/>
                            <input style={{display: 'block', marginTop: '0.5em'}} placeholder="cantidad players top" className="fixtureAddTop" type="text" name="fixtureAddTop" value={this.state.newTop} onChange={self.fixtureTopChanged.bind(self)}/>
                            <input style={{display: 'block', marginTop: '0.5em'}} placeholder="puntaje jurado" type="text" name="fixtureAddPoints" value={this.state.newPoints} onChange={self.fixturePointsChanged.bind(self)}/>
                            <button type='button' style={{marginTop: '1em', fontSize: '1.1em', display: 'block', textAlign: 'center', border: '1px solid black', borderRadius: '10px', backgroundColor: 'white'}} onClick={self.createFixture.bind(self)}>Guardar</button>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default TrnmtFixtures
