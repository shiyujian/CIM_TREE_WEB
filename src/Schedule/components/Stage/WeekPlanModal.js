import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Table,
    Modal,
    Card,
    Steps
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Step = Steps.Step;

export default class WeekPlanModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            history: []
        };
    }
    async componentDidMount () {
        const {
            actions: { getTask },
            id
        } = this.props;
        let params = {
            task_id: id
        };
        let task = await getTask(params);
        let history = [];
        if (task && task.history) {
            history = task.history;
        }

        this.setState({
            history
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            stime = '',
            etime = '',
            weekPlanDataSource = []
        } = this.props;
        const { history } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        console.log('weekPlanDataSource', weekPlanDataSource);

        return (
            <div>
                <Modal
                    title='日进度计划流程详情'
                    width={800}
                    onOk={this.props.onok}
                    onCancel={this.props.oncancel}
                    visible
                    footer={null}
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
                                                {getFieldDecorator(
                                                    'daysection',
                                                    {
                                                        initialValue: `${this
                                                            .props
                                                            .sectionName ||
                                                            '暂无标段'}`,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请选择标段'
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
                                                    'daytimedate',
                                                    {
                                                        initialValue: `${stime} ~ ${etime}`,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入日期'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            columns={this.columns1}
                                            pagination
                                            dataSource={
                                                weekPlanDataSource
                                            }
                                            rowKey='index'
                                            className='foresttable'
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                        <Card title={'审批流程'} style={{ marginTop: 10 }}>
                            <Steps
                                direction='vertical'
                                size='small'
                                current={
                                    history.length > 0 ? history.length - 1 : 0
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
                                        const { id: userID } = executor || {};

                                        if (step.status === 'processing') {
                                            // 根据历史状态显示
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
                                                                    step.state
                                                                        .name
                                                                }
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
                                            } = record || {};
                                            const {
                                                person_name: name = ''
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
                                                                意见：
                                                                {note}
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {`${
                                                                        step
                                                                            .state
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
                                                                        step
                                                                            .state
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
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.props.onok}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                                关闭
                            </Button>
                        </Row>
                    </div>
                </Modal>
            </div>
        );
    }
    getCurrentState () {
        const { platform: { task = {} } = {} } = this.props;
        const { states = [] } = task;
        return states.find(state => state.status === 'processing');
    }
    columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '33%',
            render: (text, record, index) => {
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
                if (record && record.planTreeNum) {
                    return <span>{record.planTreeNum}</span>;
                } else {
                    return <span>0</span>;
                }
            }
        }
    ];
}
