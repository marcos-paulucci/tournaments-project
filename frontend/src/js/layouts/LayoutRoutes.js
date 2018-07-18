import React from "react"
import { Route, Switch } from "react-router-dom"

const LayoutRoutes = ({ component: Component, layout: Layout, ...rest }) => {
    return (
    <Route {...rest} render={props => (
        <Layout>
            <Component {...props} />
        </Layout>
    )} />
)};

export default LayoutRoutes;