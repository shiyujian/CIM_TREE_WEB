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
        const {
            actions: {
                switchDashboardCompoment
            }
        } = this.props;
        switchDashboardCompoment(false);
    }

    render () {
        const {
            dashboardCompomentMenu
        } = this.props;
        console.log('dashboardCompomentMenu', dashboardCompomentMenu);
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
