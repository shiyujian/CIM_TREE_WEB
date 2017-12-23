import React, { Component } from 'react';
import { Row, Col, Table, Form, Button, Popconfirm, message, Input, notification, Modal } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import ChangeFile from './ChangeFile';
import DeleteFile from './DeleteFile';
import style from './TableOrg.css';
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
			newKey1: Math.random(),
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
				this.setState({
					...this.state,
					dataSource: Object.assign(this.state.dataSource, dataSource)
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
				<Modal
					width={1280}
					key={this.state.newKey2}
					visible={this.state.setChangeVisiable}
					onOk={this.setChangeData.bind(this)}
					onCancel={this.goCancel.bind(this)}
					maskClosable={false}
				>
					<ChangeFile props={this.props} state={this.state} />
				</Modal>
				<Modal
					width={1280}
					key={this.state.newKey3}
					visible={this.state.setDeleteVisiable}
					onOk={this.setDeleteData.bind(this)}
					onCancel={this.goCancel.bind(this)}
					maskClosable={false}
				>
					<DeleteFile props={this.props} state={this.state} />
				</Modal>
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

	// 申请变更
	setChangeData() {
		const { changeInfo } = this.props;
		// console.log('vip-变更', changeInfo);
		if (!changeInfo) {
			notification.warning({
				message: '请填写变更原因！',
				duration: 2
			})
			return;
		}
		this.setState({
			setChangeVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});
		notification.success({
			message: '申请成功！',
			duration: 2
		})
		// console.log('vip-this.props', this.props);

		// const { actions: { ChangeRow } } = this.props;
		// ChangeRow('');
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
	setDeleteData() {
		const { deleteInfo } = this.props;
		// console.log('vip-删除', deleteInfo);
		if (!deleteInfo) {
			notification.warning({
				message: '请填写删除原因！',
				duration: 2
			})
			return;
		}
		this.setState({
			setDeleteVisiable: false,
			selectedRowKeys: [],
			subDataSource: [],
		});
		notification.success({
			message: '申请成功！',
			duration: 2
		})
		const { actions: { DeleteRow } } = this.props;
		// DeleteRow('');
	}
	columns = [
		{
			title: '序号',
			dataIndex: 'i',
			width: '5%',
			sorter: (a, b) => a.i - b.i,
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