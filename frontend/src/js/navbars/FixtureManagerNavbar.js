import React from 'react';
import { Link } from 'react-router';

export default class FixtureManagerNavbar extends React.Component {
    render() {
        return (
            <nav className="Nav">
                <div className="Nav__container">
                    <Link className="Nav__link" to="/ManagerTorneos">Volver al tournament manager</Link>
                </div>
            </nav>
        );
    }
}