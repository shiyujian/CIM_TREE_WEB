/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-09-01 16:58:31
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-09-30 15:46:22
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import Aside from './components/Aside';

export default class CheckworkContainer extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('checkwork', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            AttendanceCount,
            ElectronicFence,
            AttendanceGroup
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={CheckworkContainer.menus}
                        defaultOpenKeys={CheckworkContainer.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    {AttendanceCount && (
                        <Route
                            path='/checkwork/attendancecount'
                            component={AttendanceCount}
                        />
                    )}
                    {ElectronicFence && (
                        <Route
                            path='/checkwork/electronicfence'
                            component={ElectronicFence}
                        />
                    )}
                    {AttendanceGroup && (
                        <Route
                            path='/checkwork/attendancegroup'
                            component={AttendanceGroup}
                        />
                    )}
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'attendancecount',
            id: 'CHECKWORK.ATTENDANCECOUNT',
            path: '/checkwork/attendancecount',
            name: '考勤统计'
        },
        {
            key: 'checkworksetup',
            id: 'CHECKWORK.SETUP',
            name: '考勤设置',
            children: [
                {
                    key: 'electronicfence',
                    id: 'CHECKWORK.ELECTRONICFENCE',
                    path: '/checkwork/electronicfence',
                    name: '电子围栏'
                },
                {
                    key: 'attendancegroup',
                    id: 'CHECKWORK.ATTENDANCEGROUP',
                    path: '/checkwork/attendancegroup',
                    name: '考勤群体'
                }
            ]
        },
       
    ];
    static defaultOpenKeys = ['checkworksetup'];
}
