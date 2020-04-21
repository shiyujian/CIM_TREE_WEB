import React, {
    Component
} from 'react';
import {
    Icon,
    Button,
    Input,
    Modal,
    Select,
    Spin,
    Row,
    Col,
    Form,
    Notification
} from 'antd';
import { renderStatic } from 'react-helmet';
const { TextArea } = Input;
const { Option } = Select;
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
class EditCheckModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount () {
    }
    handleOk () {
        const {
            record,
            actions: { putWfreAcceptance },
            form: { validateFields }
        } = this.props;
        validateFields(async (err, values) => {
            if (err) {
                return;
            }
            let rst = await putWfreAcceptance({}, {
                ID: record.ID,
                Supervisor: values.supervisor,
                Owner: values.owner
            });
            if (rst && rst.code === 1) {
                Notification.success({
                    message: '修改审核人成功',
                    duration: 3
                });
                this.props.query(1);
                this.props.handleCancel();
            } else {
                Notification.error({
                    message: rst.msg || '修改审核人失败，请联系管理员确认',
                    duration: 3
                });
            }
        });
    }
    render () {
        const {
            record,
            jianliOptions,
            yezhuOptions,
            form: {
                getFieldDecorator
            }
        } = this.props;
        let loading = true;
        if (jianliOptions && yezhuOptions && jianliOptions.length > 0 && yezhuOptions.length > 0) {
            loading = false;
        }
        return (<div>
            <Modal
                title='修改审核人'
                okText='提交'
                visible
                onCancel={this.props.handleCancel}
                onOk={this.handleOk.bind(this)}
            >
                <Spin spinning={loading}>
                    <Form {...formItemLayout}>
                        <Form.Item
                            label='审核监理'
                            style={{marginBottom: 0}}
                        >
                            {
                                getFieldDecorator('supervisor', {
                                    rules: [{ required: true, message: '请选择' }],
                                    initialValue: (record.SupervisorObj && record.SupervisorObj.ID) || ''
                                })(
                                    <Select
                                        allowClear showSearch
                                        filterOption={
                                            (input, option) => {
                                                return option.props.children[0]
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0;
                                            }
                                        }
                                        style={{ width: 223 }}>
                                        {jianliOptions}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item label='审核业主' style={{marginBottom: 0}} >
                            {
                                getFieldDecorator('owner', {
                                    rules: [{ required: true, message: '请选择' }],
                                    initialValue: (record.OwnerObj && record.OwnerObj.ID) || ''
                                })(
                                    <Select
                                        allowClear showSearch
                                        filterOption={
                                            (input, option) => {
                                                return option.props.children[0]
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0 || option.props.children[2]
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0;
                                            }
                                        }
                                        style={{ width: 223 }}>
                                        {yezhuOptions}
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>);
    }
}
export default Form.create()(EditCheckModal);
