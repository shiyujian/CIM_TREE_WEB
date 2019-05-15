import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Notification, Select, Upload, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
import {
    UPLOAD_API,
    STATIC_DOWNLOAD_API,
    SOURCE_API,
    FILE_API
} from '_platform/api';
import E from 'wangeditor';

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;

class NewsAddModal extends Component {
    array = [];
    constructor (props) {
        super(props);
        this.state = {
            content: ''
        };
    }

    componentDidMount () {
        const elem = this.refs.editorElem;
        console.log('elem', elem);
        editor = new E(elem);
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                content: html
            });
        };
        editor.customConfig.zIndex = 900;
        editor.customConfig.uploadImgTimeout = 15000;
        editor.customConfig.uploadImgServer = UPLOAD_API;
        editor.customConfig.uploadFileName = 'a_file';
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
        editor.customConfig.menus = [
            'head', // 标题
            'bold', // 粗体
            'italic', // 斜体
            'underline', // 下划线
            'strikeThrough', // 删除线
            'foreColor', // 文字颜色
            'backColor', // 背景颜色
            'link', // 插入链接
            'list', // 列表
            'justify', // 对齐方式
            // 'quote',  // 引用
            // 'emoticon',  // 表情
            'image', // 插入图片
            'table', // 表格
            'video', // 插入视频
            // 'code',  // 插入代码
            'undo', // 撤销
            'redo' // 重复
        ];
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
                let url = SOURCE_API + '/media/' + result.a_file.split('/media/')[1];
                insertImg(url);
            }
        };
        editor.customConfig.customAlert = function (info) {
            alert(info + ' \n\n如果粘贴无效，请使用图片上传功能进行上传');
        };
        editor.create();
    }

    // 发布新闻
    postData () {
        const {
            actions: { postData, getNewsList, postUploadFiles },
            form: { validateFields },
            fileList = []
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                let resp = values.attachment[0].response;
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content,
                    'content': '',
                    'update_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'tags': [1],
                    'categories': [],
                    'attachment': {
                        'fileList': fileList || []
                    },
                    'publisher': getUser().id,
                    'is_draft': false,
                    'cover': {
                        'misc': resp.misc,
                        'download_url': resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        'a_file': resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        'create_time': resp.create_time,
                        'mime_type': resp.mime_type,
                        'name': resp.name
                    },
                    'source': {
                        'name': values.source
                    }
                };
                let rst = await postData({}, newData);
                if (rst.id) {
                    this.modalClick();
                    Notification.success({
                        message: '发布新闻成功',
                        duration: 3
                    });
                    // 更新新闻列表数据
                    getNewsList({}, {
                        tag: '新闻',
                        is_draft: false
                    });
                    postUploadFiles([]);
                } else {
                    Notification.success({
                        message: '发布新闻失败！',
                        duration: 3
                    });
                }
            }
        });
    }

    // 暂存新闻
    draftDataFunc () {
        const {
            actions: { postData, getDraftNewsList, postUploadFiles },
            form: { validateFields },
            fileList = []
        } = this.props;
        validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            let resp = values.attachment[0].response;
            let newData = {
                'title': values['title'] || '',
                'raw': this.state.content || '',
                'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                'tags': [1],
                'categories': [],
                'attachment': {
                    'fileList': fileList || []
                },
                'publisher': getUser().id,
                'is_draft': true,
                'cover': {
                    // "uid": resp.id,
                    'misc': resp.misc,
                    'download_url': resp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    'a_file': resp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    'create_time': resp.create_time,
                    'mime_type': resp.mime_type,
                    'name': resp.name
                },
                'source': {
                    'name': values.source
                }
            };
            let rst = await postData({}, newData);
            if (rst.id) {
                this.modalClick();
                Notification.success({
                    message: '暂存成功！',
                    duration: 3
                });
                // 更新暂存的新闻列表数据
                getDraftNewsList({}, {
                    tag: '新闻',
                    is_draft: true
                });
                postUploadFiles([]);
            } else {
                Notification.success({
                    message: '暂存失败！',
                    duration: 3
                });
            }
        });
    }
    // modal显示与影藏
    modalClick () {
        const {
            actions: {
                postUploadFiles
            }
        } = this.props;
        postUploadFiles([]);
        this.props.handlePublishNewsModalCancel();
    }
    uploadPropsFile = {
        name: 'a_file',
        multiple: true,
        showUploadList: true,
        action: UPLOAD_API,
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
                    down_file: STATIC_DOWNLOAD_API + '/media' + file.response.download_url.split('/media')[1]
                };
                newFileList = newFileList.concat(newFile);
                postUploadFiles(newFileList);
                Notification.info({
                    message: '上传附件成功',
                    duration: 3
                });
            }
            if (event) {
                let { percent } = event;
                if (percent !== undefined) { this.setState({ progress: parseFloat(percent.toFixed(1)) }); }
            }
        }
    };
    uploadFile = (e) => {
        console.log('e', e);
        if (Array.isArray(e)) {
            return e;
        }
        if (e.file.status === 'removed') {
            return [];
        }
        if (e.file.status === 'done' && !e.file.response.a_file) {
            return [];
        }
        let array = [];
        let length = e.fileList.length - 1;
        if (e.file.status === 'done' && e.file.response.a_file) {
            e.fileList[length].response.name = e.file.name;
        }
        array.push(e.fileList[length]);
        if (e.file.status) {
            return e && array;
        } else {
            return [];
        }
    }
    uploadPropsCover = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data (file) {
            return {
                name: file.fileName,
                a_file: file
            };
        },
        beforeUpload (file) {
            const valid = file.name.indexOf('png') === -1 && file.name.indexOf('jpg') === -1;
            if (valid) {
                Notification.error({
                    message: '只能上传 jpg或者png 文件！',
                    duration: 3
                });
            }
            return !valid;
        }
    };
    coverPicFile = (e) => {
        console.log('e', e);
        if (Array.isArray(e)) {
            return e;
        }
        if (e.file.status === 'removed') {
            return [];
        }
        if (e.file.status === 'done' && !e.file.response.a_file) {
            return [];
        }
        let array = [];
        let length = e.fileList.length - 1;
        if (e.file.status === 'done' && e.file.response.a_file) {
            e.fileList[length].response.name = e.file.name;
        }
        array.push(e.fileList[length]);
        if (e.file.status) {
            return e && array;
        } else {
            return [];
        }
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <Modal
                title={'发布新闻'}
                visible
                onCancel={this.modalClick.bind(this)}
                footer={null}
                width='80%'
            >
                <div>
                    <Form>
                        <Row>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title', {})(
                                        <Input type='text' placeholder='新闻名称' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='附件'>
                                    {getFieldDecorator('attachment1', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.uploadFile
                                    })(
                                        <Upload {...this.uploadPropsFile}
                                        >
                                            <Button>
                                                <Icon type='upload' />上传附件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='封面'>
                                    {getFieldDecorator('attachment', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.coverPicFile,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请上传封面！'
                                            }
                                        ]
                                    })(
                                        <Upload {...this.uploadPropsCover}
                                        >
                                            <Button>
                                                <Icon type='upload' />添加文件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='新闻来源'>
                                    {getFieldDecorator('source', {
                                        rules: [
                                            {
                                                required: false
                                            }
                                        ]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col span={22} offset={1}>
                            <div ref='editorElem' />
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

export default Form.create()(NewsAddModal);
