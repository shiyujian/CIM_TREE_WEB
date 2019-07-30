import React, { Component } from 'react';
import moment from 'moment';
import {
    Table,
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Divider,
    Notification
} from 'antd';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
class WeekDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    render () {
        const {
            param,
            TableList
        } = this.props;
        return (<div>
            <Form {...formItemLayout} layout='inline'>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label='标段:'
                        >
                            <Input value={param.Section} disabled style={{width: 220}} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem
                            label='开始日期'
                        >
                            <DatePicker
                                style={{width: 220}}
                                disabled
                                value={moment(param.StartDate, dateFormat)}
                                format={dateFormat}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label='结束日期'
                        >
                            <DatePicker
                                style={{width: 220}}
                                disabled
                                value={moment(param.EndDate, dateFormat)}
                                format={dateFormat}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            pagination={false}
                            columns={this.columns}
                            bordered
                            dataSource={TableList}
                            rowKey='ID'
                            className='foresttable'
                        />
                    </Col>
                </Row>
            </Form>
        </div>);
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '33%',
            render: (text, record, index) => {
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
            width: '34%',
            render: (text, record, index) => {
                if (record && record.planTreeNum) {
                    return <span>{record.planTreeNum}</span>;
                } else {
                    return <span>0</span>;
                }
            }
        }
    ]
}
export default Form.create()(WeekDetail);
