import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TableOrg extends Component {
	render() {
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
	
	columns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: '10%',
		},
		{
			title: '单位工程',
			dataIndex: 'unitProject',
			width: '10%',
		},
		{
			title: '项目/子项目名称',
			dataIndex: 'projectName',
			width: '15%',
		}, {
			title: '方案名称',
			dataIndex: 'scenarioName',
			width: '15%',
		}, {
			title: '编制单位',
			dataIndex: 'organizationUnit',
			width: '10%',
		}, {
			title: '评审时间',
			dataIndex: 'reviewTime',
			width: '10%',
		}, {
			title: '评审意见',
			dataIndex: 'reviewComments',
			width: '10%',

		}, {
			title: '评审人员',
			dataIndex: 'reviewPerson',
			width: '10%',
		}, {
			title: '备注',
			dataIndex: 'remark',
			width: '15%',
		}
		,  {
			title: '附件',
			width: '10%',
			// render: (text, record) => {
			//     return (

			//         <span>
			//             <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this, text, record)}>
			//                 <Button>
			//                     <Icon type="upload" />上传附件
			//                 </Button>
			//             </Upload>
			//         </span>
			//     )
			// }
		},
	];
}