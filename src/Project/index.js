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
 * @Last Modified time: 2018-09-11 14:28:54
 */
import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';

export default class Project extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('project', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        const { Create } = this.state || {};
        return (
            <Body>
                <Aside>
                    <Submenu
                        {...this.props}
                        menus={Project.menus}
                        defaultOpenKeys={Project.defaultOpenKeys}
                    />
                </Aside>
                <Main>
                    <ContainerRouters
                        menus={Project.menus}
                        containers={this.state}
                    />
                    {/* <Redirect path="/" to={{pathname: '/project/nurserymanagement'}} /> */}
                </Main>
            </Body>
        );
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
                    key: 'EngineeringImage',
                    id: 'PROJECT.ENGINEERINGIMAGE',
                    name: '工程影像',
                    path: '/project/engineeringImage',
                    exact: true,
                    icon: <Icon name='retweet' />
                },
                {
                    key: 'ProDoc',
                    id: 'PROJECT.PRODOC',
                    name: '工程文档',
                    path: '/project/proDoc',
                    icon: <Icon name='code' />
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
    ];

    static defaultOpenKeys = ['landArea', 'nursery'];
}
