import React, { Component } from 'react';
import { Button, Modal, Form, Row, DatePicker, Select, Input, Notification, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class AuxiliaryAcceptanceModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
    };

    render () {
        const {
            form: { getFieldDecorator },
            regionArea = 0,
            regionSectionName,
            regionThinName,
            noLoading
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this._handleTaskModalCancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this._handleTaskModalOk.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = noLoading ? null : arr;
        console.log('noLoading', noLoading);
        return (

            <Modal
                title='新建任务'
                visible
                width='700px'
                footer={footer}
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={noLoading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='养护类型'>
                                {getFieldDecorator('taskType', {
                                    rules: [
                                        { required: true, message: '请选择养护类型' }
                                    ]
                                })(
                                    <Select placeholder={'请选择养护类型'} />
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
                                        format='YYYY-MM-DD HH:mm:ss'
                                        placeholder={['计划开始时间', '计划结束时间']}
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='面积(亩)'>
                                {getFieldDecorator('taskTreeArea', {
                                    initialValue: `${regionArea}`,
                                    rules: [
                                        { required: true, message: '请输入面积' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='标段'>
                                {getFieldDecorator('taskSection', {
                                    initialValue: `${regionSectionName}`,
                                    rules: [
                                        { required: true, message: '请输入标段名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='细班'>
                                {getFieldDecorator('taskThinClass', {
                                    initialValue: `${regionThinName}`,
                                    rules: [
                                        { required: true, message: '请输入细班名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        {/* <Row>
                            <FormItem {...FormItemLayout} label='树木数量(棵)'>
                                {getFieldDecorator('taskTreeNum', {
                                    initialValue: `${treeNum}`,
                                    rules: [
                                        { required: true, message: '请输入树木数量' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row> */}
                        {/* <Row>
                        <FormItem {...FormItemLayout} label='备注'>
                            {getFieldDecorator('taskRemark', {
                                rules: [
                                    { required: false, message: '请输入备注' }
                                ]
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Row> */}
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
        console.log('this.props', this.props);
        const {
            regionThinNo,
            regionSectionNo,
            wkt,
            actions: {
                postCuringTask
            }
        } = this.props;

        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                try {
                    let CuringMans = '';
                    let postData = {
                        'Area': Number(values.taskTreeArea),
                        'CuringGroup': values.taskTeam,
                        'CuringMans': CuringMans,
                        'CuringMode': 0,
                        'CuringType': values.taskType,
                        'Num': 0,
                        'PlanEndTime': moment(values.taskTime[1]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanStartTime': moment(values.taskTime[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanWKT': wkt,
                        'Section': regionSectionNo,
                        'ThinClass': regionThinNo
                    };
                    let taskData = await postCuringTask({}, postData);
                    console.log('taskData', taskData);
                    if (taskData && taskData.code && taskData.code === 1) {
                        Notification.success({
                            message: '下发任务成功',
                            dutation: 3
                        });
                        await this.props.onOk();
                    } else {
                        Notification.error({
                            message: '下发任务失败',
                            dutation: 3
                        });
                    }
                } catch (e) {
                    console.log('e', e);
                }
            }
        });
    }
}
export default Form.create()(AuxiliaryAcceptanceModal);
