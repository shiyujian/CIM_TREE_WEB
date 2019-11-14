import React, { Component } from 'react';
import {
    Modal,
    Row,
    Button,
    Form,
    Input,
    Notification
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../index.less';
const FormItem = Form.Item;

class MachineQRCodeAddModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tblData: [],
            pagination: {},
            loading: false,
            size: 10,
            exportsize: 100,
            percent: 0,
            recordDetail: ''
        };
    }
    checkMachineIDSame = async (rule, value, callback) => {
        const {
            form: {
                getFieldValue
            }
        } = this.props;
        let machineID = getFieldValue('machineID');
        if (value) {
            if (machineID === value) {
                callback();
            } else {
                callback(`请保持两次输入的设备ID一致`);
            }
        }
    }
    checkSIMID = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^\d{1,}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入正确的SIM卡号`);
                }
            } else {
                callback(`请输入正确的SIM卡号`);
            }
        } else {
            callback();
        }
    }
    checkSIMIDSame = async (rule, value, callback) => {
        const {
            form: {
                getFieldValue
            }
        } = this.props;
        let machineSIMID = getFieldValue('machineSIMID');
        if (value) {
            if (machineSIMID === value) {
                callback();
            } else {
                callback(`请保持两次输入的SIM卡号一致`);
            }
        }
    }
    handleAddMachineQRCodeOK = async () => {
        const {
            actions: {
                postLocationDevice
            }
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let postData = {
                    CarNo: values.machineID,
                    DeviceType: values.machineType,
                    LicensePlate: '',
                    SimNo: values.machineSIMID
                };
                let data = await postLocationDevice({}, postData);
                console.log('data', data);
                if (data && data.code && data.code === 1) {
                    Notification.success({
                        message: '新增定位设备成功',
                        duration: 3
                    });
                    await this.props.handleAddMachineQRCodeCancel(true);
                } else {
                    Notification.error({
                        message: '新增定位设备失败',
                        duration: 3
                    });
                }
            }
        });
    }
    handleAddMachineQRCodeCancel = () => {
        this.props.handleAddMachineQRCodeCancel();
    }
    render () {
        const {
            loading
        } = this.state;
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        const layout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 }
        };
        return (
            <Modal
                width={800}
                title='新增定位设备'
                style={{ textAlign: 'center' }}
                visible
                onOk={this.handleAddMachineQRCodeCancel.bind(this)}
                onCancel={this.handleAddMachineQRCodeCancel.bind(this)}
                footer={null}
            >
                <div>
                    <Form>
                        <FormItem
                            {...layout}
                            label='设备ID:'
                        >
                            {getFieldDecorator('machineID', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入设备ID'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入设备ID'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...layout}
                            label='设备ID:'
                        >
                            {getFieldDecorator('machineID2', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请保持两次输入的设备ID一致'
                                    },
                                    {
                                        validator: this.checkMachineIDSame
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请再次输入设备ID'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...layout}
                            label='SIM卡号:'
                        >
                            {getFieldDecorator('machineSIMID', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入正确的SIM卡号'
                                    },
                                    {
                                        validator: this.checkSIMID
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入SIM卡号'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...layout}
                            label='SIM卡号:'
                        >
                            {getFieldDecorator('machineSIMID2', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请保持两次输入的SIM卡号一致'
                                    },
                                    {
                                        validator: this.checkSIMIDSame
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请再次输入SIM卡号'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...layout}
                            label='设备型号:'
                        >
                            {getFieldDecorator('machineType', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入设备型号'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder='请输入设备型号'
                                />
                            )}
                        </FormItem>
                    </Form>
                    <Row style={{ marginTop: 10 }}>
                        <Button
                            onClick={this.handleAddMachineQRCodeOK.bind(this)}
                            style={{ float: 'right', marginLeft: 20 }}
                            type='primary'
                        >
                            确定
                        </Button>
                        <Button
                            onClick={this.handleAddMachineQRCodeCancel.bind(this)}
                            style={{ float: 'right' }}
                        >
                            关闭
                        </Button>

                    </Row>
                </div>

            </Modal>
        );
    }
}
export default Form.create()(MachineQRCodeAddModal);
