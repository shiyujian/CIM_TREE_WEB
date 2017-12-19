import React, { Component } from 'react';
import { Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col, InputNumber  } from 'antd';
import {SOURCE_API} from '../../../_platform/api'
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            check_report:[],
            images:[]
        };
    }

    coverPicFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        this.props.props.form.setFieldsValue({ attachment: [e.file] });
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
            const attachment = {
                size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
				thumbUrl: SOURCE_API + resp.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type
            };
            this.state[type].push(attachment);
			let files = {};
			files[type] = this.state[type]
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
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
			form: { getFieldDecorator }
		} = this.props.props;
        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="工程名称">
                            {getFieldDecorator('projectName', {
                                rules: [
                                    { required: true, message: '请输入工程名称' },
                                ],
                                initialValue: this.props.state.unit_name
                            })(
                                <Input type="text" placeholder="请输入工程名称" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="项目负责人" hasFeedback>
                            {getFieldDecorator('responsor', {
                                rules: [
                                    { required: true, message: '请输入项目负责人' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入项目负责人" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="专职安全员">
                            {getFieldDecorator('safety_guard', {
                                rules: [
                                    { required: true, message: '请输入专职安全员' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入专职安全员" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施名称">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请选择设备设施名称' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施名称" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备类型">
                            {getFieldDecorator('device_type', {
                                rules: [
                                    { required: true, message: '请输入设备类型' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备类型" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="规格型号">
                            {getFieldDecorator('device_spec', {
                                rules: [
                                    { required: true, message: '请输入规格型号' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入规格型号"/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="许可证号">
                            {getFieldDecorator('licence', {
                                rules: [
                                    { required: true, message: '请输入许可证号' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入许可证号" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="合格证号">
                            {getFieldDecorator('certificate', {
                                rules: [
                                    { required: true, message: '请输入合格证号' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入合格证号" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="检查验收报告结论">
                            {getFieldDecorator('conclusion', {
                                rules: [
                                    { required: true, message: '请输入检查验收报告结论' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入检查验收报告结论" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="数量">
                            {getFieldDecorator('number', {
                                rules: [
                                    { required: true, message: '请输入数量' },
                                ],
                            }, {})(
                                <InputNumber min={0} placeholder="请输入数量" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收日期" hasFeedback>
                            {getFieldDecorator('accept_date', {
                                rules: [
                                    { required: true, message: '请选择日期！' },
                                ]
                            }, {})(
                                <DatePicker />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收人">
                            {getFieldDecorator('acceptor', {
                                rules: [
                                    { required: true, message: '请输入验收人' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入验收人" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                
                <FormItem {...formItemLayout} label="检查报告" hasFeedback>
                    {getFieldDecorator('check_report', {
                        initialValue: '',
                        rules: [
                            { required: true, message: '请上传检查报告' },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
                    }, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this,"check_report")} onRemove={this.handleRemove.bind(this,"check_report")}>
                            <Button>
                                <Icon type="upload" />上传检查报告
                            </Button>
                        </Upload>
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="照片" hasFeedback>
                    {getFieldDecorator('images', {
                        rules: [
                            { required: false, message: '照片' },
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
