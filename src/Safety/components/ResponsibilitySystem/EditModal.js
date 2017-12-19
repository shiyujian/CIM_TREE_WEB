import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

export default class EditModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
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
		debugger
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
                uid: file.uid,
                name: resp.name,
                status: 'done',
                url: resp.a_file,
				thumbUrl: resp.a_file,
				a_file: resp.a_file,
				download_url: resp.download_url,
				mime_type: resp.mime_type
            }];
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		debugger
		const attachment = this.props.state.record.attachment;
		attachment.uid = 1;
		return (
			<Form>
				<FormItem {...formItemLayout} label="工程名称" hasFeedback>
					{getFieldDecorator('projectName', {
						initialValue: this.props.props.project.name,
						rules: [
							{required: true, message: '请选择单位工程'},
						]
					})(
						<Input type="text" readOnly placeholder="未获取到单位工程"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						initialValue: this.props.props.construct.name,
						rules: [
							{required: true, message: '该单位工程无施工单位，请联系管理员！'},
						]
					})(
						<Input type="text" readOnly placeholder="未获取到施工单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="责任人" hasFeedback>
					{getFieldDecorator('responsible', {
						initialValue: this.props.state.record.responsible,
						rules: [
							{required: true, message: '请输入责任人'},
						]
					}, {})(
						<Input type="text" placeholder="请输入责任人"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="职务" hasFeedback>
					{getFieldDecorator('duties', {
						initialValue: this.props.state.record.duties,
						rules: [
							{required: true, message: '请输入职务'},
						]
					}, {})(
						<Input type="text" placeholder="请输入职务"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="职责" hasFeedback>
					{getFieldDecorator('responsibilities', {
						initialValue: this.props.state.record.responsibilities,
						rules: [
							{required: true, message: '请输入职责'},
						]
					}, {})(
						<Input type="text" placeholder="请输入职责"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="安全责任书" hasFeedback>
					{getFieldDecorator('attachment', {
						initialValue: [attachment],
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: true, message: '请上传安全责任书'},
						]
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFile.bind(this)}>
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
