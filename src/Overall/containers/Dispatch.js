import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tabs} from 'antd';
import {actions} from '../store/dispatch';
import {ReceivePage,SendPage} from '../components/Dispatch'
import {getUser} from '_platform/auth';
const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {platform, overall: {dispatch = {}}} = state || {};
		return {...dispatch, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Dispatch extends Component {

	static propTypes = {};
	componentDidMount() {
		const {actions: {getReceiveInfoAc,getSentInfoAc,getOrgListAc}} = this.props;
		getReceiveInfoAc({
			user:encodeURIComponent(getUser().org)
		});
		getSentInfoAc({
			user:encodeURIComponent(getUser().org)
		});
		getOrgListAc()
	}
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
				<DynamicTitle title="现场收发文" {...this.props}/>
				<Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
					<TabPane tab="收文管理" key="1">
						<ReceivePage {...this.props}/>
					</TabPane>
					<TabPane tab="发文管理" key="2">
						<SendPage {...this.props}/>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
