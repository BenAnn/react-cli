import React, { Component } from 'react';
import Child from './Child';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 666
        }
    }
    handleClick() {
        this.setState({
            name: this.state.name+1
        })
    }
    render() {
        return (
            <div>
                <span className="abc">hello,word</span>
                <Child name={this.state.name} />
                <div onClick={this.handleClick.bind(this)}>
                    点击
                </div>
            </div>
        );
    }
}