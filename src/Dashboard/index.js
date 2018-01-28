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
		debugger;
	}

	render() {
        const {OnSite, Project, Plan} = this.state || {};
		return (
			<div style={{display:"flex"}}>
				<Aside style={{overflow:"hidden"}}>
					<Submenu {...this.props} menus={Dashboard.menus} defaultOpenKeys={Dashboard.defaultOpenKeys}/>
				</Aside>
				<Main>
					<Switch>
						{OnSite && <Route exact path="/dashboard" component={OnSite}/>}
						{OnSite && <Route path="/dashboard/onsite" component={OnSite}/>}
						{Project && <Route path="/dashboard/project" component={Project}/>}
						{Plan && <Route path="/dashboard/plan" component={Plan}/>}
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
		name: '规划信息',
        icon: <Icon name="university"/>,
	}, {
		key: 'PROJECT',
		id: 'DASHBOARD.PROJECT',
		path: '/dashboard/project',
		name: '项目信息',
        icon: <Icon name="caret-square-o-up"/>,
	}];
	static defaultOpenKeys = ['ONSITE']
}

