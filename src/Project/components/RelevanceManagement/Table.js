import React, { Component } from 'react';
import { Select, Table, Modal, Form, Button, Row, Col, Spin, message } from 'antd';
import { formItemLayout, getUser } from '_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;

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
            showModal: false // 新增弹窗
        };
        this.name = ''; // 登陆用户姓名
        this.SupplierList = []; // 供应商列表
        this.NurseryList = []; // 苗圃列表
        this.handleCancel = this.handleCancel.bind(this); // 取消
        this.handleOk = this.handleOk.bind(this); // 审核
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
                const user = getUser();
                if (user && user.username && user.username === 'admin') {
                    return <a onClick={this.toDelete.bind(this, record)}>解 除</a>;
                } else {
                    return '/';
                }
            }
        }
    ]
    componentDidMount = async () => {
        const {
            actions: {
                getSupplierList,
                getNurseryList
            }
        } = this.props;
        // 获取当前组织机构的权限
        const user = getUser();
        this.name = user.name;
        // 获取供应商列表
        let rep = await getSupplierList({}, {
            status: 1
        });
        if (rep && rep.code && rep.code === 200) {
            this.SupplierList = rep.content;
            this.setState({
                SupplierList: rep.content
            });
        }
        let rst = await getNurseryList({}, {
            status: 1
        });
        if (rst && rst.code && rst.code === 200) {
            this.NurseryList = rst.content;
            this.setState({
                NurseryList: rst.content
            });
        }
        await this.toSearch();
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
        }, async () => {
            await this.toSearch();
        });
    }
    handleCancel () {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            supplier: undefined,
            nursery: undefined
        });
        this.setState({
            showModal: false
        });
    }
    handleOk () {
        const {
            actions: {
                postNb22s
            },
            form: {
                setFieldsValue
            }
        } = this.props;
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
                if (rep && rep.code && rep.code === 1) {
                    message.success('绑定成功');
                    this.toSearch();
                    setFieldsValue({
                        supplier: undefined,
                        nursery: undefined
                    });
                    this.setState({
                        showModal: false
                    });
                } else if (rep && rep.code && rep.code === 2) {
                    message.error('绑定重复，请重新绑定');
                } else {
                    message.error('绑定失败');
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
                        <Button
                            type='primary'
                            onClick={this.toSearch.bind(this)}>
                                查询
                        </Button>
                        <Button
                            onClick={this.toEmpty.bind(this)}
                            style={{marginLeft: 20}}>
                                清空
                        </Button>
                    </FormItem>
                </Form >
                <Row style={{marginBottom: 10}}>
                    <Col span={24}>
                        <Button
                            style={{float: 'right'}}
                            type='primary'
                            onClick={this.addRelevance.bind(this)}>
                                新增绑定
                        </Button>
                    </Col>
                </Row>
                <Spin tip='Loading...' spinning={this.state.loading}>
                    <Table
                        columns={this.columns}
                        bordered
                        dataSource={dataList}
                        rowKey='ID'
                    />
                </Spin>
                <Modal
                    title='新增绑定'
                    visible={showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='供应商'
                        >
                            {getFieldDecorator('supplier', {
                                rules: [{
                                    required: true,
                                    message: '必填项'
                                }]
                            })(
                                <Select style={{ width: 200 }}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder='请选择供应商'>
                                    {
                                        SupplierList.map(item => {
                                            return <Option value={item.ID} key={item.ID}>{item.SupplierName}</Option>;
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
                                rules: [{
                                    required: true,
                                    message: '必填项'
                                }]
                            })(
                                <Select
                                    style={{ width: 200 }}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    allowClear
                                    placeholder='请选择苗圃基地'>
                                    {
                                        NurseryList.map(item => {
                                            return <Option value={item.ID} key={item.ID}>{item.NurseryName}</Option>;
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
}

export default Form.create()(Tablelevel);
