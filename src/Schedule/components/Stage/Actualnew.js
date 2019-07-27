import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Table,
    Modal,
    Select,
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
import { getUserIsManager, getUser } from '_platform/auth';
import PerSearch from './PerSearch';
import WeekPlanSearchInfo from './WeekPlanSearchInfo';
import ActualModal from './ActualModal';
import { WFStatusList } from '../common';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
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
            sectionArray: [], // 标段列表
            // 项目信息
            projectName: '',
            currentSection: '',
            currentSectionName: '',
            // 用户信息
            user: '',
            // 新增流程
            visible: false,
            TableList: [], // 表格数据
            // 流程详情
            actualModalVisible: false,
            actualModaldata: []
        };
    }

    async componentDidMount () {
        // this.gettaskSchedule();
        this.getSection(); // 获取当前登陆用户的标段
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
    // 获取日实际进度流程信息
    gettaskSchedule = async () => {
        const {
            actions: { getTaskSchedule }
        } = this.props;
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
        let user = getUser();
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
            let section = user && user.section;
            let selectCode = '';
            // 关联标段的人只能看自己项目的进度流程
            if (section) {
                let code = section.split('-');
                selectCode = code[0] || '';
                actualData.map(task => {
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
    onSearch () {

    }
    render () {
        const {
            sectionArray,
            selectedRowKeys,
            filterData,
            currentSectionName,
            user
        } = this.state;
        const { auditorList } = this.props;
        console.log('WORKFLOW_CODE', WORKFLOW_CODE);
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
                                            columns={this.columnsModal}
                                            dataSource={
                                                this.state.TableList
                                            }
                                            bordered
                                            className='foresttable'
                                            pagination={false}
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
    // 多选
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
    };
    // 新增按钮
    onAdd = () => {
        let treedata = [];
        SCHEDULRPROJECT.map((item) => {
            treedata.push({
                key: item.id - 1,
                project: item.name,
                units: item.units,
                type: item.type,
                typeFirst: item.typeFirst,
                typeList: item.typeList || 0
            });
        });
        this.setState({
            visible: true,
            TableList: treedata
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
            TableList: []
        });
    }

    // 选择人员
    selectMember (memberInfo) {
        console.log('memberInfo', memberInfo);
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
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                console.log('确认', values.Tsection, values.Ttotledocument, values.TdataReview);
                const { section, TableList } = this.state;
                let newTableList = [];
                TableList.map(item => {
                    newTableList.push({
                        name: item.name,
                        remark: item.remark,
                        url: item.url
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
                    FlowID: 'dd50b1a8-8b39-4733-8677-10251fd7d9b4', // 模板ID
                    FlowName: '总进度计划报批流程', // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: ''
                    },
                    NextExecutor: 14, // 下一节点执行人
                    Starter: getUser().ID, // 发起人
                    Title: section + ' 总计划进度', // 任务标题
                    WFState: 1 // 流程状态 1运行中
                }).then(rep => {
                    if (rep.code === 1) {
                        notification.success({
                            message: '新增任务成功',
                            duration: 3
                        });
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

    columnsModal = [
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
            title: '类别',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => {
                const obj = {
                    children: text,
                    props: {}
                };
                if (record.typeFirst) {
                    obj.props.rowSpan = record.typeList;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
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
    handleActualNumChange = (index, e) => {
        const {
            TableList
        } = this.state;
        console.log('输入', TableList);
        try {
            TableList[index].actualNum = e.target.value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
}
export default Form.create()(Actual);
