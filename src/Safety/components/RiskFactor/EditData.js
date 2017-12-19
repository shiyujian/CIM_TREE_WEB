import React, {Component} from 'react';

import {Input, Form, Spin,DatePicker} from 'antd';
import moment from 'moment';
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
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="重大危险源项目">
					{getFieldDecorator('danageSource', {
						initialValue: this.props.state.record.danageSource,
						rules: [
							{required: true, message: '请输入重大危险源项目！'},
						]
					})(
						<Input type="text" placeholder="请输入重大危险源项目！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="工程计划实施时间">
					{getFieldDecorator('impltime', {
						initialValue: moment(this.props.state.record.impltime),
						rules: [
							{required: true, message: '请输入工程计划实施时间！'},
						]
					})(
						<DatePicker format="YYYY-MM-DD"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工方案编制时间">
					{getFieldDecorator('comptime', {
						initialValue: moment(this.props.state.record.comptime),
						rules: [
							{required: true, message: '请输入施工方案编制时间！'},
						]
					}, {})(
						<DatePicker format="YYYY-MM-DD"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="专项应急预案">
					{getFieldDecorator('plan', {
						initialValue: this.props.state.record.plan,
						rules: [
							{required: true, message: '请输入专项应急预案！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入专项应急预案！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="专家论证">
					{getFieldDecorator('argument', {
						initialValue: this.props.state.record.argument,
						rules: [
							{required: true, message: '请输入专家论证！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入专家论证！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位技术负责人审批">
					{getFieldDecorator('chargeAppr', {
						initialValue: this.props.state.record.chargeAppr,
						rules: [
							{required: true, message: '请输入施工单位技术负责人审批！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入施工单位技术负责人审批！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="监理单位总监审批">
					{getFieldDecorator('unitAppr', {
						initialValue: this.props.state.record.unitAppr,
						rules: [
							{required: true, message: '请输入监理单位总监审批！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入监理单位总监审批！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="安全教育和技术交底">
					{getFieldDecorator('education', {
						initialValue: this.props.state.record.education,
						rules: [
							{required: true, message: '请输入安全教育和技术交底！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入安全教育和技术交底！"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
