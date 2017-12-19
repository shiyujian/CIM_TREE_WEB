import React, {Component} from 'react';
import {Input, Form, Spin} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

export default class AddManage extends Component {

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
		debugger
		return (
			<Form>
				<FormItem {...formItemLayout} label="工程名称" hasFeedback>
					{getFieldDecorator('projectName', {
						initialValue: this.props.props.project.name,
						rules: [
							{required: true, message: '请选择单位工程'},
						]
					})(
						<Input type="text" readOnly placeholder="未获取到单位工程"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						initialValue: this.props.props.construct.name,
						rules: [
							{required: true, message: '该单位工程无施工单位，请联系管理员！'},
						]
					})(
						<Input type="text" readOnly placeholder="未获取到施工单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="目标内容">
					{getFieldDecorator('content', {
						rules: [
							{required: true, message: '请输入目标内容'},
						]
					}, {})(
						<Input type="text" placeholder="请输入目标内容"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="目标值">
					{getFieldDecorator('value', {
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