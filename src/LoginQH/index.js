import React, { Component } from 'react';
import { injectReducer } from '../store';

export default class Home extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('login', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const { Login = null } = this.state || {};
        return Login && <Login {...this.props} />;
    }
}
