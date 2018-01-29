import React, { Component } from 'react';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/attend';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UnitTree, Statistics, Lookout } from '../components/Attend/'
import { Tabs, Spin } from 'antd';
import moment from 'moment';

const TabPane = Tabs.TabPane;

@connect(
	state => {
		const { overall: { attend = {} }, platform } = state || {};
		return { ...attend, platform };
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions, ...actions }, dispatch),
	}),
)
export default class Attend extends Component {

	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			unitTreeLoading: true
		}
	}

	componentDidMount() {
		const {
			actions: {
				getOrgTree,
			setCountSelectedAc,
			setSearchSelectedAc,
			setLoadingAc,
			getCountInfoAc,
			getSearchInfoAc,
			setCountTimeAc,
			setSearchTimeAc,
			getPersonsAc
			}
		} = this.props;
		setCountTimeAc({
			fromyear: moment().year(),
			frommonth: moment().month() + 1,
			toyear: moment().year(),
			tomonth: moment().month() + 1
		});
		setSearchTimeAc({
			year: moment().year(),
			month: moment().month() + 1,
		});
		setLoadingAc(true);
		getOrgTree()
			.then(rst => {
				setCountSelectedAc(String(rst.children[0].code) + '--' + rst.children[0].name);
				getCountInfoAc({
					code: String(rst.children[0].code),
					fromyear: moment().year(),
					frommonth: moment().month() + 1,
					toyear: moment().year(),
					tomonth: moment().month() + 1
				}).then(() => {
					setLoadingAc(false)
				});
				setSearchSelectedAc(String(rst.children[0].code) + '--' + rst.children[0].name);
				getSearchInfoAc({
					code: String(rst.children[0].code),
					year: moment().year(),
					month: moment().month() + 1,
				});
				getPersonsAc({
					code: String(rst.children[0].code)
				});
				this.setState({ unitTreeLoading: false })
			});
	}

	//统计和查询切换
	tabChange(tabValue) {
		const { actions: { setTabActive } } = this.props;
		setTabActive(tabValue);
	}

	render() {
		const {
			tabValue = '1',
			loading = false
		} = this.props;
		const { unitTreeLoading } = this.state;
		return (
			<div>
				<DynamicTitle title="考勤管理" {...this.props} />
				<Sidebar>
					<UnitTree {...this.props} loading={unitTreeLoading} />
				</Sidebar>
				<Content>
					<Spin tip="数据加载中，请稍后..." spinning={loading}>
						<Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
							<TabPane tab="人员考勤" key="1">
								<Lookout {...this.props} />
							</TabPane>
							<TabPane tab="进离场管理" key="2">
								<Statistics {...this.props} />
							</TabPane>

						</Tabs>
					</Spin>
				</Content>
			</div>
		);
	}
}


