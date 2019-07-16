import React, { PropTypes, Component } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Modal,
    Upload,
    Button,
    Icon,
    Table,
    DatePicker,
    Checkbox,
    Popconfirm,
    notification,
    Spin
} from 'antd';
import moment from 'moment';
import PerSearch from '_platform/components/panels/PerSearch';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { UPLOAD_API, WORKFLOW_CODE } from '_platform/api';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const fileTypes =
    'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable ? (
            <Input
                style={{ margin: '-5px 0' }}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            value
        )}
    </div>
);

// 工程材料
class ResourceAddition extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            dataSource: [],
            count: 0,
            TreatmentData: [],
            currentSection: '',
            currentSectionName: '',
            projectName: '',
            loading: false,
            selectedRowKeys: []
        };
    }

    equipment = [
        {
            title: '名称',
            dataIndex: 'equipName',
            key: 'equipName',
            render: (text, record) =>
                this.renderColumns(text, record, 'equipName')
        },
        {
            title: '规格',
            dataIndex: 'equipFormat',
            key: 'equipFormat',
            render: (text, record) =>
                this.renderColumns(text, record, 'equipFormat')
        },
        {
            title: '单位',
            dataIndex: 'equipUnit',
            key: 'equipUnit',
            render: (text, record) =>
                this.renderColumns(text, record, 'equipUnit')
        },
        {
            title: '数量',
            dataIndex: 'equipCount',
            key: 'equipCount',
            render: (text, record) =>
                this.renderColumns(text, record, 'equipCount')
        },
        {
            title: '产地',
            dataIndex: 'equipPlace',
            key: 'equipPlace',
            render: (text, record) =>
                this.renderColumns(text, record, 'equipPlace')
        },
        {
            title: '操作',
            dataIndex: 'equipOperation',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div>
                        <span>
                            {editable ? (
                                <a
                                    style={{ marginRight: '10' }}
                                    onClick={() => this.saveTable(record.key)}
                                >
                                    <Icon
                                        type='save'
                                        style={{ fontSize: 20 }}
                                    />
                                </a>
                            ) : (
                                <a onClick={() => this.edit(record.key)}>
                                    <Icon
                                        type='edit'
                                        style={{ fontSize: 20 }}
                                    />
                                </a>
                            )}
                        </span>
                    </div>
                );
            }
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
            width: '30%',
            render: (text, record, index) => {
                return (
                    <Input
                        value={record.remarks || ''}
                        onChange={ele => {
                            record.remarks = ele.target.value;
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
                return (
                    <div>
                        <Popconfirm
                            placement='rightTop'
                            title='确定删除吗？'
                            onConfirm={this.deleteTreatmentFile.bind(
                                this,
                                record,
                                index
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
    ];
    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    async componentDidMount () {
        this.getSection();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { resourceAddVisible = false } = this.props;
        if (
            resourceAddVisible &&
            resourceAddVisible != prevProps.resourceAddVisible
        ) {
            this.setState({
                TreatmentData: [],
                dataSource: []
            });
        }
    }

    // 获取当前登陆用户的标段
    getSection () {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();

        let sections = user.sections;
        let currentSectionName = '';
        let projectName = '';

        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
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
            this.setState({
                currentSection: section,
                currentSectionName: currentSectionName,
                projectName: projectName
            });
        }
    }

    render () {
        const {
            resourceAddVisible = false,
            form: { getFieldDecorator }
        } = this.props;
        let {
            dataSource,
            count,
            currentSectionName = '',
            selectedRowKeys = []
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        return (
            <div>
                {resourceAddVisible ? (
                    <Modal
                        title='新增文档'
                        width={920}
                        visible={resourceAddVisible}
                        closable={false}
                        footer={false}
                        maskClosable={false}
                    >
                        <Spin spinning={this.state.loading}>
                            <Form onSubmit={this.handleSubmit.bind(this)}>
                                <Row gutter={24}>
                                    <Col
                                        span={24}
                                        style={{ paddingLeft: '2em' }}
                                    >
                                        <Row gutter={15}>
                                            <Col span={8}>
                                                <FormItem
                                                    {...ResourceAddition.layoutT}
                                                    label='标段:'
                                                >
                                                    {getFieldDecorator(
                                                        'section',
                                                        {
                                                            initialValue: `${currentSectionName}`,
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        '请输入标段'
                                                                }
                                                            ]
                                                        }
                                                    )(
                                                        <Input
                                                            readOnly
                                                            placeholder='请输入标段'
                                                        />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem
                                                    {...ResourceAddition.layoutT}
                                                    label='名称:'
                                                >
                                                    {getFieldDecorator('name', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入材料名称'
                                                            }
                                                        ]
                                                    })(
                                                        <Input placeholder='请输入材料名称' />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem
                                                    {...ResourceAddition.layoutT}
                                                    label='编号:'
                                                >
                                                    {getFieldDecorator('code', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入编号'
                                                            }
                                                        ]
                                                    })(
                                                        <Input placeholder='请输入编号' />
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Row gutter={15}>
                                            <Col span={8}>
                                                <FormItem
                                                    {...ResourceAddition.layoutT}
                                                    label='进场日期:'
                                                >
                                                    {getFieldDecorator('date', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请选择进场日期'
                                                            }
                                                        ]
                                                    })(
                                                        <DatePicker
                                                            placeholder='材料进场日期'
                                                            format={
                                                                'YYYY-MM-DD'
                                                            }
                                                            style={{
                                                                width: '100%',
                                                                height: '100%'
                                                            }}
                                                        />
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem
                                                    {...ResourceAddition.layoutT}
                                                    label='施工部位:'
                                                >
                                                    {getFieldDecorator('site', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    '请输入施工部位'
                                                            }
                                                        ]
                                                    })(
                                                        <Input placeholder='请输入材料具体应用部位' />
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Table
                                            rowSelection={rowSelection}
                                            dataSource={this.state.dataSource}
                                            columns={this.equipment}
                                            pagination={false}
                                            bordered
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Button
                                            style={{
                                                marginLeft: 20,
                                                marginRight: 10
                                            }}
                                            type='primary'
                                            ghost
                                            onClick={this.handleAdd.bind(this)}
                                        >
                                            添加
                                        </Button>
                                        <Button
                                            type='primary'
                                            onClick={this.onDelete.bind(this)}
                                        >
                                            删除
                                        </Button>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col
                                        span={24}
                                        style={{ marginTop: 16, height: 160 }}
                                    >
                                        <Dragger {...this.uploadProps}>
                                            <p className='ant-upload-drag-icon'>
                                                <Icon type='inbox' />
                                            </p>
                                            <p className='ant-upload-text'>
                                                点击或者拖拽开始上传
                                            </p>
                                            <p className='ant-upload-hint'>
                                                支持 pdf、doc、docx 文件
                                            </p>
                                        </Dragger>
                                    </Col>
                                </Row>
                                <Row gutter={24} style={{ marginTop: 15 }}>
                                    <Col span={24}>
                                        <Table
                                            columns={this.columns1}
                                            dataSource={
                                                this.state.TreatmentData
                                            }
                                            pagination
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 15 }}>
                                    <Col span={10}>
                                        <FormItem
                                            {...ResourceAddition.layoutT}
                                            label='审核人'
                                        >
                                            {getFieldDecorator('dataReview', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请选择审核人员'
                                                    }
                                                ]
                                            })(
                                                <PerSearch
                                                    selectMember={this.selectMember.bind(
                                                        this
                                                    )}
                                                    code={
                                                        WORKFLOW_CODE.工程材料报批流程
                                                    }
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} offset={4}>
                                        <Checkbox>短信通知</Checkbox>
                                    </Col>
                                </Row>
                                <FormItem>
                                    <Row>
                                        <Col
                                            span={24}
                                            style={{ textAlign: 'right' }}
                                        >
                                            <Button
                                                onClick={this.cancel.bind(this)}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                style={{ marginLeft: 8 }}
                                                type='primary'
                                                htmlType='submit'
                                            >
                                                确认
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Form>
                        </Spin>
                    </Modal>
                ) : (
                    ''
                )}
            </div>
        );
    }

    // 上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: UPLOAD_API,
        onChange: ({ file, fileList, event }) => {
            this.setState({
                loading: true
            });
            const status = file.status;
            const { TreatmentData = [] } = this.state;
            let newdata = [];
            if (status === 'done') {
                console.log('file', file);
                // const { actions: { postUploadFilesAc } } = this.props;
                let len = TreatmentData.length;
                TreatmentData.push({
                    index: len + 1,
                    fileName: file.name,
                    file_id: file.response.id,
                    file_partial_url:
                        '/media' + file.response.a_file.split('/media')[1],
                    send_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    a_file: '/media' + file.response.a_file.split('/media')[1],
                    download_url:
                        '/media' +
                        file.response.download_url.split('/media')[1],
                    misc: file.response.misc,
                    mime_type: file.response.mime_type
                });
                console.log('TreatmentData', TreatmentData);
                notification.success({
                    message: '文件上传成功',
                    duration: 3
                });
                this.setState({
                    TreatmentData: TreatmentData,
                    loading: false
                });
            } else if (status === 'error') {
                notification.error({
                    message: '文件上传失败',
                    duration: 3
                });
                this.setState({
                    loading: false
                });
            }
        }
    };

    // 删除文件表格中的某行
    deleteTreatmentFile = (record, index) => {
        const { TreatmentData } = this.state;
        TreatmentData.splice(index, 1);
        let array = [];
        TreatmentData.map((item, index) => {
            let data = {
                index: index + 1,
                fileName: item.fileName,
                file_id: item.file_id,
                file_partial_url: item.file_partial_url,
                send_time: item.send_time,
                a_file: item.a_file,
                download_url: item.download_url,
                misc: item.misc,
                mime_type: item.mime_type
            };
            array.push(data);
        });
        this.setState({ TreatmentData: array });
    };

    // 选择人员
    selectMember (memberInfo) {
        const {
            form: { setFieldsValue }
        } = this.props;
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                console.log('memberValue', memberValue);
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
            dataReview: this.member
        });
    }

    cancel () {
        const {
            actions: { ResourceAddVisible }
        } = this.props;
        ResourceAddVisible(false);
    }

    // 多选框的选择
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys', selectedRowKeys);
        this.setState({
            selectedRowKeys
        });
    };
    // 第一个表格添加行
    handleAdd () {
        const { count, dataSource } = this.state;
        let len = dataSource.length;
        const newData = {
            key: len,
            editable: true,
            count: count
        };

        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1
        });
    }
    // 第一个表格删除
    onDelete () {
        const { dataSource, selectedRowKeys } = this.state;

        selectedRowKeys.map((rst, index) => {
            dataSource.splice(rst - index, 1);
        });
        let array = [];
        let data = {};
        dataSource.map((item, index) => {
            data = item;
            data.key = index;
            array.push(data);
        });

        this.setState({
            dataSource: array,
            selectedRowKeys: []
        });
    }
    renderColumns (text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }
    handleChange (value, key, column) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ dataSource: newData });
        }
    }
    edit (key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ dataSource: newData });
        }
    }
    saveTable (key) {
        const newData = [...this.state.dataSource];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = false;
            this.setState({ dataSource: newData });
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            actions: {
                createFlow,
                getWorkflowById,
                putFlow,
                ResourceAddVisible,
                SearchResource
            }
        } = this.props;
        const {
            TreatmentData,
            dataSource,
            projectName,
            currentSectionName,
            currentSection
        } = this.state;

        let user = getUser(); // 当前登录用户
        let sections = user.sections || [];
        if (!sections || sections.length === 0) {
            notification.error({
                message: '当前用户未关联标段，不能创建流程',
                duration: 3
            });
            return;
        }

        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                postData.upload_unit = user.org ? user.org : '';
                postData.type = '工程材料';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                const currentUser = {
                    username: user.username,
                    person_code: user.code,
                    person_name: user.name,
                    id: parseInt(user.id),
                    org: user.org
                };
                let subject = [
                    {
                        section: JSON.stringify(currentSection),
                        sectionName: JSON.stringify(currentSectionName),
                        projectName: JSON.stringify(projectName),
                        dataSource: JSON.stringify(dataSource),
                        TreatmentData: JSON.stringify(TreatmentData),
                        name: JSON.stringify(values.name),
                        code: JSON.stringify(values.code),
                        date: JSON.stringify(
                            moment(values.date).format('YYYY-MM-DD')
                        ),
                        site: JSON.stringify(values.site),
                        postData: JSON.stringify(postData)
                    }
                ];

                const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: '物资管理工程材料报批流程',
                    desc: '综合管理模块物资管理工程材料报批流程',
                    code: WORKFLOW_CODE.工程材料报批流程
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
                                        participants: [nextUser],
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
                                    SearchResource(Math.random());
                                    ResourceAddVisible(false);
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
    };
}
export default Form.create()(ResourceAddition);
