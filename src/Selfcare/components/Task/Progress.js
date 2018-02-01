import React, { Component } from 'react';
import { Row, Col, Form, Popconfirm, Button, Input, message, notification } from 'antd';
import UserPicker from './UserPicker';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { WORKFLOW_CODE } from '_platform/api';

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
							let url;
							if (code === WORKFLOW_CODE.数据报送流程) {
								// 数据报送流程
								if(action === '通过'){
									action = '审核';
									url = <Button onClick={this.openModal.bind(this,name,id)}>{action}</Button>
								}
							} else {
								url = action;
							}

							if(url != action){
								if(action === '审核'){
									return url
								}else{
									return (url && <Link to={url}><Button onClick={this.toggleAction.bind(this, action)} key={index} style={{marginRight:20}}>{action}</Button></Link>)
								}
							}else{
								return (url && <Button onClick={this.toggleAction.bind(this, action)} key={index} style={{marginRight:20}}>{action}</Button>)
							}
						})
					}
				</div>
				{
					this.renderContent()
				}
			</div>
		);
	}

	async openModal(name,id){
		const {actions:{changeDatareportVisible,getWorkflowById}} = this.props
		let wk = await getWorkflowById({pk:id});
		this.setState({wk})
	}
	renderContent() {
		const { state = {}, actions = [], users = [] } = this.props;
		const { actions: [first = ''] = [] } = state;
		let { action } = this.state;
		if (!action) {
			action = first;
		}
		console.log('renderContent')
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
