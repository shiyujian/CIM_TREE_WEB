import React, {Component} from 'react';
import {Row, Col, Popconfirm, Button, Input} from 'antd';
import Per from './Per';

export default class Progress extends Component {

	constructor(props) {
		super(props);
		this.state = {
			action: '通过'
		}
	}

	render() {
		const {state = {}} = this.props;
		const {actions = []} = state;
		console.log(actions, state);
		return (
			<div>
				<div>
					{
						actions.map((action, index) => {
							return (<Button onClick={this.toggleAction.bind(this, action)} key={index} style={{marginRight: 20}}>{action}</Button>)
						})
					}
				</div>
				{
					this.renderContent()
				}
			</div>
		);
	}

	renderContent() {
		const {action = ''} = this.state;
		const {state = {}} = this.props;
		const finish = this.isFinish();
		const transitionList = this.getTransitions(action, state.id);
		const nextStates = this.getNextStates(transitionList);
		const transition = this.getTransition(action, state.id);
		const nextState = this.getNextState(transition);
		switch (action) { // 更具不同的操作进行不同的处理
			case '委托':
				return (
					<div>
						<Row style={{marginTop: 10}}>
							<Col span={24}>
								<Input style={{width: '100%'}} size='large' id={'delegateNote'}
								       addonBefore={'委托意见'} placeholder="委托。"/>
							</Col>
						</Row>
						<Row style={{marginTop: 10}}>
							<Per state={nextState}/>
						</Row>

						<Row style={{marginTop: 10}}>
							<Col span={2}><Popconfirm title="确定委托吗？" onConfirm={this.handleDelegate.bind(this)}>
								<Button>确认委托</Button>
							</Popconfirm>
							</Col>
						</Row>
					</div>);
			case '退回':
				return (
					<div>
						<Row style={{marginTop: 10}}>
							<Col span={24}>
								<Input style={{width: '100%'}} size='large'
								       addonBefore={'退回原因'} placeholder="退回"/>
							</Col>
						</Row>
						<Row style={{marginTop: 10}}>
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
						<Row style={{marginTop: 10}}>
							<Col span={2}><Popconfirm title="确定废止吗？" onConfirm={this.handleAbolish.bind(this)}>
								<Button>确认废止</Button>
							</Popconfirm>
							</Col>
						</Row>
					</div>);
			default:
				return (
					<div>
						<Row style={{marginTop: 10}}>
							<Input style={{width: '100%'}} size='large'
							       addonBefore={'处理意见'} placeholder=""/>
						</Row>
						{
							!finish && nextStates.map((state, index) => {
								// return (<UserPicker key={index} state={state}/>);
							})
						}
						<Row style={{marginTop: 10}}>
							<Col span={2}>
								<Popconfirm title={'确定吗？'} onConfirm={this.handleSubmit.bind(this)}>
									<Button>确认</Button>
								</Popconfirm>
							</Col>
						</Row>
					</div>);
		}
	}

	toggleAction(action) {
		this.setState({action});
	}

	isFinish() {
		const {state: {state_type} = {}} = this.props;
		return state_type === 0;
	}

	getTransitions(action, stateId) {
		const {transitions = []} = this.props;
		return transitions.filter(transition => transition.from_state === stateId && action === transition.name);
	}

	getTransition(action, stateId) {
		const {transitions = []} = this.props;
		return transitions.find(transition => transition.from_state === stateId && action === transition.name);
	}

	getNextStates(transitions = []) {
		const {states = []} = this.props;
		return states.filter(state => transitions.some(transition => transition.to_state === state.id))
	}

	getNextState(transition = {}) {
		const {states = []} = this.props;
		return states.find(state => transition.to_state === state.id);
	}


	handleSubmit() {

	}

	handleDelegate() {

	}

	handleReject() {

	}

	handleAbolish() {

	}
}
