import React, {Component} from 'react';
import {Input, Form, Spin, Select, message, DatePicker,Radio} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const MonthPicker = DatePicker.MonthPicker;

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
		return (
			<Form>
				<FormItem {...formItemLayout} label="考核结果">
					{getFieldDecorator('result', {
						rules: [
							{required: true, message: '请选择考核结果！'},
						]
					})(
						<RadioGroup>
				        	<Radio value={1}>合格</Radio>
				        	<Radio value={0}>不合格</Radio>
				        </RadioGroup>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="考核负责人">
					{getFieldDecorator('assessment', {
						initialValue: this.props.state.record.assessment,
						rules: [
							{required: true, message: '请输入考核负责人'},
						]
					}, {})(
						<Input type="text" placeholder="未获取到考核人"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="备注">
					{getFieldDecorator('remark', {
						initialValue: this.props.state.record.remark,
					}, {})(
						<Input />
					)}
				</FormItem>
			</Form>
		)
	}
}
