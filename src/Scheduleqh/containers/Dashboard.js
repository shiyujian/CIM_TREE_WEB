import React, {Component} from 'react';
import {DynamicTitle, Sidebar, Content} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions as dashboardActions} from '../store/dashboard';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ScheduleProjectTree from '../components/ScheduleProjectTree';
import {CompletionState, ExecutionState, InquiryState, Output} from '../components/Dashboard';
import {Row, Col} from 'antd';

@connect(
	state => {
		const {platform,dashboard={}} = state;
		return {platform,dashboard};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...dashboardActions}, dispatch)
	})
)
export default class Dashboard extends Component {

	static propTypes = {};

	render() {
		return (
			<div style={{marginLeft:'160px'}}>
			<DynamicTitle title="统计分析" {...this.props}/>
			<Content>
				<Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={24}>
						<CompletionState  {...this.props}/>
					</Col>
				</Row>
				<Row gutter={10} style={{margin: '10px 5px'}}>
					<Col span={12}>
						<Output  {...this.props}/>
					</Col>
					<Col span={12}>
						 <InquiryState {...this.props}/>
					</Col>
				</Row>
			</Content>	
		</div>);
	}
}
