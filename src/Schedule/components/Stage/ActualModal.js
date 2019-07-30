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
import {
    ExecuteStateList
} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Step = Steps.Step;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
export default class ActualModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeDatasource: [],
            workFlow: []
        };
        this.getTaskDetail.bind(this); // 获取任务详情
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
            console.log('任务ID', param);
            setFieldsValue({
                Section: param.Section
            });
            this.setState({
                TodayDate: param.TodayDate,
                workDetails: rep,
                TableList,
                workFlow: rep.Works
            });
        });
    }

    render () {
        const {
            sectionArray,
            form: { getFieldDecorator }
        } = this.props;
        const { workFlow, TodayDate, TableList } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        return (
            <div>
                <Modal
                    title='日进度计划流程详情'
                    width={800}
                    onCancel={this.props.oncancel}
                    visible
                    footer={null}
                >
                    <div>
                        <Form>
                            <Row>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='标段'
                                    >
                                        {getFieldDecorator(
                                            'Section'
                                        )(
                                            <Select
                                                disabled
                                                style={{width: 220}}
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
                                        <DatePicker
                                            style={{width: 220}}
                                            disabled
                                            value={moment(TodayDate, dateFormat)}
                                            format={dateFormat}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Table
                                    columns={this.columns}
                                    dataSource={this.state.TableList}
                                    bordered
                                    rowKey='ID'
                                    className='foresttable'
                                    pagination={false}
                                />
                            </Row>
                        </Form>
                        <Card title={'审批流程'} style={{ marginTop: 10 }}>
                            <Steps
                                direction='vertical'
                                size='small'
                                current={workFlow.length - 1}
                            >
                                {workFlow.map(item => {
                                    if (item.ExecuteState === 1) {
                                        if (item.CurrentNodeName === '结束') {
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-({
                                                        ExecuteStateList.map(row => {
                                                            if (row.value === item.ExecuteState) {
                                                                return row.label;
                                                            }
                                                        })
                                                    })</span>
                                                </div>
                                            } />;
                                        } else {
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-({
                                                        ExecuteStateList.map(row => {
                                                            if (row.value === item.ExecuteState) {
                                                                return row.label;
                                                            }
                                                        })
                                                    })</span>
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
                                        }
                                    } else {
                                        if (item.ExecutorObj) {
                                            // 未结束
                                            return <Step title={
                                                <div>
                                                    <span>{item.CurrentNodeName}</span>
                                                    <span style={{marginLeft: 10}}>-({
                                                        ExecuteStateList.map(row => {
                                                            if (row.value === item.ExecuteState) {
                                                                return row.label;
                                                            }
                                                        })
                                                    })</span>
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
                                                    <span style={{marginLeft: 10}}>-({
                                                        ExecuteStateList.map(row => {
                                                            if (row.value === item.ExecuteState) {
                                                                return row.label;
                                                            }
                                                        })
                                                    })</span>
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
    columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
            render: (text, record, index) => {
                return <span>{record.ID + 1}</span>;
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
            key: 'project'
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
                if (record && record.actualNum) {
                    return <span>{record.actualNum}</span>;
                } else {
                    return <span>0</span>;
                }
            }
        }
    ];
}

// export default Form.create()(ActualModal)
