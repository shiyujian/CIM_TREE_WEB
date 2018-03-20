import React, { Component } from 'react';
import { Radio } from 'antd';
import { getUser } from '../../../_platform/auth';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class Type extends Component {

	static propTypes = {};

	render() {
		const { filter: { type = 'processing' } = {} } = this.props;
		return (
			<div style={{ textAlign: 'center', marginBottom: 20 }}>
				<RadioGroup value={type} onChange={this.chaneType.bind(this)}>
					{
						Type.types.map((type, index) => {
							return <RadioButton key={index} value={type.value}>{type.label}</RadioButton>;
						})
					}
				</RadioGroup>
			</div>
		);
	}

	async chaneType(event) {
		event.preventDefault();
		const user = getUser();
		const { actions: { changeFilterField, getTasks, setLoadingStatus, setTablePage } } = this.props;
		const value = event.target.value;
		console.log('value222',value)
		changeFilterField('type', value);

		setLoadingStatus(true);
		await getTasks({}, { task: value, executor: user.id, order_by: "-real_start_time" });
		setLoadingStatus(false);
		setTablePage({ current: 1, pageSize: 10 })

	}

	static types = [
		{
			label: '待办任务',
			value: 'processing',
		}, {
			label: '将执行任务',
			value: 'future',
		}, {
			label: '已委托任务',
			value: 'delegated',
		}, {
			label: '已完成任务',
			value: 'finish',
		},
	];
}
