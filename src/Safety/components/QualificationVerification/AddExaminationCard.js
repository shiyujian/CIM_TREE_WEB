import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddExaminationCard extends Component {

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
		debugger
		this.props.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

	beforeUploadPicFileA  = (file) => {
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
	beforeUploadPicFileB = (file) => {
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
    		if(this.state.two) {
    			deleteStaticFile({ id: this.state.two.id })
    		}
            this.setState({two: filedata})
            this.props.props.form.setFieldsValue({certificationsB: resp.id ? attachment : null})
		});
		return false;
	}
	beforeUploadPicFileC = (file) => {
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
    		if(this.state.three) {
    			deleteStaticFile({ id: this.state.three.id })
    		}
            this.setState({three: filedata})
            this.props.props.form.setFieldsValue({certificationsC: resp.id ? attachment : null})
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
                <FormItem {...formItemLayout} label="企业负责人" hasFeedback>
					{getFieldDecorator('CEO', {
						rules: [
							{required: true, message: '请输入企业负责人！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入企业负责人"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="A证书编号" hasFeedback>
					{getFieldDecorator('ACode', {
						rules: [
							{required: true, message: '请输入A证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('AValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Select type="text" placeholder="请选择有效期限">
							<Option value="1">一年</Option>
						    <Option value="2">两年</Option>
							<Option value="3">三年</Option>
							<Option value="5">五年</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="A资质证书" hasFeedback>
					{getFieldDecorator('attachment', {
						rules: [
							{required: true, message: '请上传资质证书'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFileA.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加资质证书A
  							</Button>
                        </Upload>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						rules: [
							{required: true, message: '请输入项目经理！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入项目经理"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="B证书编号" hasFeedback>
					{getFieldDecorator('BCode', {
						rules: [
							{required: true, message: '请输入B证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('BValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Select type="text" placeholder="请选择有效期限">
							<Option value="1">一年</Option>
						    <Option value="2">两年</Option>
							<Option value="3">三年</Option>
							<Option value="5">五年</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="资质证书B" hasFeedback>
					{getFieldDecorator('certificationsB', {
						rules: [
							{required: true, message: '请上传资质证书'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFileB.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加资质证书B
  							</Button>
                        </Upload>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="专职安全员" hasFeedback>
					{getFieldDecorator('securityOfficer', {
						rules: [
							{required: true, message: '请输入专职安全员！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入专职安全员"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="C证书编号" hasFeedback>
					{getFieldDecorator('CCode', {
						rules: [
							{required: true, message: '请输入C证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入C证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="有效期限" hasFeedback>
					{getFieldDecorator('CValidityPeriod', {
						rules: [
							{required: true, message: '请选择有效期限'},
						]
					}, {})(
						<Select type="text" placeholder="请选择有效期限">
							<Option value="1">一年</Option>
						    <Option value="2">两年</Option>
							<Option value="3">三年</Option>
							<Option value="5">五年</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="资质证书C" hasFeedback>
					{getFieldDecorator('certificationsC', {
						rules: [
							{ required: true, message: '请上传资质证书' },
						],
						valuePropName: 'fileList',
						getValueFromEvent: this.coverPicFile,
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFileC.bind(this)} onRemove={this.removePicFile.bind(this)}>
							<Button>
								<Icon type="upload" />添加资质证书C
						  </Button>
						</Upload>
						)}
				</FormItem>
			</Form>
		)
	}
}
