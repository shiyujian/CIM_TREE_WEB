import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddInvestigation extends Component {

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
                thumbUrl: resp.a_file
            }];
    		// 删除 之前的文件
    		if(this.state.currInitialData) {
    			deleteStaticFile({ id: this.state.currInitialData.id })
    		}
            this.setState({currInitialData: filedata})
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props.props;

		// 删除 之前的文件
		const picFile = this.state.currInitialData;
		if(picFile) {
			const currentPicId = picFile.id;
			deleteStaticFile({
				id: currentPicId
			},{}, {
				'Authorization': 'Basic aml4aTpqaXhp',
			}).then(resp => {
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
						rules: [
							{required: true, message: '请输入工程名称！'},
						]
					})(
						<Input type="text" placeholder="未获取到工程名称"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						rules: [
							{required: true, message: '请输入施工单位！'},
						]
					})(
						<Input type="text" placeholder="未获取到施工单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						rules: [
							{required: true, message: '请输入项目经理'},
						]
					}, {})(
						<Input type="text" placeholder="未获取到项目经理"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故时间" hasFeedback>
					{getFieldDecorator('time', {
						rules: [
							{required: true, message: '请选择事故时间'},
						]
					}, {})(
						<DatePicker showTime/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故部位" hasFeedback>
					{getFieldDecorator('position', {
						rules: [
							{required: true, message: '请选择事故部位'},
						]
					}, {})(
						<Select  placeholder="必选项">
                                <Option value='部位1'>部位1</Option>
                                <Option value='部位2'>部位2</Option>
                                <Option value='部位3'>部位3</Option>
                        </Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="事故类型" hasFeedback>
					{getFieldDecorator('level', {
						rules: [
							{required: true, message: '请选择事故类型'},
						]
					}, {})(
						<Select  placeholder="必选项">
                                <Option value='一级'>一级</Option>
                                <Option value='二级'>二级</Option>
                        </Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="调查报告" hasFeedback>
					{getFieldDecorator('attachment', {
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: true, message: '请上传调查报告'},
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