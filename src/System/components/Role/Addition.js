import React, { Component } from 'react';
import { Modal, Form, Input, Notification } from 'antd';

const FormItem = Form.Item;

class Addition extends Component {
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
                <FormItem {...Addition.layout} label='角色名称'>
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
                <FormItem {...Addition.layout} label='角色描述'>
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
                postRole
            },
            additionType
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let postData = {
                    ParentID: additionType,
                    Remark: values.description,
                    RoleName: values.RoleName
                };
                let rst = await postRole({}, postData);
                console.log('rst', rst);
                if (rst && rst.code && rst.code === 1) {
                    Notification.success({
                        message: '角色创建成功',
                        duration: 3
                    });
                    await getRoles();
                    this.props.handleCloseAdditionModal();
                } else if (rst && rst.code && rst.code === 2) {
                    Notification.error({
                        message: '当前角色名已存在，请重新创建',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '角色创建失败',
                        duration: 3
                    });
                }
            }
        });
    }

    cancel () {
        this.props.handleCloseAdditionModal();
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
}
export default Form.create()(Addition);
