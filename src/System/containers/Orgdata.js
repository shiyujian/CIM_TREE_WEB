import React, {Component} from 'react';
import {TableOrg, TableOrg2, ToggleModal, ToggleModal2, OrgCheck, ToggleModalCJ2, ToggleModalDel, ToggleModalUpdate, ToggleModalUpdate2} from '../components/OrgData'
import {actions as platformActions} from '_platform/store/global';
import {notification,Input} from "antd";
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/orgdata';
import {getUser} from '_platform/auth'
import {getNextStates} from '_platform/components/Progress/util';
import {actions as action2} from '../store/quality';
import {WORKFLOW_CODE} from '_platform/api'
var moment = require('moment');
const {TextArea} = Input;

// @connect(
// 	state => {
// 		const {system: {orgdata = {},persondata={}} = {}, platform} = state;
// 		return {...orgdata, platform}
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({...actions, ...platformActions,...action2}, dispatch)
// 	})
// )

@connect(
	state => {
		const {platform, system:{orgdata,persondata}} = state;
		return {platform,...orgdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions,...action2}, dispatch),
	}),
)
export default class Orgdata extends Component {
	constructor (props) {
		super(props);
		this.state = {
			update: 0
		}
	}
	//部门流程
	async setData(dataSource){
        const {actions:{logWorkflowEvent, updateWpData, addDocList, putDocList, postOrgList, getOrgRoot, putUnit, putProject, getProject, getUnitAc, getUnit, getOrgPk}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        let data_list = [];
        let promises = dataSource.map((o) => {
            return getOrgPk({code:o.direct})
        });
        let rst = await Promise.all(promises);
        dataSource.map((o, index) => {
            data_list.push({
                code: "" + o.code,
                name: o.depart,
                obj_type: "C_ORG",
                status: "A",
                version: "A",
                extra_params: {
                    org_type: o.type,
                    canjian: o.canjian,
                    direct: o.direct,
                    project: o.selectPro,
                    unit: o.selectUnit,
                    remarks: o.remarks
                },
                parent: {
                    code: ""+o.direct,
                    pk: rst[index].pk,
                    obj_type: "C_ORG"
                }
            })
        })
        await postOrgList({}, { data_list: data_list }).then(res => {
			let {update} = this.state;
			this.setState({
				update: update + 1
			})
            notification.success({
                message:"创建成功"
			});
        });
	}
	// 参建单位流程
	async setDataCJ(dataSource){
        
        const {actions:{  addDocList, putDocList, postOrgList, getOrgRoot, putUnit, putProject, getProject, getUnitAc, getUnit, getOrgPk}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        let data_list = [];
        let promises = dataSource.map((o) => {
            return getOrgPk({code:o.type})
        });
        let rst = await Promise.all(promises);
        dataSource.map((o, index) => {
            data_list.push({
                code: "" + o.code,
                name: o.canjian,
                obj_type: "C_ORG",
                status: "A",
                version: "A",
                extra_params: {
                    project: o.selectPro,
                    unit: o.selectUnit,
                    remarks: o.remarks,
                    org_type:o.type
                },
                parent: {
                    code:""+o.type,
                    pk: rst[index].pk,
                    obj_type: "C_ORG"
                }
            })
        })
        postOrgList({}, { data_list: data_list }).then(res => {
			let {update} = this.state;
			this.setState({
				update: update + 1
			})
        });
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{logWorkflowEvent}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent(
            {
                pk:wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '拒绝',
                note: '不通过',
                attachment: null,
            }
        );
        notification.success({
            message: "操作成功",
            duration: 2
        })
    }
	// 删除流程
	setDataDel(data,participants,description){
		console.log("data:",data);
		console.log("participants:",participants);
		// return; 
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "组织机构信息批量删除",
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
						notification.success({
							message:"流程发起成功"
						});
					}
				});
		});
	}
	// 更新流程
	setDataUpdate(data,participants,description){
		console.log("data:",data);
		console.log("participants:",participants);
		// return; 
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "组织机构信息批量更改",
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
						console.log("rst:",rst);
						notification.success({
							message:"流程发起成功"
						});
					}
				});
		});
	}
	render() {
		const {visible, visibleCJ, visibleDel, visibleUpdate} = this.props;
		console.log(this.props)
		return (
			<div>
				<DynamicTitle title="组织机构填报" {...this.props} />
				<Content>
					<TableOrg2 {...this.props} {...this.state} />
					{
						visible && <ToggleModal2 {...this.props} setData = {this.setData.bind(this)}/>
					}
					{
						visibleCJ && <ToggleModalCJ2 {...this.props} setDataCJ = {this.setDataCJ.bind(this)}/>
					}
					{
						visibleDel && <ToggleModalDel {...this.props} setDataDel = {this.setDataDel.bind(this)}/>
					}
					{
						visibleUpdate && <ToggleModalUpdate2 {...this.props} setDataUpdate = {this.setDataUpdate.bind(this)}/>
					}
				</Content>
			</div>
			)
	}
};
