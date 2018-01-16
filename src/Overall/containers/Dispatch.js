import React, { Component } from 'react';
import { DynamicTitle, Sidebar } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { actions } from '../store/dispatch';
import { ReceivePage, SendPage, ProjectUnitWrapper,BackPage } from '../components/Dispatch'
import { getUser } from '_platform/auth';
import moment from 'moment';

const TabPane = Tabs.TabPane;

@connect(
	state => {
		const { platform, overall: { dispatch = {} } } = state || {};
		return { ...dispatch, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
	}),
)
export default class Dispatch extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			unitTreeLoading: true,
			item: null
		}
	}


	componentDidMount() {
		const { actions: { getReceiveInfoAc, getSentInfoAc, getOrgListAc } } = this.props;
		getReceiveInfoAc({
			user: encodeURIComponent(getUser().org)
		});
		getSentInfoAc({
			user: encodeURIComponent(getUser().org)
		});
		getOrgListAc()
	}



	tabChange(tabValue) {
		const { actions: { setTabActive } } = this.props;
		setTabActive(tabValue);
	}
	onSelect = (project, unitProjecte) => {

		let me = this;
		//选择最下级的工程
		if (unitProjecte) {
			this.setState({
				item: {
					unitProjecte: unitProjecte,
					project: project
				}
			})
		}
	};

	render() {
		const {
			tabValue = '1',
		} = this.props;
		return (
			<div>
				<DynamicTitle title="现场收发文" {...this.props} />
				<Sidebar>
					<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)} />
				</Sidebar>
				<Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
					<TabPane tab="现场发文" key="1">
						<SendPage {...this.props} />
					</TabPane>
					<TabPane tab="现场收文" key="2">
						<ReceivePage {...this.props} />
					</TabPane>

					<TabPane tab="现场回文" key="3">
						<BackPage {...this.props} />
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
