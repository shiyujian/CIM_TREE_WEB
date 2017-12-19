import React, {Component} from 'react';
import {Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select,Modal} from 'antd';
import moment from 'moment';
import {SOURCE_API} from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddRegister extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fileArray:[],
			previewVisible: false,
    		previewImage: '',
		};
    }
    
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.props.form.setFieldsValue({livePhotos: e.filelist});
		return e && e.fileList;
	}

	coverFile = (el) => {
		if (Array.isArray(el)) {
			return el;
		}
		this.props.props.form.setFieldsValue({attachment:[el.file]});
		return el && el.fileList;
	}

    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

	beforeUploadPicFile  = (file) => {
		const fileName = file.name;
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
                mime_type:resp.mime_type
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

	removePicFile2 = (file) =>{
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
			if(!resp) {
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
			wrapperCol: {span: 14}
		};
		const {
			form: {getFieldDecorator}
		} = this.props.props;
		const {typeArray,levelArray} = this.props.state;
		let levels = [],types = [];
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
						initialValue: this.props.state.project.name + "--"+this.props.state.unitProject.name,
						rules: [
							{required: true, message: '请选择目录树节点！'},
						]
					})(
						<Input type="text" disabled placeholder="未获取到工程名称"/>
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
				<FormItem {...formItemLayout} label="项目经理" hasFeedback>
					{getFieldDecorator('projectManager', {
						rules: [
							{required: true, message: '请输入项目经理'},
						]
					}, {})(
						<Input type="text"  placeholder="请输入项目经理"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故内容" hasFeedback>
					{getFieldDecorator('riskContent', {
						rules: [
							{required: true, message: '请输入事故内容'},
						]
					}, {})(
						<Input type="text"  placeholder="请输入事故内容"/>
					)}
				</FormItem>
				<FormItem {...formItemLayout} label="事故类型" hasFeedback>
					{getFieldDecorator('type', {
						rules: [
							{required: true, message: '请选择事故类型'},
						]
					}, {})(
						<Select placeholder="选填">
							{types}
						</Select>
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
				<FormItem {...formItemLayout} label="工程部位" hasFeedback>
					{getFieldDecorator('position', {
					}, {})(
						<Select  placeholder="选填">
                                <Option value='部位1'>部位1</Option>
                                <Option value='部位2'>部位2</Option>
                                <Option value='部位3'>部位3</Option>
                        </Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="事故等级" hasFeedback>
					{getFieldDecorator('level', {
						rules: [
							{required: true, message: '请选择事故等级'},
						]
					}, {})(
						<Select  placeholder="请选择事故等级">
                            {levels}
                        </Select>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="轻伤人数" hasFeedback>
					{getFieldDecorator('minorInjury', {
						rules: [
							{required: true, message: '请输入轻伤人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入轻伤人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="重伤人数" hasFeedback>
					{getFieldDecorator('heavyInjury', {
						rules: [
							{required: true, message: '请输入重伤人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入重伤人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="死亡人数" hasFeedback>
					{getFieldDecorator('death', {
						rules: [
							{required: true, message: '请输入死亡人数'},
						]
					}, {})(
						<Input type="text" placeholder="请输入死亡人数"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="经济损失(万元)" hasFeedback>
					{getFieldDecorator('economicLoss', {
						rules: [
							{required: true, message: '请输入经济损失'},
						]
					}, {})(
						<Input type="text" placeholder="请输入经济损失"/>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="事故快报" hasFeedback>
					{getFieldDecorator('attachment', {
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverFile,
						rules: [
							{required: true, message: '请上传事故快报'},
						]
					}, {})(
						<Upload beforeUpload={this.beforeUploadPicFile.bind(this)} onRemove={this.removePicFile.bind(this)}>
                            <Button>
                                <Icon type="upload" />添加文件
							</Button>
                        </Upload>
					)}
				</FormItem>
                <FormItem {...formItemLayout} label="照片" hasFeedback>
					{getFieldDecorator('livePhotos', {
						valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
						rules: [
							{required: false, message: '请上传照片'},
						]
					}, {})(
						<Upload 
						 beforeUpload={this.beforeUploadPicFile2.bind(this)} 
						 listType="picture-card"
						 // onPreview={this.handlePreview.bind(this)}
						 onRemove={this.removePicFile2.bind(this)}>
                            <div>
								<Icon type="plus"/>
								<div className="ant-upload-text">上传图片</div>
							</div>
                        </Upload>
					)}
				</FormItem>
				<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
		          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
		        </Modal>
			</Form>
		)
	}
	handlePreview = (file) => {
	    this.setState({
	      previewImage: file.url || file.thumbUrl,
	      previewVisible: true,
	    });
	}

	handleCancel = () => this.setState({ previewVisible: false })
}