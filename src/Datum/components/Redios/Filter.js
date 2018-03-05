import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,DatePicker,Table,Modal
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;

class Filter extends Component {

	static propTypes = {};
	static layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	  };
	render() {
		const { actions: { toggleAddition }, Doc = [] } = this.props;
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row gutter={24}>
					<FormItem>
						<Col span={14}>
							<Search placeholder="输入内容"
								onSearch={this.query.bind(this)} />
						</Col>
						<Col span={10}>
							<FormItem
								label="拍摄日期"
								{...Filter.layout}
							>
								<Col span={11}>
									<FormItem>
										<DatePicker />
									</FormItem>
								</Col>
								<Col span={2}>
									<span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
										-
                        </span>
								</Col>
								<Col span={11}>
									<FormItem>
										<DatePicker defaultvalue="" />
									</FormItem>
								</Col>
							</FormItem>
						</Col>
					</FormItem>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.isTreeSelected ?
							<Button style={{ marginRight: 10 }} disabled>添加文件</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>添加文件</Button>
						}
						{/* </Col> */}
						{/* <Col span ={2}> */}
						{
							/* (Doc.length === 0 )?
								<Button style={{marginRight: 10}} disabled>下载文件</Button>:
								<Button style={{marginRight: 10}} type="primary" onClick={this.download.bind(this)}>下载文件</Button> */
						}
						{/* </Col> */}
						{/* <Col span ={2}> */}
						{
							(Doc.length === 0) ?
								<Button style={{ marginRight: 10 }} disabled>删除文件</Button> :
								<Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
									<Button style={{ marginRight: 10 }} type="primary" onClick={this.delete.bind(this)}>删除文件</Button>
								</Popconfirm>
						}
					</Col>
				</Row>
			</Form>
		);
	}

	query(value) {
		const { actions: { getdocument }, currentcode } = this.props;
		let search = {
			doc_name: value
		};
		getdocument({ code: currentcode.code }, search);
	}
	cancel() {

	}

	delete() {
		const { selected } = this.props;
	}
	confirm() {
		const {
			coded = [],
			selected = [],
			currentcode = {},
			actions: { deletedoc, getdocument }
		} = this.props;
		if (selected === undefined || selected.length === 0) {
			message.warning('请先选择要删除的文件！');
			return;
		}
		selected.map(rst => {
			coded.push(rst.code);
		});
		let promises = coded.map(function (code) {
			return deletedoc({ code: code });
		});
		message.warning('删除文件中...');
		Promise.all(promises).then(() => {
			message.success('删除文件成功！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		}).catch(() => {
			message.error('删除失败！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		});
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
};
export default Filter = Form.create()(Filter);
