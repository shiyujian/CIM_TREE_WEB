import React, { Component } from 'react';
import { Row, Col, Table, Form, Button, Popconfirm, message, Input, notification, Modal } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import ChangeFile from './ChangeFile';
import DeleteFile from './DeleteFile';
import style from './TableOrg.css';
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
		const { actions: {
            getDocument,
        } } = this.props;
		let dataSource = [];
		data.map((item, i) => {
			getDocument({ code: item.code }).then(single => {
				// console.log('vip-single', single);
				let temp = {
					i,
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
				}
				dataSource.push(temp);
				// this.setState({
				// 	...this.state,
				// 	dataSource: Object.assign(this.state.dataSource, dataSource)
				// });
				this.setState({
					...this.state,
					dataSource
				});
			})
		})
	}
	paginationOnChange(e) {
		// console.log('vip-分页', e);
	}
	onSelectChange(selectedRowKeys, selectedRows) {
		// debugger;
		this.state.subDataSource = selectedRows;
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	}

	// 搜索
	onSearchInfo(value) {
		const { actions: { getSearcherDir } } = this.props
		let param = "?keyword=" + value
		getSearcherDir({ code: 'safetyspecial' }).then(rst => {
			console.log('vip-rst', rst);

			// let dataSource = this.handleData(rst)
			// this.setState({dataSource})
		})
	}
	//将数据处理成适用于表格的数据
	handleData(data) {
		return data.map(item => {
			return {
				permitNumber: item.licence.number,
				certificateNumber: item.certificate.number,
				acceptance: item.acceptor.name,
				...item
			}
		})
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
					<Col span={15}>
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
						// onClick={this.BtnExport.bind(this)}
						>导出表格</Button>
						<Search
							placeholder="请输入内容"
							onSearch={this.onSearchInfo.bind(this)}
							style={{ width: 200, marginLeft: "20px" }}
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
		const { actions: { openPreview } } = this.props;
		let f = this.state.dataSource[i].file
		let filed = {}
		filed.misc = f.misc;
		filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.name = f.name;
		filed.mime_type = f.mime_type;
		openPreview(filed);
	}

	//变更
	BtnChange(e) {
		if (this.state.subDataSource.length <= 0) {
			notification.error({
				message: '请选择数据！',
				duration: 2
			})
			return;
		}
		this.setState({ newKey2: Math.random() + 2, setChangeVisiable: true });
	}

	// 申请变更--并发起
	setChangeData(data, participants) {
		// console.log('vip-data', data);
		// console.log('vip-per', participants);
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
			notification.error({
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
			// dataIndex: 'index',
			width: '5%',
			render: (text, record, index) => {
				return index + 1
			},
		},
		{
			title: '项目/子项目名称',
			dataIndex: 'projectName',
			width: '15%',
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
			width: '15%',
		}
		,
		{
			title: '附件',
			width: '10%',
			render: (text, record) => {
				if (record.filename) {
					return (
						<a
							onClick={this.handlePreview.bind(this, record.codeId, record.i)}>
							预览
						</a>
					)
				} else {
					return (
						<span>
							暂无
						</span>
					)
				}
			}
		},
	];
}