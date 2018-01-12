import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { Icon } from 'react-fa';

export default class Schedule extends Component {

	async componentDidMount() {
		const { default: reducer } = await import('./store');
		const Containers = await import('./containers');

		injectReducer('schedule', reducer);
		this.setState({
			...Containers
		}) 
	}

	render() {
		const { Dashboard, TotalPlan, Stage, Notice, History, TotalReport, Approve,
			StartPlan, TotalApproval, DGN, ProgressCityMaker, Scheduler, Progress, DgnDetail } = this.state || {};
		return (
			<Body>
				<Aside>
					<Submenu {...this.props} menus={Schedule.menus} defaultOpenKeys={Schedule.defaultOpenKeys} />
				</Aside>
				<Main>
					{Dashboard && <Route exact path="/schedule" component={Dashboard} />}

					{TotalPlan && <Route exact path="/schedule/totalplan" component={TotalPlan} />}
					{DgnDetail && <Route exact path="/schedule/dgndetail" component={DgnDetail} />}
					{StartPlan && <Route exact path="/schedule/startplan" component={StartPlan} />}
					{TotalReport && <Route path="/schedule/totalreport" component={TotalReport} />}
					{TotalApproval && <Route exact path="/schedule/totalapproval" component={TotalApproval} />}

					{Scheduler && <Route exact path="/schedule/reportsetting" component={Scheduler} />}
					{Stage && <Route exact path="/schedule/stagereport" component={Stage} />}
					{Approve && <Route exact path="/schedule/stageapproval" component={Approve} />}

					{ProgressCityMaker && <Route exact path="/schedule/progress" component={ProgressCityMaker} />}
					{DGN && <Route exact path="/schedule/dgn" component={DGN} />}

					{Notice && <Route path="/schedule/reportmonitor" component={Notice} />}
					{Progress && <Route path="/schedule/noticemonitor" component={Progress} />}

					{History && <Route path="/schedule/history" component={History} />}
				</Main>
			</Body>);
	}
	static menus = [{
		key: 'schedule',
		id: 'SCHEDULE.STATISTICS',
		name: '统计分析',
		path: '/schedule',
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'total',
		name: '总进度计划',
		path: '/schedule/total',
		icon: <Icon name="line-chart"/>,
		children: [{
				key: 'totalplan',
				id: 'SCHEDULE.TOTALPLAN',
				name: '总体进度',
				path: '/schedule/totalplan',
				icon: <Icon name="share-square"/>
			},{
				key: 'startplan',
				id: 'SCHEDULE.STARTPLAN',
				name: '发起计划',
				path: '/schedule/startplan',
				icon: <Icon name="shield"/>
			},
			{
				key: 'totalreport',
				id: 'SCHEDULE.TOTALREPORT',
				name: '进度填报',
				path: '/schedule/totalreport',
				icon: <Icon name="ship"/>
			}, {
				key: 'totalapproval',
				id: 'SCHEDULE.TOTALAPPROVAL',
				name: '进度审批',
				path: '/schedule/totalapproval',
				icon: <Icon name="shopping-bag"/>
			}
		]
	}, {
		key: 'stage',
		name: '进度管控',
		path: '/schedule/stage',
		icon: <Icon name="tasks"/>,
		children: [
			{
				key: 'reportsetting',
				id: 'SCHEDULE.REPORTSETTING',
				name: '管控日程',
				path: '/schedule/reportsetting',
				icon: <Icon name="thumb-tack"/>
			},{
				key: 'stagereport',
				id: 'SCHEDULE.STAGEREPORT',
				name: '进度填报',
				path: '/schedule/stagereport',
				icon: <Icon name="ticket"/>
			}, {
				key: 'stageapproval',
				id: 'SCHEDULE.STAGEAPPROVAL',
				name: '进度审批',
				path: '/schedule/stageapproval',
				icon: <Icon name="tty"/>
			}
		]
	}, {
		key: 'dgnschedule',
		id: 'SCHEDULE.DGNSCHEDULE',
		name: '进度模拟',
		path: '/schedule/progress',
		icon: <Icon name="suitcase"/>
	}, {
		key: 'notice',
		name: '进度预警',
		path: '/schedule/notice',
		icon: <Icon name="warning"/>,
		children: [
			{
				key: 'reportmonitor',
				id: 'SCHEDULE.REPORTMONITOR',
				name: '流程报警',
				path: '/schedule/reportmonitor',
				icon: <Icon name="pencil-square-o"/>
			}, {
				key: 'noticemonitor',
				id: 'SCHEDULE.NOTICEMONITOR',
				name: '进度报警',
				path: '/schedule/noticemonitor',
				icon: <Icon name="sticky-note"/>
			}
		]
	}, {
		key: 'history',
		id: 'SCHEDULE.HISTORY',
		name: '进度历史',
		path: '/schedule/history',
		icon: <Icon name="ship"/>
	}];

	

	static defaultOpenKeys = ['total', 'stage', 'notice']
};
