import React, { Component } from 'react';
import { FOREST_API } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Modal,
    Upload,
    DatePicker,
    Icon,
    message,
    Spin,
    Notification
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

class Updatemodal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            isUploading: false,
            postUrl: '',
            viewUrl: ''
        };
    }
    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    componentDidUpdate (prevProps, prevState) {
        const {
            oldfile,
            form: { setFieldsValue },
            updatevisible
        } = this.props;
        if (
            oldfile !== prevProps.oldfile ||
            updatevisible !== prevProps.updatevisible
        ) {
            let viewUrl = oldfile.VideoPath ? oldfile.VideoPath : '';
            viewUrl = viewUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            viewUrl = `${FOREST_API}/${viewUrl}`;
            this.setState({
                viewUrl: viewUrl,
                postUrl: oldfile.VideoPath ? oldfile.VideoPath : ''
            });
            setFieldsValue({
                videoNameUpdate: oldfile.VideoName ? oldfile.VideoName : '',
                videoDescUpdate: oldfile.VideoDescribe ? oldfile.VideoDescribe : '',
                videoViewUrlUpdate: oldfile.VideoPath ? oldfile.VideoPath : '',
                attachmentUpdate: oldfile.VideoPath ? oldfile.VideoPath : ''
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            updatevisible = false
        } = this.props;

        const { isUploading } = this.state;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this.cancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this.videoViewUpdate.bind(this)}
            >
                更新
            </Button>
        ];
        let footer = isUploading ? null : arr;
        console.log('this.state.viewUrl', this.state.viewUrl);
        return (
            <div>
                {!updatevisible ? null : (
                    <Modal
                        title='编辑资料'
                        width={920}
                        visible={updatevisible}
                        closable={false}
                        footer={footer}
                        maskClosable={false}
                    >
                        <Spin spinning={isUploading}>
                            <Form>
                                <FormItem {...formItemLayout} label='视频名称'>
                                    {getFieldDecorator('videoNameUpdate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入视频名称'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>

                                <FormItem {...formItemLayout} label='备注'>
                                    {getFieldDecorator('videoDescUpdate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入备注'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='视频'>
                                    {getFieldDecorator('videoViewUrlUpdate', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请查看视频'
                                            }
                                        ]
                                    })(<video
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
                                    </video>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='上传文件'>
                                    {getFieldDecorator(
                                        'attachmentUpdate',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        '请上传文件！'
                                                }
                                            ]
                                        },
                                        {}
                                    )(
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
                                    )}
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                )}
            </div>
        );
    }

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        let len = e.fileList.length;
        if (len > 0) {
            return e && [e.fileList[len - 1]];
        } else {
            return e && e.fileList;
        }
    };

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
                        let src = rst.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                        src = `${FOREST_API}/${src}`;
                        this.props.form.setFieldsValue({
                            attachmentUpdate: rst
                        });
                        this.setState({
                            postUrl: rst,
                            viewUrl: src,
                            isUploading: false
                        });
                    } else {
                        Notification.error({
                            message: '上传文件失败',
                            duration: 3
                        });
                        this.props.form.setFieldsValue({
                            attachmentUpdate: ''
                        });
                        this.setState({
                            postUrl: '',
                            viewUrl: '',
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

    cancel () {
        const {
            actions: { updatevisible }
        } = this.props;
        updatevisible(false);
        this.props.form.setFieldsValue({
            videoNameUpdate: '',
            videoDescUpdate: '',
            videoViewUrlUpdate: '',
            attachmentUpdate: ''
        });
        this.setState({
            progress: 0
        });
    }

    // 更新视频
    videoViewUpdate = () => {
        const {
            actions: {
                updateForsetVideo,
                searchVideoMessage,
                searchVideoVisible
            },
            oldfile
        } = this.props;
        const {
            postUrl
        } = this.state;
        try {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    let postData = {
                        VideoName: values.videoNameUpdate, // 视频名称
                        VideoDescribe: values.videoDescUpdate, // 视频说明
                        VideoPath: postUrl, // 视频路径
                        VideoCover: '', // 视频封面  可为空
                        ID: oldfile.ID ? oldfile.ID : ''
                    };
                    let reportData = await updateForsetVideo({}, postData);
                    console.log('reportData', reportData);
                    if (reportData && reportData.code && reportData.code === 1) {
                        Notification.success({
                            message: '视频更新成功',
                            duration: 3
                        });
                        this.cancel();
                        searchVideoMessage();
                        searchVideoVisible(true);
                    } else {
                        Notification.error({
                            message: '视频更新失败',
                            duration: 3
                        });
                    }
                }
            });
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(Updatemodal);
