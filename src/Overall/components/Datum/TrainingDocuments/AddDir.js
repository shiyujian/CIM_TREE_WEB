import React, { Component } from 'react';
import {
    Form,
    Modal,
    Button,
    Notification,
    Row,
    Input,
    Col
} from 'antd';
import moment from 'moment';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;

class AddDir extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    createNewDir = async () => {
        let {
            actions: {
                postAddDir
            },
            form: { validateFields },
            leftKeyCode,
            ownerCompany
        } = this.props;
        const user = getUser();
        validateFields(async (err, values) => {
            if (!err) {
                let postData = {
                    Creater: user.ID,
                    DirDescribe: values.dirDescribe,
                    DirName: values.dirName,
                    DirType: '培训文档',
                    OrgID: ownerCompany.ID,
                    OrgName: ownerCompany.OrgName,
                    OrgType: ownerCompany.OrgType,
                    ParentID: leftKeyCode || ''
                };
                let dirData = await postAddDir({}, postData);
                console.log('dirData', dirData);
                if (dirData && dirData.code) {
                    if (dirData.code === 1) {
                        Notification.success({
                            message: '新增目录成功！',
                            duration: 3
                        });
                        this.props.handleCloseAddModalOk();
                    } else if (dirData.code === 2) {
                        Notification.info({
                            message: '文件目录已存在！',
                            duration: 3
                        });
                    } else {
                        Notification.error({
                            message: '新增目录失败！',
                            duration: 3
                        });
                    }
                } else {
                    Notification.error({
                        message: '新增目录失败！',
                        duration: 3
                    });
                }
            }
        });
    }

    goCancel () {
        this.props.handleCloseAddModal();
    }
    render () {
        const {
            form: { getFieldDecorator },
            addVisible
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <Modal
                title='新增目录'
                visible={addVisible}
                closable
                onCancel={this.goCancel.bind(this)}
                footer={null}
                maskClosable={false}
            >
                <div>
                    <Form>
                        <FormItem {...FormItemLayout} label='目录名称'>
                            {getFieldDecorator('dirName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入目录名称'
                                    }
                                ]
                            })(<Input placeholder='请输入目录名称' />)}
                        </FormItem>
                        <FormItem {...FormItemLayout} label='目录说明'>
                            {getFieldDecorator('dirDescribe', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入目录说明'
                                    }
                                ]
                            })(<Input placeholder='请输入目录说明' />)}
                        </FormItem>
                        <Row style={{ marginTop: 20 }}>
                            <div style={{float: 'right'}}>
                                <Button
                                    style={{marginLeft: 30}}
                                    onClick={this.goCancel.bind(this)}>
                                    取消
                                </Button>
                                <Button
                                    style={{ marginLeft: 20 }}
                                    type='primary'
                                    onClick={this.createNewDir.bind(this)}>
                                        创建
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}
export default Form.create()(AddDir);
