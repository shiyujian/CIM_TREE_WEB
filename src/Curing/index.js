/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-07-04 14:32:29
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-08-01 14:38:24
 */
/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-07-04 14:32:11
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-07-04 14:32:11
 */

import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Body } from '_platform/components/layout';
import Aside from './components/Aside';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class Curing extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('curing', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const { TaskCreate, TaskReport, TaskStatis, TaskTeam } = this.state || {};
        return (
            <Body >
                <Aside >
                    <Submenu
                        {...this.props}
                        menus={Curing.menus}
                        defaultOpenKeys={Curing.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    <Switch>
                        {TaskCreate && (
                            <Route
                                path='/curing/taskcreate'
                                component={TaskCreate}
                            />
                        )}
                        {TaskReport && (
                            <Route
                                path='/curing/taskreport'
                                component={TaskReport}
                            />
                        )}
                        {TaskStatis && (
                            <Route
                                path='/curing/taskstatis'
                                component={TaskStatis}
                            />
                        )}
                        {TaskTeam && (
                            <Route
                                path='/curing/taskteam'
                                component={TaskTeam}
                            />
                        )}
                    </Switch>
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'TASKCREATE',
            id: 'CURING.TASKCREATE',
            path: '/curing/taskcreate',
            name: '任务下发',
            icon: <Icon name='line-chart' />
        }, {
            key: 'TASKREPORT',
            id: 'CURING.TASKREPORT',
            path: '/curing/taskreport',
            name: '任务上报',
            icon: <Icon name='file-text-o' />
        }, {
            key: 'TASKSTATIS',
            id: 'CURING.TASKSTATIS',
            path: '/curing/taskstatis',
            name: '任务统计',
            icon: <Icon name='file-text' />
        }, {
            key: 'TASKTEAM',
            id: 'CURING.TASKTEAM',
            path: '/curing/taskteam',
            name: '养护班组',
            icon: <Icon name='users' />
        }
    ];
    static defaultOpenKeys = ['TASKCREATE'];
}
