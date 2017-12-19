import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {Icon} from 'react-fa';

export default class SETUP extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');

		injectReducer('setup', reducer);
		this.setState({
			...Containers,
		})
	}

	render() {
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={SETUP.menus} defaultOpenKeys={SETUP.defaultOpenKeys}/>
			</Aside>
			<Main>
				<ContainerRouters menus={SETUP.menus} containers={this.state}/>
			</Main>
			</Body>);
	}

	static menus = [
		{
			key: 'engineering',
			name: '工程管理',
			icon: <Icon name="puzzle-piece"/>,
			children: [{
				key: 'Field',
				id: 'SETUP.AREA',
				name: '区域地块',
				path: '/setup',
				exact: true,
				icon: <Icon name="reorder"/>
			}, {
				key: 'Project',
				id: 'SETUP.PROJECT',
				name: '项目管理',
				path: '/setup/project',
				icon: <Icon name="road"/>
			}, {
				key: 'Unit',
				id: 'SETUP.UNIT',
				name: '单位工程',
				path: '/setup/unit',
				icon: <Icon name="server"/>
			}, {
				key: 'Section',
				id: 'SETUP.SECTION',
				name: '分部分项',
				path: '/setup/section',
				icon: <Icon name="ship"/>
			}, {
				key: 'Site',
				id: 'SETUP.SITE',
				name: '工程部位',
				path: '/setup/site',
				icon: <Icon name="spoon"/>
			}]
		}, {
			key: 'Org',
			id: 'SETUP.ORG',
			name: '组织机构',
			path: '/setup/org',
			icon: <Icon name="street-view"/>
		}, {
			key: 'User',
			id: 'SETUP. ',
			name: '人员管理',
			path: '/setup/person',
			icon: <Icon name="users"/>
		}, {
			key: 'Document',
			name: '资料管理',
			icon: <Icon name="file-text"/>,
			children: [{
				key: 'Standard',
				id: 'SETUP.STANDARD',
				name: '制度标准',
				path: '/setup/Standard',
				icon: <Icon name="random"/>
			}, {
				key: 'Engineering',
				id: 'SETUP.ENGINEERING',
				name: '工程目录',
				path: '/setup/engineer',
				icon: <Icon name="list-ul"/>
			},{
				key: 'Keyword',
				id: 'SETUP.KEYWORD',
				name: '工程字段',
				path: '/setup/Keyword',
				icon: <Icon name="list-alt"/>
			},{
				key: 'Template',
				id: 'SETUP.TEMPLATE',
				name: '模板配置',
				path: '/setup/Template',
				icon: <Icon name="indent"/>
			},{
				key: 'Dictionaries',
				id: 'SETUP.DICTIONARIES',
				name: '工程文档字典',
				path: '/setup/Dictionaries',
				icon: <Icon name="paste"/>
			}]
		},{
			key: 'event',
			name: '事件管理',
			children: [
				{
					key: 'Danger',
					id: 'SETUP.RISK',
					name: '危险源',
					path: '/setup/Danger',
					icon: <Icon name="warning"/>
				},{
					key: 'Hazard',
					id: 'SETUP.HAZARD',
					name: '安全隐患',
					path: '/setup/Hazard',
					icon: <Icon name="thermometer-1"/>
				}, {
					key: 'Defects',
					id: 'SETUP.QUALITY',
					name: '质量缺陷',
					path: '/setup/Defects',
					icon: <Icon name="thumbs-down"/>
				}, {
					key: 'Accident',
					id: 'SETUP.ACCIDENT',
					name: '安全事故',
					path: '/setup/accident',
					icon: <Icon name="plus-square"/>
				}]
		}];


	static defaultOpenKeys = ['engineering', 'Org', 'Document','event']
}




