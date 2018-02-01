import React, { Component } from 'react';
import { Steps, Button, Cascader, message, Input, Col, Row, Card, notification } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import { WORKFLOW_MAPS } from '_platform/api';
import { Link } from 'react-router-dom';
import Progress from './Progress';
import queryString from 'query-string';
import { WORKFLOW_CODE } from '../../../_platform/api';
import TextArea from 'antd/lib/input/TextArea';
import { getNextStates } from '../../../_platform/components/Progress/util';

const Step = Steps.Step;
export default class TaskStep extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			user: null,
			note: '同意',
		};
	}

	render() {
		const { platform: { task = {}, users = {} } = {}, location, actions } = this.props;
		const { history = [], transitions = [], states = [] } = task;
		const user = TaskStep.getCurrentUser();

		if (task && task.workflow && task.workflow.code) {
			let code = task.workflow.code;
			let name = task.current ? task.current[0].name : '';

			
			if (code === WORKFLOW_CODE.总进度计划报批流程 && name == '初审') {
				return this.renderResource(task);
			} else if (code === WORKFLOW_CODE.总进度计划报批流程 && name === '复审') {
				return this.renderResource(task);
			} else if (code === WORKFLOW_CODE.每日进度填报流程 && name === '初审') {
				return this.renderResource(task);
			} else if (code === WORKFLOW_CODE.每日进度填报流程 && name === '复审') {
				return this.renderResource(task);
			} else {
				return (
					<div>
						<h3 style={{ marginBottom: 20 }}>审批流程</h3>
						<Steps direction="vertical" size="small" current={history.length - 1}>
							{
								history.map((step, index) => {
									const { state: { participants: [{ executor = {} } = {}] = [] } = {} } = step;
									const { id: userID } = executor || {};
									if (step.status === 'processing') { // 根据历史状态显示
										const state = this.getCurrentState();
										return (
											<Step title={
												<div style={{ marginBottom: 8 }}>
													<span>{step.state.name}-(执行中)</span>
													<span style={{ paddingLeft: 20 }}>当前执行人: </span>
													<span style={{ color: '#108ee9' }}> {`${executor.person_name}` || `${executor.username}`}</span>
												</div>}
												description={
													userID === +user.id && <Progress state={state} states={states} transitions={transitions} props={this.props}
														actions={actions} task={task} location={location} />} key={index} />

										)
									} else {
										const { records: [record] } = step;
										const { log_on = '', participant: { executor = {} } = {}, note = '' } = record || {};
										const { person_name: name = '', organization = '' } = executor;
										return (
											<Step key={index} title={`${step.state.name}-(${step.status})`}
												description={
													<div style={{ lineHeight: 2.6 }}>
														<div>审核意见：{note}</div>
														<div>
															<span>审核人:{`${name}` || `${executor.username}`} [{organization}]</span>
															<span
																style={{ paddingLeft: 20 }}>审核时间：{moment(log_on).format('YYYY-MM-DD HH:mm:ss')}</span>
														</div>
													</div>} />);
									}
								}).filter(h => !!h)
							}
						</Steps>
					</div>
				)
			}
		} else {
			return null
		}
	}

	renderResource(task = {}) {
		const { platform: { users = {} } = {}, location, actions } = this.props;
		const { current, history = [], transitions = [], states = [] } = task;
		let code = task.workflow.code;
		let name = task.current ? task.current[0].name : '';

		let user = getUser(),
			PostData = null,
			remark = '',
			currentExecutorIdList = [],
			canExecute = false,
			executor = '';
		if (task.subject) {
			let subject = task.subject[0]
			PostData = subject.postData ? JSON.parse(subject.postData) : null
		}

		if (current instanceof Array) {
			current.map(item => {
				if (item.participants instanceof Array) {
					currentExecutorIdList.push(item.participants[0].executor.id)
				}
			})
		}
		currentExecutorIdList.map(item => {
			if (item === user.id) {
				canExecute = true;
			}
		})
		task.workflow.states.map(item => {

			if (item.name === '初审') {
				executor = item.participants[0].executor.person_name;
			}

		})

		task.history.map(item => {
			if (item.status === '通过' || item.status === '退回') {
				remark = item.records[0].note;
			} else {
				remark = '';
			}
		})

		return (
			<div>
				<div>
					<h3 style={{ marginBottom: 20 }}>审批流程</h3>
					<Steps direction="vertical" size="small" current={history.length - 1}>
						{
							history.map((step, index) => {
								const { state: { participants: [{ executor = {} } = {}] = [] } = {} } = step;
								const { id: userID } = executor || {};
								if (step.status === 'processing') { // 根据历史状态显示
									const state = this.getCurrentState();
									return (
										<Step title={
											<div style={{ marginBottom: 8 }}>
												<span>{step.state.name}-(执行中)</span>
												<span style={{ paddingLeft: 20 }}>当前执行人: </span>
												<span style={{ color: '#108ee9' }}> {`${executor.person_name}` || `${executor.username}`}</span>
											</div>}
											description={
												userID === +user.id && <Progress state={state} states={states} transitions={transitions} props={this.props}
													actions={actions} task={task} location={location} />} key={index} />

									)
								} else {
									const { records: [record] } = step;
									const { log_on = '', participant: { executor = {} } = {}, note = '' } = record || {};
									const { person_name: name = '', organization = '' } = executor;
									return (
										<Step key={index} title={`${step.state.name}-(${step.status})`}
											description={
												<div style={{ lineHeight: 2.6 }}>
													<div>审核意见：{note}</div>
													<div>
														<span>审核人:{`${name}` || `${executor.username}`} [{organization}]</span>
														<span
															style={{ paddingLeft: 20 }}>审核时间：{moment(log_on).format('YYYY-MM-DD HH:mm:ss')}</span>
													</div>
												</div>} />);
								}
							}).filter(h => !!h)
						}
					</Steps>
					{
						(task.current && canExecute)
							?
							<div>
								<Row style={{ marginBottom: '20px' }}>
									<Col span={4}>
										<span>执行意见：</span>
									</Col>
								</Row>
								<Row style={{ margin: '20px 0' }}>
									<Col>
										<Input type='textarea' id='remark' rows={4} />
									</Col>
								</Row>
							</div>
							:
							''
					}


				</div>
				{
					(task.current && canExecute)
						?
						name == '初审' ?
							<div style={{ textAlign: 'center', marginTop: 10 }}>
								<Button type='primary' onClick={this.handleSubmit.bind(this, task)} style={{ marginRight: 20 }}>提交</Button>
								<Button onClick={this.handleReject.bind(this, task)}>退回</Button>
							</div>
							:
							<div style={{ textAlign: 'center', marginTop: 10 }}>
								<Button type='primary' onClick={this.passSubmit.bind(this, task)} style={{ marginRight: 20 }}>通过</Button>
								<Button onClick={this.handleReject.bind(this, task)}>退回</Button>
							</div>
						:
						''
				}

			</div>
		)


	}
	passSubmit(task={}) {
		const {
			location,
			actions: {
					putFlow,
					addDaySchedule,
				},
		} = this.props
		const { state_id = '0' } = queryString.parse(location.search) || {};
		console.log('state_id', state_id)

		let me = this;
		const user = getUser();
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};
		// 获取流程的action名称
		let action_name = '';
		let nextStates = getNextStates(task, Number(state_id));
		console.log('nextStates', nextStates)
		for (var i = 0; i < nextStates.length; i++) {
			if (nextStates[i].action_name = '通过') {
				action_name = nextStates[i].action_name
			}
		}
		let note = document.querySelector('#remark').value;
		if (!note) {
			note = action_name + '。';
		}
		let state = task.current[0].id;
		let workflow = {
			state: state,
			executor: executor,
			action: action_name,
			note: note,
			attachment: null
		}
		let data = {
			pk: task.id
		}

		putFlow(data, workflow).then(rst => {
			if (rst && rst.creator) {
				notification.success({
					message: '流程通过成功',
					duration: 2
				})
				if(rst.workflow.name=='每日进度填报流程'){
					console.log('rst',rst)
					let postdata = rst.subject[0].postData ? JSON.parse(rst.subject[0].postData) : '';
					let treedatasource = rst.subject[0].treedataSource ? JSON.parse(rst.subject[0].treedataSource) : '';
					console.log('treedatasource',treedatasource)
					let items = [];
					treedatasource.map(item=>{
						let data = {
							Num:item.number,
							Project:item.project,
							WPNo:'',
						}
						items.push(data)
					})
					let scheduledata = {
						DocType:'doc',
						Items:items,
						ProgressNo:'01',
						ProgressTime:postdata.timedate,
						ProgressType:postdata.type,
						SMS:0,
						UnitProject:postdata.unit,
						WPNo:''
					}
					// 日进度入库
					addDaySchedule({},scheduledata).then(item=>{
						console.log('item',item)
						if(item&&item.msg){
							notification.success({
								message:"上传数据成功",
								duration:2
							})
						}else{
							notification.error({
								message:"上传数据失败",
								duration:2
							})
						}	
					})
				}
				let to = `/selfcare`;
				me.props.history.push(to)
			} else {
				notification.error({
					message: '流程通过失败',
					duration: 2
				})
			}
		})



	}
	handleSubmit(task = {}) {
		const {
			location,
			actions: {
					putFlow,
					addDaySchedule
				},
		} = this.props
		
		const { state_id = '0' } = queryString.parse(location.search) || {};
		console.log('state_id', state_id)

		let me = this;
		const user = getUser();
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};
		let nextUser = {};
		me.props.form.validateFields((error, values) => {
			if (!error) {
				nextUser = values.dataReview;
				// 获取流程的action名称
				let action_name = '';
				let nextStates = getNextStates(task, Number(state_id));
				let stateid = nextStates[0].to_state[0].id
				for (var i = 0; i < nextStates.length; i++) {
					if (nextStates[i].action_name = '通过') {
						action_name = nextStates[i].action_name
					}
				}
				console.log('nextStates', nextStates)
				let note = document.querySelector('#remark').value;
				if (!note) {
					note = action_name + '。';
				}
				let state = task.current[0].id;
				let workflow = {
					next_states: [
						{
							state: stateid,
							participants: [nextUser],
							dealine: null,
							remark: null,
						}
					],
					state: state,
					executor: executor,
					action: action_name,
					note: note,
					attachment: null
				}
				let data = {
					pk: task.id
				}

				putFlow(data, workflow).then(rst => {
					if (rst && rst.creator) {
						notification.success({
							message: '流程通过成功',
							duration: 2
						})
						let to = `/selfcare`;
						me.props.history.push(to)
					} else {
						notification.error({
							message: '流程通过失败',
							duration: 2
						})
					}
				})
			}
		})



	}

	handleReject(task = {}) {
		const {
			location,
			actions: {
				putFlow
			},
		} = this.props

		const { state_id = '0' } = queryString.parse(location.search) || {};

		let me = this;
		//获取登陆用户信息
		const user = getUser();
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};

		//获取流程的action名称
		let action_name = '';
		let nextStates = getNextStates(task, Number(state_id));
		for (var i = 0; i < nextStates.length; i++) {
			if (nextStates[i].action_name == '退回') {
				action_name = nextStates[i].action_name
			}
		}
		console.log('nextStates', nextStates)
		let note = document.querySelector('#remark').value;
		if (!note) {
			note = action_name + '。';
		}

		let state = task.current[0].id;
		let workflowData = {
			state: state,
			executor: executor,
			action: action_name,
			note: note,
			attachment: null
		}
		console.log('workflowData', workflowData)

		let data = {
			pk: task.id
		}

		putFlow(data, workflowData).then(rst => {
			console.log('rst', rst)
			if (rst && rst.creator) {
				notification.success({
					message: '流程退回成功',
					duration: 2
				})

				let to = `/selfcare`;
				me.props.history.push(to)
			} else {
				notification.error({
					message: '流程退回失败',
					duration: 2
				})
			}
		})
	}

	getCurrentState() {
		const { platform: { task = {} } = {}, location = {} } = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const { states = [] } = task;
		return states.find(state => state.status === 'processing' && state.id === +state_id);
	}

	handleJump = () => {
		const {
			platform: {
				task = {}
			} = {}
		} = this.props;
		const currentUser = TaskStep.getCurrentUser();
		let currentStateID = null;
		let currentStateCode = '';
		const workflowID = task.id;
		let linkText = "前往处理";
		if (task.current) {
			const currentTemplate = task.workflow.code
			//获取正在执行中的stateID
			for (var i = 0; i < task.current.length; i++) {
				let participants = task.current[i].participants;
				for (var s = 0; s < participants.length; s++) {
					if (currentUser.id === participants[s].executor.id) {
						currentStateID = task.current[i].id;
						currentStateCode = task.current[i].code;
					}
				}
			}
			//交付计划填报流程
			if (currentTemplate === 'TEMPLATE_013') {
				//填报计划
				if (currentStateCode === 'START') {
					return <Link to={`/design/plan/3?workflowID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//审查计划
					return <Link to={`/design/plan/4?workflowID=${workflowID}`}>{linkText}</Link>
				}
				//交付计划变更
			} else if (currentTemplate === 'TEMPLATE_014') {
				// 计划变更
				if (currentStateCode === 'START') {
					return <Link to={`/design/plan/5?workflowID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//计划变更审查
					return <Link to={`/design/plan/6?workflowID=${workflowID}`}>{linkText}</Link>
				}
				//设计成果上报
			} else if (currentTemplate === 'TEMPLATE_015') {
				//设计上报
				if (currentStateCode === 'START') {
					return <Link to={`/design/reportResult?workflowID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//设计审查
					return <Link to={`/design/approvalResult?workflowID=${workflowID}`}>{linkText}</Link>
				}
				//设计成果变更
			} else if (currentTemplate === 'TEMPLATE_016' || currentTemplate === 'TEMPLATE_019') {
				// 设计成果变更
				if (currentStateCode === 'START') {
					return <Link to={`/design/modify?workflowID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//设计成果变更审查
					return <Link to={`/design/modifyApproval?workflowID=${workflowID}`}>{linkText}</Link>
				}
				//总进度进度填报/审批
			} else if (currentTemplate === 'TEMPLATE_028') {
				// 进度填报
				if (currentStateCode === 'START') {
					return <Link to={`/schedule/totalreport?totalID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//进度审批
					return <Link to={`/schedule/totalapproval?totalID=${workflowID}`}>{linkText}</Link>
				}
				//总进度进度填报
			} else if (currentTemplate === 'TEMPLATE_029') {
				if (currentStateCode === 'STATE02') {
					//进度填报
					return <Link to={`/schedule/totalreport?delayID=${workflowID}`}>{linkText}</Link>
				}
				//进度管控 进度填报/审批
			} else if (currentTemplate === 'TEMPLATE_031') {
				// 进度填报
				if (currentStateCode === 'START') {
					return <Link to={`/schedule/stagereport?stageID=${workflowID}`}>{linkText}</Link>
				} else if (currentStateCode === 'STATE02') {
					//进度审批
					return <Link to={`/schedule/stageapproval?stageID=${workflowID}`}>{linkText}</Link>
				}
			}
		}
	}

	renderProcessingStep(step, index) {
		const user = getUser();
		const { platform: { task = {} } = {} } = this.props;
		const { id } = TaskStep.getCurrentUser();
		const { current: [{ participants = [], id: stateId } = {}] = [], states } = task;
		const currentState = states.find(status => +status.id === +stateId);
		const { actions = [] } = currentState || {};
		// 根据当前执行人是不是当前用户 来判断是不是做action渲染
		const isCurrentUser = participants.some((participant = {}) => {
			const { executor } = participant;
			return executor.id === id;
		});
		return (
			<Step key={index}
				title={<div>
					<span>{step.state.name}-(执行中)</span>
					<span style={{ paddingLeft: 20 }}>当前执行人:</span>
					<span style={{ color: '#108ee9' }}>{user.name} [{user.org}]</span>
				</div>}
				description={isCurrentUser && (
					<div>
						{
							actions.map((action, index) => {
								return (<div key={index}>{this.renderAction(action, stateId)}</div>)
							})
						}
					</div>)} />);
	}

	renderAction(action, currentStateId) {
		const transition = this.getTransition(action, currentStateId) || {};
		switch (action) { // 更具不同的操作进行不同的处理
			case '填报':
				return this.renderFill(transition);
			case '通过':
				if (this.isFinish(transition)) { //当最后一步操作时候，不渲染人员选择器, 无需指定下一个人。
					return this.renderFinish(transition);
				} else {
					return this.renderApprove(transition);
				}
			// return this.renderApprove(transition);
			case '退回':
				return this.renderBack(transition);
			default:
				return null;
		}
	}

	renderFill(transition) {
		const { platform: { task = {} } = {} } = this.props;
		switch (task.type) {
			case WORKFLOW_MAPS.OVERALL_PACKAGE.name: // 施工包划分中的填报处理
				return (
					<Button>
						<Link to={`/overall/${task.id}`}>{transition.name}</Link>
					</Button>);
			default:
				return null;
		}
	}

	renderApprove(transition) {
		const { users = [] } = this.props;
		return (
			<div>
				<Row gutter={24} style={{ marginBottom: '16px' }}>
					<Col span={12}>
						<Input placeholder="请填写备注" onChange={this.changeNote.bind(this)} />
					</Col>
					<Col span={12}>
						<span>下一步审核人:</span>
						<span>
							<Cascader options={users} expandTrigger="hover" placeholder="请选择下一步审核人"
								value={this.state.user}
								onChange={this.changeUser.bind(this)}
								displayRender={TaskStep.displayRender} />
						</span>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						<Button onClick={this.approve.bind(this, transition)}>{transition.name}</Button>
					</Col>
				</Row>
			</div>);
	}

	renderFinish(transition) {
		const { platform: { task = {} } = {} } = this.props;
		let finish = this.finish;
		switch (task.type) {
			case WORKFLOW_MAPS.OVERALL_PACKAGE.name: // 施工包划分中的填报处理
				finish = this.approveFill;
				break;
			default:
				finish = this.finish;
				break;
		}
		return (<Button onClick={finish.bind(this, transition)}>{transition.name}</Button>);
	}

	renderBack(transition) {
		const { platform: { task = {} } = {} } = this.props;
		let back = this.back;
		switch (task.type) {
			case WORKFLOW_MAPS.OVERALL_PACKAGE.name: // 施工包划分中的填报处理
				back = this.backFill;
				break;
			default:
				back = this.back;
				break;
		}
		return (<Button onClick={back.bind(this, transition)}>{transition.name}</Button>)
	}


	// 执行通过操作
	approve(transition) {
		const {
			actions: { addActor, putFlow, getTask },
			platform: { task: { current: [{ id }] = [{}], } } = {},
			match: { params: { task_id } } = {},
		} = this.props;
		if ((this.state.user === null) || (this.state.user.length === 0)) {
			message.error('请先选择审核人');
			return
		}
		const nextUser = this.getNextUser();
		if (!nextUser) {
			message.error('请先选择审核人');
		}
		const currentUser = TaskStep.getCurrentUser();
		if (nextUser) {
			addActor({ ppk: task_id, pk: transition.to_state },
				{
					participants: [nextUser],
					remark: this.state.note,
				}).then(rst => {
					//	获取个人任务数量,重新设置任务数量
					const userValue = getUser();
					// getTasks({}, {task: 'processing', executor: userValue.id})
					// 	.then(tasks => {
					// 		// setUser(userValue.username, userValue.id, userValue.name, userValue.org, tasks.length);
					// 	});
					putFlow({ pk: task_id }, {
						'state': id,
						'executor': currentUser,
						'action': transition.name,
						'note': this.state.note,
						'attachment': null,
					}).then(rst => {
						getTask({ task_id });
					});
				});
		}
	}

	// 执行返回操作
	back(transition) {
		const {
			actions: { putFlow, getTask },
			platform: { task: { current: [{ id }] = [{}], } } = {},
			match: { params: { task_id } } = {},
		} = this.props;
		const currentUser = TaskStep.getCurrentUser();

		putFlow({ pk: task_id }, {
			'state': id,
			'executor': currentUser,
			'action': transition.name,
			'note': this.state.note,
			'attachment': null,
		}).then(rst => {
			getTask({ task_id });
		});
	}

	finish(transition) {
		const {
			actions: { putFlow, getTask },
			platform: { task: { current: [{ id }] = [{}], } } = {},
			match: { params: { task_id } } = {},
		} = this.props;
		const currentUser = TaskStep.getCurrentUser();

		putFlow({ pk: task_id }, {
			'state': id,
			'executor': currentUser,
			'action': transition.name,
			'note': this.state.note,
			'attachment': null,
		}).then(rst => {
			getTask({ task_id });
		});
	}

	componentDidMount() {
		// const { getUsers } = this.props.actions;
		// getUsers();
	}

	getTransition(action, stateId) {
		const { platform: { task: { transitions = [] } = {} } } = this.props;
		return transitions.find(transition => transition.from_state === stateId && action === transition.name);
	}

	isFinish(transition = {}) { // 当某个transition 的 to_state 指向最后一个state时，为完成操作
		const { platform: { task: { states = [] } = {} } } = this.props;
		const last = states[states.length - 1] || {};
		return transition.to_state === last.id;
	}

	changeUser(value) {
		this.setState({
			user: value,
		});
	}

	changeNote(value) {
		this.setState({ note: value.target.value });
	}

	getNextUser() {
		let nextUser = null;
		const { users = [] } = this.props;
		const [, id] = this.state.user;
		users.forEach(({ children }) => {
			const next = children.find(u => +u.value === +id);
			if (next) {
				nextUser = next;
			}
		});
		return {
			id: nextUser.value,
			name: nextUser.label,
			username: nextUser.username,
			org: nextUser.org
		};
	}

	approveFill(transition) {
		//TODO 通过的时候只修改了施工包数据，通过流程的接口未调用
		const {
			actions: { postPackage, getPackage, putPackage },
			platform: {
				task: {
					subject = []
				}
			}
		} = this.props;
		let { ptrTreeData, itmTreeData, unit } = subject[0];
		let unitCode = JSON.parse(unit).code;
		//分部
		let promisePtrs = [];
		//子分部
		let promisePtrs_s = [];
		JSON.parse(ptrTreeData).map(ptr => {
			promisePtrs.push(this.getObjInfo(ptr));
			ptr.children.forEach(ptr_s => {
				promisePtrs_s.push(getObjInfo(ptr_s))
			})
		});
		//单元
		let promiseItms = [];
		JSON.parse(itmTreeData).forEach(itm => {
			promiseItms.push(getObjInfo(itm))
		});
		const fetchPtrs = promisePtrs.map(data => {
			return postPackage({}, data);
		});
		const fetchPtrs_s = promisePtrs_s.map(data => {
			return postPackage({}, data);
		});
		const fetchItms = promiseItms.map(data => {
			return postPackage({}, data);
		});
		let allFetchs = fetchPtrs.concat(fetchPtrs_s).concat(fetchItms);
		Promise.all(allFetchs)
			.then(() => {
				getPackage({ code: unitCode })
					.then(workPackageData => {
						let changePackage = {
							version: "A",
							extra_params: Object.assign(
								workPackageData.extra_params, {
									instance: "END"
								}
							)
						};
						putPackage({ code: unitCode }, changePackage)
							.then(() => {
								//TODO
								this.approve(transition);
							})
					})
			});
		const getObjInfo = (Info) => {
			return {
				name: Info.name,
				code: Info.code,
				obj_type: Info.obj_type,
				version: Info.version,
				status: Info.status,
				parent: Info.parent
			};
		}
	}

	backFill(transition) {
		//TODO 退回的时候只修改了施工包数据，退回流程的接口未调用
		const {
			actions: { getPackage, putPackage },
			platform: {
				task: {
					subject = []
				}
			}
		} = this.props;
		let { unit } = subject[0];
		let unitCode = JSON.parse(unit).code;
		getPackage({ code: unitCode })
			.then(workPackageData => {
				let changePackage = {
					version: "A",
					extra_params: Object.assign(
						workPackageData.extra_params, {
							instance: "EDIT"
						}
					)
				};
				putPackage({ code: unitCode }, changePackage)
					.then(() => {
						//TODO
						this.back(transition);
					})
			})
	}

	static getCurrentUser() {
		return getUser();
	};

	static displayRender(label) {
		return label[label.length - 1];
	}
};
