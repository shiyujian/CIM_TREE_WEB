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
 * @Last Modified time: 2018-12-18 10:38:16
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
            AuxiliaryAcceptance,
            ProjectImage,
            defaultOpenKeys
        } = this.state || {};
        if (pathname === '/project/auxiliaryacceptance' || pathname === '/project/projectimage') {
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
                            {AuxiliaryAcceptance && (
                                <Route
                                    path='/project/auxiliaryAcceptance'
                                    component={AuxiliaryAcceptance}
                                />
                            )}
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
            key: 'dataManage',
            id: 'PROJECT.DATAMANAGE',
            name: '资料管理',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'Standard',
                    id: 'PROJECT.STANDARD',
                    name: '制度标准',
                    path: '/project/standard',
                    exact: true,
                    icon: <Icon name='retweet' />
                },
                {
                    key: 'ProDoc',
                    id: 'PROJECT.PRODOC',
                    name: '工程文档',
                    path: '/project/proDoc',
                    icon: <Icon name='code' />
                },
                {
                    key: 'EngineeringImage',
                    id: 'PROJECT.ENGINEERINGIMAGE',
                    name: '影像资料',
                    path: '/project/engineeringImage',
                    exact: true,
                    icon: <Icon name='retweet' />
                }
            ]
        },
        {
            key: 'OverallManage',
            name: '综合管理',
            id: 'PROJECT.OVERALLMANAGE',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'FormManage',
                    id: 'PROJECT.FORM',
                    name: '表单管理',
                    path: '/project/formmanage',
                    exact: true,
                    icon: <Icon name='retweet' />
                }
            ]
        },
        {
            key: 'safetyManage',
            name: '安环管理',
            id: 'PROJECT.SAFETYMANAGE',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'SafetySystem',
                    id: 'PROJECT.SAFETYSYSTEM',
                    name: '安全体系',
                    path: '/project/safetySystem',
                    exact: true,
                    icon: <Icon name='retweet' />
                },
                {
                    key: 'Danger',
                    id: 'PROJECT.DANGER',
                    name: '危险源',
                    path: '/project/danger',
                    icon: <Icon name='code' />
                },
                {
                    key: 'Unbearable',
                    id: 'PROJECT.UNBEARABLE',
                    name: '环境保护',
                    path: '/project/unbearable',
                    icon: <Icon name='tag' />
                },
                {
                    key: 'HiddenDanger',
                    id: 'PROJECT.HIDDENDANGER',
                    name: '安全隐患',
                    path: '/project/hiddendanger',
                    icon: <Icon name='money' />
                },
                {
                    key: 'RiskFactor',
                    id: 'PROJECT.RISKFACTOR',
                    name: '文明施工',
                    path: '/project/riskFactor',
                    icon: <Icon name='code' />
                },
                {
                    key: 'RiskEvaluation',
                    id: 'PROJECT.RISKEVALUATION',
                    name: '危险源风险评价',
                    path: '/project/riskEvaluation',
                    icon: <Icon name='retweet' />
                },
                {
                    key: 'EducationRegister',
                    id: 'PROJECT.EDUCATIONREGISTER',
                    name: '安全教育',
                    path: '/project/educationRegister',
                    icon: <Icon name='tag' />
                }
            ]
        },
        {
            key: 'massManage',
            name: '质量管理',
            id: 'PROJECT.MASSMANAGE',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'Defects',
                    id: 'PROJECT.DEFECTS',
                    name: '质量缺陷',
                    path: '/project/defects',
                    exact: true,
                    icon: <Icon name='retweet' />
                }
            ]
        },
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
                    key: 'ThinClassManage',
                    id: 'PROJECT.THINCLASSMANAGE',
                    name: '细班管理',
                    path: '/project/thinClassManage',
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
        }, {
            key: 'volunteer',
            name: '志愿管理',
            id: 'PROJECT.VOLUNTEER',
            icon: <Icon name='won' />,
            children: [
                {
                    key: 'VolunteerManage',
                    id: 'PROJECT.VOLUNTEERMANAGE',
                    name: '志愿者管理',
                    path: '/project/volunteerManage',
                    icon: <Icon name='code' />
                }
            ]
        },
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
        },
        {
            key: 'auxiliaryAcceptance',
            name: '辅助验收',
            id: 'PROJECT.AUXILIARYACCEPTANCE',
            path: '/project/auxiliaryacceptance',
            icon: <Icon name='check' />
        },
        {
            key: 'projectImage',
            name: '工程影像',
            id: 'PROJECT.PROJECTIMAGE',
            path: '/project/projectimage',
            icon: <Icon name='check' />
        }
    ];

    static defaultOpenKeys = ['nursery'];
}
