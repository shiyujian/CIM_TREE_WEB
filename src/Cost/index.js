import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Aside, Body, Sidebar, Main} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';
import SearchTree from './components/SearchTree'

export default class Cost extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('cost', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {CostComparison, CostEstimate, CostSchedule, DataMaintenance, InfoShow, WorkEstimate} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={Cost.menus}/>
			</Aside>
			<Sidebar>
				<SearchTree style={{height:'100%'}}/>
			</Sidebar>
			<div style={{float:'left',width:'calc(100% - 380px)'}}>
				<Switch>
					{CostComparison && <Route path="/cost/costcomparison" component={CostComparison}/>}
					{CostSchedule && <Route path="/cost/costschedule" component={CostSchedule}/>}
					{InfoShow && <Route exact path="/cost/infoshow" component={InfoShow}/>}
					{WorkEstimate && <Route exact path="/cost/workestimate" component={WorkEstimate}/>}
					{DataMaintenance && <Route path="/cost/datamaintenance" component={DataMaintenance}/>}
					{CostEstimate && <Route path="/cost" component={CostEstimate}/>}
				</Switch>
			</div>
			</Body>);
	}

	static menus = [{
		key: 'costestimate',
		id: 'COST.COSTESTIMATE',
		path: '/cost',
		name: '造价估算',
		icon: <Icon name="user-o"/>,
	}, {
		key: 'costschedule',
		id: 'COST.COSTSCHEDULE',
		path: '/cost/costschedule',
		name: '造价进度',
		icon: <Icon name="calendar-check-o"/>
	}, {
		key: 'costcomparison',
		id: 'COST.COSTCOMPARISON',
		path: '/cost/costcomparison',
		name: '造价对比',
		icon: <Icon name="area-chart"/>,
	},{
		key: 'infoshow',
		id: 'COST.INFOSHOW',
		path: '/cost/infoshow',
		name: '工程量信息展示',
		icon: <Icon name="sliders"/>,
	}, {
		key: 'datamaintenance',
		id: 'COST.DATAMAINTENANCE',
		path: '/cost/datamaintenance',
		name: '工程量数据维护',
		icon: <Icon name="wrench"/>,
	}, {
		key: 'workestimate',
		id: 'COST.WORKESTIMATE',
		path: '/cost/workestimate',
		name: '重要工程量预估',
		icon: <Icon name="tty"/>,
	}];
}
