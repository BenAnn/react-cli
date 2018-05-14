require('./App.scss')
import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import asyncComponent from './utils/asyncComponent';
import HomePage from '@components/HomePage'
import Testa from './components/Testa'
const FirstPage = asyncComponent(() => import(/* webpackChunkName: "FirstPage" */ "./components/FirstPage"));
const Test = asyncComponent(() => import(/* webpackChunkName: "Test" */ "./components/Test"));

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={HomePage}>

                    </Route>
                    <Route path="/first" component={FirstPage} />
                    <Route path="/test" component={Test} />
                    <Route path="/testa" component={Testa} />
                </Switch>
            </Router>
        )
    }
}