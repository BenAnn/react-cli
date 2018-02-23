require('./App.scss')
import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import asyncComponent from './utils/asyncComponent';
import HomePage from 'components/HomePage'
const FirstPage = asyncComponent(() => import("./components/FirstPage"));

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={HomePage}>

                    </Route>
                    <Route path="/first" component={FirstPage} />
                </Switch>
            </Router>
        )
    }
}