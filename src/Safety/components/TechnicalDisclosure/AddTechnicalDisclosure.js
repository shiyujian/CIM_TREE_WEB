import React, { Component } from 'react';
import { Input, Form, Spin, message, Upload, Button, Icon, DatePicker, Select, Col, Row } from 'antd';
import moment from 'moment';
import {SOURCE_API} from '../../../_platform/api'
const FormItem = Form.Item;
const Option = Select.Option;

export default class AddTechnicalDisclosure extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images:[],
            selectOptions:null,//下拉选择框
        };
    }
    componentDidMount(){
        this.initOptions();
    }
       //初始化下拉框选项
	async initOptions(){
        const {actions:{ getWkByCode }} = this.props.props
        let selectOptions = []
        if(this.props.state.code){
            let rst = await getWkByCode({code:this.props.state.code})
            rst.children_wp.map(item => {
                let oj = JSON.stringify(item)
                selectOptions.push(<Option value={oj}>{item.name}</Option>)
            })
            this.setState({project_unit:rst,selectOptions})
        }else{
            return ''
        }
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
                <FormItem {...formItemLayout} label="专项方案" hasFeedback>
                    {getFieldDecorator('plan', {
                        initialValue: '',
                        rules: [
                            { required: true, message: `请输入专项方案名称` },
                        ]
                    })(
                        <Input placeholder={`请输入专项方案名称`} />
                        )}
                </FormItem>
                <FormItem {...formItemLayout} label={`分部分项`} hasFeedback >
                    {
                        getFieldDecorator('location', {
                            rules: [
                                { required: true, message: `请选择分部分项` }
                            ],
                        })(
                            <Select labelInValue  placeholder={`请选择分部分项`} >
                                {
                                    this.state.selectOptions
                                }
                            </Select>
                            )
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`工种`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('work', {
                            rules: [
                                { required: true, message: `请输入工种` }
                            ],
                        })(
                            <Input placeholder={`请输入工种`} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`交底人`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('disclosure_person', {
                            rules: [
                                { required: true, message: `请输入交底人` }
                            ],
                        })(
                            <Input placeholder={`请输入交底人`} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`交底层级`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('disclosure_level', {
                            rules: [
                                { required: true, message: `请选择交底层级` }
                            ],
                        })(
                            <Input placeholder={`请输入交底层级`} />
                            )
                    }
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={`交底日期`}
                    hasFeedback
                >
                    {
                        getFieldDecorator('disclosure_date', {
                            rules: [
                                { required: true, message: `请选择交底日期` }
                            ],
                        })(
                            <DatePicker  >
                            </DatePicker>
                            )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="安全交底记录表" hasFeedback>
                    {getFieldDecorator('disclosure_chart', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.coverPicFile,
                        rules: [
                            { required: true, message: '请上传安全交底记录表' },
                        ]
                    }, {})(
                        <Upload beforeUpload={this.beforeUploadPicFile.bind(this,"disclosure_chart")} onRemove={this.removePicFile.bind(this)}>
                            <Button>
                                <Icon type="upload" />添加文件
							</Button>
                        </Upload>
                        )}
                </FormItem>
                <Row>
					<Col span={24}>
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
					</Col>
				</Row>
            </Form>
        )
    }
}