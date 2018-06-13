import React, { Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Modal,
    Upload,
    DatePicker,
    Icon,
    message,
    Spin
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
let fileTypes = 'image/jpeg,image/tiff,image/png,image/bmp,image/jpg';

class Updatemodal extends Component {
    static propTypes = {};

    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    state = {
        progress: 0,
        isUploading: false
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
            setFieldsValue({
                name1: oldfile.name ? oldfile.name : '',
                number1: oldfile.extra_params.number
                    ? oldfile.extra_params.number
                    : '',
                company1: oldfile.extra_params.company
                    ? oldfile.extra_params.company
                    : '',
                time1: oldfile.extra_params.time
                    ? moment.utc(oldfile.extra_params.time)
                    : '',
                remark1: oldfile.extra_params.remark
                    ? oldfile.extra_params.remark
                    : '',
                attachment1: oldfile.basic_params.files
                    ? oldfile.basic_params.files
                    : []
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
                                <FormItem {...formItemLayout} label='影像名称'>
                                    {getFieldDecorator('name1', {
                                        // initialValue:oldfile && oldfile.name ,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入影像名称'
                                            }
                                        ]
                                    })(<Input type='text' readOnly />)}
                                </FormItem>

                                <FormItem {...formItemLayout} label='影像编号'>
                                    {getFieldDecorator('number1', {
                                        // initialValue:oldfile && oldfile.extra_params &&  oldfile.extra_params.number,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入影像编号'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>

                                <FormItem {...formItemLayout} label='发布单位'>
                                    {getFieldDecorator('company1', {
                                        // initialValue: oldfile && oldfile.extra_params &&  oldfile.extra_params.company,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入发布单位'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='拍摄日期'>
                                    {getFieldDecorator('time1', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择拍摄日期'
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            format={'YYYY-MM-DD'}
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label='备注'>
                                    {getFieldDecorator('remark1', {
                                        // initialValue: oldfile && oldfile.extra_params &&  oldfile.extra_params.remark,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入备注'
                                            }
                                        ]
                                    })(<Input type='text' />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label='上传文件'>
                                    {getFieldDecorator(
                                        'attachment1',
                                        {
                                            // initialValue: oldfile.basic_params ? oldfile.basic_params.files : [],
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

    cancel () {
        const {
            actions: { updatevisible, changeDocs }
        } = this.props;
        updatevisible(false);
        changeDocs();
        this.setState({
            progress: 0
        });
    }

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
                message.error('只能上传 bmp,jpg,png,tif 文件！');
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
            actions: {
                updatevisible,
                getdocument,
                changeDocs,
                putdocument
            },
            currentSection,
            currentSectionName,
            projectName
        } = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
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
                        company: values.company1,
                        time: moment(values.time1).format('YYYY-MM-DD'),
                        remark: values.remark1,
                        type: resp.type,
                        lasttime: moment(resp.lastModifiedDate).format(
                            'YYYY-MM-DD'
                        ),
                        state: '正常文档',
                        submitTime: moment.utc().format(),
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

                        changeDocs([]);
                        updatevisible(false);
                        getdocument({ code: currentcode.code });
                    }
                );
            }
        });
    }
}
export default Form.create()(Updatemodal);
