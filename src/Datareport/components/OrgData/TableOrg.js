import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TableOrg extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource: []
		}
	}
	render() {
		return (
			<div>
				<div>
					<Button style={{ marginRight: "10px" }}>模板下载</Button>
					<Button className={style.button} onClick={this.send.bind(this)}>发送填报</Button>
					<Button className={style.button} onClick={this.sendCJ.bind(this)}>发送参建单位</Button>
					<Button className={style.button}>申请变更</Button>
					<Button className={style.button}>申请删除</Button>
					<Button className={style.button}>导出表格</Button>
					<Search className={style.button} style={{ width: "200px" }} placeholder="输入搜索条件" />
				</div>
				<Table
					columns={this.columns}
					bordered={true}
					rowSelection={this.rowSelection}
					dataSource={this.state.dataSource}
					rowKey = "code"
				>
				</Table>
			</div>
		)
	}
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}
	sendCJ() {
		const { actions: { ModalVisibleCJ } } = this.props;
		ModalVisibleCJ(true);
	}
	async componentDidMount() {
		let dataSource = [];
		const { actions: { getOrgTree } } = this.props;
		await getOrgTree().then(rst => {
			if (rst && rst.children) {
				rst.children.map((item, index) => {
					dataSource.push(...item.children);
				})
			}
		})
		console.log("dataSource:",dataSource);
		this.setState({dataSource})
	}
	rowSelection = {
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
	
	columns = [{

	},
	{
		title: '序号',
		dataIndex: 'index',
		key: 'Index',
	}, {
		title: '组织机构编码',
		dataIndex: 'code',
		key: 'Code',
	}, {
		title: '组织机构类型',
		dataIndex: 'extra_params.org_type',
		key: 'Type',
	}, {
		title: '参建单位名称',
        dataIndex: 'extra_params.canjian',
        key: 'Canjian',
	}, {
		title: '组织机构部门',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '直属部门',
		dataIndex: 'extra_params.direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目名称',
		dataIndex: 'extra_params.project',
		key: 'Project',
	},{
		title: '负责单位工程名称',
		dataIndex: 'extra_params.unit',
		key: 'Unit'
	},{
		title: '备注',
		dataIndex: 'extra_params.remarks',
		key: 'Remarks'
	}]
}