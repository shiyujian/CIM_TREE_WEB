import React, { Component } from 'react';
import { Table, Spin, message, Modal } from 'antd';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import moment from 'moment';
import '../Datum/index.less';
export default class GeneralTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			previewModalVisible: false,
			video: ''
		}
	}

	render() {
		const { Doc = [] } = this.props;
		return (
			<div>
				<Table rowSelection={this.rowSelection}
					dataSource={Doc}
					columns={this.columns}
					className='foresttables'
					bordered rowKey="code" />
				<Modal title="影像预览"
					closable
					width={920} visible={this.state.previewModalVisible}
					footer={null}
					onCancel={this.cancelT.bind(this)}
					cancelText={"关闭"}
					maskClosable={false}>
					<video
						controls
						preload="auto"
						width="100%"
						height="500px"
						src={this.state.video}
					>
						{/* <source src={this.props.video} /> */}
					</video>
				</Modal>

			</div>
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRows);
		},
	};
	cancelT() {
		this.setState({ previewModalVisible: false })
	}

	columns = [
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.length - b.name.length
		}, {
			title: '编号',
			dataIndex: 'extra_params.number',
			key: 'extra_params.number',
			sorter: (a, b) => a.extra_params.number.length - b.extra_params.number.length
		}, {
			title: '发布单位',
			dataIndex: 'extra_params.company',
			key: 'extra_params.company',
			sorter: (a, b) => a.extra_params.company.length - b.extra_params.company.length
		}, {
			title: '实施日期',
			dataIndex: 'extra_params.time',
			key: 'extra_params.time',
			sorter: (a, b) => moment(a.extra_params.time).unix() - moment(b.extra_params.time).unix()
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
			render: (record, index) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>预览

						</a>
						<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>更新</a>
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this, index)}>下载</a>
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
		console.log(file.basic_params.files)
		const videos = file.basic_params.files[0] || []
		console.log(videos.a_file.split(".")[4])
		// const index=videos.a_file.indexOf(".")
		// console.log(index)
		let a_file = videos.a_file.split(".")[4]
		console.log(a_file)

		if (a_file == "mp4") {
			console.log(1)
			this.setState({ previewModalVisible: true, video: videos.a_file })

		} else {
			const { actions: { openPreview } } = this.props;
			console.log(2)

			if (JSON.stringify(file.basic_params) == "{}") {
				console.log(3)
				return
			} else {
				console.log(4)

				const filed = file.basic_params.files[0];
				openPreview(filed);
			}
		}


	}

	update(file) {
		const { actions: { updatevisible, setoldfile } } = this.props;
		updatevisible(true);
		setoldfile(file);
	}
}