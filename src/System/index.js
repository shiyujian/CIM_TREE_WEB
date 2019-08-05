import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';

export default class System extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('system', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={System.menus} />
                </Aside>
                <Main>
                    <ContainerRouters
                        menus={System.menus}
                        containers={this.state}
                    />
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'Role',
            id: 'SYSTEM.ROLE',
            name: '角色设置',
            path: '/system/role',
            exact: true,
            icon: <Icon name='users' />
        },
        {
            key: 'Permission',
            id: 'SYSTEM.PERMISSION',
            name: '权限设置',
            path: '/system/permission',
            icon: <Icon name='key' />
        },
        {
            key: 'Person',
            id: 'SYSTEM.PERSON',
            name: '用户管理',
            path: '/system/person',
            icon: <Icon name='users' />
        },
        {
            key: 'Workflow',
            id: 'SYSTEM.WORKFLOW',
            name: '流程设置',
            path: '/system/workflow',
            icon: <Icon name='object-group' />
        },
        {
            key: 'Org',
            id: 'SYSTEM.ORG',
            name: '组织机构',
            path: '/system/org',
            icon: <Icon name='street-view' />
        },
        {
            key: 'Blacklist',
            name: '黑名单',
            id: 'SYSTEM.BLACKLIST',
            icon: <Icon name='list-ul' />,
            children: [
                {
                    key: 'PersonBlacklist',
                    id: 'SYSTEM.PERSONBLACKLIST',
                    name: '人员黑名单',
                    path: '/system/personblacklist',
                    icon: <Icon name='street-view' />
                }
                // {
                //     key: 'NurseryBlacklist',
                //     id: 'SYSTEM.NURSERYBLACKLIST',
                //     name: '苗圃黑名单',
                //     path: '/system/nurseryblacklist',
                //     icon: <Icon name='leaf' />
                // },
                // {
                //     key: 'SupplierBlacklist',
                //     id: 'SYSTEM.SUPPLIERBLACKLIST',
                //     name: '供应商黑名单',
                //     path: '/system/supplierblacklist',
                //     icon: <Icon name='shopping-cart' />
                // }
            ]
        }
    ];
}
