import React, { Component } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    message
} from 'antd';
import { getUser } from '_platform/auth';
import moment from 'moment';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class CheckUserModal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            searchValue: '',
            idImgF: true,
            idImgZ: true,
            change_alValue: null
        };
    }

    checkCheckInfo = async (rule, value, callback) => {
        if (value) {
            if (value.length > 30) {
                callback(`请输入少于20个字`);
            } else {
                callback();
            }
        } else {
            callback();
        }
    }

    render () {
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        };
        return (
            <Modal
                visible
                title='审核'
                onOk={this.handleAudit.bind(this)}
                onCancel={this.handleCancel.bind(this)}
            >
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label='审核结果'
                    >
                        {getFieldDecorator('CheckStatus', {
                            rules: [{required: true, message: '必填项'}]
                        })(
                            <Select style={{ width: 150 }} allowClear>
                                <Option value={1}>审核通过</Option>
                                <Option value={2}>审核不通过</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='审核备注'
                    >
                        {getFieldDecorator('CheckInfo', {
                            rules: [
                                {
                                    required: false,
                                    message: '请输入少于20个字'
                                },
                                {
                                    validator: this.checkCheckInfo
                                }
                            ]
                        })(
                            <TextArea rows={4} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

    // 确认审核
    handleAudit () {
        const {
            actions: {
                checkUsers
            },
            record
        } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                checkUsers({}, {
                    ID: record.ID + '',
                    Checker: getUser().ID,
                    CheckTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    CheckInfo: values.CheckInfo || '用户信息填写有误',
                    CheckStatus: values.CheckStatus
                }).then(rep => {
                    if (rep && rep.code && rep.code === 1) {
                        message.success('审核成功');

                        this.props.handleSuccessCheckModal();
                    } else {
                        message.error('审核失败');
                        this.props.handleCloseCheckModal();
                    }
                });
            }
        });
    }

    handleCancel () {
        this.props.handleCloseCheckModal();
    }
}
export default Form.create()(CheckUserModal);
