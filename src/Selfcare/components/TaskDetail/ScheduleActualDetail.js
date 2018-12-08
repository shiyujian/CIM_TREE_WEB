import React, { Component } from 'react';
import { Table, Form, Row, Col, Input, Card } from 'antd';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
class ScheduleActualDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    columns1 = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
            render: (text, record, index) => {
                return <span>{record.key + 1}</span>;
            }
        },
        {
            title: '类别',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => {
                const obj = {
                    children: text,
                    props: {}
                };
                if (record.typeFirst) {
                    obj.props.rowSpan = record.typeList;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        },
        {
            title: '项目',
            dataIndex: 'project',
            key: 'project'
        },
        {
            title: '单位',
            dataIndex: 'units',
            key: 'units'
        },
        {
            title: '数量',
            dataIndex: 'actualNum',
            key: 'actualNum'
        }
    ];

    render () {
        const {

            form: { getFieldDecorator },
            platform: { task = {} } = {}
        } = this.props;
        let record = {};
        if (task && task.subject) {
            record = this.getTable(task);
        }

        return (
            <Card title={'流程详情'}>
                <Row gutter={24}>
                    <Col span={24} >
                        <Row gutter={15} >
                            <Col span={12}>
                                <FormItem {...ScheduleActualDetail.layout} label='标段:'>
                                    {getFieldDecorator('actualSection', {
                                        initialValue: `${record.sectionName ? record.sectionName : '暂无标段'}`,
                                        rules: [{ required: false, message: '请输入标段' }]
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...ScheduleActualDetail.layout} label='日期:'>
                                    {getFieldDecorator('actualTimeDate', {
                                        initialValue: `${record.actualTimeDate ? record.actualTimeDate : '暂无日期'}`,
                                        rules: [
                                            { required: false, message: '请输入日期' }
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
                            columns={this.columns1}
                            pagination={false}
                            bordered
                            dataSource={record.actualDataSource}
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
            'id': instance.id,
            'actualDataSource': subject.actualDataSource ? JSON.parse(subject.actualDataSource) : '',
            'section': subject.section ? JSON.parse(subject.section) : '',
            'sectionName': subject.sectionName ? JSON.parse(subject.sectionName) : '',
            'actualTimeDate': subject.actualTimeDate ? JSON.parse(subject.actualTimeDate) : ''
        };
        return record;
    }
}
export default Form.create()(ScheduleActualDetail);
