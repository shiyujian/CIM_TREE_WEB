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
    Popconfirm,
    InputNumber
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    WFStatusList,
    SCHEDULRPROJECT
} from '_platform/api';
import {
    getUser,
    getUserIsManager
} from '_platform/auth';
import ActualModal from './ActualModal';
import SearchFilter from './SearchFilter';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
class ActualNew extends Component {
    constructor (props) {
        super(props);
        this.state = {
            flowID: '', // 流程ID
            flowName: '', // 流程名称
            originNodeID: '', // 起点ID
            originNodeName: '', // 起点name
            workID: '', // 任务ID
            workDataList: [], // 任务列表
            TableList: [], // 表格数据
            visibleLook: false, // 查看弹框
            // 每日实际进度
            actualData: [],
            filterData: [], // 对流程信息根据项目进行过滤
            // 多选
            selectedRowKeys: [],
            dataSourceSelected: [],
            sectionArray: [], // 标段列表
            // 项目信息
            section: '', // 用户所在标段
            projectName: '',
            currentSection: '',
            currentSectionName: '',
            // 用户信息
            user: '',
            // 新增流程
            visible: false,
            // 流程详情
            actualModalVisible: false,
            actualModaldata: []
        };
        this.getOriginNode = this.getOriginNode.bind(this); // 获取流程起点ID
        this.onAdd = this.onAdd.bind(this); // 新增
        this.onDelete = this.onDelete.bind(this); // 删除
        this.onLook = this.onLook.bind(this); // 查看
        this.handleCancel = this.handleCancel.bind(this); // 取消新增
        this.handleOK = this.handleOK.bind(this); // 新增任务
        this.getWorkList = this.getWorkList.bind(this); // 获取任务
    }
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
            render: record => {
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
                    <InputNumber
                        value={record.actualNum || 0}
                        onChange={this.handleActualNumChange.bind(this, index)}
                    />
                );
            }
        }
    ];
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    async componentDidMount () {
        this.getSection(); // 获取当前登陆用户的标段
        this.getFlowList(); // 获取流程
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
                    if (item.Name === '每日进度填报流程') {
                        flowID = item.ID;
                        flowName = item.Name;
                    }
                });
                this.setState({
                    flowID,
                    flowName
                }, () => {
                    this.getWorkList(); // 获取任务列表
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
        let rep = await getWorkList({}, params);
        if (rep && rep.code && rep.code === 200) {
            let workDataList = [];
            let sectionData = (tree && tree.bigTreeList) || [];
            rep.content.map(item => {
                let sectionName = '';
                let projectName = '';

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
                workDataList.push(item);
            });
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
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        }
    }
    // 发起填报
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                const {
                    originNodeID,
                    TableList,
                    flowID,
                    flowName,
                    currentSection
                } = this.state;
                let newTableList = [];
                TableList.map(item => {
                    newTableList.push({
                        ID: item.key,
                        type: item.type,
                        project: item.project,
                        actualNum: item.actualNum,
                        typeFirst: item.typeFirst,
                        typeList: item.typeList || '',
                        units: item.units
                    });
                });
                let FormParams = [{
                    Key: 'Section', // 标段
                    FieldType: 0,
                    Val: currentSection
                }, {
                    Key: 'TodayDate', // 日期
                    FieldType: 0,
                    Val: moment(values.TodayDate).format(dateFormat)
                }, {
                    Key: 'TableInfo', // 列表信息
                    FieldType: 0,
                    Val: JSON.stringify(newTableList)
                }];
                postStartwork({}, {
                    FlowID: flowID, // 模板ID
                    FlowName: flowName, // 模板名称
                    FormValue: { // 表单值
                        FormParams: FormParams,
                        NodeID: originNodeID
                    },
                    NextExecutor: values.Auditor, // 下一节点执行人
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
        let TableList = [];
        SCHEDULRPROJECT.map((item) => {
            TableList.push({
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
            TableList: TableList
        });
    };
    // 关闭弹框
    handleCancel () {
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
    // 取消
    totleCancle () {
        this.setState({ visibleLook: false });
    }

    onLook (workID) {
        this.setState({ visibleLook: true, workID: workID });
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
    // 实际数量的输入
    handleActualNumChange = (index, value) => {
        const {
            TableList
        } = this.state;
        try {
            TableList[index].actualNum = value;
            this.setState({
                TableList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    render () {
        const {
            TableList,
            sectionArray
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
                    <ActualModal
                        {...this.props}
                        {...this.state}
                        oncancel={this.totleCancle.bind(this)}
                        onok={this.totleCancle.bind(this)}
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
                    dataSource={this.state.workDataList}
                    className='foresttable'
                    bordered
                    // rowKey='FlowID'
                />
                <Modal
                    title='新增每日实际进度'
                    width={800}
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={this.handleCancel.bind(this)}
                    onOk={this.handleOK.bind(this)}
                >
                    <div>
                        <Form>
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
                                        {getFieldDecorator(
                                            'TodayDate',
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
                                                format={dateFormat}
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
                                    dataSource={TableList}
                                    bordered
                                    className='foresttable'
                                    pagination={false}
                                />
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Col span={8}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='审核人'
                                    >
                                        {getFieldDecorator(
                                            'Auditor',
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
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(ActualNew);
