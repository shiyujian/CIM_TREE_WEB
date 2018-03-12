import React, { Component } from 'react';
import { Table, Spin, message } from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {

	render() {
		const { Doc = [] } = this.props;
		console.log('ttt',this.props)
		return (
			<Table rowSelection={this.rowSelection}
				dataSource={Doc}
				columns={this.columns}
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
			title: '区域',
			dataIndex: 'extra_params.area',
			key: 'area',
		}, {
			title: '单位工程',
			dataIndex: 'extra_params.unitProject',
			key: 'unitProject',
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		},{
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'number',
		},{
			title: '文档类型',
			dataIndex: 'extra_params.doc_type',
			key: 'doc_type',
		},{
			title: '提交单位',
			dataIndex: 'extra_params.unit',
			key: 'unit',
		},{
			title: '提交人',
			dataIndex: 'extra_params.people',
			key: 'people',
		},{
			title: '提交时间',
			dataIndex: 'extra_params.time',
			key: 'time',
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