import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/org';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tree, Info, Participant, Addition} from '../components/Org';

@connect(
	state => {
		const {platform, setup: {org = {}} = {}} = state;
		return {platform, ...org};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class Org extends Component {

	static propTypes = {};

	render() {
		return (
			<div>
				<DynamicTitle title="组织机构管理" {...this.props}/>
				<Sidebar>
					<Tree {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
				</Content>
				<Addition {...this.props}/>
			</div>);
	}
}
