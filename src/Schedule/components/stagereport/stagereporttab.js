import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Spin,
    Icon,
    Button,
    Table,
    Modal,
    DatePicker,
    Progress,
    Upload,
    Select,
    Checkbox,
    notification,
    Popconfirm
} from 'antd';
// import {UPLOAD_API} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    WORKFLOW_CODE,
    base,
    SOURCE_API,
    DATASOURCECODE,
    PROJECT_UNITS,
    SCHEDULETREEDATA,
    TREETYPENO
} from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { getUser } from '../../../_platform/auth';
// import PerSearch from './PerSearch';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import SearchInfo from './SearchInfo';
import queryString from 'query-string';
import DayModal from './DayModal';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
class Stagereporttab extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stagedata: [],
            selectedRowKeys: [],
            dataSourceSelected: [],
            visible: false,
            dayvisible: false,
            isCopyMsg: false, // 接收人员是否发短信
            treedataSource: [],
            treetype: [], // 树种
            TotleModaldata: [],
            key: Math.random(),
            sectionSchedule: [],
            projectName: '',
            filterData: [], // 对流程信息根据项目进行过滤
            currentSection: '',
            currentSectionName: ''
        };
    }

    async componentDidMount () {
        const {
            actions: { gettreetype }
        } = this.props;

        let treelist = await gettreetype({});
        let arr = [];
        let treetype = TREETYPENO.map(forest => {
            arr = treelist.filter(
                tree => tree.TreeTypeNo.substr(0, 1) === forest.id
            );
            return (
                <OptGroup label={forest.name}>
                    {arr.map(tree => {
                        // let code = tree.TreeTypeNo.substr(0, 1)
                        // if(forest.id === code){
                        return (
                            <Option key={tree.id} value={JSON.stringify(tree)}>
                                {tree.TreeTypeName}
                            </Option>
                        );
                        // }
                    })}
                </OptGroup>
            );
        });
        console.log('treetype', treetype);
        this.setState({ treetype });

        this.gettaskSchedule();
        this.getSection();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        if (leftkeycode != prevProps.leftkeycode) {
            this.filterTask();
        }
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

            values.sunitproject
                ? (reqData.subject_sectionName__contains = values.sunitproject)
                : '';
            values.snumbercode
                ? (reqData.subject_numbercode__contains = values.snumbercode)
                : '';
            // values.ssuperunit?reqData.subject_superunit__contains = values.ssuperunit : '';
            values.stimedate
                ? (reqData.real_start_time_begin = moment(
                    values.stimedate[0]._d
                ).format('YYYY-MM-DD 00:00:00'))
                : '';
            values.stimedate
                ? (reqData.real_start_time_end = moment(
                    values.stimedate[1]._d
                ).format('YYYY-MM-DD 23:59:59'))
                : '';
            values.sstatus
                ? (reqData.status = values.sstatus)
                : values.sstatus === 0
                    ? (reqData.status = 0)
                    : '';
        });

        console.log('reqData', reqData);

        let tmpData = Object.assign({}, reqData);

        let task = await getTaskSchedule(
            { code: WORKFLOW_CODE.每日进度填报流程 },
            tmpData
        );

        let subject = [];
        let totledata = [];
        let arrange = {};
        if (task && task instanceof Array) {
            task.map((item, index) => {
                let itemdata = item.subject[0];
                let itempostdata = itemdata.postData
                    ? JSON.parse(itemdata.postData)
                    : null;
                let itemtreedatasource = itemdata.treedataSource
                    ? JSON.parse(itemdata.treedataSource)
                    : null;
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
                    numbercode: itemdata.numbercode
                        ? JSON.parse(itemdata.numbercode)
                        : '',
                    submitperson: item.creator.person_name,
                    submittime: moment(item.workflow.created_on)
                        .utc()
                        .zone(-8)
                        .format('YYYY-MM-DD'),
                    status: item.status,
                    // superunit:itemdata.superunit?JSON.parse(itemdata.superunit):'',
                    timedate: itemdata.timedate
                        ? JSON.parse(itemdata.timedate)
                        : '',
                    stagedocument: itemdata.stagedocument
                        ? JSON.parse(itemdata.stagedocument)
                        : '',
                    TreedataSource: itemtreedatasource,
                    dataReview: itemdata.dataReview
                        ? JSON.parse(itemdata.dataReview).person_name
                        : ''
                };
                totledata.push(itemarrange);
            });
            this.setState(
                {
                    stagedata: totledata
                },
                () => {
                    this.filterTask();
                }
            );
        }
    };
    // 对流程信息根据选择项目进行过滤
    filterTask () {
        const { stagedata } = this.state;
        const { leftkeycode } = this.props;
        let filterData = [];
        let user = getUser();

        let sections = user.sections;

        sections = JSON.parse(sections);

        let selectCode = '';
        // 关联标段的人只能看自己项目的进度流程
        if (sections && sections instanceof Array && sections.length > 0) {
            let code = sections[0].split('-');
            selectCode = code[0] || '';

            stagedata.map(task => {
                let projectName = task.projectName;
                let projectCode = this.getProjectCode(projectName);

                if (
                    projectCode === selectCode &&
                    task.section === sections[0]
                ) {
                    filterData.push(task);
                }
            });
        } else {
            // 不关联标段的人可以看选择项目的进度流程
            selectCode = leftkeycode;
            stagedata.map(task => {
                let projectName = task.projectName;
                let projectCode = this.getProjectCode(projectName);

                if (projectCode === selectCode) {
                    filterData.push(task);
                }
            });
        }

        this.setState({
            filterData
        });
    }
    // 获取项目code
    getProjectCode (projectName) {
        let projectCode = '';
        PROJECT_UNITS.map(item => {
            if (projectName === item.value) {
                projectCode = item.code;
            }
        });

        return projectCode;
    }
    // 获取当前登陆用户的标段
    getSection () {
        let user = getUser();

        let sections = user.sections;
        let sectionSchedule = [];
        let currentSectionName = '';
        let projectName = '';

        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            console.log('section', section);
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                PROJECT_UNITS.map(item => {
                    if (code[0] === item.code) {
                        projectName = item.value;
                        let units = item.units;
                        units.map(unit => {
                            // 获取当前标段的名字
                            if (unit.code == section) {
                                currentSectionName = unit.value;
                                console.log(
                                    'currentSectionName',
                                    currentSectionName
                                );
                                console.log('projectName', projectName);
                            }
                        });
                    }
                });
            }
            console.log('section', section);
            console.log('currentSectionName', currentSectionName);
            console.log('projectName', projectName);
            this.setState({
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        }
    }
    // 获取当前登陆用户的标段的下拉选项
    getSectionOption () {
        const { sectionSchedule } = this.state;
        let option = [];
        sectionSchedule.map(section => {
            option.push(
                <Option key={section.value} value={section.value}>
                    {section.name}
                </Option>
            );
        });
        return option;
    }

    render () {
        const {
            selectedRowKeys,
            sectionSchedule = [],
            filterData,
            currentSectionName
        } = this.state;
        const {
            form: { getFieldDecorator }
        } = this.props;

        let user = getUser();
        let username = user.username;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        // let sectionOption = this.getSectionOption()
        return (
            <div>
                {this.state.dayvisible && (
                    <DayModal
                        {...this.props}
                        {...this.state.TotleModaldata}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleOk.bind(this)}
                    />
                )}
                <SearchInfo
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
                    // key={this.state.key}
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
                                                {getFieldDecorator('Ssection', {
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
                                                    // (<Select placeholder='请选择标段' allowClear>
                                                    //     {sectionOption}
                                                    // </Select> )
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
                                                label='编号'
                                            >
                                                {getFieldDecorator(
                                                    'Snumbercode',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入编号'
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <Input placeholder='请输入编号' />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='文档类型'
                                            >
                                                {getFieldDecorator(
                                                    'Sstagedocument',
                                                    {
                                                        initialValue: `每日实际进度`,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请选择文档类型'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='日期'
                                            >
                                                {getFieldDecorator(
                                                    'Stimedate',
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
                                    {/* <Row>
										<Col span={12}>
											<FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('Ssuperunit', {
                                                        rules: [
                                                            { required: true, message: '请选择审核人员' }
                                                        ]
                                                    })
                                                        (<Input placeholder='系统自动识别，无需手输' readOnly/>)
                                                }
                                            </FormItem>
										</Col>
									</Row> */}
                                    <Row>
                                        <Table
                                            columns={this.columns1}
                                            dataSource={
                                                this.state.treedataSource
                                            }
                                            className='foresttable'
                                        />
                                        <Button
                                            onClick={this.addTreeClick.bind(
                                                this
                                            )}
                                            style={{
                                                marginLeft: 20,
                                                marginRight: 10,
                                                marginBottom: 20
                                            }}
                                            type='primary'
                                            ghost
                                        >
                                            添加
                                        </Button>
                                    </Row>
                                    <Row>
                                        <Col span={8} offset={4}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='审核人'
                                            >
                                                {getFieldDecorator(
                                                    'SdataReview',
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
                                        <Col span={8} offset={4}>
                                            <Checkbox
                                                onChange={this._cpoyMsgT.bind(
                                                    this
                                                )}
                                            >
                                                短信通知
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
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
            SdataReview: this.member
            // Ssuperunit:this.member.org
        });
    }

    // 发起填报
    sendWork () {
        const {
            actions: { createFlow, getWorkflowById, putFlow },
            location
        } = this.props;
        const {
            treedataSource,
            projectName,
            currentSectionName,
            currentSection
        } = this.state;
        let user = getUser(); // 当前登录用户
        let me = this;
        // 共有信息
        let postData = {};
        // 专业信息
        let attrs = {};

        me.props.form.validateFields((err, values) => {
            console.log('表单信息', values);
            if (!err) {
                postData.upload_unit = user.org ? user.org : '';
                postData.type = '每日实际进度';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                const currentUser = {
                    username: user.username,
                    person_code: user.code,
                    person_name: user.name,
                    id: parseInt(user.id)
                };

                let subject = [
                    {
                        section: JSON.stringify(currentSection),
                        projectName: JSON.stringify(projectName),
                        sectionName: JSON.stringify(currentSectionName),
                        // "superunit": JSON.stringify(values.Ssuperunit),
                        dataReview: JSON.stringify(values.SdataReview),
                        numbercode: JSON.stringify(values.Snumbercode),
                        timedate: JSON.stringify(
                            moment(values.Stimedate._d).format('YYYY-MM-DD')
                        ),
                        stagedocument: JSON.stringify(values.Sstagedocument),
                        postData: JSON.stringify(postData),
                        treedataSource: JSON.stringify(treedataSource)
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
                    const { id, workflow: { states = [] } = {} } = instance;
                    const [
                        {
                            id: state_id,
                            actions: [action]
                        }
                    ] = states;
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

    // 添加树列表
    addTreeClick () {
        const { treedataSource } = this.state;
        let key = treedataSource.length;
        let addtree = {
            key: key,
            project: '',
            units: '棵',
            canDelete: true
        };
        treedataSource.push(addtree);

        this.setState({ treedataSource });
    }

    // 下拉框选择变化
    handleSelect (record, project, value) {
        const { treedataSource } = this.state;

        value = JSON.parse(value);
        record[project] = value.TreeTypeName;
    }
    // 删除树列表
    delTreeClick (record, index) {
        const { treedataSource } = this.state;

        treedataSource.splice(record.key, 1);

        for (let i = 0; i < treedataSource.length; i++) {
            if (i >= record.key) {
                treedataSource[i].key = treedataSource[i].key - 1;
            }
        }
        this.setState({
            treedataSource: treedataSource
        });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys);
        console.log('selectedRows', selectedRows);
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    };
    // 删除
    deleteClick = async () => {
        const {
            actions: { deleteFlow }
        } = this.props;
        const { dataSourceSelected } = this.state;
        if (dataSourceSelected.length === 0) {
            notification.warning({
                message: '请先选择数据！',
                duration: 3
            });
        } else {
            let user = getUser();
            let username = user.username;

            if (username != 'admin') {
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
                notification.success({
                    message: '删除流程成功',
                    duration: 3
                });
                this.setState({
                    selectedRowKeys: [],
                    dataSourceSelected: []
                });
                this.gettaskSchedule();
            });
        }
    };

    // 操作--查看
    clickInfo (record) {
        this.setState({ dayvisible: true, TotleModaldata: record });
    }
    // 取消
    totleCancle () {
        this.setState({ dayvisible: false });
    }
    // 确定
    totleOk () {
        this.setState({ dayvisible: false });
    }

    // 新增按钮
    addClick = () => {
        let treedata = [
            {
                key: 0,
                project: '便道施工',
                units: 'm',
                canDelete: false
            },
            {
                key: 1,
                project: '给排水沟槽开挖',
                units: 'm',
                canDelete: false
            },
            {
                key: 2,
                project: '给排水管道安装',
                units: 'm',
                canDelete: false
            },
            {
                key: 3,
                project: '给排水回填',
                units: 'm',
                canDelete: false
            },
            {
                key: 4,
                project: '绿地平整',
                units: '亩',
                canDelete: false
            },
            {
                key: 5,
                project: '种植穴工程',
                units: '个',
                canDelete: false
            }
        ];
        this.setState({
            visible: true,
            treedataSource: treedata,
            key: Math.random()
        });
        this.props.form.setFieldsValue({
            // Ssuperunit: undefined,
            Ssection: this.state.currentSectionName || undefined,
            SdataReview: undefined,
            Snumbercode: undefined,
            Stimedate: moment().utc()
        });
    };
    // 关闭弹框
    closeModal () {
        this.setState({
            visible: false,
            treedataSource: []
        });
    }

    // 短信
    _cpoyMsgT (e) {
        this.setState({
            isCopyMsg: e.target.checked
        });
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'projectName',
            key: 'projectName',
            width: '15%'
        },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName',
            width: '10%'
        },
        {
            title: '进度类型',
            dataIndex: 'type',
            key: 'type',
            width: '15%'
        },
        {
            title: '编号',
            dataIndex: 'numbercode',
            key: 'numbercode',
            width: '15%'
        },
        {
            title: '提交人',
            dataIndex: 'submitperson',
            key: 'submitperson',
            width: '10%'
        },
        {
            title: '提交时间',
            dataIndex: 'submittime',
            key: 'submittime',
            width: '15%',
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
                } else {
                    return (
                        <Select
                            showSearch
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: '200px' }}
                            placeholder='请选择树种'
                            onChange={this.handleSelect.bind(
                                this,
                                record,
                                'project'
                            )}
                        >
                            {this.state.treetype}
                        </Select>
                    );
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
            dataIndex: 'number',
            key: 'number',
            render: (text, record, index) => {
                return (
                    <Input
                        value={record.number}
                        onChange={ele => {
                            record.number = ele.target.value;
                            this.forceUpdate();
                        }}
                    />
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                if (record.canDelete) {
                    return (
                        <div>
                            <Popconfirm
                                placement='rightTop'
                                title='确定删除吗？'
                                onConfirm={this.delTreeClick.bind(
                                    this,
                                    record,
                                    index + 1
                                )}
                                okText='确认'
                                cancelText='取消'
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        }
    ];
}
export default Form.create()(Stagereporttab);
