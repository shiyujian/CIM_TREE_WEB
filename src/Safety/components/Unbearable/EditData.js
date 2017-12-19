import React, {Component} from 'react';

import {Input, Form, Spin} from 'antd';

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
				<FormItem {...formItemLayout} label="不可承受风险">
					{getFieldDecorator('unbearable', {
						initialValue: this.props.state.record.unbearable,
						rules: [
							{required: true, message: '请输入不可承受风险！'},
						]
					})(
						<Input type="text" placeholder="请输入不可承受风险！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="可能导致的事故">
					{getFieldDecorator('mayaccident', {
						initialValue: this.props.state.record.mayaccident,
						rules: [
							{required: true, message: '请输入可能导致的事故！'},
						]
					})(
						<Input type="text" placeholder="请输入可能导致的事故！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="风险等级">
					{getFieldDecorator('warninglevel', {
						initialValue: this.props.state.record.warninglevel,
						rules: [
							{required: true, message: '请输入风险等级！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入风险等级！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="可能发生场所、活动、设备">
					{getFieldDecorator('position', {
						initialValue: this.props.state.record.position,
						rules: [
							{required: true, message: '请输入可能发生场所、活动、设备！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入可能发生场所、活动、设备！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="目标控制">
					{getFieldDecorator('targetControl', {
						initialValue: this.props.state.record.targetControl,
						rules: [
							{required: true, message: '请输入目标控制！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入目标控制！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="作业控制">
					{getFieldDecorator('jobControl', {
						initialValue: this.props.state.record.jobControl,
						rules: [
							{required: true, message: '请输入作业控制！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入作业控制！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="应急救援">
					{getFieldDecorator('rescue', {
						initialValue: this.props.state.record.rescue,
						rules: [
							{required: true, message: '请输入应急救援！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入应急救援！"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
