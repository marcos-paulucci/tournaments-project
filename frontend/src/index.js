import 'babel-polyfill'
import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './css/style.css'
import {  Switch } from 'react-router-dom'
import AppRoute from './js/AppRoute'
import FixtureLayout from './js/layouts/FixtureLayout'
import Tournaments from "./js/components/Tournaments";
import TrnmtFixtures from './js/components/TrnmtFixtures'
import FixtureView from './js/components/FixtureView'
import Juries from './js/components/Juries'
import Players from './js/components/Players'
import TournamentsLayout from "./js/layouts/TournamentsLayout";
import TourFixturesLayout from "./js/layouts/TourFixturesLayout";
import {
    HashRouter,
    Route,
    Link
} from 'react-router-dom';


const Root = ({ store: store }) => {
    return(
            <HashRouter>
                <div>
                    <Switch>
                        {/*<AppRoute exact path="/" layout={ FixtureLayout } component={ Tournaments } />*/}
                        {/*<AppRoute path="/signin" layout={ FixtureLayout } component={ Tournaments } />*/}

                        <AppRoute  path="/tourManager" layout={ TournamentsLayout } component={ Tournaments } />
                        <AppRoute  path="/torneos/:torneoName" layout={ TourFixturesLayout } component={ TrnmtFixtures } />
                        <AppRoute  path="/torneos/:torneoName/:style/fixture" layout={ FixtureLayout } component={ FixtureView } />
                        <AppRoute  path="/torneos/:torneoName/:style/jurados" layout={ FixtureLayout } component={ Juries } />
                        <AppRoute  path="/torneos/:torneoName/:style/competidores" layout={ FixtureLayout } component={ Players } />


                    </Switch>
                </div>
            </HashRouter>
    )
};


ReactDOM.render(
    <Root />,
    document.getElementById('root')
);
