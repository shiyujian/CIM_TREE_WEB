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
    Steps,
    Divider
} from 'antd';
import { STATIC_DOWNLOAD_API, SOURCE_API } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Step = Steps.Step;

export default class TotleModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            workID: '', // 任务ID
            FormParams: [], // 表单详情
            TableList: [], // 表格数据
            workDetails: {}, // 任务详情
            workFlow: [], // 任务流程
            TreatmentData: [],
            history: []
        };
    }
    async componentDidMount () {
        this.getTaskDetail(); // 获取任务详情
        // const {
        //     actions: { getTask },
        //     id
        // } = this.props;
        // let params = {
        //     task_id: id
        // };
        // let task = await getTask(params);
        // let history = [];
        // if (task && task.history) {
        //     history = task.history;
        // }

        // this.setState({
        //     TreatmentData: this.props.treatmentdata,
        //     history
        // });
    }
    getTaskDetail () {
        const {
            workID,
            actions: { getWorkDetails },
            form: { setFieldsValue }
        } = this.props;
        this.setState({
            workID: workID
        });
        getWorkDetails({
            ID: workID
        }, {}).then(rep => {
            let FormParams = [];
            if (rep.FormValues && rep.FormValues.length > 0 && rep.FormValues[0].FormParams) {
                FormParams = rep.FormValues[0].FormParams;
            }
            let param = {};
            let TableList = [];
            FormParams.map(item => {
                if (item.Key === 'TableInfo') {
                    TableList = JSON.parse(item.Val);
                } else {
                    param[item.Key] = item.Val;
                }
            });
            setFieldsValue(param);
            this.setState({
                workDetails: rep,
                TableList,
                workFlow: rep.Works.reverse()
            });
        });
    }
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
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { history, workFlow, workDetails, FormParams } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <div>
                <Modal
                    title='总进度计划流程详情'
                    width={800}
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
                                                    'Section',
                                                    {
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
                                                    'NumberCode',
                                                    {
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
                                                    'FileType',
                                                    {
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
                                        {/* <Col span={12}>
                                            <FormItem {...FormItemLayout} label='监理单位'>
                                                {
                                                    getFieldDecorator('totlesuperunit', {
                                                        initialValue: `${this.props.totlesuperunit || '暂无监理单位'}`,
                                                        rules: [
                                                            { required: false, message: '请输入监理单位' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col> */}
                                    </Row>
                                    <Row>
                                        <Table
                                            columns={this.columns}
                                            pagination
                                            dataSource={
                                                this.state.TableList
                                            }
                                            rowKey='name'
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
                                current={workFlow.length - 1}
                            >
                                {workFlow.map(item => {
                                    return <Step title={item.CurrentNodeName} description={
                                        <div>
                                            <span>
                                                {item.CurrentNodeName}人: {item.Executor}
                                            </span>
                                            <span style={{marginLeft: 20}}>
                                                {item.CurrentNodeName}时间: {item.RunTime}
                                            </span>
                                        </div>
                                    } />;
                                })}
                                {/* {history
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
                                    .filter(h => !!h)} */}
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
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return index;
            }
        },
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            width: '35%'
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: '30%'
        },
        {
            title: '操作',
            dataIndex: 'active',
            key: 'active',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <div>
                        {/* <a
                            href=''
                            onClick={this.onViewClick.bind(this, record.url, index)}
                        >
                            预览
                        </a> */}
                        {/* <Divider type='vertical' /> */}
                        <a href={record.url} target='_blank'>
                            下载
                        </a>
                    </div>
                );
            }
        }
    ];
}

// export default Form.create()(TotleModal)
