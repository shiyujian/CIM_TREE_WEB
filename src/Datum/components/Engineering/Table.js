import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Spin, Input, Select, Popover, Modal, Button, message } from 'antd';
import { SOURCE_API, STATIC_DOWNLOAD_API } from '_platform/api';
import moment from 'moment';
import '../Datum/index.less'
const Option = Select.Option;


export default class GeneralTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			imgurl: null
		};
	}
	render() {
		const { newkey = [], Doc = [] } = this.props;
		
		const columns = newkey.map(rst => {
			if (rst.name === "文件名" || rst.name === "卷册名" || rst.name === "事件" || rst.name === "名称") {
				return {
					title: rst.name,
					dataIndex: 'extra_params.name',
					key: rst.name
				}
			}
			else if (rst.name !== "操作") {
				return {
					title: rst.name,
					key: rst.name,
					dataIndex: `extra_params[${rst.code}]`
				}
			} else {
				return {
					title: '操作',
					key: '操作',
					render: (record,index) => {
						let nodes = [];
						nodes.push(
							<div>
								{/*<a onClick={this.previewFile.bind(this,record)}>预览</a>*/}
								<Popover content={this.genDownload(record.basic_params.files)}
									placement="right">
									<a>预览</a>
								</Popover>
								<a style={{ marginLeft: 10 }} type="primary" onClick={this.download.bind(this,index)}>下载</a>
								{/* <a href={`${STATIC_DOWNLOAD_API}`}>下载222</a> */}

								<a style={{ marginLeft: 10 }} onClick={this.update.bind(this, record)}>查看流程卡</a>
							</div>
						);
						return nodes;
					}
				}
			}
		});

		columns.splice(-1, 0, { title: '状态', dataIndex: 'extra_params.state' });

		return (
			<div>
				<Table rowSelection={this.rowSelection}
					dataSource={Doc}
					className='foresttable'
					columns={columns}
					bordered rowKey="code" />
				<Modal title="图片预览"
					width='70%'
					closable={false}
					visible={this.state.visible}
					footer={[<Button key="back" size="large" onClick={this.cancel.bind(this)}>关闭查看</Button>]}>
					<img src={`${SOURCE_API}` + this.state.imgurl} alt="图片" />
				</Modal>
			</div>
		);
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
	createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
	cancel() {
		this.setState({
			visible: false
		})
	}
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRows);
		}
	};

	genDownload = (text) => {
		return (
			text.map((rst) => {
				return (
					<div>
						<a onClick={this.previewFile.bind(this, rst)}>{rst.name}</a>
					</div>)
			})
		)
	};


	previewFile(file) {
		const { actions: { openPreview } } = this.props;
		let imgurl = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		if (file.mime_type == "image/png" || file.mime_type == "image/jpg" || file.mime_type == "image/jpeg") {
			this.setState({ visible: true, imgurl: imgurl })
		} else {
			if (JSON.stringify(file) === "{}") {
				return
			} else {
				const filed = file;
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
