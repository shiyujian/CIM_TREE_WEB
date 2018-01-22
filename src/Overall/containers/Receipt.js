import React, {Component} from 'react';
import {DynamicTitle,Sidebar} from '_platform/components/layout';
import {actions} from '../store/receipt';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Tabs} from 'antd';
import { getUser } from '_platform/auth';
import NewsTable from '../components/Receipt/NewsTable'
import TipsTable from '../components/Receipt/TipsTable'
// import ProjectTree from '../components/Receipt/ProjectTree'

const TabPane = Tabs.TabPane;

@connect(
	state => {
		const {overall: {receipt = {}}, platform} = state || {};
		return {...receipt, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Receipt extends Component {
	static propTypes = {};

	
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


	//新闻和通知的切换
	tabChange(tabValue) {
		const {actions: {setTabActive}} = this.props;
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
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="现场收发文" {...this.props}/>
				<Sidebar>
					{/* <ProjectTree {...this.props} onSelect={this.onSelect.bind(this)} /> */}
				</Sidebar>
				<Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
					<TabPane tab="现场发文" key="1">
						<NewsTable {...this.props}/>
					</TabPane>
					<TabPane tab="现场收文" key="2">
						<TipsTable {...this.props}/>
					</TabPane>
					<TabPane tab="现场回文" key="3">
						{/* <TipsTable {...this.props}/> */}
					</TabPane>
				</Tabs>
				
			</div>
		);
	}
}
