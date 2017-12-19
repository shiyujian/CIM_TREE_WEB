import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message, Row, Col} from 'antd';
import {SOURCE_API} from '../../../_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;


export default class AddActionRecord extends Component {

	constructor(props) {
		super(props);
		this.state = {
			images:[],
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

	beforeUploadPic = (type,file) => {
		const fileName = file.name;
		if(/.+?\.png/.test(fileName)|| /.+?\.jpg/.test(fileName)|| /.+?\.bmp/.test(fileName)|| /.+?\.gif/.test(fileName) || /.+?\.svg/.test(fileName)){
			
		}else{
			message.error('请上传常见格式的图片');
			return false;
		}
		// 上传图片到静态服务器
		const {actions:{uploadStaticFile}} = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            const livePhotos = {
				id:resp.id,
                uid: file.uid,
                name: resp.name,
                status: 'done',
				a_file:filedata.a_file,
				thumbUrl: SOURCE_API + resp.a_file,
				download_url:filedata.a_file,
				mime_type:resp.mime_type
            };
			this.state[type].push(livePhotos);
			//this.forceUpdate()
			let files = {};
			files[type] = this.state[type]
            this.props.props.form.setFieldsValue(files)
		});
		return false;
	}
	beforeUploadPicFile  = (type,file) => {
		const fileName = file.name;
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
                url: filedata.a_file,
				thumbUrl: SOURCE_API + resp.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type
            }];
    		// 删除 之前的文件
    		if(this.state.currInitialData) {
    			deleteStaticFile({ id: this.state.currInitialData.id })
    		}
			this.setState({currInitialData: filedata})
			let files = {};
			files[type] = attachment
            this.props.props.form.setFieldsValue(files)
		});
		return false;
	}
	handleRemove = (type,file) => {
		const {actions:{deleteStaticFile}} = this.props.props;
		deleteStaticFile({id:file.id});
		let fileList = [];
		let fileArray = this.state[type];
		for(let i = fileArray.length-1; i >= 0; i--){
			if(fileArray[i].id !== file.id){
				fileList.push(fileArray[i])
			}
		}
		this.state[type] = fileList;
		//this.forceUpdate();
		let img = {};
		img[type] = fileList
		this.props.props.form.setFieldsValue(img)
	}
	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props.props;
		deleteStaticFile({id:file.uid});
		return true;
    }
        //自定义校验规则：数字
	checkNumber = (rule, value, callback) => {
		const form = this.props.props.form;
		let check = 1 * value;
		if (value && isNaN(check)) {
		  callback('请输入数字');
		} else {
		  callback();
		}
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
				<Row >
					<Col span={12}>
						<FormItem {...formItemLayout} label="操作班组" hasFeedback>
							{getFieldDecorator('team', {
								rules: [
									{ required: true, message: '请输入操作班组' },
								],
							}, {})(
								<Input type="text" placeholder="请输入操作班组"/>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="组长" hasFeedback>
							{getFieldDecorator('team_leader', {
								rules: [
									{ required: true, message: '请输入组长' },
								]
							}, {})(
								<Input type="text" placeholder="请输入组长"/>
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="作业人数" hasFeedback>
							{getFieldDecorator('worker_number', {
								rules: [
									{ required: true, message: '请输入作业人数' },
									{ validator: this.checkNumber }
								]
							})(
								<Input type="text" placeholder="请输入作业人数" />
								)}
						</FormItem>
					</Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="作业部位" hasFeedback>
                            {getFieldDecorator('work_location', {
                                rules: [
                                    { required: true, message: '请填写作业部位' },
                                ],
                            }, {})(
                                <Input placeholder="请填写作业部位"/>
                                )}
                        </FormItem>
                    </Col>
				</Row>
                <FormItem {...formItemLayout} label="培训主要内容" hasFeedback>
                    {getFieldDecorator('work_content', {
                        rules: [
                            { required: false, message: '请输入培训主要内容' },
                        ],
                    }, {})(
                        <Input type="textarea" placeholder="请输入培训主要内容"></Input>
                        )}
                </FormItem>
				<FormItem {...formItemLayout} label="班组班前活动记录表" hasFeedback>
						{getFieldDecorator('record_chart', {
							initialValue: '',
							rules: [
								{ required: true, message: '请上传班组班前活动记录表' },
							],
							valuePropName: 'fileList',
							getValueFromEvent: this.coverPicFile,
						}, {})(
							<Upload beforeUpload={this.beforeUploadPicFile.bind(this,"record_chart")} onRemove={this.removePicFile.bind(this)}>
								<Button>
									<Icon type="upload" />添加班组班前活动记录表
								</Button>
							</Upload>
							)}
					</FormItem>
					<FormItem {...formItemLayout} label="照片" hasFeedback>
						{getFieldDecorator('images', {
							rules: [
								{ required: false, message: '请上传照片' },
							],
							valuePropName: 'fileList',
							getValueFromEvent: this.coverPicFile,
						}, {})(
							<Upload listType="picture-card" beforeUpload={this.beforeUploadPic.bind(this,"images")} onRemove={this.handleRemove.bind(this,"images")}>
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