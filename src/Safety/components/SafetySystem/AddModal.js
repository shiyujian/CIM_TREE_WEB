import React, { Component } from 'react';
import {FILE_API} from '../../../_platform/api';

import {
	Form, Input, Row, Col, Modal, Upload, Button,
	Icon, message, Table, DatePicker, Progress, Select, Checkbox, Popconfirm
} from 'antd';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
export default class AddModal extends Component {
	state = {
		progress: 0,
		isUploading: false,
	}
	static layoutT = {
		labelCol: {span: 4},
		wrapperCol: {span: 20},
	  };
	  static layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	changeDoc({ file, fileList, event }) {
		const {
            docs = [],
			actions: { changeDocs }
        } = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		// this.setState({
		// 	isUploading: file.status === 'done' ? false : true
		// })
		if (event) {
			let { percent } = event;
			if (percent !== undefined)
				this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
            }
            return valid;
            this.setState({ progress: 0 });
        },
    };
	save() {

	}
	onsectionchange(){

	}
	factorychange(){

	}
	ontypechange(){

	}
	standardchange(){

	}
	zzbmchange(){
		
	}
	render() {
		const { addVisible } = this.props;
		const{
            docs = []
        } = this.props;
		let { progress, isUploading
            } = this.state;
		const columns = [{
			title: "主题",
			dataIndex: 'order',
		}, {
			title: "编码",
			dataIndex: 'attrs.zzbm',
		}, {
			title: "工程名称",
			dataIndex: 'section',
		}, {
			title: "文档类型",
			dataIndex: 'place',
		}, {
			title: "提交单位",
			dataIndex: 'treetype',
		}, {
			title: "提交人",
			dataIndex: 'factory',
		}, {
			title: "提交时间",
			dataIndex: 'nurseryname',
		}, {
			title: "流程状态",
			dataIndex: 'nurseryname',
		}, {
			title: "操作",
			dataIndex: 'nurseryname',
		}];
		let arr = [
			<Row gutter={24}>
				<Col span={12}>
					<Form>
						<FormItem style={{ marginLeft: '100px', marginRight: '50px' }}  {...AddModal.layoutT} label="审核人:">
							<Select>
								<Option value='第一经理'>第一经理</Option>
								<Option value='第二经理'>第二经理</Option>
							</Select>
						</FormItem>
					</Form>
				</Col>
				<Col span={12}>
					<Checkbox style={{ marginRight: '150px' }}>短信通知</Checkbox>
					<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>
				</Col>
			</Row>
		];
		let footer = isUploading ? null : arr;

		return (
			<Modal title="新增文档"
				width={920} visible={addVisible}
				closable={false}
				footer={footer}
				maskClosable={false}>
				<Form>
					<Row>
						<Col span={24}>
							<Row>
								<Col span={8}>
									<FormItem {...AddModal.layout} label="工程名称：">
										{/* <span>工程名称：</span> */}
										<Select allowClear className='forestcalcw2' defaultValue='全部' onChange={this.onsectionchange.bind(this)}>
											{/* {sectionoption} */}
										</Select>
									</FormItem>
								</Col>
								<Col span={16}>
									<FormItem {...AddModal.layoutT} label="主题：">
										{/* <span>主题：</span> */}
										<Input className='forestcalcw3' onChange={this.factorychange.bind(this)} />
									</FormItem>
								</Col>

							</Row>
							<Row>
								<Col span={8}>
									<FormItem {...AddModal.layout} label="文档类型：">
										{/* <span>文档类型：</span> */}
										<Select allowClear className='forestcalcw2' defaultValue='全部'  onChange={this.ontypechange.bind(this)}>
											{/* {typeoption} */}
										</Select>
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...AddModal.layout} label="收文单位：">
										{/* <span>流程状态：</span> */}
										<Select allowClear className='forestcalcw2' defaultValue='全部'  onChange={this.standardchange.bind(this)}>
											{/* {standardoption} */}
										</Select>
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...AddModal.layout} label="编码：">
										{/* <span>编码：</span> */}
										<Input  className='forestcalcw2' onChange={this.zzbmchange.bind(this)} />
									</FormItem>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24} style={{ marginTop: 16, height: '160px' }}>
							<Dragger {...this.uploadProps}
								accept={fileTypes}
								onChange={this.changeDoc.bind(this)}>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox" />
								</p>
								<p>点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									支持 pdf、doc、docx 文件
						 </p>
							</Dragger>
							<Progress percent={progress} strokeWidth={5} />
						</Col>
					</Row>
					<Row gutter={24} style={{ marginTop: 15 }}>
						<Col span={24}>
							<Table rowSelection={this.rowSelection}
								columns={this.columns}
								dataSource={docs}
								bordered rowKey="uid" />
						</Col>
					</Row>
				</Form>

			</Modal>
		)
	}
	rowSelection = {
		onChange: (selectedRowKeys) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRowKeys);
		},
	};

	cancel() {
		const { actions: { AddVisible } } = this.props;
		AddVisible(false);
	}
}