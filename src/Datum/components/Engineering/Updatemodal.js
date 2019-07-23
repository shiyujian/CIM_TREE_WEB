import React, { Component } from 'react';
import { FILE_API } from '_platform/api';
import {
    Form,
    Input,
    Button,
    Modal,
    Upload,
    Icon,
    message,
    Select,
    Spin
} from 'antd';
import moment from 'moment';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
moment.locale('zh-cn');
const fileTypes =
    'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';

class Updatemodal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            progress: 0,
            isUploading: false
        };
    }

    render () {
        const {
            form: { getFieldDecorator },
            updatevisible = false,
            oldfile = {}
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
                onClick={this.save.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = isUploading ? null : arr;

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
                                <FormItem {...formItemLayout} label='名称'>
                                    {getFieldDecorator('name1', {
                                        initialValue: oldfile.name,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入名称'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='编号'>
                                    {getFieldDecorator('number1', {
                                        initialValue: oldfile.extra_params
                                            ? oldfile.extra_params.number
                                            : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入编号'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='文档类型'>
                                    {getFieldDecorator('doc_type1', {
                                        initialValue: this.props.doc_type,
                                        rules: [
                                            {
                                                required: true,
                                                message: '未获取到文档类型'
                                            }
                                        ]
                                    })(<Input type='text' readOnly />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='上传文件'>
                                    {getFieldDecorator(
                                        'attachment1',
                                        {
                                            initialValue: oldfile.basic_params
                                                ? oldfile.basic_params.files
                                                : [],
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        '请至少上传一个文件！'
                                                }
                                            ],
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile
                                        },
                                        {}
                                    )(
                                        <Upload
                                            {...this.uploadProps}
                                            accept={fileTypes}
                                            onChange={this.changeDoc.bind(this)}
                                            // defaultFileList={oldfile.basic_params ? oldfile.basic_params.files[0] : []}
                                        >
                                            <Button>
                                                <Icon type='upload' />添加文件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                )}
            </div>
        );
    }

    cancel () {
        const {
            actions: { updatevisible }
        } = this.props;
        updatevisible(false);
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
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: true,
        data: file => {
            return {
                name: file.fileName,
                a_file: file
            };
        },
        beforeUpload: file => {
            this.setState({
                progress: 0,
                isUploading: true
            });
            const valid = fileTypes.indexOf(file.type) >= 0;
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
                this.props.form.setFieldsValue({
                    attachment1: undefined
                });
            }
            return valid;
        }
    };

    changeDoc ({ file, fileList, event }) {
        const {
            form: { setFieldsValue }
        } = this.props;
        if (file && file.status && file.status === 'done') {
            setFieldsValue({
                name1: file.name ? file.name : ''
            });
            this.setState({
                isUploading: false
            });
        } else if (file && file.status && file.status === 'removed') {
            setFieldsValue({
                attachment1: undefined
            });
        }
    }

    save () {
        const {
            currentcode = {},
            actions: { updatevisible, putdocument, getdocument },
            currentSection,
            currentSectionName,
            projectName
        } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let user = getUser();
                let resp = values.attachment1[0].response
                    ? values.attachment1[0].response
                    : values.attachment1[0];
                let name = values.attachment1[0]
                    ? values.attachment1[0].name
                        ? values.attachment1[0].name
                        : ''
                    : '';
                let postData = {
                    name: values.name1,
                    basic_params: {
                        files: [
                            {
                                uid: resp.id ? resp.id : resp.uid,
                                misc: resp.misc,
                                download_url: resp.download_url.replace(
                                    /^http(s)?:\/\/[\w\-\.:]+/,
                                    ''
                                ),
                                a_file: resp.a_file.replace(
                                    /^http(s)?:\/\/[\w\-\.:]+/,
                                    ''
                                ),
                                create_time: resp.create_time,
                                mime_type: resp.mime_type,
                                name: name
                            }
                        ]
                    },
                    extra_params: {
                        number: values.number1,
                        people: user.name,
                        username: user.username,
                        unit: user.org,
                        doc_type: values.doc_type1,
                        time: moment.utc().format('YYYY-MM-DD'),
                        currentSection: currentSection,
                        currentSectionName: currentSectionName,
                        projectName: projectName
                    }
                };
                putdocument({ code: this.props.oldfile.code }, postData).then(
                    rst => {
                        if (rst && rst.pk) {
                            message.success('修改文件成功！');
                        } else {
                            message.error('修改文件失败！');
                        }
                        updatevisible(false);
                        getdocument({ code: currentcode.code });
                    }
                );
            }
        });
    }
}
export default Form.create()(Updatemodal);
