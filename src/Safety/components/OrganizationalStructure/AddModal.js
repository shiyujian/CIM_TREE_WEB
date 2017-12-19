import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon} from 'antd';
import moment from 'moment';
import {USER, PASSWORD} from '_platform/api';
const FormItem = Form.Item;

export default class AddModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currInitialData: {}
		};
    }
     
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

	beforeUploadPicFile  = (file) => {
		let jsxThis = this;
		const fileName = file.name;
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
			console.log('uploadStaticFile: ', resp);
			//debugger
			this.props.props.actions.setUploadFile(resp);
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = [{
                uid: file.uid,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
                thumbUrl: resp.a_file
            }];
    		// 删除 之前的文件
    		if(jsxThis.state.currInitialData) {
    			deleteStaticFile({ id: jsxThis.state.currInitialData.id })
    		}
            jsxThis.setState({currInitialData: filedata})
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props.props;
		debugger
		// 删除 之前的文件
		const picFile = this.state.currInitialData;
		if(picFile) {
			const currentPicId = picFile.id;
			deleteStaticFile({
				id: currentPicId
			},{}, {}).then(resp => {
				if(!resp) {
			        this.setState({currInitialData: null})
				}
			});
		} else { // 删除 coverPicFileInfo
			this.setState({currInitialData: null})
		}
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
				<FormItem {...formItemLayout} label="工程名称" hasFeedback>
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.projectName,
						rules: [
							{required: true, message: '请输入工程名称！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到工程名称"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						initialValue: this.props.state.projectManager,
						rules: [
							{required: true, message: '请输入项目经理！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到项目经理"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="安全生产组织架构" hasFeedback>
					{getFieldDecorator('attachment', {
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: true, message: '请上传安全生产组织架构'},
						]
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFile.bind(this)} onRemove={this.removePicFile.bind(this)}>
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