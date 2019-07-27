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
    Upload,
    notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    WORKFLOW_CODE
} from '_platform/api';
import { getNextStates } from '_platform/components/Progress/util';
import { getUserIsManager, getUser } from '_platform/auth';
import PerSearch from './PerSearch';
import WeekPlanSearchInfo from './WeekPlanSearchInfo';
import WeekPlanModal from './WeekPlanModal';
import { WFStatusList } from '../common';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class WeekPlan extends Component {
    constructor (props) {
        super(props);
        this.state = {
            weekData: [],
            flowDetailModaldata: [],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            flowDetailVisible: false,
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
    }
    async componentDidMount () {
        // await this.gettaskSchedule();
        this.getSection(); // 获取当前登陆用户的标段
        this.getWorkList(); // 获取任务列表
    }
    getSection () {
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        console.log('获取用户所属标段', tree, 'leftkeycode');
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();

        let section = user.section;
        let currentSectionName = '';
        let projectName = '';
        let sectionArray = [];

        if (section) {
            console.log(section, '用户所在标段');
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
                        console.log(item.children, 'item.children');
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
            console.log('sectionArray', sectionArray);
            this.setState({
                section: section,
                sectionArray,
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        } else {
            sectionData.map(project => {
                if (leftkeycode === project.No) {
                    project.children.map(item =>
                        sectionArray.push(item)
                    );
                }
            });
            this.setState({
                sectionArray
            });
        }
    }
    getWorkList (pro = {}) {
        const { getWorkList } = this.props.actions;
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowname: 'b0eedc49-fe00-4754-a4fe-885e9177e663', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            haveexecuted: '', // 是否已执行 1已办
            stime: '', // 开始时间
            etime: '', // 结束时间
            page: '', // 页码
            size: '' // 页数
        };
        getWorkList({}, params).then(rep => {
            if (rep.code === 200) {
                let workDataList = [];
                rep.content.map(item => {
                    workDataList.push(item);
                });
                console.log('任务列表', workDataList);
                this.setState({
                    workDataList
                });
            }
        });
    }
    // 获取项目code
    getProjectCode (projectName) {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let projectCode = '';
        sectionData.map(item => {
            if (projectName === item.Name) {
                projectCode = item.No;
            }
        });
        return projectCode;
    }
    // 获取周计划进度流程信息
    gettaskSchedule = async () => {
        const {
            actions: { getTaskSchedule }
        } = this.props;
        try {
            let reqData = {};
            this.props.form.validateFields((err, values) => {
                console.log('err', err);
                reqData.subject_section__contains = values.sunitproject
                    ? values.sunitproject
                    : '';
                reqData.real_start_time_begin = values.stimedate
                    ? moment(values.stimedate[0]._d).format('YYYY-MM-DD 00:00:00')
                    : '';
                reqData.real_start_time_end = values.stimedate
                    ? moment(values.stimedate[1]._d).format('YYYY-MM-DD 23:59:59')
                    : '';
                if (values.sstatus) {
                    reqData.status = values.sstatus
                        ? values.sstatus
                        : '';
                }
            });

            let tmpData = Object.assign({}, reqData);
            let task = await getTaskSchedule(
                { code: WORKFLOW_CODE.每周进度填报流程 },
                tmpData
            );

            let totledata = [];
            if (task && task instanceof Array) {
                task.map((item, index) => {
                    let itemSubject = item.subject[0];
                    let itemPostData = itemSubject.postData
                        ? JSON.parse(itemSubject.postData)
                        : null;
                    let itemarrange = {
                        index: index + 1,
                        id: item.id,
                        section: itemSubject.section
                            ? JSON.parse(itemSubject.section)
                            : '',
                        sectionName: itemSubject.sectionName
                            ? JSON.parse(itemSubject.sectionName)
                            : '',
                        projectName: itemSubject.projectName
                            ? JSON.parse(itemSubject.projectName)
                            : '',
                        stime: itemSubject.stime
                            ? JSON.parse(itemSubject.stime)
                            : '',
                        etime: itemSubject.etime
                            ? JSON.parse(itemSubject.etime)
                            : '',
                        weekPlanDataSource: itemSubject.weekPlanDataSource
                            ? JSON.parse(itemSubject.weekPlanDataSource)
                            : [],
                        supervisorReview: itemSubject.supervisorReview
                            ? JSON.parse(itemSubject.supervisorReview).person_name
                            : '',
                        type: itemPostData.type,
                        submitPerson: item.creator.person_name + '(' + item.creator.username + ')',
                        submitTime: moment(item.workflow.created_on)
                            .utc()
                            .zone(-8)
                            .format('YYYY-MM-DD'),
                        status: item.status
                    };
                    totledata.push(itemarrange);
                });
                this.setState(
                    {
                        weekData: totledata
                    },
                    () => {
                        this.filterTask();
                    }
                );
            }
        } catch (e) {
            console.log('gettaskSchedule', e);
        }
    };
    // 对流程信息根据选择项目进行过滤
    filterTask () {
        const { weekData } = this.state;
        const { leftkeycode } = this.props;
        let filterData = [];
        let user = getUser();
        // 是否为业主或管理员
        let permission = getUserIsManager();
        if (permission) {
            // 业主或管理员可以看选择项目的进度流程
            weekData.map(task => {
                let projectName = task.projectName;
                let projectCode = this.getProjectCode(projectName);
                if (leftkeycode) {
                    if (projectCode === leftkeycode) {
                        filterData.push(task);
                    }
                } else {
                    filterData.push(task);
                }
            });
        } else {
            let section = user && user.section;
            let selectCode = '';
            // 关联标段的人只能看自己项目的进度流程
            if (section) {
                let code = section.split('-');
                selectCode = code[0] || '';

                weekData.map(task => {
                    let projectName = task.projectName;
                    let projectCode = this.getProjectCode(projectName);

                    if (
                        projectCode === selectCode &&
                            task.section === section
                    ) {
                        filterData.push(task);
                    }
                });
            }
        }
        this.setState({
            filterData
        });
    }

    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        if (leftkeycode !== prevProps.leftkeycode) {
            this.filterTask();
        }
    }

    render () {
        const {
            selectedRowKeys,
            sectionArray,
            filterData,
            currentSectionName,
            stime,
            etime,
            workDataList,
            weekPlanDataSource,
            TableList,
            user
        } = this.state;
        const {
            auditorList,
            form: { getFieldDecorator }
        } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let username = user && user.username;
        return (
            <div>
                {this.state.flowDetailVisible && (
                    <WeekPlanModal
                        {...this.props}
                        {...this.state.flowDetailModaldata}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                )}
                <Form layout='inline'>
                    <FormItem label='标段'>
                        {getFieldDecorator('sunitproject', {
                            rules: [
                                {
                                    required: false,
                                    message: '请选择标段'
                                }
                            ]
                        })(
                            <Select placeholder='请选择标段' style={{width: 220}}>
                                {sectionArray.map(item => {
                                    return <Option value={item.Name} key={item.No}>{item.Name}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='提交日期'>
                        {getFieldDecorator('stimedate', {
                            rules: [
                                {
                                    type: 'array',
                                    required: false,
                                    message: '请选择日期'
                                }
                            ]
                        })(
                            <RangePicker
                                size='default'
                                format='YYYY-MM-DD'
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label='流程状态'
                    >
                        {getFieldDecorator('sstatus', {
                            rules: [
                                {
                                    required: false,
                                    message: '请选择流程状态'
                                }
                            ]
                        })(
                            <Select
                                style={{width: 220}}
                                placeholder='请选择流程类型'
                                allowClear
                            >
                                {WFStatusList.map(item => {
                                    return <Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Form>
                <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                <Button style={{marginLeft: 20}} onClick={this.onAdd.bind(this)}>新增</Button>
                <Table
                    columns={this.columns}
                    rowSelection={username === 'admin' ? rowSelection : null}
                    dataSource={workDataList}
                    className='foresttable'
                    bordered
                    rowKey='index'
                />
                <Modal
                    title='新增每周计划进度'
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.closeModal.bind(this)}
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
                                                    'Title'
                                                )(
                                                    <Input
                                                        style={{width: 220}}
                                                        placeholder='请输入'
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='标段'
                                            >
                                                {getFieldDecorator('weekSection', {
                                                    initialValue: {
                                                        currentSectionName
                                                    },
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入标段'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        readOnly
                                                        placeholder='请输入标段'
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='日期'
                                            >
                                                {getFieldDecorator(
                                                    'weekTimeDate',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入日期'
                                                            }
                                                        ]
                                                    }
                                                )(
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
                                                                placeholder='Start'
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
                                            columns={this.columnsModal}
                                            dataSource={TableList}
                                            className='foresttable'
                                        />
                                    </Row>
                                    <Row>
                                        <Col span={8} offset={4}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='审核人'
                                            >
                                                {getFieldDecorator(
                                                    'TdataReview'
                                                )(
                                                    <Select style={{ width: 120 }}>
                                                        {auditorList.map(item => {
                                                            return <Option value={item.id} key={item.id}>{item.name}</Option>;
                                                        })}
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
    // 搜索
    onSearch () {
        let params = {
            flowname: '总进度计划报批流程', // 流程类型或名称
            stime: '', // 开始时间
            etime: '' // 结束时间
        };
        this.getWorkList();
    }
    // 新增按钮
    onAdd = () => {
        this.setState({
            visible: true
        });
        this.props.form.setFieldsValue({
            weekSection: this.state.currentSectionName || undefined,
            weekSupervisorReview: undefined,
            weekTimeDate: undefined
        });
    };
    // 关闭新增计划的弹窗
    closeModal () {
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
    // 多选按钮
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    };
    // 设置开始时间
    handleStartChange = (value) => {
        console.log('开始时间', value);
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
        console.log('设置表格数据', start, end);
        // let weekPlanDataSource = [];
        let TableList = [];
        for (;start <= end; start += 86400000) {
            let tmp = new Date(start);
            TableList.push({
                date: moment(tmp).format('YYYY-MM-DD')
            });
        }
        // console.log('设置表格数据', weekPlanDataSource);
        this.props.form.setFieldsValue({
            weekTimeDate: moment(stime).format('YYYY-MM-DD') + '~' +
                moment(etime).format('YYYY-MM-DD')
        });
        this.setState({
            TableList
        });
    }
    // 选择人员
    selectMember (memberInfo) {
        const {
            form: { setFieldsValue }
        } = this.props;
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    username: memberValue[4],
                    person_code: memberValue[1],
                    person_name: memberValue[2],
                    id: parseInt(memberValue[3]),
                    org: memberValue[5]
                };
            }
        } else {
            this.member = null;
        }
        setFieldsValue({
            weekSupervisorReview: this.member
        });
    }
    // 确认新增
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                const { section, TableList } = this.state;
                console.log('确认', values.Tsection, TableList);
                let newTableList = [];
                TableList.map(item => {
                    newTableList.push({
                        name: item.date,
                        planTreeNum: item.planTreeNum || ''
                    });
                });
                let FormParams = [{
                    Key: 'section', // 标段
                    FieldType: 0,
                    Val: section
                }, {
                    Key: 'tableInfo', // 列表信息
                    FieldType: 0,
                    Val: JSON.stringify(newTableList)
                }];
                postStartwork({}, {
                    FlowID: 'b0eedc49-fe00-4754-a4fe-885e9177e663', // 模板ID
                    FlowName: '每周进度填报流程', // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: '9088d095-7b3e-436c-b8d1-d9b758041ad0'
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
    // 操作--查看
    onLook (workID) {
        this.setState({ flowDetailVisible: true, workID });
    }
    // 流程详情取消
    totleCancle () {
        this.setState({ flowDetailVisible: false });
    }
    // 流程详情确定
    totleOk () {
        this.setState({ flowDetailVisible: false });
    }
    onDelete (workID) {
        console.log('删除workID', workID);
        const { deleteWork } = this.props.actions;
        deleteWork({
            ID: workID
        }, {}).then(rep => {

        });
    }
    columns = [
        {
            title: '任务名称',
            dataIndex: 'Title',
            key: 'Title',
            width: '16%'
        },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName',
            width: '11%'
        },
        {
            title: '进度类型',
            dataIndex: 'type',
            key: 'type',
            width: '18%'
        },
        {
            title: '提交人',
            dataIndex: 'submitPerson',
            key: 'submitPerson',
            width: '15%'
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime',
            key: 'submitTime',
            width: '20%',
            sorter: (a, b) =>
                moment(a['submitTime']).unix() - moment(b['submitTime']).unix(),
            render: text => {
                return moment(text).format('YYYY-MM-DD');
            }
        },
        {
            title: '流程状态',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (record, index) => {
                if (record === 1) {
                    return '已提交';
                } else if (record === 2) {
                    return '执行中';
                } else if (record === 3) {
                    return '已完成';
                } else {
                    return '';
                }
            }
        },
        {
            title: '操作',
            render: record => {
                return (<div>
                    <span>
                        <a onClick={this.onLook.bind(this, record.WorkID)}>
                            查看
                        </a>
                    </span>
                    <span style={{marginLeft: 10}}>
                        <a onClick={this.onDelete.bind(this, record.WorkID)}>
                            删除
                        </a>
                    </span>
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
                    <Input
                        value={record.planTreeNum || 0}
                        onChange={this.handlePlanTreeNumChage.bind(this, index)}
                    />
                );
            }
        }
    ];
    // 计划栽植量的输入
    handlePlanTreeNumChage = (index, e) => {
        const {
            TableList
        } = this.state;
        try {
            TableList[index].planTreeNum = e.target.value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(WeekPlan);
