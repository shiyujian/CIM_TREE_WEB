import React, { Component } from 'react';
import { Row, Col, Form, Spin, Input } from 'antd';

const FormItem = Form.Item;

export default class Info extends Component {

	static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};

	render() {
		const { platform: { task = {} } = {} } = this.props;
		return (
			<div style={{ marginBottom: 10 }}>
				<div style={{ textAlign: 'center', fontSize: 20 }}>{task.name}</div>
				<div style={{ textAlign: 'center', fontSize: 12, color: "#999999" }}>
					<span>发起人：{task.creatorName}</span>
					<span style={{ paddingLeft: 40 }}>当前状态：{task.status}</span>
				</div>
			</div>
		);
	}

	async componentDidMount() {
		const {
			match: { params: { task_id } = {} },
			actions: { getTask, setTaskDetailLoading }
		} = this.props;
		setTaskDetailLoading(true);
		await getTask({ task_id: task_id });
		setTaskDetailLoading(false);
	}
}