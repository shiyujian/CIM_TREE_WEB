// import {injectReducer} from '../store';
// import React, {Component} from 'react';

// export default class Dashboard extends Component {

// 	async componentDidMount() {
// 		const {default: reducer} = await import('./store');
// 		const Containers = await import('./containers');
// 		injectReducer('dashboard', reducer);
// 		this.setState({
// 			...Containers
// 		});
// 	}

// 	render() {
// 		const {Map = null} = this.state || {};
// 		return (
// 			<div style={{position: 'relative', width: '100%', height: 'calc( 100% - 80px )'}}>
// 				{Map && <Map {...this.props}/>}
// 			</div>)
// 	}
// };



import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Aside, Body, Main, Layout} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class Dashboard extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('dashboard', reducer);
		this.setState({
			...Containers
		})
		
	}

	render() {
        const {OnSite, Project, Plan,Danger} = this.state || {};
		return (
			<div style={{display:"flex"}}>
				<Aside style={{overflow:"hidden"}}>
					<Submenu {...this.props} menus={Dashboard.menus} defaultOpenKeys={Dashboard.defaultOpenKeys}/>
				</Aside>
				<Main>
					<Switch>
						{OnSite && <Route exact path="/dashboard" component={OnSite}/>}
						{OnSite && <Route path="/dashboard/onsite" component={OnSite}/>}
						{Plan && <Route path="/dashboard/plan" component={Plan}/>}
						{Danger && <Route path="/dashboard/danger" component={Danger}/>}
						{Project && <Route path="/dashboard/project" component={Project}/>}
					</Switch>
				</Main>
			</div>);
	}

	static menus = [{
		key: 'ONSITE',
		id: 'DASHBOARD.DASHBOARD',
		path: '/dashboard/onsite',
		name: '二维展示',
        icon: <Icon name="map-o"/>,
	}, {
		key: 'PLAN',
		id: 'DASHBOARD.PLAN',
		path: '/dashboard/plan',
		name: '巡检路线',
        icon: <Icon name="line-chart"/>,
		
	}, {
		key: 'danger',
		id: 'DASHBOARD.DANGER',
		path: '/dashboard/danger',
		name: '安全隐患',
		icon: <Icon name="exclamation-triangle"/>,
	
	},{
		key: 'PROJECT',
		id: 'DASHBOARD.PROJECT',
		path: '/dashboard/project',
		name: '工程影像',
        icon: <Icon name="caret-square-o-up"/>,
	}];
	static defaultOpenKeys = ['ONSITE']
}

