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
    WFStatusList,
    ACYUAL_NAME,
    ACYUAL_ID,
    SCHEDULRPROJECT
} from '_platform/api';
import { getNextStates } from '_platform/components/Progress/util';
import { getUserIsManager, getUser } from '_platform/auth';
import PerSearch from './PerSearch';
import WeekPlanSearchInfo from './WeekPlanSearchInfo';
import ActualModal from './ActualModal';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
class Actual extends Component {
    constructor (props) {
        super(props);
        this.state = {
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
        this.onSearch = this.onSearch.bind(this); // 查询
    }
    async componentDidMount () {
        this.getSection(); // 获取当前登陆用户的标段
        this.getWorkList(); // 获取任务列表
        this.getOriginNode(); // 获取流程起点ID
    }
    getOriginNode () {
        const { getNodeList } = this.props.actions;
        getNodeList({}, {
            flowid: ACYUAL_ID, // 流程ID
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
    getWorkList (pro = {}) {
        const { getWorkList } = this.props.actions;
        let params = {
            workid: '', // 任务ID
            title: '', // 任务名称
            flowid: ACYUAL_ID, // 流程类型或名称
            // flowid: '', // 流程类型或名称
            starter: '', // 发起人
            currentnode: '', // 节点ID
            prevnode: '', // 上一结点ID
            executor: '', // 执行人
            sender: '', // 上一节点发送人
            wfstate: '', // 待办 0,1
            stime: '', // 开始时间
            etime: '', // 结束时间
            keys: pro.keys || '', // 查询键
            values: pro.values || '', // 查询值
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
    getSection () {
        const {
            platform: { tree = {} },
            leftkeycode
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
            console.log('sectionArray', sectionArray, section);
            this.setState({
                section,
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
    onSearch () {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
            }
            console.log('搜索选择', values.Data, values.Number, values.Section, values.Status);
            let key = '';
            let value = '';
            if (values.Section) {
                key = 'section';
                value = values.Section;
                if (values.Number) {
                    key += '|' + 'number';
                    value += '|' + values.Number;
                }
            } else if (values.Number) {
                key = 'number';
                value = values.Number;
            }
            let params = {
                keys: key, // 表单项
                values: value // 表单值
            };
            this.getWorkList(params);
        });
    }
    render () {
        const {
            TableList,
            section,
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
                                    return <Option value={item.No} key={item.No}>{item.Name}</Option>;
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
                                format={dateFormat}
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
                    dataSource={this.state.workDataList}
                    className='foresttable'
                    bordered
                    rowKey='ID'
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
                        <Form layout='inline'>
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
                                        {getFieldDecorator('Section', {
                                            initialValue: section,
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        '请输入标段'
                                                }
                                            ]
                                        })(
                                            <Select
                                                disabled
                                                style={{width: 220}}
                                                placeholder='请选择流程类型'
                                                allowClear
                                            >
                                                {sectionArray.map(item => {
                                                    return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                                })}
                                            </Select>
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
                                                style={{width: 220}}
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
                                <Col span={8} offset={4}>
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
                                            <Select style={{ width: 120 }}>
                                                {auditorList.map(item => {
                                                    return <Option value={item.id} key={item.id}>{item.name}</Option>;
                                                })}
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
    // 发起填报
    handleOK () {
        const {
            actions: { postStartwork },
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                const { originNodeID, TableList } = this.state;
                console.log('确认', values, TableList, moment(values.TodayDate).format(dateFormat));
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
                    Val: values.Section
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
                    FlowID: ACYUAL_ID, // 模板ID
                    FlowName: ACYUAL_NAME, // 模板名称
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
            title: '标段',
            dataIndex: 'Section'
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
                return (<div>
                    <span>
                        <a onClick={this.onLook.bind(this, record.ID)}>
                            查看
                        </a>
                    </span>
                    <span style={{marginLeft: 10}}>
                        <a onClick={this.onDelete.bind(this, record.ID)}>
                            删除
                        </a>
                    </span>
                </div>);
            }
        }
    ];
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
