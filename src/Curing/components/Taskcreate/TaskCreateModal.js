import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PersonTree from './PersonTree';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TaskCreateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {};

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <Modal
                title='新建任务'
                onOk={this.handleTaskModalOk.bind(this)}
                onCancel={this.props.onCancel}
                visible
                style={{width: '100%'}}
            >
                <Form>
                    <Row>
                        <FormItem {...FormItemLayout} label='养护类型'>
                            {getFieldDecorator('taskType', {
                                rules: [
                                    { required: true, message: '请选择养护类型' }
                                ]
                            })(
                                <Select placeholder={'请选择养护类型'}>
                                    <Option key='1' value='浇水'>浇水</Option>
                                    <Option key='2' value='除草'>除草</Option>
                                    <Option key='3' value='施肥与土壤改良'>施肥与土壤改良</Option>
                                    <Option key='4' value='修剪'>修剪</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='任务时间'>
                            {getFieldDecorator('taskTime', {
                                rules: [
                                    { required: true, message: '请选择任务时间' }
                                ]
                            })(
                                <RangePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm'
                                    placeholder={['Start Time', 'End Time']}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='养护人员'>
                            {getFieldDecorator('taskPerson', {
                                rules: [
                                    { required: true, message: '请选择养护人员' }
                                ]
                            })(
                                <PersonTree {...this.props} />
                            )}
                        </FormItem>
                    </Row>
                </Form>
            </Modal>
        );
    }

    // 下发任务
    handleTaskModalOk = () => {
        console.log('this.props', this.props);
        this.props.form.validateFields((err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                let taskType = values.taskType;
                let taskTime = values.taskTime;
                this.props.onCancel();
            }
        });
    }
}
export default Form.create()(TaskCreateModal);
