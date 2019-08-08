import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Spin,
    Button,
    Table,
    Modal,
    Select,
    DatePicker,
    InputNumber,
    notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    WFStatusList
} from '_platform/api';
import { getUserIsManager, getUser } from '_platform/auth';
import WeekPlanModal from './WeekPlanModal';
import SearchFilter from './SearchFilter';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class WeekPlanNew extends Component {
    constructor (props) {
        super(props);
        this.state = {
            flowID: '', // 流程ID
            flowName: '', // 流程Name
            originNodeID: '', // 起点ID
            originNodeName: '', // 起点name
            weekData: [],
            flowDetailModaldata: [],
            dataSourceSelected: [],
            visible: false,
            visibleLook: false,
            projectName: '',
            TableList: [], // 列表信息
            sectionArray: [], // 标段列表
            filterData: [], // 对流程信息根据项目进行过滤
            currentSection: '',
            currentSectionName: '',
            stime: null,
            etime: null,
            weekPlanDataSource: [], //
            user: ''
        };
        this.getOriginNode = this.getOriginNode.bind(this); // 获取流程起点ID
        this.onAdd = this.onAdd.bind(this); // 新增
        this.onDelete = this.onDelete.bind(this); // 删除
        this.onLook = this.onLook.bind(this); // 查看
        this.handleCancel = this.handleCancel.bind(this); // 取消新增
        this.handleOK = this.handleOK.bind(this); // 新增任务
        this.getWorkList = this.getWorkList.bind(this); // 获取任务
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '任务名称',
            dataIndex: 'Title'
        },
        {
            title: '进度类型',
            dataIndex: 'FlowName'
        },
        {
            title: '项目',
            dataIndex: 'projectName'
        },
        {
            title: '标段',
            dataIndex: 'sectionName'
        },
        {
            title: '提交人',
            dataIndex: 'StarterObj',
            render: (text, record) => {
                return `${text.Full_Name}(${text.User_Name})`;
            }
        },
        {
            title: '提交时间',
            dataIndex: 'CreateTime'
        },
        {
            title: '流程状态',
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
            title: '操作',
            render: (text, record, index) => {
                let permission = getUserIsManager();
                return (<div>
                    <span>
                        <a onClick={this.onLook.bind(this, record.ID)}>
                            查看
                        </a>
                    </span>
                    {
                        permission
                            ? <span style={{marginLeft: 10}}>
                                <Popconfirm
                                    title='你确定删除该任务吗？'
                                    okText='是' cancelText='否'
                                    onConfirm={this.onDelete.bind(this, record.ID)}
                                >
                                    <a href='#'>
                                    删除
                                    </a>
                                </Popconfirm>
                            </span> : ''
                    }

                </div>);
            }
        }
    ];
    columnsModal = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '33%',
            render: (record, text, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: '33%'
        },
        {
            title: '计划栽植量',
            dataIndex: 'planTreeNum',
            key: 'planTreeNum',
            width: '34%',
            render: (text, record, index) => {
                return (
                    <InputNumber
                        value={record.planTreeNum || 0}
                        onChange={this.handlePlanTreeNumChage.bind(this, index)}
                    />
                );
            }
        }
    ];
    async componentDidMount () {
        this.getSection(); // 获取当前登陆用户的标段
        this.getFlowList(); // 获取流程
    }
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();

        let section = user.section;
        let currentSectionName = '';
        let projectName = '';
        let sectionArray = [];

        if (section) {
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
                        item.children.map(item => {
                            // 获取当前标段的名字
                            if (item.No === section) {
                                currentSectionName = item.Name;
                                sectionArray.push(item);
                            }
                        });
                    }
                });
            }
            this.setState({
                sectionArray,
                currentSection: section || '',
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        }
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
                    if (item.Name === '每周进度填报流程') {
                        flowID = item.ID;
                        flowName = item.Name;
                    }
                });
                console.log('每周', rep);
                this.setState({
                    flowID,
                    flowName
                }, () => {
                    let user = getUser();
                    let section = user && user.section;
                    let permission = getUserIsManager();
                    if (permission) {
                        this.getWorkList(); // 获取任务列表
                    } else if (section) {
                        let pro = {
                            keys: 'Section',
                            values: section
                        };
                        this.getWorkList(pro); // 获取任务列表
                    }
                    this.getOriginNode(); // 获取流程起点ID
                });
            }
        });
    }
    getWorkList = async (pro = {}) => {
        const {
            platform: { tree = {} },
            actions: {
                getWorkList
            }
        } = this.props;
        const { flowID } = this.state;
        let status = '';
        if (pro.status) {
            status = pro.status;
        } else if (pro.status === 0) {
            status = pro.status;
        };
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowid: flowID, // 流程类型或名称
            // flowid: '', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            wfstate: status, // 待办 0,1
            stime: pro.stime || '', // 开始时间
            etime: pro.etime || '', // 结束时间
            keys: pro.keys || '', // 查询键
            values: pro.values || '', // 查询值
            page: '', // 页码
            size: '' // 页数
        };
        console.log('params', params);
        let rep = await getWorkList({}, params);
        if (rep && rep.code && rep.code === 200) {
            let workDataList = [];
            let sectionData = (tree && tree.bigTreeList) || [];
            rep.content.map(item => {
                let sectionName = '';
                let projectName = '';
                if (item && item.Section) {
                    let code = item.Section.split('-');
                    if (code && code.length === 3) {
                        // 获取当前标段所在的项目
                        sectionData.map(project => {
                            if (code[0] === project.No) {
                                projectName = project.Name;
                                project.children.map(section => {
                                    // 获取当前标段的名字
                                    if (section.No === item.Section) {
                                        sectionName = section.Name;
                                    }
                                });
                            }
                        });
                        item.sectionName = sectionName;
                        item.projectName = projectName;
                    }
                }
                workDataList.push(item);
            });
            console.log('workDataList', workDataList);
            this.setState({
                workDataList
            });
        }
    }
    getOriginNode () {
        const { getNodeList } = this.props.actions;
        const { flowID } = this.state;
        getNodeList({}, {
            flowid: flowID, // 流程ID
            name: '', // 节点名称
            type: 1, // 节点类型
            status: 1 // 节点状态
        }).then(rep => {
            if (rep.length === 1) {
                this.setState({
                    originNodeID: rep[0].ID,
                    originNodeName: rep[0].Name
                });
            }
        });
    }
    // 新增按钮
    onAdd = () => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        const {
            currentSectionName
        } = this.state;
        setFieldsValue({
            Section: currentSectionName
        });
        this.setState({
            visible: true
        });
    };
    // 关闭新增计划的弹窗
    handleCancel () {
        this.props.form.setFieldsValue({
            weekSection: undefined,
            weekSupervisorReview: undefined,
            weekTimeDate: undefined
        });
        this.setState({
            visible: false,
            stime: null,
            etime: null,
            weekPlanDataSource: []
        });
    }
    // 设置开始时间
    handleStartChange = (value) => {
        const {
            etime
        } = this.state;
        this.setState({
            stime: value
        }, () => {
            if (etime && value) {
                this.setTableDate();
            }
        });
    }
    // 设置结束时间
    handleEndChange = (value) => {
        const {
            stime
        } = this.state;
        this.setState({
            etime: value
        }, () => {
            if (stime && value) {
                this.setTableDate();
            }
        });
    }
    // 设置开始时间的不可选择范围
    disabledStartDate = (stime) => {
        const etime = this.state.etime;
        if (!stime || !etime) {
            return false;
        }
        let weekDay = moment(etime).subtract(7, 'days');
        return (stime.valueOf() <= weekDay.valueOf()) || ((stime.valueOf() > etime.valueOf()));
    }
    // 设置结束时间的不可选择范围
    disabledEndDate = (etime) => {
        const stime = this.state.stime;
        if (!etime || !stime) {
            return false;
        }
        let weekDay = moment(stime).add(7, 'days');
        return (etime.valueOf() >= weekDay.valueOf()) || ((etime.valueOf() < stime.valueOf()));
    }
    //  设置表格的时间数据
    setTableDate = () => {
        const {
            stime,
            etime
        } = this.state;
        let start = new Date(stime).getTime();
        let end = new Date(etime).getTime();
        let TableList = [];
        for (let id = 0; start <= end; start += 86400000, id++) {
            let tmp = new Date(start);
            TableList.push({
                ID: id,
                date: moment(tmp).format('YYYY-MM-DD')
            });
        }
        this.props.form.setFieldsValue({
            weekTimeDate: moment(stime).format('YYYY-MM-DD') + '~' +
                moment(etime).format('YYYY-MM-DD')
        });
        console.log('表格', TableList);
        this.setState({
            TableList
        });
    }
    // 流程详情取消
    totleCancle () {
        this.setState({ visibleLook: false });
    }
    // 流程详情确定
    totleOk () {
        this.setState({ visibleLook: false });
    }
    // 确认新增
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        const {
            currentSection,
            TableList,
            stime,
            etime,
            originNodeID,
            flowID,
            flowName
        } = this.state;

        validateFields((err, values) => {
            if (!err) {
                if (!(TableList && TableList instanceof Array && TableList.length > 0)) {
                    Notification.error({
                        message: '请填写计划栽植量'
                    });
                    return;
                }
                let newTableList = [];
                TableList.map(item => {
                    newTableList.push({
                        ID: item.ID,
                        date: item.date,
                        planTreeNum: item.planTreeNum || ''
                    });
                });
                let FormParams = [
                    {
                        Key: 'Section', // 标段
                        FieldType: 0,
                        Val: currentSection
                    }, {
                        Key: 'StartDate', // 开始时间
                        FieldType: 0,
                        Val: moment(stime).format(dateFormat)
                    }, {
                        Key: 'EndDate', // 结束时间
                        FieldType: 0,
                        Val: moment(etime).format(dateFormat)
                    }, {
                        Key: 'TableInfo', // 列表信息
                        FieldType: 0,
                        Val: JSON.stringify(newTableList)
                    }
                ];
                postStartwork({}, {
                    FlowID: flowID, // 模板ID
                    FlowName: flowName, // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: originNodeID
                    },
                    NextExecutor: values.TdataReview, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: values.Title, // 任务标题
                    WFState: 1 // 流程状态 1运行中
                }).then(rep => {
                    if (rep.code === 1) {
                        notification.success({
                            message: '新增任务成功',
                            duration: 3
                        });
                        this.getWorkList();
                        this.setState({
                            visible: false
                        });
                    } else {
                        notification.error({
                            message: '新增任务失败',
                            duration: 3
                        });
                    }
                });
            }
        });
    }
    onDelete (workID) {
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: workID
        }, {}).then(rep => {
            if (rep.code === 1) {
                notification.success({
                    message: '删除任务成功',
                    duration: 3
                });
                this.getWorkList();
            } else {
                notification.error({
                    message: '删除任务失败',
                    duration: 3
                });
            }
        });
    }
    // 操作--查看
    onLook (workID) {
        this.setState({ visibleLook: true, workID });
    }
    // 计划栽植量的输入
    handlePlanTreeNumChage = (index, value) => {
        const {
            TableList
        } = this.state;
        try {
            TableList[index].planTreeNum = value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    render () {
        const {
            stime,
            etime,
            workDataList,
            TableList
        } = this.state;
        const {
            auditorList,
            form: { getFieldDecorator }
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                {this.state.visibleLook && (
                    <WeekPlanModal
                        {...this.props}
                        {...this.state}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                )}
                <SearchFilter
                    {...this.props}
                    {...this.state}
                    getWorkList={this.getWorkList.bind(this)}
                />
                <Button
                    type='primary'
                    style={{marginBottom: 10}}
                    onClick={this.onAdd.bind(this)}>
                        新增
                </Button>
                <Table
                    columns={this.columns}
                    dataSource={workDataList}
                    className='foresttable'
                    bordered
                    // rowKey='ID'
                />
                <Modal
                    title='新增每周计划进度'
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.handleCancel.bind(this)}
                    onOk={this.handleOK.bind(this)}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='任务名称'
                                            >
                                                {getFieldDecorator(
                                                    'Title', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入任务名称'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input
                                                        style={{width: 220}}
                                                        placeholder='请输入任务名称'
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='标段'
                                            >
                                                {getFieldDecorator('Section', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入标段'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        readOnly />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='日期'
                                            >
                                                {getFieldDecorator('weekTimeDate', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                '请选择日期'
                                                        }
                                                    ]
                                                })(
                                                    <Row gutter={5}>
                                                        <Col span={12}>
                                                            <DatePicker
                                                                disabledDate={this.disabledStartDate.bind(this)}
                                                                value={stime}
                                                                onChange={this.handleStartChange.bind(this)}
                                                                format='YYYY-MM-DD'
                                                                placeholder='Start'
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <DatePicker
                                                                disabledDate={this.disabledEndDate.bind(this)}
                                                                value={etime}
                                                                onChange={this.handleEndChange.bind(this)}
                                                                format='YYYY-MM-DD'
                                                                placeholder='End'
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%'
                                                                }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                )}

                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            rowKey='ID'
                                            columns={this.columnsModal}
                                            dataSource={TableList}
                                            className='foresttable'
                                        />
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='审核人'
                                            >
                                                {getFieldDecorator(
                                                    'TdataReview', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请选择审核人'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Select style={{ width: 150 }}>
                                                        {
                                                            auditorList.map(item => {
                                                                return <Option
                                                                    value={item.id}
                                                                    title={`${item.Full_Name}(${item.User_Name})`}
                                                                    key={item.id}>
                                                                    {`${item.Full_Name}(${item.User_Name})`}
                                                                </Option>;
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8} offset={4} />
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(WeekPlanNew);
