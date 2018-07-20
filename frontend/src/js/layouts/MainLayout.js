import React from "react"
import { Route, Switch } from "react-router-dom"

const MainLayout = props => (
    <div>
        <h1>Main</h1>
        {props.children}
    </div>
);

export default MainLayout;
