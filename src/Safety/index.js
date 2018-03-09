import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { Icon } from 'react-fa';
// import "./containers/style.less"
// 

export default class Safety extends Component {

	async componentDidMount() {
		const { default: reducer } = await import('./store');
		const Containers = await import('./containers');
		injectReducer('safety', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		return (
			<Body>
				<Aside>
					<Submenu {...this.props} menus={Safety.menus} defaultOpenKeys={Safety.defaultOpenKeys} />
				</Aside>
				<Main>
					<ContainerRouters menus={Safety.menus} containers={this.state} />
				</Main>
			</Body>)
	}

	static menus = [{
		key: 'Trend',
		id: 'SAFETY.TREND',
		exact: true,
		name: '安全动态',
		path: '/safety',
		icon: <Icon name="thermometer-empty" />
	}, {
		key: 'SafetySystem',
		id: 'SAFETY.SYSTEM',
		name: '安全体系',
		path: '/safety/safetySystem',
		icon: <Icon name="thermometer-empty" />
	}, {
		key: 'HiddenDanger',
		id: 'SAFETY.HIDDENDANGER',
		name: '安全隐患',
		exact: true,
		path: '/safety/hiddenDanger',
		icon: <Icon name="building-o" />
	},{
		key: 'dangerousSourceManagement',
		id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT',
		name: '安全文明施工',
		path: '/safety/dangerousSourceManagement',
		icon: <Icon name="wrenach" />,
		children: [
			{
				key: 'RiskEvaluation',
				id: 'SAFETY.RISKEVALUATION',
				name: '危险源风险评价',
				path: '/safety/dangerousSourceManagement/riskEvaluation',
				icon: <Icon name="minus-square-o" />
			}, {
				key: 'Unbearable',
				id: 'SAFETY.UNBEARABLE',
				name: '环境保护',
				path: '/safety/dangerousSourceManagement/unbearable',
				icon: <Icon name="star-half-empty" />
			}, {
				key: 'RiskFactor',
				id: 'SAFETY.RISKFACTOR',
				name: '文明施工',
				path: '/safety/dangerousSourceManagement/riskFactor',
				icon: <Icon name="plus-square-o" />
			},
			// , {
			// 	key: 'DynamicReport',
			// 	id: 'SAFETY.DYNAMICREPORT',
			// 	name: '动态报表',
			// 	path: '/safety/dangerousSourceManagement/dynamicReport',
			// 	icon: <Icon name="bar- chart-o"/>
			// }
		]
	}
	// ,{
	// 	key: 'EducationRegister',
	// 	id: 'SAFETY.EDUCATIONREGISTER',
	// 	name: '安全教育',
	// 	path: '/safety/educationRegister',
	// 	icon: <Icon name="tag" />
	// }
	, {
		key: 'EducationRegisters',
		id: 'SAFETY.EDUCATIONREGISTER',
		name: '安全教育',
		path: '/safety/educationRegisters',
		icon: <Icon name="tag" />
	}, {
		key: 'SafetyTrend',
		id: 'SAFETY.SAFETYTREND',
		name: '安全动态管理',
		path: '/safety/safetyTrend',
		icon: <Icon name="sliders" />
	}]

	static defaultOpenKeys = ['safetyPlan']
}
