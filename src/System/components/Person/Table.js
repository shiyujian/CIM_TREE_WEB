import React, { Component } from 'react';
import { Table, Row, Col, Form, Select, Button, Popconfirm, message } from 'antd';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;
export default class Users extends Component {
	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
	changeRoles(value) {
		const { actions: { changeAdditionField } } = this.props;
		console.log("value", value)
		changeAdditionField('roles', value)
	}
	render() {
		const { platform: { roles = [] }, addition = {}, actions: { changeAdditionField } } = this.props;
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);

		const { platform: { users = [] } } = this.props;
		// const {platform: {roles = []}, addition = {}, actions: {changeAdditionField}} = this.props;		
		console.log(users)
		return (
			<div>
				<div>

					<Row>
						<Col span={8}>
							<Button onClick={this.append.bind(this)}>添加用户</Button>
							<Popconfirm title="是否真的要删除选中用户?"
								onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
								<Button>批量删除</Button>

							</Popconfirm>

						</Col>
						<Col span={2} style={{float:"right",marginLeft:"10px"}}>
							<Button onClick={this.saves.bind(this)}>确定</Button>
						</Col>
						<Col span={8} style={{ float: "right" }}>
							<FormItem {...Users.layout} label="角色">
								<Select placeholder="请选择角色" value={addition.roles} onChange={this.changeRoles.bind(this)}
									mode="multiple" style={{ width: '100%' }}>
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
				</div>
				<Table rowKey="id" size="middle" bordered rowSelection={this.rowSelection} columns={this.columns} dataSource={users} />
			</div>
		);
	}
	saves() {
		const { platform: { users = [] } } = this.props;
		const {
			addition = {}, sidebar: { node } = {},
			actions: { postUser, clearAdditionField, getUsers, putUser }
		} = this.props;
		console.log("addition", addition)
		console.log("this.selectedCodes", this.selectedCodes)
		const roles = addition.roles || [];
		console.log("roles", roles)
		console.log("users", users)
		for (let i = 0; i < users.length; i++) {
			const element = users[i];
			console.log(element)
			if (element.id == this.selectedCodes[0]) {
				console.log("已经选中")
				putUser({ id: element.id }, {
					username: element.username,
					email: element.email,
					// password: addition.password, // 密码不能变？信息中没有密码
					account: {
						person_name: element.person_name,
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
							'电话': element.person_telephone || '',
							'性别': element.gender || '',
							'技术职称': element.title || '',
							'phone': element.person_telephone || '',
							'sex': element.gender || '',
							'duty': ''
						}
					},
					extra_params: {},
					title: element.title || ''
				}).then(rst => {
					if (rst.id) {
						clearAdditionField();
						const codes = element.collect(node);
						console.log("codes", codes)
						getUsers({}, { org_code: codes });
					} else {
						console.log("111")
						message.warn('服务器端报错！');
					}
				})
			}



		}


	}

	columns = [{
		title: '序号',
		dataIndex: 'index',
	}, {
		title: '姓名',
		dataIndex: 'person_name',
	}, {
		title: '编码',
		dataIndex: 'person_code',
	}, {
		title: '用户名',
		dataIndex: 'username',
	}, {
		title: '性别',
		dataIndex: 'gender',
	}, {
		title: '角色',
		render: (user) => {
			const { groups = [] } = user || {};
			const roles = groups.map(group => group.name);
			return roles.join('、')
		}
	}, {
		title: '职务',
		dataIndex: 'title',
	}, {
		title: '手机号码',
		dataIndex: 'person_telephone',
	}, {
		title: '邮箱',
		dataIndex: 'email',
	}, {
		title: '所属部门',
		dataIndex: 'organization',
	}, {
		title: '电子签章',
		dataIndex: 'relative_signature_url',
		render: (sign) => {
			return <img width={30} src={`${sign}`} alt="" />;
		}
	}, {
		title: '头像',
		dataIndex: 'relative_avatar_url',
		render: (avatar) => {
			return <img width={20} src={`${avatar}`} alt="" />;
		}
	}, {
		title: '操作',
		render: (user) => {
			return [
				<a onClick={this.edit.bind(this, user)} key={1} style={{ marginRight: '.5em' }}>编辑</a>,
				<Popconfirm title="是否真的要删除用户?" key={2}
					onConfirm={this.del.bind(this, user)} okText="是" cancelText="否">
					<a>删除</a>
				</Popconfirm>
			]
		}
	}];

	rowSelection = {

		onChange: (selectedRowKeys) => {
			console.log("selectedRowKeys", selectedRowKeys)
			this.selectedCodes = selectedRowKeys;
		}
	};

	append() {
		const {
			sidebar: { node } = {},
			actions: { changeAdditionField }
		} = this.props;
		console.log(this.props)
		if (node.children && node.children.length > 0) {
			message.warn('请选择最下级组织结构目录');
		} else {
			changeAdditionField('visible', true);

		}

	}

	remove() {
		const {
			sidebar: { node } = {},
			actions: { deleteUser, getUsers }
		} = this.props;
		const codes = Users.collect(node);
		this.selectedCodes.map((userId) => {
			return deleteUser({ userID: userId }).then(() => {
				getUsers({}, { org_code: codes });
			});
		});
	}

	edit(user, event) {
		event.preventDefault();
		const account = user.account;
		const groups = user.groups || [];
		const {
			actions: { resetAdditionField }
		} = this.props;
		console.log("user", user)
		console.log("resetAdditionField", resetAdditionField)
		resetAdditionField({
			visible: true,
			roles: groups.map(group => String(group.id)),
			...user,
			...account,

		});
	}

	del(user) {
		const {
			sidebar: { node } = {},
			actions: { deleteUser, getUsers }
		} = this.props;
		const codes = Users.collect(node);
		if (user.id) {
			deleteUser({ userID: user.id }).then(() => {
				getUsers({}, { org_code: codes });
			});
		}
	}

	static collect = (node = {}) => {
		const { children = [], code } = node;
		let rst = [];
		rst.push(code);
		children.forEach(n => {
			const codes = Users.collect(n);
			rst = rst.concat(codes);
		});
		return rst;
	}
}
