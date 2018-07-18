import React from 'react';
import { Link } from 'react-router-dom';

export default class FixtureNavbar extends React.Component {
    render() {
        return (
            <nav className="Nav">
                <div className="Nav__container">
                    <Link className="Nav__link" to="/ManagerTorneos">Volver al manager</Link>

                    <div className="Nav__right" style={{display: 'inline-block'}}>
                        <ul className="Nav__item-wrapper">
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <Link className="Nav__link" to="/competidores">Competidores</Link>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <Link className="Nav__link" to="/jurados">Jurados</Link>
                            </li>
                            <li className="Nav__item" style={{display: 'inline-block', width: '8em'}}>
                                <Link className="Nav__link" to="/batallas">Batallas</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}