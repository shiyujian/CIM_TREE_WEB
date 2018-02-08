import React, { Component } from 'react';
import { Table, Spin, message } from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import './index.less';
export default class GeneralTable extends Component {

	render() {
		const { Doc = [] } = this.props;
		return (
			<Table rowSelection={this.rowSelection}
				dataSource={Doc}
				columns={this.columns}
				expandedRowRender={record=> <p>{record.extra_params.trainnr}</p>}
				className='foresttables'
				bordered rowKey="code" />
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const { actions: { selectDocuments } } = this.props;
			console.log("selectedRows",selectedRows)
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
			title: '参加人数',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
			// sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '培训单位',
			dataIndex: 'extra_params.company',
			key: 'extra_params.company',
			// sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '培训日期',
			dataIndex: 'extra_params.time',
			key: 'extra_params.time',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '培训学时',
			dataIndex: 'extra_params.trainxs',
			key: 'extra_params.trainxs',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '合格率',
			dataIndex: 'extra_params.qualification',
			key: 'extra_params.qualification',
			// sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
		}, {
			title: '安全教育',
			dataIndex: 'extra_params.remark',
			key: 'extra_params.remark'
		}, {
			title: '文档状态',
			dataIndex: 'extra_params.state',
			key: 'extra_params.state'
		}, {
			title: '操作',
			render: (record, index,e) => {
				const { Doc = [] } = this.props;
				let nodes = [];
				nodes.push(
					
					<div>
						<a onClick={this.previewFile.bind(this, record)}>预览</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>更新</a>
						{/* <a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a> */}
						
							<a  style={{ marginLeft: 10 }}  
								href={Doc[e].basic_params.files[0].a_file}>下载
					  		</a>
						
					</div>
				);
				return nodes;
			}
		}
	];
	// createLink = (name, url) => {    //下载
	// 	let link = document.createElement("a");
	// 	link.href = url;
	// 	link.setAttribute('download', this);
	// 	link.setAttribute('target', '_blank');
	// 	document.body.appendChild(link);
	// 	link.click();
	// 	document.body.removeChild(link);
	// }
	// download(index, key, e) {
	// 	const { selected = [], file = [], files = [], down_file = [] } = this.props;
	// 	console.log(index)
	// 	console.log(key)
	// 	console.log(e)
	// 	if (selected.length == 0) {
	// 		message.warning('没有选择无法下载');
	// 	}
	// 	for (var j = 0; j < selected.length; j++) {
	// 		if (selected[j].code == index.code) {

	// 			selected.map(rst => {
	// 				file.push(rst.basic_params.files);
	// 			});
	// 			file.map(value => {
	// 				value.map(cot => {
	// 					files.push(cot.download_url)
	// 				})
	// 			});
	// 			files.map(down => {
	// 				let down_load = STATIC_DOWNLOAD_API + "/media" + down.split('/media')[1];
	// 				this.createLink(this, down_load);
	// 			});
	// 		}
	// 	}
	// }

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