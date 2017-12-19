import React, {Component} from 'react';
import {Input, Form, Spin, Radio, message, DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class AddCheck extends Component {

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
				<FormItem {...formItemLayout} label="总评">
					{getFieldDecorator('comment', {
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
                <FormItem {...formItemLayout} label="备注">
					{getFieldDecorator('remark', {
                        initialValue: this.props.state.record.remark,
						rules: [
						]
					}, {})(
						<Input />
					)}
				</FormItem>
			</Form>
		)
	}
}
