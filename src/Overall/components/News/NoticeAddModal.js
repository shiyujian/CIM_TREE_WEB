import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Row, Col, Button, Notification, Select, Spin } from 'antd';
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
            fileListNew: [],
            content: '',
            progress: 0,
            loading: false
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

    // modal显示与影藏
    modalClick () {
        this.props.handlePublishNoticeModalCancel();
    }

    // 发布通知
    onRelease = async () => {
        const {
            actions: { postNotice, getNoticeList },
            form: { validateFields }
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                console.log('values', values);
                const { content, fileListNew } = this.state;
                console.log(this.state.fileListNew, values.mergency);
                let fileList = [];
                fileListNew.map(item => {
                    if (item) {
                        fileList.push({
                            FileName: item.name,
                            FilePath: item.url
                        });
                    }
                });
                let rst = await postNotice({}, {
                    Notice_Type: parseInt(values.mergency),
                    Notice_User: 1,
                    Notice_Title: values.title,
                    Notice_Content: content,
                    Remark: '',
                    Thumbnail: '',
                    Files: fileList
                });
                if (rst.code === 1) {
                    // 消除弹框重新加载时数据
                    getNoticeList({}, {
                        type: '',
                        name: '',
                        sdate: '',
                        edate: '',
                        page: '',
                        size: ''
                    });
                    await this.modalClick();
                    Notification.success({
                        message: '发布通知成功',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '发布通知失败',
                        duration: 3
                    });
                }
            }
        });
    }

    // 暂存通知
    draftDataFunc () {
        const {
            actions: { postData, getDraftTipsList },
            form: { validateFields }
        } = this.props;
        validateFields(async (err, values) => {
            console.log('values', values);
            if (!err) {
                let fileList = [];
                if (values && values.annexFile && values.annexFile.fileList &&
                    values.annexFile.fileList instanceof Array &&
                    values.annexFile.fileList.length > 0) {
                    fileList = values.annexFile.fileList;
                }
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content,
                    'degree': values['mergency'],
                    'attachment': {
                        'fileList': fileList
                    },
                    'pub_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'tags': [2],
                    'categories': [],
                    'publisher': getUser().id,
                    'is_draft': true
                };
                let rst = await postData({}, newData);
                if (rst && rst.id) {
                    // 更新暂存的通知列表数据
                    await getDraftTipsList({}, {
                        tag: '公告',
                        is_draft: true
                    });
                    await this.modalClick();
                    Notification.success({
                        message: '暂存通知成功！',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '暂存通知失败',
                        duration: 3
                    });
                }
            }
        });
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
        const uploadPropsFile = {
            name: 'a_file',
            showUploadList: true,
            action: '',
            fileList: this.state.fileListNew,
            beforeUpload: (file, fileList) => {
                let { fileListNew } = this.state;
                const { uploadFileHandler } = this.props.actions;
                const formdata = new FormData();
                formdata.append('file', fileList[0]);
                uploadFileHandler({}, formdata).then(rep => {
                    file.url = rep;
                    fileListNew.push(file);
                    this.setState({
                        fileListNew
                    });
                });
                return false;
            },
            onRemove: (file) => {
                let { fileListNew } = this.state;
                let fileList = [];
                fileListNew.map(item => {
                    if (item.uid !== file.uid) {
                        fileList.push(item);
                    }
                });
                this.setState({
                    fileListNew: fileList
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
        return (
            <Modal
                visible
                onOk={this.modalClick.bind(this)}
                onCancel={this.modalClick.bind(this)}
                footer={null}
                width='80%'
            >
                <Spin spinning={loading}>
                    <Form>
                        <Row span={22}>
                            <Col span={8} offset={1}>
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('title', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入通知名称'
                                            },
                                            {
                                                validator: this.checkTitle
                                            }
                                        ],
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
                                    <Upload {...uploadPropsFile}
                                    >
                                        <Button>
                                            <Icon type='upload' />上传附件
                                        </Button>
                                    </Upload>
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
                                <Button style={{ marginLeft: 20 }} type='primary' onClick={this.onRelease.bind(this)}>发布</Button>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>

        );
    }
}

export default Form.create()(NoticeAddModal)
;
