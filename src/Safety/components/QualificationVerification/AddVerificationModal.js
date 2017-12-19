import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddVerificationModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			one:null,
			two:null,
			three:null//当上传新文件时删除旧文件，记录旧文件id
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
		const fileName = file.name;
		if(/.+?\.pdf/.test(fileName)){
			
		}else{
			message.error('请上传pdf');
			return false;
		}
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = [{
                size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file:resp.a_file,
				download_url:resp.download_url,
				mime_type:resp.mime_type
            }];
    		// 删除 之前的文件
    		if(this.state.one) {
    			deleteStaticFile({ id: this.state.one.id })
    		}
            this.setState({one: filedata})
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}
	beforeUploadPicFile2  = (file) => {
		const fileName = file.name;
		if(/.+?\.pdf/.test(fileName)){
			
		}else{
			message.error('请上传pdf');
			return false;
		}
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const certifications = [{
				size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file:resp.a_file,
				download_url:resp.download_url,
				mime_type:resp.mime_type
            }];
    		// 删除 之前的文件
    		if(this.state.two) {
    			deleteStaticFile({ id: this.state.two.id })
    		}
            this.setState({two: filedata})
            this.props.props.form.setFieldsValue({certifications: resp.id ? certifications : null})
		});
		return false;
	}
	beforeUploadPicFile3  = (file) => {
		const fileName = file.name;
		if(/.+?\.pdf/.test(fileName)){
			
		}else{
			message.error('请上传pdf');
			return false;
		}
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const safetyLicense = [{
                size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file:resp.a_file,
				download_url:resp.download_url,
				mime_type:resp.mime_type
            }];
    		// 删除 之前的文件
    		if(this.state.three) {
    			deleteStaticFile({ id: this.state.three.id })
    		}
            this.setState({three: filedata})
            this.props.props.form.setFieldsValue({safetyLicense: resp.id ? safetyLicense : null})
		});
		return false;
	}


	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props.props;

		deleteStaticFile({id:file.uid});
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
				<FormItem {...formItemLayout} label="总/分包单位" hasFeedback>
					{getFieldDecorator('packUnit', {
						rules: [
							{required: true, message: '请选择总/分包单位'},
						]
					})(
                        <Input type="text" placeholder="请输入总/分包单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="承包项目" hasFeedback> 
					{getFieldDecorator('contractingProject', {
						rules: [
							{required: true, message: '请输入承包项目！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入承包项目！"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="营业执照" hasFeedback>
					{getFieldDecorator('attachment', {
						rules: [
							{required: true, message: '请上传营业执照'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加营业执照
  							</Button>
                        </Upload>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="资质证书" hasFeedback>
					{getFieldDecorator('certifications', {
						rules: [
							{required: true, message: '请上传资质证书'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile2.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加资质证书
  							</Button>
                        </Upload>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="安全生产许可证" hasFeedback>
					{getFieldDecorator('safetyLicense', {
						rules: [
							{required: true, message: '请上传安全生产许可证'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile3.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加生产许可证
  							</Button>
                        </Upload>
					)}
				</FormItem>
			</Form>
		)
	}
	//获取到项目和总/分包单位下拉框选项
}
