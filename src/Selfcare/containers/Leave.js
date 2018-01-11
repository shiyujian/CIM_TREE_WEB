import React, {Component} from 'react';
import {Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/leave';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table} from '../components/Leave/Table.js';
import {actions as platformActions} from '_platform/store/global';
import {Spin} from 'antd';

@connect(
	state => {
		const {selfcare: {leave = {}} = {}, platform} = state || {};
		return {...leave, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Leave extends Component {
	static propTypes = {};

	render() {
		return (
			<Content>
				<DynamicTitle title="个人请假" {...this.props}/>
				<Table {...this.props}/>
			</Content>
		);
	}
};
