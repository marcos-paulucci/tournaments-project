import 'babel-polyfill'
import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './css/style.css'
import {  Switch } from 'react-router-dom'
import AppRoute from './js/AppRoute'
import FixtureLayout from './js/layouts/FixtureLayout'
import NoNavLayout from './js/layouts/NoNavLayout'
import Tournaments from "./js/components/Tournaments";
import TrnmtFixtures from './js/components/TrnmtFixtures'
import BattlePublic from './js/components/BattlePublic'
import JuryScreen from './js/components/JuryScreen'
import FixtureView from './js/components/FixtureView'
import Juries from './js/components/Juries'
import Players from './js/components/Players'
import EditBattle from './js/components/EditBattle'
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
                <div style={{backgroundColor: 'rgb(188, 216, 95)', height: '100%'}}>
                    <Switch>
                        {/*<AppRoute exact path="/" layout={ FixtureLayout } component={ Tournaments } />*/}
                        {/*<AppRoute path="/signin" layout={ FixtureLayout } component={ Tournaments } />*/}
                        <AppRoute exact path="/" layout={ TournamentsLayout } component={ Tournaments } />
                        <AppRoute  path="/torneosManager" layout={ TournamentsLayout } component={ Tournaments } />
                        <AppRoute exact path="/torneos/:torneoName" layout={ TourFixturesLayout } component={ TrnmtFixtures } />
                        <AppRoute  path="/torneos/:torneoName/:style/fixture" layout={ FixtureLayout } component={ FixtureView } />
                        <AppRoute  path="/torneos/:torneoName/:style/jurados" layout={ FixtureLayout } component={ Juries } />
                        <AppRoute  path="/torneos/:torneoName/:style/competidores" layout={ FixtureLayout } component={ Players } />
                        <AppRoute  path="/torneos/:torneoName/:style/battle" layout={ NoNavLayout } component={ BattlePublic } />
                        <AppRoute  path="/torneos/:torneoName/:style/vote" layout={ NoNavLayout } component={ JuryScreen } />
                        <AppRoute  path="/torneos/:torneoName/:style/vote/:juryName" layout={ NoNavLayout } component={ JuryScreen } />
                        <AppRoute  path="/torneos/:torneoName/:style/editBattle/:battleId" layout={ NoNavLayout } component={ EditBattle } />

                    </Switch>
                </div>
            </HashRouter>
    )
};


ReactDOM.render(
    <Root />,
    document.getElementById('root')
);
