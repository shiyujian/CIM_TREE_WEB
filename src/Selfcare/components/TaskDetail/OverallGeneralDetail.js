import React, { Component } from 'react';
import {
    Table,
    Spin,
    message,
    Modal,
    Button,
    Form,
    Row,
    Col,
    Select,
    Input,
    Icon,
    Card,
    Divider
} from 'antd';
import moment from 'moment';
import {
    WORKFLOW_CODE,
    SOURCE_API,
    base,
    STATIC_DOWNLOAD_API
} from '../../../_platform/api';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;

class OverallGeneralDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            record: {}
        };
    }

    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            width: '35%'
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '30%'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a onClick={this.previewFile.bind(this, record)}>
                            预览
                        </a>
                        <Divider type='vertical' />
                        <a
                            style={{ marginLeft: 10 }}
                            onClick={this.downloadFile.bind(this, record)}
                        >
                            下载
                        </a>
                    </div>
                );
            }
        }
    ];

    equipmentColumns = [
        {
            title: '设备名称',
            dataIndex: 'equipName',
            key: 'equipName'
        },
        {
            title: '规格型号',
            dataIndex: 'equipNumber',
            key: 'equipNumber'
        },
        {
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount'
        },
        {
            title: '进场日期',
            dataIndex: 'equipTime',
            key: 'equipTime'
        },
        {
            title: '技术状况',
            dataIndex: 'equipMoment',
            key: 'equipMoment'
        },
        {
            title: '备注',
            dataIndex: 'equipRemark',
            key: 'equipRemark'
        }
    ];

    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    render () {
        const {
            platform: { task = {} } = {},
            form: { getFieldDecorator }
        } = this.props;
        let record = {};
        if (task && task.subject) {
            record = this.getTable(task);
        }
        return (
            <Card title={'流程详情'}>
                <Row gutter={24}>
                    <Col span={24}>
                        <Row gutter={15}>
                            <Col span={12}>
                                <FormItem
                                    {...OverallGeneralDetail.layout}
                                    label='标段:'
                                >
                                    {getFieldDecorator('sectionName', {
                                        initialValue: `${
                                            record.sectionName
                                                ? record.sectionName
                                                : ''
                                        }`,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入标段'
                                            }
                                        ]
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...OverallGeneralDetail.layout}
                                    label='编号:'
                                >
                                    {getFieldDecorator('code', {
                                        initialValue: `${
                                            record.code ? record.code : ''
                                        }`,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入编号'
                                            }
                                        ]
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Table
                            columns={this.equipmentColumns}
                            dataSource={
                                record.dataSource ? record.dataSource : []
                            }
                            bordered
                            pagination
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{ marginTop: '1em' }}>
                        <Table
                            dataSource={
                                record.TreatmentData ? record.TreatmentData : []
                            }
                            columns={this.columns1}
                            pagination
                        />
                    </Col>
                </Row>
                <Preview />
            </Card>
        );
    }

    getTable (instance) {
        let subject = instance.subject[0];
        let record = {
            id: instance.id,
            TreatmentData: subject.TreatmentData
                ? JSON.parse(subject.TreatmentData)
                : '',
            section: subject.section ? JSON.parse(subject.section) : '',
            sectionName: subject.sectionName
                ? JSON.parse(subject.sectionName)
                : '',
            numbercode: subject.numbercode
                ? JSON.parse(subject.numbercode)
                : '',
            dataSource: subject.dataSource
                ? JSON.parse(subject.dataSource)
                : '',
            code: subject.code ? JSON.parse(subject.code) : ''
        };
        console.log('record', record);
        return record;
    }

    // 下载
    downloadFile (record) {
        console.log('TreatmentData', record);
        let link = document.createElement('a');
        if (record && record.download_url) {
            link.href = STATIC_DOWNLOAD_API + record.download_url;
            link.setAttribute('download', this);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            notification.error({
                message: '文件下载失败',
                duration: 2
            });
        }
    }
    // 文件预览
    previewFile (record, index) {
        const {
            actions: { openPreview }
        } = this.props;

        console.log('record', record);
        let filed = {};
        if (record && record.file_id) {
            filed.misc = 'file';
            filed.a_file = `${SOURCE_API}` + record.a_file;
            filed.download_url = `${STATIC_DOWNLOAD_API}` + record.download_url;
            filed.name = record.fileName;
            filed.id = record.file_id;
            let type = record.a_file.split('.')[1];
            if (
                type == 'xlsx' ||
                type == 'docx' ||
                type == 'xls' ||
                type == 'doc' ||
                type == 'pptx' ||
                type == 'ppt'
            ) {
                filed.mime_type =
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }
            if (type == 'pdf') {
                filed.mime_type = 'application/pdf';
            }
        }
        openPreview(filed);
    }
}

export default Form.create()(OverallGeneralDetail);
