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
			width: '5%',
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
			width: '10%',
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
			render:(text,record,index) => {
				if(record.file.id){
					return (<span>
							<a onClick={this.handlePreview.bind(this,index)}>预览</a>
							<span className="ant-divider" />
							<Popconfirm
								placement="leftTop"
								title="确定删除吗？"
								onConfirm={this.remove.bind(this, index)}
								okText="确认"
								cancelText="取消">
								<a>删除</a>
							</Popconfirm>
						</span>)
				}else{
					return (
						<span>
						<Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,index)}>
							<Button>
								<Icon type="upload" />上传附件
							</Button>
						</Upload>
					</span>
					)
				}
			}
		},{
			title:'操作',
			render:(text,record,index) => {
				return  (
					<Popconfirm
						placement="leftTop"
						title="确定删除吗？"
						onConfirm={this.delete.bind(this, index)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				)
			}
		}
	];
}