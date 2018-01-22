import React, { PropTypes, Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, Modal, Upload, Progress,
	Icon, message, Table, Select, DatePicker
} from 'antd';
import moment from 'moment';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
const Dragger = Upload.Dragger;
const Option = Select.Option;
let fileTypes = 'application/mp4,application/3gpp,video/mp4,video/3gpp';

export default class Addition extends Component {

	constructor(props) {
		super(props);
		this.state = {
			video: '',
			key: '',
			data1:[],
			columns1:[]
			
		}
	}
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
		const { actions: { getModalUpdate } } = this.props;
		const getModalVisible = this.props.getModalUpdateVisible
		const { updatevisible = false,
			docs = [],
			newkey = [],
			judgeFile = ''
		} = this.props;
		let content = judgeFile.indexOf('照片') == -1
		fileTypes = judgeFile.indexOf('照片') == -1 ? 'application/mp4,application/3gpp,video/3gpp,video/mp4' : 'video/mp4,video/3gpp,';
		let { progress, isUploading } = this.state;
		let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
		<Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
		let footer = isUploading ? null : arr;
		// const docCols = newkey.map(rst=>{
		// 	if(rst.name === "文件名" ||rst.name === "卷册名" ||rst.name === "事件"|| rst.name === "名称"){
		// 		return 	{
		// 			title:rst.name,
		// 			dataIndex:'name',
		// 			key:rst.name
		// 		}
		// 	}
		// });

		return (
			<Modal title="更新资料"
				width={920} visible={getModalVisible}
				closable={false}
				footer={footer}
				onCancel={this.cancelT.bind(this)}
				onOk={this.determine.bind(this)}
				maskClosable={false}>
				<Form>
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
					<Row gutter={24} style={{ marginTop: 35 }}>
						<Col span={24}>
							<Table rowSelection={this.rowSelection}
								columns={this.state.columns1}
								dataSource={this.state.data1}
								bordered rowKey="uid" />
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
	cancelT() {
		this.cancel();
	}
	determine() {
		this.cancel();
	}

	cancel() {
		const {
			actions: { getModalUpdate },
		} = this.props;
		getModalUpdate(false);
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
				a_file: file,
			};
		},
		beforeUpload(file) {
			const valid = fileTypes.indexOf(file.type) >= 0;
			const errorMsg = fileTypes.indexOf('image') == -1
			if (!valid) {
				message.error(errorMsg);
			}
			return valid;
			this.setState({ progress: 0 });
		},
	};


	changeDoc({ file, fileList, event }) {
		this.setState({ video: file.name, key: file.uid })
		const columns1 = [{
			title: '影像名称',
			dataIndex: 'name',
			key: 'uid'
		}]
	
		const data1 = [{
			name: file.name,
			key: file.uid
		}]
		this.setState({ data1:data1,columns1:columns1})
		const {
			docs = [],
			actions: { changeDocs }
		} = this.props;
		if (file.status === 'done') {
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
	

	company(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		let newname = code;
		let value = event.target.value;
		updoc[newname] = value;
		updoc.state = '正常状态';
		updoc.name = doc.name;
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
		updoc[code] = event;
		changeupdoc(updoc);
		console.log(666666, updoc);
		changeDocs(docs);
	}

	time(name, doc, record, event, data) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		updoc[name] = data;
		changeupdoc(updoc);
		changeDocs(docs);
	}

	proj(code, doc, record, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		let value = event.target.value;
		updoc.projectPrincipal = {
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
		updoc.professionPrincipal = {
			person_name: value
		};
		changeupdoc(updoc);
		changeDocs(docs);
	}

	unit(code, record, index, event) {
		const {
			docs = [],
			updoc = {},
			actions: { changeDocs, changeupdoc }
		} = this.props;
		record.updoc[code] = event;
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
			actions: { getModalUpdate, postDocument, getdocument, changeDocs }
		} = this.props;
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
					...updoc,
					submitTime: moment.utc().format()
				}
			});
		});
		message.warning('新增文件中...');
		Promise.all(promises).then(rst => {
			const { oldfile = {}, currentcode = {}, actions: { putdocument } } = this.props;
			message.success('新增文件成功！');
			putdocument({ code: oldfile.code }, {
				extra_params: {
					state: '作废'
				}
			});
			changeDocs([]);
			getModalUpdate(false);
			setTimeout(() => { getdocument({ code: currentcode.code }) }, 1000)
		});
		this.setState({
			progress: 0
		})
	}

}
