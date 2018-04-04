import React, { Component } from 'react';
import { Table, Row, Col, Form, Select, Button, Popconfirm, message, Input, Progress, Spin } from 'antd';
import { PROJECT_UNITS } from './../../../_platform/api';
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
			searchList: [],
			loading: false,
			percent: 0,
			edit: true,
			roles: [],
			selectedRowKeys: [],
			btn: '',
			fristText: '',
			fristRoles: [],
			TreeCodes: '',
			isBtn: true,
			objPage:'',
			objPages:''
			
		}
	}
	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};
	changeRoles(value) {
		const { actions: { changeAdditionField } } = this.props;
		changeAdditionField('roles', value)
		console.log("value", value)
		this.setState({
			roles: value
		})
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
		if (user.is_superuser) {
			return true;
		}
		if (l1 == undefined || s == undefined) {
			return false
		}

		if (s.startsWith(l1)) {
			return true;
		}
	}

	// search() {
	// 	const { actions: { setUpdate } } = this.props;
	// 	let text = document.getElementById("NurseryData").value;
	// 	let searchList = []
	// 	const { platform: { users = [] } } = this.props;
	// 	users.map((item) => {
	// 		let isName = false;
	// 		let isRoles = false;
	// 		if (!text) {
	// 			isName = true
	// 		}
	// 		else {
	// 			if (text && item.username.indexOf(text) > -1) {
	// 				isName = true
	// 			}
	// 		}

	// 		if (this.state.roles.length == 0) {
	// 			isRoles = true
	// 		} else {
	// 			if (this.state.roles.sort().join(',') == item.groups.map(i => {
	// 				return String(i.id)
	// 			}).sort().join(',')) {
	// 				isRoles = true
	// 			}
	// 		}

	// 		if (isName && isRoles) {
	// 			searchList.push(item)
	// 		}
	// 	})
	// 	setUpdate(false);
	// 	this.setState({
	// 		searchList: searchList,
	// 	})

	// }

	search() {
		let text = document.getElementById("NurseryData").value;
		const {
			actions: { getUsers, getTablePage, getIsBtn },
		} = this.props;
		if (text || this.state.roles && this.state.roles.length > 0) {
			this.setState({ loading: true });
			// 如果查询输入框里面的内容没有改变就不执行
			// if(text!=this.state.fristText || this.state.fristRoles!=this.state.roles){
				
			getUsers({}, { org_code: this.props.getTreeCodes, "keyword": text, roles: this.state.roles, page:  1 }).then(items => {
				console.log("items111111",items)
				let pagination = {
					current:1,
					total: items.count,
				};
				getTablePage(pagination)
				this.setState({ btn: true, fristText: text, fristRoles: this.state.roles, isBtn: false, loading: false})
				getIsBtn(false)

			})
			// }

		} else {
			// if(this.state.btn){
			// this.setState({ loading: true });
			getUsers({}, { org_code: this.props.getTreeCodes, page:this.state.objPages || 1 }).then((e) => {
				let pagination = {
					current: this.state.objPages || 1,
					total: e.count,
				};
				getTablePage(pagination)
				this.setState({ btn: false, fristText: '', fristRoles: [], isBtn: true})
				getIsBtn(true)

			});
			// }
		}
	}

	confirms() {
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		if (user.is_superuser == true) {
			return [<Col span={3}>
				<Button onClick={this.append.bind(this)}>添加用户</Button>
			</Col>,
			<Col span={3}>
				<Popconfirm title="是否真的要删除选中用户?"
					onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
					<Button >批量删除</Button>
				</Popconfirm>
			</Col>]
		} else {
			return <Col span={3}>
				<Button onClick={this.append.bind(this)}>添加用户</Button>
			</Col>
		}


	}
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
	sectiontitle(record) {
		let sectione = []
		for (let i = 0; i < PROJECT_UNITS.length; i++) {
			const item = PROJECT_UNITS[i];
			for (let j = 0; j < item.units.length; j++) {
				const element = item.units[j];
				for (let z = 0; z < record.sections.length; z++) {
					const items = record.sections[z];
					if (items == element.code) {
						sectione.push(element.value)
					}
				}
			}
		}
		return sectione
	}
	render() {
		const { isUpdate = false, platform: { roles = [] }, filter = {}, addition = {}, actions: { changeFilterField, changeAdditionField }, tags = {}, sidebar: { node: { extra_params: { sections } = {}, code } = {}, parent } = {} } = this.props;
		const systemRoles = roles.filter(role => role.grouptype === 0);
		const projectRoles = roles.filter(role => role.grouptype === 1);
		const professionRoles = roles.filter(role => role.grouptype === 2);
		const departmentRoles = roles.filter(role => role.grouptype === 3);
		const tagsOptions = this.initopthins(tags);

		const { platform: { users = [] }, actions: { getTreeModal } } = this.props;
		const {
			searchList,
		} = this.state
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			render: (index) => {
				return index + 1;
			}
		}, {
			title: '姓名',
			dataIndex: 'person_name',
		}
			// , {
			// 	title: '编码',
			// 	dataIndex: 'person_code',
			// }
			,
		{
			title: '用户名',
			dataIndex: 'username',
		}, {
			title: '性别',
			dataIndex: 'gender',
		}, {
			title: '角色',
			width: '15%',
			render: (user) => {
				if (user.roles) {
					const {  platform: { roles = [] } } = this.props;
					let add=[]
					for (let i = 0; i < user.roles.length; i++) {
						const element = user.roles[i];
						for (let j = 0; j < roles.length; j++) {
							const element = roles[j];
							if(user.roles[i]==roles[j].id){
								add.push(roles[j].name)
							}
						}
					}
					return add.join('、')
				} else {
					const { groups = [] } = user || {};
					const roles = groups.map(group => group.name);
					return roles.join('、')
				}
			}
		}, {
			title: '职务',
			dataIndex: 'title',
		}, {
			title: '手机号码',
			dataIndex: 'person_telephone',
		}
			// , {
			// 	title: '邮箱',
			// 	dataIndex: 'email',
			// }
			, {
			title: '所属部门',
			dataIndex: 'organization',
		}, {
			title: '标段',
			// dataIndex: "sections",
			// key: 'Sections',
			render: (text, record, index) => {
				let sectiones = this.sectiontitle(record)
				return sectiones.join()
			}
		}
			// , {
			// 	title: '苗圃',
			// 	// dataIndex: "tags",
			// 	// key: 'tags',
			// 	render: (text, record, index) => {
			// 		let defaultNurse = this.query(record)
			// 		return defaultNurse.join()
			// 	}
			// }
			// , {
			// 	title: '电子签章',
			// 	dataIndex: 'relative_signature_url',
			// 	render: (sign) => {
			// 		return <img width={30} src={`${sign}`} alt="" />;
			// 	}
			// }, {
			// 	title: '头像',
			// 	dataIndex: 'relative_avatar_url',
			// 	render: (avatar) => {
			// 		return <img width={20} src={`${avatar}`} alt="" />;
			// 	}
			// }
			, {
			title: '操作',
			render: (user) => {
				const userc = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
				if (userc.is_superuser == true) {
					if (user.is_active == true) {
						return [<a onClick={this.edit.bind(this, user)} key={1} style={{ marginRight: '.5em' }}>编辑</a>,
						<Popconfirm title="是否真的要删除用户?" key={2}
							onConfirm={this.del.bind(this, user)} okText="是" cancelText="否">
							<a>删除</a>
						</Popconfirm>,
						<a style={{ marginLeft: '.5em' }} onClick={this.disable.bind(this, user)}>禁用</a>
						]
					} else {
						return [<a onClick={this.edit.bind(this, user)} key={1} style={{ marginRight: '.5em' }}>编辑</a>,
						<Popconfirm title="是否真的要删除用户?" key={2}
							onConfirm={this.del.bind(this, user)} okText="是" cancelText="否">
							<a>删除</a>
						</Popconfirm>,
						<a style={{ color: 'red', marginLeft: '.5em' }} onClick={this.disable.bind(this, user)}>启用</a>
						]
					}
				} else {
					return <a onClick={this.edit.bind(this, user)} key={1} style={{ marginRight: '.5em' }}>编辑</a>
				}
			}
		}];
		// let dataSource = [];
		// if (isUpdate) {
		// 	dataSource = users
		// } else {
		// 	dataSource = searchList
		// }
		const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));

		let is_active = false
		if (user.is_superuser) {
			is_active = true;
		} else {
			if (code) {

				const ucodes = user.account.org_code.split("_");
				if (ucodes.length > 5) {
					ucodes.pop()
					const codeu = ucodes.join()
					const ucode = codeu.replace(/,/g, '_')
					is_active = this.compare(user, ucode, code)
				} else {
					const ucode = user.account.org_code.substring(0, 9);
					is_active = this.compare(user, ucode, code)
				}
			}
		}
		return (
			is_active ?
				<div>
					<Spin tip="加载中" percent={this.state.percent} status="active" strokeWidth={5} spinning={this.state.loading}>
						<div>
							<Row style={{ marginBottom: "20px" }}>
								<Col span={10}>
									<label style={{ minWidth: 60, display: 'inline-block' }}>用户名:</label>
									<Input id='NurseryData' className='search_input' />
								</Col>
								<Col span={7}>
									<Select placeholder="请选择角色" value={this.state.roles || []} onChange={this.changeRoles.bind(this)}
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
								<Col span={4} style={{ marginLeft: "20px" }}>
									<Button type='primary' onClick={this.search.bind(this)} style={{ minWidth: 30, display: 'inline-block', marginRight: 20 }}>查询</Button>

								</Col>
							</Row>


							<Row style={{ marginBottom: "20px" }}>
								{
									this.confirms()
								}
								{/*	<Button onClick={this.saves.bind(this)}>确定</Button>*/}
								{/* <Col span={3}>
								<Button onClick={this.append.bind(this)}>添加用户</Button>
							</Col>
							<Col span={3}>
								<Popconfirm title="是否真的要删除选中用户?"
									onConfirm={this.remove.bind(this)} okText="是" cancelText="否">
									<Button>批量删除</Button>

								</Popconfirm>
							</Col> */}
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
						<Table rowKey="id" size="middle" bordered rowSelection={this.rowSelection} columns={columns} dataSource={users}
							pagination={this.props.getTablePages} onChange={this.changePage.bind(this)}
							loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status="active" strokeWidth={5} />, spinning: this.props.getTreeModals }}
						/>
					</Spin>
				</div>
				: <h3>{'没有权限'}</h3>

		);
	}
	componentWillReceiveProps(nextProps) {
		const {
			actions: { getUsers, getTablePage, getIsBtn }
		} = nextProps;
		this.setState({ TreeCodes: this.props.getTreeCodes })
		if (this.state.TreeCodes != this.props.getTreeCodes) {
			this.setState({ roles: [] })
		}
	}
	async changePage(obj) {
		let text = document.getElementById("NurseryData").value;
		const {
			actions: { getUsers, getTreeModal, setUpdate, getTablePage }
		} = this.props;
		if (this.props.getIsBtns) {
			getTreeModal(true)
			getUsers({}, { org_code: this.props.getTreeCodes, page: obj.current }).then((e) => {
				let pagination = {
					current: obj.current,
					total: e.count,
				};
				this.setState({objPages:obj.current})				
				getTablePage(pagination)
				getTreeModal(false)
			});
		} else {
			getTreeModal(true)
			getUsers({}, { org_code: this.props.getTreeCodes,"keyword": text, roles: this.state.roles, page: obj.current }).then((e) => {
				let pagination = {
					current: obj.current,
					total: e.count,
				};
				
				this.setState({objPage:obj.current})
				getTablePage(pagination)
				getTreeModal(false)
			});
		}
	}
	saves() {
		const { platform: { users = [] }, tags = {} } = this.props;
		const {
			addition = {}, sidebar: { node } = {},
			actions: { postUser, clearAdditionField, getUsers, putUser }
		} = this.props;
		const roles = addition.roles || [];
		// if (this.selectedCodes == undefined) {
		// 	message.warn('请您选择需要添加角色的人');
		// 	return
		// }
		for (let i = 0; i < users.length; i++) {
			const element = users[i];
			for (let j = 0; j < this.selectedCodes.length; j++) {
				const selectedCode = this.selectedCodes[j];
				if (element.id == selectedCode) {
					putUser({}, {
						/*						username: element.username,
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
												title: element.title || ''*/

						id: element.id,
						username: element.username,
						email: element.email,
						// password: addition.password, // 密码不能变？信息中没有密码
						account: {
							person_name: element.person_name,
							person_type: "C_PER",
							person_avatar_url: "",
							organization: {
								pk: node.pk,
								code: element.org_code,
								obj_type: "C_ORG",
								rel_type: "member",
								name: element.organization
							},
						},
						tags: element.tags,
						sections: element.sections,
						//groups: [7],
						groups: [1],
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
						// if (rst.id) {
						// 	clearAdditionField();
						// 	console.log("element", element)
						// 	// console.log("Addition",Addition)
						// 	// const codes = element.collect(node);
						// 	// console.log("codes", codes)
						// 	// getUsers({}, { org_code: element.org_code });
						// } else {
						// 	console.log("111")
						// 	message.warn('服务器端报错！');
						// }
					})
				}

			}
			// const selectedCodes=this.selectedCodes[0] || ''
			// return;
		}
	}

	rowSelection = {
		onChange: (selectedRowKeys) => {
			console.log("selectedRowKeys", selectedRowKeys)
			this.setState({ selectedRowKeys: selectedRowKeys })
			this.selectedCodes = selectedRowKeys;
		}
	};
	changeTags(record, value) {
		record.tags = value;
		const { actions: { changeAdditionField } } = this.props;
		changeAdditionField('tags', value)
	}

	append() {
		const {
			sidebar: { node } = {},
			actions: { changeAdditionField, getSection }
		} = this.props;
		let sectiona = []
		getSection(sectiona)
		if (node.extra_params.sections) {

			if (node.extra_params.sections instanceof Array) {
				sectiona = node.extra_params.sections
			} else {
				sectiona = node.extra_params.sections.split(",")
			}
			getSection(sectiona)
		}

		if (node.children && node.children.length > 0) {
			message.warn('请选择最下级组织结构目录');
		} else {
			changeAdditionField('visible', true);
		}
	}

	remove() {
		console.log('this.state.selectedRowKeys', this.state.selectedRowKeys)
		if (this.state.selectedRowKeys.length == 0) {
			message.warn('请选择需要删除的数据！');
		} else {
			this.setState({ loading: true });
			const {
				sidebar: { node } = {},
				actions: { deleteUser, getUsers }
			} = this.props;
			const codes = Users.collect(node);
			this.selectedCodes.map((userId) => {
				return deleteUser({ userID: userId }).then(() => {

					getUsers({}, { org_code: codes }).then(() => {
						this.setState({ loading: false, selectedRowKeys: [] });
					});
				});
			});
		}
	}
	disable(user, event) {
		const {
			addition = {}, sidebar: { node } = {},
			actions: { putUser }
		} = this.props;
		let actives
		if (user.is_active == true) {
			user.is_active = false
			actives = false
		} else {
			user.is_active = true
			actives = true
		}
		let groupe = []
		for (let j = 0; j < user.groups.length; j++) {
			const element = user.groups[j];
			groupe.push(element.id)
		}
		console.log("is_actives0", actives)
		console.log("groupe", groupe, user)
		putUser({}, {
			id: user.id,
			username: user.username,
			email: user.email,
			// password: addition.password, // 密码不能变？信息中没有密码
			account: {
				person_name: user.person_name,
				person_type: "C_PER",
				person_avatar_url: "",
				organization: {
					pk: node.pk,
					code: user.org_code,
					obj_type: "C_ORG",
					rel_type: "member",
					name: user.organization
				},
			},
			tags: user.tags,
			sections: user.sections,
			//groups: [7],
			groups: groupe,
			is_active: actives,
			basic_params: {
				info: {
					'电话': user.person_telephone || '',
					'性别': user.gender || '',
					'技术职称': user.title || '',
					'phone': user.person_telephone || '',
					'sex': user.gender || '',
					'duty': ''
				}
			},
			extra_params: {},
			title: user.title || ''
		}).then(rst => {
			this.forceUpdate();
			console.log("rst", rst)
			console.log("333333333", JSON.parse(rst.msg))
		})



	}

	edit(user, event) {
		event.preventDefault();
		const account = user.account;
		const groups = user.groups || [];
		const {
			sidebar: { node } = {},
			actions: { resetAdditionField }
		} = this.props;
		// if (node.children && node.children.length > 0) {
		// 	message.warn('请选择最下级组织结构目录');

		// } else {
		// 	// console.log("user", user)
		// 	// console.log("resetAdditionField", resetAdditionField)

		// }
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
			platform: { users = [] },
			actions: { deleteUser, getUsers, getTablePage }
		} = this.props;
		const codes = Users.collect(node);
		// 		const usera = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		// console.log("usera",usera)
		// 		let is_active = false
		// 		if (usera.is_superuser) {

		// 		}
		let text = document.getElementById("NurseryData").value;
		let pages
		if(users&&users.length==1){
			pages=this.props.getTablePages.current-1
		}
		else{
			pages=this.props.getTablePages.current
		}
		if (user.id) {
			console.log("this.props.getTablePages.current", this.props.getTablePages.current)
			deleteUser({ userID: user.id }).then((as) => {
				console.log("as",as)
				if (this.props.getIsBtns) {
					getUsers({}, { org_code: codes, page: pages }).then((es) => {
					console.log("es",es)
							let pagination = {
								current: this.props.getTablePages.current,
								total: es.count,
							};
							getTablePage(pagination)
						
						
						this.setState({  loading: false })
					});
				} else {
					getUsers({}, {org_code:this.props.getTreeCodes, "keyword": text,roles:this.state.roles }).then(items => {
						console.log("items",items)

						if(items&&items.length==0){
							let pagination = {
								current: 0,
								total:0,
							};
							getTablePage(pagination)

							let currents
							if(this.props.getTablePages.current==0){
								currents=1
							}else{
								currents=this.props.getTablePages.current
							}
							this.setState({  loading: false ,objPages:currents})	
						}else{
							let pagination = {
								current: 1,
								total:items.length+1,
							};
							getTablePage(pagination)
							this.setState({  loading: false })	
						}
						
						// this.setState({  loading: false })						
					})
				}
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

