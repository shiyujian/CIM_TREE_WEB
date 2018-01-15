import React, { PropTypes, Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, Modal, Upload,
	Icon, Table, Select, DatePicker, Progress, notification,Checkbox
} from 'antd';
import moment from 'moment';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
import './Addition.less';

const Dragger = Upload.Dragger;
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

let fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
class Addition extends Component {
	static propTypes = {};
	static layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 }
	};
	state = {
		progress: 0,
		isUploading: false
	}

	render() {
		const {
			platform: { users = [] },
			form: { getFieldDecorator }
		} = this.props;

		const { additionVisible = false,
			docs = [],
			newkey = [],
			judgeFile = '',
			newdirtree = []
		} = this.props;
		let content = judgeFile.indexOf('照片') == -1 ? "支持 pdf、doc、docx 文件" : "支持 jpg、jpeg、png 文件";
		fileTypes = judgeFile.indexOf('照片') == -1 ? 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword' : 'image/jpg,image/jpeg,image/png';
		let { progress, isUploading } = this.state;
		let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
		<Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
		let footer = isUploading ? null : arr;
		const docCols = newkey.map(rst => {
			if (rst.name === "文件名" || rst.name === "卷册名" || rst.name === "事件" || rst.name === "名称") {
				return {
					title: rst.name,
					dataIndex: 'name',
					key: rst.name
				}
			} else if (rst.name === "设计阶段") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						const { designstage = [] } = this.props;
						return <Select placeholder="选择设计阶段" style={{ width: 130 }}
							onChange={this.changeDesignStage.bind(this, rst.code, record, index)}>
							{
								designstage.metalist.map((data, index) => {
									return <Option key={index}
										value={data.name}>{data.name}</Option>;
								})
							}
						</Select>;
					}
				}
			} else if (rst.name === "专业") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						const { professionlist = [] } = this.props;
						return <Select placeholder="选择专业" style={{ width: 130 }}
							onChange={this.changeprofessionlist.bind(this, rst.code, record, index)}>
							{
								professionlist.map((data, index) => {
									return <Option key={index}
										value={data.name}>{data.name}</Option>;
								})
							}
						</Select>;
					}
				}
			} else if (rst.name.indexOf("日期") !== -1 || rst.name.indexOf("时间") !== -1) {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						return <DatePicker style={{ width: 110 }} onChange={this.time.bind(this, rst.code, record, index)} />;
					}
				}
			}
			else if (rst.name === "项目负责人") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						return <Input onChange={this.proj.bind(this, rst.code, record, index)} />;
					}
				}
			}
			else if (rst.name === "专业负责人") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						return <Input onChange={this.prof.bind(this, rst.code, record, index)} />;
					}
				}
			}
			else if (rst.name === "设计单位") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						const { designUnitList = [] } = this.props;
						return <Select placeholder="选择设计单位" style={{ width: 210 }}
							onChange={this.unit.bind(this, rst.code, record, index)}>
							{
								designUnitList.map((data, index) => {
									return <Option key={index}
										value={data.name}>{data.name}</Option>;
								})
							}
						</Select>;
						/* return <Input onChange={this.unit.bind(this, rst.code,record,index)}/>; */
					}
				}
			}
			else if (rst.name !== "操作") {
				return {
					title: rst.name,
					key: rst.name,
					render: (doc, record, index) => {
						return <Input onChange={this.company.bind(this, rst.code, record, index)} />;
					}
				}
			} else {
				return {
					title: '操作',
					key: '操作',
					render: (doc) => {
						return (
							<a onClick={this.remove.bind(this, doc)}>删除</a>
						);
					}
				}
			}
		});

		return (
			<Modal title="新增资料111"
				width='70%' visible={additionVisible}
				closable={false}
				footer={footer}
				maskClosable={false}>
				<Form>
					<Row>
						<Col span={24}>
							<Row>
								<Col span={8} >
									<FormItem {...Addition.layout} label="单位工程">
										{
											getFieldDecorator('workflow', {
												rules: [
													{ required: false, message: '请选择任务类型' },
												]
											})
												(<Select allowClear>
												</Select>)
										}
									</FormItem>
								</Col>
								<Col span={16}  >
									<FormItem className="box" {...Addition.layout} label="主题" >
										{
											getFieldDecorator('workflowactivity', {
												rules: [
													{ required: false, message: '请输入任务名称' },
												]
											})
												(<Input span={20} placeholder="请输入..." />)
										}
									</FormItem>
								</Col>


							</Row>
							<Row>
								<Col span={8}>
									<FormItem {...Addition.layout} label="文档类型">
										{
											getFieldDecorator('creator', )
												(<Select
												>
												</Select>)
										}

									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...Addition.layout} label="收文单位">
										{
											getFieldDecorator('creator', )
												(<Select placeholder="系统自带识别获取"
												>
												</Select>)
										}

									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem {...Addition.layout} label="编号">
										{
											getFieldDecorator('workflowactivity', {
												rules: [
													{ required: false, message: '请输入任务名称' },
												]
											})
												(<Input placeholder="系统自带获取" />)
										}
									</FormItem>
								</Col>
							</Row>
						</Col>
					</Row>


					<Row gutter={24}>
						<Col span={24} style={{ marginTop: 16, height: 160 }}>
							<Dragger {...this.uploadProps}
								accept={fileTypes}
								onChange={this.changeDoc.bind(this)}>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox" />
								</p>
								<p className="ant-upload-text">点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									{content}
								</p>
							</Dragger>
							<Progress percent={progress} strokeWidth={5} />
						</Col>
					</Row>
					<Row gutter={24} style={{ marginTop: 30 }}>
						<Col span={24}>
							{/* <Table rowSelection={this.rowSelection}
                                   columns={docCols}
                                   dataSource={docs}
                                   bordered rowKey="uid"/> */}
							<Table
								columns={docCols}
								dataSource={docs}
								bordered rowKey="uid" />
						</Col>
					</Row>
					<Row span={24} style={{float:"left",marginLeft:"20%"}}>
						<Col span={6} style={{float:"left",marginLeft:"20%"}}>
							<FormItem {...Addition.layout} label="审核人">
								{
									getFieldDecorator('creator', )
										(<Select
										>
										</Select>)
								}
							</FormItem>
						</Col>
						<Col span={4}  style={{float:"left",marginLeft:"10%"}}>
							<FormItem>
								{getFieldDecorator('remember', {
									valuePropName: 'checked',
									initialValue: true,
								})(
									<Checkbox>短信通知</Checkbox>
									)}
							</FormItem>
						</Col>

						<Col span={4}  >
							<Button>取消</Button>
							<Button>确定</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}

	rowSelection = {
		onChange: (selectedRowKeys) => {
			const { actions: { selectDocuments } } = this.props;
			selectDocuments(selectedRowKeys);
		}
	};

	cancel() {
		const {
			actions: { toggleAddition, changeDocs },
		} = this.props;
		toggleAddition(false);
		changeDocs([]);
		this.setState({
			progress: 0
		})
	}

	uploadProps = {
		name: 'file',
		action: `${FILE_API}/api/user/files/`,
		showUploadList: false,
		data(file) {
			return {
				name: file.fileName,
				a_file: file
			};
		},
		beforeUpload(file) {
			const valid = fileTypes.indexOf(file.type) >= 0;
			const errorMsg = fileTypes.indexOf('image') == -1 ? '只能上传 pdf、doc、docx 文件！' : '只能上传 jpg、jpeg、png 文件！';
			if (!valid) {
				notification.error({
					message: errorMsg,
					duration: 2
				});
			}
			return valid;
			this.setState({ progress: 0 });
		},
	};

	changeDoc({ file, fileList, event }) {
		const {
			docs = [],
			actions: { changeDocs }
		} = this.props;
		if (file.status === 'done') {
			file.updoc = {};
			changeDocs([...docs, file]);
		}
		this.setState({
			isUploading: file.status === 'done' ? false : true
		})
		// console.log('file',file);
		if (event) {
			let { percent } = event;
			if (percent !== undefined)
				this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}

	proj(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		let value = event.target.value;
		doc.updoc.projectPrincipal = {
			person_name: value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	prof(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		let value = event.target.value;
		doc.updoc.professionPrincipal = {
			person_name: value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	unit(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		/* let value = event;
		doc.updoc.designUnit = {
			name:value
		}; */

		doc.updoc[code] = event;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	company(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		let newname = code;
		let value = event.target.value;
		doc.updoc[newname] = value;
		doc.updoc.state = '正常状态';
		doc.updoc.name = doc.name;
		console.log(99, doc);
		changeupdoc(updoc);
		changeDocs(docs);
	}

	changeDesignStage(code, record, index, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		record.updoc[code] = event;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	changeprofessionlist(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		doc.updoc[code] = event;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	time(name, doc, record, event, data) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		// updoc[name] = data;
		doc.updoc[name] = data;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	remove(doc) {
		const {
			docs = [],
			actions: { changeDocs }
		} = this.props;
		changeDocs(docs.filter(d => d !== doc));
		this.setState({
			progress: 0
		})
	}

	save() {
		const {
			currentcode = {},
			updoc = {},
			docs = [],
			actions: { toggleAddition, postDocument, getdocument, changeDocs }
		} = this.props;
		let tag = false;
		if (docs.length == 0) {
			notification.error({
				message: '请先上传文件',
				duration: 2
			});
			return
		}
		for (let i = 0; i < docs.length; i++) {
			let flag = (docs[i].updoc.keyword_19 == undefined || docs[i].updoc.juance == undefined || docs[i].updoc.keyword_17 == undefined || docs[i].updoc.projectPrincipal.person_name == undefined ||
				docs[i].updoc.professionPrincipal.person_name == undefined || docs[i].updoc.profession == undefined || docs[i].updoc.archivingTime == undefined ||
				docs[i].updoc.version == undefined);
			if (flag) {
				notification.error({
					message: '信息填写不完整',
					duration: 2
				});
				tag = true
				break;
			}
		}
		if (!tag) {
			const promises = docs.map(doc => {
				const response = doc.response;
				let files = DeleteIpPort(doc);
				return postDocument({}, {
					code: `${currentcode.code}_${response.id}`,
					name: doc.name,
					obj_type: 'C_DOC',
					profess_folder: {
						code: currentcode.code, obj_type: 'C_DIR'
					},
					basic_params: {
						files: [files]
					},
					extra_params: {
						...doc.updoc,
						submitTime: moment.utc().format()
					}
				});
			});
			notification.info({
				message: '新增文件中...',
				duration: 2
			});
			Promise.all(promises).then(rst => {
				notification.success({
					message: '新增文件成功！',
					duration: 2
				});
				changeDocs([]);
				toggleAddition(false);
				getdocument({ code: currentcode.code });
			});
			this.setState({
				progress: 0
			})
		}
	}
}
export default Addition = Form.create()(Addition);