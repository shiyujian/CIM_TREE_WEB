import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
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
        if (rep && rep.Works && rep.Works.length > 0) {
            rep.Works.map(item => {
                if (item.CurrentNodeName === '施工填报'
                    && item.FormValues
                    && item.FormValues.length > 0
                    && item.FormValues[0].FormParams
                ) {
                    FormParams = item.FormValues[0].FormParams;
                }
            });
        }
        console.log('123', FormParams);
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

        let currentSection = '';
        if (param && param.Section) {
            currentSection = param.Section;
        }
        let code = currentSection.split('-');
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
            TodayDate: param.TodayDate ? moment(param.TodayDate).format(dateFormat) : ''
        });
        this.setState({
            TableList,
            workFlow: rep.Works
        });
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            workFlow,
            TableList
        } = this.state;
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
                                            <Input readOnly />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...FormItemLayout}
                                        label='日期'
                                    >
                                        {getFieldDecorator(
                                            'TodayDate'
                                        )(
                                            <Input readOnly />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Table
                                    columns={this.columns}
                                    dataSource={TableList}
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
                                            return <Step key={item.ID} title={
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
                                            return <Step key={item.ID} title={
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
                                    } else if (item.ExecuteState === 2) {
                                        // 退回
                                        return <Step key={item.ID} title={
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
                                                        item.FormValues && item.FormValues.length ? <div>意见：{
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
                                    } else {
                                        if (item.ExecutorObj) {
                                            // 未结束
                                            return <Step key={item.ID} title={
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
                                            return <Step key={item.ID} title={
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
