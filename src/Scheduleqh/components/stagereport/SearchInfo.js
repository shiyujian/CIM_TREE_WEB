import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SearchInfo extends Component {
    static propType = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };

    render() {
        const {
            form: { getFieldDecorator }
        } = this.props

        return (
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='单位工程'>
                                    {
                                        getFieldDecorator('unit', {
                                            rules: [
                                                { required: false, message: '请选择单位工程' }
                                            ]
                                        })
                                            (<Select placeholder='请选择区域' allowClear>
                                                <Option value='单位工程一'>单位工程一</Option>
                                                <Option value='单位工程二'>单位工程二</Option>
                                                <Option value='单位工程三'>单位工程三</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='编号'>
                                    {
                                        getFieldDecorator('numbercode', {
                                            rules: [
                                                { required: false, message: '请输入编号' }
                                            ]
                                        })
                                            (<Input placeholder='请输入编号' />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='监理单位'>
                                    {
                                        getFieldDecorator('superunit', {
                                            rules: [
                                                { required: true, message: '请输入监理单位' }
                                            ]
                                        })
                                            (<Input placeholder='请输入监理单位' />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='日期'>
                                    {
                                        getFieldDecorator('date', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择时期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='' YYYY年MM月DD日 />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('status', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型' allowClear>
                                                <Option value='0'>编辑中</Option>
                                                <Option value='1'>已提交</Option>
                                                <Option value='2'>执行中</Option>
                                                <Option value='3'>已完成</Option>
                                                <Option value='4'>已废止</Option>
                                                <Option value='5'>异常</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button type='Primary' onClick={this.query.bind(this)}>查询</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>清除</Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>

            </Form>
        )
    }

    query() {
        alert('查询还未做')
    }

    clear() {
        this.props.form.setFieldsValue({
            unit: undefined,
            numbercode: undefined,
            date: undefined,
            status: undefined,
            superunit: undefined
        })
    }
}

export default SearchInfo = Form.create()(SearchInfo);