import React, { Component } from 'react';
import { Table, Spin, message } from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {

	render() {
		const { Doc = [] } = this.props;
		console.log('table.this.props',this.props)
		return (
			<Table rowSelection={this.rowSelection}
				dataSource={Doc}
				columns={this.columns}
				className='foresttable'
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
			title: '单位工程',
			dataIndex: 'name',
			key: 'name',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '编号',
			dataIndex: 'number',
			key: 'number',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '文档类型',
			dataIndex: 'docStyle',
			key: 'docStyle',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '提交单位',
			dataIndex: 'submitCompany',
			key: 'submitCompany',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '提交人',
			dataIndex: 'submitPerson',
			key: 'submitPerson'
		}, {
			title: '提交时间',
			dataIndex: 'submitTime',
			key: 'submitTime'
		},{
			title: '流程状态',
			dataIndex: 'flowStyle',
			key: 'flowStyle'
		}, {
			title: '操作',
			render: (record, index) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>查看</a>
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>查看流程卡</a>
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
	download(index, key, e) {
		const { selected = [], file = [], files = [], down_file = [] } = this.props;

		if (selected.length == 0) {
			message.warning('没有选择无法下载');
		}
		for (var j = 0; j < selected.length; j++) {
			if (selected[j].code == index.code) {

				selected.map(rst => {
					file.push(rst.basic_params.files);
				});
				file.map(value => {
					value.map(cot => {
						files.push(cot.download_url)
					})
				});
				files.map(down => {
					let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
					this.createLink(this, down_load);
				});
			}
		}
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