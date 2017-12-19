import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';
import "./containers/style.less";


export default class Design extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');

		injectReducer('overall', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {
			Dashboard, Blueprint,
			DeliverPlan, ReportResult,
			ApprovalResult, DesignRemind, ChangeDesign,ChangeDesignApproval,ChangeDesignStart,
			//设计交底
			ExplainSubmit, ExplainHandle, ExplainQuery,
			//
		} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={Design.menus} defaultOpenKeys={Design.defaultOpenKeys}/>
			</Aside>
			<Main>
				{/* 设计交底 */}
				{ExplainSubmit && <Route exact path="/design/explainSubmit" component={ExplainSubmit} />}
				{ExplainHandle && <Route exact path="/design/explainHandle" component={ExplainHandle} />}
				{ExplainQuery && <Route exact path="/design/explainQuery" component={ExplainQuery} />}
				{/*  */}
				{Dashboard && <Route exact path="/design" component={Dashboard}/>}
				{DeliverPlan && <Route exact path="/design/plan/1"  component={DeliverPlan}/>}
				{DeliverPlan && <Route exact path="/design/plan/2"  component={DeliverPlan}/>}
				{DeliverPlan && <Route exact path="/design/plan/3"  component={DeliverPlan}/>}
				{DeliverPlan && <Route exact path="/design/plan/4"  component={DeliverPlan}/>}
				{DeliverPlan && <Route exact path="/design/plan/5"  component={DeliverPlan}/>}
				{DeliverPlan && <Route exact path="/design/plan/6"  component={DeliverPlan}/>}
				{Blueprint && <Route path="/design/blueprint" component={Blueprint}/>}
				{ChangeDesign && <Route path="/design/modify" component={ChangeDesign}/>}
				{ChangeDesign && <Route path="/design/modifyApproval" component={ChangeDesignApproval}/>}
				{ChangeDesign && <Route path="/design/createModify" component={ChangeDesignStart}/>}
				{ReportResult && <Route path="/design/reportResult" component={ReportResult}/>}
				{ApprovalResult && <Route path="/design/approvalResult" component={ApprovalResult}/>}
				{DesignRemind && <Route path="/design/remind" component={DesignRemind}/>}
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'design',
		id: 'DESIGN.STATISTICS',
		name: '统计分析',
		path: '/design',
		icon: <Icon name="podcast"/>
	}, 
	
	{
		key: 'explain',
		id: 'DESIGN.EXPLAIN',
		name: '设计交底',
		path: '/design/explain',
		icon: <Icon name="th"/>,
		children:[
			{
				key:'query',
				id:'DESIGN.EXPLAINQUERY',
				name:'交底查询',
				path:'/design/explainQuery',
				icon: <Icon name="bookmark"/>,
			},
			{
				key:'submit',
				id:'DESIGN.EXPLAINSUBMIT',
				name:'交底填报',
				path:'/design/explainSubmit',
				icon: <Icon name="bookmark-o"/>,
			},
			{
				key:'handle',
				id:'DESIGN.EXPLAINHANDLE',
				name:'交底处理',
				path:'/design/explainHandle',
				icon: <Icon name="eraser"/>,
			},
		]
	},

	{
		key: 'plan',
		id: 'DESIGN.PLAN',
		name: '交付计划',
		path: '/design/plan',
		icon: <Icon name="th-list"/>,
		children: [
			{
				key: '1',
				id: 'DESIGN.PLAN1',
				name: '交付计划',
				path: '/design/plan/1',
				icon: <Icon name="align-center"/>
			}, {
				key: '2',
				id: 'DESIGN.PLAN2',
				name: '发起计划',
				path: '/design/plan/2',
				icon: <Icon name="columns"/>
			}, {
				key: '3',
				id: 'DESIGN.PLAN3',
				name: '填报计划',
				path: '/design/plan/3',
				icon: <Icon name="building"/>
			}, {
				key: '4',
				id: 'DESIGN.PLAN4',
				name: '计划审查',
				path: '/design/plan/4',
				icon: <Icon name="certificate"/>
			}, {
				key: '5',
				id: 'DESIGN.PLAN5',
				name: '计划变更',
				path: '/design/plan/5',
				icon: <Icon name="calendar-o"/>
			}, {
				key: '6',
				id: 'DESIGN.PLAN6',
				name: '变更审查',
				path: '/design/plan/6',
				icon: <Icon name="bullhorn"/>
			}
		]
	}, {
		key: 'designResult',
		name: '设计成果',
		path: '/design/reportResult',
		icon: <Icon name="th-large"/>,
		children: [
			{
				key: 'reportResult',
				id: 'DESIGN.REPORTRESULT',
				name: '设计上报',
				path: '/design/reportResult',
				icon: <Icon name="briefcase"/>
			}, {
				key: 'approvalResult',
				id: 'DESIGN.APPROVALRESULT',
				name: '设计审查',
				path: '/design/approvalResult',
				icon: <Icon name="book"/>
			}, {
				key: 'createModify',
				id: 'DESIGN.CREATEMODIFY',
				name: '发起变更',
				path: '/design/createModify',
				icon: <Icon name="calculator"/>
			}, {
				key: 'modify',
				id: 'DESIGN.MODIFY',
				name: '设计变更',
				path: '/design/modify',
				icon: <Icon name="bell"/>
			}, {
				key: 'modifyApproval',
				id: 'DESIGN.MODIFYAPPROVAL',
				name: '变更审查',
				path: '/design/modifyApproval',
				icon: <Icon name="calendar"/>
			}
		]
	}, {
		key: 'remind',
		id: 'DESIGN.REMIND',
		name: '进度提醒',
		path: '/design/remind',
		icon: <Icon name="building-o"/>
	}];

	static defaultOpenKeys = ['plan', 'designResult']
}
