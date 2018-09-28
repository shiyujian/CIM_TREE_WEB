import React, { Component } from 'react';
import { FOREST_API } from '../../../_platform/api';
import {
    Form,
    Row,
    Col,
    Modal,
    Upload,
    Button,
    Icon,
    Spin,
    Notification,
    Input
} from 'antd';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
export const Datumcode = window.DeathCode.DATUM_VIDEO;

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            isUploading: false,
            viewVisible: false,
            viewUrl: '',
            postUrl: ''
        };
    }
    render () {
        const {
            additionVisible = false,
            form: { getFieldDecorator }
        } = this.props;
        let { isUploading } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this.uploadFileModalCancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this.uploadFileSave.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = isUploading ? null : arr;
        return (
            <div>
                <Modal
                    title='新增视频'
                    visible={additionVisible}
                    closable={false}
                    footer={footer}
                    maskClosable={false}
                >
                    <Spin spinning={isUploading}>
                        <Form>
                            <Row gutter={24}>
                                <Col
                                    span={24}
                                    style={{ marginTop: 16, height: 160 }}
                                >
                                    <Dragger
                                        {...this.uploadProps}
                                    >
                                        <p className='ant-upload-drag-icon'>
                                            <Icon type='inbox' />
                                        </p>
                                        <p className='ant-upload-text'>
                                        点击或者拖拽开始上传
                                        </p>
                                        <p className='ant-upload-hint'>
                                        支持 mp4 文件
                                        </p>
                                    </Dragger>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Modal>
                <Modal
                    title='视频预览'
                    // visible
                    visible={this.state.viewVisible}
                    cancelText={'关闭'}
                    width='800px'
                    footer={null}
                    onCancel={this.videoViewModalCancel.bind(this)}
                    onOk={this.videoViewModalCancel.bind(this)}
                >
                    <div>
                        <video
                            controls
                            preload='auto'
                            width='100%'
                            height='500px'
                            src={this.state.viewUrl}
                        >
                            <source
                                src='this.state.video'
                                type='video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;'
                            />
                            <source
                                src='this.state.video'
                                type='video/ogg; codecs=&quot;theora, vorbis&quot;'
                            />
                            <source
                                src='this.state.video'
                                type='video/webm; codecs=&quot;vp8, vorbis&quot;'
                            />
                        </video>
                        <Row style={{ marginTop: 10 }}>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='视频名称'
                                    >
                                        {getFieldDecorator(
                                            'videoName',
                                            {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入视频名称'
                                                    }
                                                ]
                                            }
                                        )(
                                            <Input
                                                placeholder='请输入视频名称'
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='备注'
                                    >
                                        {getFieldDecorator(
                                            'videoDesc',
                                            {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入备注'
                                                    }
                                                ]
                                            }
                                        )(
                                            <Input
                                                placeholder='请输入备注'
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>

                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.videoViewReport.bind(this)}
                                style={{ float: 'right', marginLeft: 10 }}
                                type='primary'
                            >
                                上报
                            </Button>
                            <Button
                                onClick={this.videoViewModalCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>

                        </Row>
                    </div>
                </Modal>
            </div>

        );
    }

    rowSelection = {
        onChange: selectedRowKeys => {
            const {
                actions: { selectDocuments }
            } = this.props;
            selectDocuments(selectedRowKeys);
        }
    };

    uploadFileModalCancel () {
        const {
            actions: { toggleAddition, changeDocs }
        } = this.props;
        toggleAddition(false);
        changeDocs();
        this.setState({
            progress: 0
        });
    }

    uploadProps = {
        name: 'a_file',
        action: `${FOREST_API}/UploadHandler.ashx?filetype=video`,
        showUploadList: false,
        beforeUpload: file => {
            const {
                actions: { postForsetVideo }
            } = this.props;
            let type = file.name.toString().split('.');
            let len = type.length;
            if (
                type[len - 1] === 'mp4' ||
                type[len - 1] === 'MP4'
            ) {
                this.setState({
                    isUploading: true
                });
                const formdata = new FormData();
                formdata.append('a_file', file);
                formdata.append('name', file.name);
                postForsetVideo({}, formdata).then(rst => {
                    console.log('rstrstrst', rst);
                    if (rst) {
                        let src = rst.replace(/\/\//g, '/');
                        src = `${FOREST_API}/${src}`;
                        this.setState({
                            postUrl: rst,
                            viewUrl: src,
                            viewVisible: true,
                            isUploading: false
                        });
                    } else {
                        Notification.error({
                            message: '上传文件失败',
                            duration: 3
                        });
                        this.setState({
                            postUrl: '',
                            viewUrl: '',
                            viewVisible: false,
                            isUploading: false
                        });
                    }
                    return false;
                });
            } else {
                Notification.error({
                    message: '请上传MP4格式文件',
                    duration: 3
                });
                this.setState({
                    isUploading: false
                });
                return false;
            }
        },
        onChange: ({ file, fileList, event }) => {
            this.setState({
                isUploading: true
            });
            const status = file.status;
            if (status === 'done') {
                console.log('donedonefile', file);
            } else if (status === 'error') {
                console.log('errorerrorfile', file);
            }
        }
    };
    uploadFileSave () {
        this.setState({
            progress: 0
        });
    }

    videoViewModalCancel () {
        const {
            actions: {
                toggleAddition
            }
        } = this.props;
        this.clearForm();
        toggleAddition(false);
        this.setState({
            viewVisible: false,
            viewUrl: '',
            postUrl: '',
            isUploading: false
        });
    }
    // 上报视频
    videoViewReport = () => {
        const {
            actions: {
                reportForsetVideo,
                searchVideoMessage,
                searchVideoVisible
            }
        } = this.props;
        const {
            postUrl
        } = this.state;
        try {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    let postData = {
                        VideoName: values.videoName, // 视频名称
                        VideoDescribe: values.videoDesc, // 视频说明
                        VideoPath: postUrl, // 视频路径
                        VideoCover: ''// 视频封面  可为空
                    };
                    let reportData = await reportForsetVideo({}, postData);
                    console.log('reportData', reportData);
                    if (reportData && reportData.code && reportData.code === 1) {
                        Notification.success({
                            message: '视频上报成功',
                            duration: 3
                        });
                        this.videoViewModalCancel();
                        searchVideoMessage();
                        searchVideoVisible(true);
                    } else {
                        Notification.error({
                            message: '视频上报失败',
                            duration: 3
                        });
                    }
                }
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    clearForm = () => {
        this.props.form.setFieldsValue({
            videoName: '',
            videoDesc: ''
        });
    }
}
export default Form.create()(Addition);
