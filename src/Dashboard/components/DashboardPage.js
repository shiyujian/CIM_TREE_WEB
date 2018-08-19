import React, { Component } from 'react';
import Project from './Project/Project';
import OnSite from './OnSite/OnSite';
import './index.less';
import {
    Button
} from 'antd';
window.config = window.config || {};

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
                    dashboardCompomentMenu === '工程影像'
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
