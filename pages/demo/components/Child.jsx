import React, { Component } from 'react';

export default class Child extends Component {
    constructor(props) {
        super(props)
        this.state = {
            age: 1
        }
    }
    // componentWillReceiveProps(props) {
    //     if(props.name != this.props.name) {
    //         console.log(123123)
    //         this.setState({
    //             age: this.state.age+1
    //         })
    //     }
    // }
    handleClick() {
        this.setState({
            age: this.state.age-1
        })
    }
    render() {
        return (
            <div>
                {this.props.name}
                后面就是age{this.state.age}
                <div onClick={this.handleClick.bind(this)}>点击改变age</div>
            </div>
        );
    }
}