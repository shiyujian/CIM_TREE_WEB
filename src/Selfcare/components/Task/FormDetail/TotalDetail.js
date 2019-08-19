import React, { Component } from 'react';
import {
    Table,
    Form,
    Row,
    Col,
    Input,
    Card,
    Divider,
    Notification
} from 'antd';
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
class TotalDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '10%',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '文件名',
            dataIndex: 'name',
            width: '10%'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: '10%'
        },
        {
            title: '操作',
            dataIndex: 'active',
            width: '10%',
            render: (text, record) => {
                return <div>
                    <a href={record.url} target='_blank'>下 载</a>
                </div>;
            }
        }
    ];
    render () {
        const {
            param,
            TableList,
            form: { getFieldDecorator }
        } = this.props;
        console.log('详情页面', param, TableList);
        return (<div>
            <Form layout='inline'>
                <Row gutter={15}>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='标段:'
                        >
                            {getFieldDecorator('Section', {
                                initialValue: param.Section,
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入标段'
                                    }
                                ]
                            })(
                                <Input readOnly style={{width: 220}} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='编号:'
                        >
                            {getFieldDecorator('NumberCode', {
                                initialValue: param.NumberCode,
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入编号'
                                    }
                                ]
                            })(<Input readOnly style={{width: 220}} />)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            {...formItemLayout}
                            label='文档类型:'
                        >
                            {getFieldDecorator('FileType', {
                                initialValue: param.FileType,
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入文档类型'
                                    }
                                ]
                            })(<Input readOnly style={{width: 220}} />)}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={this.columns}
                            pagination
                            dataSource={TableList}
                        />
                    </Col>
                </Row>
            </Form>
        </div>);
    }
}
export default Form.create()(TotalDetail);

