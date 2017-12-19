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
				<FormItem {...formItemLayout} label="重大危险源">
					{getFieldDecorator('unbearable', {
						initialValue: this.props.state.record.unbearable,
						rules: [
							{required: true, message: '请输入重大危险源！'},
						]
					})(
						<Input type="text" placeholder="请输入重大危险源！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="危险源存在的具体情况">
					{getFieldDecorator('mayaccident', {
						initialValue: this.props.state.record.mayaccident,
						rules: [
							{required: true, message: '请输入具体情况！'},
						]
					})(
						<Input type="text" placeholder="请输入情况！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="目前情况">
					{getFieldDecorator('warninglevel', {
						initialValue: this.props.state.record.warninglevel,
						rules: [
							{required: true, message: '请输入目前情况！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入目前情况！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="下一步施工计划情况">
					{getFieldDecorator('position', {
						initialValue: this.props.state.record.position,
						rules: [
							{required: true, message: '请输入下一步计划！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入下一步计划！"/>
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
							{required: true, message: '请输入风险应急救援！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入风应急救援！"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
