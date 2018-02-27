import React, { Component, Children } from 'react';
import { Row, Col, Input, Form, Icon, Button, Table, Modal, DatePicker, Select, notification, } from 'antd';
const FormItem = Form.Item;
import { STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
class TotleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TreatmentData: [],
        }
    }
    componentDidMount() {
        this.setState({
            TreatmentData: this.props.treatmentdata
        })
    }
    onViewClick(record,index) {
		const {actions: {openPreview}} = this.props;
        let filed = {}
        filed.misc = record.misc;
        filed.a_file = `${SOURCE_API}` + (record.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.fileName;
        filed.mime_type = record.mime_type;
        openPreview(filed);
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
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='单位工程'>
                                                {
                                                    getFieldDecorator('totleunit', {
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
                                                    getFieldDecorator('totlenumbercode', {
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
                                                    getFieldDecorator('totledocument', {
                                                        initialValue: `${this.props.totledocument || '暂无文档类型'}`,
                                                        rules: [
                                                            { required: false, message: '请输入文档类型' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('totlesuperunit', {
                                                        initialValue: `${this.props.totlesuperunit || '暂无监理单位'}`,
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
                                            className='foresttable'
                                        />
                                    </Row>
                                    <Row>

                                        <Col span={12} style={{ marginTop: '10px' }}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('totledataReview', {
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
                <a href='javascript:;' onClick={this.onViewClick.bind(this, record, index)}>预览</a>
                <span className="ant-divider" />
                <a href={`${STATIC_DOWNLOAD_API}${record.a_file}`}>下载</a>
            </div>
        }
    }]
}


export default Form.create()(TotleModal)

