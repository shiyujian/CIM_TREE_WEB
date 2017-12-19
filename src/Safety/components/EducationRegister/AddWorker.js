import React, {Component} from 'react';
import {Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col} from 'antd';
import {SOURCE_API} from '../../../_platform/api'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddWorker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			train_img:[]
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
			this.forceUpdate()
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
		this.forceUpdate();
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
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="姓名">
							{getFieldDecorator('name', {
								rules: [
									{ required: true, message: '请输入姓名' },
								]
							})(
								<Input type="text" placeholder="请输入姓名" />
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="性别" hasFeedback>
							{getFieldDecorator('gender', {
								rules: [
									{ required: true, message: '请选择性别！' },
								]
							}, {})(
								<Select type="text" placeholder="请选择性别">
									<Option value="男">男</Option>
									<Option value="女">女</Option>
								</Select>
								)}
						</FormItem>
					</Col>
				</Row>
				<Row >
					<Col span={12}>
						<FormItem {...formItemLayout} label="工种">
							{getFieldDecorator('class', {
								rules: [
									{ required: true, message: '请选择工种' },
								],
							}, {})(
								<Input type="text" placeholder="请输入工种"/>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="出生日期" hasFeedback>
							{getFieldDecorator('birthdate', {
								rules: [
									{ required: true, message: '请选择发证日期！' },
								]
							}, {})(
								<DatePicker />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="工龄">
							{getFieldDecorator('workage', {
								rules: [
									{ required: true, message: '请输入工龄' },
								]
							})(
								<Input type="text" placeholder="请输入工龄" />
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="进场时间" hasFeedback>
							{getFieldDecorator('inTime', {
								rules: [
									{ required: true, message: '请选择进场时间！' },
								]
							}, {})(
								<DatePicker />
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="安全教育记录表">
							{getFieldDecorator('train_record', {
								rules: [
									{ required: true, message: '请上传安全教育记录表' },
								],
								valuePropName: 'fileList',
								getValueFromEvent: this.coverPicFile,
							}, {})(
								<Upload beforeUpload={this.beforeUploadPicFile.bind(this,"train_record")} onRemove={this.removePicFile.bind(this)}>
									<Button>
										<Icon type="upload" />添加安全教育记录表
  							</Button>
								</Upload>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="安全教育教材" hasFeedback>
							{getFieldDecorator('train_book', {
								rules: [
									{ required: true, message: '请上传安全教育教材' },
								],
								valuePropName: 'fileList',
								getValueFromEvent: this.coverPicFile,
							}, {})(
								<Upload beforeUpload={this.beforeUploadPicFile.bind(this,"train_book")} onRemove={this.removePicFile.bind(this)}>
									<Button>
										<Icon type="upload" />添加安全教育教材
  							</Button>
								</Upload>
								)}
						</FormItem>
					</Col>
				</Row>
				<Row>
                    <Col span={12}>
						<FormItem {...formItemLayout} label="培训单位">
							{getFieldDecorator('train_unit', {
								rules: [
									{ required: true, message: '请输入培训单位' },
								],
							}, {})(
								<Input type="text" placeholder="请输入培训单位"></Input>
								)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem {...formItemLayout} label="培训日期" hasFeedback>
							{getFieldDecorator('train_date', {
								rules: [
									{ required: true, message: '请选择日期！' },
								]
							}, {})(
								<DatePicker />
								)}
						</FormItem>
					</Col>
				</Row>
                                
                <FormItem {...formItemLayout} label="培训课时（h）">
                    {getFieldDecorator('train_hour', {
                        rules: [
                            { required: true, message: '请输入培训课时' },
							{ validator: this.checkNumber }
                        ],
                    }, {})(
                        <Input placeholder="请输入培训课时" />
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="考核成绩">
                    {getFieldDecorator('scoreone', {
                        rules: [
                            { required: true, message: '请输入分数'},
							{ validator: this.checkNumber }
                        ],
                    }, {})(
                        <Input placeholder="请输入考核成绩" />
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="发证单位">
                    {getFieldDecorator('verify_unit', {
                        rules: [
                            { required: true, message: '请输入发证单位' },
                        ],
                    }, {})(
                        <Input type="text" placeholder="请输入发证单位"></Input>
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="证件编号">
                    {getFieldDecorator('certificate', {
                        rules: [
                            { required: true, message: '请输入证件编号' },
                        ],
                    }, {})(
                        <Input type="text" placeholder="请输入证件编号"></Input>
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="培训主要内容">
                    {getFieldDecorator('train_content', {
                        rules: [
                            { required: false, message: '请输入培训主要内容' },
                        ],
                    }, {})(
                        <Input type="textarea" placeholder="请输入培训主要内容"></Input>
                        )}
                </FormItem>
				<Row>
					<Col span={12}>
						<FormItem {...formItemLayout} label="照片" hasFeedback>
							{getFieldDecorator('train_img', {
								rules: [
									{ required: false, message: '照片' },
								],
								valuePropName: 'fileList',
								getValueFromEvent: this.coverPicFile,
							}, {})(
								<Upload listType="picture-card" beforeUpload={this.beforeUploadPic.bind(this,"train_img")} onRemove={this.handleRemove.bind(this,"train_img")}>
								<div>
									<Icon type="plus"/>
									<div className="ant-upload-text">上传图片</div>
								</div>
								</Upload>
								)}
						</FormItem>		
					</Col>
				</Row>		
			</Form>
		)
	}
}
