import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, DatePicker, Select, Input, Notification, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class TaskReportModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount = async () => {

    };

    componentDidUpdate (prevProps, prevState) {
        const {
            noLoading
        } = this.props;
        if (noLoading && noLoading !== prevProps.noLoading) {
            this._setFormData();
            this.setState({
                loading: false
            });
        }
    }
    _setFormData () {
        const {
            form: {
                setFieldsValue
            },
            taskMess
        } = this.props;
        if (taskMess) {
            setFieldsValue({
                taskType: taskMess.typeName ? taskMess.typeName : '',
                taskCreateTime: taskMess.CreateTime ? taskMess.CreateTime : '',
                taskPlanTime: (taskMess.PlanStartTime && taskMess.PlanEndTime) ? `${taskMess.PlanStartTime} ~ ${taskMess.PlanEndTime}` : '',
                taskRealTime: (taskMess.StartTime && taskMess.EndTime) ? `${taskMess.StartTime} ~ ${taskMess.EndTime}` : ''
            });
        } else {
            setFieldsValue({
                taskType: '',
                taskCreateTime: '',
                taskPlanTime: '',
                taskRealTime: ''
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            isShowTaskModal
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <Modal
                title='新建任务'
                onOk={this._handleTaskModalOk.bind(this)}
                onCancel={this._handleTaskModalCancel.bind(this)}
                visible={isShowTaskModal}
                width='700px'
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护类型'>
                                {getFieldDecorator('taskType', {
                                    rules: [
                                        { required: true, message: '请选择养护类型' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务创建时间'>
                                {getFieldDecorator('taskCreateTime', {
                                    rules: [
                                        { required: true, message: '请输入任务创建时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务计划时间'>
                                {getFieldDecorator('taskPlanTime', {
                                    rules: [
                                        { required: true, message: '请输入任务计划时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='任务实际时间'>
                                {getFieldDecorator('taskRealTime', {
                                    rules: [
                                        { required: true, message: '请输入任务实际时间' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                    </Form>
                </Spin>
            </Modal>

        );
    }

    _handleTaskModalCancel = async () => {
        await this.props.onCancel();
    }

    // 下发任务
    _handleTaskModalOk = async () => {
        await this.props.onCancel();
        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
            }
        });
    }
}
export default Form.create()(TaskReportModal);
