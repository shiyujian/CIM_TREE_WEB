import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions, actions2} from '../store/permissionn';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {Roles, Table} from '../components/Permissionn';
@connect(
	state => {
		const {system: {permissionn = {}} = {}, platform} = state;
		return {...permissionn, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...actions2}, dispatch)
	})
)
export default class Permissionn extends Component {
	static propTypes = {};

	render() {
		const {} = this.props;
		return (
			<div>
				<DynamicTitle title="权限设置" {...this.props}/>
				<Sidebar>
					<Roles {...this.props}/>
				</Sidebar>
				<Content>
					<Table {...this.props}/>
				</Content>
			</div>)
	}
}
