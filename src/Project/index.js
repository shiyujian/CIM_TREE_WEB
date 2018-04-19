import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route,Redirect} from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';

export default class Project extends Component {

	async componentDidMount() {
		const { default: reducer } = await import('./store');
		const Containers = await import('./containers');
		injectReducer('project', reducer);
		this.setState({
			...Containers,
		})
	}

	render() {
		const { Create } = this.state || {};
		return (
			<Body>
				<Aside>
					<Submenu {...this.props} menus={Project.menus} defaultOpenKeys={Project.defaultOpenKeys} />
				</Aside>
				<Main>
					<ContainerRouters menus={Project.menus} containers={this.state} />
					{/*<Redirect path="/" to={{pathname: '/project/nurserymanagement'}} />*/}
				</Main>
			</Body>
		);
	}

	static menus = [
		// {
		// 	key: 'landArea',
		// 	id: 'PROJECT.LANDAREA',
		// 	name: '地块区域',
		// 	icon: <Icon name="won" />,
		// 	children: [{
		// 		key: 'PlotManage',
		// 		id: 'PROJECT.PLOTMAGE',
		// 		name: '地块管理',
		// 		path: '/project',
		// 		exact: true,
		// 		icon: <Icon name="retweet" />,
		// 	}, {
		// 		key: 'AreaManage',
		// 		id: 'PROJECT.AREAMANAGE',
		// 		name: '区域管理',
		// 		path: '/project/areaManage',
		// 		icon: <Icon name="code" />
		// 	}, {
		// 		key: 'SectionManage',
		// 		id: 'PROJECT.SECTIONMANAGE',
		// 		name: '标段管理',
		// 		path: '/project/sectionManage',
		// 		icon: <Icon name="money" />
		// 	}, {
		// 		key: 'Smallclass',
		// 		id: 'PROJECT.SMALLCLASS',
		// 		name: '小班管理',
		// 		path: '/project/smallclass',
		// 		icon: <Icon name="money" />
		// 	}, {
		// 		key: 'Thinclass',
		// 		id: 'PROJECT.THINCLASS',
		// 		name: '细班管理',
		// 		path: '/project/thinclass',
		// 		icon: <Icon name="money" />
		// 	}]
		// }, {
		// 	id: 'PROJECT.PROMANAGE',
		// 	key: 'proManage',
		// 	name: '工程管理',
		// 	icon: <Icon name="won" />,
		// 	children: [{
		// 		key: 'PlotSet',
		// 		id: 'PROJECT.PLOTSET',
		// 		name: '地块设置',
		// 		path: '/project/plotSet',
		// 		exact: true,
		// 		icon: <Icon name="retweet" />,
		// 	}, {
		// 		key: 'AreaSet',
		// 		id: 'PROJECT.AREASET',
		// 		name: '区域设置',
		// 		path: '/project/areaSet',
		// 		icon: <Icon name="code" />
		// 	}, {
		// 		key: 'UnitPro',
		// 		id: 'PROJECT.UNITPRO',
		// 		name: '单位工程',
		// 		path: '/project/unitPro',
		// 		icon: <Icon name="money" />
		// 	}, {
		// 		key: 'SubunitPro',
		// 		id: 'PROJECT.SUBUNITPRO',
		// 		name: '子单位工程',
		// 		path: '/project/subunitPro',
		// 		icon: <Icon name="money" />
		// 	}, {
		// 		key: 'SubPro',
		// 		id: 'PROJECT.SUBPRO',
		// 		name: '分部工程',
		// 		path: '/project/subpro',
		// 		icon: <Icon name="money" />
		// 	}, {
		// 		key: 'ItemPro',
		// 		id: 'PROJECT.ITEMPRO',
		// 		name: '分项工程',
		// 		path: '/project/itemPro',
		// 		icon: <Icon name="money" />
		// 	}]
		// }, {
		// 	key: 'org',
		// 	id: 'PROJECT.ORG',
		// 	name: '组织机构',
		// 	icon: <Icon name="won" />,
		// 	children: [{
		// 		key: 'OrgType',
		// 		id: 'PROJECT.ORGTYPE',
		// 		name: '类型管理',
		// 		path: '/project/orgType',
		// 		exact: true,
		// 		icon: <Icon name="retweet" />,
		// 	}, {
		// 		key: 'UnitManage',
		// 		id: 'PROJECT.UNITMANAGE',
		// 		name: '单位管理',
		// 		path: '/project/unitManage',
		// 		icon: <Icon name="code" />
		// 	}, {
		// 		key: 'BranchManage',
		// 		id: 'PROJECT.BRANCHMANAGE',
		// 		name: '部门管理',
		// 		path: '/project/branchManage',
		// 		icon: <Icon name="money" />
		// 	}]
		// }, 

		{
			key: 'dataManage',
			id: 'PROJECT.DATAMANAGE',
			name: '资料管理',
			icon: <Icon name="won" />,
			children: [{
				key: 'Standard',
				id: 'PROJECT.STANDARD',
				name: '制度标准',
				path: '/project/standard',
				exact: true,
				icon: <Icon name="retweet" />,
			}, {
				key: 'EngineeringImage',
				id: 'PROJECT.ENGINEERINGIMAGE',
				name: '工程影像',
				path: '/project/engineeringImage',
				exact: true,
				icon: <Icon name="retweet" />,
			}, {
				key: 'ProDoc',
				id: 'PROJECT.PRODOC',
				name: '工程文档',
				path: '/project/proDoc',
				icon: <Icon name="code" />
			}
			// , {
			// 	key: 'Keyword',
			// 	id: 'PROJECT.KEYWORD',
			// 	name: '工程字段',
			// 	path: '/project/keyword',
			// 	icon: <Icon name="money" />
			// }, {
			// 	key: 'Template',
			// 	id: 'PROJECT.TEMPLATE',
			// 	name: '模板配置',
			// 	path: '/project/template',
			// 	icon: <Icon name="money" />
			// }, {
			// 	key: 'Dictionaries',
			// 	id: 'PROJECT.DICTIONARIES',
			// 	name: '工程文档字典',
			// 	path: '/project/dictionaries',
			// 	icon: <Icon name="money" />
			// }
			]
		}, 
		{
			key: 'OverallManage',
			name: '综合管理',
			id: 'PROJECT.OVERALLMANAGE',			
			icon: <Icon name="won" />,
			children: [
			// 	{
			// 	key: 'Material',
			// 	id: 'PROJECT.MATERIAL',
			// 	name: '物资管理',
			// 	path: '/project/material',
			// 	exact: true,
			// 	icon: <Icon name="retweet" />,
			// },
			{
				key: 'FormManage',
				id: 'PROJECT.FORM',
				name: '表单管理',
				path: '/project/formmanage',
				exact: true,
				icon: <Icon name="retweet" />,
			}] 
		}, 
		{
			key: 'safetyManage',
			name: '安环管理',
			id: 'PROJECT.SAFETYMANAGE',			
			icon: <Icon name="won" />,
			children: [{
				key: 'SafetySystem',
				id: 'PROJECT.SAFETYSYSTEM',
				name: '安全体系',
				path: '/project/safetySystem',
				exact: true,
				icon: <Icon name="retweet" />,
			}, {
				key: 'Danger',
				id: 'PROJECT.DANGER',
				name: '危险源',
				path: '/project/danger',
				icon: <Icon name="code" />
			}, {
				key: 'Unbearable',
				id: 'PROJECT.UNBEARABLE',
				name: '环境保护',
				path: '/project/unbearable',
				icon: <Icon name="tag" />
			},{
				key: 'HiddenDanger',
				id: 'PROJECT.HIDDENDANGER',
				name: '安全隐患',
				path: '/project/hiddendanger',
				icon: <Icon name="money" />
			},{
				key: 'RiskFactor',
				id: 'PROJECT.RISKFACTOR',
				name: '文明施工',
				path: '/project/riskFactor',
				icon: <Icon name="code" />
			},{
				key: 'RiskEvaluation',
				id: 'PROJECT.RISKEVALUATION',
				name: '危险源风险评价',
				path: '/project/riskEvaluation',
				icon: <Icon name="retweet" />
			},{
				key: 'EducationRegister',
				id: 'PROJECT.EDUCATIONREGISTER',
				name: '安全教育',
				path: '/project/educationRegister',
				icon: <Icon name="tag" />
			}]
	  	}, {
			key: 'massManage',
			name: '质量管理',
			id: 'PROJECT.MASSMANAGE',			
			icon: <Icon name="won" />,
			children: [{
				key: 'Defects',
				id: 'PROJECT.DEFECTS',
				name: '质量缺陷',
				path: '/project/defects',
				exact: true,
				icon: <Icon name="retweet" />,
			}]
		}, {
			key: 'nursery',
			name: '苗木管理',
			id: 'PROJECT.NURSERY',			
			icon: <Icon name="won" />,
			children: [
			// 	{
			// 	key: 'NurseryType',
			// 	id: 'PROJECT.NURSERYTYPE',
			// 	name: '类型管理',
			// 	path: '/project/nurseryType',
			// 	icon: <Icon name="retweet" />,
			// }, 
			{
				key: 'TreeManage',
				id: 'PROJECT.TREEMANAGE',
				name: '树种管理',
				path: '/project/treeManage',
				icon: <Icon name="code" />
			} ,{
				key: 'NurseryManagement',
				id: 'PROJECT.NURSERYMANAGEMENT',
				name: '苗圃管理',
				path: '/project/nurserymanagement',
				icon: <Icon name="tag" />
			}]
		}
	];

	static defaultOpenKeys = ['landArea','nursery']
}
