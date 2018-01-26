import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import {Icon} from 'react-fa';

export default class Project extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('project', reducer);
		this.setState({
			...Containers,
		})
	}

	render() {
		const {Create} = this.state || {};
		return (
			<Body>
				<Aside>
					<Submenu {...this.props} menus={Project.menus} defaultOpenKeys={Project.defaultOpenKeys}/>
				</Aside>
				<Main>
					<ContainerRouters menus={Project.menus} containers={this.state}/>
				</Main>
			</Body>
		);
	}

	static menus = [
		{
			key: 'landArea',
			name: '地块区域',
			icon: <Icon name="won"/>,
			children: [{
				key: 'PlotManage',
				id: 'PLOTMAGE',
				name: '地块管理',
				path: '/project',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'AreaManage',
				id: 'AREAMANAGE',
				name: '区域管理',
				path: '/project/areaManage',
				icon: <Icon name="code"/>
			}, {
				key: 'SectionManage',
				id: 'SECTIONMANAGE',
				name: '标段管理',
				path: '/project/sectionManage',
				icon: <Icon name="money"/>
			}, {
				key: 'Smallclass',
				id: 'SMALLCLASS',
				name: '小班管理',
				path: '/project/smallclass',
				icon: <Icon name="money"/>
			}, {
				key: 'Thinclass',
				id: 'THINCLASS',
				name: '细班管理',
				path: '/project/thinclass',
				icon: <Icon name="money"/>
			}]
		}, {
			key: 'proManage',
			name: '工程管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'PlotSet',
				id: 'PLOTSET',
				name: '地块设置',
				path: '/project/plotSet',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'AreaSet',
				id: 'AREASET',
				name: '区域设置',
				path: '/project/areaSet',
				icon: <Icon name="code"/>
			}, {
				key: 'UnitPro',
				id: 'UNITPRO',
				name: '单位工程',
				path: '/project/unitPro',
				icon: <Icon name="money"/>
			}, {
				key: 'SubunitPro',
				id: 'SUBUNITPRO',
				name: '子单位工程',
				path: '/project/subunitPro',
				icon: <Icon name="money"/>
			}, {
				key: 'SubPro',
				id: 'SUBPRO',
				name: '分部工程',
				path: '/project/subpro',
				icon: <Icon name="money"/>
			}, {
				key: 'ItemPro',
				id: 'ITEMPRO',
				name: '分项工程',
				path: '/project/itemPro',
				icon: <Icon name="money"/>
			}]
		}, {
			key: 'org',
			name: '组织机构',
			icon: <Icon name="won"/>,
			children: [{
				key: 'OrgType',
				id: 'ORGTYPE',
				name: '类型管理',
				path: '/project/orgType',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'UnitManage',
				id: 'UNITMANAGE',
				name: '单位管理',
				path: '/project/unitManage',
				icon: <Icon name="code"/>
			}, {
				key: 'BranchManage',
				id: 'BRANCHMANAGE',
				name: '部门管理',
				path: '/project/branchManage',
				icon: <Icon name="money"/>
			}]
		}, {
			key: 'dataManage',
			name: '资料管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'Standard',
				id: 'STANDARD',
				name: '制度标准',
				path: '/project/standard',
				exact: true,
				icon: <Icon name="retweet"/>,
			},{
				key: 'EngineeringImage',
				id: 'ENGINEERINGIMAGE',
				name: '工程影像',
				path: '/project/engineeringImage',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'ProDoc',
				id: 'PRODOC',
				name: '工程文档',
				path: '/project/proDoc',
				icon: <Icon name="code"/>
			}, {
				key: 'Keyword',
				id: 'KEYWORD',
				name: '工程字段',
				path: '/project/keyword',
				icon: <Icon name="money"/>
			}, {
				key: 'Template',
				id: 'TEMPLATE',
				name: '模板配置',
				path: '/project/template',
				icon: <Icon name="money"/>
			}, {
				key: 'Dictionaries',
				id: 'DICTIONARIES',
				name: '工程文档字典',
				path: '/project/dictionaries',
				icon: <Icon name="money"/>
			}]
		}, {
			key: 'OverallManage',
			name: '综合管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'Material',
				id: 'MATERIAL',
				name: '物资管理',
				path: '/project/material',
				exact: true,
				icon: <Icon name="retweet"/>,
			},
			{
				key: 'FormManage',
				id: 'FORM',
				name: '表单管理',
				path: '/project/formmanage',
				exact: true,
				icon: <Icon name="retweet"/>,
			}]
		},{
			key: 'safetyManage',
			name: '安全管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'SafetySystem',
				id: 'SAFETYSYSTEM',
				name: '安全体系目录',
				path: '/project/safetySystem',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'Danger',
				id: 'DANGER',
				name: '危险源',
				path: '/project/danger',
				icon: <Icon name="code"/>
			}, {
				key: 'Hazard',
				id: 'HAZARD',
				name: '安全隐患',
				path: '/project/hazard',
				icon: <Icon name="money"/>
			}]
		}, {
			key: 'massManage',
			name: '质量管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'Defects',
				id: 'DEFECTS',
				name: '质量缺陷',
				path: '/project/defects',
				exact: true,
				icon: <Icon name="retweet"/>,
			}]
		}, {
			key: 'nursery',
			name: '苗木管理',
			icon: <Icon name="won"/>,
			children: [{
				key: 'NurseryType',
				id: 'NURSERYTYPE',
				name: '类型管理',
				path: '/project/nurseryType',
				exact: true,
				icon: <Icon name="retweet"/>,
			}, {
				key: 'TreeManage',
				id: 'TREEMANAGE',
				name: '树种管理',
				path: '/project/treeManage',
				icon: <Icon name="code"/>
			}]
		}
	];

	static defaultOpenKeys = ['landArea']
}
