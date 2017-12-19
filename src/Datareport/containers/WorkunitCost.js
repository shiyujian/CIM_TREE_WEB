import React, {Component} from 'react';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {ProjectSum} from '../components/CostListData'
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, }, dispatch),
	}),
)
export default class WorkunitCost extends Component {

	render() {
		return (
			<div>
				<DynamicTitle title ="工程量结算" {...this.props} />
				<Content>
					<ProjectSum/>
				</Content>
			</div>)
	}
};
