import React, {Component} from 'react';
import {Input, Form, Spin} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

export default class EditManage extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="目标内容">
					{getFieldDecorator('content', {
						initialValue: this.props.state.record.content,
						rules: [
							{required: true, message: '请输入目标内容'},
						]
					}, {})(
						<Input type="text" placeholder="请输入目标内容"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="目标值">
					{getFieldDecorator('value', {
						initialValue: this.props.state.record.value,
						rules: [
							{required: true, message: '请输入目标值'},
						]
					}, {})(
						<Input type="text" placeholder="请输入目标值"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
