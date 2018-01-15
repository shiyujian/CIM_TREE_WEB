import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/safetyTrend';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tabs} from 'antd';
import NewsTable from '../components/SafetyTrend/NewsTable'
import TipsTable from '../components/SafetyTrend/TipsTable'

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
					<TabPane tab="新闻公告列表" key="1">
						<NewsTable {...this.props}/>
					</TabPane>
					<TabPane tab="通知公告列表" key="2">
						<TipsTable {...this.props}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
