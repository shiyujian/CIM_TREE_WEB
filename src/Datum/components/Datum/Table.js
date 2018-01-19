import React, { Component } from 'react';
import { Table, Spin,message } from 'antd';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {

	render() {
		const { Doc = [] } = this.props;
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
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			// sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '发布单位',
			dataIndex: 'extra_params.company',
			key: 'extra_params.company',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '实施日期',
			dataIndex: 'extra_params.time',
			key: 'extra_params.time',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '备注',
			dataIndex: 'extra_params.remark',
			key: 'extra_params.remark'
		}, {
			title: '文档状态',
			dataIndex: 'extra_params.state',
			key: 'extra_params.state'
		}, {
			title: '操作',
			render: (record) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>预览</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>更新</a>					
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this)}>下载</a>
					</div>
				);
				return nodes;
			}
		}
	];
	download() {
		const { selected = [], file = [], files = [], down_file = [] } = this.props;
		if (selected.length == 0) {
			message.warning('没有选择无法下载');
		}
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