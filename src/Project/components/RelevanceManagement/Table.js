import React, { Component } from 'react';
import moment from 'moment';
import { Input, Select, Table, Modal, Form, Button, Row, Col, Spin, message } from 'antd';
import { getUser, formItemLayout } from '_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 表格数据
            loading: true,
            SupplierList: [], // 供应商列表
            NurseryList: [], // 苗圃列表
            supplierid: '', // 供应商ID
            nurserybaseid: '', // 苗圃ID
            showModal: false, // 新增弹窗
        };
        this.Checker = ''; // 登陆用户
        this.org_code = ''; // 所在组织机构
        this.name = ''; // 登陆用户姓名
        this.SupplierList = []; // 供应商列表
        this.NurseryList = []; // 苗圃列表
        this.handleCancel = this.handleCancel.bind(this); // 取消
        this.handleOk = this.handleOk.bind(this); // 审核
    }
    componentDidMount () {
        const { getSupplierList, getNurseryList } = this.props.actions;
        const { id, org_code } = getUser();
        this.Checker = id;
        this.org_code = org_code;
        // 获取当前组织机构的权限
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        console.log(getUser());
        console.log(user);
        if (user.account) {
            this.name = user.account.person_name;
        }
        // 获取供应商列表
        getSupplierList().then(rep => {
            this.SupplierList = rep.content;
            this.setState({
                SupplierList: rep.content
            });
        });
        getNurseryList().then(rep => {
            this.NurseryList = rep.content;
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
            dataIndex: 'Binder',
            key: '3'
        }, {
            title: '操作',
            dataIndex: 'actions',
            key: '4',
            render: (text, record) => {
                return <a onClick={this.toDelete.bind(this, record)}>解 除</a>;
            }
        }
    ]
    render () {
        const { dataList, SupplierList, NurseryList, supplierid, nurserybaseid, showModal } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='relevance-table'>
                <Form layout='inline'>
                    <FormItem label='供应商名称'>
                        <Select style={{width: 200}}
                            value={supplierid} placeholder='请选择供应商'
                            showSearch
                            filterOption={false}
                            onSearch={this.searchSupplier.bind(this)}
                            onChange={this.handleSupplier.bind(this)}>
                            {
                                SupplierList.map(item => {
                                    return <Option value={item.ID}>{item.SupplierName}</Option>;
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label='苗圃名称'>
                        <Select style={{width: 200}}
                            value={nurserybaseid} placeholder='请选择苗圃基地'
                            showSearch
                            filterOption={false}
                            onSearch={this.searchNursery.bind(this)}
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
                <Spin tip='Loading...' spinning={this.state.loading}>
                    <Table columns={this.columns} bordered
                        dataSource={dataList}
                        pagination={false}
                        rowKey='ID'
                    />
                </Spin>
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
    searchSupplier (value) {
        let SupplierList = [];
        this.SupplierList.map(item => {
            if (item.SupplierName.includes(value)) {
                SupplierList.push(item);
            }
        });
        this.setState({
            SupplierList
        });
    }
    handleSupplier (value) {
        this.setState({
            supplierid: value,
            SupplierList: this.SupplierList
        });
    }
    searchNursery (value) {
        let NurseryList = [];
        this.NurseryList.map(item => {
            if (item.NurseryName.includes(value)) {
                NurseryList.push(item);
            }
        });
        this.setState({
            NurseryList
        });
    }
    handleNursery (value) {
        this.setState({
            nurserybaseid: value,
            NurseryList: this.NurseryList
        });
    }
    toSearch () {
        const { getNb2ss } = this.props.actions;
        const { supplierid, nurserybaseid } = this.state;
        this.setState({
            loading: true
        });
        getNb2ss({}, {
            supplierid: supplierid === undefined ? '' : supplierid,
            nurserybaseid: nurserybaseid === undefined ? '' : nurserybaseid
        }).then(rep => {
            this.setState({
                dataList: rep,
                loading: false
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
        const { postNb22s } = this.props.actions;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log({
                Binder: this.name === undefined ? '' : this.name,
                SupplierID: values.supplier,
                NurseryBaseID: values.nursery
            });
            postNb22s({}, {
                Binder: this.name === undefined ? '' : this.name,
                SupplierID: values.supplier,
                NurseryBaseID: values.nursery
            }).then(rep => {
                if (rep.code === 1) {
                    message.success('绑定成功');
                    this.toSearch();
                    this.setState({
                        showModal: false
                    });
                } else {
                    message.success('绑定失败');
                }
            });
        });
    }
    toDelete (record, e) {
        e.preventDefault();
        const { deleteNb22s } = this.props.actions;
        deleteNb22s({
            ID: record.ID
        }).then(rep => {
            if (rep.code === 1) {
                message.success('解除绑定成功');
                this.toSearch();
            } else {
                message.error('解除绑定失败');
            }
        });
    }
}

export default Form.create()(Tablelevel);
