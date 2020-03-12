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
    Notification,
    Form,
    Spin,
    Popconfirm,
    message
} from 'antd';
import moment from 'moment';
import { formItemLayout, getUser } from '_platform/auth';
import {
    WFStatusList
} from '_platform/api';
import ModalAdd from './ModalAdd';
import ModalSee from './ModalSee';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
class TableList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workID: '', // 任务ID
            flowID: '', // 流程ID
            flowName: '', // 流程名称
            leftkeycode: '', // 项目
            dataList: [], // 表格数据
            isSuperAdmin: false, // 是否是超级管理员
            sectionList: [], // 标段列表
            section: '', // 标段
            showModalAdd: false, // 新建弹框
            showModalSee: false, // 查看弹框
            page: 1,
            total: 0,
            spinning: true // loading
        };
        this.getWorkList = this.getWorkList.bind(this); // 获取任务列表
        this.onSearch = this.onSearch.bind(this); // 查询
        this.onSee = this.onSee.bind(this); // 查看
        this.onAdd = this.onAdd.bind(this); // 新建表单
        this.handleCancelAdd = this.handleCancelAdd.bind(this);
        this.handleCancelSee = this.handleCancelSee.bind(this);
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
        let starter = '';
        let user = getUser();
        if (user.username === 'admin') {

        } else {
            starter = getUser().ID;
        }
        let param = {
            workid: '', // 任务ID
            workno: values.workNo || '', // 表单编号
            title: values.name || '', // 任务名称
            flowid: flowID, // 流程类型或名称
            starter, // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            wfstate: values.state || '', // 待办 0,1
            stime: StartTime, // 开始时间
            etime: EndTime, // 结束时间
            keys: '', // 查询键
            values: '', // 查询值
            page: page, // 页码
            size: 10 // 页数
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
    onSearch () {
        let {
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                this.getWorkList(values);
            }
        });
    }
    handleCancelAdd () {
        this.setState({
            showModalAdd: false
        });
    }
    handleCancelSee () {
        this.setState({
            showModalSee: false
        });
    }
    onAdd () {
        this.setState({
            showModalAdd: true
        });
    }
    onSee (ID) {
        this.setState({
            workID: ID,
            showModalSee: true
        });
    }
    handlePage (page) {
        this.setState({
            page: page
        }, () => {
            this.onSearch();
        });
    }
    onDelete (workID) {
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: workID
        }, {}).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除任务成功',
                    duration: 3
                });
                this.getWorkList();
            } else {
                Notification.error({
                    message: '删除任务失败',
                    duration: 3
                });
            }
        });
    }
    onCancel (workID) {
        
    }
    render () {
        const {
            dataList,
            showModalAdd,
            showModalSee,
            total,
            page,
            spinning
        } = this.state;
        const {
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
                                        <FormItem label='工程名称'>
                                            {
                                                getFieldDecorator('name', {

                                                })(
                                                    <Input style={{width: 180}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={16}>
                                        <FormItem label='表单编号'>
                                            {
                                                getFieldDecorator('workNo', {

                                                })(
                                                    <Input style={{width: 180}} />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='流转状态'>
                                            {
                                                getFieldDecorator('state', {
                                                    initialValue: ''
                                                })(
                                                    <Select style={{ width: 180 }} allowClear>
                                                        {
                                                            WFStatusList.map(item => {
                                                                return <Option value={item.value} key={item.value}>{item.label}</Option>;
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
                                            <Button type='primary' onClick={this.onAdd.bind(this)}>新建表单</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
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
                    showModalAdd ? <ModalAdd
                        {...this.state}
                        getWorkList={this.getWorkList}
                        showModal={showModalAdd}
                        handleCancel={this.handleCancelAdd}
                        {...this.props}
                    /> : ''
                }
                {
                    showModalSee ? <ModalSee
                        {...this.state}
                        onSearch={this.onSearch}
                        showModal={showModalSee}
                        handleCancel={this.handleCancelSee}
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
            title: '工程名称',
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
                console.log('用户', getUser());
                let user = getUser();
                let arr = [<a onClick={this.onSee.bind(this, record.ID)}>查看</a>];
                if (user.username === 'admin') {
                    arr.push(<Divider type='vertical' />, <Popconfirm
                        title='确定要删除吗？'
                        onConfirm={this.onDelete.bind(this, record.ID)}
                        onCancel={this.onCancel.bind(this, record.ID)}
                        okText='Yes'
                        cancelText='No'
                    >
                        <a href='#' >删除</a>
                    </Popconfirm>);
                }
                return <span>
                    {arr}
                </span>;
            }
        }
    ];
}

export default Form.create()(TableList);
