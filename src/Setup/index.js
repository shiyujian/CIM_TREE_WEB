import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';

export default class Setup extends Component {
    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        injectReducer('setup', reducer);
        this.setState({
            ...Containers
        });
    }

    render () {
        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={Setup.menus} />
                </Aside>
                <Main>
                    <ContainerRouters
                        menus={Setup.menus}
                        containers={this.state}
                    />
                </Main>
            </Body>
        );
    }

    static menus = [
        {
            key: 'Role',
            id: 'SETUP.ROLE',
            name: '角色设置',
            path: '/setup/role',
            exact: true,
            icon: <Icon name='users' />
        },
        {
            key: 'Permission',
            id: 'SETUP.PERMISSION',
            name: '权限设置',
            path: '/setup/permission',
            icon: <Icon name='key' />
        },
        {
            key: 'Person',
            id: 'SETUP.PERSON',
            name: '用户管理',
            path: '/setup/person',
            icon: <Icon name='users' />
        },
        {
            key: 'Workflow',
            id: 'SETUP.WORKFLOW',
            name: '流程设置',
            path: '/setup/workflow',
            icon: <Icon name='object-group' />
        },
        {
            key: 'Org',
            id: 'SETUP.ORG',
            name: '组织机构',
            path: '/setup/org',
            icon: <Icon name='street-view' />
        },
        {
            key: 'Blacklist',
            name: '黑名单',
            id: 'SETUP.BLACKLIST',
            icon: <Icon name='list-ul' />,
            children: [
                {
                    key: 'PersonBlacklist',
                    id: 'SETUP.PERSONBLACKLIST',
                    name: '人员黑名单',
                    path: '/setup/personblacklist',
                    icon: <Icon name='street-view' />
                }
                // {
                //     key: 'NurseryBlacklist',
                //     id: 'SETUP.NURSERYBLACKLIST',
                //     name: '苗圃黑名单',
                //     path: '/setup/nurseryblacklist',
                //     icon: <Icon name='leaf' />
                // },
                // {
                //     key: 'SupplierBlacklist',
                //     id: 'SETUP.SUPPLIERBLACKLIST',
                //     name: '供应商黑名单',
                //     path: '/setup/supplierblacklist',
                //     icon: <Icon name='shopping-cart' />
                // }
            ]
        }
    ];
}
