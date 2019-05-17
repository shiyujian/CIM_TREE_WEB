import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Row, Col, Button, Notification, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
import { UPLOAD_API, STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import E from 'wangeditor';

let editor;
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;

class NoticeAddModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            content: '',
            progress: 0
        };
    }

    componentDidMount () {
        const elem = this.refs.editorElem;
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
        editor.create();
    }

    uploadProps = {
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

    // modal显示与影藏
    modalClick () {
        const { actions: { postUploadFiles } } = this.props;
        postUploadFiles([]);
        this.props.handlePublishNoticeModalCancel();
    }

    // 发布通知
    postData () {
        const {
            actions: { postData, getTipsList, postUploadFiles },
            form: { validateFields },
            fileList = []
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                // 判断是发布通知还是更新通知
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content,
                    'degree': values['mergency'],
                    'attachment': {
                        'fileList': fileList || []
                    },
                    'update_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'tags': [2],
                    'categories': [],
                    'publisher': getUser().id,
                    'is_draft': false
                };
                postData({}, newData)
                    .then(rst => {
                        if (rst.id) {
                            this.modalClick();
                            Notification.success({
                                message: '发布通知成功',
                                duration: 3
                            });
                            // 更新通知列表数据
                            getTipsList({}, {
                                tag: '公告',
                                is_draft: false
                            });
                            postUploadFiles([]);
                        }
                    });
            }
        });
    }

    // 暂存通知
    draftDataFunc () {
        const {
            actions: { postData, getDraftTipsList, postUploadFiles },
            form: { validateFields },
            fileList = []
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content,
                    'degree': values['mergency'],
                    'attachment': {
                        'fileList': fileList || []
                    },
                    'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'tags': [2],
                    'categories': [],
                    'publisher': getUser().id,
                    'is_draft': true
                };
                postData({}, newData)
                    .then(rst => {
                        if (rst.id) {
                            this.modalClick();
                            Notification.success({
                                message: '暂存成功！',
                                duration: 3
                            });
                            // 更新暂存的通知列表数据
                            getDraftTipsList({}, {
                                tag: '公告',
                                is_draft: true
                            });
                            postUploadFiles([]);
                        }
                    });
            }
        });
    }
    coverPicFile = (e) => {
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
        return e && array;
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
                visible
                onOk={this.modalClick.bind(this)}
                onCancel={this.modalClick.bind(this)}
                footer={null}
                width='80%'
            >
                <div>
                    <Form>
                        <Row span={22}>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true, message: '请输入通知名称' }],
                                        initialValue: ''
                                    })(
                                        <Input type='text' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6} offset={1}>
                                <FormItem {...formItemLayout} label='紧急程度'>
                                    {getFieldDecorator('mergency', {
                                        rules: [{ required: true, message: '请选择紧急程度' }]
                                    })(
                                        (<Select allowClear>
                                            <Option value='0'>平件</Option>
                                            <Option value='1'>加急</Option>
                                            <Option value='2'>特急</Option>
                                        </Select>)
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={5} offset={1}>
                                <FormItem {...formItemLayout} label='附件'>
                                    {getFieldDecorator('attachment1', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.coverPicFile
                                    })(
                                        <Upload {...this.uploadProps}
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
                            <Col span={22} offset={1}>
                                <div ref='editorElem' />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col span={24} offset={10}>
                                <Button type='primary' onClick={this.modalClick.bind(this)}>取消</Button>
                                <Button style={{ marginLeft: 20 }} type='primary' onClick={this.draftDataFunc.bind(this)}>暂存</Button>
                                <Button style={{ marginLeft: 20 }} type='primary' onClick={this.postData.bind(this)}>发布</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>

        );
    }
}

export default Form.create()(NoticeAddModal)
;
