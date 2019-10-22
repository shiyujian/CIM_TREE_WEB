/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author: ecidi.mingey
 * @Date: 2018-09-11 14:22:58
 * @Last Modified by: ecidi.mingey
 * @Last Modified time: 2019-10-21 15:28:13
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import AsideComponent from './components/Aside';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {ProjectMenu} from '_platform/MenuJson';

export default class Project extends Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultOpenKeys: ['nursery']
        };
    }

    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('project', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const {
            location: {pathname = ''} = {},
            match: {params: {module = ''} = {}} = {}
        } = this.props;
        const {
            ProjectImage,
            defaultOpenKeys
        } = this.state || {};
        if (pathname === '/project/projectimage') {
            return (
                <Body>
                    <AsideComponent>
                        <Submenu
                            {...this.props}
                            menus={ProjectMenu}
                            getOnOpenKeys={this.getOnOpenKeys.bind(this)}
                            defaultOpenKeys={defaultOpenKeys}
                        />
                    </AsideComponent>
                    <Main>
                        <Switch>
                            {ProjectImage && (
                                <Route
                                    path='/project/projectimage'
                                    component={ProjectImage}
                                />
                            )}
                        </Switch>
                    </Main>
                </Body>
            );
        } else {
            return (
                <Body>
                    <Aside>
                        <Submenu
                            {...this.props}
                            menus={ProjectMenu}
                            getOnOpenKeys={this.getOnOpenKeys.bind(this)}
                            defaultOpenKeys={defaultOpenKeys}
                        />
                    </Aside>
                    <Main>
                        <ContainerRouters
                            menus={ProjectMenu}
                            containers={this.state}
                        />
                    </Main>
                </Body>
            );
        }
    }

    getOnOpenKeys (openKeys) {
        this.setState({
            defaultOpenKeys: openKeys
        });
    }

    static defaultOpenKeys = ['nursery'];
}
