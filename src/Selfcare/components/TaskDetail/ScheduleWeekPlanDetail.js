import React, { Component } from 'react';
import { Table, Form, Row, Col, Input, Card } from 'antd';
import Preview from '../../../_platform/components/layout/Preview';

const FormItem = Form.Item;
class ScheduleWeekPlanDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
            record: {}
        };
    }

    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '33%',
            render: (record, text, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: '33%'
        },
        {
            title: '计划栽植量',
            dataIndex: 'planTreeNum',
            key: 'planTreeNum',
            width: '34%'
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
                                <FormItem {...ScheduleWeekPlanDetail.layout} label='标段:'>
                                    {getFieldDecorator('daysection', {
                                        initialValue: `${record.sectionName ? record.sectionName : '暂无标段'}`,
                                        rules: [{ required: false, message: '请输入标段' }]
                                    })(<Input readOnly />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...ScheduleWeekPlanDetail.layout} label='日期:'>
                                    {getFieldDecorator('daytimedate', {
                                        initialValue: `${record.stime
                                            ? (record.stime + ' ~ ' + record.etime)
                                            : '暂无日期'}`,
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
                            pagination
                            dataSource={record.weekPlanDataSource}
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
            section: subject.section
                ? JSON.parse(subject.section)
                : '',
            sectionName: subject.sectionName
                ? JSON.parse(subject.sectionName)
                : '',
            projectName: subject.projectName
                ? JSON.parse(subject.projectName)
                : '',
            stime: subject.stime
                ? JSON.parse(subject.stime)
                : '',
            etime: subject.etime
                ? JSON.parse(subject.etime)
                : '',
            weekPlanDataSource: subject.weekPlanDataSource
                ? JSON.parse(subject.weekPlanDataSource)
                : [],
            supervisorReview: subject.supervisorReview
                ? JSON.parse(subject.supervisorReview).person_name
                : ''
        };
        return record;
    }
}
export default Form.create()(ScheduleWeekPlanDetail);
