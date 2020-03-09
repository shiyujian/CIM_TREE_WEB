/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2019-07-18 09:44:12
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2020-03-09 11:51:18
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
 * @Date: 2019-07-18 09:44:07
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-07-18 09:44:07
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
 * @Date: 2018-09-25 10:51:59
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-04-29 14:52:04
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
 * @Date: 2018-09-01 16:58:31
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2018-09-03 09:22:59
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {ForestMenu} from '_platform/MenuJson';

export default class ForestContainer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultOpenKeys: ['Nursoverallinfo']
        };
    }
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('forest', reducer);
        this.setState({
            ...Containers
        });
    }

    getOnOpenKeys (openKeys) {
        this.setState({
            defaultOpenKeys: openKeys
        });
    }

    render () {
        const {
            defaultOpenKeys
        } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={ForestMenu}
                        getOnOpenKeys={this.getOnOpenKeys.bind(this)}
                        defaultOpenKeys={defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    <ContainerRouters
                        menus={ForestMenu}
                        containers={this.state}
                    />
                </Main>
            </Body>
        );
    }

    static defaultOpenKeys = ['Nursoverallinfo'];
}
