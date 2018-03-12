import React, { Component } from 'react';
import Loadable from 'react-loadable';
import {Loading} from './Loading';

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: "Cs" */ './Cs'),
  loading: Loading,
})

export default class Test extends Component {
    render() {
        return <LoadableComponent />
    }
}