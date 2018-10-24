import React, { Component } from 'react';
import moment from 'moment';
import { Input, Select, Table, Modal, Form, Button, Row, Col, message } from 'antd';
import { getUser, formItemLayout } from '_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            SupplierList: [], // 供应商列表
            NurseryList: [], // 苗圃列表
            supplierid: '', // 供应商ID
            nurserybaseid: '', // 苗圃ID
            showModal: false, // 新增弹窗
            record: {}
        };
        this.Checker = ''; // 登陆用户
        this.org_code = ''; // 所在组织机构
        this.handleCancel = this.handleCancel.bind(this); // 取消
        this.handleOk = this.handleOk.bind(this); // 审核
    }
    componentDidMount () {
        const { getSupplierList, getNurseryList } = this.props.actions;
        const { id, org_code } = getUser();
        this.Checker = id;
        this.org_code = org_code;
        getSupplierList().then(rep => {
            this.setState({
                SupplierList: rep.content
            });
        });
        getNurseryList().then(rep => {
            this.setState({
                NurseryList: rep.content
            });
        });
        this.toSearch();
    }
    columns = [
        {
            title: '供应商',
            dataIndex: 'SupplierName',
            key: '1'
        }, {
            title: '苗圃基地',
            dataIndex: 'NurseryName',
            key: '2'
        }, {
            title: '绑定人',
            dataIndex: 'Checker',
            key: '3'
        }
    ]
    render () {
        const { dataList, SupplierList, NurseryList, supplierid, nurserybaseid, showModal } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='relevance-table'>
                <Form layout='inline'>
                    <FormItem label='供应商名称'>
                        <Select style={{width: 200}} allowClear
                            value={supplierid} placeholder='请选择供应商'
                            onChange={this.handleSupplier.bind(this)}>
                            {
                                SupplierList.map(item => {
                                    return <Option value={item.ID}>{item.SupplierName}</Option>;
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label='苗圃名称'>
                        <Select style={{width: 200}} allowClear
                            value={nurserybaseid} placeholder='请选择苗圃基地'
                            onChange={this.handleNursery.bind(this)}>
                            {
                                NurseryList.map(item => {
                                    return <Option value={item.ID}>{item.NurseryName}</Option>;
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem style={{marginLeft: 50}}>
                        <Button type='primary' onClick={this.toSearch.bind(this)}>查询</Button>
                        <Button onClick={this.toEmpty.bind(this)} style={{marginLeft: 20}}>清空</Button>
                    </FormItem>
                </Form >
                <Row style={{marginBottom: 10}}>
                    <Col span={24}>
                        <Button style={{float: 'right'}} type='primary' onClick={this.addRelevance.bind(this)}>新增绑定</Button>
                    </Col>
                </Row>
                <Table columns={this.columns} bordered
                    dataSource={dataList}
                    pagination={false}
                    rowKey='ID'
                />
                <Modal title='新增绑定' visible={showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='供应商'
                        >
                            {getFieldDecorator('supplier', {
                                rules: [{required: true, message: '必填项'}]
                            })(
                                <Select style={{ width: 200 }} allowClear placeholder='请选择供应商'>
                                    {
                                        SupplierList.map(item => {
                                            return <Option value={item.ID}>{item.SupplierName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='苗圃基地'
                        >
                            {getFieldDecorator('nursery', {
                                rules: [{required: true, message: '必填项'}]
                            })(
                                <Select style={{ width: 200 }} allowClear placeholder='请选择苗圃基地'>
                                    {
                                        NurseryList.map(item => {
                                            return <Option value={item.ID}>{item.NurseryName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    addRelevance () {
        this.setState({
            showModal: true
        });
    }
    handleSupplier (value) {
        this.setState({
            supplierid: value
        });
    }
    handleNursery (value) {
        this.setState({
            nurserybaseid: value
        });
    }
    toSearch () {
        const { getNb2ss } = this.props.actions;
        const { supplierid, nurserybaseid } = this.state;
        getNb2ss({}, {
            supplierid,
            nurserybaseid
        }).then(rep => {
            this.setState({
                dataList: rep
            });
        });
    }
    toEmpty () {
        this.setState({
            supplierid: '',
            nurserybaseid: ''
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
    handleOk () {
        const { putSupplier } = this.props.actions;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            putSupplier({}, {
                ID: values.supplier,
                NB2Ss: [{
                    NurseryBaseID: values.nursery
                }]
            }).then(rep => {
                if (rep.code === 1) {
                    message.success('绑定成功');
                    this.toSearch();
                    this.setState({
                        showModal: false
                    });
                }
            });
        });
    }
}

export default Form.create()(Tablelevel);
