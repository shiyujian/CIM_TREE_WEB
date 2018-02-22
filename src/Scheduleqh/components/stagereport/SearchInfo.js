import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import {  UNITS } from '../../../_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;


export default class SearchInfo extends Component {
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
                                        getFieldDecorator('sunitproject', {
                                            rules: [
                                                { required: false, message: '请选择单位工程' }
                                            ]
                                        })
                                            (<Select placeholder='请选择单位工程' allowClear>
                                                {UNITS.map(d => <Option key={d.value} value={d.value}>{d.value}</Option>)}
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='编号'>
                                    {
                                        getFieldDecorator('snumbercode', {
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
                                        getFieldDecorator('ssuperunit', {
                                            rules: [
                                                { required: false, message: '请输入监理单位' }
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
                                        getFieldDecorator('stimedate', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择时期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='YYYY-MM-DD'  />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...SearchInfo.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('sstatus', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型' allowClear>
                                                <Option key={Math.random*4} value={0}>编辑中</Option>
                                                <Option key={Math.random*5} value={1}>已提交</Option>
                                                <Option key={Math.random*6} value={2}>执行中</Option>
                                                <Option key={Math.random*7} value={3}>已完成</Option>
                                                <Option key={Math.random*8} value={4}>已废止</Option>
                                                <Option key={Math.random*9} value={5}>异常</Option>
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
        this.props.gettaskSchedule()
    }

    clear() {
        this.props.form.setFieldsValue({
            sunitproject: undefined,
            snumbercode: undefined,
            stimedate: undefined,
            sstatus: undefined,
            ssuperunit: undefined
        })
    }
}

// export default SearchInfo = Form.create()(SearchInfo);