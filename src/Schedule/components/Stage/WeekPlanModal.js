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
            workFlow: []
        };
    }
    async componentDidMount () {
        this.getTaskDetail(); // 获取任务详情
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
                workFlow: rep.Works
            });
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            stime = '',
            etime = '',
            weekPlanDataSource = []
        } = this.props;
        const { workFlow } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

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
                                current={workFlow.length - 1}
                            >
                                {workFlow.map(item => {
                                    console.log();
                                    if (item.RunTime) {
                                        return <Step title={
                                            <div>
                                                <span>{item.CurrentNodeName}</span>
                                                <span style={{marginLeft: 10}}>-(已完成)</span>
                                            </div>
                                        } description={
                                            <div>
                                                <span>
                                                    {item.CurrentNodeName}人：
                                                    {item.ExecutorObj && item.ExecutorObj.Full_Name}({item.ExecutorObj && item.ExecutorObj.User_Name})
                                                </span>
                                                <span style={{marginLeft: 20}}>
                                                    {item.CurrentNodeName}时间：
                                                    {item.RunTime}
                                                </span>
                                            </div>
                                        } />;
                                    } else {
                                        if (item.ExecutorObj) {
                                            // 未结束
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-(执行中)</span>
                                                    <span style={{marginLeft: 20}}>
                                                        当前执行人：
                                                        <span style={{color: '#108ee9'}}>{item.ExecutorObj && item.ExecutorObj.Full_Name}</span>
                                                    </span>
                                                </div>
                                            } />;
                                        } else {
                                            // 已结束
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-(已结束)</span>
                                                </div>
                                            } />;
                                        }
                                    }
                                })}
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
