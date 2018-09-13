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
    Notification
} from 'antd';
const Dragger = Upload.Dragger;
export const Datumcode = window.DeathCode.DATUM_VIDEO;

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            isUploading: false,
            viewVisible: false
        };
    }
    render () {
        const {
            additionVisible = false
        } = this.props;
        let { isUploading } = this.state;
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
        this.setState({
            viewVisible: false,
            viewUrl: '',
            isUploading: false
        });
    }
}
export default Form.create()(Addition);
