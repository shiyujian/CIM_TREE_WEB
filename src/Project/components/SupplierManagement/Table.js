import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Input, Button, Select, Table, Pagination, Modal, Form, message } from 'antd';
import { FOREST_API } from '_platform/api';
import { getUser, formItemLayout } from '_platform/auth';
import AddEdit from './AddEdit';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            status: 0, // 审核状态
            suppliername: '', // 供应商名称
            total: 0,
            page: 1,
            supplierList: [], // 供应商列表
            visible: false, // 新增编辑供应商弹框
            visibleTitle: '', // 弹框标题
            seeVisible: false, // 查看弹框
            auditVisible: false, // 审核弹框
            RegionCode: '',
            options: [],
            record: null,
            optionList: []
        };
        this.Checker = '';
        this.onClear = this.onClear.bind(this); // 清空
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleStatus = this.handleStatus.bind(this); // 状态
        this.handleName = this.handleName.bind(this); // 查询供应商名称
        this.toAdd = this.toAdd.bind(this); // 新增供应商弹框
        this.handleAudit = this.handleAudit.bind(this); // 供应商审核
        this.handleCancel = this.handleCancel.bind(this); // 隐藏弹框
    }
    componentDidMount () {
        const { getRegionCodes, getNurseryList } = this.props.actions;
        // 获取行政区划编码
        getRegionCodes({}, {grade: 1}).then(rep => {
            let province = [];
            rep.map(item => {
                province.push({
                    value: item.ID,
                    label: item.Name,
                    isLeaf: false
                });
            });
            this.setState({
                options: province
            });
        });
        // 获取所有苗圃
        getNurseryList().then(rep => {
            let optionList = [];
            rep.content.map(item => {
                optionList.push(
                    <Option key={item.ID} value={item.ID}>{item.NurseryName}</Option>
                );
            });
            this.setState({
                optionList: optionList
            });
        });
        this.onSearch();
    }
    columns = [
        {
            title: '供应商名称',
            key: 0,
            width: 120,
            fixed: 'left',
            dataIndex: 'SupplierName'
        }, {
            title: '行政区划',
            key: 1,
            width: 120,
            fixed: 'left',
            dataIndex: 'Address'
        }, {
            title: '行政区划编码',
            key: 2,
            width: 100,
            dataIndex: 'RegionCode'
        }, {
            title: '详细地址',
            key: 3,
            width: 120,
            dataIndex: 'Address'
        }, {
            title: '工商注册号',
            key: 4,
            width: 100,
            dataIndex: 'TreePlace'
        }, {
            title: '统一信用代码',
            key: 5,
            width: 100,
            dataIndex: 'USCC'
        }, {
            title: '组织机构代码',
            key: 6,
            width: 100,
            dataIndex: 'TreePlace'
        }, {
            title: '法人姓名',
            key: 7,
            width: 100,
            dataIndex: 'LegalPerson'
        }, {
            title: '法人手机',
            key: 8,
            width: 140,
            dataIndex: 'LegalPersonPhone'
        }, {
            title: '法人身份证号',
            key: 9,
            width: 200,
            dataIndex: 'LegalPersonCardNo'
        }, {
            title: '身份证正面',
            key: 10,
            width: 80,
            dataIndex: 'LegalPersonCard',
            render: (text) => {
                return text ? <a onClick={this.seeModal.bind(this, text)}>查看</a> : '';
            }
        }, {
            title: '身份证反面',
            key: 11,
            width: 80,
            dataIndex: 'LegalPersonCardBack',
            render: (text) => {
                return text ? <a onClick={this.seeModal.bind(this, text)}>查看</a> : '';
            }
        }, {
            title: '营业执照',
            key: 12,
            width: 80,
            dataIndex: 'BusinessLicense',
            render: (text) => {
                return text ? <a onClick={this.seeModal.bind(this, text)}>查看</a> : '';
            }
        }, {
            title: '状态',
            key: 13,
            width: 100,
            dataIndex: 'CheckStatus',
            render: (text) => {
                if (text === 0) {
                    return <span>未审核</span>;
                } else if (text === 1) {
                    return <span>审核通过</span>;
                } else {
                    return <span>审核不通过</span>;
                }
            }
        }, {
            title: '操作',
            key: 14,
            width: 160,
            fixed: 'right',
            dataIndex: 'action',
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.toEdit.bind(this, record)}>修改</a>
                        <span className='ant-divider' />
                        {
                            record.CheckStatus === 0 ? [<a key='one' onClick={this.toAudit.bind(this, record)}>审核</a>,
                                <span key='two' className='ant-divider' />] : []
                        }
                        <a onClick={this.toDelete.bind(this, record)}>删除</a>
                    </span>
                );
            }
        }
    ];
    render () {
        const { getFieldDecorator } = this.props.form;
        const { supplierList, page, total, visible, visibleTitle, seeVisible, auditVisible, optionList, fileList, fileListBack, LeaderCard, record, options, suppliername } = this.state;
        return (
            <div className='table-level'>
                <Row>
                    <Col span={6}>
                        <h3>供应商列表</h3>
                    </Col>
                    <Col span={12}>
                        <label
                            style={{marginRight: 10}}
                        >
                            供应商名称:
                        </label>
                        <Input className='search_input' value={suppliername} onChange={this.handleName} />
                        <Button
                            type='primary'
                            onClick={()=>{this.onSearch()}}
                            style={{minWidth: 30, marginRight: 20}}
                        >
                            查询
                        </Button>
                        <Button
                            onClick={this.onClear}
                            style={{minWidth: 30}}
                        >
                            清空
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            type='primary'
                            style={{ float: 'right' }}
                            onClick={this.toAdd}
                        >
                            添加供应商
                        </Button>
                    </Col>
                </Row>
                <Row style={{ marginTop: 5 }}>
                    <Col span={6}>
                        <label
                            style={{marginRight: 10}}
                        >
                            状态:
                        </label>
                        <Select defaultValue={0} allowClear style={{width: 150}} onChange={this.handleStatus}>
                            <Option value={0}>未审核</Option>
                            <Option value={1}>审核通过</Option>
                            <Option value={2}>审核不通过</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <Table columns={this.columns} bordered dataSource={supplierList}
                            scroll={{ x: 1700 }} pagination={false} rowKey='ID' />
                        <Pagination total={total} page={page} pageSize={10} style={{marginTop: '10px'}}
                            showQuickJumper onChange={this.onSearch} />
                    </Col>
                </Row>
                <Modal title='查看' visible={seeVisible}
                    onCancel={this.handleCancel}
                    style={{textAlign: 'center'}}
                    footer={null}
                >
                    <img src={FOREST_API + '/' + LeaderCard} width='300' height='200' alt='图片找不到了' />
                </Modal>
                {
                    auditVisible ? <Modal title='审核' visible
                        onOk={this.handleAudit} onCancel={this.handleCancel}
                    >
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label='审核结果'
                            >
                                {getFieldDecorator('CheckStatus', {
                                    rules: [{required: true, message: '必填项'}]
                                })(
                                    <Select style={{ width: 150 }} allowClear>
                                        <Option value={1}>审核通过</Option>
                                        <Option value={2}>审核不通过</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label='审核备注'
                            >
                                {getFieldDecorator('CheckInfo', {
                                })(
                                    <TextArea rows={4} />
                                )}
                            </FormItem>
                        </Form>
                    </Modal> : null
                }
                {
                    visible ? <AddEdit fileList={fileList} {...this.props}
                        fileListBack={fileListBack}
                        record={record}
                        options={options}
                        visibleTitle={visibleTitle}
                        optionList={optionList}
                        handleCancel={this.handleCancel}
                    /> : null
                }
            </div>
        );
    }
    handleAudit () {
        const { checkSupplier } = this.props.actions;
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const { id } = getUser();
            const param = {
                ID: this.state.record.ID,
                Checker: id,
                CheckStatus: values.CheckStatus,
                CheckInfo: values.CheckInfo,
                CheckTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            checkSupplier({}, param).then((rep) => {
                if (rep.code === 1) {
                    message.success('审核成功');
                    this.handleCancel();
                }
            });
        });
    }
    onClear () {
        this.setState({
            suppliername: ''
        });
    }
    seeModal (text) {
        this.setState({
            seeVisible: true,
            LeaderCard: text
        });
    }
    handleName (e) {
        this.setState({
            suppliername: e.target.value
        });
    }
    toAdd () {
        this.setState({
            visible: true,
            visibleTitle: '新增供应商'
        });
    }
    toEdit (record, e) {
        e.preventDefault();
        this.setState({
            visible: true,
            visibleTitle: '编辑供应商',
            record
        });
    }
    toAudit (record, e) {
        e.preventDefault();
        this.setState({
            auditVisible: true,
            record
        });
    }
    toDelete (record, e) {
        e.preventDefault();
        const { deleteSupplier } = this.props.actions;
        deleteSupplier({ID: record.ID}).then((rep) => {
            this.onSearch();
        });
    }
    onSearch (page = 1, pageSize = 10) {
        const { status, suppliername } = this.state;
        const { getSupplierList } = this.props.actions;
        const param = {
            status,
            suppliername,
            size: pageSize,
            page
        };
        getSupplierList({}, param).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    total: rep.pageinfo.total,
                    supplierList: rep.content,
                    page: rep.pageinfo.page
                });
            }
        });
    }
    handleStatus (value) {
        this.setState({
            status: value
        });
    }
    handleCancel () {
        this.setState({
            visible: false,
            seeVisible: false,
            auditVisible: false,
            record: null
        });
        this.onSearch();
    }
}

export default Form.create()(Tablelevel);
