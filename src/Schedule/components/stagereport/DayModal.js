import React, { Component, Children } from 'react';
import { Row, Col, Input, Form, Icon, Button, Table, Modal, DatePicker, Select, notification, } from 'antd';
const FormItem = Form.Item;
class DayModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeDatasource: [],
        }
    }
    componentDidMount() {
        this.setState({
            treeDatasource: this.props.TreedataSource
        })
    }
    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        console.log('this.props',this.props)
        return (
            <div>
                <Modal
                    title='日进度计划流程详情'
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
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='单位工程'>
                                                {
                                                    getFieldDecorator('dayunit', {
                                                        initialValue: `${this.props.unit || '暂无单位工程'}`,
                                                        rules: [
                                                            { required: false, message: '请选择单位工程' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='编号'>
                                                {
                                                    getFieldDecorator('daynumbercode', {
                                                        initialValue: `${this.props.numbercode || '暂无编号'}`,
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
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='文档类型'>
                                                {
                                                    getFieldDecorator('stagedocument', {
                                                        initialValue: `${this.props.stagedocument || '暂无文档类型'}`,
                                                        rules: [
                                                            { required: false, message: '请输入文档类型' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='日期'>
                                                {
                                                    getFieldDecorator('daytimedate', {
                                                        initialValue: `${this.props.timedate || '暂无日期'}`,
                                                        rules: [
                                                            { required: false, message: '请输入日期' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('daysuperunit', {
                                                        initialValue: `${this.props.superunit || '暂无监理单位'}`,
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
                                            dataSource={this.state.treeDatasource}
                                            rowKey='index'
                                            className='foresttable'
                                        />
                                    </Row>
                                    <Row>

                                        <Col span={12} style={{ marginTop: '10px' }}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('daydataReview', {
                                                        initialValue: `${this.props.dataReview || ''}`,
                                                        rules: [
                                                            { required: false, message: '请输入审核人员' }
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
		dataIndex: 'key',
		key: 'key',
		width: '10%',
	}, {
		title: '项目',
		dataIndex: 'project',
		key: 'project',
	}, {
		title: '单位',
		dataIndex: 'units',
		key: 'units',
	}, {
		title: '数量',
		dataIndex: 'number',
		key: 'number',
	},];
}


export default Form.create()(DayModal)

