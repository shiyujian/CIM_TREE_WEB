import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select} from 'antd';
import moment from 'moment';
import {SOURCE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddRegister extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fileArray:[],
		};
    }
    
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}

	coverPicFile2 = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({livePhotos: [e.file]});
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
                a_file:resp.a_file,
                thumbUrl: resp.a_file,
                mime_type:resp.mime_type,
            }];
            this.props.props.form.setFieldsValue({attachment: resp.id ? attachment : null})
		});
		return false;
	}

	beforeUploadPicFile2 = (file) => {
		const fileName = file.name;
		//debugger
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile} } = this.props.props;

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
            const livePhotos = {
                uid: file.uid,
                name: resp.name,
                status: 'done',
				thumbUrl: SOURCE_API + resp.a_file,
				a_file:resp.a_file,
				mime_type:resp.mime_type
            };
            debugger
    		let fileArray = this.state.fileArray;
			fileArray.push(livePhotos);
			this.setState({fileArray:fileArray});
            this.props.props.form.setFieldsValue({livePhotos:this.state.fileArray})
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
		const {typeArray,levelArray} = this.props.state;
		let attr = this.props.state.record.attachment;
		attr.uid = 1;
		let levels = [],types = [];
		let images = this.props.state.record.images;
		for(let i=0;i<images.length;i++){
			images[i].uid = i;
			images[i].thumbUrl = SOURCE_API + images[i].a_file;
		}
		debugger
		for(let i=0;i<typeArray.length;i++){
			types.push(<Option value={typeArray[i].id}>{typeArray[i].name}</Option>);
		}
		for(let i=0;i<levelArray.length;i++){
			levels.push(<Option value={levelArray[i].id}>{levelArray[i].name}</Option>);
		}
		return (
			<Form>
				<FormItem {...formItemLayout} label="工程名称" hasFeedback>
					{getFieldDecorator('projectName', {
						initialValue: this.props.state.record.projectName,
						rules: [
							{required: true, message: '请输入工程名称！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到工程名称"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="施工单位" hasFeedback>
					{getFieldDecorator('constructionUnit', {
						initialValue: this.props.state.record.constructionUnit,
						rules: [
							{required: true, message: '请输入施工单位！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到施工单位"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						initialValue: this.props.state.record.projectManager,
						rules: [
							{required: true, message: '请输入项目经理'},
						]
					}, {})(
						<Input type="text" placeholder="未获取到项目经理"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故内容" hasFeedback>
					{getFieldDecorator('riskContent', {
						initialValue: this.props.state.record.riskContent,
						rules: [
							{required: true, message: '请输入事故内容'},
						]
					}, {})(
						<Input type="text" />
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故时间" hasFeedback>
					{getFieldDecorator('time', {
						initialValue: moment(this.props.state.record.time),
						rules: [
							{required: true, message: '请选择事故时间'},
						]
					}, {})(
						<DatePicker showTime/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="工程部位" hasFeedback>
					{getFieldDecorator('position', {
						initialValue: this.props.state.record.position,
						rules: [
						]
					}, {})(
						<Select  placeholder="选填">
                                <Option value='部位1'>部位1</Option>
                                <Option value='部位2'>部位2</Option>
                                <Option value='部位3'>部位3</Option>
                        </Select>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故类型" hasFeedback>
					{getFieldDecorator('type', {
						initialValue: this.props.state.record.type,
						rules: [
							{required: true, message: '请选择事故类型'},
						]
					}, {})(
						<Select placeholder="选填">
							{types}
						</Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="事故等级" hasFeedback>
					{getFieldDecorator('level', {
						initialValue: this.props.state.record.level,
						rules: [
							{required: true, message: '选择事故等级'},
						]
					}, {})(
						<Select  placeholder="必选项">
                            {levels}
                        </Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="轻伤人数" hasFeedback>
					{getFieldDecorator('minorInjury', {
						initialValue: this.props.state.record.minorInjury,
						rules: [
							{required: true, message: '请输入轻伤人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入轻伤人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="重伤人数" hasFeedback>
					{getFieldDecorator('heavyInjury', {
						initialValue: this.props.state.record.heavyInjury,
						rules: [
							{required: true, message: '请输入重伤人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入重伤人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="死亡人数" hasFeedback>
					{getFieldDecorator('death', {
						initialValue: this.props.state.record.death,
						rules: [
							{required: true, message: '请输入死亡人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入死亡人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="经济损失" hasFeedback>
					{getFieldDecorator('economicLoss', {
						initialValue: this.props.state.record.economicLoss,
						rules: [
							{required: true, message: '请输入经济损失'},
						]
					}, {})(
						<Input type="text" placeholder="请输入经济损失"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="安全责任书" hasFeedback>
					{getFieldDecorator('attachment', {
						initialValue: [attr],
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: false, message: '请上传安全责任书'},
						]
					}, {})(
						<Upload 
						 beforeUpload={this.beforeUploadPicFile.bind(this)}>
                            <Button>
                                <Icon type="upload" />添加文件
							</Button>
                        </Upload>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="照片" hasFeedback>
					{getFieldDecorator('livePhotos', {
						initialValue: images,
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile2,
						rules: [
							{required: false, message: '请上传照片'},
						]
					}, {})(
						<Upload 
						 beforeUpload={this.beforeUploadPicFile2.bind(this)} 
						 listType="picture-card">
                            <div>
								<Icon type="plus"/>
								<div className="ant-upload-text">上传图片</div>
							</div>
                        </Upload>
					)}
				</FormItem>
			</Form>
		)
	}
}