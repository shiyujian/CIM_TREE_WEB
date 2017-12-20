import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TableOrg extends Component {
	render() {
		// const { platform: { org = [] } } = this.props;
		// let dataSource = org.children || [];
		// dataSource.map((item, index) => {
		// 	item.index = index + 1;
		// })
		return (
			<div>
				<div>
					<Button style={{ marginRight: "10px" }}>模板下载</Button>
					<Button className={style.button} onClick={this.send.bind(this)}>发送填报</Button>
					<Button className={style.button}>申请变更</Button>
					<Button className={style.button}>申请删除</Button>
					<Button className={style.button}>导出表格</Button>
					<Search className={style.button} style={{ width: "200px" }} placeholder="输入搜索条件" />
				</div>
				<Table
					columns={this.columns}
					bordered={true}
					rowSelection={this.rowSelection}
					// dataSource={dataSource}
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
	componentDidMount() {
		// let dataSource = [];
		// const { actions: { getOrgTree } } = this.props;
		// getOrgTree({}, { depth: 7 }).then(rst => {
		// 	dataSource = rst.children;
		// });
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
		dataIndex: 'type',
		key: 'Type',
	}, {
		title: '参建单位名称',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '组织机构部门',
		dataIndex: 'depart',
		key: 'depart',
	}, {
		title: '直属部门',
		dataIndex: 'direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目名称',
		dataIndex: 'project',
		key: 'Project',
	},{
		title: '负责单位工程名称',
		dataIndex: 'unit',
		key: 'Unit'
	},{
		title: '备注',
		dataIndex: 'remarks',
		key: 'Remarks'
	}]
}