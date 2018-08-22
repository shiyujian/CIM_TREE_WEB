import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    Upload,
    Icon,
    message,
    Table,
    notification
} from 'antd';
const FormItem = Form.Item;

class Edite extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            newKey: Math.random()
        };
    }

    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    render () {
        const {
            form: { getFieldDecorator },
            record = {},
            editVisible
        } = this.props;
        console.log('renderrecord', record);
        console.log('editVisible', editVisible);
        return (
            <div>
                <Modal
                    title='修改苗圃信息'
                    width={920}
                    visible={editVisible}
                    onOk={this.save.bind(this)}
                    key={this.state.newKey}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...Edite.layoutT}
                                            label='供应商:'
                                        >
                                            {getFieldDecorator('EFactory', {
                                                initialValue: `${
                                                    record.Factory
                                                        ? record.Factory
                                                        : ''
                                                }`,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入供应商'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入供应商' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Edite.layoutT}
                                            label='苗圃名称:'
                                        >
                                            {getFieldDecorator('ENurseryName', {
                                                initialValue: `${
                                                    record.NurseryName
                                                        ? record.NurseryName
                                                        : ''
                                                }`,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入苗圃名称'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入苗圃名称' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Edite.layoutT}
                                            label='行政区划:'
                                        >
                                            {getFieldDecorator('ERegionName', {
                                                initialValue: `${
                                                    record.RegionName
                                                        ? record.RegionName
                                                        : ''
                                                }`,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入行政区划'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入行政区划' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Edite.layoutT}
                                            label='行政区划编码:'
                                        >
                                            {getFieldDecorator('ERegionCode', {
                                                initialValue: `${
                                                    record.RegionCode
                                                        ? record.RegionCode
                                                        : ''
                                                }`,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入行政区划编码'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入行政区划编码' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Edite.layoutT}
                                            label='产地:'
                                        >
                                            {getFieldDecorator('ETreePlace', {
                                                initialValue: `${
                                                    record.TreePlace
                                                        ? record.TreePlace
                                                        : ''
                                                }`,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入产地'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入产地' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }

    cancel () {
        const {
            actions: { changeEditVisible }
        } = this.props;
        this.setState({
            newKey: Math.random()
        });
        changeEditVisible(false);
    }

    save () {
        const {
            actions: { putNursery, getNurseryList, changeEditVisible },
            form: { setFieldsValue },
            record
        } = this.props;

        let me = this;
        me.props.form.validateFields((err, values) => {
            console.log('Received err of form: ', err);
            console.log('Received values of form: ', values);
            console.log('Received record of form: ', record);
            if (!err) {
                if (
                    values.EFactory === record.Factory &&
                    values.ENurseryName === record.NurseryName &&
                    values.ERegionCode === record.RegionCode &&
                    values.ERegionName === record.RegionName &&
                    values.ETreePlace === record.TreePlace
                ) {
                    notification.info({
                        message: '请进行修改后再进行提交',
                        duration: 3
                    });
                } else {
                    let postdata = {
                        Factory: values.EFactory,
                        NurseryName: values.ENurseryName,
                        RegionCode: values.ERegionCode,
                        RegionName: values.ERegionName,
                        TreePlace: values.ETreePlace,
                        ID: record.ID
                    };
                    putNursery({}, postdata).then(rst => {
                        if (rst && rst.code) {
                            if (rst.msg && rst.msg === '苗圃已存在') {
                                notification.error({
                                    message: '名称已存在',
                                    duration: 3
                                });
                            } else {
                                notification.success({
                                    message: '更新苗圃信息成功',
                                    duration: 2
                                });
                                getNurseryList();

                                changeEditVisible(false);
                                this.setState({
                                    newKey: Math.random()
                                });
                            }
                        } else {
                            notification.error({
                                message: '苗圃信息更改失败',
                                duration: 3
                            });
                        }
                    });

                    changeEditVisible(false);
                }
            }
        });
    }
}

export default Form.create()(Edite);
