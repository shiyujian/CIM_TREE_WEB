import React, { Component } from 'react';
import { FILE_API } from '_platform/api';
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
    DatePicker,
    Spin
} from 'antd';
import moment from 'moment';
import { DeleteIpPort } from '_platform/components/singleton/DeleteIpPort';
const Dragger = Upload.Dragger;
let fileTypes = 'image/jpeg,image/tiff,image/png,image/bmp,image/jpg';

export default class Addition extends Component {
    static propTypes = {};

    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    state = {
        progress: 0,
        isUploading: false
    };
    render () {
        const { additionVisible = false, docs = [] } = this.props;
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
            <div>
                {!additionVisible ? null : (
                    <Modal
                        title='添加文件'
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
                                                支持bmp,jpg,png,tif文件
                                            </p>
                                        </Dragger>
                                        {/* <Progress percent={progress} strokeWidth={5} /> */}
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
                )}
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

    cancel () {
        const {
            actions: { toggleAddition, changeDocs }
        } = this.props;
        toggleAddition(false);
        changeDocs();
        // this.setState({
        //     progress: 0
        // })
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
                message.error('只能上传 bmp,jpg,png,tif 文件！');
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
            changeDocs([...docs, file]);
            this.setState({
                isUploading: false
            });
        }
    }

    docCols = [
        {
            title: '影像名称',
            dataIndex: 'name'
        },
        {
            title: '影像编号',
            render: doc => {
                return <Input onChange={this.number.bind(this, doc)} />;
            }
        },
        {
            title: '发布单位',
            render: doc => {
                return <Input onChange={this.company.bind(this, doc)} />;
            }
        },
        {
            title: '拍摄日期',
            render: doc => {
                return <DatePicker onChange={this.time.bind(this, doc)} />;
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

    remark (doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.remark = event.target.value;
        changeDocs(docs);
    }

    time (doc, event, date) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.time = date;
        changeDocs(docs);
    }

    company (doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.company = event.target.value;
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
        this.setState({
            progress: 0
        });
    }

    save () {
        const {
            currentcode = {},
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
            if (!doc.number || !doc.company || !doc.time) {
                canSave = false;
            }
        });

        if (!canSave) {
            message.error('请输入表格中除备注外的每项');
            return;
        }

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
                        company: doc.company,
                        time: doc.time,
                        remark: doc.remark,
                        type: doc.type,
                        lasttime: doc.lastModifiedDate,
                        state: '正常文档',
                        submitTime: moment.utc().format(),
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
        this.setState({
            progress: 0
        });
    }
}
