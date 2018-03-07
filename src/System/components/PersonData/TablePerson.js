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
			loading: false,
			percent: 0,
			pagination: {}
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
				let groups=[]
				for (let i = 0; i < roles.length; i++) {
					for (let j = 0; j < record.groups.length; j++) {
						if(roles[i].id==record.groups[j]){
							groups.push(roles[i].name)
						}
					}	
				}
				return groups
			}
	
	render() {
		const { platform: { roles = [],users = []}, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;

		const columns = [
			{
				title: '序号',
				dataIndex: 'index',
				render: (text, record, index) => {
					return index + 1;
				}
			},

			// {
			// 	title: '人员编码',
			// 	dataIndex: 'code',
			// 	key: 'Code',
			// },
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			}
			//  , {
			// 	title: '所在组织机构单位',
			// 	dataIndex: 'type',
			// 	key: 'Org',
			// }
			, {
				title: '所属部门',
				dataIndex: 'orgname',
				key: 'Depart',
			}, {
				title: '职务',
				dataIndex: 'job',
				key: 'Job',
			}, {
				title: '性别',
				dataIndex: 'sex',
				key: 'Sex'
			}, {
				title: '手机号码',
				dataIndex: 'tel',
				key: 'Tel'
			}, {
				title: '邮箱',
				dataIndex: 'email',
				key: 'email'
			}, {
				title: '用户名',
				dataIndex: 'username',
				key: 'username'
			}
			// , {
			// 	title: '密码',
			// 	dataIndex: 'passwords',
			// 	key: 'Passwords'
			// }
			, {
				title: '二维码',
				render: (record) => {
					if (record.signature) {
						if (record.signature.indexOf("documents") !== -1) {
							return <img style={{ width: 60 }} src={record.signature} />
						} else {
							return <span>暂无</span>
						}
					} else {
						return (<span>暂无</span>)
					}
				}
			}
			, {
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
			, {
				title: '角色',
				render: (record) => {
					let groups = this.renderContent(record)
					return groups.join()
				}
			}
			, {
				title: "操作",
				// dataIndex: "edit",
				key: "Edit",
				render: (record) => {
					return (
						<div>
							<a onClick={this.edits.bind(this, record)}><Icon type="edit"></Icon></a>
							<span style={{ "margin": "0 10px 0 10px" }}>|</span>
							<span>
								<Popconfirm title="确定要删除吗？" onConfirm={this.confirm.bind(this, record)} okText="Yes" cancelText="No">
									<a type="primary" ><Icon type="delete"></Icon></a>
								</Popconfirm>
							</span>
						</div>
					)
				}
			}]
		return (
			<div>
				<div>
					{/*<Button style={{marginRight:"10px"}} onClick={this.createLink.bind(this,'muban',`${DataReportTemplate_PersonInformation}`)} type="default">模板下载</Button>*/}
					<Button style={{ marginRight: "10px" }} onClick={this.send.bind(this)}>发送填报</Button>
					{/* <Button className = {style.button} onClick = {this.modify.bind(this)}>申请变更</Button>
                    <Button className = {style.button} onClick = {this.expurgate.bind(this)}>申请删除</Button> */}
					<Button className={style.button} onClick={this.getExcel.bind(this)}>导出表格</Button>
					<Search enterButton className={style.button} onSearch={this.searchPerson.bind(this)} style={{ width: "240px" }} placeholder="请输入人员编码或姓名或组织机构单位" />
				</div>
				<Table
					columns={columns}
					bordered={true}
					rowSelection={this.rowSelection}
					dataSource={this.state.tempData}
					rowKey="index"
					// onChange={this.changePage.bind(this)}
					// pagination={this.state.pagination}
					loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status="active" strokeWidth={5} />, spinning: this.state.loading }}
				>
				</Table>

			</div>
		)
	}
	async componentWillReceiveProps(props) {
		const { tempData, is_fresh = false } = props
		// console.log("tempData",tempData)
		if (is_fresh) {
			this.setState({ loading: true })
			const { actions: { getOrgList, getAllUsers, getOrgDetail, getPeople, getPersonList, getOrgReverse, is_fresh } } = this.props;
			// 分页获取数据
			let rst = await getPersonList({ pagesize: 10, offset: 0 });
			let personlist = rst
			// console.log("rst", rst)
			// let total = rst.result.total;
			let persons = [];
			for (let i = 0; i < personlist.length; i++) {
				const element = personlist[i];
				// let ret = await getPeople({code:element.code});
				persons.push(element)
			}
			let pagination = {
				current: 1,
				// total:total,
			};
			console.log("pagination", pagination)
			// console.log("pagination", pagination)
			this.setState({
				pagination: pagination
			})
			// let type = [];
			// for (let i = 0; i < persons.length; i++) {
			// 	let ret = await getOrgReverse({code:persons[i].organisation.code})
			// 	type.push(ret.children[0].name)
			// }
			// console.log("persons",persons)
			let data_person =
				persons.map((item, index) => {
					let groupsId = []
					const groups = item.groups || []
					for (let j = 0; j < groups.length; j++) {
						const groupss = groups[j].id.toString()
						groupsId.push(groupss);
					}
					return {
						id: item.id,
						index: index + 1,
						// code: item.account.person_code || '',
						name: item.account.person_name || '',
						orgcode: item.account.orgcode || '',
						orgname: item.account.organization || '',
						job: item.account.title || '',
						sex: item.account.gender || '',
						tel: item.account.person_telephone || '',
						email: item.email || '',
						is_user: true,
						username: item.username || '',
						sections: item.account.sections || '',
						tags: item.account.tags || '',
						groups: groupsId || []
						// passwords:111111
					}
				})
			this.setState({ dataSource: data_person, tempData: data_person, loading: false });
			is_fresh(false);
		}
	}
	//发送
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}
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
	// 导出excel表格
	getExcel() {
		if (this.state.excelData !== undefined) {
			let exhead = ['人员编码', '姓名', '所在组织机构单位', '所属部门', '职务', '性别', '手机号码', '邮箱'];
			let rows = [exhead];
			let getcoordinate = (param) => {
				if (typeof param !== 'string') {
					return '';
				}
				if ((!param || param.length <= 0)) {
					return ''
				} else {
					return param;
				}
			}
			let excontent = this.state.excelData.map(data => {
				console.log("data",data)
				return [
					data.orgcode || '',
					data.name || '',
					data.orgname || '',
					// data.account.org_code || '',
					// data.account.user_name || '',
					data.job || '',
					data.sex || '',
					data.tel || '',
					data.email || '',
					data.username || '',
					data.sections || '',
					data.tags || '',
					data.edit || '',
					data.groups || '',
				];
			});
			rows = rows.concat(excontent);
			const { actions: { jsonToExcel } } = this.props;
			jsonToExcel({}, { rows: rows })
				.then(rst => {
					this.createLink('人员信息导出表', NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename);
				})
		} else {
			Notification.warning({
				message: "请先选择数据！"
			});
			return;
		}
	}

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
		// if(arr.children && arr.children.length) {
		// 	return arr.map()
		// }
	}
	async changePage(obj) {
		console.log("obj", obj)
		this.setState({ loading: true })
		const { actions: { getOrgList, getAllUsers, getOrgDetail, getPeople, getPersonList, getOrgReverse } } = this.props;
		// 分页获取数据
		let pageSize = 10;
		let rst = await getPersonList({ pagesize: pageSize, offset: (obj.current - 1) * pageSize });
		let personlist = rst
		console.log("rst", rst)
		// let total = rst.result.total;
		// console.log("total",total)
		let persons = [];
		for (let i = 0; i < personlist.length; i++) {
			const element = personlist[i];
			// let ret = await getPeople({code:element.code});
			persons.push(element)
		}
		let pagination = {
			current: obj.current,
			// total:total,
		};


		this.setState({
			pagination: pagination
		})
		// let type = [];
		// for (let i = 0; i < persons.length; i++) {
		// 	// console.log("persons:",persons)
		// 	let ret = await getOrgReverse({code:persons[i].organisation.code})
		// 	type.push(ret.children[0].name)
		// }
		let data_person =
			persons.map((item, index) => {
				// console.log(item)
				let groupsId = []
				const groups = item.groups || []
				for (let j = 0; j < groups.length; j++) {
					groupsId.push(groups[j].id);
				}
				return {
					id: item.id,
					index: index + 1,
					// code: item.account.person_code || '',
					name: item.account.person_name || '',
					orgcode: item.account.orgcode || '',
					orgname: item.account.organization || '',
					job: item.account.title || '',
					sex: item.account.gender || '',
					tel: item.account.person_telephone || '',
					email: item.email || '',
					is_user: true,
					username: item.username || '',
					sections: item.account.sections || '',
					tags: item.account.tags || '',
					groups: groupsId || []
					// passwords:111111,
				}
			})

		this.setState({ dataSource: data_person, tempData: data_person, loading: false });
	}
	async componentDidMount() {
		this.setState({ loading: true })
		const { platform: { roles = [] }, addition = {}, actions: { changeAdditionField }, tags = {} } = this.props;
		// console.log("addition",addition)
		const { actions: { getOrgList, getAllUsers, getOrgDetail, getPeople, getPersonList, getOrgReverse } } = this.props;
		// 分页获取数据
		let rst = await getPersonList({ pagesize: 10, offset: 0 });
		let personlist = rst
		// let total = rst.result.total;
		let persons = [];
		for (let i = 0; i < personlist.length; i++) {
			const element = personlist[i];

			// let ret = await getPeople({code:element.code});
			// console.log(ret)

			persons.push(element)
		}

		let pagination = {
			current: 1,
			// total:total,
		};


		this.setState({
			pagination: pagination
		})
		let type = [];
		// for (let i = 0; i < persons.length; i++) {
		// 	console.log(persons[i])
		// 	let ret = await getOrgReverse({code:persons[i].organisation.code})
		// 	console.log("ret",ret)

		// 	type.push(ret.children[0].name)
		// }
		console.log("data_person", data_person)
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
					id: item.id,
					index: index + 1,
					// code: item.account.person_code || '',
					name: item.account.person_name || '',
					orgcode: item.account.orgcode || '',
					orgname: item.account.organization || '',
					job: item.account.title || '',
					sex: item.account.gender || '',
					tel: item.account.person_telephone || '',
					email: item.email || '',
					is_user: true,
					username: item.username || '',
					sections: item.account.sections || '',
					tags: item.account.tags || '',
					groups: groupsId || []
				}
			})
		this.setState({ dataSource: data_person, tempData: data_person, loading: false });
		// let arr = this.state.dataSource;
		// let pageSize = pagination.pageSize;
		// for (let index = (pagination.current - 1) * pageSize; index < pagination.current * pageSize && index < this.state.dataSource.length; index++) {
		// 	if (arr[index].key + 1) {
		// 		arr[index].key = index
		// 		continue;
		// 	}

		// }	
		// let orgList = await getOrgList();
		// // 获取所有的组织机构的code
		// let codesArr = flattenDeep(this.mapCodes(orgList.children));
		// let orgArr = [];
		// for (let i = 0; i < codesArr.length; i++) {
		// 	let ret = await getOrgDetail({code:codesArr[i]})
		// 	orgArr.push(ret);
		// }
		// let personCodes = [];
		// for (let i = 0; i < orgArr.length; i++) {
		// 	if (orgArr[i].members.length !== 0) {
		// 		for (let j = 0; j < orgArr[i].members.length; j++) {
		// 			personCodes.push(orgArr[i].members[j].code)
		// 		}
		// 	}
		// }
		// let newPersonsCodes = [...new Set(personCodes)]
		// let persons = [];
		// for (let i = 0; i < newPersonsCodes.length; i++) {
		// 	newPersonsCodes[i];
		// }
		// for (let i = 0; i < newPersonsCodes.length; i++) {
		// 	let ret = await getPeople({code:newPersonsCodes[i]})
		// 	persons.push(ret);
		// }
	}

	searchPerson(value) {
		let searchData = [];
		let searchPer = this.state.dataSource
		searchPer.forEach(rst => {
			// console.log("rst",rst)
			if (
				// rst.code.indexOf(value) != -1 ||
				// rst.name.indexOf(value) != -1 ||
				rst.orgname.indexOf(value) != -1
			) {
				searchData.push(rst);
			}
		})
		searchData.map((item, index) => {
			item.index = index + 1;
		})
		this.setState({
			tempData: searchData
		})
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
			actions: { deleteUser, getUsers }
		} = this.props;
		const { actions: { deleteUserList, reverseFind, is_fresh, deletePerson } } = this.props;
		if (record.is_user) {
			// 当前是用户
			console.log("record", record)

			let rst = await reverseFind({ pk: record.personPk })
			console.log("rst", rst)
			console.log("deleteUserList", deleteUserList)
			console.log("record", record)
			deleteUser({ userID: record.id }).then(async (re) => {
				console.log("111", re)
				if (re.code == '1') {
					Notification.success({
						message: "删除成功"
					})
					is_fresh(true);
				}
			})
		} else {
			// 当前是人员
			deletePerson({ code: record.code }).then(rst => {
				if (rst === "") {
					Notification.success({
						message: "删除成功"
					})
					is_fresh(true);
				}
			})
		}
	}

	// paginationInfo = {
	// 	onChange: this.paginationOnChange,
	// 	showSizeChanger: true,
	// 	pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
	// 	showQuickJumper: true,
	// }


}