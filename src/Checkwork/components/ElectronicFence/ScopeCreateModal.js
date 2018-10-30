import React, { Component } from 'react';
import { Button, Modal, Form, Row, Input, Notification, Spin } from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;

class ScopeCreateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount = async () => {

    };

    render () {
        const {
            form: { getFieldDecorator },
            regionArea = 0,
            parentData,
            groupSelectTitle
        } = this.props;
        const {
            loading
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this._handleScopeModalCancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this._handleScopeModalOk.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = loading ? null : arr;
        return (

            <Modal
                title='新建电子围栏'
                visible
                width='700px'
                footer={footer}
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='公司名称'>
                                {getFieldDecorator('checkCompany', {
                                    initialValue: `${parentData && parentData.name}`,
                                    rules: [
                                        { required: true, message: '请输入公司名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='考勤群体'>
                                {getFieldDecorator('checkGroup', {
                                    initialValue: `${groupSelectTitle}`,
                                    rules: [
                                        { required: true, message: '请输入考勤群体' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='面积(亩)'>
                                {getFieldDecorator('checkArea', {
                                    initialValue: `${regionArea}`,
                                    rules: [
                                        { required: true, message: '请输入面积' }
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

    _handleScopeModalCancel = async () => {
        await this.props.onCancel();
        this.setState({
            loading: false
        });
    }

    // 下发任务
    _handleScopeModalOk = async () => {
        const {
            groupSelectKey,
            coordinates,
            actions: {
                postCheckScope,
                putCheckScope
            },
            scopeAddStatus,
            groupScopeDataList
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    if (scopeAddStatus === '创建') {
                        let postData = {
                            'boundary': coordinates
                        };
                        let scopeData = await postCheckScope({id: groupSelectKey}, postData);
                        if (scopeData && scopeData.id) {
                            Notification.success({
                                message: '电子围栏创建成功',
                                dutation: 3
                            });
                            await this.props.onOk();
                            this.setState({
                                loading: false
                            });
                        } else {
                            Notification.error({
                                message: '电子围栏创建失败',
                                dutation: 3
                            });
                        }
                    } else if (scopeAddStatus === '更新') {
                        let postData = {
                            'boundary': coordinates
                        };
                        let scopeData = await putCheckScope({id: groupScopeDataList[groupSelectKey].id}, postData);
                        if (scopeData && scopeData.id) {
                            Notification.success({
                                message: '电子围栏更新成功',
                                dutation: 3
                            });
                            await this.props.onOk();
                            this.setState({
                                loading: false
                            });
                        } else {
                            Notification.error({
                                message: '电子围栏更新失败',
                                dutation: 3
                            });
                        }
                    }
                } catch (e) {
                    console.log('e', e);
                }
            }
        });
    }
}
export default Form.create()(ScopeCreateModal);