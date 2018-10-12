import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Input, Button, Select, Table, Pagination, Modal, Form, message } from 'antd';
import { FOREST_API } from '_platform/api';
import AddEdit from './AddEdit';
import { getUser, formItemLayout } from '_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            status: 1, // 审核状态
            nurseryname: '', // 苗圃名称
            total: 0,
            page: 1,
            nurseryList: [], // 苗圃列表
            visible: false, // 新增编辑苗圃弹框
            visibleTitle: '', // 弹框标题
            seeVisible: false, // 查看弹框
            auditVisible: false, // 审核弹框
            options: [],
            record: null,
            LeaderCard: '', // 身份证正反面
            optionList: []
        };
        this.onClear = this.onClear.bind(this); // 清空
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleStatus = this.handleStatus.bind(this); // 状态
        this.handleName = this.handleName.bind(this); // 查询苗圃名称
        this.toAdd = this.toAdd.bind(this); // 新增苗圃弹框
        this.handleAudit = this.handleAudit.bind(this); // 苗圃审核
        this.handleCancel = this.handleCancel.bind(this); // 隐藏弹框
        this.handlePage = this.handlePage.bind(this); // 换页
    }
    componentDidMount () {
        const { getRegionCodes, getSupplierList } = this.props.actions;
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
        // 获取所有供应商
        getSupplierList().then(rep => {
            this.setState({
                optionList: rep.content
            });
        });
        this.onSearch();
    }
    columns = [
        {
            title: '苗圃名称',
            key: 0,
            width: 120,
            fixed: 'left',
            dataIndex: 'NurseryName'
        }, {
            title: '行政区划编码',
            key: 2,
            width: 130,
            dataIndex: 'RegionCode'
        }, {
            title: '产地',
            key: 3,
            width: 80,
            dataIndex: 'TreePlace'
        }, {
            title: '负责人姓名',
            key: 4,
            dataIndex: 'Leader'
        }, {
            title: '负责人手机号',
            key: 5,
            dataIndex: 'LeaderPhone'
        }, {
            title: '负责人身份证号',
            key: 6,
            dataIndex: 'LeaderCardNo'
        }, {
            title: '身份证正面',
            key: 7,
            dataIndex: 'LeaderCard',
            render: (text) => {
                return text ? <a onClick={this.seeModal.bind(this, text)}>查看</a> : '';
            }
        }, {
            title: '身份证反面',
            key: 8,
            dataIndex: 'LeaderCardBack',
            render: (text) => {
                return text ? <a onClick={this.seeModal.bind(this, text)}>查看</a> : '';
            }
        }, {
            title: '状态',
            key: 9,
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
            key: 10,
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
        const { status, nurseryList, page, total, visible, visibleTitle, seeVisible, auditVisible, optionList, fileList, fileListBack, LeaderCard, record, options, nurseryname } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='table-level'>
                <Row>
                    <Col span={6}>
                        <h3>苗圃列表</h3>
                    </Col>
                    <Col span={12}>
                        <label
                            style={{marginRight: 10}}
                        >
                            苗圃名称:
                        </label>
                        <Input className='search_input' value={nurseryname} onChange={this.handleName} />
                        <Button
                            type='primary'
                            onClick={this.onSearch}
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
                            新增苗圃
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
                        <Select defaultValue={status} allowClear style={{width: 150}} onChange={this.handleStatus}>
                            <Option value={0}>未审核</Option>
                            <Option value={1}>审核通过</Option>
                            <Option value={2}>审核不通过</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <Table columns={this.columns} bordered dataSource={nurseryList}
                            scroll={{ x: 1300 }} pagination={false} rowKey='ID' />
                        <Pagination total={total} page={page} pageSize={10} style={{marginTop: '10px'}}
                            showQuickJumper onChange={this.handlePage} />
                    </Col>
                </Row>
                <Modal title='查看' visible={seeVisible}
                    onCancel={this.handleCancel}
                    style={{textAlign: 'center'}}
                    footer={null}
                >
                    <img src={FOREST_API + '/' + LeaderCard} width='100%' height='100%' alt='图片找不到了' />
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
                        onSearch={this.onSearch}
                    /> : null
                }
            </div>
        );
    }
    handlePage (page) {
        this.setState({
            page
        }, () => {
            this.onSearch();
        });
    }
    onClear () {
        this.setState({
            nurseryname: ''
        });
    }
    seeModal (LeaderCard) {
        this.setState({
            seeVisible: true,
            LeaderCard
        });
    }
    onSearch () {
        const { page, status, nurseryname } = this.state;
        const { getNurseryList } = this.props.actions;
        const param = {
            status,
            nurseryname,
            size: 10,
            page
        };
        getNurseryList({}, param).then((rep) => {
            if (rep.code === 200) {
                this.setState({
                    total: rep.pageinfo.total,
                    nurseryList: rep.content,
                    page: rep.pageinfo.page
                });
            }
        });
    }
    handleAudit () {
        const { checkNursery } = this.props.actions;
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
            checkNursery({}, param).then((rep) => {
                if (rep.code === 1) {
                    message.success('审核成功');
                    this.onSearch();
                    this.handleCancel();
                }
            });
        });
    }
    toAdd () {
        this.setState({
            visible: true,
            visibleTitle: '新增苗圃'
        });
    }
    toEdit (record, e) {
        e.preventDefault();
        this.setState({
            visible: true,
            visibleTitle: '编辑苗圃',
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
        const { deleteNursery } = this.props.actions;
        deleteNursery({ID: record.ID}).then((rep) => {
            if (rep.code === 1) {
                message.success('删除成功');
                this.onSearch();
            } else {
                message.success('删除失败，请确认本机构下无用户');
            }
        });
    }
    handleStatus (value) {
        this.setState({
            status: value
        });
    }
    handleName (e) {
        this.setState({
            nurseryname: e.target.value
        });
    }
    handleCancel () {
        this.setState({
            visible: false,
            seeVisible: false,
            auditVisible: false,
            record: null
        });
    }
}

export default Form.create()(Tablelevel);
