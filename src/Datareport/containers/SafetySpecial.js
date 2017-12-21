import React, { Component } from 'react';
import { TableOrg, ToggleModal } from '../components/SafetySpecial'
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/safetySpecial';
import { getUser } from '_platform/auth'
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
	goCancel = () => {
        this.setState({ setEditVisiable: false });
    }
	setData(data, participants) {
		console.log("data:", data);
		console.log("participants:", participants);
		// return;
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
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
		}
		createWorkflow({}, postdata).then((rst) => {
			console.log("rst", rst);
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: '发起安全专项填报',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
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
						visible && <ToggleModal {...this.props} setData={this.setData.bind(this)} key={this.state.newKey1} oncancel={this.goCancel.bind(this)}/>
					}
				</Content>
			</div>
		)
	}
};
