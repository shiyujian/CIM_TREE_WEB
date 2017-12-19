import React, {Component} from 'react';
import {Radio} from 'antd';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

export default class Type extends Component {

	static propTypes = {};

	render() {
		const {filter: {type = 'processing'} = {}} = this.props;
		return (
			<div style={{textAlign: 'center', marginBottom: 20}}>
				<RadioGroup value={type} onChange={this.chaneType.bind(this)}>
					{
						Type.types.map((type, index) => {
							return <RadioButton key={index} value={type.value}>{type.label}</RadioButton>;
						})
					}
				</RadioGroup>
			</div>);
	}

	chaneType(event) {
		event.preventDefault();
		const {actions: {changeFilterField, getTasks}, filter = {}} = this.props;
		const value = event.target.value;
		changeFilterField('type', value);
		getTasks({}, {...filter, workflow: '图纸报审流程'});
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
