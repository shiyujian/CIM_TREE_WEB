import React, {Component} from 'react';
import {Input, Form, Spin, Select, DatePicker,Radio} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RadioGroup = Radio.Group;

export default class EditCheck extends Component {

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
        const dateFormat = 'YYYY-MM-DD';
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
				<FormItem {...formItemLayout} label="责任人">
					{getFieldDecorator('principal', {
						initialValue: this.props.state.record.principal,
						rules: [
							{required: true, message: '未获取到责任人'},
						]
					}, {})(
						<Input type="text" />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="考核人">
					{getFieldDecorator('assessment', {
						initialValue: this.props.state.record.assessment,
						rules: [
							{required: true, message: '请输入考核人'},
						]
					}, {})(
						<Input type="text" />
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="“五无”目标">
					{getFieldDecorator('target', {
                        initialValue: this.props.state.record.target,
						rules: [
							{required: true, message: '请选择“五无”目标'},
						]
					}, {})(
						<RadioGroup>
				        	<Radio value={false}>不合格</Radio>
				        	<Radio value={true}>合格</Radio>
				        </RadioGroup>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="轻伤年负伤≤11%">
					{getFieldDecorator('wounded', {
                        initialValue: this.props.state.record.wounded,
						rules: [
							{required: true, message: '请输入年负伤率'},
						]
					}, {})(
						<RadioGroup>
				        	<Radio value={false}>不合格</Radio>
				        	<Radio value={true}>合格</Radio>
				        </RadioGroup>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="安全达标">
					{getFieldDecorator('standard', {
                        initialValue: this.props.state.record.standard,
						rules: [
							{required: true, message: '请选择安全达标'},
						]
					}, {})(
						<RadioGroup>
				        	<Radio value={0}>不合格</Radio>
				        	<Radio value={1}>合格</Radio>
				        	<Radio value={2}>优良</Radio>
				        </RadioGroup>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="文明施工目标">
					{getFieldDecorator('civilizationConstruction', {
                        initialValue: this.props.state.record.civilizationConstruction,
						rules: [
							{required: true, message: '请输入文明施工目标'},
						]
					}, {})(
						<RadioGroup>
				        	<Radio value={0}>不合格</Radio>
				        	<Radio value={1}>合格</Radio>
				        	<Radio value={2}>优良</Radio>
				        </RadioGroup>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="考核结果">
					{getFieldDecorator('assessmentResults', {
                        initialValue: this.props.state.record.assessmentResults,
						rules: [
							{required: true, message: '请选择考核结果'},
						]
					}, {})(
						<RadioGroup>
				        	<Radio value={0}>不合格</Radio>
				        	<Radio value={1}>合格</Radio>
				        	<Radio value={2}>优良</Radio>
				        </RadioGroup>
					)}
				</FormItem>
			</Form>
		)
	}
}
