import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class Selfcare extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');

		injectReducer('selfcare', reducer);
		this.setState({
			...Containers,
		})
	}

	render() {
		const {Tasks, Task, Query, Leave, Account} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={Selfcare.menus}/>
			</Aside>
			<Main>
				{Tasks && <Route exact path="/selfcare" component={Tasks}/>}
				{Task && <Route exact path="/selfcare/task/:task_id" component={Task}/>}
				{Query && <Route exact path="/selfcare/query" component={Query}/>}
				{Leave && <Route exact path="/selfcare/leave" component={Leave}/>}
				{Account && <Route exact path="/selfcare/account" component={Account}/>}
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'tasks',
		id: 'SELFCARE.TASK',
		name: '个人任务',
		path: '/selfcare',
		icon: <Icon name="tasks"/>
	}, {
		key: 'query',
		id: 'SELFCARE.QUERY',
		name: '个人考勤',
		path: '/selfcare/query',
		icon: <Icon name="shekel"/>
	}, {
		key: 'leave',
		id: 'SELFCARE.LEAVE',
		name: '个人请假',
		path: '/selfcare/leave',
		icon: <Icon name="shekel"/>
	}, /*{
		key: 'account',
		id: 'SELFCARE.ACCOUNT',
		name: '账号管理',
		path: '/selfcare/account',
		icon: <Icon name="shekel"/>
	}*/
	];
}
