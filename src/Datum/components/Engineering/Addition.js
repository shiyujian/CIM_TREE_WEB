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
    Spin
} from 'antd';
import moment from 'moment';
import { getUser } from '_platform/auth';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
const fileTypes =
    'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const Dragger = Upload.Dragger;
moment.locale('zh-cn');
class Addition extends Component {
    state = {
        progress: 0,
        isUploading: false,
        unitArray: [],
        unitProject: ''
    };

    render () {
        const {
            additionVisible = false,
            selectDoc,
            parent,
            docs = []
        } = this.props;
        let { isUploading } = this.state;
        // 判断选中的是哪个节点下的文件夹
        let canSection = false;
        if (selectDoc === '综合管理性文件' || parent === '综合管理性文件') {
            canSection = true;
        }
        // modal的底部

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
                {!additionVisible ? null : (
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
                                        {/* <Progress percent={progress} strokeWidth={5} /> */}
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 35 }}>
                                    <Col span={24}>
                                        <Table
                                            // rowSelection={this.rowSelection}
                                            columns={
                                                canSection
                                                    ? this.docCols1
                                                    : this.docCols
                                            }
                                            dataSource={docs}
                                            bordered
                                            rowKey='uid'
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Spin>
                    </Modal>
                )}
            </div>
        );
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
            // this.setState({ progress: 0 });
        }
    };

    changeDoc ({ file, fileList, event }) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        if (file.status === 'done') {
            file.doc_type = this.props.doc_type;
            changeDocs([...docs, file]);
            this.setState({
                isUploading: false
            });
        }
    }

    docCols = [
        {
            title: '文档名称',
            dataIndex: 'name',
            width: '25%'
        },
        {
            title: '编号',
            width: '10%',
            render: doc => {
                return <Input onChange={this.number.bind(this, doc)} />;
            }
        },
        {
            title: '文档类型',
            dataIndex: 'doc_type',
            width: '10%',
            render: (text, record, index) => {
                return <Input value={this.props.doc_type} readOnly />;
            }
        },
        {
            title: '备注',
            width: '10%',
            render: doc => {
                return <Input onChange={this.remark.bind(this, doc)} />;
            }
        },
        {
            title: '操作',
            width: '5%',
            render: doc => {
                return <a onClick={this.remove.bind(this, doc)}>删除</a>;
            }
        }
    ];

    docCols1 = [
        {
            title: '文档名称',
            dataIndex: 'name',
            width: '30%'
        },
        {
            title: '编号',
            width: '15%',
            render: doc => {
                return <Input onChange={this.number.bind(this, doc)} />;
            }
        },
        {
            title: '文档类型',
            dataIndex: 'doc_type',
            width: '10%',
            render: (text, record, index) => {
                return <Input value={this.props.doc_type} readOnly />;
            }
        },
        {
            title: '备注',
            width: '15%',
            render: doc => {
                return <Input onChange={this.remark.bind(this, doc)} />;
            }
        },
        {
            title: '操作',
            width: '5%',
            render: doc => {
                return <a onClick={this.remove.bind(this, doc)}>删除</a>;
            }
        }
    ];

    remark (doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.remark = event.target.value;
        changeDocs(docs);
    }

    number (doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.number = event.target.value;
        changeDocs(docs);
    }

    remove (doc) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        changeDocs(docs.filter(d => d !== doc));
    }

    cancel () {
        const {
            actions: { toggleAddition }
        } = this.props;
        toggleAddition(false);
    }

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    save () {
        const {
            currentcode = {},
            actions: { toggleAddition, postDocument, getdocument, changeDocs },
            docs = [],
            currentSection,
            currentSectionName,
            projectName,
            selectDoc,
            parent
        } = this.props;

        if (docs.length === 0) {
            message.error('请上传文件');
            return;
        }

        // 判断各列有没有输入
        let canSave = true;
        // 判断选中的是哪个节点下的文件夹
        if (selectDoc === '综合管理性文件' || parent === '综合管理性文件') {
            docs.map(doc => {
                if (!doc.number || !doc.doc_type) {
                    canSave = false;
                }
            });
        } else {
            docs.map(doc => {
                if (
                    !doc.number ||
                    !doc.doc_type
                ) {
                    canSave = false;
                }
            });
        }
        if (!canSave) {
            message.error('请输入表格中除备注外的每项');
            return;
        }
        let user = getUser();

        const promises = docs.map(doc => {
            const response = doc.response;
            let files = DeleteIpPort(doc);
            files.uid = response.id;
            return postDocument(
                {},
                {
                    code: `${currentcode.code}_${response.id}`,
                    name: doc.name,
                    obj_type: 'C_DOC',
                    profess_folder: {
                        code: currentcode.code,
                        obj_type: 'C_DIR'
                    },
                    basic_params: {
                        files: [files]
                    },
                    extra_params: {
                        number: doc.number,
                        doc_type: doc.doc_type,
                        remark: doc.remark,
                        type: doc.type,
                        lasttime: doc.lastModifiedDate,
                        people: user.name,
                        username: user.username,
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
            getdocument({ code: currentcode.code });
        });
    }
}
export default Form.create()(Addition);
