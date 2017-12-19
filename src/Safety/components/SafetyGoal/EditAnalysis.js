import React, {Component} from 'react';
import {Input, Form, Spin, Select} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class EditAnalysis extends Component {

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
				<FormItem {...formItemLayout} label="安全目标职责">
					{getFieldDecorator('content', {
						initialValue: this.props.state.record.content,
						rules: [
							{ required: true, message: '安全目标职责' },
						]
					}, {})(
						<Input type="text" placeholder="安全目标职责" />
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
				<FormItem {...formItemLayout} label="责任人">
					{getFieldDecorator('people', {
						initialValue: this.props.state.record.people,
						rules: [
							{required: true, message: '请填写责任人'},
						]
					}, {})(
						<Input type="text" placeholder="请输入责任人"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
