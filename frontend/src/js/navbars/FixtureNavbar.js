import React from 'react';
import { Link } from 'react-router-dom';

export default class FixtureNavbar extends React.Component {
    render() {
        return (
            <nav className="Nav">
                <div className="Nav__container">
                    <Link className="Nav__link" to="/torneosManager">Volver al manager</Link>

                    <div className="Nav__right" style={{display: 'inline-block'}}>
                        <ul className="Nav__item-wrapper">
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <a href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/competidores"}>Competidores</a>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <a href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/jurados"}>Jurados</a>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <a href={window.location.href.substring(0, window.location.href.lastIndexOf("/")) + "/fixture"}>Batallas</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}