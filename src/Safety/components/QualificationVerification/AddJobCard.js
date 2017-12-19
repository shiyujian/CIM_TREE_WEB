import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddJobCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
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
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
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
				<FormItem {...formItemLayout} label="姓名" hasFeedback>
					{getFieldDecorator('name', {
						rules: [
							{required: true, message: '请输入姓名'},
						]
					})(
                        <Input type="text" placeholder="请输入姓名"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="性别" hasFeedback> 
					{getFieldDecorator('gender', {
						rules: [
							{required: true, message: '请选择性别！'},
						]
					}, {})(
                        <Select type="text" placeholder="请选择性别">
							<Option value="男">男</Option>
						    <Option value="女">女</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="工种" hasFeedback>
					{getFieldDecorator('class', {
						rules: [
							{required: true, message: '请选择工种'},
						],
					}, {})(
                        <Input type="text" placeholder="请填写工种"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="发证部门" hasFeedback>
					{getFieldDecorator('department', {
						rules: [
							{required: true, message: '请输入发证部门'},
						],
					}, {})(
                        <Input type="text" placeholder="请输入发证部门"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="发证日期" hasFeedback> 
					{getFieldDecorator('date', {
						rules: [
							{required: true, message: '请选择发证日期！'},
						]
					}, {})(
						<DatePicker />
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="证书编号" hasFeedback> 
					{getFieldDecorator('code', {
						rules: [
							{required: true, message: '请输入证书编号！'},
						]
					}, {})(
						<Input type="text" placeholder="请输入证书编号"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="复审期限" hasFeedback> 
					{getFieldDecorator('deadline', {
						rules: [
							{required: true, message: '请选择复审期限！'},
						]
					}, {})(
						<Select type="text" placeholder="请选择复审期限">
							<Option value="一年">一年</Option>
						    <Option value="两年">两年</Option>
							<Option value="三年">三年</Option>
							<Option value="五年">五年</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="上岗证" hasFeedback>
					{getFieldDecorator('attachment', {
						rules: [
							{required: true, message: '请上传上岗证'},
						],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
					}, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this)} onRemove={this.removePicFile.bind(this)}>
	                        <Button>
	                           <Icon type="upload" />添加上岗证
  							</Button>
                        </Upload>
					)}
				</FormItem>
			</Form>
		)
	}
}
