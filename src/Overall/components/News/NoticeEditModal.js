import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Row, Col, Button, Notification, Select, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
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
        const {
            actions: {
                uploadFileHandler
            }
        } = this.props;
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
        editor.customConfig.customUploadImg = function (files, insert) {
            console.log('files', files);
            console.log('file', files[0]);

            const formdata = new FormData();
            formdata.append('file', files[0]);
            uploadFileHandler({}, formdata).then((rep) => {
                if (rep && rep.indexOf('https') !== -1) {
                    insert(rep);
                } else {
                    alert('上传失败');
                }
            });
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
        const {
            noticeID,
            fileListNew,
            content
        } = this.state;
        validateFields(async (err, values) => {
            if (!err) {
                if (!content) {
                    Notification.warning({
                        message: '请输入通知详情',
                        duration: 3
                    });
                    return;
                }
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
            this.setState({
                progress: 0,
                loading: true
            });
            let {
                fileListNew = []
            } = this.state;
            const {
                uploadFileHandler
            } = this.props.actions;
            const formdata = new FormData();
            formdata.append('file', fileList[0]);
            uploadFileHandler({}, formdata).then(rep => {
                file.url = rep;
                fileListNew.push(file);
                console.log(fileListNew, '附件');
                this.setState({
                    progress: 1,
                    loading: false,
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
                title={'编辑通知'}
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
