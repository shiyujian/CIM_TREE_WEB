import React, {Component} from 'react';
import {Table, Spin} from 'antd';
import moment from 'moment';
export default class GeneralTable extends Component {

	render() {
		const {Doc = []} = this.props;
		return (
			<Table rowSelection={this.rowSelection}
			       dataSource={Doc}
			       columns={this.columns}
			       bordered rowKey="code"/>
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys,selectedRows) => {
			const {actions: {selectDocuments}} = this.props;
			selectDocuments(selectedRows);
		},
	};

	columns=[
		{
			title:'规范名称',
			dataIndex:'name',
			key:'name',
			sorter: (a, b) => a.name.length - b.name.length
		},{
			title:'规范编号',
			dataIndex:'extra_params.number',
			key:'extra_params.number',
			sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		},{
			title:'发布单位',
			dataIndex:'extra_params.company',
			key:'extra_params.company',
			sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		},{
			title:'实施日期',
			dataIndex:'extra_params.time',
			key:'extra_params.time',
			sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		},{
			title:'备注',
			dataIndex:'extra_params.remark',
			key:'extra_params.remark'
		},{
			title:'文档状态',
			dataIndex:'extra_params.state',
			key:'extra_params.state'
		},{
			title:'操作',
			render:(record) =>{
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this,record)}>预览</a>
						<span className="ant-divider" />
						<a onClick={this.update.bind(this,record)}>更新</a>
					</div>
				);
				return nodes;
			}
		}
	];

	previewFile(file) {
		const {actions: {openPreview}} = this.props;
		if(JSON.stringify(file.basic_params) == "{}"){
			return
		}else {
			const filed = file.basic_params.files[0];
			openPreview(filed);
		}
	}

	update(file){
		const {actions:{updatevisible,setoldfile}}= this.props;
		updatevisible(true);
		setoldfile(file);
	}
}