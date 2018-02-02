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
    // //文件预览
    // onViewClick(record, index) {
    //     const { actions: { openPreview } } = this.props;
    
    //     console.log('record',record)
    //     let filed = {};
    //     if (record && record.file_id) {
            
    //         filed.misc = "file";
    //         filed.a_file = `${SOURCE_API}` + record.a_file;
    //         filed.download_url = `${STATIC_DOWNLOAD_API}` + record.download_url;
    //         filed.name = record.fileName;
    //         filed.id = record.file_id;
    //         let type = record.a_file.split('.')[1];
    //         if (type == 'xlsx' || type == 'docx' || type == 'xls' || type == 'doc' || type == 'pptx' || type == 'ppt') {
    //             filed.mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    //         }
    //         if (type == 'pdf') {
    //             filed.mime_type = "application/pdf";
    //         }
    //     }
    //     openPreview(filed);
    // }
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
                                                        initialValue: `${this.props.area || '暂无区域'}`,
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
                                                        initialValue: `${this.props.unit || '暂无单位工程'}`,
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
                                        <Col span={8}>
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

                                        <Col span={8} style={{ marginTop: '30px' }}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('totledataReview', {
                                                        initialValue: `${this.props.dataReview || ''}`,
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
                <a href='javascript:;' onClick={this.onViewClick.bind(this, record, index)}>预览</a>
                <span className="ant-divider" />
                <a href={`${STATIC_DOWNLOAD_API}${record.a_file}`}>下载</a>
            </div>
        }
    }]
}


export default Form.create()(TotleModal)

