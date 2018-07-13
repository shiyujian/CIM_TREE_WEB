import React, { Component } from 'react';
import {
    Table,
    Spin,
    message,
    Modal,
    Button,
    Form,
    Row,
    Col,
    Select,
    Input,
    Icon,
    Card,
    Steps,
    Popconfirm,
    notification,
    Divider
} from 'antd';
import moment from 'moment';
import './index.less';
import Preview from '../../../_platform/components/layout/Preview';
import {
    SOURCE_API,
    PROJECT_UNITS,
    STATIC_DOWNLOAD_API,
    WORKFLOW_CODE
} from '../../../_platform/api';
import GeneralFilter from './GeneralFilter';
import { getUser } from '../../../_platform/auth';

const FormItem = Form.Item;
const Step = Steps.Step;

class GeneralTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            filterData: [],
            record: {},
            workflowData: [],
            history: [],
            // 多选
            selectedRowKeys: [],
            dataSourceSelected: []
        };
    }

    columns = [
        // {
        // 	title: '项目',
        // 	dataIndex: 'projectName',
        // 	key: 'projectName',
        // },
        {
            title: '标段',
            dataIndex: 'sectionName',
            key: 'sectionName'
        },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '文档类型',
            dataIndex: 'document',
            key: 'document'
        },
        // {
        // 	title: '提交单位',
        // 	dataIndex: 'submitOrg',
        // 	key: 'submitOrg',
        // },
        {
            title: '提交人',
            dataIndex: 'submitPerson',
            key: 'submitPerson'
        },
        {
            title: '提交时间',
            dataIndex: 'submitTime',
            key: 'submitTime'
        },
        {
            title: '流程状态',
            dataIndex: 'flowStyle',
            key: 'flowStyle'
        },
        {
            title: '操作',
            dataIndex: 'opera',
            key: 'opera',
            render: (text, record, index) => {
                return (
                    <div>
                        <a
                            type='primary'
                            onClick={this.showModal.bind(this, index, record)}
                        >
                            查看
                        </a>
                    </div>
                );
            }
        }
    ];

    equipmentColumns = [
        {
            title: '设备名称',
            dataIndex: 'equipName',
            key: 'equipName'
        },
        {
            title: '规格型号',
            dataIndex: 'equipNumber',
            key: 'equipNumber'
        },
        {
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount'
        },
        {
            title: '进场日期',
            dataIndex: 'equipTime',
            key: 'equipTime'
        },
        {
            title: '技术状况',
            dataIndex: 'equipMoment',
            key: 'equipMoment'
        },
        {
            title: '备注',
            dataIndex: 'equipRemark',
            key: 'equipRemark'
        }
    ];

    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: '10%'
        },
        {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            width: '35%'
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '30%'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        <a
                            href='javascript:;'
                            onClick={this.onViewClick.bind(this, record, index)}
                        >
                            预览
                        </a>
                        <Divider type='vertical' />
                        <a href={`${STATIC_DOWNLOAD_API}${record.a_file}`}>
                            下载
                        </a>
                    </div>
                );
            }
        }
    ];

    componentDidMount () {
        this.gettaskSchedule();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { searchGeneral, leftkeycode } = this.props;

        if (searchGeneral != prevProps.searchGeneral) {
            this.gettaskSchedule();
        }

        if (leftkeycode != prevProps.leftkeycode) {
            this.filterTask();
        }
    }

    // 获取机械设备流程信息
    gettaskSchedule = async () => {
        const {
            actions: { getWorkflows }
        } = this.props;
        let reqData = {};
        this.props.form.validateFields((err, values) => {
            console.log('机械设备报批流程', values);
            console.log('err', err);

            values.ssection
                ? (reqData.subject_sectionName__contains = values.ssection)
                : '';
            values.scode ? (reqData.subject_code__contains = values.scode) : '';
            if (
                values.stimedate &&
                values.stimedate instanceof Array &&
                values.stimedate.length > 0
            ) {
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
            }
            values.sstatus
                ? (reqData.status = values.sstatus)
                : values.sstatus === 0
                    ? (reqData.status = 0)
                    : '';
        });
        console.log('reqData', reqData);

        let tmpData = Object.assign({}, reqData);

        let task = await getWorkflows(
            { code: WORKFLOW_CODE.机械设备报批流程 },
            tmpData
        );

        let totledata = [];
        task.map((item, index) => {
            let subject = item.subject[0];
            let creator = item.creator;
            let postData = subject.postData ? JSON.parse(subject.postData) : {};
            let data = {
                // index:index+1,
                id: item.id,
                workflow: item,
                TreatmentData: subject.TreatmentData
                    ? JSON.parse(subject.TreatmentData)
                    : '',
                dataSource: subject.dataSource
                    ? JSON.parse(subject.dataSource)
                    : '',
                section: subject.section ? JSON.parse(subject.section) : '',
                sectionName: subject.sectionName
                    ? JSON.parse(subject.sectionName)
                    : '',
                projectName: subject.projectName
                    ? JSON.parse(subject.projectName)
                    : '',
                code: subject.code ? JSON.parse(subject.code) : '',
                document: '机械设备',
                submitOrg: postData.upload_unit ? postData.upload_unit : '',
                submitPerson: creator.person_name
                    ? creator.person_name + '(' + creator.username + ')'
                    : creator.username,
                submitTime: moment(item.workflow.created_on)
                    .utc()
                    .zone(-8)
                    .format('YYYY-MM-DD'),
                flowStyle: item.status === 2 ? '执行中' : '已完成'
            };
            totledata.push(data);
        });
        this.setState(
            {
                workflowData: totledata
            },
            () => {
                this.filterTask();
            }
        );
    };
    // 对流程信息根据选择项目进行过滤
    filterTask () {
        const { workflowData } = this.state;
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

            workflowData.map(task => {
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
            if (leftkeycode) {
                // 不关联标段的人可以看选择项目的进度流程
                selectCode = leftkeycode;
                workflowData.map(task => {
                    let projectName = task.projectName;
                    let projectCode = this.getProjectCode(projectName);

                    if (projectCode === selectCode) {
                        filterData.push(task);
                    }
                });
            } else {
                filterData = workflowData;
            }
        }
        console.log('filterData', filterData);

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
    render () {
        const {
            visible,
            record,
            workflowData,
            history,
            filterData,
            selectedRowKeys
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

        return (
            <div>
                <GeneralFilter
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
                    rowSelection={username === 'admin' ? rowSelection : null}
                    dataSource={filterData}
                    columns={this.columns}
                    bordered
                    Rowkey={'code'}
                />
                {this.state.visible == true && (
                    <Modal
                        title='查看流程'
                        width={920}
                        // footer={null}
                        visible={this.state.visible}
                        maskClosable={false}
                        //   onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                        <div>
                            <Row gutter={24}>
                                <Col span={24} style={{ paddingLeft: '3em' }}>
                                    <Row
                                        gutter={15}
                                        style={{ marginTop: '2em' }}
                                    >
                                        <Col span={12}>
                                            <FormItem
                                                {...GeneralTable.layoutT}
                                                label='标段:'
                                            >
                                                {getFieldDecorator(
                                                    'form1_section',
                                                    {
                                                        initialValue: `${
                                                            record.sectionName
                                                                ? record.sectionName
                                                                : ''
                                                        }`,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入标段'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...GeneralTable.layoutT}
                                                label='编号:'
                                            >
                                                {getFieldDecorator(
                                                    'form1_code',
                                                    {
                                                        initialValue: `${
                                                            record.code
                                                                ? record.code
                                                                : ''
                                                        }`,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入编号'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Card style={{ marginTop: 10 }}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Table
                                            columns={this.equipmentColumns}
                                            dataSource={
                                                record.dataSource
                                                    ? record.dataSource
                                                    : []
                                            }
                                            bordered
                                            pagination
                                        />
                                    </Col>
                                </Row>
                            </Card>
                            <Card style={{ marginTop: 10 }}>
                                <Row gutter={24}>
                                    <Col span={24} style={{ marginTop: '1em' }}>
                                        <Table
                                            dataSource={
                                                record.TreatmentData
                                                    ? record.TreatmentData
                                                    : []
                                            }
                                            columns={this.columns1}
                                            bordered
                                            pagination
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card title={'审批流程'} style={{ marginTop: 10 }}>
                                <Steps
                                    direction='vertical'
                                    size='small'
                                    current={
                                        history.length > 0
                                            ? history.length - 1
                                            : 0
                                    }
                                >
                                    {history
                                        .map((step, index) => {
                                            const {
                                                state: {
                                                    participants: [
                                                        { executor = {} } = {}
                                                    ] = []
                                                } = {}
                                            } = step;
                                            const { id: userID } =
                                                executor || {};

                                            if (step.status === 'processing') {
                                                // 根据历史状态显示
                                                const state = this.getCurrentState();
                                                return (
                                                    <Step
                                                        title={
                                                            <div
                                                                style={{
                                                                    marginBottom: 8
                                                                }}
                                                            >
                                                                <span>
                                                                    {
                                                                        step
                                                                            .state
                                                                            .name
                                                                    }-(执行中)
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        paddingLeft: 20
                                                                    }}
                                                                >
                                                                    当前执行人:{' '}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        color:
                                                                            '#108ee9'
                                                                    }}
                                                                >
                                                                    {' '}
                                                                    {`${
                                                                        executor.person_name
                                                                    }` ||
                                                                        `${
                                                                            executor.username
                                                                        }`}
                                                                </span>
                                                            </div>
                                                        }
                                                        key={index}
                                                    />
                                                );
                                            } else {
                                                const {
                                                    records: [record]
                                                } = step;
                                                const {
                                                    log_on = '',
                                                    participant: {
                                                        executor = {}
                                                    } = {},
                                                    note = ''
                                                } =
                                                    record || {};
                                                const {
                                                    person_name: name = '',
                                                    organization = ''
                                                } = executor;
                                                return (
                                                    <Step
                                                        key={index}
                                                        title={`${
                                                            step.state.name
                                                        }-(${step.status})`}
                                                        description={
                                                            <div
                                                                style={{
                                                                    lineHeight: 2.6
                                                                }}
                                                            >
                                                                <div>
                                                                    意见：{note}
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        {`${
                                                                            step
                                                                                .state
                                                                                .name
                                                                        }`}人:{`${name}` ||
                                                                            `${
                                                                                executor.username
                                                                            }`}{' '}
                                                                        [{
                                                                            executor.username
                                                                        }]
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            paddingLeft: 20
                                                                        }}
                                                                    >
                                                                        {`${
                                                                            step
                                                                                .state
                                                                                .name
                                                                        }`}时间：{moment(
                                                                            log_on
                                                                        ).format(
                                                                            'YYYY-MM-DD HH:mm:ss'
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                );
                                            }
                                        })
                                        .filter(h => !!h)}
                                </Steps>
                            </Card>
                            <Row style={{ marginTop: 10 }}>
                                <Button
                                    onClick={this.handleOk}
                                    style={{ float: 'right' }}
                                    type='primary'
                                >
                                    关闭
                                </Button>
                            </Row>
                            <Preview />
                        </div>
                    </Modal>
                )}
            </div>
        );
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

    addClick () {
        const {
            actions: { GeneralAddVisible }
        } = this.props;
        GeneralAddVisible(true);
    }
    getCurrentState () {
        const { platform: { task = {} } = {}, location = {} } = this.props;
        // const { state_id = '0' } = queryString.parse(location.search) || {};
        const { states = [] } = task;
        return states.find(state => state.status === 'processing');
    }

    // rowSelection = {
    // 	onChange: (selectedRowKeys, selectedRows) => {
    // 		const { actions: { selectDocuments } } = this.props;
    // 		selectDocuments(selectedRows);
    // 	},
    // };

    async showModal (key, record) {
        const {
            actions: { getTask }
        } = this.props;
        let params = {
            task_id: record.id
        };
        let task = await getTask(params);
        let history = [];
        if (task && task.history) {
            history = task.history;
        }
        this.setState({
            record: record,
            visible: true,
            history
        });
    }
    handleOk = e => {
        this.setState({
            visible: false
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    // 文件预览
    onViewClick (record, index) {
        const {
            actions: { openPreview }
        } = this.props;
        let filed = {};
        filed.misc = record.misc;
        filed.a_file =
            `${SOURCE_API}` +
            record.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url =
            `${STATIC_DOWNLOAD_API}` +
            record.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.fileName;
        filed.mime_type = record.mime_type;
        openPreview(filed);
    }

    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
}

export default Form.create()(GeneralTable);
