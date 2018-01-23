import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/safetyTrend';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tabs} from 'antd';
import VideoTables from '../components/SafetyTrend/VideoTables'
import NoticeTable from '../components/SafetyTrend/NoticeTable'
import StateTable from '../components/SafetyTrend/StateTable'
import BulletinTable from '../components/SafetyTrend/BulletinTable'

const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {safety: {safetyTrend = {}}, platform} = state || {};
		return {...safetyTrend, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class SafetyTrend extends Component {
	static propTypes = {};

	//新闻和通知的切换
	tabChange(tabValue) {
		const {actions: {setTabActive}} = this.props;
		setTabActive(tabValue);
	}

	render() {
		const {
			tabValue = '1',
		} = this.props;
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="新闻公告" {...this.props}/>
				<Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
					<TabPane tab="项目安全公告" key="1">
						<NoticeTable {...this.props}/>
					</TabPane>
					<TabPane tab="国内安全动态" key="2">
						<StateTable {...this.props}/>
					</TabPane>
					<TabPane tab="安全事故快报" key="3">
						<BulletinTable {...this.props}/>
					</TabPane>
					<TabPane tab="安全生产视频" key="4">
						<VideoTables {...this.props}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
