import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Table,
    Select,
    Modal,
    Card,
    DatePicker,
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
export default class WeekPlanModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            TableList: [], // 表格数据
            workFlow: [] // 流程节点
        };
    }
    async componentDidMount () {
        this.getTaskDetail(); // 获取任务详情
    }
    getTaskDetail = async () => {
        const {
            workID,
            actions: { getWorkDetails },
            form: { setFieldsValue },
            platform: { tree = {} }
        } = this.props;
        this.setState({
            workID: workID
        });
        let rep = await getWorkDetails({ID: workID}, {});
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

        let sectionData = (tree && tree.bigTreeList) || [];
        let sectionName = '';
        let projectName = '';

        let code = param.Section.split('-');
        if (code && code.length === 3) {
            // 获取当前标段所在的项目
            sectionData.map(project => {
                if (code[0] === project.No) {
                    projectName = project.Name;
                    project.children.map(section => {
                        // 获取当前标段的名字
                        if (section.No === param.Section) {
                            sectionName = section.Name;
                        }
                    });
                }
            });
            param.sectionName = sectionName;
            param.projectName = projectName;
        }
        setFieldsValue({
            Section: sectionName,
            StartDate: param.StartDate ? moment(param.StartDate).format(dateFormat) : '',
            EndDate: param.EndDate ? moment(param.EndDate).format(dateFormat) : ''
        });
        this.setState({
            TableList,
            workFlow: rep.Works
        });
    }
    render () {
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            workFlow,
            TableList
        } = this.state;
        console.log('123', TableList);
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        return (
            <div>
                <Modal
                    title='周进度计划流程详情'
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
                                                    'Section'
                                                )(
                                                    <Input readOnly />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='开始日期'
                                            >
                                                {getFieldDecorator(
                                                    'StartDate'
                                                )(
                                                    <Input readOnly />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem
                                                {...FormItemLayout}
                                                label='结束日期'
                                            >
                                                {getFieldDecorator(
                                                    'EndDate'
                                                )(
                                                    <Input readOnly />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Table
                                            columns={this.columns}
                                            pagination={false}
                                            dataSource={TableList}
                                            rowKey='ID'
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
                                            } description={<div>
                                                {
                                                    item.CurrentNodeName !== '施工填报' ? <div>
                                                        {
                                                            item.FormValues && item.FormValues.length ? <div>意见:{
                                                                item.FormValues[0].FormParams && item.FormValues[0].FormParams.length && item.FormValues[0].FormParams[0].Val
                                                            }</div> : ''
                                                        }
                                                    </div> : ''
                                                }
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
                                            </div>} />;
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
                                                        <span style={{color: '#108ee9'}}>
                                                            {`${item.ExecutorObj && item.ExecutorObj.Full_Name}(${item.ExecutorObj && item.ExecutorObj.User_Name})`}
                                                        </span>
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
