import React, { Component } from 'react';
import { Modal, Row, Col, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';

import { getProjectUnits } from '../../../_platform/auth'
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

// export default class Addition extends Component {
class Addition extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			searchList: [],
			search: false,
			searchValue: '',
			newKey: Math.random()
		}
	}

	renderContent() {

		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const { platform: { roles = [] } } = this.props;
		var systemRoles = []
		if (user.is_superuser) {
			systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
			systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
			systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
			systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
		}
		else {
			for (let i = 0; i < user.groups.length; i++) {
				const rolea = user.groups[i].grouptype
				switch (rolea) {
					case 0:
						systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
						break;
					case 1:
						systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
						systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
						break;
					case 2:
						systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
						break;
					case 3:
						systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
						break;
					default:
						break;
				}
			}
		}
		const objs = systemRoles.map(roless => {
			return (<OptGroup label={roless.name}>
				{
					roless.value.map(role => {
						return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
					})
				}
			</OptGroup>)
		})
		return objs
	}

	renderTitle() {

		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const { platform: { roles = [] } } = this.props;
		var systemRoles = []
		if (user.is_superuser) {
			systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
			systemRoles.push({ name: '施工职务', children: ["施工领导", "协调调度人", "质量负责人", "安全负责人", "文明负责人", "普通员工", "施工文书", "测量员"], value: roles.filter(role => role.grouptype === 1) });
			systemRoles.push({ name: '监理职务', children: ["总监", "监理组长", "普通监理", "监理文书"], value: roles.filter(role => role.grouptype === 2) });
			systemRoles.push({ name: '业主职务', children: ["业主", "业主文书","业主领导"], value: roles.filter(role => role.grouptype === 3) });
		}
		else {
			for (let i = 0; i < user.groups.length; i++) {
				const rolea = user.groups[i].grouptype
				switch (rolea) {
					case 0:
						systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
						break;
					case 1:
						systemRoles.push({ name: '苗圃职务', children: ["苗圃"], value: roles.filter(role => role.grouptype === 0) });
						systemRoles.push({ name: '施工职务', children: ["施工领导", "协调调度人", "质量负责人", "安全负责人", "文明负责人", "普通员工", "施工文书", "测量员"], value: roles.filter(role => role.grouptype === 1) });
						break;
					case 2:
						systemRoles.push({ name: '监理职务', children: ["总监", "监理组长", "普通监理", "监理文书"], value: roles.filter(role => role.grouptype === 2) });
						break;
					case 3:
						systemRoles.push({ name: '业主职务', children: ["业主", "业主文书","业主领导"], value: roles.filter(role => role.grouptype === 3) });
						break;
					default:
						break;
				}
			}
		}
		const objs = systemRoles.map(roless => {
			return (<OptGroup label={roless.name}>
				{
					roless.children.map(role => {
						return (<Option key={role} value={role}>{role}</Option>)
					})
				}
			</OptGroup>)
		})
		return objs
	}

	render() {
		const { form: {
			getFieldDecorator
		}, platform: { roles = [] }, addition = {}, actions: { changeAdditionField }, tags = [] } = this.props;
		const tagsOptions = this.initopthins(tags);
		const {
			search
		} = this.state
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		let nurseryData = [];
		let defaultNurse = this.query(addition)
		let units = this.getUnits()
		return (
			<Modal title={addition.id ? "编辑人员信息" : "新增人员"} visible={addition.visible} className="large-modal" width={800}
				maskClosable={false}
				key={this.state.newKey}
				onOk={this.save.bind(this)} onCancel={this.cancel.bind(this)}>
				<Form>
					<Row gutter={24}>
						<Col span={12}>
							<FormItem   {...Addition.layout} label="用户名:">
								{
									getFieldDecorator('UserName', {
										initialValue: `${addition.username ? addition.username : ''}`,
										rules: [
											{ required: true, message: '请输入用户名' }
										]
									})
										(
										<Input readOnly={!!addition.id} placeholder="请输入用户名"
											onChange={changeAdditionField.bind(this, 'username')}
										/>
										)
								}

							</FormItem>
							<FormItem   {...Addition.layout} label="姓名:">
								{
									getFieldDecorator('FullName', {
										initialValue: `${addition.person_name ? addition.person_name : ''}`,
										rules: [
											{ required: true, message: '请输入姓名' }
										]
									})
										(
										<Input placeholder="请输入姓名"
											onChange={changeAdditionField.bind(this, 'person_name')}
										/>
										)
								}
							</FormItem>
							<FormItem   {...Addition.layout} label="性别:">
								{
									getFieldDecorator('sexName', {
										initialValue: `${addition.gender ? addition.gender : ''}`,
										rules: [
											{ required: true, message: '请选择性别' }
										]
									})
										(
										<Select placeholder="请选择性别" onChange={changeAdditionField.bind(this, 'gender')} style={{ width: '100%' }}>
											<Option value="女">女</Option>
											<Option value="男">男</Option>
										</Select>
										)
								}
							</FormItem>
							{user.is_superuser ?
								<FormItem {...Addition.layout} label="部门编码">
									<Input placeholder="部门编码" value={addition.org_code} onChange={changeAdditionField.bind(this, 'org_code')} />
								</FormItem> : ''
							}
							{
								addition.id ? <FormItem {...Addition.layout} label="密码">
									<Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password}
										onChange={changeAdditionField.bind(this, 'password')} />
								</FormItem> : <FormItem   {...Addition.layout} label="密码:">
										{
											getFieldDecorator('PassWord', {
												initialValue: `${addition.password ? addition.password : ''}`,
												rules: [
													{ required: true, message: '请输入密码' }
												]
											})
												(
												<Input disabled={!!addition.id} placeholder="请输入密码"
													onChange={changeAdditionField.bind(this, 'password')} />
												)
										}
									</FormItem>
							}

							<FormItem {...Addition.layout} label="标段">
								<Select placeholder="标段" value={addition.id ? addition.sections : this.props.isSection} onChange={this.changeRolea.bind(this)}
									mode="multiple" style={{ width: '100%' }}>
									{
										units ?
											units.map((item) => {
												return <Option key={item.code} value={item.code} >{item.value}</Option>
											}) :
											''
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem {...Addition.layout} label="邮箱">
								<Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} />
							</FormItem>
							<FormItem   {...Addition.layout} label="手机号码:">
								{
									getFieldDecorator('telephone', {
										initialValue: `${addition.person_telephone ? addition.person_telephone : ''}`,
										rules: [
											{ required: true, message: '请输入手机号码' }
										]
									})
										(
										<Input placeholder="请输入手机号码" onChange={changeAdditionField.bind(this, 'person_telephone')} />
										)
								}
							</FormItem>
							<FormItem   {...Addition.layout} label="职务:">
								{
									getFieldDecorator('titles', {
										initialValue: `${addition.title ? addition.title : ''}`,
										rules: [
											{ required: true, message: '请选择职务' }
										]
									})
										(
										<Select placeholder="请选择职务" onChange={changeAdditionField.bind(this, 'title')}
											style={{ width: '100%' }}>
											{
												this.renderTitle()
											}
										</Select>
										)
								}
							</FormItem>
							{user.is_superuser ?
								<FormItem {...Addition.layout} label="部门名称">
									<Input placeholder="部门名称" value={addition.organization} onChange={changeAdditionField.bind(this, 'organization')} />
								</FormItem> : ''
							}
							<FormItem   {...Addition.layout} label="角色:">
								{
									getFieldDecorator('rolesNmae', {
										initialValue: addition.roles,
										rules: [
											{ required: true, message: '请选择角色' }
										]
									})
										(
										<Select placeholder="请选择角色"
											onChange={this.changeRoles.bind(this)}
											mode="multiple" style={{ width: '100%' }}>
											{
												this.renderContent()
											}
										</Select>
										)
								}
							</FormItem>
							<FormItem {...Addition.layout} label="苗圃">
								{/* <Select placeholder="苗圃" showSearch value={addition.tags} onChange={changeAdditionField.bind(this, 'tags')}
								mode="multiple" style={{ width: '100%' }} > */}
								{/* {tagsOptions} */}

								<Select placeholder="苗圃" showSearch
									value={defaultNurse}
									optionFilterProp='children'
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									onChange={this.changeNursery.bind(this)}
									style={{ width: '100%' }} >
									{tagsOptions}
								</Select>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}

	//获取项目的标段
	getUnits() {
		const {
			sidebar: { node = {} } = {},
			listStore = []
		} = this.props;
		let projectName = ''
		listStore.map((item, index) => {
			item.map((rst) => {
				if ((rst.name === node.name) && (rst.code === node.code)) {
					projectName = listStore[index] ? listStore[index][0].name : ''
				}
			})

		})
		return getProjectUnits(projectName)
	}

	//初始化苗圃
	initopthins(list) {
		const ops = [];
		for (let i = 0; i < list.length; i++) {
			ops.push(<Option key={list[i].ID} value={list[i].ID} title={list[i].NurseryName + '-' + list[i].Factory}>{list[i].NurseryName + '-' + list[i].Factory}</Option>)
		}
		return ops;
	}

	componentDidMount() {
		const { actions: { getRoles } } = this.props;
		getRoles();
	}

	changeRoles(value) {
		const { actions: { changeAdditionField } } = this.props;
		changeAdditionField('roles', value)
	}
	changeRolea(value) {
		const { actions: { changeAdditionField, getSection } } = this.props;
		getSection(value)
		changeAdditionField('sections', value)
	}
	//将选择的苗圃传入redux
	changeNursery(value) {
		const { actions: { changeAdditionField }, tags = [] } = this.props;
		let defaultTags = []
		//对于从select组建传过来的value，进行判断，如果是ID，直接push，如果是苗圃名字，那么找到对应的ID，再push
		// value.map((item) => {
		let data = value.toString().split('-');
		if (data.length === 2) {
			tags.map((rst) => {
				if (rst && rst.ID) {
					if (rst.NurseryName === data[0] && rst.Factory === data[1]) {
						defaultTags.push(rst.ID.toString())
					}
				}
			})
		} else {
			defaultTags.push(value.toString())
		}
		// })
		defaultTags = [...new Set(defaultTags)]
		changeAdditionField('tags', defaultTags)
	}
	//对苗圃的id显示为苗圃的名称
	query(value) {
		if (value && value.tags) {
			const {
				tags = []
			} = this.props
			let array = value.tags || []
			let defaultNurse = []
			array.map((item) => {
				tags.map((rst) => {
					if (rst && rst.ID) {
						if (rst.ID.toString() === item) {
							defaultNurse.push(rst.NurseryName + '-' + rst.Factory)
						}
					}
				})
			})
			return defaultNurse
		}
	}

	 save() {
		const {
			addition = {}, sidebar: { node } = {},
			platform: { users = [] },
			actions: { postUser, clearAdditionField, getUsers, putUser, getSection ,getTablePage,getIsBtn}, tags = {}
		} = this.props;
		const roles = addition.roles || [];
		if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
			message.warn('请输入英文字符、数字');
		} else {
			if (addition.id) {
				for (let i = 0; i < users.length; i++) {
					// const element = users[i];
					if(users[i].person_id==addition.person_id){
						users[i]=addition
						users[i].account=addition
					}
				}
				this.props.form.validateFields((err, values) => {
					console.log("err", err)
					if (!err || !err.FullName && !err.UserName && !err.rolesNmae && !err.sexName && !err.telephone && !err.titles) {
						putUser({}, {
							id: addition.id,
							username: addition.username,
							email: addition.email,
							// password: addition.password, // 密码不能变？信息中没有密码
							account: {
								person_name: addition.person_name,
								person_type: "C_PER",
								person_avatar_url: "",
								organization: {
									pk: node.pk,
									code: addition.org_code,
									obj_type: "C_ORG",
									rel_type: "member",
									name: addition.organization
								},
							},
							tags: addition.tags,
							sections: addition.sections,
							//groups: [7],
							groups: roles.map(role => +role),
							is_active: true,
							basic_params: {
								info: {
									'电话': addition.person_telephone || '',
									'性别': addition.gender || '',
									'技术职称': addition.title || '',
									'phone': addition.person_telephone || '',
									'sex': addition.gender || '',
									'duty': ''
								}
							},
							extra_params: {},
							title: addition.title || ''
						}).then(rst => {
							if (rst.code == 1) {			
								const codes = Addition.collect(node);
								message.info('修改人员成功');
								// 控制是否通过角色条件分页
								// getIsBtn(true)
								let sectiona = []
								getSection(sectiona)
								clearAdditionField();
								this.setState({
									newKey: Math.random()
								})

							} else {
								message.warn('服务器端报错！');
							}
						})
					}
				});

			} else {
				this.props.form.validateFields((err, values) => {
					if (!err) {
						postUser({}, {
							is_person: true,
							username: addition.username,
							email: addition.email || '',
							password: addition.password,
							account: {
								person_code: addition.code,
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
							tags: addition.tags,
							sections: addition.id ? addition.sections : this.props.isSection,
							groups: roles.map(role => +role),
							is_active: true,
							basic_params: {
								info: {
									'电话': addition.person_telephone || '',
									'性别': addition.gender || '',
									'技术职称': addition.title || '',
									'phone': addition.person_telephone || '',
									'sex': addition.gender || '',
									'duty': ''
								}
							},
							extra_params: {},
							title: addition.title || ''
						}).then(rst => {
							if (rst.code == 1) {
								message.info('新增人员成功');
								let sectiona = []
								getSection(sectiona)
								clearAdditionField();
								const codes = Addition.collect(node);
								getUsers({}, { org_code: codes,page:this.props.getTablePages.current }).then(rest=>{
									let pagination = {
										current: this.props.getTablePages.current,
										total: rest.count,
									};
									getTablePage(pagination)
								});
								this.setState({
									newKey: Math.random()
								})
							} else {
								if (rst.code == 2) {
									message.warn('用户名已存在！');
								} else {
									message.warn('服务器端报错！');
								}
							}
						})
					}
				});

			}
		}
	}

	cancel() {
		const { actions: { clearAdditionField } } = this.props;
		this.setState({
			newKey: Math.random()
		})
		clearAdditionField();
	}

	static collect = (node = {}) => {
		const { children = [], code } = node;
		let rst = [];
		rst.push(code);
		// children.forEach(n => {
		// 	const codes = Addition.collect(n);
		// 	rst = rst.concat(codes);
		// });
		return rst;
	}

	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
}
export default Form.create()(Addition)
