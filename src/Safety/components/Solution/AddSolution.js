import React, {Component} from 'react';

import {Input, Form, Spin,Upload,Icon,Button,Select,message} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default class AddSolution extends Component {

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
			this.props.props.actions.setUploadFile(resp);
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
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
            this.props.props.form.setFieldsValue({attachment: resp.id ? [attachment] : null})
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
		return (
			<Form>
				<FormItem {...formItemLayout} label="专项方案">
					{getFieldDecorator('solution', {
						initialValue: this.props.state.solution,
						rules: [
							{required: true, message: '请填写！'},
						]
					})(
						<Input type="text"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="工程名称">
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.unitProject.name,
						rules: [
							{required: true, message: '未获取到工程名称！'},
						]
					})(
						<Input type="text" disabled/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						initialValue: this.props.state.construct.name,
						rules: [
							{required: true, message: '该单位工程无施工单位，请联系管理员！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到施工单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="分部分项">
					{getFieldDecorator('portion', {
						rules: [
							{required: true, message: '请选择分部分项！'},
						]
					}, {})(
						<Select type="text" placeholder="请选择分部分项！">
							<Option value="项目部">项目部</Option>
						    <Option value="研发部">研发部</Option>
						    <Option value="信息化部">信息化部</Option>
						    <Option value="应用部">应用部</Option>
						</Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="上传文件">
					{getFieldDecorator('attachment', {
						rules: [
							{required: true, message: '请上传一个文件！'},
						],
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
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
