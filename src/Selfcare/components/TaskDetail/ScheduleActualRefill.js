import React, { PropTypes, Component } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Table,
    DatePicker,
    Select,
    Checkbox,
    Popconfirm,
    notification,
    Card,
    Steps
} from 'antd';
import moment from 'moment';
import PerSearch from '_platform/components/panels/PerSearch';
import { getUser } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import {
    TREETYPENO
} from '_platform/api';
import queryString from 'query-string';
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
const Step = Steps.Step;

class ScheduleActualRefill extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            actualDataSource: [],
            oldSubject: {}
        };
    }

    async componentDidMount () {
        const {
            form: { setFieldsValue },
            platform: { task = {} } = {}
        } = this.props;
        let record = {};
        if (task && task.subject && !record.id) {
            record = this.getTable(task);
        }
        setFieldsValue({
            actualSection: record.sectionName ? record.sectionName : '',
            actualTimeDate: record.actualTimeDate ? moment.utc(record.actualTimeDate) : ''
        });
    }

    // 获取流程详情
    getTable (instance) {
        let subject = instance.subject[0];
        let record = {
            id: instance.id,
            TreatmentData: subject.actualDataSource
                ? JSON.parse(subject.actualDataSource)
                : '',
            section: subject.section ? JSON.parse(subject.section) : '',
            sectionName: subject.sectionName
                ? JSON.parse(subject.sectionName)
                : '',
            actualTimeDate: subject.actualTimeDate ? JSON.parse(subject.actualTimeDate) : '',
            actualSupervisorReview: subject.actualSupervisorReview ? JSON.parse(subject.actualSupervisorReview) : ''
        };

        let actualDataSource = subject.actualDataSource
            ? JSON.parse(subject.actualDataSource)
            : [];
        this.setState({
            oldSubject: subject,
            actualDataSource: actualDataSource
        });

        return record;
    }
    render () {
        const {
            platform: { task = {} } = {},
            form: { getFieldDecorator }
        } = this.props;
        const { history = [] } = task;
        const user = getUser();

        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Card title='流程详情'>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='标段'
                                        >
                                            {getFieldDecorator('actualSection', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入标段'
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    placeholder='请输入标段'
                                                    readOnly
                                                />
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...FormItemLayout}
                                            label='日期'
                                        >
                                            {getFieldDecorator('actualTimeDate', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择日期'
                                                    }
                                                ]
                                            })(
                                                <DatePicker placeholder='请选择日期' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Table
                                        columns={this.columns1}
                                        bordered
                                        pagination={false}
                                        dataSource={this.state.actualDataSource}
                                        className='foresttable'
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'审批流程'} style={{ marginTop: 10 }}>
                        <Steps
                            direction='vertical'
                            size='small'
                            current={history.length - 1}
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
                                    const { id: userID } = executor || {};
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
                                                            {step.state.name}
                                                            -(执行中)
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
                                                                color: '#108ee9'
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
                                                description={
                                                    userID === +user.id && (
                                                        <div>
                                                            <Row>
                                                                <Col
                                                                    span={8}
                                                                    offset={4}
                                                                >
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
                                                                                task={
                                                                                    task
                                                                                }
                                                                            />
                                                                        )}
                                                                    </FormItem>
                                                                </Col>
                                                                <Col
                                                                    span={8}
                                                                    offset={4}
                                                                />
                                                            </Row>
                                                            <FormItem>
                                                                <Row>
                                                                    <Col
                                                                        span={
                                                                            24
                                                                        }
                                                                        style={{
                                                                            textAlign:
                                                                                'center'
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            style={{
                                                                                marginLeft: 8
                                                                            }}
                                                                            type='primary'
                                                                            htmlType='submit'
                                                                        >
                                                                            提交
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </FormItem>
                                                        </div>
                                                    )
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
                                            participant: { executor = {} } = {},
                                            note = ''
                                        } = record || {};
                                        const {
                                            person_name: name = ''
                                        } = executor;
                                        return (
                                            <Step
                                                key={index}
                                                title={`${step.state.name}-(${
                                                    step.status
                                                })`}
                                                description={
                                                    <div
                                                        style={{
                                                            lineHeight: 2.6
                                                        }}
                                                    >
                                                        <div>
                                                            意见：
                                                            {note}
                                                        </div>
                                                        <div>
                                                            <span>
                                                                {`${
                                                                    step.state
                                                                        .name
                                                                }`}
                                                                人:
                                                                {`${name}` ||
                                                                    `${
                                                                        executor.username
                                                                    }`}{' '}
                                                                [
                                                                {
                                                                    executor.username
                                                                }
                                                                ]
                                                            </span>
                                                            <span
                                                                style={{
                                                                    paddingLeft: 20
                                                                }}
                                                            >
                                                                {`${
                                                                    step.state
                                                                        .name
                                                                }`}
                                                                时间：
                                                                {moment(
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
                </Form>
            </div>
        );
    }

    getCurrentState () {
        const { platform: { task = {} } = {}, location = {} } = this.props;
        const { state_id = '0' } = queryString.parse(location.search) || {};
        const { states = [] } = task;
        return states.find(
            state => state.status === 'processing' && state.id === +state_id
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
            actualSupervisorReview: this.member
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: { putFlow, postSubject },
            location
        } = this.props;
        const { actualDataSource, oldSubject } = this.state;
        let user = localStorage.getItem('LOGIN_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);
        let me = this;
        let postData = {};
        me.props.form.validateFields(async (err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                postData.upload_unit = user.account ? user.account.org_code : '';
                postData.type = '每日实际进度';
                postData.upload_person = user.account ? user.account.person_name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DD HH:mm:ss');

                let executor = {
                    username: user.username,
                    person_code: user && user.account && user.account.person_code,
                    person_name: user && user.account && user.account.person_name,
                    id: user && parseInt(user.id),
                    org: user && user.account && user.account.org_code
                };
                let subject = [
                    {
                        section: oldSubject.section,
                        sectionName: oldSubject.sectionName,
                        projectName: oldSubject.projectName,
                        actualSupervisorReview: JSON.stringify(values.actualSupervisorReview),
                        actualTimeDate: JSON.stringify(moment(values.actualTimeDate._d).format('YYYY-MM-DD')),
                        actualDataSource: JSON.stringify(actualDataSource),
                        postData: JSON.stringify(postData),
                        fillPerson: JSON.stringify(executor)
                    }
                ];
                let newSubject = {
                    subject: subject
                };

                const { state_id = '0' } = queryString.parse(location.search) || {};
                let nextUser = {};
                nextUser = values.actualSupervisorReview;
                // 获取流程的action名称
                let action_name = '';
                let nextStates = await getNextStates(task, Number(state_id));
                console.log('nextStates', nextStates);
                let stateid = 0;
                action_name = nextStates[0].action_name;
                stateid = nextStates[0].to_state[0].id;
                console.log('nextStates', nextStates);

                let note = action_name + '。';

                let state = task.current[0].id;
                let postdata = {
                    next_states: [
                        {
                            state: stateid,
                            participants: [nextUser],
                            dealine: null,
                            remark: null
                        }
                    ],
                    state: state,
                    executor: executor,
                    action: action_name,
                    note: note,
                    attachment: null
                };

                let data = {
                    pk: task.id
                };
                let newSubjectData = await postSubject(data, newSubject);
                console.log('newSubjectData', newSubjectData);

                let rst = await putFlow(data, postdata);
                console.log('rst', rst);
                if (rst && rst.creator) {
                    notification.success({
                        message: '流程提交成功',
                        duration: 2
                    });
                    let to = `/selfcare/task`;
                    me.props.history.push(to);
                } else {
                    notification.error({
                        message: '流程通过失败',
                        duration: 2
                    });
                }
            }
        });
    };
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
export default Form.create()(ScheduleActualRefill);
