import React, {Component} from 'react';
import {TablePerson, ToggleModal, PersonExpurgate, PersonModify} from '../components/PersonData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/persondata1';
import {getUser} from '_platform/auth'
import {getNextStates} from '_platform/components/Progress/util';
import {actions as action2} from '../store/quality';
import {WORKFLOW_CODE} from '_platform/api'
import {Notification} from "antd";
var moment = require('moment');

@connect(
	state => {
		const {platform,system:{persondata1}} = state;
		return {platform,...persondata1};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions,...action2}, dispatch),
	}),
)
export default class Personsdata extends Component {
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		console.log("data:",data);
		let personData = [];
		data.map((item, index) => {
			personData.push({
				account:{
					person_name:item.name,
					person_type:"C_PER",
					person_avatar_url:item.signature.preview_url,
					organization:{
						pk:item.orgpk,
						code:item.orgcode,
						name:item.org_names,
						obj_type:"C_ORG",
						rel_type:"member",
					}
				},
				basic_params:{
					info:{
						"电话":"" + item.tel,
						"性别":item.sex,
						"技术职称":item.job
					},
				},
				groups:[],
				email:item.email,
				is_active:true,
				password:item.tel,
				title:item.name,
				username:item.tel,
				extra_params:{}
			})
		})
		console.log("personData:",personData);
		let postdata = {
			name:"人员信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"人员信息批量录入",
			subject:[{
				data:JSON.stringify(personData)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		// return;
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起人员信息填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
					attachment:null
				}).then(rst => {
					if (rst) {
						Notification.success({
							message: "流程发起成功"
						});
					}else {
						Notification.error({
							message: "流程发起失败"
						})
					}
				});
		});
	}
	// 删除流程
	setDataDel(data,participants,description){
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "人员信息批量删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: description,
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: description,
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(rst => {
					if (rst) {
						Notification.success({
							message: "流程发起成功"
						});
					}else {
						Notification.error({
							message: "流程发起失败"
						})
					}
				});
		});
	}

	// 更新流程
	setDataUpdate(data,participants,description){
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "人员信息批量更改",
			code: WORKFLOW_CODE["数据报送流程"],
			description: description,
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: description,
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(rst => {
					if (rst) {
						Notification.success({
							message: "流程发起成功"
						});
					}else {
						Notification.error({
							message: "流程发起失败"
						})
					}
				});
		});
	}
	render() {
		const {visible, Exvisible, Modvisible} = this.props;
		return (
			<div>
				<DynamicTitle title="人员信息" {...this.props} />
				<Content>
					<TablePerson {...this.props} />
					{
						visible && <ToggleModal {...this.props} setData = {this.setData.bind(this)}/>
					}
					{
						Exvisible && <PersonExpurgate {...this.props} setDataDel = {this.setDataDel.bind(this)}/>
					}
					{
						Modvisible && <PersonModify {...this.props} setDataUpdate = {this.setDataUpdate.bind(this)}/>
					}
				</Content>
			</div>
			)
	}
};
