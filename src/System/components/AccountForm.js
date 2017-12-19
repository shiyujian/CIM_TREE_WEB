import React, {Component} from 'react';
import {Input, Form, Cascader} from 'antd';
import {Loop} from 'components/panels/Loop';
const FormItem = Form.Item;
export default class AccountForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmDirty: false,
		};
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator},
			orgTrees = []
		} = this.props;
		return (
		  <div>
			  <FormItem {...formItemLayout} label="用户名">
				  {getFieldDecorator('account_name', {
					  rules: [{required: true, message: '请输入用户名!'}],
				  })(
					<Input type="text" placeholder="请输入用户名"/>
				  )}
			  </FormItem>
			  <FormItem {...formItemLayout} label="姓名">
				  {getFieldDecorator('person_name', {
					  rules: [{required: true, message: '请输入姓名!'}],
				  })(
					<Input type="text" placeholder="请输入姓名"/>
				  )}
			  </FormItem>
			  <FormItem {...formItemLayout} label="密码" hasFeedback>
				  {getFieldDecorator('password', {
					  rules: [
						  {required: true, message: '请输入密码!'},
						  {validator: this.checkConfirm.bind(this)}
					  ]
				  })(
					<Input type="password" placeholder="请输入密码"/>
				  )}
			  </FormItem>
			  <FormItem {...formItemLayout} label="确认密码" hasFeedback>
				  {getFieldDecorator('confirm', {
					  rules: [
						  {required: true, message: '请输入确认密码!'},
						  {validator: this.checkPassword.bind(this)}
					  ]
				  })(
					<Input type="password" onBlur={this.handleConfirmBlur.bind(this)}
						   placeholder="请输入确认密码"/>
				  )}
			  </FormItem>
			  <FormItem {...formItemLayout} label="请选择部门" style={{display:'none'}}>
				  {getFieldDecorator('organization', {
					  rules: [
						  {required: true, message: '请选择部门!'},
					  ]
				  })(
					<Cascader placeholder="请选择部门" options={Loop(orgTrees)} changeOnSelect/>
				  )}
			  </FormItem>
		  </div>
		)
	}

	checkPassword(rule, value, callback) {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('两次输入的密码不同，请核对后输入！');
		} else {
			callback();
		}
	}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({confirmDirty: this.state.confirmDirty || !!value});
	}

	checkConfirm(rule, value, callback) {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], {force: true});
		}
		callback();
	}
}