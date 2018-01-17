import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/person';
import {actions as platformActions} from '_platform/store/global';
import {Tree, Filter, Table, Addition} from '../components/Person';

@connect(
	state => {
		const {system: {person = {}} = {}, platform} = state;
		return {...person, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Person extends Component {
	static propTypes = {};

	render() {
		return (
			<div>
				<DynamicTitle title="用户管理" {...this.props}/>
				<Sidebar>
					<Tree {...this.props}/>
				</Sidebar>
				<Content>
					<Filter {...this.props}/>
					<Table {...this.props}/>
				</Content>
				<Addition {...this.props}/>
			</div>
		);
	}
}
