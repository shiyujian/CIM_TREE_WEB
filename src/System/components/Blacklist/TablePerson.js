import React, { Component } from 'react';
import { Row, Col, Table, Button, Popconfirm, Notification, Input, Icon, Spin, Progress, Switch, Pagination, Select, Form } from 'antd';
import style from './TableOrg.css'
import DelPer from './PersonExpurgate';
import { DataReportTemplate_PersonInformation, NODE_FILE_EXCHANGE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import { flattenDeep } from 'lodash';
import { PROJECT_UNITS } from './../../../_platform/api';
const Search = Input.Search;
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
class TablePerson extends Component {

	// export default class TablePerson extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			selectData: [],
			tempData: [],
			tempDatas: [],
			fristTempData: [],

			loading: false,
			percent: 0,
			pagination: {},
			fristPagination: {},
			pages: '',
			resultInfo: {},
			serialNumber: {},
			btn: false,
			value: '',
			isUpdate:false
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
				if (record.sections) {
					for (let z = 0; z < record.sections.length; z++) {
						const items = record.sections[z];
						if (items == element.code) {
							sectione.push(element.value)
						}
					}
				}
			}
		}
		return sectione
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
	renderContent(record) {
		const { platform: { roles = [] } } = this.props;
		let groups = []
		for (let i = 0; i < roles.length; i++) {
			if (record.groups) {
				for (let j = 0; j < record.groups.length; j++) {
					if (roles[i].id == record.groups[j].id) {
						groups.push(roles[i].name)
					}
				}
			}
		}
		return groups
	}
	querys() {
		let searchList = []
		this.props.form.validateFields(async (err, values) => {
			this.state.tempData.map((item) => {
				let isName = false;
				let isTitle = false;
				let iscc = false;
				if (!values.names) {
					isName = true
				}
				else {
					if (item.account) {
						if (values.names && item.account.person_name.indexOf(values.names) > -1) {
							isName = true
						}
					}

				}
				if (!values.is_num) {
					iscc = true
				}
				else {
					if (item.id_num) {
						if (values.is_num && item.id_num.indexOf(values.is_num) > -1) {
							iscc = true
						}
					}

				}
				if (!values.usernamet) {
					isTitle = true
				} else {
					if (values.usernamet && item.username.indexOf(values.usernamet) > -1) {
						isTitle = true
					}
				}
				if (isName && isTitle && iscc) {
					searchList.push(item)
				}
			})
			this.setState({
				tempDatas: searchList,
				isUpdate: true,
			})
		})
	}
	clears() {
		this.props.form.setFieldsValue({
			usernamet: undefined,
			is_num: undefined,
			names: undefined,
		});
	}
	render() {
		const { platform: { roles = [], users = [] }, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;
		const {
			form: { getFieldDecorator },
		} = this.props;
		let usersArr = []
		let numArr = []
		let dataSourceb
		if (this.state.isUpdate) {
			dataSourceb = this.state.tempDatas
		} else {
			dataSourceb = this.state.tempData
		}
		dataSourceb.map((rst, index) => {
			numArr.push(rst.id_num)
			rst.index = index.toString() + 'd'
			rst.key = index.toString() + 'd'
			return { ...rst }
		})
		const numArr1 = Array.from(new Set(numArr))
		numArr1.map((rst, index) => {
			usersArr.push({
				children: [],
				id_num: rst,
				key: (index + 1).toString()
			})
		})
		usersArr.map((ess, i) => {
			this.state.tempData.map((item, j) => {
				if (ess.id_num == item.id_num) {
					ess.children.push(item)
				}
			})
		})
	
		const columns = [
			{
				title: '序号',
				// dataIndex: 'index',
				width: '5%',
				render: (text, record, index) => {
					if (record.id) {
						const current = this.state.serialNumber.current
						const pageSize = this.state.serialNumber.pageSize
						if (current != undefined && pageSize != undefined) {
							return (index + 1) + (current - 1) * pageSize;
						} else {
							return index + 1
						}
					}
				}

			},
			{
				title: '姓名',
				dataIndex: 'account.person_name',
				width: '5%',
				key: 'account.person_name',
			}, {
				title: '身份证号',
				dataIndex: 'id_num',
				width: '8%',
				key: 'id_num',
			}, {
				title: '原因',
				width: '9%',
				dataIndex: "black_remark",
				key: 'black_remark',
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

			}
			, {
				title: '手机号码',
				dataIndex: 'basic_params.info.phone',
				width: '10%',
				key: 'basic_params.info.phone'
			}
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
					if (record.title) {
						let defaultNurse = this.query(record)
						return defaultNurse.join()
					}
				}
			}
			, {
				title: '角色',
				width: '8%',
				render: (record) => {
					let groups = this.renderContent(record)
					return groups.join()
				}
			}
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
			, {
				title: "移除黑名单",
				// dataIndex: "edit",
				key: "Edit",
				render: (record) => {
					if (record.id) {
						return (
							<div>
								<a onClick={this.edits.bind(this, record)}>查看</a>
								<span style={{ "margin": "0 10px 0 10px" }}>|</span>
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
			}
		]
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};

		return (
			<div>
				{/* <div>
					<Search enterButton className={style.button} onSearch={this.searchPerson.bind(this)} style={{ width: "240px" }} placeholder="请输入姓名或用户名" />
				</div> */}
				<Row >
					<Col span={18}>
						<Row>
							<Col span={8} >
								<FormItem {...formItemLayout} label="姓名">
									{
										getFieldDecorator('names', {
											rules: [
												{ required: false, message: '请输入姓名' },
											]
										})
											(<Input placeholder="请输入姓名" />)
									}
								</FormItem>
							</Col>
							<Col span={8} >
								<FormItem {...formItemLayout} label="身份证号">
									{
										getFieldDecorator('is_num', {
										})
											(<Input placeholder="请输入身份证号" />)
									}
								</FormItem>
							</Col>
							<Col span={8} >
								<FormItem {...formItemLayout} label="用户名">
									{
										getFieldDecorator('usernamet', {
											rules: [
												{ required: false, message: '请输入用户名' },
											]
										})
											(<Input placeholder="请输入用户名" />)
									}
								</FormItem>
							</Col>
						</Row>
						<Row>
						</Row>
					</Col>
					<Col span={2} offset={1}>
						<Button icon='search' onClick={this.querys.bind(this)}>查找</Button>
					</Col>
					<Col span={2} >
						<Button icon='reload' onClick={this.clears.bind(this)}>清空</Button>
					</Col>
				</Row>
				<Table
					columns={columns}
					bordered
					// rowSelection={this.rowSelection}
					dataSource={usersArr}
					// dataSource={this.state.tempData}
					// rowKey="index"
					// onChange={this.changePage.bind(this)}
					// pagination={this.state.pagination}
					loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status="active" strokeWidth={5} />, spinning: this.state.loading }}
				>
				</Table>
			</div>
		)
	}
	edits(record) {
		const { actions: { ModifyVisible, getAllUsers, setModifyPer } } = this.props;
		ModifyVisible(true);
		setModifyPer(record);
	}
	async changePage(obj) {
		const {
			actions: { getUsers },
		} = this.props;
		this.setState({
			fristTempData: this.state.tempData,
			fristPagination: this.state.pagination
		})
		if (!this.state.btn) {
			this.setState({ loading: true, pages: obj.current })
			const { actions: { getPersonInfo } } = this.props;
			// 分页获取数据
			let pageSize = 10;
			// let rst = await getPersonList({ pagesize: pageSize, offset: (obj.current - 1) * pageSize });
			let rst = await getPersonInfo({ is_black: 1, page: obj.current })
			let personlist = rst.results
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
							person_signature_url: item.account.person_signature_url,
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
		const { actions: { getPersonInfo } } = this.props;
		// 分页获取数据
		// let rst = await getPersonList({ pagesize: 10, offset: 0 });
		let rst = await getPersonInfo({}, { is_black: 1 })
		let personlist = rst
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
						person_signature_url: item.account.person_signature_url,
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
						person_signature_url: item.account.person_signature_url,
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
			getUsers({}, { is_black: 1, "keyword": value, page: 1 }).then(items => {
				let pagination = {
					current: 1,
					total: items.count,
				};
				this.setState({ tempData: this.searchDatas(items.results), pagination: pagination, btn: true, value: value, loading: false })
			})
		} else {
			getUsers({}, { is_black: 1, page: this.state.pages || 1 }).then(items => {
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
	async confirm(record) {
		const {
			sidebar: { node } = {},
			actions: { getOrgName, putUser, putUserBlackList }
		} = this.props;
		console.log("record", record)
		let rst = await getOrgName({ code: record.account.organization.code })
		console.log("rst", rst)
		let groupd = []
		record.groups.map(ess => {
			groupd.push(ess.id)
		})
		this.setState({ loading: true })
		putUserBlackList({ userID: record.id }, {
			is_black: 0,
			change_all: false,
			black_remark: '',
		}).then(rst => {
			console.log("rst111111111111", rst)
			let tempDatas = []
			this.state.tempData.map(item => {
				if(rst.account.is_black==1){
					message.warn('移除失败');
					tempDatas=this.state.tempData
				}
				if(rst.account.is_black==0){
					// message.warn('请求失败');
					if (item.id != rst.id) {
						tempDatas.push(item)
					}
				}
			})
			this.setState({
				tempData: tempDatas,
				loading: false 
			})
			this.querys()
		})
	}
}
export default Form.create()(TablePerson)
