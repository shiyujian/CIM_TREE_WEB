import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Notification, Spin, Upload, Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
import {
    UPLOAD_API,
    STATIC_DOWNLOAD_API,
    STATIC_PREVIEW_API,
    SOURCE_API,
    FILE_API
} from '_platform/api';
import E from 'wangeditor';

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;
// 上传附件
const uploadFileURL = `http://39.97.163.176:6510/ShapeUploadHandler.ashx?layername=1111`;
// const uploadFileURL = `http://39.105.221.187:6530/service/fileserver/api/user/files/`;
class NewsAddModal extends Component {
    array = [];
    constructor (props) {
        super(props);
        this.state = {
            content: '',
            loading: false,
            progress: 0
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
            actions: { postNews },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                console.log(values);
                let coverResp = values.attachment[0].response;
                let fileList = [];
                if (values && values.annexFile && values.annexFile.fileList &&
                    values.annexFile.fileList instanceof Array &&
                    values.annexFile.fileList.length > 0) {
                    fileList = values.annexFile.fileList;
                }
                console.log(coverResp, fileList, this.state.content, getUser().id);
                postNews({}, {
                    Author: '',
                    Content: this.state.content,
                    Content_Type: 1,
                    Creater: getUser().id,
                    KeyWords: '',
                    Source: values.source,
                    SubTitle: '',
                    Summary: '',
                    Title: values.title,
                    Thumbnail: coverResp.a_file,
                    Files: fileList
                });
            }
        });
        // const {
        //     actions: { postData, getNewsList },
        //     form: { validateFields }
        // } = this.props;
        // validateFields(async (err, values) => {
        //     console.log('values', values);
        //     if (!err) {
        //         let coverResp = values.attachment[0].response;
        //         let fileList = [];
        //         if (values && values.annexFile && values.annexFile.fileList &&
        //             values.annexFile.fileList instanceof Array &&
        //             values.annexFile.fileList.length > 0) {
        //             fileList = values.annexFile.fileList;
        //         }
        //         let newData = {
        //             'title': values['title'] || '',
        //             'raw': this.state.content,
        //             'content': '',
        //             'update_time': moment().format('YYYY-MM-DD HH:mm:ss'),
        //             'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
        //             'tags': [1],
        //             'categories': [],
        //             'attachment': {
        //                 'fileList': fileList
        //             },
        //             'publisher': getUser().id,
        //             'is_draft': false,
        //             'cover': {
        //                 'a_file': coverResp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
        //                 'create_time': coverResp.create_time,
        //                 'download_url': coverResp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
        //                 'id': coverResp.id,
        //                 'mime_type': coverResp.mime_type,
        //                 'misc': coverResp.misc,
        //                 'name': coverResp.name
        //             },
        //             'source': {
        //                 'name': values.source
        //             }
        //         };
        //         let rst = await postData({}, newData);
        //         if (rst.id) {
        //             this.modalClick();
        //             Notification.success({
        //                 message: '发布新闻成功',
        //                 duration: 3
        //             });
        //             // 更新新闻列表数据
        //             getNewsList({}, {
        //                 tag: '新闻',
        //                 is_draft: false
        //             });
        //         } else {
        //             Notification.success({
        //                 message: '发布新闻失败！',
        //                 duration: 3
        //             });
        //         }
        //     }
        // });
    }

    // 暂存新闻
    draftDataFunc () {
        const {
            actions: { postData, getDraftNewsList },
            form: { validateFields }
        } = this.props;
        validateFields(async (err, values) => {
            console.log('values', values);
            if (!err) {
                let coverResp = values.attachment[0].response;
                let fileList = [];
                if (values && values.annexFile && values.annexFile.fileList &&
                    values.annexFile.fileList instanceof Array &&
                    values.annexFile.fileList.length > 0) {
                    fileList = values.annexFile.fileList;
                }
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content || '',
                    'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'tags': [1],
                    'categories': [],
                    'attachment': {
                        'fileList': fileList
                    },
                    'publisher': getUser().id,
                    'is_draft': true,
                    'cover': {
                        'a_file': coverResp.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        'create_time': coverResp.create_time,
                        'download_url': coverResp.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                        'id': coverResp.id,
                        'mime_type': coverResp.mime_type,
                        'misc': coverResp.misc,
                        'name': coverResp.name
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
                } else {
                    Notification.success({
                        message: '暂存失败！',
                        duration: 3
                    });
                }
            }
        });
    }
    // modal显示与影藏
    modalClick () {
        this.props.handlePublishNewsModalCancel();
    }
    uploadPropsFile = {
        name: 'a_file',
        showUploadList: true,
        action: uploadFileURL,
        beforeUpload: () => {
            this.setState({
                progress: 0,
                loading: true
            });
        },
        onChange: async ({file, fileList}) => {
            try {
                console.log('file', file);
                console.log('fileList', fileList);
                const status = file.status;
                if (status === 'done') {
                    file.url = file && file.response && file.response.a_file;
                    fileList.map((fileData) => {
                        if (fileData && fileData.response && fileData.response.a_file) {
                            fileData.url = STATIC_DOWNLOAD_API + fileData.response.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                        }
                    });
                    this.setState({
                        progress: 1,
                        loading: false
                    });
                    Notification.info({
                        message: '上传附件成功',
                        duration: 3
                    });
                } else if (status === 'error') {
                    Notification.error({
                        message: '上传附件失败',
                        duration: 3
                    });
                    this.setState({
                        progress: 1,
                        loading: false
                    });
                }
            } catch (e) {
                console.log('uploadPropsFile', e);
            }
        }
    };
    uploadPropsCover = {
        name: 'file',
        action: uploadFileURL,
        showUploadList: true,
        data: (file) => {
            return {
                name: file.fileName,
                a_file: file
            };
        },
        beforeUpload: (file) => {
            let type = file.name.toString().split('.');
            let len = type.length;
            if (
                type[len - 1] === 'jpg' ||
            type[len - 1] === 'jpeg' ||
            type[len - 1] === 'png' ||
            type[len - 1] === 'JPG' ||
            type[len - 1] === 'JPEG' ||
            type[len - 1] === 'PNG'
            ) {
                this.setState({
                    progress: 0,
                    loading: true
                });
                return true;
            } else {
                Notification.error({
                    message: '请上传jpg,jpeg,png 文件',
                    duration: 3
                });
                return false;
            }
        },
        onChange: ({ file }) => {
            console.log('file', file);

            const status = file.status;
            if (status === 'done') {
                Notification.info({
                    message: '上传封面成功',
                    duration: 3
                });
                this.setState({
                    progress: 1,
                    loading: false
                });
            } else if (status === 'error') {
                Notification.info({
                    message: '上传封面失败',
                    duration: 3
                });
                this.setState({
                    progress: 1,
                    loading: false
                });
            }
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
            e.fileList[length].url = STATIC_PREVIEW_API + e.file.response.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        }
        array.push(e.fileList[length]);
        if (e.file.status) {
            return e && array;
        } else {
            return [];
        }
    }
    checkTitle = async (rule, value, callback) => {
        if (value) {
            if (value.length <= 40) {
                callback();
            } else {
                callback(`名称须少于40个字，请重新输入`);
            };
        } else {
            callback();
        }
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            loading
        } = this.state;

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
                <Spin spinning={loading}>
                    <Form>
                        <Row>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写新闻名称！'
                                            },
                                            {
                                                validator: this.checkTitle
                                            }
                                        ]
                                    })(
                                        <Input type='text' placeholder='新闻名称' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='附件'>
                                    {getFieldDecorator('annexFile', {
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
                </Spin>
            </Modal>

        );
    }
}

export default Form.create()(NewsAddModal);
