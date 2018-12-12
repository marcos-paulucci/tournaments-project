import React from 'react';
import { Link } from 'react-router-dom';

export default class FixtureNavbar extends React.Component {
    render() {
        const current = window.location.href.substring(window.location.href.lastIndexOf("/") + 1, window.location.href.length );
        return (
            <nav className="Nav">
                <div className="Nav__container">
                    <Link className="Nav__link" to="/torneosManager" style={{marginRight: '0.5em'}}>
                        <img style={{display: 'inline-block', verticalAlign: 'middle', width: '35px', height: '35px'}}  src={require("../../images/arrowBack.png")} />
                        </Link>

                    <div className="Nav__right" style={{color: 'white', display: 'inline-block', width: '80%'}}>
                        <ul className="Nav__item-wrapper" style={{backgroundColor: 'black', width: '100%', textAlign: 'left', paddingLeft: '0' }}>
                            <li className="Nav__item" style={{display: 'inline-block', width: '25%', textAlign: 'center', fontSize: '1.5em', backgroundColor: current === 'competidores' ? '#4CAF50' : 'black' }}>
                                <a style={{color: 'white', textDecoration: 'none'}} href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/competidores"}>Competidores</a>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '25%', textAlign: 'center', fontSize: '1.5em', backgroundColor: current === 'jurados' ? '#4CAF50' : 'black'}}>
                                <a style={{color: 'white', textDecoration: 'none'}} href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/jurados"}>Jurados</a>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '25%', textAlign: 'center', fontSize: '1.5em', backgroundColor: current === 'fixture' ? '#4CAF50' : 'black'}}>
                                <a style={{color: 'white', textDecoration: 'none'}} href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/fixture"}>Batallas</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}