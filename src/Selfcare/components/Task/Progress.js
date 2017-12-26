import React, { Component } from 'react';
import { Row, Col, Form, Popconfirm, Button, Input, message, notification } from 'antd';
import UserPicker from './UserPicker';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { WORKFLOW_CODE } from '_platform/api';
import JianyanpiCheck from 'Datareport/components/Quality/JianyanpiCheck';
import PriceListExamine from 'Datareport/components/CostListData/PriceListExamine';
import JianyanCheck from 'Datareport/components/Quality/JianyanCheck';
import DesignDataCheck from 'Datareport/components/DesignData/Check';
import SafetyDocCheck from 'Datareport/components/SafetyDoc/SafetyDocCheck';
import HiddenDangerCheck from 'Datareport/components/SafetyHiddenDanger/HiddenDangerCheck';
import ModalCheck from 'Datareport/components/ModalData/ModalCheck';
import OrgCheck from 'Datareport/components/OrgData/OrgCheck';
import HPModal from 'Datareport/components/ProjectData/HandleProjectModal';
import SumSpeedExamine from 'Datareport/components/CostListData/SumSpeedExamine';
import PersonCheck from 'Datareport/components/PersonData/PersonCheck';
import SumPlanCheck from 'Datareport/components/CostListData/SumPlanCheck';
import ProjectSumExamine from 'Datareport/components/CostListData/ProjectSumExamine';
import WorkCheckModal from 'Datareport/components/ScheduleData/WorkCheckModal';
import DesignCheckModal from 'Datareport/components/ScheduleData/DesignCheckModal';
import SafetySpecialCheck from 'Datareport/components/SafetySpecial/SafetySpecialCheck';
import UnitToggle from 'Datareport/components/UnitData/UnitToggle';
import VedioCheck from 'Datareport/components/VedioData/VedioCheck';
import VedioInfoCheck from 'Datareport/components/VedioData/VedioInfoCheck';
import DefectCheck from 'Datareport/components/Quality/DefectCheck';

const FormItem = Form.Item;
@connect(
	state => {
		const {selfcare: {task = {}} = {}, platform} = state || {};
		return {...task, platform};
	},
	dispatch => ({
	}),
)
export default class Progress extends Component {

	constructor(props) {
		super(props);
		this.state = {
			action: '',
			note: '',
			wk:{}
		}
	}

	render() {
		const { 
			state = {}, 
			task, 
			location, 
			states = [],
			dr_qua_jyp_visible,
			dr_qua_jy_visible,
			safety_doc_check_visible,
			safety_hidden_check_visible,
			modal_check_visbile,
			dr_base_org_visible,
			dr_xm_xx_visible,
			cost_pri_ck_visible,
			cost_sum_spd_visible,
			dr_base_person_visible,
			dr_qua_jsjh_visible,
			cost_pro_ck_visible,
			dr_wor_sg_visible,
			dr_de_sj_visible,
			Safety_Special_check_visible,
			dr_qua_unit_visible,
			design_check_visbile,
			safety_vedioCheck_visible,
			safety_vedioInfoCheck_visible,
			dr_qua_defect_visible
		} = this.props;
		const { actions = [] } = state;
		const { workflow: { code } = {}, id, name, subject = [] } = task;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const currentStates = states.find(state => state.id === +state_id) || {};
		const currentStateCode = currentStates.code;
		return (
			<div>
				<div>
					{
						actions.map((action, index) => {
							let link;
							if (code === WORKFLOW_CODE.设计计划填报流程) {
								//填报计划
								if (currentStateCode === 'START') {
									link = <Link to={`/design/plan/3?workflowID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//审查计划
									link = <Link to={`/design/plan/4?workflowID=${id}`}>{action}</Link>
								}
								//交付计划变更
							} else if (code === WORKFLOW_CODE.设计计划变更流程) {
								// 计划变更
								if (currentStateCode === 'START') {
									link = <Link to={`/design/plan/5?workflowID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//计划变更审查
									link = <Link to={`/design/plan/6?workflowID=${id}`}>{action}</Link>
								}
								//设计成果上报
							} else if (code === WORKFLOW_CODE.设计成果上报流程) {
								//设计上报
								if (currentStateCode === 'START') {
									link = <Link to={`/design/reportResult?workflowID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//设计审查
									link = <Link to={`/design/approvalResult?workflowID=${id}`}>{action}</Link>
								}
								//设计成果变更
							} else if (code === WORKFLOW_CODE.设计成果一般变更流程 || code === WORKFLOW_CODE.设计成果重大变更流程) {
								// 设计成果变更
								if (currentStateCode === 'START') {
									link = <Link to={`/design/modify?workflowID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//设计成果变更审查
									link = <Link to={`/design/modifyApproval?workflowID=${id}`}>{action}</Link>
								}
							} else if (code === 'TEMPLATE_022') { // 报批
								if(currentStateCode === 'START'){
									link = <Link to={`/overall/approval#${subject[0].unitInfo}&${subject[0].blockId}`}>{action}</Link>
								}else if(currentStateCode === 'STATE02'){
									link = <Link to={`/overall/approval#${subject[0].unitInfo}&${subject[0].blockId}`}>{action}</Link>
								}
								//总进度进度填报/审批
							} else if (code === WORKFLOW_CODE.总进度计划报批流程) {
								// 进度填报
								if (currentStateCode === 'START') {
									link = <Link to={`/schedule/totalreport?totalReportID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//进度审批
									link = <Link to={`/schedule/totalapproval?totalApprovalID=${id}`}>{action}</Link>
								}
								//总进度进度填报
							} else if (code === WORKFLOW_CODE.进度管控审批流程) {
								// 进度填报
								if (currentStateCode === 'START') {
									link = <Link to={`/schedule/stagereport?stageReportID=${id}`}>{action}</Link>
								} else if (currentStateCode === 'STATE02') {
									//进度审批
									link = <Link to={`/schedule/stageapproval?stageApprovalID=${id}`}>{action}</Link>
								}
							} else if (code === WORKFLOW_CODE.数据报送流程) {
								// 数据报送流程
								if(action === '通过'){
									action = '审核';
									link = <Button onClick={this.openModal.bind(this,name,id)}>{action}</Button>
								}
							} else {
								link = action;
							}
							if(action === '审核'){
								return link
							}else{
								return (link && <a onClick={this.toggleAction.bind(this, action)} key={index} style={{width:50,height:20,textAlign:'center',display:'inline-block',marginRight: 20,borderWidth:1,borderStyle:'solid',borderColor:'#ddd',borderRadius:5 }}>{link}</a>)
							}
						})
					}
				</div>
				{
					code === WORKFLOW_CODE.申请推迟总进度计划填报流程
						?
						this.renderDelay()
						:
						(code === WORKFLOW_CODE.设计计划填报流程 || code === WORKFLOW_CODE.设计计划变更流程 || code === WORKFLOW_CODE.设计成果上报流程 || code === WORKFLOW_CODE.设计成果一般变更流程
							|| code === WORKFLOW_CODE.设计成果重大变更流程 || code === WORKFLOW_CODE.总进度计划报批流程 || code === WORKFLOW_CODE.进度管控审批流程 || code === 'TEMPLATE_022'|| code === WORKFLOW_CODE.数据报送流程) ||
						this.renderContent()
				}
				{
					dr_qua_jyp_visible && 
					<JianyanpiCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_qua_jy_visible && 
					<JianyanCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					safety_doc_check_visible && 
					<SafetyDocCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					safety_hidden_check_visible && 
					<HiddenDangerCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					modal_check_visbile && 
					<ModalCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_base_org_visible && 
					<OrgCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_xm_xx_visible && 
					<HPModal wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					cost_pri_ck_visible && 
					<PriceListExamine wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					cost_sum_spd_visible && 
					<SumSpeedExamine wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_base_person_visible && 
					<PersonCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_qua_jsjh_visible && 
					<SumPlanCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					cost_pro_ck_visible && 
					<ProjectSumExamine wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_wor_sg_visible && 
					<WorkCheckModal wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_de_sj_visible && 
					<DesignCheckModal wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					Safety_Special_check_visible && 
					<SafetySpecialCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_qua_unit_visible && 
					<UnitToggle wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					design_check_visbile && 
					<DesignDataCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					safety_vedioCheck_visible && 
					<VedioCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					safety_vedioInfoCheck_visible && 
					<VedioInfoCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
				{
					dr_qua_defect_visible && 
					<DefectCheck wk={this.state.wk} closeModal={this.closeModal.bind(this)}/>
				}
			</div>
		);
	}

	//关闭数据报送模态框
	closeModal(key,value){
		const {actions:{changeDatareportVisible}} = this.props
		changeDatareportVisible({key,value})
	}
	async openModal(name,id){
		const {actions:{changeDatareportVisible,getWorkflowById}} = this.props
		let wk = await getWorkflowById({pk:id});
		console.log('wk',wk);
		this.setState({wk})
		switch (name){
			case "检验批验收信息批量录入":
				changeDatareportVisible({key:'dr_qua_jyp_visible',value:true})
				break;
			case "其它验收信息批量录入":
				changeDatareportVisible({key:'dr_qua_jy_visible',value:true})
				break;
			case "安全管理信息批量录入":
				changeDatareportVisible({key:'safety_doc_check_visible',value:true})
				break;
			case "安全隐患信息批量录入":
				changeDatareportVisible({key:'safety_hidden_check_visible',value:true})
				break;
			case "模型信息批量录入":
				changeDatareportVisible({key:'modal_check_visbile',value:true})
				break;
			case "设计信息批量录入":
				changeDatareportVisible({key:'design_check_visbile',value:true})
				break;
			case "组织机构信息批量录入":
				changeDatareportVisible({key:'dr_base_org_visible',value:true})
				break;
			case "项目信息批量录入":
				changeDatareportVisible({key:'dr_xm_xx_visible',value:true})
				break;
			case "计价清单信息填报":
				changeDatareportVisible({key:'cost_pri_ck_visible',value:true})
				break;
			case "结算进度信息填报":
				changeDatareportVisible({key:'cost_sum_spd_visible',value:true})
				break;
			case "人员信息批量录入":
				changeDatareportVisible({key:'dr_base_person_visible',value:true})
				break;
			case "结算计划信息填报":
				changeDatareportVisible({key:'dr_qua_jsjh_visible',value:true})
				break;
			case "工程量结算信息填报":
				changeDatareportVisible({key:'cost_pro_ck_visible',value:true})
				break;
			case "施工进度发起填报":
				changeDatareportVisible({key:'dr_wor_sg_visible',value:true})
				break;
			case "设计进度发起填报":
				changeDatareportVisible({key:'dr_de_sj_visible',value:true})
				break;
			case "安全专项信息批量录入":
				changeDatareportVisible({key:'Safety_Special_check_visible',value:true})
				break;
			case "单位工程信息批量录入":
				changeDatareportVisible({key:'dr_qua_unit_visible',value:true})
				break;
			case "视频监控批量录入":
				changeDatareportVisible({key:'safety_vedioCheck_visible',value:true})
				break;
			case "影像信息批量录入":
				changeDatareportVisible({key:'safety_vedioInfoCheck_visible',value:true})
				break;
			case "质量缺陷信息批量录入":
				changeDatareportVisible({key:'dr_qua_defect_visible',value:true})
				break;
			default:break;
		}
	}
	renderContent() {
		const { state = {}, actions = [], users = [] } = this.props;
		const { actions: [first = ''] = [] } = state;
		let { action } = this.state;
		if (!action) {
			action = first;
		}
		const finish = this.isFinish();
		const transitions = this.getTransitions(action, state.id);
		const nextStates = this.getNextStates(transitions);
		const transition = this.getTransition(action, state.id);
		const nextState = this.getNextState(transition);
		switch (action) { // 更具不同的操作进行不同的处理
			case '委托':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<Col span={24}>
								<Input style={{ width: '100%' }} size='large' onChange={this.changeNote.bind(this)} value={this.state.note}
									addonBefore={'委托意见'} placeholder="委托。" />
							</Col>
						</Row>
						<Row style={{ marginTop: 10 }}>
							<UserPicker state={nextState} actions={actions} onChange={this.changeDelegateUser.bind(this)} />
						</Row>

						<Row style={{ marginTop: 10 }}>
							<Col span={2}><Popconfirm title="确定委托吗？" onConfirm={this.handleDelegate.bind(this)}>
								<Button>确认委托</Button>
							</Popconfirm>
							</Col>
						</Row>
					</div>);
			case '退回':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<Col span={24}>
								<Input style={{ width: '100%' }} size='large' onChange={this.changeNote.bind(this)} value={this.state.note}
									addonBefore={'退回原因'} placeholder="退回" />
							</Col>
						</Row>
						<Row style={{ marginTop: 10 }}>
							<Col span={2}>
								<Popconfirm title="确定退回吗？" onConfirm={this.handleReject.bind(this)}>
									<Button>确认退回</Button>
								</Popconfirm>
							</Col>
						</Row>
					</div>);

			case '废止':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<Col span={2}><Popconfirm title="确定废止吗？" onConfirm={this.handleAbolish.bind(this)}>
								<Button>确认废止</Button>
							</Popconfirm>
							</Col>
						</Row>
					</div>);
			case '通过':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<FormItem {...Progress.layout} label="处理意见">
								<Input placeholder="请输入处理意见" onChange={this.changeNote.bind(this)} value={this.state.note} />
							</FormItem>
						</Row>
						{
							!finish && nextStates.map((state, index) => {
								return (<UserPicker key={index} state={state} actions={actions} onChange={this.changeSubmitUser.bind(this, state)} users2={users}/>);
							})
						}
						<Row style={{ marginTop: 10 }}>
							<Col span={2}>
								<Popconfirm title={'确定通过吗？'} onConfirm={this.handleSubmit.bind(this, transitions, nextStates)}>
									<Button>确认</Button>
								</Popconfirm>
							</Col>
						</Row>
					</div>);
			default:
				return;

		}
	}
	renderDelay() {
		const { state = {}, actions = [], task = {} } = this.props;
		const { actions: [first = ''] = [] } = state;
		let { action } = this.state;
		if (!action) {
			action = first;
		}

		const transitions = this.getTransitions(action, state.id);
		switch (action) {
			case '通过':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<FormItem {...Progress.layout} label="处理意见">
								<Input placeholder="请输入处理意见" onChange={this.changeNote.bind(this)} value={this.state.note} />
							</FormItem>
						</Row>
						<Row style={{ marginTop: 10 }}>
							<Col span={2}>
								<Popconfirm title="确定通过吗？" onConfirm={this.handleDelay.bind(this, transitions, task)}>
									<Button>确认通过</Button>
								</Popconfirm>
							</Col>
						</Row>
					</div>);
			case '不通过':
				return (
					<div>
						<Row style={{ marginTop: 10 }}>
							<FormItem {...Progress.layout} label="处理意见">
								<Input placeholder="请输入处理意见" onChange={this.changeNote.bind(this)} value={this.state.note} />
							</FormItem>
						</Row>
						<Row style={{ marginTop: 10 }}>
							<Col span={2}>
								<Popconfirm title="确定不通过吗？" onConfirm={this.handleCancel.bind(this, transitions, task)}>
									<Button>确认不通过</Button>
								</Popconfirm>
							</Col>
						</Row>
					</div>);
			default:
				return;
		}
	}
	handleDelay(transitions = [], task = {}) {
		const {
            actions: {
                putFlow,
			patchDeadline,
			postSubject,
			getWorkflowById
            }
		} = this.props;
		const {
			note
		} = this.state
		let me = this;
		let subject = task.subject[0];
		const user = getUser();
		let state = transitions[0].from_state;
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};
		let action = "不通过";
		let attachment = null;
		let postdata = {
			state: state,
			executor: executor,
			action: action,
			note: note,
			attachment: attachment
		};
		let data = {
			pk: task.id
		}
		let reReportTimeData = subject.reReportTimeData ? JSON.parse(subject.reReportTimeData) : {};
		let reReportTime = subject.delayReportTime ? JSON.parse(subject.delayReportTime) : {};
		let patchReportTime = {
			deadline: reReportTime,
		}

		let reApprovalTimeData = subject.reApprovalTimeData ? JSON.parse(subject.reApprovalTimeData) : {};
		let reApprovalTime = subject.delayApprovalTime ? JSON.parse(subject.delayApprovalTime) : {};
		let patchApprovalTime = {
			deadline: reApprovalTime,
		}

		//修改填报时间
		patchDeadline(reReportTimeData, patchReportTime).then(value => {
			if (value && value.deadline) {
				//修改审核时间
				patchDeadline(reApprovalTimeData, patchApprovalTime).then(value => {
					if (value && value.deadline) {
						let changeData = {
							pk: reReportTimeData.ppk
						}
						getWorkflowById(changeData).then((rst) => {
							if (rst && rst.subject) {
								let oldSubject = rst.subject[0];
								let newSubject = [{
									"project": oldSubject.project,
									"unit": oldSubject.unit,
									"constructionUnit": oldSubject.constructionUnit,
									"reportTime": JSON.stringify(reReportTime),
									"approvalLimit": oldSubject.approvalLimit,
									"constructionMember": oldSubject.constructionMember,
									"supervisionUnit": oldSubject.supervisionUnit,
									"supervisionMember": oldSubject.supervisionMember,
									"approvalTime": JSON.stringify(reApprovalTime),
									"remark": oldSubject.remark,
									"attachment": oldSubject.attachment,
									"uploadModelFile": oldSubject.uploadModelFile,
									"file": oldSubject.file,
									"fdbConnectStr": oldSubject.fdbConnectStr
								}];
								let changeSubject = {
									subject: newSubject
								}

								//修改subject
								postSubject(changeData, changeSubject).then(sub => {
									if (sub && sub[0]) {
										putFlow(data, postdata).then(rst => {
											if (rst && rst.creator) {
												notification.success({
													message: '流程提交成功',
													duration: 2
												})
											} else {
												notification.error({
													message: '流程提交失败',
													duration: 2
												})
												return;
											}
										})

									} else {
										notification.error({
											message: '流程提交失败',
											duration: 2
										})
										return;
									}
								})
							}
						})

					} else {
						notification.error({
							message: '流程提交失败',
							duration: 2
						})
						return;
					}
				})

			} else {
				notification.error({
					message: '流程提交失败',
					duration: 2
				})
				return;
			}
		})
	}
	handleCancel(transitions = [], task = {}) {
		const {
            actions: {
                putFlow,
            }
		} = this.props;
		const {
			note
		} = this.state
		let me = this;
		const user = getUser();
		let state = transitions[0].from_state;
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};
		let action = "通过";
		let attachment = null;
		let postdata = {
			state: state,
			executor: executor,
			action: action,
			note: note,
			attachment: attachment
		};
		let data = {
			pk: task.id
		}

		putFlow(data, postdata).then(rst => {
			if (rst && rst.creator) {
				notification.success({
					message: '流程提交成功',
					duration: 2
				})
			} else {
				notification.error({
					message: '流程提交失败',
					duration: 2
				})
				return;
			}
		})


	}
	closeTab() {
		//关闭当前标签页
		document.querySelector('.ant-tabs-tab-active.ant-tabs-tab .anticon-close').click();
	}

	changeDelegateUser(users) {
	}

	changeNote(event) {
		this.setState({
			note: event.target.value
		})
	}

	changeSubmitUser(state, users) {
		this.setState({ [`submitUsers-${state.id}`]: users });
	}


	handleSubmit(transitions = [], nextStates = []) {
		const { action } = this.state;
		const {
			actions: { putFlow, getTask }, location, task: { id } = {},
		} = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const currentUser = Progress.getCurrentUser();
		const states = nextStates.map(state => {
			const users = this.state[`submitUsers-${state.id}`] || {};
			if (users.length) {
				const persons = users.map(user => {
					const account = user.account || {};
					return ({
						id: user.id,
						username: user.username,
						person_name: account.person_name,
						person_code: account.person_code
					})
				});
				return {
					state: state.id,
					participants: persons,
					deadline: null,
					remark: ''
				}
			}
		}).filter(h => !!h);
		if (nextStates.length === states.length) {
			putFlow({ pk: id }, {
				next_states: states,
				state: state_id,
				executor: currentUser,
				action: action,
				note: this.state.note,
				attachment: null,
			}).then(rst => {
				getTask({ task_id: id });
				if (rst.id) {
					notification.success({
						message: '流程处理成功',
						duration: 2
					})
				} else {
					notification.error({
						message: '流程处理失败',
						duration: 2
					});
				}
			});
		}
	}

	handleDelegate() {

	}

	handleReject() {
		const {
			actions: { putFlow, getTask },
			task: { id } = {}, location
		} = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const { action } = this.state;
		const currentUser = Progress.getCurrentUser();

		putFlow({ pk: id }, {
			'state': state_id,
			'executor': currentUser,
			'action': action,
			'note': this.state.note,
			'attachment': null,
		}).then(rst => {
			if (rst.id) {
				getTask({ task_id: id });
			}
		});
	}

	handleAbolish() {
		const {
			actions: { abolishFlow },
			task: { id } = {}, location
		} = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};

		abolishFlow({ pk: id }, {
			"state": state_id,
			"note": "废止原因"
		})
	}

	toggleAction(action) {
		this.setState({ action, note: '' });
		//this.closeTab();
	}

	isFinish() {
		const { state: { state_type } = {} } = this.props;
		return state_type === 0;
	}

	getTransitions(action, stateId) {
		const { transitions = [] } = this.props;
		return transitions.filter(transition => transition.from_state === stateId && action === transition.name);
	}

	getTransition(action, stateId) {
		const { transitions = [] } = this.props;
		return transitions.find(transition => transition.from_state === stateId && action === transition.name);
	}

	getNextStates(transitions = []) {
		const { states = [] } = this.props;
		return states.filter(state => transitions.some(transition => transition.to_state === state.id))
	}

	getNextState(transition = {}) {
		const { states = [] } = this.props;
		return states.find(state => transition.to_state === state.id);
	}

	static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 16 },
	};

	static getCurrentUser() {
		const user = getUser();
		return { id: +user.id, username: user.username, person_name: user.name, person_code: user.code }
	};

}
