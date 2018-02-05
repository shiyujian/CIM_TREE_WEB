import React, { PropTypes, Component } from 'react';
import { FILE_API } from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table, DatePicker, Progress, Select,
} from 'antd';
import moment from 'moment';
import { DeleteIpPort } from '../../../_platform/components/singleton/DeleteIpPort';
//import {fileTypes} from '../../../_platform/store/global/file';
const Dragger = Upload.Dragger;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const FormItem = Form.Item;
const Option = Select.Option;

class Addition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genders: ''
        }
    }

    static propTypes = {};

    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    state = {
        progress: 0,
        isUploading: false
    }
    render() {
        const {
            additionVisible = false,
            form: { getFieldDecorator },
            docs = []
        } = this.props;
        let { progress, isUploading } = this.state;
        let arr = [<Button key="back" size="large" onClick={this.cancel.bind(this)}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={this.save.bind(this)}>确定</Button>];
        let footer = isUploading ? null : arr;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Modal title="新增资料"
                width={920} visible={additionVisible}
                closable={false}
                footer={footer}
                maskClosable={false}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="安全教育" hasFeedback>
                                {getFieldDecorator('gender', {
                                    rules: [
                                        { required: true, message: '请选择安全教育！' },
                                    ]
                                }, {})(
                                    <Select onClick={this.gender.bind(this)} type="text" placeholder="请选择安全教育">
                                        <Option value="入场三级安全教育">入场三级安全教育</Option>
                                        <Option value="作业人员安全教育">作业人员安全教育</Option>
                                        <Option value="管理人员安全教育">管理人员安全教育</Option>
                                    </Select>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} style={{ marginTop: 16, height: 160 }}>
                            <Dragger {...this.uploadProps}
                                accept={fileTypes}
                                onChange={this.changeDoc.bind(this)}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                <p className="ant-upload-hint">
                                    支持 pdf、doc、docx 文件

								</p>
                            </Dragger>
                            <Progress percent={progress} strokeWidth={5} />
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ marginTop: 35 }}>
                        <Col span={24}>
                            <Table rowSelection={this.rowSelection}
                                columns={this.docCols}
                                dataSource={docs}
                                bordered rowKey="uid" />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

    rowSelection = {
        onChange: (selectedRowKeys) => {
            const { actions: { selectDocuments } } = this.props;
            selectDocuments(selectedRowKeys);
        },
    };

    cancel() {
        const {
            actions: { toggleAddition, changeDocs }
        } = this.props;
        toggleAddition(false);
        changeDocs();
        this.setState({
            progress: 0
        })
    }

    uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            //console.log(file);
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
            }
            return valid;
            this.setState({ progress: 0 });
        },

    };

    changeDoc({ file, fileList, event }) {
        this.props.form.validateFields(async (err, values) => {
            console.log("111", values.gender)
            this.setState({ genders: values.gender })
        });
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        // console.log("111", this.state.genders)
        // doc.remark = this.state.genders;
        // changeDocs(docs);

        if (file.status === 'done') {
            changeDocs([...docs, file]);
        }
        this.setState({
            isUploading: file.status === 'done' ? false : true
        })
        if (event) {
            let { percent } = event;
            if (percent !== undefined)
                this.setState({ progress: parseFloat(percent.toFixed(1)) });
        }
    }

    docCols = [
        {
            title: '规范名称',
            dataIndex: 'name'
        }, {
            title: '规范编号',
            render: (doc) => {
                return <Input onChange={this.number.bind(this, doc)} />;
            }
        }, {
            title: '发布单位',
            render: (doc) => {
                return <Input onChange={this.company.bind(this, doc)} />;
            }
        }, {
            title: '实施日期',
            render: (doc) => {
                return <DatePicker onChange={this.time.bind(this, doc)} />;
            }
        }, {
            title: '安全教育',
            render: (doc) => {
                return <Input onChange={this.remark.bind(this, doc)} defaultValue={this.state.genders} />;
            }
        },
        // {
        //     title: '安全教育',
        //     render: (doc) => {
        //         return <Input onChange={this.gender.bind(this, doc)} />;
        //     }
        // },
        {
            title: '操作',
            render: doc => {
                return (
                    <a onClick={this.remove.bind(this, doc)}>删除</a>
                );
            }
        }
    ];
    // // gender()
    // gender(doc, event) {
    //     const {
    //         docs = [],
    //         actions: { changeDocs }
    //     } = this.props;
    //     doc.gender = event.target.value;
    //     console.log(event.target.value)
    //     changeDocs(docs);
    // }
    gender() {

    }

    remark(doc, event) {

    }

    time(doc, event, date) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.time = date;
        changeDocs(docs);
    }

    company(doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.company = event.target.value;
        changeDocs(docs);
    }

    number(doc, event) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        doc.number = event.target.value;
        changeDocs(docs);
    }

    remove(doc) {
        const {
            docs = [],
            actions: { changeDocs }
        } = this.props;
        changeDocs(docs.filter(d => d !== doc));
        this.setState({
            progress: 0
        })
    }

    save() {
        const {
            currentcode = {},
            docs = [],
            actions: { toggleAddition, postDocument, getdocument, changeDocs }
        } = this.props;
        // this.props.form.validateFields(async (err, values) => {
        //     console.log(values.gender)
        //     this.setState({ genders: values.gender })
        // });


        const promises = docs.map(doc => {
            const response = doc.response;
            let files = DeleteIpPort(doc);
            return postDocument({}, {
                code: `${currentcode.code}_${response.id}`,
                name: doc.name,
                obj_type: 'C_DOC',
                profess_folder: {
                    code: currentcode.code, obj_type: 'C_DIR',
                },
                basic_params: {
                    files: [files]
                },
                extra_params: {
                    number: doc.number,
                    company: doc.company,
                    time: doc.time,
                    remark: this.state.genders,
                    type: doc.type,
                    lasttime: doc.lastModifiedDate,
                    state: '正常文档',
                    submitTime: moment.utc().format()
                },
            });
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
        })
    }

}
export default Form.create()(Addition);
