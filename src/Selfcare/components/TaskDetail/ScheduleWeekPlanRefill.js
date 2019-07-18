import React, { PropTypes, Component } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Table,
    DatePicker,
    notification,
    Card,
    Steps
} from 'antd';
import moment from 'moment';
import PerSearch from '../PersonSearch/Schedule/PerRefillSearch';
import { getNextStates } from '_platform/components/Progress/util';
import queryString from 'query-string';
const FormItem = Form.Item;
const Step = Steps.Step;

class ScheduleWeekPlanRefill extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            weekPlanDataSource: [],
            oldSubject: {}
        };
    }

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

    async componentDidMount () {
        const {
            form: { setFieldsValue },
            platform: { task = {} } = {}
        } = this.props;

        let record = {};
        if (task && task.subject && !record.id) {
            record = this.getTable(task);
        }
        console.log('record', record.timedate);

        setFieldsValue({
            weekSection: record.sectionName ? record.sectionName : '',
            weekSupervisorReview: record.supervisorReview ? record.supervisorReview : '',
            weekTimeDate: moment(record.stime).format('YYYY-MM-DD') + '~' +
                moment(record.etime).format('YYYY-MM-DD')
        });
    }
    // 获取流程详情
    getTable (instance) {
        let subject = instance.subject[0];
        let record = {
            id: instance.id,
            section: subject.section
                ? JSON.parse(subject.section)
                : '',
            sectionName: subject.sectionName
                ? JSON.parse(subject.sectionName)
                : '',
            projectName: subject.projectName
                ? JSON.parse(subject.projectName)
                : '',
            stime: subject.stime
                ? JSON.parse(subject.stime)
                : '',
            etime: subject.etime
                ? JSON.parse(subject.etime)
                : '',
            weekPlanDataSource: subject.weekPlanDataSource
                ? JSON.parse(subject.weekPlanDataSource)
                : [],
            supervisorReview: subject.supervisorReview
                ? JSON.parse(subject.supervisorReview).person_name
                : ''
        };

        let weekPlanDataSource = subject.weekPlanDataSource
            ? JSON.parse(subject.weekPlanDataSource)
            : [];
        let stime = subject.stime
            ? moment(JSON.parse(subject.stime)).utc().zone(-8)
            : [];
        let etime = subject.etime
            ? moment(JSON.parse(subject.etime)).utc().zone(-8)
            : [];
        this.setState({
            oldSubject: subject,
            weekPlanDataSource: weekPlanDataSource,
            stime,
            etime
        });

        return record;
    }

    render () {
        const {
            platform: { task = {} } = {},
            form: { getFieldDecorator }
        } = this.props;
        const { history = [] } = task;
        const {
            weekPlanDataSource,
            stime,
            etime
        } = this.state;

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
                                            {getFieldDecorator('weekSection', {
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
                                                    <div>
                                                        <Row>
                                                            <Col
                                                                span={8}
                                                                offset={4}
                                                            >
                                                                <FormItem
                                                                    {...FormItemLayout}
                                                                    label='监理审核人'
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
                                                                    span={24}
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
                                            person_name: name = '',
                                            organization = ''
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

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: { putFlow, postSubject },
            location
        } = this.props;
        const {
            weekPlanDataSource,
            oldSubject,
            stime,
            etime
        } = this.state;
        try {
            let user = localStorage.getItem('LOGIN_USER_DATA');
            user = JSON.parse(user);
            console.log('user', user);
            let me = this;
            let postData = {};
            me.props.form.validateFields(async (err, values) => {
                console.log('Received values of form: ', values);
                if (!err) {
                    postData.upload_unit = user.account ? user.account.org_code : '';
                    postData.type = '每周计划进度';
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
                            supervisorReview: JSON.stringify(values.weekSupervisorReview),
                            stime: JSON.stringify(moment(stime).format('YYYY-MM-DD')),
                            etime: JSON.stringify(moment(etime).format('YYYY-MM-DD')),
                            weekPlanDataSource: JSON.stringify(weekPlanDataSource),
                            postData: JSON.stringify(postData),
                            fillPerson: JSON.stringify(executor)
                        }
                    ];
                    let newSubject = {
                        subject: subject
                    };

                    const { state_id = '0' } =
                    queryString.parse(location.search) || {};
                    let nextUser = {};

                    nextUser = values.weekSupervisorReview;
                    // 获取流程的action名称
                    let action_name = '';
                    let nextStates = await getNextStates(task, Number(state_id));
                    let stateid = 0;
                    action_name = nextStates[0].action_name;
                    stateid = nextStates[0].to_state[0].id;

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
                            message: '流程提交失败',
                            duration: 2
                        });
                    }
                }
            });
        } catch (e) {
            console.log('handleSubmit', e);
        }
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
}
export default Form.create()(ScheduleWeekPlanRefill);
