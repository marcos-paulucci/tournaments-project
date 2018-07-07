import React from 'react'
import { Route} from 'react-router'
import JuryScreen from './components/JuryScreen'
import BattlePublic from './components/BattlePublic'
import FileUpload from './components/FileUpload'
import NewPlayers from './components/NewPlayers'
import {  BrowserRouter } from 'react-router-dom'
import App from './App'
import { browserHistory} from "react-router";

const routes = (

  <BrowserRouter history={browserHistory} path="/" component={App}>
      <Route path="battleJury/:juryName" component={JuryScreen} />
      <Route path="battle" component={BattlePublic} />
      <Route path="subirFoto" component={FileUpload} />
      <Route path="nuevosCompetidores" component={NewPlayers} />
  </BrowserRouter>
);

export default routes
