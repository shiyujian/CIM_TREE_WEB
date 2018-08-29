import React, { Component } from 'react';
import Project from './Project/Project';
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
        const {
            dashboardCompomentMenu
        } = this.props;
        return (
            <div >
                {
                    dashboardCompomentMenu === 'geojsonFeature_projectPic'
                        ? (
                            <Project
                                {...this.props}
                                {...this.state}
                            />
                        )
                        : (
                            <OnSite
                                {...this.props}
                                {...this.state}
                            />
                        )

                }
            </div>);
    }
}
