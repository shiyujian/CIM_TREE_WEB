import React, { Component } from 'react';
import { TableOrg, ToggleModal } from '../components/SafetySpecial'
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/safetySpecial';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { actions as action2 } from '../store/quality';
import { WORKFLOW_CODE } from '_platform/api'
var moment = require('moment');
@connect(
	state => {
		const { datareport: { safetySpecial }, platform } = state;
		return { ...safetySpecial, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...platformActions, ...actions, ...action2 }, dispatch),
	}),
)
export default class SafetySpecial extends Component {
	constructor() {
		super();
		this.state = {
			newKey1: Math.random(),
		}
	}
	goCancel() {
		this.setState({ setEditVisiable: false });
	}
	// 本次流程发起--属于  主动填报型
	setData(data, participants) {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = { // 流程创建者
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "安全专项信息批量录入",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "安全专项信息批量录入",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
			// "deadline": "2018-12-30" # 截止日期, 空填None,
		}
		createWorkflow({}, postdata).then(rst => { // 创建流程实例
			let nextStates = getNextStates(rst, rst.current[0].id); //根据当前节点获取流程下一步节点集合
			logWorkflowEvent({ pk: rst.id }, // 
				{
					next_states: [{ // 时间以及下一个节点执行人
						participants: [participants], // 参与的人
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					state: rst.current[0].id,
					executor: creator,
					action: '提交',
					note: '发起安全专项填报',
					attachment: null
				});
		});
	}
	render() {
		const { visible } = this.props;
		return (
			<div>
				<DynamicTitle title="安全专项" {...this.props} />
				<Content>
					<TableOrg {...this.props} />
					{
						visible && <ToggleModal {...this.props}
							maskClosable={false} setData={this.setData.bind(this)} key={this.state.newKey1}
							oncancel={this.goCancel.bind(this)} />
					}
				</Content>
			</div>
		)
	}
};
