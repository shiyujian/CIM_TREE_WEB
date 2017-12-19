import React, {Component} from 'react';
import {DynamicTitle,Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as scheduleWorkflowActions} from '../store/scheduleWorkflow';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tabs,Table} from 'antd';
import NoticeTable from '../components/NoticeTable';
const TabPane = Tabs.TabPane;
@connect(
	state => {
		const {platform,scheduleWorkflow={}} = state;
		return {platform,scheduleWorkflow};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...scheduleWorkflowActions}, dispatch)
	})
)
export default class Notice extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	render() {
		
		return (
			<div>
				<DynamicTitle title="进度预警" {...this.props}/>
				<Content>
					<NoticeTable {...this.props} {...this.state}/>
				</Content>
			</div>);
	}
};
