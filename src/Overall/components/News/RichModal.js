import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, message,Select,Upload,Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '../../../_platform/auth';
import { base, STATIC_DOWNLOAD_API, SOURCE_API,FILE_API } from '../../../_platform/api';
import E from 'wangeditor'
import { DEPARTMENT } from '_platform/api';

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;

class RichModal extends Component {
	array = [];
    constructor(props) {
		super(props);
        this.state = {
            content: "",
        }
	}
	componentDidUpdate(){
	}

    componentDidMount() {
		DEPARTMENT.map(item =>{
			this.array.push(<Option value={item.name}>{item.name}</Option>)
		})
        const elem = this.refs.editorElem;
        editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                content: html
            })
        };
        editor.customConfig.zIndex = 900;
        editor.customConfig.uploadImgTimeout = 15000;
        editor.customConfig.uploadImgServer = base + "/service/fileserver/api/user/files/";
        editor.customConfig.uploadFileName = 'a_file';
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
        editor.customConfig.uploadImgHooks = {
            before: function (xhr, editor, files) {
            },
            success: function (xhr, editor, result) {
            },
            fail: function (xhr, editor, result) {
            },
            error: function (xhr, editor) {
            },
            timeout: function (xhr, editor) {
            },
            customInsert: function (insertImg, result, editor) {
                let url = SOURCE_API + "/media/" + result.a_file.split('/media/')[1]
                insertImg(url)
            }
        };
        editor.customConfig.customAlert = function (info) {
            alert(info + ' \n\n如果粘贴无效，请使用图片上传功能进行上传');
        }
        editor.create();

        const {
			toggleData: toggleData = {
            type: 'NEWS',
            status: 'ADD',
            visible: false,
            editData: null
        },
            form: { setFieldsValue }
		} = this.props;
        if (toggleData.type === 'NEWS' && toggleData.status === 'EDIT') {
            this.setState({
                content: toggleData.editData.raw
            });
            editor.txt.html(toggleData.editData.raw)
            setFieldsValue({
                'title': toggleData.editData.title || '',
                'abstract': toggleData.editData.abstract
            })
        }
    }

    //modal显示与影藏
    modalClick() {
        const { actions: { toggleModal } } = this.props;
        toggleModal({
            type: null,
            status: null,
            visible: false,
        })
    }

   //发布新闻
	postData() {
		const {
			actions: {postData, getNewsList, patchData, getDraftNewsList,postUploadFiles},
			form: {validateFields},
			toggleData: toggleData = {
				type: 'NEWS',
				status: 'ADD',
				visible: false,
				editData: null
			},
			fileList = []
		} = this.props;
		validateFields((err, values) => {
			if (!err) {
				//判断是发布新闻还是更新新闻
				if (toggleData.status === 'ADD') {
					debugger
					let resp = values.attachment.file.response;
					let newData = {
						"title": values['title'] || '',
						"org": values['org'] || '',
						"raw": this.state.content,
						"content": "",
						"attachment": {},
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"tags": [1],
						"categories": [4],
						"attachment": {
							"fileList": fileList || [],
						},
						"publisher": getUser().id,
						"is_draft": false,
						"cover":{
							"uid": resp.id,
							"misc": resp.misc,
							"download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
							"a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
							"create_time": resp.create_time,
							"mime_type": resp.mime_type,
							"name":resp.name
						},
						"source":{
							"name":values.source
						}
					};
					postData({}, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('发布新闻成功');
								//更新新闻列表数据
								getNewsList({
									user_id: getUser().id
								});
								postUploadFiles([]);
							}
						})
				} else if (toggleData.status === 'EDIT') {
					let resp = values.attachment.file.response;
					let newData = {
						"title": values['title'] || '',
						"org": values['org'] || '',
						"raw": this.state.content,
						"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
						"categories": [4],
						"attachment": {
							"fileList": fileList || [],
						},
						"is_draft": false,
						"cover":{
							"uid": resp.id,
							"misc": resp.misc,
							"download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
							"a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
							"create_time": resp.create_time,
							"mime_type": resp.mime_type,
							"name":resp.name
						},
						"source":{
							"name":values.source
						}
					};
					patchData({pk: toggleData.editData.id}, newData)
						.then(rst => {
							if (rst.id) {
								this.modalClick();
								message.success('编辑新闻成功');
								//更新新闻列表数据
								getNewsList({
									user_id: getUser().id
								});
								getDraftNewsList({
									user_id: getUser().id
								});
								postUploadFiles([]);
							}
						})
				}
			}
		});
	}

	//暂存新闻
	draftDataFunc() {
		const {
			actions: {postData, patchData, getNewsList, getDraftNewsList,postUploadFiles},
			form: {validateFields},
			toggleData: toggleData = {
				status: 'ADD',
				editData: null,
			},
			fileList = []
		} = this.props;
		//判断暂存的是新增的还是编辑的暂存
		//编辑暂存的
		if (toggleData.status === 'EDIT') {
			let resp = values.attachment.file.response;
			validateFields((err, values) => {
				let newData = {
					"title": values['title'] || '',
					"org": values['org'] || '',
					"raw": this.state.content,
					"categories": [4],
					"update_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"is_draft": true,
					"attachment": {
						"fileList": fileList || [],
					},
					"cover":{
						"uid": resp.id,
						"misc": resp.misc,
						"download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"create_time": resp.create_time,
						"mime_type": resp.mime_type,
						"name":resp.name
					},
					"source":{
						"name":values.source
					}
				};
				patchData({pk: toggleData.editData.id}, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功');
							//更新暂存的新闻列表数据
							getNewsList({
								user_id: getUser().id
							});
							getDraftNewsList({
								user_id: getUser().id
							});
							postUploadFiles([]);
						}
					})
			})
		} else if (toggleData.status === 'ADD') {
			validateFields((err, values) => {
				let resp = values.attachment.file.response;
				let newData = {
					"title": values['title'] || '',
					"org": values['org'] || '' ,
					"raw": this.state.content || '',
					"pub_time": moment().format('YYYY-MM-DD HH:mm:ss'),
					"tags": [1],
					"categories": [4],
					"attachment": {
						"fileList": fileList || [],
					},
					"publisher": getUser().id,
					"is_draft": true,
					"cover":{
						"uid": resp.id,
						"misc": resp.misc,
						"download_url": resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"a_file": resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
						"create_time": resp.create_time,
						"mime_type": resp.mime_type,
						"name":resp.name
					},
					"source":{
						"name":values.source
					}
				};
				postData({}, newData)
					.then(rst => {
						if (rst.id) {
							this.modalClick();
							message.success('暂存成功！');
							//更新暂存的新闻列表数据
							getDraftNewsList({
								user_id: getUser().id
							});
							postUploadFiles([]);
						}
					})
			})
		}
	}

    modalClick() {
		const { actions: { toggleModal, postUploadFiles } } = this.props;
		postUploadFiles([]);
		toggleModal({
			type: null,
			status: null,
			visible: false,
		})
	}
	coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
        }
		if (e.file.status === 'done' && !e.file.response.a_file) {
			return []
        }
        let array = [];
        let length = e.fileList.length - 1;
        if(e.file.status === 'done' && e.file.response.a_file){
            e.fileList[length].response.name = e.file.name;
        }
        array.push(e.fileList[length])
		return e && array;
	}
	uploadProps1 = {
		name: 'a_file',
		multiple: true,
		showUploadList: true,
		action: base + "/service/fileserver/api/user/files/",
		beforeUpload: () => {
			this.setState({ progress: 0 });
		},
		onChange: ({ file, event }) => {
			const status = file.status;
			if (status === 'done') {
				const { actions: { postUploadFiles }, fileList = [] } = this.props;
				let newFileList = fileList;
				let newFile = {
					name: file.name,
					down_file: STATIC_DOWNLOAD_API + "/media" + file.response.download_url.split('/media')[1]
				};
				newFileList = newFileList.concat(newFile);
				postUploadFiles(newFileList)
				message.info('上传附件成功');
			}
			if (event) {
				let { percent } = event;
				if (percent !== undefined)
					this.setState({ progress: parseFloat(percent.toFixed(1)) });
			}
		},
	};

	uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            const valid = file.name.indexOf("png") === -1 && file.name.indexOf("jpg") === -1;
            if (valid) {
                message.error('只能上传 jpg或者png 文件！');
            }
            return !valid;
        },
    };

    render() {
        const {
			form: { getFieldDecorator },
            toggleData: toggleData = {
                type: 'NEWS',
                status: 'ADD',
                visible: false,
            }
		} = this.props;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        return (
            <Modal
			title={toggleData.type === 'NEWS' ? (
				toggleData.status === 'ADD' ? '发布新闻' : '编辑新闻'
			) : '发布新闻'}
            visible={toggleData.visible}
            onOk={this.modalClick.bind(this)}
            onCancel={this.modalClick.bind(this)}
            footer={null}
            width="80%"
            >
                <div>
                    <Form>
                        <Row>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label="名称">
                                    {getFieldDecorator('title', {})(
                                        <Input type="text" placeholder="新闻名称" />
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label="发布单位">
                                    {getFieldDecorator('org', {})(
                                        (<Select allowClear>
											{
												this.array
											}
										</Select>)
                                    )}
                                </FormItem>
							</Col>
							<Col span={2}>
								<Dragger {...this.uploadProps1}>
									<Button >
										<Icon type='upload' />上传
									</Button>
								</Dragger>
							</Col>
						</Row>
						<Row>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label="封面">
                                    {getFieldDecorator('attachment', {
										rules: [
											{
												required: true,
												message: '请上传封面！',
											}
										],
									})(
                                        <Upload {...this.uploadProps}
										>
											<Button>
												<Icon type="upload" />添加文件
												</Button>
										</Upload>
                                        )}
                                </FormItem>
							</Col>
							<Col span={8} offset={1}>
								<FormItem {...formItemLayout} label="新闻来源">
									{getFieldDecorator('source', {
										rules: [
											{
												required: false,
											}
										],
									})(
										<Input />
										)}
								</FormItem>
							</Col>
						</Row>
                    </Form>
                    <Row>
                        <Col span={22} offset={1}>
                            <div ref="editorElem"></div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col span={24} offset={10} >
                            <Button type='primary' onClick={this.modalClick.bind(this)}>取消</Button>
							<Button style={{ marginLeft: 20 }} type='primary' onClick={this.draftDataFunc.bind(this)}>暂存</Button>
							<Button style={{ marginLeft: 20 }} type='primary' onClick={this.postData.bind(this)}>发布</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>

        );
    }
}

export default Form.create()(RichModal)