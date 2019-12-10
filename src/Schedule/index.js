import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';
import {ScheduleMenu} from '_platform/MenuJson';

export default class Schedule extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');

        injectReducer('schedule', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            Stage,
            NodeManage,
            ScheduleDisplay
        } =
            this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={ScheduleMenu}
                        defaultOpenKeys={Schedule.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    {Stage && (
                        <Route
                            exact
                            path='/schedule/stagereport'
                            component={Stage}
                        />
                    )}
                    {NodeManage && (
                        <Route
                            exact
                            path='/schedule/nodemanage'
                            component={NodeManage}
                        />
                    )}
                    {ScheduleDisplay && (
                        <Route
                            exact
                            path='/schedule/scheduledisplay'
                            component={ScheduleDisplay}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static defaultOpenKeys = ['stagereport'];
}
