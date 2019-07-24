import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker, Radio, Spin, Table } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getUser } from '_platform/auth';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let WFStatus = [{
    value: 0,
    label: '草稿中'
}, {
    value: 1,
    label: '运行中'
}, {
    value: 2,
    label: '已完成'
}, {
    value: 3,
    label: '挂起'
}, {
    value: 4,
    label: '退回'
}, {
    value: 5,
    label: '转发'
}];
class TaskList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workDetails: {}, // 任务详情
            processList: [], // 待办列表
            finishList: [], // 已办列表
            flowDataList: [], // 流程列表
            type: 'process', // 待办已办
            loadingProcess: false, // 待办loading
            loadingFinish: false // 待办loading
        };
        this.columnsProcess = [{
            title: '序号',
            dataIndex: 'index',
            render (text, record, index) {
                return index;
            }
        }, {
            title: '任务名称',
            dataIndex: 'Title'
        }, {
            title: '任务状态',
            dataIndex: 'WFState',
            render: (text, record, index) => {
                let statusValue = '';
                WFStatus.find(item => {
                    if (item.value === text) {
                        statusValue = item.label;
                    }
                });
                return statusValue;
            }
        }, {
            title: '当前节点',
            dataIndex: 'CurrentNodeName'
        }, {
            title: '发起人',
            dataIndex: 'Starter'
        }, {
            title: '待办人',
            dataIndex: 'NextExecutor'
        }, {
            title: '流程名称',
            dataIndex: 'FlowName'
        }, {
            title: '任务结束时间',
            dataIndex: 'CompleteTime'
        }, {
            title: '操作',
            dataIndex: 'active',
            render: (text, record, index) => {
                return (<div>
                    <Link to={`/selfcare/task/${record.ID}`}>
                        <span>
                            查看详情
                        </span>
                    </Link>
                </div>);
            }
        }];
        this.columnsFinish = [{
            title: '序号',
            dataIndex: 'index',
            render (text, record, index) {
                return index;
            }
        }, {
            title: '任务名称',
            dataIndex: 'Title'
        }, {
            title: '任务状态',
            dataIndex: 'WFState',
            render: (text, record, index) => {
                let statusValue = '';
                WFStatus.find(item => {
                    if (item.value === text) {
                        statusValue = item.label;
                    }
                });
                return statusValue;
            }
        }, {
            title: '上一个节点',
            dataIndex: 'PrevNodeName'
        }, {
            title: '当前节点',
            dataIndex: 'CurrentNodeName'
        }, {
            title: '发送人',
            dataIndex: 'Sender'
        }, {
            title: '执行人',
            dataIndex: 'Executor'
        }, {
            title: '创建时间',
            dataIndex: 'CreateTime'
        }, {
            title: '运行时间',
            dataIndex: 'RunTime'
        },{
            title: '流程名称',
            dataIndex: 'FlowName'
        }, {
            title: '操作',
            dataIndex: 'active',
            render: (text, record, index) => {
                return (<div>
                    <Link to={`/selfcare/task/${record.ID}`}>
                        <span>
                            查看详情
                        </span>
                    </Link>
                </div>);
            }
        }];
        this.getProcessList = this.getProcessList.bind(this); // 获取待办列表
        this.getFinishList = this.getFinishList.bind(this); // 获取已办列表
        this.getFlowList = this.getFlowList.bind(this); // 获取任务列表
    }
    componentDidMount () {
        this.getFlowList();
        this.getProcessList();
        this.getFinishList();
    }
    getProcessList () {
        this.setState({
            loadingProcess: true
        });
        let { getEmpworkList } = this.props.actions;
        let { validateFields } = this.props.form;
        console.log('当前用户ID', getUser().ID);
        validateFields((err, values) => {
            if (!err) {
                let stime = '';
                let etime = '';
                if (values.startTime && values.startTime.length) {
                    stime = moment(values.startTime[0]).format(dateFormat);
                    etime = moment(values.startTime[1]).format(dateFormat);
                }
                let params = {
                    workid: '', // 任务ID
                    title: values.name || '', // 任务名称
                    flowname: values.type || '', // 流程类型或名称
                    starter: values.starter || '', // 发起人
                    currentnode: '', // 节点ID
                    prevnode: '', // 上一结点ID
                    executor: '', // 执行人
                    stime, // 开始时间
                    etime, // 结束时间
                    page: '', // 页码
                    size: '' // 页数
                };
                getEmpworkList({}, params).then(rep => {
                    if (rep.code === 200) {
                        let processList = []; // 待办列表
                        rep.content.map(item => {
                            processList.push(item);
                        });
                        this.setState({
                            processList,
                            loadingProcess: false
                        });
                    }
                });
            }
        });
    }
    getFinishList () {
        let { getWorkList } = this.props.actions;
        let { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
                let stime = '';
                let etime = '';
                if (values.startTime && values.startTime.length) {
                    stime = moment(values.startTime[0]).format(dateFormat);
                    etime = moment(values.startTime[1]).format(dateFormat);
                }
                console.log('值', values.startTime);
                let params = {
                    workid: '', // 任务ID
                    title: values.name || '', // 任务名称
                    flowname: values.type || '', // 流程类型或名称
                    starter: values.starter || '', // 发起人
                    currentnode: '', // 节点ID
                    prevnode: '', // 上一结点ID
                    executor: '', // 执行人
                    sender: '', // 上一节点发送人
                    haveexecuted: 1, // 是否已执行 1已办
                    stime, // 开始时间
                    etime, // 结束时间
                    page: '', // 页码
                    size: '' // 页数
                };
                getWorkList({}, params).then(rep => {
                    if (rep.code === 200) {
                        let finishList = []; // 已办列表
                        rep.content.map(item => {
                            finishList.push(item);
                        });
                        console.log('已办列表', finishList);
                        this.setState({
                            finishList
                        });
                    }
                });
            }
        });
    }
    getFlowList () {
        const { getFlowList } = this.props.actions;
        getFlowList({}, {
            name: '', // 流程名称
            status: 1, // 启用
            page: '', // 页码
            size: ''
        }).then(rep => {
            if (rep.code === 1) {
                console.log(rep.content, 'flow数据');
                this.setState({
                    flowDataList: rep.content
                });
            }
        });
    }
    onQuery () {
        this.getProcessList();
        this.getFinishList();
    }
    onClear () {

    }
    onChangeTable () {

    }
    render () {
        const { loadingProcess, loadingFinish, type, flowDataList, processList, finishList, workDetails } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div style={{textAlign: 'center', marginBottom: 20}}>
                    <RadioGroup value={type} onChange={this.chaneType}>
                        <RadioButton key={0} value='process'>
                            待办任务
                        </RadioButton>
                        <RadioButton key={1} value='finish'>
                            已完成任务
                        </RadioButton>
                    </RadioGroup>
                </div>
                <div>
                    <Form layout='inline'>
                        <FormItem label='任务名称'>
                            {getFieldDecorator('name')(
                                <Input placeholder='请输入任务名称' />
                            )}
                        </FormItem>
                        <FormItem label='任务类型'>
                            {getFieldDecorator('type')(
                                <Select
                                    style={{ width: 180 }}
                                    placeholder='请选择任务类型'
                                    allowClear
                                >
                                    {flowDataList.map(item => {
                                        return (
                                            <Option
                                                key={item.ID}
                                                value={item.Name}
                                            >
                                                {item.Name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='发起人'>
                            {getFieldDecorator('starter')(
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder='请选择发起人'
                                    optionFilterProp='children'
                                >
                                    <Option value='jack' key='jack'>Jack</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label='发起时间'>
                            {getFieldDecorator('startTime', {
                                initialValue: []
                            })(
                                <RangePicker
                                    size='default'
                                    format={dateFormat}
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onQuery.bind(this)}>
                                查询
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                {
                    type === 'process' ? <Spin tip='加载中' spinning={loadingProcess}>
                        <Table columns={this.columnsProcess}
                            dataSource={processList}
                            bordered
                            rowKey='ID'
                            onChange={this.onChangeTable.bind(this)}
                        />
                    </Spin> : <Spin tip='加载中' spinning={loadingFinish}>
                        <Table columns={this.columnsFinish}
                            dataSource={finishList}
                            bordered
                            rowKey='ID'
                            onChange={this.onChangeTable.bind(this)}
                        />
                    </Spin>
                }
            </div>
        );
    }
    onDetails (ID) {
        // const { getWorkDetails } = this.props.actions;
        // getWorkDetails({
        //     ID
        // }, {}).then(rep => {
        //     console.log('详情', rep);
        //     this.setState({
        //         workDetails: rep
        //     });
        // });
    }
    chaneType = async (event) => {
        console.log('切换', event.target.value);
        this.setState({
            type: event.target.value
        });
    }
}

export default Form.create()(TaskList);
