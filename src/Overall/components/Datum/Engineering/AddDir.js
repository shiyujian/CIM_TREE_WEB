import React, { Component } from 'react';
import {
    Form,
    Modal,
    Button,
    Notification,
    Row,
    Input,
    Col,
    Select,
    Spin
} from 'antd';
import moment from 'moment';
import {getUser} from '_platform/auth';
const FormItem = Form.Item;
const { Option } = Select;

class AddDir extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    createNewDir = async () => {
        let {
            actions: {
                postBatchAddDir,
                setGetDirStatus
            },
            form: { validateFields },
            leftKeyCode,
            selectProject
        } = this.props;
        const user = getUser();
        validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                let postData = {
                    Creater: user.ID,
                    DirDescribe: values.dirDescribe,
                    DirName: values.dirName,
                    DirType: '前期资料',
                    OrgType: values.company,
                    ParentID: ''
                };
                let dirData = await postBatchAddDir({projectID: selectProject.ID}, postData);
                console.log('dirData', dirData);
                this.setState({
                    loading: false
                });
                if (dirData && dirData.code) {
                    if (dirData.code === 1) {
                        Notification.success({
                            message: '新增目录成功！',
                            duration: 3
                        });
                        setGetDirStatus(moment().unix());
                        this.props.handleCloseAddModal();
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
        const {
            loading
        } = this.state;
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
                    <Spin tip='加载中' spinning={loading}>
                        <Form>
                            <FormItem {...FormItemLayout} label='公司类型'>
                                {getFieldDecorator('company', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择公司类型'
                                        }
                                    ]
                                })(
                                    <Select
                                        placeholder='请选择公司类型'
                                        style={{ width: '100%' }}
                                    >
                                        <Option key={'施工单位'} value={'施工单位'}>
                                        施工单位
                                        </Option>
                                        <Option key={'监理单位'} value={'监理单位'}>
                                        监理单位
                                        </Option>
                                        <Option key={'业主单位'} value={'业主单位'}>
                                        业主单位
                                        </Option>
                                        <Option key={'养护单位'} value={'养护单位'}>
                                        养护单位
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...FormItemLayout} label='目录名称'>
                                {getFieldDecorator('dirName', {
                                    initialValue: '',
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
                    </Spin>
                </div>
            </Modal>
        );
    }
}
export default Form.create()(AddDir);
