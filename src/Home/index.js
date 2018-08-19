import React, {Component} from 'react';
import {injectReducer} from '../store';

export default class Home extends Component {
    async componentDidMount () {
        const {default: reducer} = await import('./store');
        const Containers = await import('./containers');
        injectReducer('home', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        console.log('home');
        if (!window.name) {
            window.name = 'test';
            window.location.reload();
        }
        const {Home = null} = this.state || {};
        return (Home && <Home {...this.props} />);
    }
}
