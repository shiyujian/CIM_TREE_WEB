import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import { UPLOAD_API, SERVICE_API, FILE_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TableOrg extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: [],
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
			debugger
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
		debugger
		data.map((item, i) => {
			getDocument({ code: item.code }).then(single => {
				console.log('vip-single', single);
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
				this.setState({ dataSource });
				console.log('vip-dataSource', dataSource);
			})
		})
	}
	render() {
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			onSelect: (record, selected, selectedRows) => {
				console.log(record, selected, selectedRows);
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
				console.log(selected, selectedRows, changeRows);
			},
		};
		return (
			<div>
				<div>
					{/* <Button style={{ marginRight: "10px" }}>模板下载</Button> */}
					<Button className={style.button} onClick={this.send.bind(this)}>发送填报</Button>
					<Button className={style.button}>申请变更</Button>
					<Button className={style.button}>申请删除</Button>
					<Button className={style.button}>导出表格</Button>
					<Search className={style.button} style={{ width: "200px" }} placeholder="输入搜索条件" />
				</div>
				<Table
					columns={this.columns}
					bordered={true}
					// rowSelection={this.rowSelection}
					rowKey="code"
					dataSource={this.state.dataSource}
				>
				</Table>
			</div>
		)
	}
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}

	//预览
	handlePreview(codeId, i) {
		// debugger;
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

	columns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: '5%',
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
							{/* :{record.filename} */}
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
		// {
		// 	title: '操作',
		// 	render: (text, record, index) => {
		// 		return (
		// 			<Popconfirm
		// 				placement="leftTop"
		// 				title="确定删除吗？"
		// 				onConfirm={this.delete.bind(this, index)}
		// 				okText="确认"
		// 				cancelText="取消">
		// 				<a>删除</a>
		// 			</Popconfirm>
		// 		)
		// 	}
		// }
	];
}