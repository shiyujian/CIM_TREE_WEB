import React, {PropTypes, Component} from 'react';
import {SERVICE_API} from '../../../_platform/api';
import {
	Form, Input, Row, Col, Modal, Upload,
	Icon, message, Table,DatePicker,Button
} from 'antd';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;

export default class Addition extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16},
	};

	render() {
		const{additionVisible = false,
			docs = [],
		} = this.props;

		return (
			<Form>
				<Row gutter={24}>
					<span>文件夹模板维护</span>
					<Col span={24} style={{marginTop: 16, height: 100}}>
						<Dragger {...this.uploadProps}
						         accept={fileTypes}
						         onChange={this.changeDoc.bind(this)}>
							<p className="ant-upload-text">点击或者拖拽开始上传</p>
							<p className="ant-upload-hint">
								支持 pdf、doc、docx 文件

							</p>
						</Dragger>
					</Col>
				</Row>
				<Row gutter={24} style={{marginTop: 16}}>
					<Col span={24}>
						<Table columns={this.docCols}
						       dataSource={docs}
						       bordered rowKey="uid"/>
					</Col>
				</Row>
			</Form>
		);
	}

	uploadProps = {
		name: 'file',
		action: `${SERVICE_API}/excel/upload-api/`,
		showUploadList: false,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		beforeUpload(file) {
			const valid = fileTypes.indexOf(file.type) >= 0;
			console.log(file);
			if (!valid) {
				message.error('只能上传 pdf、doc、docx 文件！');
			}
			return valid;
		},
	};

	changeDoc({file, fileList}) {
		const {
			docs = [],
			actions: {changeDocs,savesb},
		} = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		this.setState({ fileList });
		let response = file.response;
		if(response !== undefined){
			let sb = response.Directory;
			savesb(sb);
		}
	}

	docCols = [
		{
			title:'上传文件夹模板名称',
			dataIndex:'name',
			key:'name'
		},{
			title:'操作',
			render: doc => {
				return (
					<div>
						<a onClick={this.remove.bind(this, doc)}>删除</a>
						<a onClick={this.save.bind(this, doc)}>保存模板</a>
					</div>
				);
			},
		},
	];


	remove(doc) {
		const {
			docs = [],
			actions: {changeDocs},
		} = this.props;
		changeDocs(docs.filter(d => d !== doc));
	}

	save() {
		const {sb = [],actions:{putFolder,changeDocs,setdir}} = this.props;
		let newsb = sb.slice(1);
		let metalist =[];
		newsb.map(rst=>{
			// console.log(rst);
			let obj= {
				parent: rst[0],
				code :rst[1],
				name :rst[2],
				extra_params:{
					newdocs:[]
				},
			};
			metalist.push(obj);
		});
		putFolder({code:'Folder'},{metalist:metalist}).then(rst =>{
			message.success('创建模板成功！');
			changeDocs();
			let dir =[];
			rst.metalist.map(rst1 => {
				if(rst1.parent === ""){
					dir.push(rst1);
				}
			});
			setdir(dir);
			});
	}

}
