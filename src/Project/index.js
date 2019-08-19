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
 * @Last Modified time: 2019-08-05 19:03:51
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import AsideComponent from './components/Aside';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';

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
                            menus={Project.menus}
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
                            menus={Project.menus}
                            getOnOpenKeys={this.getOnOpenKeys.bind(this)}
                            // defaultOpenKeys={Project.defaultOpenKeys}
                            defaultOpenKeys={defaultOpenKeys}
                        />
                    </Aside>
                    <Main>
                        <ContainerRouters
                            menus={Project.menus}
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

    static menus = [
        {
            key: 'plotManage',
            name: '数据管理',
            id: 'PROJECT.PLOTMANAGE',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'ThinClassStorage',
                    id: 'PROJECT.THINCLASSTORAGE',
                    name: '细班导入',
                    path: '/project/thinClassStorage',
                    icon: <Icon name='code' />
                },
                {
                    key: 'ThinClassParcelManage',
                    id: 'PROJECT.THINCLASSPARCELMANAGE',
                    name: '细班分块管理',
                    path: '/project/thinClassParcelManage',
                    icon: <Icon name='code' />
                },
                {
                    key: 'ThinClassTreeTypeManage',
                    id: 'PROJECT.THINCLASSTREETYPEMANAGE',
                    name: '细班树种管理',
                    path: '/project/thinClassTreeTypeManage',
                    icon: <Icon name='code' />
                },
                {
                    key: 'ParcelStorage',
                    id: 'PROJECT.PARCELSTORAGE',
                    name: '地块导入',
                    path: '/project/parcelStorage',
                    icon: <Icon name='tag' />
                },
                {
                    key: 'ParcelManage',
                    id: 'PROJECT.PARCELMANAGE',
                    name: '地块管理',
                    path: '/project/parcelManage',
                    icon: <Icon name='tag' />
                }
            ]
        },
        // {
        //     key: 'volunteer',
        //     name: '志愿管理',
        //     id: 'PROJECT.VOLUNTEER',
        //     icon: <Icon name='won' />,
        //     children: [
        //         {
        //             key: 'VolunteerManage',
        //             id: 'PROJECT.VOLUNTEERMANAGE',
        //             name: '志愿者管理',
        //             path: '/project/volunteerManage',
        //             icon: <Icon name='code' />
        //         }
        //     ]
        // },
        {
            key: 'nursery',
            name: '苗木管理',
            id: 'PROJECT.NURSERY',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'TreeManage',
                    id: 'PROJECT.TREEMANAGE',
                    name: '树种管理',
                    path: '/project/treeManage',
                    icon: <Icon name='code' />
                },
                {
                    key: 'NurseryManagement',
                    id: 'PROJECT.NURSERYMANAGEMENT',
                    name: '苗圃管理',
                    path: '/project/nurseryManagement',
                    icon: <Icon name='tag' />
                },
                {
                    key: 'SupplierManagement',
                    id: 'PROJECT.SUPPLIERMANAGEMENT',
                    name: '供应商管理',
                    path: '/project/supplierManagement',
                    icon: <Icon name='tag' />
                },
                {
                    key: 'RelevanceManagement',
                    id: 'PROJECT.RELEVANCEMANAGEMENT',
                    name: '绑定管理',
                    path: '/project/relevanceManagement',
                    icon: <Icon name='tag' />
                }
            ]
        }
        // {
        //     key: 'projectImage',
        //     name: '工程影像',
        //     id: 'PROJECT.PROJECTIMAGE',
        //     path: '/project/projectimage',
        //     icon: <Icon name='check' />
        // }
    ];

    static defaultOpenKeys = ['nursery'];
}
