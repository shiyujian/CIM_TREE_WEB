import React, { Component } from 'react';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Row, Col, Tabs, Spin, Modal, Form, Input, Select, Button, Popconfirm, DatePicker } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;

class Modals extends Component {

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    handleCancel() {
        console.log(this.props)
        const { actions: { setModal } } = this.props
        setModal(false)
    }
    render() {
        const {
			platform: { users = [] },
            form: { getFieldDecorator }
		} = this.props;
        const visible = this.props.setModalvisible
        return (
            <Modal
                visible={visible}
                title="新增进场"
                width="50%"
                onOk={this.handleCancel.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                >
                <Form>

                    <Row span={24}>
                        <Col span={12}>
                            <FormItem {...Modals.layout} label="标段">
                                {
                                    getFieldDecorator('status', {
                                        rules: [
                                            { required: false, message: '请输入任务类别' },
                                        ]
                                    })
                                        (<Select allowClear>
                                            <Option value="0">编辑中</Option>
                                            <Option value="1">已提交</Option>
                                            <Option value="2">执行中</Option>
                                            <Option value="3">已完成</Option>
                                            <Option value="4">已废止</Option>
                                            <Option value="5">异常</Option>
                                        </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...Modals.layout} label="进场日期">
                                {
                                    getFieldDecorator('workflowactivity', {
                                        rules: [
                                            { required: false, message: '请输入任务名称' },
                                        ]
                                    })
                                        (<Input placeholder="请输入..." />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row span={24}>
                        <Col span={12}>
                            <FormItem {...Modals.layout} label="工种">
                                {
                                    getFieldDecorator('status', {
                                        rules: [
                                            { required: false, message: '请输入任务类别' },
                                        ]
                                    })
                                        (<Select allowClear>
                                            <Option value="0">编辑中</Option>
                                            <Option value="1">已提交</Option>
                                            <Option value="2">执行中</Option>
                                            <Option value="3">已完成</Option>
                                            <Option value="4">已废止</Option>
                                            <Option value="5">异常</Option>
                                        </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...Modals.layout} label="人员">
                                {
                                    getFieldDecorator('workflowactivity', {
                                        rules: [
                                            { required: false, message: '请输入任务名称' },
                                        ]
                                    })
                                        (<Input placeholder="请输入..." />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Modals = Form.create()(Modals);

