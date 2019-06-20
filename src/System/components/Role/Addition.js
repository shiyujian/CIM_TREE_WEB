import React, { Component } from 'react';
import { Modal, Form, Input, Notification } from 'antd';

const FormItem = Form.Item;

export default class Info extends Component {
    static propTypes = {};

    render () {
        const {
            addition = {},
            actions: { changeAdditionField }
        } = this.props;
        return (
            <Modal
                title='添加角色'
                visible={addition.visible}
                maskClosable={false}
                onOk={this.save.bind(this)}
                onCancel={this.cancel.bind(this)}
            >
                <FormItem {...Info.layout} label='角色名称'>
                    <Input
                        placeholder='请输入角色名称'
                        value={addition.name}
                        onChange={changeAdditionField.bind(this, 'name')}
                    />
                </FormItem>
                <FormItem {...Info.layout} label='角色描述'>
                    <Input
                        placeholder='请输入描述'
                        value={addition.description}
                        onChange={changeAdditionField.bind(this, 'description')}
                    />
                </FormItem>
            </Modal>
        );
    }

    save () {
        const {
            addition = {},
            actions: { getRoles, postRole, clearAdditionField, putRole }
        } = this.props;
        if (!addition.name) {
            Notification.error({
                message: '请输入角色名称',
                duration: 2
            });
        } else {
            if (addition.id) {
                putRole(
                    { id: addition.id },
                    {
                        name: addition.name,
                        permissions: [],
                        grouptype: addition.type,
                        description: addition.description
                    }
                ).then(rst => {
                    if (rst.id) {
                        Notification.success({
                            message: '角色创建成功',
                            duration: 3
                        });
                        clearAdditionField();
                        getRoles();
                    } else if (rst && rst.name && rst.name[0] === 'group with this name already exists.') {
                        Notification.error({
                            message: '角色名称已存在',
                            duration: 3
                        });
                    }
                });
            } else {
                postRole(
                    {},
                    {
                        name: addition.name,
                        permissions: [],
                        grouptype: addition.type,
                        description: addition.description
                    }
                ).then(rst => {
                    console.log('rst', rst);
                    if (rst.id) {
                        Notification.success({
                            message: '角色创建成功',
                            duration: 3
                        });
                        clearAdditionField();
                        getRoles();
                    } else if (rst && rst.name && rst.name[0] === 'group with this name already exists.') {
                        Notification.error({
                            message: '角色名称已存在',
                            duration: 3
                        });
                    }
                });
            }
        }
    }

    cancel () {
        const {
            actions: { clearAdditionField }
        } = this.props;
        clearAdditionField();
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
}
