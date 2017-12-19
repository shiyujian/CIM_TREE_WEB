import React, { Component } from 'react';
import { Input, Form, Spin, Select, Upload, Icon, Button, message, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import {SOURCE_API} from '../../../_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddAcceptance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detect_chart:[],
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
    beforeUploadFile = (type,file) => {
		const fileName = file.name;
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
                        <FormItem {...formItemLayout} label="施工单位" hasFeedback>
                            {getFieldDecorator('construction_org', {
                                rules: [
                                    { required: true, message: '请输入施工单位' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入施工单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="施工单位负责人" hasFeedback>
                            {getFieldDecorator('construction_per', {
                                rules: [
                                    { required: true, message: '请输入施工单位负责人' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入施工单位负责人" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="监理单位">
                            {getFieldDecorator('supervising_org', {
                                rules: [
                                    { required: true, message: '请输入监理单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入监理单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施类型" hasFeedback>
                            {getFieldDecorator('device_type', {
                                rules: [
                                    { required: false, message: '请输入设备设施类型' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施类型" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备设施名称">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: '请输入设备设施名称' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入设备设施名称" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="设备编号" hasFeedback>
                            {getFieldDecorator('code', {
                                rules: [
                                    { required: false, message: '请输入设备编号' },
                                ]
                            }, {})(
                                <Input type="text" placeholder="请输入设备编号" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="分包单位">
                            {getFieldDecorator('sub_contrator_org', {
                                rules: [
                                    { required: false, message: '请选择分包单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请选择分包单位"/>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="分包单位责任人">
                            {getFieldDecorator('sub_contrator_per', {
                                rules: [
                                    { required: false, message: '请选择分包单位责任人' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请选择分包单位责任人"/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="安装单位">
                            {getFieldDecorator('install_org', {
                                rules: [
                                    { required: false, message: '请输入安装单位' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入安装单位" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="安装日期" hasFeedback>
                            {getFieldDecorator('install_date', {
                                rules: [
                                    { required: true, message: '请选择安装日期！' },
                                ]
                            }, {})(
                                <DatePicker />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="出租单位">
                            {getFieldDecorator('rent_org', {
                                rules: [
                                    { required: false, message: '请输入出租单位' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入出租单位" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="监测单位">
                            {getFieldDecorator('check_org', {
                                rules: [
                                    { required: false, message: '请输入监测单位' },
                                ],
                            }, {})(
                                <Input type="text" placeholder="请输入监测单位" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收结论">
                            {getFieldDecorator('check_conclusion', {
                                rules: [
                                    { required: false, message: '请输入验收结论' },
                                ]
                            })(
                                <Input type="text" placeholder="请输入验收结论" />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="验收日期" hasFeedback>
                            {getFieldDecorator('accept_date', {
                                rules: [
                                    { required: true, message: '请选择验收日期！' },
                                ]
                            }, {})(
                                <DatePicker />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} label="验收表">
                    {getFieldDecorator('check_chart', {
                        rules: [
                            { required: true, message: '请上传验收表' },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
                    }, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this,"check_chart")} onRemove={this.removePicFile.bind(this)}>
                            <Button>
                                <Icon type="upload" />添加验收表
  							</Button>
                        </Upload>
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label="检测材料表" hasFeedback>
                    {getFieldDecorator('detect_chart', {
                        initialValue: '',
                        rules: [
                            { required: false, message: '请上传检测材料表' },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
                    }, {})(
                        <Upload beforeUpload={this.beforeUploadFile.bind(this,"detect_chart")} onRemove={this.handleRemove.bind(this,"detect_chart")}>
                            <Button>
                                <Icon type="upload" />添加材料表
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
