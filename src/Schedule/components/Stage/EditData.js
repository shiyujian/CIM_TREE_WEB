import React, {Component} from 'react';

import {Input, Form, Spin,Icon,Button} from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;

export default class EditData extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14}
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="本期实际完成量">
					{getFieldDecorator('e', {
						initialValue: this.props.state.record.e==="请编辑数量" ? "" :this.props.state.record.e,
						rules: [
							{required: true, message: '请填写本期实际完成量'}
						]
					})(
						<Input type="text" />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="下期计划完成量">
					{getFieldDecorator('f', {
						initialValue: this.props.state.record.f==="请编辑数量" ? "" :this.props.state.record.f,
						rules: [
							{required: true, message: '请填写下期计划完成量'}
						]
					})(
						<Input type="text" />
					)}
				</FormItem>
			</Form>
		)
	}
}
