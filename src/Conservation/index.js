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
 * @Last Modified time: 2019-10-21 15:22:18
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
import {ConservationMenu} from '_platform/MenuJson';

export default class Conservation extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('conservation', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            TaskCreate,
            TaskReport,
            TaskStatis,
            TaskTeam
        } = this.state || {};
        return (
            <Body >
                <Aside >
                    <Submenu
                        {...this.props}
                        menus={ConservationMenu}
                        defaultOpenKeys={Conservation.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    <Switch>
                        {TaskCreate && (
                            <Route
                                path='/conservation/taskcreate'
                                component={TaskCreate}
                            />
                        )}
                        {TaskReport && (
                            <Route
                                path='/conservation/taskreport'
                                component={TaskReport}
                            />
                        )}
                        {TaskStatis && (
                            <Route
                                path='/conservation/taskstatis'
                                component={TaskStatis}
                            />
                        )}
                        {TaskTeam && (
                            <Route
                                path='/conservation/taskteam'
                                component={TaskTeam}
                            />
                        )}
                    </Switch>
                </Main>
            </Body>
        );
    }

    static defaultOpenKeys = ['TASKCREATE'];
}
