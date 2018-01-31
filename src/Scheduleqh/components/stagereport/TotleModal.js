import React, { Component, Children } from 'react';
import { Row, Col, Input, Form, Icon, Button, Table, Modal, DatePicker, Select, notification, } from 'antd';
const FormItem = Form.Item;
class TotleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TreatmentData: [],
        }
    }
    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        return (
            <div>
                <Modal
                    title='总进度计划流程详情'
                    width={800}
                    onOk={this.props.onok}
                    onCancel={this.props.oncancel}
                    visible={true}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='区域'>
                                                {
                                                    getFieldDecorator('totlearea', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: false, message: '请选择区域' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='单位工程'>
                                                {
                                                    getFieldDecorator('totleunit', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: false, message: '请选择单位工程' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='编号'>
                                                {
                                                    getFieldDecorator('totlenumber', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: false, message: '请输入编号' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('totlesupperunit', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: false, message: '请输入监理单位' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Table
                                            columns={this.columns1}
                                            pagination={true}
                                            dataSource={this.state.TreatmentData}
                                            rowKey='index'
                                        />
                                    </Row>
                                    <Row>

                                        <Col span={8} style={{marginTop:'30px'}}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('totledataReview', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: true, message: '请输入审核人员' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
    columns1 = [{
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: '10%',
    }, {
        title: '文件名称',
        dataIndex: 'fileName',
        key: 'fileName',
        width: '35%',
    }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: '30%',
    }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        render: (text, record, index) => {
            return <div>
                <a>预览</a>
                <span className="ant-divider" />
                <a>下载</a>
            </div>
        }
    }]
}


export default Form.create()(TotleModal)

