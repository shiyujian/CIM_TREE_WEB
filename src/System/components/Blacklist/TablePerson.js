import React, { Component } from 'react';
import { Table, Button, Popconfirm, Notification, Input, Icon, Spin, Progress, Switch, Pagination, Select } from 'antd';
import style from './TableOrg.css'
import DelPer from './PersonExpurgate';
import { DataReportTemplate_PersonInformation, NODE_FILE_EXCHANGE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import { flattenDeep } from 'lodash';
import { PROJECT_UNITS } from './../../../_platform/api';
const Search = Input.Search;
const { Option, OptGroup } = Select;

export default class TablePerson extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			selectData: [],
			tempData: [],
			fristTempData: [],
			
			loading: false,
			percent: 0,
			pagination: {},
			fristPagination: {},
			pages: '',
			resultInfo: {},
			serialNumber: {},
			btn: false,
			value: ''
		}
	}
	initopthins(list) {
		const ops = [];
		for (let i = 0; i < list.length; i++) {
			ops.push(<Option key={list[i].ID} >{list[i].NurseryName}</Option>)
		}
		return ops;
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
	query(value) {
		// console.log("value",value)
		
		if (value && value.tags) {
			const {
				tags = []
			} = this.props
			let array = value.tags || []
			let defaultNurse = []
		// console.log("tags",tags)
		console.log("this.props",this.props)
		
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
	renderContent(record) {
		const { platform: { roles = [] } } = this.props;
		// console.log("roles",roles)
		let groups = []
		for (let i = 0; i < roles.length; i++) {
			for (let j = 0; j < record.groups.length; j++) {
				if (roles[i].id == record.groups[j].id) {
					groups.push(roles[i].name)
				}
			}
		}
		// console.log("groups",groups)
		
		return groups
	}

	render() {
		const { platform: { roles = [], users = [] }, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;
		console.log("tags", tags)
		const columns = [
			{
				title: '序号',
				// dataIndex: 'index',
				width: '5%',
				render: (text, record, index) => {
					const current = this.state.serialNumber.current
					const pageSize = this.state.serialNumber.pageSize
					if (current != undefined && pageSize != undefined) {
						return (index + 1) + (current - 1) * pageSize;
					} else {
						return index + 1
					}
				}

			},

			// {
			// 	title: '人员编码',
			// 	dataIndex: 'code',
			// 	key: 'Code',
			// },
			{
				title: '姓名',
				dataIndex: 'account.person_name',
				width: '5%',
				key: 'account.person_name',
			}
			, {
				title: '用户名',
				dataIndex: 'username',
				width: '10%',
				key: 'username'
			}
			, {
				title: '性别',
				dataIndex: 'basic_params.info.sex',
				width: '4%',
				key: 'basic_params.info.sex'

			}, {
				title: '身份证号',
				dataIndex: 'id_num',
				width: '8%',
				key: 'id_num'
			}
			, {
				title: '手机号码',
				dataIndex: 'basic_params.info.phone',
				width: '10%',
				key: 'basic_params.info.phone'
			}
			//  , {
			// 	title: '所在组织机构单位',
			// 	dataIndex: 'type',
			// 	key: 'Org',
			// }
			, {
				title: '所属部门',
				dataIndex: 'account.organization.name',
				width: '8%',
				key: 'account.organization.name',
			}, {
				title: '职务',
				dataIndex: 'title',
				width: '8%',
				key: 'title',
			}
			// , {
			// 	title: '邮箱',
			// 	dataIndex: 'email',
			// 	key: 'email'
			// }

			// , {
			// 	title: '密码',
			// 	dataIndex: 'passwords',
			// 	key: 'Passwords'
			// }
			// , {
			// 	title: '二维码',
			// 	render: (record) => {
			// 		if (record.signature) {
			// 			if (record.signature.indexOf("documents") !== -1) {
			// 				return <img style={{ width: 60 }} src={record.signature} />
			// 			} else {
			// 				return <span>暂无</span>
			// 			}
			// 		} else {
			// 			return (<span>暂无</span>)
			// 		}
			// 	}
			// }
			, {
				title: '标段',
				// dataIndex: "sections",
				width: '6%',
				key: 'Sections',
				render: (text, record, index) => {
					let sectiones = this.sectiontitle(record)
					return sectiones.join()
				}
			}
			, {
				title: '苗圃',
				// dataIndex: "tags",
				// key: 'tags',
				width: '10%',
				render: (text, record, index) => {
					let defaultNurse = this.query(record)
					return defaultNurse.join()
				}
			}
			, {
				title: '角色',
				width: '8%',
				render: (record) => {
					// console.log("record",record)
					let groups = this.renderContent(record)
					return groups.join()
				}
			}
			, {
				title: '原因',
				width: '10%',
				dataIndex: "black_remark",
				key: 'black_remark',
				// render: (record) => {
				// 	// console.log("record",record)
				// 	let groups = this.renderContent(record)
				// 	return groups.join()
				// }
			}
			, {
				title: "移除黑名单",
				// dataIndex: "edit",
				key: "Edit",
				render: (record) => {
					return (
						<div>
							{/* <a onClick={this.edits.bind(this, record)}><Icon type="edit"></Icon></a> */}
							{/* <span style={{ "margin": "0 10px 0 10px" }}>|</span> */}
							{/* <a >
								移除
							</a> */}
							<span>
								<Popconfirm title="是否真的要移除黑名单?" onConfirm={this.confirm.bind(this, record)} okText="Yes" cancelText="No">
									<a type="primary" >移除</a>
								</Popconfirm>
							</span>
						</div>
					)
				}
			}
		]
		return (
			<div>
				<div>
					<Search enterButton className={style.button} onSearch={this.searchPerson.bind(this)} style={{ width: "240px" }} placeholder="请输入用户名" />
				</div>
				<Table
					columns={columns}
					bordered={true}
					// rowSelection={this.rowSelection}
					dataSource={this.state.tempData}
					rowKey="index"
					onChange={this.changePage.bind(this)}
					pagination={this.state.pagination}
					loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status="active" strokeWidth={5} />, spinning: this.state.loading }}
				>
				</Table>

			</div>
		)
	}
	// async componentWillReceiveProps(props) {
	// 	const { tempData, is_fresh = false } = props
	// 	// console.log("tempData",tempData)
	// 	if (is_fresh) {
	// 		this.setState({ loading: true })
	// 		const { actions: { is_fresh, getPersonInfo } } = this.props;
	// 		// 分页获取数据
	// 		// let rst = await getPersonList({ pagesize: 10, offset: 0 });
	// 		let rst = await getPersonInfo({ page: this.state.pages || 1 })
	// 		let personlist = rst.results
	// 		// console.log("rst", rst)
	// 		// let total = rst.result.total;
	// 		let persons = [];
	// 		for (let i = 0; i < personlist.length; i++) {
	// 			const element = personlist[i];
	// 			// let ret = await getPeople({code:element.code});
	// 			persons.push(element)
	// 		}
	// 		let pagination = {
	// 			current: this.state.pages,
	// 			total: rst.count,
	// 		};
	// 		console.log("pagination", pagination)
	// 		// console.log("pagination", pagination)
	// 		this.setState({
	// 			pagination: pagination
	// 		})
	// 		let data_person =
	// 			persons.map((item, index) => {
	// 				let groupsId = []
	// 				const groups = item.groups || []
	// 				for (let j = 0; j < groups.length; j++) {
	// 					const groupss = groups[j].id.toString()
	// 					groupsId.push(groupss);
	// 				}
	// 				return {
	// 					id: item.id,
	// 					index: index + 1,
	// 					// code: item.account.person_code || '',
	// 					name: item.account.person_name || '',
	// 					orgcode: item.account.org_code || '',
	// 					orgname: item.account.organization || '',
	// 					job: item.account.title || '',
	// 					sex: item.account.gender || '',
	// 					tel: item.account.person_telephone || '',
	// 					email: item.email || '',
	// 					is_user: true,
	// 					username: item.username || '',
	// 					sections: item.account.sections || '',
	// 					tags: item.account.tags || '',
	// 					groups: groupsId || []
	// 					// passwords:111111
	// 				}
	// 			})
	// 		this.setState({ dataSource: data_person, tempData: data_person, loading: false });
	// 		is_fresh(false);
	// 	}
	// }
	// //发送
	// send() {
	// 	const { actions: { ModalVisible } } = this.props;
	// 	ModalVisible(true);
	// }
	//批量删除
	expurgate() {
		const { actions: { ExprugateVisible, setDeletePer } } = this.props;
		if (this.state.selectData.length) {
			setDeletePer(this.state.selectData);
			ExprugateVisible(true);
		} else {
			Notification.warning({
				message: "请先选择数据！"
			});
		}
	}
	//批量变更
	modify() {
		const { actions: { ModifyVisible, setModifyPer } } = this.props;
		if (this.state.selectData.length) {
			let dataList = [];
			this.state.selectData.map(item => {
				let newList = { ...item }
				newList.account = { ...newList.account }
				dataList.push(newList)
			})
			setModifyPer(dataList)
			ModifyVisible(true);
		} else {
			Notification.warning({
				message: "请先选择数据！"
			});
		}
	}
	edits(record) {
		const { actions: { ModifyVisible, getAllUsers, setModifyPer } } = this.props;
		ModifyVisible(true);
		setModifyPer(record);
	}
	// // 导出excel表格
	// getExcel() {
	// 	if (this.state.excelData !== undefined) {
	// 		let exhead = ['人员编码', '姓名', '所在组织机构单位', '所属部门', '职务', '性别', '手机号码', '邮箱'];
	// 		let rows = [exhead];
	// 		let getcoordinate = (param) => {
	// 			if (typeof param !== 'string') {
	// 				return '';
	// 			}
	// 			if ((!param || param.length <= 0)) {
	// 				return ''
	// 			} else {
	// 				return param;
	// 			}
	// 		}
	// 		let excontent = this.state.excelData.map(data => {
	// 			return [
	// 				data.orgcode || '',
	// 				data.name || '',
	// 				data.orgname || '',
	// 				// data.account.org_code || '',
	// 				// data.account.user_name || '',
	// 				data.job || '',
	// 				data.sex || '',
	// 				data.tel || '',
	// 				data.email || '',
	// 				data.username || '',
	// 				data.sections || '',
	// 				data.tags || '',
	// 				data.edit || '',
	// 				data.groups || '',
	// 			];
	// 		});
	// 		rows = rows.concat(excontent);
	// 		const { actions: { jsonToExcel } } = this.props;
	// 		jsonToExcel({}, { rows: rows })
	// 			.then(rst => {
	// 				this.createLink('人员信息导出表', NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename);
	// 			})
	// 	} else {
	// 		Notification.warning({
	// 			message: "请先选择数据！"
	// 		});
	// 		return;
	// 	}
	// }

	//下载
	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	mapCodes(arr) {
		return arr.map(item => {
			if (item.children && item.children.length) {
				return [
					item.code,
					this.mapCodes(item.children)
				]
			} else {
				return item.code;
			}
		})
	}
	async changePage(obj) {
		console.log("obj", obj)
		const {
			actions: { getUsers },
		} = this.props;
		this.setState({
			fristTempData:this.state.tempData,
			fristPagination:this.state.pagination
		})
		if (!this.state.btn) {
			this.setState({ loading: true, pages: obj.current })
			const { actions: { getPersonInfo } } = this.props;
			// 分页获取数据
			let pageSize = 10;
			// let rst = await getPersonList({ pagesize: pageSize, offset: (obj.current - 1) * pageSize });
			let rst = await getPersonInfo({is_black: 1, page: obj.current })
			console.log("rst",rst)
			let personlist = rst.results
			console.log("rst", rst)
			this.setState({ serialNumber: obj })
			let persons = [];
			for (let i = 0; i < personlist.length; i++) {
				const element = personlist[i];
				persons.push(element)
			}
			let pagination = {
				current: obj.current,
				total: rst.count,
			};
			this.setState({
				pagination: pagination
			})
			let data_person =
				persons.map((item, index) => {
					let groupsId = []
					const groups = item.groups || []
					for (let j = 0; j < groups.length; j++) {
						const groupss = groups[j].id.toString()
						groupsId.push(groupss);
					}
					return {
						index: index + 1,
						id: item.id,
						username: item.username || '',
						email: item.email || '',
						account: {
							person_name: item.account.person_name,
							person_type: "C_PER",
							person_avatar_url: item.account.person_avatar_url,
							organization: {
								// pk: node.pk,
								code: item.account.org_code,
								obj_type: "C_ORG",
								rel_type: "member",
								name: item.account.organization
							},
						},
						tags: item.account.tags,
						sections: item.account.sections,
						groups: item.groups,
						black_remark: item.account.black_remark,
						is_active: item.is_active,
						id_num: item.account.id_num,
						is_black: item.account.is_black,
						id_image: item.account.id_image,
						basic_params: {
							info: {
								'电话': item.account.person_telephone || '',
								'性别': item.account.gender || '',
								'title': item.account.title || '',
								'phone': item.account.person_telephone || '',
								'sex': item.account.gender || '',
								'duty': ''
							}
						},
						extra_params: {},
						title: item.account.title || ''
					}
				})

			this.setState({ dataSource: data_person, tempData: data_person, loading: false });
		} else {
			this.setState({ loading: true })

			getUsers({}, { "keyword": this.state.value, page: obj.current }).then(items => {
				// if (items.results.length > 0) {
				// 	if (value == items[0].username) {
				let pagination = {
					current: obj.current,
					total: items.count,
				};
				this.setState({ tempData: this.searchDatas(items.results), pagination: pagination, btn: true, loading: false })
				// 	}
				// }
			})
		}

	}
	async componentDidMount() {
		this.setState({ loading: true })
		const { platform: { roles = [] }, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;
		console.log("tags",tags)
		console.log("this.props",this.props)
		const { actions: { getPersonInfo } } = this.props;
		// 分页获取数据
		// let rst = await getPersonList({ pagesize: 10, offset: 0 });
		let rst = await getPersonInfo({}, { is_black: 1 ,page:1})
		console.log("rst", rst)
		let personlist = rst.results
		this.setState({ resultInfo: rst })
		// let total = rst.result.total;
		let persons = [];
		for (let i = 0; i < personlist.length; i++) {
			const element = personlist[i];
			persons.push(element)
		}

		let pagination = {
			current: 1,
			total: rst.count,
		};
		this.setState({
			pagination: pagination
		})
		let type = [];
		let element = ''
		let data_person =
			persons.map((item, index) => {
				let groupsId = []
				const groups = item.groups || []
				for (let j = 0; j < groups.length; j++) {
					const groupss = groups[j].id.toString()
					groupsId.push(groupss);
				}
				return {
					index: index + 1,
					id: item.id,
					username: item.username || '',
					email: item.email || '',
					account: {
						person_name: item.account.person_name,
						person_type: "C_PER",
						person_avatar_url: item.account.person_avatar_url,
						organization: {
							// pk: node.pk,
							code: item.account.org_code,
							obj_type: "C_ORG",
							rel_type: "member",
							name: item.account.organization
						},
					},
					tags: item.account.tags,
					sections: item.account.sections,
					groups: item.groups,
					black_remark: item.account.black_remark,
					is_active: item.is_active,
					id_num: item.account.id_num,
					is_black: item.account.is_black,
					id_image: item.account.id_image,
					basic_params: {
						info: {
							'电话': item.account.person_telephone || '',
							'性别': item.account.gender || '',
							'title': item.account.title || '',
							'phone': item.account.person_telephone || '',
							'sex': item.account.gender || '',
							'duty': ''
						}
					},
					extra_params: {},
					title: item.account.title || ''

					// code: item.account.person_code || '',
					// name: item.account.person_name || '',
					// orgcode: item.account.org_code || '',
					// orgname: item.account.organization || '',
					// job: item.account.title || '',
					// sex: item.account.gender || '',
					// tel: item.account.person_telephone || '',

					// is_user: true,

					// sections: item.account.sections || '',
					// tags: item.account.tags || '',
					// groups: groupsId || []
				}
			})
		this.setState({ dataSource: data_person, tempData: data_person, loading: false });
	}


	searchDatas(itema) {
		let data_person =
			itema.map((item, index) => {
				let groupsId = []
				const groups = item.groups || []
				for (let j = 0; j < groups.length; j++) {
					const groupss = groups[j].id.toString()
					groupsId.push(groupss);
				}
				return {
					index: index + 1,
					id: item.id,
					username: item.username || '',
					email: item.email || '',
					account: {
						person_name: item.account.person_name,
						person_type: "C_PER",
						person_avatar_url: item.account.person_avatar_url,
						organization: {
							// pk: node.pk,
							code: item.account.org_code,
							obj_type: "C_ORG",
							rel_type: "member",
							name: item.account.organization
						},
					},
					tags: item.account.tags,
					sections: item.account.sections,
					groups: item.groups,
					black_remark: item.account.black_remark,
					is_active: item.is_active,
					id_num: item.account.id_num,
					is_black: item.account.is_black,
					id_image: item.account.id_image,
					basic_params: {
						info: {
							'电话': item.account.person_telephone || '',
							'性别': item.account.gender || '',
							'title': item.account.title || '',
							'phone': item.account.person_telephone || '',
							'sex': item.account.gender || '',
							'duty': ''
						}
					},
					extra_params: {},
					title: item.account.title || ''
				}
			})
		return data_person
	}
	searchPerson(value) {
		const {
			actions: { getUsers },
		} = this.props;
		this.setState({ loading: true })
		if (value) {
			getUsers({}, {is_black: 1 , "keyword": value, page: 1 }).then(items => {
				let pagination = {
					current: 1,
					total: items.count,
				};
				this.setState({ tempData: this.searchDatas(items.results), pagination: pagination, btn: true, value: value, loading: false })
			})
		} else {
			getUsers({}, {is_black: 1 , page: this.state.pages || 1 }).then(items => {
				let pagination = {
					current: this.state.pages || 1,
					total: items.count,
				};
				this.setState({ tempData: this.searchDatas(items.results), pagination: pagination, btn: false, loading: false })
			})

		}
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
		},
		onSelect: (record, selected, selectedRows) => {
			this.setState({
				selectData: selectedRows,
				excelData: selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			this.setState({
				selectData: selectedRows,
				excelData: selectedRows
			})
		},
	};

	//删除
	delete(index) {
		let { dataSource } = this.state;
		dataSource.splice(index, 1);
		let dataSources = [];
		dataSource.map((item, key) => {
			console.log(item)
			dataSources.push({
				key: key + 1,
				person_code: item.code,
				person_name: item.name,
				organization: item.org,
				org_code: item.depart,
				job: item.jop,
				sex: item.sex,
				person_telephone: item.tel,
				email: item.email,
			})
		})
		this.setState({ dataSource: dataSources });
	}

	paginationOnChange(e) {
		// console.log('vip-分页', e);
	}
	async confirm(record) {
		const {
			sidebar: { node } = {},
			actions: { deleteUser, getOrgName }
		} = this.props;
		const { actions: { reverseFind, is_fresh, deletePerson, putUser } } = this.props;
		console.log("record", record)
		let rst = await getOrgName({ code: record.account.organization.code })
		console.log("rst", rst)
	
		let groupd = []
		record.groups.map(ess => {
			groupd.push(ess.id)
		})
		putUser({}, {
			id: record.id,
			username: record.username,
			email: record.email,
			// password: addition.password, // 密码不能变？信息中没有密码
			account: {
				person_name: record.account.person_name,
				person_type: "C_PER",
				person_avatar_url: record.account.person_avatar_url,
				organization: {
					pk: rst.pk,
					code: record.account.organization.code,
					obj_type: "C_ORG",
					rel_type: "member",
					name: record.account.organization.name
				},
			},
			tags: record.tags,
			sections: record.sections,
			//groups: [7],
			groups: groupd,
			black_remark: record.black_remark,
			is_active: true,
			id_num: record.id_num,
			is_black: 0,
			// id_image: [],
			id_image: record.id_image,
			basic_params: {
				info: {
					'电话': record.basic_params.info.phone || '',
					'性别': record.basic_params.info.sex || '',
					'技术职称': record.basic_params.info.title || '',
					'phone': record.basic_params.info.phone || '',
					'sex': record.basic_params.info.sex || '',
					'duty': ''
				}
			},
			extra_params: {},
			title: record.basic_params.info.title || ''
		}).then(rst => {
			if (rst.code == 1) {
				console.log("rst", rst)
				// console.log("333333333", JSON.parse(rst.msg))
			
				if(this.state.pagination.current>1&&this.state.tempData.length==1){
				const strs1=this.state.fristPagination.total.toString()
				const strs2=strs1.slice(0 , strs1.length-1)

					this.state.fristPagination.total=strs2*10
					this.setState({ tempData: this.state.fristTempData,
						pagination:this.state.fristPagination
					})
				}else{
					let tempDatas = []
					this.state.tempData.map(item => {
						const msg=JSON.parse(rst.msg).id
						if (item.id != msg) {
							tempDatas.push(item)
						}
					})
					this.setState({
						tempData:tempDatas
					})
				}
			}
		})

		if (record.is_user) {
			// 当前是用户
			// let rst = await reverseFind({ pk: record.personPk })
			// deleteUser({ userID: record.id }).then(async (re) => {

			// 	if (re.code == '1') {
			// 		Notification.success({
			// 			message: "删除成功"
			// 		})
			// 		let tempDatas=[]
			// 		this.state.tempData.map(item=>{
			// 			if(item.id!=record.id){
			// 				tempDatas.push(item)
			// 			}
			// 		})
			// 		this.setState({tempData:tempDatas})				
			// 		is_fresh(true);
			// 	}

			// })
		} else {
			// 当前是人员
			// deletePerson({ code: record.code }).then(rst => {
			// 	if (rst === "") {
			// 		Notification.success({
			// 			message: "删除成功"
			// 		})
			// 		is_fresh(true);
			// 	}
			// })
		}
	}

	// paginationInfo = {
	// 	onChange: this.paginationOnChange,
	// 	showSizeChanger: true,
	// 	pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
	// 	showQuickJumper: true,
	// }


}