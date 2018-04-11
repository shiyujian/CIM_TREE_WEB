import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Redirect} from 'react-router-dom';
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
				<Submenu {...this.props} menus={System.menus} />
			</Aside>
			<Main>
				<ContainerRouters menus={System.menus} containers={this.state}/>
{/*				<Redirect path="/" to={{pathname: '/system/person'}} />*/}
			</Main>
			</Body>);
	}

	static menus = [
		// {
		// 	key: 'code',
		// 	name: '编码设置',
		// 	icon: <Icon name="won"/>,
		// 	children: [{
		// 		key: 'Dict',
		// 		id: 'SYSTEM.FIELD',
		// 		name: '编码字段',
		// 		path: '/system',
		// 		exact: true,
		// 		icon: <Icon name="retweet"/>,
		// 	}, {
		// 		key: 'Code',
		// 		id: 'SYSTEM.CODETYPE',
		// 		name: '编码类型',
		// 		exact: true,
		// 		path: '/system/code',
		// 		icon: <Icon name="code"/>
		// 	}, {
		// 		key: 'Convention',
		// 		id: 'SYSTEM.CONVENTION',
		// 		name: '编码配置',
		// 		path: '/system/convention',
		// 		icon: <Icon name="money"/>
		// 	}]
		// }, 
		{
			key: 'Role',
			id: 'SYSTEM.ROLE',
			name: '角色设置',
			path: '/system',
			exact: true,
			icon: <Icon name="users"/>,
		},{
			key: 'Permission',
			id: 'SYSTEM.PERMISSION',
			name: '权限设置',
			path: '/system/permission',
			icon: <Icon name="key"/>
		},{
			key: 'Person',
			id: 'SYSTEM.PERSON',
			name: '用户管理',
			path: '/system/person',
			icon: <Icon name="users"/>
		},{
			key: 'Workflow',
			id: 'SYSTEM.WORKFLOW',
			name: '流程设置',
			path: '/system/workflow',
			icon: <Icon name="object-group"/>
		},
		{
			key: 'Org',
			id: 'SYSTEM.ORG',
			name: '组织机构',
			path: '/system/org',
			icon: <Icon name="street-view"/>
		},{
			key: 'Orgdata',
			id: 'SYSTEM.ORGDATA',
			name: '组织机构填报',
			path: '/system/orgdata',
			icon: <Icon name="street-view"/>
		},
		{
			key: 'Personsdata',
			id: 'SYSTEM.PERSONSDATA',
			name: '人员信息填报',
			path: '/system/personsdata',
			icon: <Icon name="street-view"/>
		},
		{
			key: 'Blacklist',
			id: 'SYSTEM.BLACKLIST',
			name: '黑名单',
			path: '/system/blacklist',
			icon: <Icon name="street-view"/>
		},
		// ,{
		// 	key: 'Document',
		// 	id: 'SYSTEM.DOCUMENT',
		// 	name: '文档设置',
		// 	path: '/system/document',
		// 	icon: <Icon name="tablet"/>,
		// },
		// {
		// 	key: 'detailed',
		// 	name: '清单设置',
		// 	icon: <Icon name="book"/>,
		// 	children: [{
		// 		key: 'Tag',
		// 		id: 'SYSTEM.TAG',
		// 		name: '工程量项',
		// 		path: '/system/tag',
		// 		icon: <Icon name="signal"/>
		// 	},{
		// 		key: 'Quantities',
		// 		id: 'SYSTEM.QUANTITIES',
		// 		name: '分项工程量',
		// 		path: '/system/quantities',
		// 		icon: <Icon name="signal"/>
		// 	}]
		// }
		];
}
