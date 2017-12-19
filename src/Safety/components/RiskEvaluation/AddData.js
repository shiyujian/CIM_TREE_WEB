import React, {Component} from 'react';

import {Input, Form, Spin, Select,DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddData extends Component {

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
				<FormItem {...formItemLayout} label="危险源">
					{getFieldDecorator('danageSource', {
						rules: [
							{required: true, message: '请输入危险源！'},
						]
					})(
						<Input type="text" placeholder="请输入危险源！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="L(事故发生的可能性)">
					{getFieldDecorator('l', {
						rules: [
							{required: true, message: '请输入l(事故发生的可能性)！'},
						]
					})(
						<Input type="text" placeholder="请输入l(事故发生的可能性)！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="E(人员暴露于危险环境中的频繁程度)">
					{getFieldDecorator('e', {
						rules: [
							{required: true, message: '请输入e(人员暴露于危险环境中的频繁程度)！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入e(人员暴露于危险环境中的频繁程度)！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="C请输入c(发生事故可能造成的后果)！">
					{getFieldDecorator('c', {
						rules: [
							{required: true, message: '请输入c(发生事故可能造成的后果)！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入c(发生事故可能造成的后果)！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="D请输入d(总计 D>=160)">
					{getFieldDecorator('d', {
						rules: [
							{required: true, message: '请输入d(总计 D>=160)！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入d(总计 D>=160)！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="风险级别">
					{getFieldDecorator('danagelevel', {
						rules: [
							{required: true, message: '请输入风险级别！'},
						]
					}, {})(
						<Select>
							<Option value="level-1">level-1</Option>
							<Option value="level-2">level-2</Option>
							<Option value="level-3">level-3</Option>
							<Option value="level-4">level-4</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="风险控制措施">
					{getFieldDecorator('danageControl', {
						rules: [
							{required: true, message: '请输入风险控制措施！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入风险控制措施！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="上传日期">
					{getFieldDecorator('date', {
						rules: [
							{required: true, message: '请选择日期！'},
						]
					}, {})(
						<DatePicker format="YYYY-MM-DD"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
