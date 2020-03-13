import React, { Component } from 'react';
import {
    Row,
    Col,
    Divider,
    Select,
    DatePicker,
    Button,
    Table,
    Input,
    Pagination,
    Modal,
    Form,
    Spin,
    message
} from 'antd';
import moment from 'moment';
import { formItemLayout, getUser } from '_platform/auth';
import {
    WFStatusList
} from '_platform/api';
import ModalCheck from './ModalCheck';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
class TableListCommission extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workID: '', // 任务ID
            flowID: '', // 流程ID
            flowName: '', // 流程名称
            leftkeycode: '', // 项目
            dataList: [], // 表格数据
            isSuperAdmin: false, // 是否是超级管理员
            selectKey: [], // 选中的细班列表
            sectionList: [], // 标段列表
            section: '', // 标段
            showModalAdd: false, // 新建弹框
            showModalCheck: false, // 审核弹框
            page: 1,
            total: 0,
            spinning: true // loading
        };
        this.getWorkList = this.getWorkList.bind(this); // 获取任务列表
        this.onSearch = this.onSearch.bind(this); // 查询
        this.onAdd = this.onAdd.bind(this); // 新建表单
        this.handleCancelCheck = this.handleCancelCheck.bind(this);
        this.handlePage = this.handlePage.bind(this); // 换页
    }
    async componentDidMount () {
        await this.getFlowList(); // 获取流程
    }
    componentWillReceiveProps (nextProps) {
    }
    getFlowList () {
        const { getFlowList } = this.props.actions;
        getFlowList({}, {
            name: '', // 流程名称
            status: 1, // 流程状态
            page: '',
            size: ''
        }).then(rep => {
            if (rep.code === 1) {
                let flowID = '';
                let flowName = '';
                rep.content.map(item => {
                    if (item.Name === '签证流程') {
                        flowID = item.ID;
                        flowName = item.Name;
                    }
                });
                this.setState({
                    flowID,
                    flowName
                }, () => {
                    this.getWorkList(); // 获取任务列表
                });
            }
        });
    }
    getWorkList (values = {}) {
        let {
            actions: { getWorkList }
        } = this.props;
        const { flowID, page } = this.state;
        this.setState({
            spinning: true
        });
        let StartTime = '', EndTime = '';
        if (values.timeArr && values.timeArr.length > 0) {
            StartTime = moment(values.timeArr[0]).format(dateTimeFormat);
            EndTime = moment(values.timeArr[1]).format(dateTimeFormat);
        }
        let keys = '', vals = '';
        if (values.DrawingNo) {
            keys = 'DrawingNo';
            vals = values.DrawingNo;
        }
        // else if (this.props.leftkeycode) {
        //     keys = 'Section';
        //     vals = this.props.leftkeycode;
        // }
        let param = {
            workid: '', // 任务ID
            workno: values.workNo || '', // 表单编号
            title: values.name || '', // 任务名称
            flowid: flowID, // 流程类型或名称
            starter: values.starter || '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: getUser().ID, // 执行人
            sender: '', // 上一节点发送人
            wfstate: '0,1', // 待办 0,1
            stime: StartTime, // 开始时间
            etime: EndTime, // 结束时间
            keys: keys || '', // 查询键
            values: vals || '', // 查询值
            page: page, // 页码
            size: '10' // 页数
        };
        getWorkList({}, param).then(rep => {
            if (rep && rep.code === 200 && rep.content) {
                this.setState({
                    dataList: rep.content,
                    total: rep.pageinfo && rep.pageinfo.total,
                    page: rep.pageinfo && rep.pageinfo.page,
                    spinning: false
                });
            }
        });
    }
    handleCancelCheck () {
        this.setState({
            showModalCheck: false
        });
    }
    onAdd () {
        this.setState({
            showModalAdd: true
        });
    }
    onCheck (ID) {
        this.setState({
            workID: ID,
            showModalCheck: true
        });
    }
    onSearch () {
        let {
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (err) {
            }
            this.getWorkList(values);
        });
    }
    handlePage (page) {
        this.setState({
            page: page
        }, () => {
            this.onSearch();
        });
    }
    render () {
        const {
            dataList,
            showModalCheck,
            total,
            page,
            spinning
        } = this.state;
        const {
            ConstructionList,
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <Row>
                            <Col span={20}>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='签证名称'>
                                            {
                                                getFieldDecorator('name', {

                                                })(
                                                    <Input style={{width: 180}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label='表单编号'>
                                            {
                                                getFieldDecorator('workNo', {

                                                })(
                                                    <Input style={{width: 180}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label='图号'>
                                            {
                                                getFieldDecorator('DrawingNo', {

                                                })(
                                                    <Input style={{width: 180}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='发起人'>
                                            {
                                                getFieldDecorator('starter', {

                                                })(
                                                    <Select style={{ width: 180 }} allowClear>
                                                        {
                                                            ConstructionList.map(item => {
                                                                return <Option value={item.id} key={item.id}>{item.Full_Name}({item.User_Name})</Option>;
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={16}>
                                        <FormItem label='发起时间'>
                                            {
                                                getFieldDecorator('timeArr', {

                                                })(
                                                    <RangePicker
                                                        showTime={{ format: 'HH:mm:ss' }}
                                                        format={dateTimeFormat}
                                                        placeholder={['开始时间', '结束时间']}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={4}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem>
                                            <Button type='primary' onClick={this.onSearch}>查询</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: '100%', minHeight: 640, float: 'left'}}>
                        <Spin spinning={spinning}>
                            <Table
                                rowKey='ID'
                                columns={this.columns}
                                dataSource={dataList}
                                pagination={false}
                            />
                        </Spin>
                        <Pagination style={{float: 'right', marginTop: 10}} current={page} total={total} onChange={this.handlePage} showQuickJumper />
                    </div>
                </div>
                {
                    showModalCheck ? <ModalCheck
                        {...this.state}
                        getWorkList={this.getWorkList}
                        onSearch={this.onSearch}
                        showModal={showModalCheck}
                        handleCancel={this.handleCancelCheck}
                        {...this.props}
                    /> : ''
                }
            </div>
        );
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '表单编号',
            dataIndex: 'WorkNo'
        },
        {
            title: '标段',
            width: 150,
            dataIndex: 'Section'
        },
        {
            title: '工程签证名称',
            dataIndex: 'Title'
        },
        {
            title: '发起人',
            dataIndex: 'StarterObj',
            render: (text, record, index) => {
                if (text) {
                    if (text.Full_Name) {
                        return `${text.Full_Name || ''}(${text.User_Name || ''})`;
                    } else {
                        return `(${text.User_Name || ''})`;
                    }
                } else {
                    return '/';
                }
            }
        },
        {
            title: '发起时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '流转状态',
            dataIndex: 'WFState',
            render: (text, record, index) => {
                let statusValue = '';
                WFStatusList.find(item => {
                    if (item.value === text) {
                        statusValue = item.label;
                    }
                });
                return statusValue;
            }
        },
        {
            title: '当前执行人',
            dataIndex: 'NextExecutorObjs',
            render: (text, record, index) => {
                if (text && text.length === 1) {
                    if (text[0].Full_Name) {
                        return `${text[0].Full_Name || ''}(${text[0].User_Name || ''})`;
                    } else {
                        return `(${text[0].User_Name || ''})`;
                    }
                } else {
                    return '/';
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'actions',
            render: (text, record, index) => {
                return <span>
                    <a onClick={this.onCheck.bind(this, record.ID)}>审核</a>
                </span>;
            }
        }
    ];
}

export default Form.create()(TableListCommission);
