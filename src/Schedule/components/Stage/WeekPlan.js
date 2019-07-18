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
import { getUserIsManager } from '_platform/auth';
import PerSearch from './PerSearch';
import WeekPlanSearchInfo from './WeekPlanSearchInfo';
import WeekPlanModal from './WeekPlanModal';
const FormItem = Form.Item;

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
            filterData: [], // 对流程信息根据项目进行过滤
            currentSection: '',
            currentSectionName: '',
            stime: null,
            etime: null,
            weekPlanDataSource: [],
            user: ''
        };
    }
    async componentDidMount () {
        await this.gettaskSchedule();
        await this.getSection();
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
    // 获取当前登陆用户的标段
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = localStorage.getItem('LOGIN_USER_DATA');
        user = JSON.parse(user);

        let sections = user && user.account && user.account.sections;
        let currentSectionName = '';
        let projectName = '';
        let section = '';
        if (sections && sections instanceof Array && sections.length > 0) {
            section = sections[0];
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        projectName = item.Name;
                        let units = item.children;
                        units.map(unit => {
                            // 获取当前标段的名字
                            if (unit.No === section) {
                                currentSectionName = unit.Name;
                            }
                        });
                    }
                });
            }
        }
        this.setState({
            currentSection: section,
            currentSectionName: currentSectionName,
            projectName: projectName,
            user
        });
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
        let user = localStorage.getItem('LOGIN_USER_DATA');
        user = JSON.parse(user);
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
            let sections = user && user.account && user.account.sections;
            let selectCode = '';
            // 关联标段的人只能看自己项目的进度流程
            if (sections && sections instanceof Array && sections.length > 0) {
                let code = sections[0].split('-');
                selectCode = code[0] || '';

                weekData.map(task => {
                    let projectName = task.projectName;
                    let projectCode = this.getProjectCode(projectName);

                    if (
                        projectCode === selectCode &&
                            task.section === sections[0]
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
            filterData,
            currentSectionName,
            stime,
            etime,
            weekPlanDataSource,
            user
        } = this.state;
        const {
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
                <WeekPlanSearchInfo
                    {...this.props}
                    {...this.state}
                    gettaskSchedule={this.gettaskSchedule.bind(this)}
                />
                <Button onClick={this.addClick.bind(this)}>新增</Button>
                {username === 'admin' ? (
                    <Popconfirm
                        placement='leftTop'
                        title='确定删除吗？'
                        onConfirm={this.deleteClick.bind(this)}
                        okText='确认'
                        cancelText='取消'
                    >
                        <Button>删除</Button>
                    </Popconfirm>
                ) : (
                    ''
                )}
                <Table
                    columns={this.columns}
                    rowSelection={username === 'admin' ? rowSelection : null}
                    dataSource={filterData}
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
                    onOk={this.sendWork.bind(this)}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Row>
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
                                            columns={this.columns1}
                                            dataSource={weekPlanDataSource}
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
                                                    'weekSupervisorReview',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请选择审核人员'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <PerSearch
                                                        selectMember={this.selectMember.bind(
                                                            this
                                                        )}
                                                        code={
                                                            WORKFLOW_CODE.每周进度填报流程
                                                        }
                                                        visible={
                                                            this.state.visible
                                                        }
                                                    />
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
    // 新增按钮
    addClick = () => {
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
        let weekPlanDataSource = [];
        for (;start <= end; start += 86400000) {
            let tmp = new Date(start);
            weekPlanDataSource.push({
                date: moment(tmp).format('YYYY-MM-DD')
            });
        }
        this.props.form.setFieldsValue({
            weekTimeDate: moment(stime).format('YYYY-MM-DD') + '~' +
                moment(etime).format('YYYY-MM-DD')
        });
        this.setState({
            weekPlanDataSource
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
    // 发起填报
    sendWork () {
        const {
            actions: { createFlow, getWorkflowById, putFlow }
        } = this.props;
        const {
            projectName,
            currentSectionName,
            currentSection,
            stime,
            etime,
            weekPlanDataSource,
            user
        } = this.state;
        let me = this;
        // 共有信息
        let postData = {};

        me.props.form.validateFields((err, values) => {
            console.log('err', err);
            if (!err) {
                postData.upload_unit = user.account ? user.account.org_code : '';
                postData.type = '每周计划进度';
                postData.upload_person = user.account ? user.account.person_name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DD HH:mm:ss');

                const currentUser = {
                    username: user.username,
                    person_code: user && user.account && user.account.person_code,
                    person_name: user && user.account && user.account.person_name,
                    id: user && parseInt(user.id),
                    org: user && user.account && user.account.org_code
                };

                let subject = [
                    {
                        section: JSON.stringify(currentSection),
                        projectName: JSON.stringify(projectName),
                        sectionName: JSON.stringify(currentSectionName),
                        supervisorReview: JSON.stringify(values.weekSupervisorReview),
                        stime: JSON.stringify(moment(stime).format('YYYY-MM-DD')),
                        etime: JSON.stringify(moment(etime).format('YYYY-MM-DD')),
                        weekPlanDataSource: JSON.stringify(weekPlanDataSource),
                        postData: JSON.stringify(postData),
                        fillPerson: JSON.stringify(currentUser)
                    }
                ];
                // 准备发起流程
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: '每周进度填报流程',
                    desc: '进度管理模块每周进度填报流程',
                    code: WORKFLOW_CODE.每周进度填报流程
                };
                let workflowdata = {
                    name: WORKFLOW_MAP.name,
                    description: WORKFLOW_MAP.desc,
                    subject: subject,
                    code: WORKFLOW_MAP.code,
                    creator: currentUser,
                    plan_start_time: null,
                    deadline: null,
                    status: 2
                };
                    // 创建流程
                createFlow({}, workflowdata).then(instance => {
                    if (!instance.id) {
                        notification.error({
                            message: '数据提交失败',
                            duration: 2
                        });
                        return;
                    }
                    const { id } = instance;
                    // 获取流程信息
                    getWorkflowById({ id: id }).then(instance => {
                        if (instance && instance.current) {
                            let currentStateId = instance.current[0].id;
                            let nextStates = getNextStates(
                                instance,
                                currentStateId
                            );
                            let stateid = nextStates[0].to_state[0].id;
                            let postInfo = {
                                next_states: [
                                    {
                                        state: stateid,
                                        participants: [nextUser], // 下一步执行人
                                        deadline: null,
                                        remark: null
                                    }
                                ],
                                state: instance.workflow.states[0].id,
                                executor: currentUser,
                                action: nextStates[0].action_name,
                                note: '提交',
                                attachment: null
                            };
                            let data = { pk: id };
                            // 提交流程到下一步
                            putFlow(data, postInfo).then(rst => {
                                if (rst && rst.creator) {
                                    notification.success({
                                        message: '流程提交成功',
                                        duration: 2
                                    });
                                    this.gettaskSchedule();
                                    this.setState({
                                        visible: false
                                    });
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    // 删除
    deleteClick = async () => {
        const {
            actions: { deleteFlow }
        } = this.props;
        const {
            dataSourceSelected,
            user
        } = this.state;
        try {
            if (dataSourceSelected.length === 0) {
                notification.warning({
                    message: '请先选择数据！',
                    duration: 3
                });
            } else {
                let username = user.username;

                if (username !== 'admin') {
                    notification.warning({
                        message: '非管理员不得删除！',
                        duration: 3
                    });
                    return;
                }

                let flowArr = dataSourceSelected.map(data => {
                    if (data && data.id) {
                        return data.id;
                    }
                });

                let promises = flowArr.map(flow => {
                    let data = flow;
                    let postdata = {
                        pk: data
                    };
                    return deleteFlow(postdata);
                });
                Promise.all(promises).then(rst => {
                    // 是否删除失败
                    let errorStatus = false;
                    // 删除失败的顺序码
                    let errorArr = [];
                    rst.map((data, index) => {
                        if (data) {
                            errorStatus = true;
                            errorArr.push(index + 1);
                        }
                    });
                    // 存在删除失败
                    if (errorStatus) {
                        let stringData = '';
                        // 将删除失败的顺序码数组进行组合
                        errorArr.map((data, index) => {
                            if (index === 0) {
                                stringData = stringData + data;
                            } else {
                                stringData = stringData + ',' + data;
                            }
                        });
                        notification.error({
                            message: `第${stringData}条流程删除失败`,
                            duration: 3
                        });
                    } else {
                        notification.success({
                            message: '删除流程成功',
                            duration: 3
                        });
                    }
                    this.setState({
                        selectedRowKeys: [],
                        dataSourceSelected: []
                    });
                    this.gettaskSchedule();
                });
            }
        } catch (e) {
            console.log('deleteClick', e);
        }
    };
    // 操作--查看
    clickInfo (record) {
        this.setState({ flowDetailVisible: true, flowDetailModaldata: record });
    }
    // 流程详情取消
    totleCancle () {
        this.setState({ flowDetailVisible: false });
    }
    // 流程详情确定
    totleOk () {
        this.setState({ flowDetailVisible: false });
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'projectName',
            key: 'projectName',
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
                return (
                    <span>
                        <a onClick={this.clickInfo.bind(this, record, 'VIEW')}>
                            查看
                        </a>
                    </span>
                );
            }
        }
    ];

    columns1 = [
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
    handlePlanTreeNumChage = (index, data) => {
        const {
            weekPlanDataSource
        } = this.state;
        try {
            weekPlanDataSource[index].planTreeNum = data.target.value;
            this.setState({
                weekPlanDataSource
            });
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(WeekPlan);
