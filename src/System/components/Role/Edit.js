import React, { Component } from 'react';
import { Modal, Form, Input, Notification } from 'antd';

const FormItem = Form.Item;

class Edit extends Component {
    componentDidMount = async () => {
        const {
            form: {
                setFieldsValue
            },
            editRole
        } = this.props;
        setFieldsValue({
            RoleName: editRole.RoleName,
            description: editRole.Remark || ''
        });
    }
    render () {
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        return (
            <Modal
                title='添加角色'
                visible
                maskClosable={false}
                onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <FormItem {...Edit.layout} label='角色名称'>
                    {getFieldDecorator('RoleName', {
                        rules: [
                            {
                                required: true,
                                message: '请输入角色名称'
                            }
                        ]
                    })(
                        <Input
                            placeholder='请输入角色名称'
                        />
                    )}
                </FormItem>
                <FormItem {...Edit.layout} label='角色描述'>
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                required: false,
                                message: '请输入描述'
                            }
                        ]
                    })(
                        <Input
                            placeholder='请输入描述'
                        />
                    )}
                </FormItem>
            </Modal>
        );
    }

    save = async () => {
        const {
            actions: {
                getRoles,
                putRole
            },
            editRole
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let postData = {
                    ID: editRole.ID,
                    ParentID: editRole.ParentID,
                    Remark: values.description,
                    RoleName: values.RoleName
                };
                let rst = await putRole({}, postData);
                if (rst && rst.code && rst.code === 1) {
                    Notification.success({
                        message: '角色修改成功',
                        duration: 3
                    });
                    await getRoles();
                    this.props.handleCloseEditModal();
                } else {
                    Notification.error({
                        message: '角色修改失败',
                        duration: 3
                    });
                }
            }
        });
    }

    cancel () {
        this.props.handleCloseEditModal();
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
}
export default Form.create()(Edit);
