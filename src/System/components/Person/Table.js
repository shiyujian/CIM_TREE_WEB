import React, { Component } from 'react';
import { Table, Row, Col, Form, Select, Button, Popconfirm, message, Input,Progress } from 'antd';
import './index.less';

const FormItem = Form.Item;
const { Option, OptGroup } = Select;

// class Users extends Component {

export default class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sections: [],
			tag: null,
			searchList:[],
			search:false,
			loading: false,
			percent: 0,
		}
	}
	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
	changeRoles(value) {
		const { actions: { changeAdditionField } } = this.props;
		console.log("value", value)
			('roles', value)
	}
	changeSections(value) {
		console.log("value", value)
		this.setState({ sections: value });
	}

	changeTagss(value) {
		console.log("value", value)
		this.setState({ tag: value });
	}
	initopthins(list) {
		const ops = [];
		for (let i = 0; i < list.length; i++) {
			ops.push(<Option key={i} >{list[i].NurseryName}</Option>)
		}
		return ops;
	}
	//人员标段和组织机构标段比较器，如果满足条件返回true
	compare(user, l1, s) {		
		if (l1 == undefined || s == undefined) {
			return false
		}
		// let l2 = s.split(',')
		// for (let i = 0; i < l1.length; i++) {
		// 	const e1 = l1[i];
		// 	for (let j = 0; j < l2.length; j++) {
		// 		const e2 = l2[j];
		// 		if (e1 == e2) {
		// 			return true
		// 		}
		// 	}
		// }
		// if(l1>)
		if(l1.startsWith(s)){
				return true;	
		}

		return false;
	}

	search() {
		let text = document.getElementById("NurseryData").value;
		let searchList = []
		const { platform: { users = [] } } = this.props;
		users.map((item) => {
			if (item && item.username) {
				if (item.username.indexOf(text) > -1) {
					searchList.push(item)
				}
			}
		})
		this.setState({
			searchList: searchList,
			search: true
		})
	}
	render() {
		const { platform: { roles = [] }, filter = {}, addition = {}, actions: { changeFilterField, changeAdditionField }, tags = {}, sidebar: { node: { extra_params: { sections } = {} ,code} = {}, parent } = {} } = this.props;
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);

		const tagsOptions = this.initopthins(tags);
		const { platform: { users = [] },actions: {getTreeModal} } = this.props;
		const{
			searchList,
			search
		}= this.state
		let dataSource = [];
		// if(users.length>0){
		// 	getTreeModal(false)
		// }
		if(search){
			dataSource = searchList
			this.state.search=false
		}else{
			dataSource = users
		}
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));

		let is_active = false
		if (user.is_superuser) {
			is_active = true;
		} else {
			if (code) {
				is_active = this.compare(user, user.account.org_code, code)
			}
		}
		return (
			is_active ?
				<div>
					<div>
						<Row style={{marginBottom:"20px"}}>
							<Col span={12}>
								<label style={{ minWidth: 60, display: 'inline-block' }}>用户名:</label>
								<Input id='NurseryData' className='search_input' />
							</Col>
							<Col span={7}>
								<Select placeholder="请选择角色" value={filter.role} onChange={changeFilterField.bind(this, 'role')}
									mode="multiple" style={{ width: '100%' }}>
									<OptGroup label="苗圃角色">
										{
											systemRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="施工角色">
										{
											projectRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="监理角色">
										{
											professionRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="业主角色">
										{
											departmentRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
								</Select>
							</Col>
							<Col span={4} style={{marginLeft:"20px"}}>
							<Button  type='primary' onClick={this.search.bind(this)} style={{ minWidth: 30, display: 'inline-block', marginRight: 20 }}>查询</Button>							
										
							</Col>
						</Row>
						<Row style={{marginBottom:"20px"}}>
							<Col span={3}>
								<Button onClick={this.append.bind(this)}>添加用户</Button>
							</Col>
							<Col span={3}>
								<Popconfirm title="是否真的要删除选中用户?"
									onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
									<Button>批量删除</Button>

								</Popconfirm>
							</Col>
							{/*<Col span={6}>
							<FormItem {...Users.layout} label="苗圃">
								<Select placeholder="苗圃" value={this.state.tag} showSearch onChange={this.changeTagss.bind(this)}
									 style={{ width: '100%' }}>
									{tagsOptions}
								</Select>
							</FormItem>
						</Col>
						<Col span={4}>
							<FormItem {...Users.layout} label="标段">
								<Select placeholder="标段" value={this.state.sections} onChange={this.changeSections.bind(this)}
									mode="multiple" style={{ width: '100%' }}>
									<Option key={'P009-01-01'} >1标段</Option>
									<Option key={'P009-01-02'} >2标段</Option>
									<Option key={'P009-01-03'} >3标段</Option>
									<Option key={'P009-01-04'} >4标段</Option>
									<Option key={'P009-01-05'} >5标段</Option>
								</Select>
							</FormItem>
						</Col>

						<Col span={2} style={{ float: "right", marginLeft: "10px" }}>
							<Button onClick={this.saves.bind(this)}>确定</Button>
						</Col>
						<Col span={6} style={{ float: "right" }}>
							<FormItem {...Users.layout} label="角色">
								<Select placeholder="请选择角色" value={addition.roles} onChange={this.changeRoles.bind(this)}
									mode="multiple" style={{ width: '100%' }}>
									<OptGroup label="苗圃角色">
										{
											systemRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="施工角色">
										{
											projectRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="监理角色">
										{
											professionRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
									<OptGroup label="业主角色">
										{
											departmentRoles.map(role => {
												return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
											})
										}
									</OptGroup>
								</Select>
							</FormItem>
						</Col>*/}

						</Row>
					</div>
					<Table rowKey="id" size="middle" bordered rowSelection={this.rowSelection} columns={this.columns} dataSource={dataSource} 
					loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.props.getTreeModals}}
									
					/>
				</div>
				: <h3>{'没有权限'}</h3>

		);
	}
	saves() {
		const { platform: { users = [] }, tags = {} } = this.props;
		const {
			addition = {}, sidebar: { node } = {},
			actions: { postUser, clearAdditionField, getUsers, putUser }
		} = this.props;
		console.log("addition", addition)
		console.log("this.selectedCodes", this.selectedCodes)
		const roles = addition.roles || [];
		console.log("2222222", this.state.sections)
		console.log("roles", roles)
		console.log("users", users)
		// if (this.selectedCodes == undefined) {
		// 	message.warn('请您选择需要添加角色的人');
		// 	return
		// }
		for (let i = 0; i < users.length; i++) {
			const element = users[i];
			console.log(element)
			console.log(this.selectedCodes)
			for (let j = 0; j < this.selectedCodes.length; j++) {
				const selectedCode = this.selectedCodes[j];
				console.log("111", element)
				if (element.id == selectedCode) {
					console.log("已经选中")
					putUser({ id: element.id }, {
						username: element.username,
						email: element.email,
						// password: addition.password, // 密码不能变？信息中没有密码
						account: {
							person_name: element.person_name,
							person_type: "C_PER",
							person_avatar_url: "",
							// organization: {
							// 	pk: '229356816973',
							// 	code: "ORG_02_31_02",
							// 	obj_type: "C_ORG",
							// 	rel_type: "member",
							// 	name: '施工队'
							// },
						},
						tags: [{ id: tags[this.state.tag].ID, name: tags[this.state.tag].NurseryName }],
						//sections: this.state.sections,
						// groups: roles.map(role => +role),
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
							console.log("element", element)
							// console.log("Addition",Addition)
							// const codes = element.collect(node);
							// console.log("codes", codes)
							// getUsers({}, { org_code: element.org_code });
						} else {
							console.log("111")
							message.warn('服务器端报错！');
						}
					})
				}

			}
			// const selectedCodes=this.selectedCodes[0] || ''
			// return;




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
// export default Form.create()(Users)

