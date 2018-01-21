import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import {Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class Overall extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('overall', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {Package, News, News1, Attend, Dispatch,Material,Form, Approval,Receipt} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={Overall.menus}/>
			</Aside>
			<Switch>
				
				{News && <Route path="/overall/news" component={News}/>}
				{/* {News1 && <Route path="/overall/news1" component={News1}/>} */}
				{Receipt && <Route path="/overall/receipt" component={Receipt}/>}
				{Material && <Route path="/overall/material" component={Material}/>}
				{Form && <Route path="/overall/form" component={Form}/>}
				{Attend && <Route path="/overall/attend" component={Attend}/>}
				{/* {Approval && <Route path="/overall/approval" component={Approval}/>} */}
				{/*Package && <Route exact path="/overall/:id?" component={Package}/>*/}
			</Switch>
			</Body>);
	}

	static menus = [ {
		key: 'news',
		id: 'MANAGE.NEWS',
		path: '/overall/news',
		name: '新闻通知',
		icon: <Icon name="calendar-check-o"/>
	},{
		key: 'receipt',
		id: 'MANAGE.RECEIPT',
		path: '/overall/receipt',
		name: '现场收发文',
		icon: <Icon name="newspaper-o"/>,
	},{
		key: 'material',
		id: 'MANAGE.MATERAIL',
		path: '/overall/material',
		name: '物资管理',
		icon: <Icon name="bars"/>,
	},{
		key: 'form',
		id: 'MANAGE.FORM',
		path: '/overall/form',
		name: '表单管理',
		icon: <Icon name="file-text"/>,
	},
	{
		key: 'attend',
		id: 'MANAGE.CHECKIN',
		path: '/overall/attend',
		name: '考勤管理',
		icon: <Icon name="user-o"/>,
	}]
	// }, {
	// 	key: 'approval',
	// 	id: 'MANAGE.APPROVAL',
	// 	path: '/overall/approval',
	// 	name: '项目报批',
	// 	icon: <Icon name="sliders"/>,
	// }];
}
