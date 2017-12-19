import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input, Cascader, Button} from 'antd';

const FormItem = Form.Item;
export default class Addition extends Component {
	render() {
		const {
			addition = {}, points = [],
			actions: {changeAdditionField}
		} = this.props;
		return (
			<Modal title="新增人员" visible={addition.visible} className="large-modal" width={800}
			       onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<Row gutter={24}>
					<Col span={12}>
						<FormItem {...Addition.layout} label="用户名">
							<Input placeholder="请输入用户名" value={addition.username} onChange={changeAdditionField.bind(this, 'username')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="姓名">
							<Input placeholder="请输入姓名" value={addition.person_name} onChange={changeAdditionField.bind(this, 'person_name')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="密码">
							<Input placeholder="请输入密码" value={addition.password} onChange={changeAdditionField.bind(this, 'password')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="确认密码">
							<Input placeholder="请输入确认密码" value={addition.confirm} onChange={changeAdditionField.bind(this, 'confirm')}/>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...Addition.layout} label="邮箱">
							<Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="手机号码">
							<Input placeholder="请输入手机号码" value={addition.phone} onChange={changeAdditionField.bind(this, 'phone')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="职位">
							<Input placeholder="请输入职位" value={addition.title} onChange={changeAdditionField.bind(this, 'title')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="角色">
							<Input placeholder="请输入角色" value={addition.roles} onChange={changeAdditionField.bind(this, 'roles')}/>
						</FormItem>
					</Col>
				</Row>
			</Modal>
		);
	}

	save() {
		const {
			addition = {}, sidebar: {node} = {},
			actions: {postUser, getUsers}
		} = this.props;
		let addUserData = {
			username: addition.username,
			email: addition.email || '',
			password: addition.password,
			account: {
				person_name: addition.person_name,
				person_type: "C_PER",
				person_avatar_url: "",
				organization: {
					pk: node.pk,
					code: node.code,
					obj_type: "C_ORG",
					rel_type: "member",
					name: node.name
				},
			},
			groups: addition.roles || [],
			is_active: true,
			basic_params: {
				info: {
					email: addition.email || '',
					"电话": addition.phone || ''
					// technical: values.technical || '',
				}
			},
			extra_params: {},
			title: addition.title || ''
		};

		postUser({}, addUserData)
	}

	cancel() {
		const {actions: {clearAdditionField}} = this.props;
		clearAdditionField();
	}

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}
