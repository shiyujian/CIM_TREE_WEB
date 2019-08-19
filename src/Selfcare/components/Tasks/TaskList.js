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
        this.getProcessList = this.getProcessList.bind(this); // 获取待办列表
        this.getFinishList = this.getFinishList.bind(this); // 获取已办列表
        this.getFlowList = this.getFlowList.bind(this); // 获取任务列表
    }
    componentDidMount () {
        this.getFlowList();
        this.getProcessList();
        this.getFinishList();
    }
    getProcessList () { // 获取待办
        this.setState({
            loadingProcess: true
        });
        let { getWorkList } = this.props.actions;
        let { validateFields } = this.props.form;
        console.log('当前用户ID', getUser().ID);
        validateFields((err, values) => {
            if (!err) {
                let stime = '';
                let etime = '';
                if (values.startTime && values.startTime.length) {
                    stime = moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss');
                    etime = moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                let params = {
                    workid: '', // 任务ID
                    title: values.name || '', // 任务名称
                    flowid: values.type || '', // 流程类型或名称
                    starter: values.starter || '', // 发起人
                    currentnode: '', // 节点ID
                    prevnode: '', // 上一结点ID
                    executor: getUser().ID || '', // 执行人
                    wfstate: '0,1,4', // 待办
                    stime, // 开始时间
                    etime, // 结束时间
                    page: '', // 页码
                    size: '' // 页数
                };
                getWorkList({}, params).then(rep => {
                    if (rep && rep.code && rep.code === 200) {
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
                    stime = moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss');
                    etime = moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                console.log('值', values.startTime);
                let params = {
                    workid: '', // 任务ID
                    title: values.name || '', // 任务名称
                    flowid: values.type || '', // 流程类型或名称
                    starter: values.starter || '', // 发起人
                    currentnode: '', // 节点ID
                    prevnode: '', // 上一结点ID
                    executor: '', // 执行人
                    wfstate: '2', // 待办
                    stime, // 开始时间
                    etime, // 结束时间
                    page: '', // 页码
                    size: '' // 页数
                };
                getWorkList({}, params).then(rep => {
                    if (rep && rep.code && rep.code === 200) {
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
            if (rep && rep.code && rep.code === 1) {
                console.log(rep.content, 'flow数据');
                this.setState({
                    flowDataList: rep.content
                });
            }
        });
    }
    onSearch () {
        this.getProcessList(); // 获取待办
        this.getFinishList(); // 获取已办
    }
    onClear () {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            name: undefined,
            type: undefined,
            startTime: undefined
        });
        this.getProcessList(); // 获取待办
        this.getFinishList(); // 获取已办
    }
    onChangeTable () {

    }
    render () {
        const {
            loadingProcess,
            loadingFinish,
            type,
            flowDataList,
            processList,
            finishList
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <div style={{textAlign: 'center', marginBottom: 20}}>
                    <RadioGroup value={type} onChange={this.chaneType}>
                        <RadioButton key='process' value='process'>
                            待办任务
                        </RadioButton>
                        <RadioButton key='finish' value='finish'>
                            已完成任务
                        </RadioButton>
                    </RadioGroup>
                </div>
                <div>
                    <Form>
                        <Row>
                            <Col span={20}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label='任务名称'>
                                            {
                                                getFieldDecorator('name')(
                                                    <Input placeholder='请输入任务名称' />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label='任务类型'>
                                            {
                                                getFieldDecorator('type')(
                                                    <Select
                                                        style={{ width: '100%' }}
                                                        placeholder='请选择任务类型'
                                                        allowClear
                                                    >
                                                        {flowDataList.map(item => {
                                                            return (
                                                                <Option
                                                                    key={item.ID}
                                                                    value={item.ID}
                                                                >
                                                                    {item.Name}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label='发起时间'>
                                            {
                                                getFieldDecorator('startTime', {
                                                    initialValue: []
                                                })(
                                                    <RangePicker
                                                        style={{ width: '100%' }}
                                                        showTime={{ format: 'HH:mm:ss' }}
                                                        size='default'
                                                        format='YYYY-MM-DD HH:mm:ss'
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={3} offset={1}>
                                <Row>
                                    <FormItem>
                                        <Button
                                            type='primary'
                                            onClick={this.onSearch.bind(this)}
                                        >
                                            查询
                                        </Button>
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem>
                                        <Button onClick={this.onClear.bind(this)}>
                                            清除
                                        </Button>
                                    </FormItem>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
                {
                    type === 'process' ? <Spin tip='加载中' spinning={loadingProcess}>
                        <Table
                            columns={this.columnsProcess}
                            dataSource={processList}
                            bordered
                            rowKey='ID'
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
    chaneType = async (event) => {
        console.log('切换', event.target.value);
        this.setState({
            type: event.target.value
        });
    }
    columnsProcess = [{
        title: '序号',
        dataIndex: 'index',
        render: (text, record, index) => {
            return index + 1;
        }
    }, {
        title: '任务名称',
        dataIndex: 'Title'
    }, {
        title: '任务类型',
        dataIndex: 'FlowName'
    }, {
        title: '发起人',
        dataIndex: 'StarterObj',
        render: (text, record, index) => {
            return `${text.Full_Name}(${text.User_Name})`;
        }
    }, {
        title: '发起时间',
        dataIndex: 'CreateTime'
    }, {
        title: '当前执行人',
        dataIndex: 'NextExecutorObj',
        render: (text, record, index) => {
            let str = '';
            if (record.NextExecutorObj && record.NextExecutorObj.Full_Name && record.NextExecutorObj.User_Name) {
                str = `${text.Full_Name}(${text.User_Name})`;
            }
            return str;
        }
    }, {
        title: '流转状态',
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
        title: '操作',
        dataIndex: 'active',
        render: (text, record, index) => {
            return (<div>
                <Link to={`/selfcare/task/${record.ID}?mode=selfcare`}>
                    <span>
                        查看详情
                    </span>
                </Link>
            </div>);
        }
    }];
    columnsFinish = [{
        title: '序号',
        dataIndex: 'index',
        render: (text, record, index) => {
            return index + 1;
        }
    }, {
        title: '任务名称',
        dataIndex: 'Title'
    }, {
        title: '任务类型',
        dataIndex: 'FlowName'
    }, {
        title: '发起人',
        dataIndex: 'StarterObj',
        render: (text, record, index) => {
            return `${text.Full_Name}(${text.User_Name})`;
        }
    }, {
        title: '发起时间',
        dataIndex: 'CreateTime'
    }, {
        title: '执行人',
        dataIndex: 'Executor',
        render: (text, record, index) => {
            let Executor = '';
            if (record.ExecutorObj) {
                Executor = `${record.ExecutorObj.Full_Name}(${record.ExecutorObj.User_Name})`;
            }
            return Executor;
        }
    }, {
        title: '执行时间',
        dataIndex: 'CompleteTime'
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
        title: '操作',
        dataIndex: 'active',
        render: (text, record, index) => {
            return (<div>
                <Link to={`/selfcare/task/${record.ID}?mode=selfcare`}>
                    <span>
                        查看详情
                    </span>
                </Link>
            </div>);
        }
    }];
}

export default Form.create()(TaskList);
