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
 * @Last Modified time: 2018-07-06 09:40:01
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
import { Aside, Main } from '_platform/components/layout';
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
        const { Taskcreate, Taskreport, Taskstatis } = this.state || {};
        return (
            <div style={{ display: 'flex' }}>
                <Aside style={{ overflow: 'hidden' }}>
                    <Submenu
                        {...this.props}
                        menus={Curing.menus}
                        defaultOpenKeys={Curing.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    <Switch>
                        {Taskcreate && (
                            <Route
                                path='/curing/taskcreate'
                                component={Taskcreate}
                            />
                        )}
                        {Taskreport && (
                            <Route
                                path='/curing/taskreport'
                                component={Taskreport}
                            />
                        )}
                        {Taskstatis && (
                            <Route
                                path='/curing/taskstatis'
                                component={Taskstatis}
                            />
                        )}
                    </Switch>
                </Main>
            </div>
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
        }
    ];
    static defaultOpenKeys = ['TASKCREATE'];
}
