import React, { Component } from 'react';
import { Sidebar, DynamicTitle } from '_platform/components/layout';
import {
    Form, Input, Button, Row, Col, message, Popconfirm, DatePicker, Table, Select
} from 'antd';

const FormItem = Form.Item;
const Search = Input.Search;
const { RangePicker } = DatePicker;


import {
    BrowserRouter as Router,
    Route,
    Switch,
    NavLink
} from 'react-router-dom';
class Filter extends Component {

    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    render() {
        const {
        platform: { users = [] },
            form: { getFieldDecorator }
    } = this.props;
        return (
            <Form>
                <Row>
                    <Col span={21}>
                        <Row>
                            <Col span={5}>
                                <FormItem {...Filter.layout} label="物品种类">
                                    {
                                        getFieldDecorator('UnitEngineering', {
                                            rules: [
                                                { required: false, message: '请选择物品种类' },
                                            ]
                                        })
                                            (<Select>
                                                <Option value="0">二维码标签</Option>
                                                <Option value="1">铁丝</Option>
                                                <Option value="1">三防手机</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem {...Filter.layout} label="物品规格">
                                    {
                                        getFieldDecorator('UnitEngineering', {
                                            rules: [
                                                { required: false, message: '请选择物品规格' },
                                            ]
                                        })
                                            (<Select>
                                                <Option value="0">AAA</Option>
                                                <Option value="1">AAB</Option>
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem {...Filter.layout} label="收货人">
                                    {
                                        getFieldDecorator('theme', {
                                            rules: [
                                                { required: false, message: '请输入收货人' },
                                            ]
                                        })
                                            (<Input />)
                                    }
                                </FormItem>
                            </Col>

                            <Col span={5}>
                                <FormItem {...Filter.layout} label="收货单位">
                                    {
                                        getFieldDecorator('numbers', {
                                            rules: [
                                                { required: false, message: '请输入收货单位' },
                                            ]
                                        })
                                            (<Input />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={5}>
                                <FormItem
                                    label="收货时间"
                                    {...Filter.layout}
                                >
                                    <Col span={11}>
                                        <FormItem>
                                            <DatePicker />
                                        </FormItem>
                                    </Col>
                                    <Col span={2}>
                                        <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                            -
                                         </span>
                                    </Col>
                                    <Col span={11}>
                                        <FormItem>
                                            <DatePicker defaultvalue="" />
                                        </FormItem>
                                    </Col>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={2} offset={1}>
                        <Row>
                            <FormItem>
                                <Button
                                    onClick={this.query}>查询</Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>

            </Form>
        );
    }


}
export default Filter = Form.create()(Filter);