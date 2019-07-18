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

class NoticeEditModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fileListNew: [], // 附件
            content: '',
            progress: 0,
            loading: false,
            annexFileList: []
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

        const {
            noticeID,
            actions: { getNoticeDetails },
            form: { setFieldsValue }
        } = this.props;
        console.log(noticeID, '通知ID');
        getNoticeDetails({ID: noticeID}, {}).then(rep => {
            console.log(rep);
            let { fileListNew } = this.state;
            rep.Files.map((item, index) => {
                fileListNew.push({
                    uid: index,
                    name: item.FileName,
                    url: item.FilePath
                });
            });
            console.log(fileListNew);
            this.setState({
                noticeID: noticeID,
                content: rep.Notice_Content,
                fileListNew
            });
            editor.txt.html(rep.Notice_Content);
            setFieldsValue({
                'title': rep.Notice_Title || '',
                'mergency': rep.Notice_Type + '' || ''
            });
        });

        // const {
        //     noticeDetail,
        //     form: { setFieldsValue }
        // } = this.props;
        // this.setState({
        //     content: noticeDetail.raw
        // });
        // editor.txt.html(noticeDetail.raw);
        // let annexFile = noticeDetail.attachment && noticeDetail.attachment.fileList
        //     ? noticeDetail.attachment.fileList : [];
        // setFieldsValue({
        //     'title': noticeDetail.title || '',
        //     'mergency': noticeDetail.degree + '' || '',
        //     'annexFile': annexFile
        // });
        // this.setState({
        //     annexFileList: annexFile
        // });
    }

    // modal显示与影藏
    modalClick () {
        this.props.handleNoticeEditModalCancel();
    }

    // 发布通知
    onRelease () {
        const {
            actions: { putNotice, getNoticeList },
            form: { validateFields }
        } = this.props;
        validateFields(async (err, values) => {
            if (!err) {
                const { noticeID, fileListNew, content } = this.state;
                let fileList = [];
                fileListNew.map(item => {
                    if (item) {
                        fileList.push({
                            FileName: item.name,
                            FilePath: item.url
                        });
                    }
                });
                console.log('编辑数据', values, content, fileList);
                let rst = await putNotice({}, {
                    ID: noticeID,
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
                        message: '编辑通知成功',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '编辑通知失败',
                        duration: 3
                    });
                }
            }
        });
        // validateFields((err, values) => {
        //     if (!err) {
        //         let fileList = [];
        //         if (values && values.annexFile) {
        //             if (values.annexFile.fileList &&
        //                 values.annexFile.fileList instanceof Array &&
        //                 values.annexFile.fileList.length > 0) {
        //                 fileList = values.annexFile.fileList;
        //             } else {
        //                 fileList = values.annexFile;
        //             }
        //         }
        //         let newData = {
        //             'title': values['title'] || '',
        //             'raw': this.state.content,
        //             'degree': values['mergency'],
        //             'attachment': {
        //                 'fileList': fileList
        //             },
        //             'categories': [],
        //             'update_time': moment().format('YYYY-MM-DD HH:mm:ss'),
        //             'is_draft': false
        //         };
        //         patchData({ pk: noticeDetail.id }, newData)
        //             .then(rst => {
        //                 if (rst.id) {
        //                     this.modalClick();
        //                     Notification.success({
        //                         message: '编辑通知成功',
        //                         duration: 3
        //                     });
        //                     // 更新通知列表数据
        //                     getTipsList({}, {
        //                         tag: '公告',
        //                         is_draft: false
        //                     });
        //                     getDraftTipsList({}, {
        //                         tag: '公告',
        //                         is_draft: true
        //                     });
        //                 }
        //             });
        //     }
        // });
    }

    // 暂存通知
    draftDataFunc () {
        const {
            actions: { patchData, getTipsList, getDraftTipsList },
            form: { validateFields },
            noticeDetail
        } = this.props;
        validateFields((err, values) => {
            let fileList = [];
            if (values && values.annexFile) {
                if (values.annexFile.fileList &&
                    values.annexFile.fileList instanceof Array &&
                    values.annexFile.fileList.length > 0) {
                    fileList = values.annexFile.fileList;
                } else {
                    fileList = values.annexFile;
                }
            }
            if (!err) {
                let newData = {
                    'title': values['title'] || '',
                    'raw': this.state.content,
                    'degree': values['mergency'],
                    'attachment': {
                        'fileList': fileList
                    },
                    'categories': [],
                    'update_time': moment().format('YYYY-MM-DD HH:mm:ss'),
                    'is_draft': true
                };
                patchData({ pk: noticeDetail.id }, newData)
                    .then(rst => {
                        if (rst.id) {
                            this.modalClick();
                            Notification.success({
                                message: '暂存成功',
                                duration: 3
                            });
                            // 更新暂存的通知列表数据
                            getTipsList({}, {
                                tag: '公告',
                                is_draft: false
                            });
                            getDraftTipsList({}, {
                                tag: '公告',
                                is_draft: true
                            });
                        }
                    });
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
    uploadPropsFile = {
        name: 'a_file',
        showUploadList: true,
        action: '',
        beforeUpload: (file, fileList) => {
            let { fileListNew } = this.state;
            const { uploadFileHandler } = this.props.actions;
            const formdata = new FormData();
            formdata.append('file', fileList[0]);
            uploadFileHandler({}, formdata).then(rep => {
                file.url = rep;
                fileListNew.push(file);
                console.log(fileListNew, '附件');
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
        onChange: ({ file, fileList }) => {
            try {
                console.log('file', file);
                console.log('fileList', fileList);
                this.setState({
                    annexFileList: fileList
                });
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
                                        rules:
                                        [
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
                                    <Upload {...this.uploadPropsFile}
                                        fileList={this.state.fileListNew}
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

export default Form.create()(NoticeEditModal)
;
