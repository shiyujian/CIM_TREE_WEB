import React, {Component} from 'react';

import {Input, Form, Spin,Icon,Button,DatePicker,Radio,Select} from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select

export default class AddScheduler extends Component {

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
				<FormItem {...formItemLayout} label="工程名称">
					{getFieldDecorator('projectname', {
						rules: [
							{required: true, message: '请选择工程名称'},
						],
					})(
						<Select style={{ width: 120 }} placeholder="请选择">
					      	<Option value="工程1">工程1</Option>
					      	<Option value="工程2">工程2</Option>
						  	<Option value="工程3">工程3</Option>
						  	<Option value="工程4">工程4</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="分部分项">
					{getFieldDecorator('part', {
					})(
						<Select style={{ width: 120 }} placeholder="选填">
					      	<Option value="1">分项1</Option>
					      	<Option value="2">分项2</Option>
						  	<Option value="3">分项3</Option>
						  	<Option value="4">分项4</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="时间段">
					{getFieldDecorator('starttime', {
						rules: [
							{required: true, message: '请选择时间'},
						],
					})(
						<RangePicker
					     showTime={{ format: 'HH:mm' }}
					     format="YYYY-MM-DD HH:mm"
					     placeholder={['Start Time', 'End Time']}
					    />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="负责人">
					{getFieldDecorator('admin', {
						rules: [
							{required: true, message: '请选择负责人'},
						],
					})(
						<Select style={{ width: 120 }} placeholder="请选择">
							<Option value="ww">ww</Option>
							<Option value="方建明">方建明</Option>
							<Option value="徐某">徐某</Option>
							<Option value="admin">admin</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="检查用表">
					{getFieldDecorator('table', {
						rules: [
							{required: true, message: '请选择检查用表'},
						],
					})(
						<Select style={{ width: 120 }} placeholder="请选择">
					      	<Option value="1">表格1</Option>
					      	<Option value="2">表格2</Option>
						  	<Option value="3">表格3</Option>
						  	<Option value="4">表格4</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="重复">
					{getFieldDecorator('repeat', {
						rules: [
							{required: true, message: '请选择重复时间'},
						],
					})(
						<Select style={{ width: 120 }} placeholder="请选择">
					      	<Option value="每周">每周</Option>
					        <Option value="每天">每天</Option>
					        <Option value="每工作日">每工作日</Option>
					        <Option value="每月">每月</Option>
					        <Option value="每3个月">每3个月</Option>
					        <Option value="每年">每年</Option>
					        <Option value="每2周">每2周</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="提醒">
					{getFieldDecorator('remind', {
						rules: [
							{required: true, message: '请选择提醒时间'},
						],
					})(
						<Select style={{ width: 120 }} placeholder="请选择">
					      <Option value="1">提前15分钟</Option>
					      <Option value="2">提前20分钟</Option>
					      <Option value="3">提前30分钟</Option>
					      <Option value="4">提前10分钟</Option>
					    </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="备注">
					{getFieldDecorator('remark')(
						<Input type="text" placeholder="选填"/>
					)}
				</FormItem>
			</Form>
		)
	}
}
