import React, {Component} from 'react';
import {Modal, Row, Col, Form, Input, Select, message} from 'antd';

const FormItem = Form.Item;
const {Option, OptGroup} = Select;

export default class Addition extends Component {
	render() {
		const {platform: {roles = []}, addition = {}, actions: {changeAdditionField}} = this.props;
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);
		return (
			<Modal title={addition.id ? "新增人员" : "编辑人员信息"} visible={addition.visible} className="large-modal" width={800}
			       onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<Row gutter={24}>
					<Col span={12}>
						<FormItem {...Addition.layout} label="用户名">
							<Input readOnly={!!addition.id} placeholder="请输入用户名" value={addition.username}
							       onChange={changeAdditionField.bind(this, 'username')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="姓名">
							<Input placeholder="请输入姓名" value={addition.person_name} onChange={changeAdditionField.bind(this, 'person_name')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="性别">
							<Select placeholder="请选择性别" value={addition.gender} onChange={changeAdditionField.bind(this, 'gender')} style={{width: '100%'}}>
								<Option value="女">女</Option>
								<Option value="男">男</Option>
							</Select>
						</FormItem>
						<FormItem {...Addition.layout} label="密码">
							<Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password}
							       onChange={changeAdditionField.bind(this, 'password')}/>
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...Addition.layout} label="邮箱">
							<Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="手机号码">
							<Input placeholder="请输入手机号码" value={addition.person_telephone} onChange={changeAdditionField.bind(this, 'person_telephone')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="职位">
							<Input placeholder="请输入职位" value={addition.title} onChange={changeAdditionField.bind(this, 'title')}/>
						</FormItem>
						<FormItem {...Addition.layout} label="角色">
							<Select placeholder="请选择角色" value={addition.roles} onChange={this.changeRoles.bind(this)}
							        mode="multiple" style={{width: '100%'}}>
								<OptGroup label="系统角色">
									{
										systemRoles.map(role => {
											return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
										})
									}
								</OptGroup>
								<OptGroup label="项目角色">
									{
										projectRoles.map(role => {
											return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
										})
									}
								</OptGroup>
								<OptGroup label="专业角色">
									{
										professionRoles.map(role => {
											return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
										})
									}
								</OptGroup>
								<OptGroup label="部门角色">
									{
										departmentRoles.map(role => {
											return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
										})
									}
								</OptGroup>
							</Select>
						</FormItem>
					</Col>
				</Row>
			</Modal>
		);
	}

	componentDidMount() {
		const {actions: {getRoles}} = this.props;
		getRoles();
	}

	changeRoles(value) {
		const {actions: {changeAdditionField}} = this.props;
		changeAdditionField('roles', value)
	}

	save() {
		const {
			addition = {}, sidebar: {node} = {},
			actions: {postUser, clearAdditionField, getUsers, putUser}
		} = this.props;
		console.log(this.props)

		const roles = addition.roles || [];
		if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
			message.warn('请输入英文字符、数字');
		} else if (!addition.person_name) {
			message.warn('请输入姓名');
		} else {
			if (addition.id) {
				putUser({id: addition.id}, {
					username: addition.username,
					email: addition.email || '',
					// password: addition.password, // 密码不能变？信息中没有密码
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
					groups: roles.map(role => +role),
					is_active: true,
					basic_params: {
						info: {
							'电话': addition.person_telephone || '',
							'性别': addition.gender || '',
							'技术职称': addition.title || '',
						}
					},
					extra_params: {},
					title: addition.title || ''
				}).then(rst => {
					if (rst.id) {
						clearAdditionField();
						const codes = Addition.collect(node);
						getUsers({}, {org_code: codes});
					} else {
						message.warn('服务器端报错！');
					}
				})
			} else {
				postUser({}, {
					username: addition.username,
					email: addition.email || '',
					password: addition.password,
					account: {
						person_name: addition.person_name,
						person_type: "C_PER",
						person_avatar_url: "",
						organization: {
							// pk: node.pk,
							// code: node.code,
							obj_type: "C_ORG",
							rel_type: "member",
							// name: node.name
						},
					},
					groups: roles.map(role => +role),
					is_active: true,
					basic_params: {
						info: {
							'电话': addition.person_telephone || '',
							'性别': addition.gender || '',
							'技术职称': addition.title || '',
						}
					},
					extra_params: {},
					title: addition.title || ''
				}).then(rst => {
					if (rst.id) {
						clearAdditionField();
						const codes = Addition.collect(node);
						getUsers({}, {org_code: codes});
					} else {
						if (rst.username) {
							message.warn('用户名已存在！');
						} else {
							message.warn('服务器端报错！');
						}
					}
				})
			}
		}
	}

	cancel() {
		const {actions: {clearAdditionField}} = this.props;
		clearAdditionField();
	}

	static collect = (node = {}) => {
		const {children = [], code} = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Addition.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	}

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}
