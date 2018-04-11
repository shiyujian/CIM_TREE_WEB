import React, { Component } from 'react';
import { Table, Spin, message } from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {

	render() {
		const { 
			Doc = [],
			selectDoc,
			parent 
		} = this.props;
		let canSection = false
		if(selectDoc === '综合管理性文件' || parent === '综合管理性文件'){
			canSection = true
		}

		return (
			<Table rowSelection={this.rowSelection}
				dataSource={Doc}
				columns={canSection?this.columns1:this.columns}
				className='foresttables'
				bordered rowKey="code" />
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRows);
		},
	};

	columns = [
		{
			title: '项目',
			dataIndex: 'extra_params.area',
			key: 'extra_params.area',
		}, {
			title: '标段',
			dataIndex: 'extra_params.unitProject',
			key: 'extra_params.unitProject',
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'extra_params.name',
		},{
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
		},{
			title: '文档类型',
			dataIndex: 'extra_params.doc_type',
			key: 'extra_params.doc_type',
		}
		// ,{
		// 	title: '提交单位',
		// 	dataIndex: 'extra_params.unit',
		// 	key: 'unit',
		// }
		,{
			title: '提交人',
			dataIndex: 'extra_params.people',
			key: 'extra_params.people',
			render: (text, record, index)=>{
				if(record && record.extra_params && record.extra_params.username){
					return <span>{`${record.extra_params.people}(${record.extra_params.username})`}</span>
				}else{
					return <span>{text}</span>
				}
				
			}
		},{
			title: '提交时间',
			dataIndex: 'extra_params.time',
			key: 'extra_params.time',
		},{
			title: '操作',
			render: (record, index) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>预览</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>更新</a>
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, record)}>下载</a>
					</div>
				);
				return nodes;
			}
		}
	];

	columns1 = [
		{
			title: '项目',
			dataIndex: 'extra_params.area',
			key: 'extra_params.area',
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'extra_params.name',
		},{
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
		},{
			title: '文档类型',
			dataIndex: 'extra_params.doc_type',
			key: 'extra_params.doc_type',
		}
		// ,{
		// 	title: '提交单位',
		// 	dataIndex: 'extra_params.unit',
		// 	key: 'unit',
		// }
		,{
			title: '提交人',
			dataIndex: 'extra_params.people',
			key: 'extra_params.people',
			render: (text, record, index)=>{
				if(record && record.extra_params && record.extra_params.username){
					return <span>{`${record.extra_params.people}(${record.extra_params.username})`}</span>
				}else{
					return <span>{text}</span>
				}
				
			}
		},{
			title: '提交时间',
			dataIndex: 'extra_params.time',
			key: 'extra_params.time',
		},{
			title: '操作',
			render: (record, index) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>预览</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>更新</a>
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, record)}>下载</a>
					</div>
				);
				return nodes;
			}
		}
	];

	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	download(record) {
		let array = record.basic_params.files;
		array.map(down => {
			// debugger
			let down_load = STATIC_DOWNLOAD_API + down.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');;
			this.createLink(this, down_load);
		});
	}

	previewFile(file) {
		const { actions: { openPreview } } = this.props;
		if (JSON.stringify(file.basic_params) == "{}") {
			return
		} else { 
			const filed = file.basic_params.files[0];
			openPreview(filed);
		}
	}

	update(file) {
		const { actions: { updatevisible, setoldfile } } = this.props;
		updatevisible(true);
		setoldfile(file);
	}
}