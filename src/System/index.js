import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {Icon} from 'react-fa';

export default class System extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('system', reducer);
		this.setState({
			...Containers,
		})
	}

	render() {
		const {Create} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={System.menus} defaultOpenKeys={System.defaultOpenKeys}/>
			</Aside>
			<Main>
				<ContainerRouters menus={System.menus} containers={this.state}/>
				{Create && <Route path="/system/code/create" component={Create}/>}
			</Main>
			</Body>);
	}

	static menus = [
		{
			key: 'code',
			name: '编码设置',
			icon: <Icon name="won"/>,
			children: [{
				key: 'Dict',
				id: 'SYSTEM.FIELD',
				name: '编码字段',
				path: '/system',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'Code',
				id: 'SYSTEM.CODETYPE',
				name: '编码类型',
				exact: true,
				path: '/system/code',
				icon: <Icon name="code"/>
			}, {
				key: 'Convention',
				id: 'SYSTEM.CONVENTION',
				name: '编码配置',
				path: '/system/convention',
				icon: <Icon name="money"/>
			}]
		}, 
		{
			key: 'Role',
			id: 'SYSTEM.ROLE',
			name: '角色设置',
			path: '/system/role',
			icon: <Icon name="users"/>,
		}, {
			key: 'Permission',
			id: 'SYSTEM.PERMISSION',
			name: '权限设置',
			path: '/system/permission',
			icon: <Icon name="key"/>
		}, {
			key: 'Major',
			id: 'SYSTEM.MAJOR',
			name: '专业设置',
			path: '/system/major',
			icon: <Icon name="sign-in"/>
		}, {
			key: 'Project',
			id: 'SYSTEM.PROJECT',
			name: '项目设置',
			path: '/system/project',
			icon: <Icon name="sun-o"/>
		}, {
			key: 'Template',
			id: 'SYSTEM.TEMPLATE',
			name: '模版设置',
			path: '/system/template',
			icon: <Icon name="sort-amount-asc"/>
		}, {
			key: 'Icon',
			id: 'SYSTEM.ICON',
			name: '图标设置',
			path: '/system/icon',
			icon: <Icon name="terminal"/>
		}, {
			key: 'Workflow',
			id: 'SYSTEM.WORKFLOW',
			name: '流程设置',
			path: '/system/workflow',
			icon: <Icon name="object-group"/>
		},{
			key: 'Document',
			id: 'SYSTEM.DOCUMENT',
			name: '文档设置',
			path: '/system/document',
			icon: <Icon name="tablet"/>,
		},
		{
			key: 'detailed',
			name: '清单设置',
			icon: <Icon name="book"/>,
			children: [{
				key: 'Tag',
				id: 'SYSTEM.TAG',
				name: '工程量项',
				path: '/system/tag',
				icon: <Icon name="signal"/>
			},{
				key: 'Quantities',
				id: 'SYSTEM.QUANTITIES',
				name: '分项工程量',
				path: '/system/quantities',
				icon: <Icon name="signal"/>
			}]
		}];

	static defaultOpenKeys = ['user', 'system', 'code','detailed','home']
}