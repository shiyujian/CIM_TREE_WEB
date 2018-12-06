import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Table,
    Modal,
    DatePicker,
    notification,
    Popconfirm
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    WORKFLOW_CODE,
    SCHEDULRPROJECT
} from '_platform/api';
import { getNextStates } from '_platform/components/Progress/util';
import { getUserIsManager } from '_platform/auth';
import PerSearch from './PerSearch';
import WeekPlanSearchInfo from './WeekPlanSearchInfo';
import ActualModal from './ActualModal';
moment.locale('zh-cn');
const FormItem = Form.Item;
class Actual extends Component {
    constructor (props) {
        super(props);
        this.state = {
            // 每日实际进度
            actualData: [],
            filterData: [], // 对流程信息根据项目进行过滤
            // 多选
            selectedRowKeys: [],
            dataSourceSelected: [],
            // 项目信息
            projectName: '',
            currentSection: '',
            currentSectionName: '',
            // 用户信息
            user: '',
            // 新增流程
            visible: false,
            actualDataSource: [],
            // 流程详情
            actualModalVisible: false,
            actualModaldata: []
        };
    }

    async componentDidMount () {
        this.gettaskSchedule();
        this.getSection();
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
        console.log('projectCode', projectCode);
        return projectCode;
    }
    // 获取当前登陆用户的标段
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);

        let sections = user && user.account && user.account.sections;
        console.log('sections', sections);
        let currentSectionName = '';
        let projectName = '';
        let section = '';
        if (sections && sections instanceof Array && sections.length > 0) {
            section = sections[0];
            console.log('section', section);
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
    // 获取日实际进度流程信息
    gettaskSchedule = async () => {
        const {
            actions: { getTaskSchedule }
        } = this.props;
        let reqData = {};
        this.props.form.validateFields((err, values) => {
            console.log('日实际进度流程信息', values);
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

        console.log('reqData', reqData);

        let tmpData = Object.assign({}, reqData);

        let task = await getTaskSchedule(
            { code: WORKFLOW_CODE.每日进度填报流程 },
            tmpData
        );

        let totledata = [];
        if (task && task instanceof Array) {
            task.map((item, index) => {
                let itemdata = item.subject[0];
                let itempostdata = itemdata.postData
                    ? JSON.parse(itemdata.postData)
                    : null;
                let actualDataSource = itemdata.actualDataSource
                    ? JSON.parse(itemdata.actualDataSource)
                    : [];
                let itemarrange = {
                    index: index + 1,
                    id: item.id,
                    section: itemdata.section
                        ? JSON.parse(itemdata.section)
                        : '',
                    sectionName: itemdata.sectionName
                        ? JSON.parse(itemdata.sectionName)
                        : '',
                    projectName: itemdata.projectName
                        ? JSON.parse(itemdata.projectName)
                        : '',
                    type: itempostdata.type,
                    submitperson: item.creator.person_name,
                    submittime: moment(item.workflow.created_on)
                        .utc()
                        .zone(-8)
                        .format('YYYY-MM-DD'),
                    status: item.status,
                    actualTimeDate: itemdata.actualTimeDate
                        ? JSON.parse(itemdata.actualTimeDate)
                        : '',
                    actualDataSource: actualDataSource,
                    actualSupervisorReview: itemdata.actualSupervisorReview
                        ? JSON.parse(itemdata.actualSupervisorReview).person_name
                        : ''
                };
                totledata.push(itemarrange);
            });
            this.setState(
                {
                    actualData: totledata
                },
                () => {
                    this.filterTask();
                }
            );
        }
    };

    // 对流程信息根据选择项目进行过滤
    filterTask () {
        const { actualData } = this.state;
        const { leftkeycode } = this.props;
        let filterData = [];
        let user = localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);
        // 是否为业主或管理员
        let permission = getUserIsManager();
        if (permission) {
            // 业主或管理员可以看选择项目的进度流程
            actualData.map(task => {
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
                actualData.map(task => {
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
                {this.state.actualModalVisible && (
                    <ActualModal
                        {...this.props}
                        {...this.state.actualModaldata}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleCancle.bind(this)}
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
                    title='新增每日实际进度'
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
                                                {getFieldDecorator('actualSection', {
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
                                                    'actualTimeDate',
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
                                                    <DatePicker
                                                        format={'YYYY-MM-DD'}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            columns={this.columns1}
                                            dataSource={
                                                this.state.actualDataSource
                                            }
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
                                                    'actualSupervisorReview',
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
                                                            WORKFLOW_CODE.每日进度填报流程
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
    // 多选
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys);
        console.log('selectedRows', selectedRows);
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    };
    // 新增按钮
    addClick = () => {
        let treedata = [];
        SCHEDULRPROJECT.map((item) => {
            treedata.push({
                key: item.id - 1,
                project: item.name,
                units: item.units
            });
        });
        console.log('SCHEDULRPROJECT', SCHEDULRPROJECT);
        console.log('treedata', treedata);
        this.setState({
            visible: true,
            actualDataSource: treedata
        });
        this.props.form.setFieldsValue({
            actualSection: this.state.currentSectionName || undefined,
            actualSupervisorReview: undefined,
            actualTimeDate: moment().utc()
        });
    };
    // 关闭弹框
    closeModal () {
        this.props.form.setFieldsValue({
            actualSection: undefined,
            actualSupervisorReview: undefined,
            actualTimeDate: undefined
        });
        this.setState({
            visible: false,
            actualDataSource: []
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
            actualSupervisorReview: this.member
        });
    }
    // 发起填报
    sendWork () {
        const {
            actions: { createFlow, getWorkflowById, putFlow }
        } = this.props;
        const {
            actualDataSource,
            projectName,
            currentSectionName,
            currentSection,
            user
        } = this.state;
        let me = this;
        // 共有信息
        let postData = {};

        me.props.form.validateFields((err, values) => {
            console.log('表单信息', values);
            if (!err) {
                postData.upload_unit = user.account ? user.account.org_code : '';
                postData.type = '每日实际进度';
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
                        actualSupervisorReview: JSON.stringify(values.actualSupervisorReview),
                        actualTimeDate: JSON.stringify(moment(values.actualTimeDate._d).format('YYYY-MM-DD')),
                        actualDataSource: JSON.stringify(actualDataSource),
                        postData: JSON.stringify(postData),
                        fillPerson: JSON.stringify(currentUser)
                    }
                ];
                // 准备发起流程
                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: '每日实际进度填报流程',
                    desc: '进度管理模块每日实际进度填报流程',
                    code: WORKFLOW_CODE.每日进度填报流程
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
                    console.log('rst', rst);
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
        this.setState({ actualModalVisible: true, actualModaldata: record });
    }
    // 取消
    totleCancle () {
        this.setState({ actualModalVisible: false });
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '18%'
        },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName',
            width: '12%'
        },
        {
            title: '进度类型',
            dataIndex: 'type',
            key: 'type',
            width: '18%'
        },
        {
            title: '提交人',
            dataIndex: 'submitperson',
            key: 'submitperson',
            width: '15%'
        },
        {
            title: '提交时间',
            dataIndex: 'submittime',
            key: 'submittime',
            width: '17%',
            sorter: (a, b) =>
                moment(a['submittime']).unix() - moment(b['submittime']).unix(),
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
            dataIndex: 'key',
            key: 'key',
            width: '10%',
            render: (text, record, index) => {
                return <span>{record.key + 1}</span>;
            }
        },
        {
            title: '项目',
            dataIndex: 'project',
            key: 'project',
            render: (text, record, index) => {
                if (record.project) {
                    return text;
                }
            }
        },
        {
            title: '单位',
            dataIndex: 'units',
            key: 'units'
        },
        {
            title: '数量',
            dataIndex: 'actualNum',
            key: 'actualNum',
            render: (text, record, index) => {
                return (
                    <Input
                        value={record.actualNum || 0}
                        onChange={this.handleActualNumChange.bind(this, index)}
                    />
                );
            }
        }
    ];
    // 实际数量的输入
    handleActualNumChange = (index, data) => {
        const {
            actualDataSource
        } = this.state;
        try {
            actualDataSource[index].actualNum = data.target.value;
            this.setState({
                actualDataSource
            });
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(Actual);
