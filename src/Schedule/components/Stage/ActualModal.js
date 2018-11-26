import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Icon,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    notification,
    Card,
    Steps
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Step = Steps.Step;
export default class ActualModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeDatasource: [],
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
            treeDatasource: this.props.TreedataSource,
            history
        });
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { history } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <Modal
                    title='日进度计划流程详情'
                    width={800}
                    // onOk={this.props.onok}
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
                                                    'stagesection',
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
                                                label='编号'
                                            >
                                                {getFieldDecorator(
                                                    'stagenumbercode',
                                                    {
                                                        initialValue: `${this
                                                            .props.numbercode ||
                                                            '暂无编号'}`,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入编号'
                                                            }
                                                        ]
                                                    }
                                                )(<Input readOnly />)}
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
                                                    'stagedocument',
                                                    {
                                                        initialValue: `${this
                                                            .props
                                                            .stagedocument ||
                                                            '暂无文档类型'}`,
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message:
                                                                    '请输入文档类型'
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
                                                    'stagetimedate',
                                                    {
                                                        initialValue: `${this
                                                            .props.timedate ||
                                                            '暂无日期'}`,
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
                                    {/* <Row>
                                        <Col span={12}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('stagesuperunit', {
                                                        initialValue: `${this.props.superunit || '暂无监理单位'}`,
                                                        rules: [
                                                            { required: false, message: '请输入监理单位' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <Table
                                            columns={this.columns1}
                                            pagination
                                            dataSource={
                                                this.state.treeDatasource
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
        const { platform: { task = {} } = {}, location = {} } = this.props;
        // const { state_id = '0' } = queryString.parse(location.search) || {};
        const { states = [] } = task;
        return states.find(state => state.status === 'processing');
    }
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
            key: 'project'
        },
        {
            title: '单位',
            dataIndex: 'units',
            key: 'units'
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number'
        }
    ];
}

// export default Form.create()(ActualModal)
