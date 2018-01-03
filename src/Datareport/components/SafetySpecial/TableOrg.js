import React, { Component } from 'react';
import { Progress, Row, Col, Table, Form, Button, Popconfirm, message, Input, notification, Modal } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API, NODE_FILE_EXCHANGE_API } from '_platform/api';
import ChangeFile from './ChangeFile';
import DeleteFile from './DeleteFile';
import { getNextStates } from '_platform/components/Progress/util';
import { getUser } from '_platform/auth';
import { WORKFLOW_CODE } from '_platform/api'
let moment = require('moment');
const Search = Input.Search;
export default class TableOrg extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: [],
			subDataSource: [],
			setEditVisiable: false,
			setChangeVisiable: false,
			setDeleteVisiable: false,
			newKey2: Math.random(),
			newKey3: Math.random(),
			selectedRowKeys: [],
			loading: true,
			percent: 0,
		}
	}
	async componentDidMount() {
		const { actions: {
            getScheduleDir,
			postScheduleDir,
        } } = this.props;
		let topDir = await getScheduleDir({ code: 'the_only_main_code_datareport' });
		if (topDir.obj_type) {
			let dir = await getScheduleDir({ code: 'datareport_safetyspecial_05' });
			if (dir.obj_type) {
				if (dir.stored_documents.length > 0) {
					this.generateTableData(dir.stored_documents);
				}
			}
		}
	}
	async generateTableData(data) {
		const { actions: { getDocument,getDocumentList } } = this.props;
		let dataSource = [];
		let total = data.length
		let codeArray=[];
		data.map((item, i) => {
			this.setState({percent:parseFloat((i*100/total).toFixed(2))});
			codeArray.push(item.code);
		});
		let docArray = await getDocumentList({},{list:codeArray});
		if(docArray.result){
			docArray.result.map((single, i) => {
				let temp = {
					i: i + 1,
					code: single.extra_params.code,
					codeId: single.code,
					filename: single.extra_params.filename,
					index: single.extra_params.index,
					organizationUnit: single.extra_params.organizationUnit,
					project: single.extra_params.project,
					projectName: single.extra_params.project.name,
					remark: single.extra_params.remark,
					resUnit: single.extra_params.resUnit,
					reviewComments: single.extra_params.reviewComments,
					reviewPerson: single.extra_params.reviewPerson,
					reviewTime: single.extra_params.reviewTime,
					scenarioName: single.extra_params.scenarioName,
					unit: single.extra_params.unit,
					unitProject: single.extra_params.unit.name,
					file: single.basic_params.files[0],
					checkout: true,
				}
				dataSource.push(temp);
			});
			// debugger;
			this.setState({
				...this.state,
				dataSource,
				loading: false,
				percent: 100
			});
		}
	}

	paginationOnChange(e) {
		// console.log('vip-分页', e);
	}
	onSelectChange(selectedRowKeys, selectedRows) {
		debugger;
		this.state.subDataSource = selectedRows;
		// console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	}

	// 搜索
	async onSearchInfo(value) {
		if (!value) { this.componentDidMount(); return; };
		value = value.replace(/\s/g, "");
		const { actions: { getSearcherDir } } = this.props
		const code_Todir = "datareport_safetyspecial_05";
		let param1 = code_Todir + "/?doc_code=safetyspecial&keys=organizationUnit&values=" + value; // 编制单位
		let param2 = code_Todir + "/?doc_code=safetyspecial&keys=scenarioName&values=" + value; // 方案名称
		// let param3 = code_Todir + "/?doc_code=safetyspecial&keys=projectName&values=" + value; // 项目/子项目名称
		// let param4 = code_Todir + "/?doc_code=safetyspecial&keys=unitProject&values=" + value; // 单位工程
		let data1 = await getSearcherDir({ keyword: param1 }).then(rst => {
			if (rst.result.length <= 0) return [];
			let dataSource = this.handleData(rst.result)
			return dataSource;
		})
		let data2 = await getSearcherDir({ keyword: param2 }).then(rst => {
			if (rst.result.length <= 0) return [];
			let dataSource = this.handleData(rst.result)
			return dataSource;
		})
		// let data3 = await getSearcherDir({ keyword: param3 }).then(rst => {
		// 	if (rst.result.length <= 0) return [];
		// 	let dataSource = this.handleData(rst.result)
		// 	return dataSource;
		// })
		// let data4 = await getSearcherDir({ keyword: param4 }).then(rst => {
		// 	if (rst.result.length <= 0) return [];
		// 	let dataSource = this.handleData(rst.result)
		// 	return dataSource;
		// })
		this.setState({
			dataSource: Object.assign(data1, data2)
		})
	}
	//将数据处理成适用于表格的数据
	handleData(data) {
		let dataSource = [];
		data.map((single, i) => {
			let temp = {
				i: i + 1,
				code: single.extra_params.code,
				codeId: single.code,
				filename: single.extra_params.filename,
				index: single.extra_params.index,
				organizationUnit: single.extra_params.organizationUnit,
				project: single.extra_params.project,
				projectName: single.extra_params.project.name,
				remark: single.extra_params.remark,
				resUnit: single.extra_params.resUnit,
				reviewComments: single.extra_params.reviewComments,
				reviewPerson: single.extra_params.reviewPerson,
				reviewTime: single.extra_params.reviewTime,
				scenarioName: single.extra_params.scenarioName,
				unit: single.extra_params.unit,
				unitProject: single.extra_params.unit.name,
				file: single.basic_params.files[0],
				checkout: true,
			}
			dataSource.push(temp);
		})
		return dataSource;
	}

	render() {
		const paginationInfo = {
			onChange: this.paginationOnChange.bind(this),
			showSizeChanger: true,
			pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
			showQuickJumper: true,
			// style: { float: "left", marginLeft: 70 },
		}
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange.bind(this),
			getCheckboxProps: record => ({
				disabled: record.name === 'Disabled User',
			}),
		};
		return (
			<Row>
				<Row style={{ marginBottom: "30px" }}>
					<Col>
						<Button
							style={{ marginRight: "30px" }}
							onClick={this.send.bind(this)}
						>发起填报</Button>
						<Button
							style={{ marginRight: "30px" }}
							onClick={this.BtnChange.bind(this)}
						>申请变更</Button>
						<Button
							style={{ marginRight: "30px" }}
							onClick={this.BtnDelete.bind(this)}
						>申请删除</Button>
						<Button
							style={{ marginRight: "30px" }}
							onClick={this.BtnExport.bind(this)}
						>导出表格</Button>
						<Search
							className="searchid"
							placeholder="请输入方案名称或者编制单位全字段"
							onSearch={this.onSearchInfo.bind(this)}
							style={{ width: 300, marginLeft: "20px" }}
						/>
					</Col>
				</Row>
				<Row>
					<Table
						columns={this.columns}
						dataSource={this.state.dataSource}
						bordered
						pagination={paginationInfo}
						rowSelection={rowSelection}
						rowKey={(item, index) => index}
						// loading={this.state.loading}
						loading={{
							tip: <Progress
								style={{ width: 200 }}
								percent={this.state.percent}
								status="active" strokeWidth={5}
							/>
							, spinning: this.state.loading
						}}
					/>
				</Row>
				<Row>
					{
						!this.state.dataSource.length ? <p></p>
							:
							(
								<Col span={3} push={12} style={{ position: 'relative', top: -40, fontSize: 12 }}>
									[共：{this.state.dataSource.length}行]
									</Col>
							)
					}
				</Row>
				{
					this.state.setChangeVisiable && <ChangeFile {...this.props} {...this.state} key={this.state.newKey2}
						goCancel={this.goCancel.bind(this)} setChangeData={this.setChangeData.bind(this)}
					/>
				}
				{
					this.state.setDeleteVisiable && <DeleteFile {...this.props} {...this.state} key={this.state.newKey3}
						goCancel={this.goCancel.bind(this)} setDeleteData={this.setDeleteData.bind(this)}
					/>
				}
			</Row>
		)
	}
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}
	goCancel() {
		this.setState({
			setChangeVisiable: false,
			setDeleteVisiable: false,
		});
	}
	//预览
	handlePreview(codeId, i) {
		let { dataSource } = this.state;
		const { actions: { openPreview } } = this.props;
		let ff = {}, f = {};
		ff = dataSource.filter((item, i) => {
			return item.codeId === codeId;
		});
		f = ff[0].file;
		let filed = {}
		filed.misc = f.misc;
		filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.name = f.name;
		filed.mime_type = f.mime_type;
		openPreview(filed);
	}

	//导出
	BtnExport(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.warning({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		let exhead1 = ['名称', '重大安全专项方案'];
		let exhead2 = ['重大安全专项方案', '序号', '项目/子项目名称', '单位工程', '方案名称', '编制单位', '评审时间', '评审意见', '评审人员', '备注', '附件'];
		let rows = [];
		rows.push(exhead1);
		rows.push(exhead2);
		let excontent = this.state.subDataSource.map(data => {
			let item = [
				'重大安全专项方案',
				data.i,
				data.projectName,
				data.unitProject,
				data.scenarioName,
				data.organizationUnit,
				data.reviewTime,
				data.reviewComments,
				data.reviewPerson,
				data.remark,
				data.filename
			];
			rows.push(item);
		});
		const { actions: { jsonToExcel } } = this.props;
		console.log(rows)
		// debugger;
		jsonToExcel({}, { rows: rows })
			.then(rst => {
				let name = "安全专项导出信息" + moment(new Date()).format('YYYY-MM-DD-h:mm:ss-a') + '.xlsx';
				this.createLink(name, NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename);
			})
	}
	createLink(name, url) {    //导出
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', name);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	//变更
	BtnChange(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.warning({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		this.setState({ newKey2: Math.random() + 2, setChangeVisiable: true });
	}

	// 申请变更--并发起
	setChangeData(data, participants) {
		this.setState({
			newKey2: Math.random() + 2,
			setChangeVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});

		// 发起流程
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = { // 流程创建者
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "安全专项信息批量变更",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "安全专项信息批量变更",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
			// "deadline": "2018-12-30" # 截止日期, 空填None,
		}
		createWorkflow({}, postdata).then(rst => { // 创建流程实例
			let nextStates = getNextStates(rst, rst.current[0].id); //根据当前节点获取流程下一步节点集合
			logWorkflowEvent({ pk: rst.id }, // 
				{
					next_states: [{ // 时间以及下一个节点执行人
						participants: [participants], // 参与的人
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					state: rst.current[0].id,
					executor: creator,
					action: '提交',
					note: '发起安全专项变更',
					attachment: null
				});
		});


	}
	//删除
	BtnDelete(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.warning({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		this.setState({ newKey3: Math.random() + 4, setDeleteVisiable: true });
	}
	// 申请删除--并发起
	setDeleteData(data, participants) {
		// console.log('vip-data', data);
		// console.log('vip-per', participants);
		this.setState({
			newKey3: Math.random() + 2,
			setDeleteVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});
		// 发起流程
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = { // 流程创建者
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "安全专项信息批量删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "安全专项信息批量删除",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
			// "deadline": "2018-12-30" # 截止日期, 空填None,
		}
		createWorkflow({}, postdata).then(rst => { // 创建流程实例
			let nextStates = getNextStates(rst, rst.current[0].id); //根据当前节点获取流程下一步节点集合
			logWorkflowEvent({ pk: rst.id }, // 
				{
					next_states: [{ // 时间以及下一个节点执行人
						participants: [participants], // 参与的人
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					state: rst.current[0].id,
					executor: creator,
					action: '提交',
					note: '发起安全专项删除',
					attachment: null
				});
		});
	}
	columns = [
		{
			title: '序号',
			dataIndex: 'i',
			width: '5%',
		},
		{
			title: '项目/子项目名称',
			dataIndex: 'projectName',
			width: '10%',
		},
		{
			title: '单位工程',
			dataIndex: 'unitProject',
			width: '10%',
		},
		{
			title: '方案名称',
			dataIndex: 'scenarioName',
			width: '10%',
		},
		{
			title: '编制单位',
			dataIndex: 'organizationUnit',
			width: '10%',
		},
		{
			title: '评审时间',
			dataIndex: 'reviewTime',
			width: '10%',
			// render: (text, record, i) => (
			// 	moment(record.reviewTime,"YYYY-MM-DD")
			// ),
		},
		{
			title: '评审意见',
			dataIndex: 'reviewComments',
			width: '10%',
		},
		{
			title: '评审人员',
			dataIndex: 'reviewPerson',
			width: '10%',
		},
		{
			title: '备注',
			dataIndex: 'remark',
			width: '10%',
		}
		,
		{
			title: '附件',
			width: '10%',
			render: (text, record) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, record.codeId, record.i)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
				</span>)
			}
		},
	];
}