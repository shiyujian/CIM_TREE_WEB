import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	Cascader, Button, Row, Col, Checkbox, notification, message, Form,
} from 'antd';
import {getUser} from '../../auth';
import {WORKFLOW_MAPS} from '../../api';
import moment from 'moment';
const FormItem = Form.Item;

export default class Approval extends Component {

	static propTypes = {
		users: PropTypes.array,
		WORKFLOW_ID: PropTypes.string,
		onSubmit: PropTypes.func.isRequired,
	};

	static layout = {
		labelCol: {span: 10},
		wrapperCol: {span: 14},
	};

	render() {
		const {users = []} = this.props;
		const {name = '', org = ''} = getUser();
		return (
			<Row style={{marginTop: 16}}>
				<Col span={6}>
					<span>填报人：</span>
					<span>{`${name} ${org}`}</span>
				</Col>
				<Col span={6}>
					<FormItem {...Approval.layout}
					          label="审核人">
                             <span>
							     <Cascader options={users} allowClear
							               placeholder="请选择审核人"
							               onChange={this.selectNextUser.bind(this)}
							               displayRender={Approval.displayRender}/>
						     </span>
			 		</FormItem>
				</Col>
				<Col span={6}>
					<Checkbox>短信通知</Checkbox>
				</Col>
				<Col span={6}>
					<Button onClick={this.submit.bind(this)}>提交</Button>
				</Col>
			</Row>
		);
	}

	componentDidMount() {
		const {getUsers} = this.props.actions;
		getUsers();
	}

	selectNextUser(value) {
		const [, id] = value;
		const {actions: {changeApprovalField}} = this.props;
		changeApprovalField && changeApprovalField('nextUser', id);
	}

	getNextUser() {
		let nextUser = null;
		const {users = [], approval: {nextUser: id} = {}} = this.props;
		users.forEach(({children}) => {
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


	launchFlow(subject = []) {
		const {
			actions: {createFlow, addActor, commitFlow, startFlow, putFlow}, WORKFLOW_ID, onSuccess
		} = this.props;
		const currentUser = getUser();
		const nextUser = this.getNextUser();
		const WORKFLOW_MAP = WORKFLOW_MAPS[WORKFLOW_ID];
		createFlow({}, {
			name: WORKFLOW_MAP.name,
			description: WORKFLOW_MAP.desc,
			subject,
			code: WORKFLOW_MAP.code,
			creator: currentUser,
			plan_start_time: moment().format('YYYY-MM-DD'),
			deadline: null,
		}).then(instance => {
			const {id, workflow: {states = []} = {}} = instance;
			const [{id: state_id, actions: [action]}, {id: next_id}] = states;
			Promise.all([
				addActor({ppk: id, pk: state_id}, {
					participants: [currentUser],
					remark: WORKFLOW_MAP.desc,
				}),
				addActor({ppk: id, pk: next_id}, {
					participants: [nextUser],
					remark: WORKFLOW_MAP.desc,
				}),
			]).then(() => {
				commitFlow({pk: id}, {
					creator: currentUser,
				}).then(() => {
					startFlow({pk: id}, {
						creator: currentUser,
					}).then(() => {
						putFlow({pk: id}, {
							'state': state_id,
							'executor': currentUser,
							'action': action,
							'note': '同意', // todo
							'attachment': null, // todo 和 subject 两者使用区别
						});
						notification.success({
							message: '流程信息',
							description: '图纸报审流程提交成功',
						});
						setTimeout(() => {
							typeof onSuccess === 'function' && onSuccess()
						}, 1000);

					});
				});
			});
		});
	}

	submit() {
		const {
			approval: {nextUser} = {}, onSubmit
		} = this.props;
		if (!nextUser) {
			message.error('请先选择审核人');
		} else {
			const promise = onSubmit();
			if (promise && promise.then) {
				promise.then((subjects) => {
					if (subjects && subjects.length) {
						this.launchFlow(subjects);
					} else {
						message.error('提及失败');
					}
				});
			}
		}
	}

	static displayRender(label) {
		return label[label.length - 1];
	}
}
