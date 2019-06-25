import React, { Component } from 'react';
import OnSite from './OnSite/OnSite';

export default class DashboardPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount () {
    }

    render () {
        return (
            <div >
                <OnSite
                    {...this.props}
                    {...this.state}
                />
            </div>);
    }
}
