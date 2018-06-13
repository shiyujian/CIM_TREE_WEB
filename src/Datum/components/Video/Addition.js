import React, { Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
    Form,
    Input,
    Row,
    Col,
    Modal,
    Upload,
    Button,
    Icon,
    message,
    Table,
    Select,
    Spin
} from 'antd';
import moment from 'moment';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
// import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;
const Option = Select.Option;
const fileTypes = 'video/mp4,.mp4,';
export const Datumcode = window.DeathCode.DATUM_VIDEO;

class Addition extends Component {
    static propTypes = {};

    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    state = {
        progress: 0,
        isUploading: false
    };
    formItemLayout = {
        // labelCol: { span: 6 },
        wrapperCol: { span: 24 }
    };
    render () {
        const {
            additionVisible = false,
            docs = []
        } = this.props;
        let { isUploading } = this.state;
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
            <Modal
                title='新增资料'
                width={920}
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
                                    accept={fileTypes}
                                    onChange={this.changeDoc.bind(this)}
                                >
                                    <p className='ant-upload-drag-icon'>
                                        <Icon type='inbox' />
                                    </p>
                                    <p className='ant-upload-text'>
                                        点击或者拖拽开始上传
                                    </p>
                                    <p className='ant-upload-hint'>
                                        支持 pdf、doc、docx 文件
                                    </p>
                                </Dragger>
                                {/* <Progress percent={progress} strokeWidth={5}/> */}
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 35 }}>
                            <Col span={24}>
                                <Table
                                    // rowSelection={this.rowSelection}
                                    columns={this.docCols}
                                    dataSource={docs}
                                    bordered
                                    rowKey='uid'
                                />
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
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

    cancel () {
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
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: false,
        data (file) {
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
            }

            return valid;
        }
    };

    changeDoc ({ file, fileList, event }) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        if (file.status === 'done') {
            changeDocs([...docs, file]);
            this.setState({
                isUploading: false
            });
        }
    }

    docCols = [
        {
            title: '视频名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '视频类型',
            render: doc => {
                return (
                    <Select
                        placeholder='请选择视频类型'
                        onChange={this.typeChange.bind(this, doc)}
                    >
                        <Option key={'宣传片'} value={'宣传片'}>
                            宣传片
                        </Option>
                        <Option key={'操作视频'} value={'操作视频'}>
                            操作视频
                        </Option>
                    </Select>
                );
            }
        },
        {
            title: '备注',
            render: doc => {
                return <Input onChange={this.remark.bind(this, doc)} />;
            }
        },
        {
            title: '操作',
            render: doc => {
                return <a onClick={this.remove.bind(this, doc)}>删除</a>;
            }
        }
    ];

    typeChange (doc, value) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;

        doc.fileType = value;
        changeDocs(docs);
    }

    remark (doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.remark = event.target.value;
        changeDocs(docs);
    }

    remove (doc) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        changeDocs(docs.filter(d => d !== doc));
        this.setState({
            progress: 0
        });
    }

    save () {
        const {
            docs = [],
            currentSection,
            currentSectionName,
            projectName,
            actions: { toggleAddition, postDocument, getdocument, changeDocs }
        } = this.props;

        if (docs.length === 0) {
            message.error('请上传文件');
            return;
        }
        let canSave = true;
        // 判断各列有没有输入
        docs.map(doc => {
            if (!doc.fileType) {
                canSave = false;
            }
        });

        if (!canSave) {
            message.error('请选择视频类型');
            return;
        }

        const promises = docs.map(doc => {
            const response = doc.response;
            let files = DeleteIpPort(doc);
            files.uid = response.id;
            return postDocument(
                {},
                {
                    code: `${Datumcode}_${response.id}`,
                    name: doc.name,
                    obj_type: 'C_DOC',
                    profess_folder: {
                        code: Datumcode,
                        obj_type: 'C_DIR'
                    },
                    basic_params: {
                        files: [files]
                    },
                    extra_params: {
                        type: doc.fileType,
                        remark: doc.remark,
                        lasttime: doc.lastModifiedDate,
                        state: '正常文档',
                        submitTime: moment.utc().format(),
                        time: moment.utc().format('YYYY-MM-DD'),
                        currentSection: currentSection,
                        currentSectionName: currentSectionName,
                        projectName: projectName
                    }
                }
            );
        });
        message.warning('新增文件中...');
        Promise.all(promises).then(rst => {
            message.success('新增文件成功！');
            changeDocs();
            toggleAddition(false);
            getdocument({ code: Datumcode });
        });
        this.setState({
            progress: 0
        });
    }
}
export default Form.create()(Addition);
