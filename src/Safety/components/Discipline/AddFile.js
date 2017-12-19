import React, {Component} from 'react';

import {Input, Form, Spin,Upload,Icon,Button,Select,message} from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddFile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fileArray:[],
		};
	}

	coverPicFile = (e) => {
		debugger
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({attachment: e.filelist});
		return e && e.fileList;
	}

    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

    beforeUploadPicFile  = (file) => {
		const fileName = file.name;
		// 上传图片到静态服务器
		debugger
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return
			}
			// this.props.props.actions.setUploadFile(resp);
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file)
            filedata.download_url = this.covertURLRelative(filedata.a_file)
            const attachment = {
				size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file:resp.a_file,
				download_url:resp.download_url,
				mime_type:resp.mime_type
			};
			let fileArray = this.state.fileArray;
			fileArray.push(attachment);
			this.setState({fileArray:fileArray});
			debugger
            this.props.props.form.setFieldsValue({attachment:this.state.fileArray});
		});
		return false;
	}

	removePicFile = (file) => {
		const {
			actions:{deleteStaticFile}
		} = this.props.props;
		debugger
		const id = file.uid;
		deleteStaticFile({
			id: id
		},{}, {
			'Authorization': 'Basic aml4aTpqaXhp',
		}).then(resp => {
			debugger
			if(!resp) {
				// delete success
				let fileArray = this.state.fileArray;
				for(let i=0;i<fileArray.length;i++){
					if(fileArray[i].uid===file.uid){
						fileArray.splice(i,1);
						break;
					}
				}
				this.setState({fileArray:fileArray});
			}
		});
		return true;
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		return (
			<Form>
				<FormItem {...formItemLayout} label="工程名称">
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.unitProject.name,
					})(
						<Input type="text" disabled/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="上传文件">
					{getFieldDecorator('attachment', {
						rules: [
							{required: true, message: '请至少上传一个文件！'},
						],
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
						<Upload 
						 beforeUpload={this.beforeUploadPicFile.bind(this)} 
						 onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加文件
  							</Button>
                        </Upload>
					)}
				</FormItem>
			</Form>
		)
	}
}
