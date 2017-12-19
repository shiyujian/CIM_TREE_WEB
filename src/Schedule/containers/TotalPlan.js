import React, {Component} from 'react';
import {DynamicTitle,Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as scheduleWorkflowActions} from '../store/scheduleWorkflow';
import * as reducersActions from '../store/total';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'antd';
import {TotalTable} from '../components/Total';
import {Link} from 'react-router-dom';

@connect(
	state => {
		const {platform,scheduleWorkflow={}} = state;
		return {platform,scheduleWorkflow};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...scheduleWorkflowActions}, dispatch),
		reducersActions: bindActionCreators(reducersActions, dispatch)
	})
)
export default class TotalPlan extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{marginLeft:'160px'}}>
				<DynamicTitle title="总体进度" {...this.props}/>
				<Content>
					<TotalTable {...this.props}/>
				</Content>
			</div>);
	}


};
