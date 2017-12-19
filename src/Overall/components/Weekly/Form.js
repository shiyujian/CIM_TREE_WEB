import React, {Component} from 'react';
import moment from 'moment';
import {Row, Col, Table, Button, Input, DatePicker, message, Upload, Icon, Modal, Spin, Select} from 'antd';
import {FILE_API, previewWord_API} from '../../../_platform/api';
import {getFieldValue} from '_platform/store/util';

class EditableCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			type: this.props.type,
			user: null
		};
	}

	handleChange = (e) => {
		const value = getFieldValue(e);
		this.setState({value});
		this.props.onChange(value);
	};

	render() {
		const {value, type} = this.state;
		return (
			<div className="editable-cell">
				<div className="editable-cell-input-wrapper">
					{
						(type === 'string') ?
							<Input value={value} onChange={this.handleChange}/>
							: <DatePicker onChange={this.handleChange}/>
					}
				</div>
			</div>
		);
	}
}

export default class WeeklyForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			fileList: [],
			dataSource: [{
				"no": 0,
				"name": "",
				"job": "",
				"done": "",
				"time": "",
				"how": "",
				"remark": "",
			}],
			file: {},
			previewUrl: '',
			previewVisible: false,
			formLoading: false,
			loading: false,
			previewType: ''
		};
	}

	static propTypes = {};

	render() {
		let columns = [{
			title: '周报名称',
			dataIndex: 'name',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						onChange={this.onCellChange(index, 'name')}
					/>
				);
			},
		}, {
			title: '任务事项',
			dataIndex: 'job',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						onChange={this.onCellChange(index, 'job')}
					/>
				);
			},
		}, {
			title: '本周落实情况',
			dataIndex: 'done',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						onChange={this.onCellChange(index, 'done')}
					/>
				);
			},
		}, {
			title: '计划完成时间',
			dataIndex: 'time',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="time"
						onChange={this.onCellChange(index, 'time')}
					/>
				);
			},
		}, {
			title: '工作进度',
			dataIndex: 'how',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						onChange={this.onCellChange(index, 'how')}
					/>
				);
			},
		}, {
			title: '备注',
			dataIndex: 'remark',
			render: (text, record, index) => {
				return (
					<EditableCell
						value={text}
						type="string"
						onChange={this.onCellChange(index, 'remark')}
					/>
				);
			},
		}
			// , {
			// 	title: '预览',
			// 	render: () => {
			// 		return (
			// 		  <span>
			// 			  {
			// 				  (this.state.file.a_file) ? <a onClick={this.previewFile.bind(this,this.state.file)}>预览</a> : null
			// 			  }
			// 		</span>
			// 		)
			// 	},
			// }
		];

		return (
			<div style={{marginTop: '10px'}}>
				<Spin spinning={this.state.formLoading} tip="数据加载中，请稍等...">
					<Table columns={columns}
					       dataSource={this.state.dataSource} bordered pagination={false} rowKey="no"/>
					<Row gutter={24} style={{marginTop: '20px'}}>
						<Col offset={18} span={4}>
							<Upload  {...this.uploadProps}
							         onChange={this.onChange.bind(this)}>
								<Button>
									<Icon type="file-pdf"/>
									&nbsp;&nbsp;点击上传文件
								</Button>
							</Upload>
						</Col>
						<Col span={2} style={{textAlign: 'right'}}>
							<Button onClick={this.submit.bind(this)}>提交</Button>
						</Col>
					</Row>
				</Spin>
				<Modal title="文件预览" visible={this.state.previewVisible}
				       onOk={this.previewModal.bind(this)} onCancel={this.previewModal.bind(this)}
				       width={800}
				>
					<Spin spinning={this.state.loading} tip="数据加载中，请稍等...">
						{
							(this.state.previewType == 'office') ?
								<iframe src={`${previewWord_API}${this.state.previewUrl}`}
								        width="100%" height="400px" frameBorder="0"></iframe>
								:
								<iframe className="file-pop-frame"
								        src={`/pdfjs/web/viewer.html?file=${this.state.previewUrl}`}
								        width="100%" height="400px" scrolling="no" frameBorder="0"></iframe>
						}
					</Spin>
				</Modal>
			</div>
		);
	}

	previewFile(file) {
		if (file.mime_type.indexOf('officedocument') > 0) {
			this.setState({
				previewUrl: file.a_file,
				previewVisible: true,
				loading: true,
				previewType: 'office'
			});
		} else if (file.mime_type == 'application/pdf') {
			this.setState({
				previewUrl: file.a_file,
				previewVisible: true,
				loading: true,
				previewType: 'pdf'
			});
		} else {
			message.warning('暂不支持此类文件的预览！');
			return
		}
		setTimeout(() => {
			this.setState({
				loading: false,
			})
		}, 1000)
	}

	previewModal() {
		this.setState({
			previewVisible: false,
		});
	}

	onCellChange = (index, key) => {
		return (value) => {
			const dataSource = [...this.state.dataSource];
			dataSource[index][key] = value;
			this.setState({dataSource});
		};
	};

	onChange(info) {
		const that = this;
		if (info.file.status !== 'uploading') {
			let newFile = DeleteIpPort(info.file);
			that.setState({
				file: newFile
			});
		}
		if (info.file.status === 'done') {
			// message.success(`${info} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error("上传文件失败！");
		}
	}

	uploadProps = {
		name: 'file',
		action: `${FILE_API}/api/user/files/`,
		headers: {
			authorization: 'authorization-text',
		},
		data(file) {
			return {
				name: file.fileName,
				a_file: file
			}
		}
	};
	//提交按钮
	submit() {
		const {createWeekly} = this.props;
		let value = this.state.dataSource[0];
		let ky = true;
		const that = this;
		for (let key in value) {
			if (((value[key] === null) || (value[key] === '')) && ky) {
				message.warning('请输入相关参数');
				ky = false;
				return
			}
		}
		if (!that.state.file) {
			message.warning('请上传文件！');
			return
		}
		let weeklyData = {
			"code": moment().format().toString(),
			"name": value['name'],
			"obj_type": "C_DOC_WRP",
			"profess_folder": {"code": this.props.selectKey[0].split('--')[1], "obj_type": "C_DIR"},
			"extra_params": {
				"name": value['name'],
				"job": value['job'],
				"done": value['done'],
				"time": value['time'].format('YYYY-MM-DD'),
				"how": value['how'],
				"remark": value['remark'],
			},
			"basic_params": {
				"files": [that.state.file]
			},
			"status": "A",
			"version": "A"
		};
		this.setState({
			formLoading: true,
		});
		createWeekly({}, weeklyData)
			.then(rst => {
				this.setState({
					formLoading: false,
				});
				if (rst.pk) {
					this.props.onClick(true);
					message.success("填写周报成功！");
				} else {
					message.error("填写周报错误！")
				}
			});
	}
}

export const DeleteIpPort = (file, inside = '/', number = 2) => {
	let newFile = {};
	let getUrl = (url) => {
		let idx = url.indexOf('/');
		for (let i = 0; i < 2; i++) {
			idx = url.indexOf('/', idx + 1)
		}
		return url.slice(idx, url.length);
	};
	newFile.a_file = getUrl(file.response.a_file);
	newFile.download_url = getUrl(file.response.download_url);
	newFile.name = file.name;
	newFile.misc = file.response.misc;
	newFile.mime_type = file.type;
	return newFile;
};