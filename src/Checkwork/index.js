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
 * @Last Modified time: 2019-10-21 15:23:40
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import Aside from './components/Aside';
import {CheckWorkMenu} from '_platform/MenuJson';

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
                        menus={CheckWorkMenu}
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

    static defaultOpenKeys = ['checkworksetup'];
}
