import React, { Component } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Select,
    notification
} from 'antd';
import {
    ACYUAL_THREENODE_ID,
    ACYUAL_FOURNODE_ID
} from '_platform/api';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
class ActualFormOrigin extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    render () {
        const {
            auditorList,
            form: { getFieldDecorator }
        } = this.props;
        return (<div>
            <Form layout='inline'>
                <Row style={{marginTop: 20}}>
                    <Col span={24}>
                        <Form.Item
                            {...formItemLayout}
                            label='监理审核人'
                        >
                            {getFieldDecorator('NextPeople', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择监理审核人'
                                    }
                                ]
                            })(
                                <Select style={{width: 400}}>
                                    {
                                        auditorList.length && auditorList.length > 0 ? auditorList.map(item => {
                                            return <Option
                                                value={item.ID}
                                                key={item.ID}>
                                                {`${item.Full_Name}(${item.User_Name})`}
                                            </Option>;
                                        }) : ''
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col span={24} style={{textAlign: 'center'}}>
                        <Button
                            type='primary'
                            onClick={this.handleSubmit.bind(this)}
                            style={{ marginRight: 20 }}
                        >
                            重新提交
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>);
    }
    handleSubmit () {
        const {
            FlowID,
            FlowName,
            WorkID,
            CurrentNode,
            CurrentNodeName,
            Executor,
            TableList,
            Section,
            Starter,
            param,
            actions: {
                postSendwork,
                addSchedule
            },
            form: { validateFields }
        } = this.props;
        console.log('提交', Section, param, TableList);
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [{
                    Key: 'Section', // 标段
                    FieldType: 0,
                    Val: Section || ''
                }, {
                    Key: 'TodayDate', // 日期
                    FieldType: 0,
                    Val: param.TodayDate
                }, {
                    Key: 'TableInfo', // 列表信息
                    FieldType: 0,
                    Val: JSON.stringify(TableList)
                }];
                console.log('下一执行人', values.NextPeople);
                let params = {
                    FlowID, // 流程ID
                    FlowName, // 流程名称
                    WorkID, // 任务ID
                    CurrentNode, // 当前节点
                    CurrentNodeName, // 当前节点名称
                    FormValue: {
                        FormParams: FormParams,
                        NodeID: '' // 下一节点ID
                    }, // 表单值
                    NextExecutor: values.NextPeople, // 下一节点执行人
                    Executor // 当前节点执行人
                };
                postSendwork({}, params).then(rep => {
                    if (rep.code === 1) {
                        if (CurrentNodeName === '业主查看') {
                            let items = [];
                            TableList.map(item => {
                                items.push({
                                    Num: Number(item.actualNum),
                                    Project: item.project,
                                    WPNo: Section
                                });
                            });
                            let params = {
                                DocType: 'doc',
                                Items: items,
                                ProgressNo: Starter, // 发起人
                                ProgressTime: param.TodayDate, // 日期
                                ProgressType: '日实际',
                                SMS: 0,
                                UnitProject: Section, // 标段
                                WPNo: Section.split('-')[0] // 项目
                            };
                            addSchedule({}, params).then(rep => {
                                if (rep.code === 1) {
                                    notification.success({
                                        message: '提交成功，人/机投入已入库'
                                    });
                                    this.props.onBack();
                                } else {
                                    notification.error({
                                        message: '提交成功，人/机投入未入库'
                                    });
                                }
                            });
                        } else {
                            notification.success({
                                message: '提交成功'
                            });
                            this.props.onBack();
                        }
                    } else {
                        notification.error({
                            message: '提交失败'
                        });
                    }
                });
            }
        });
    }
}
export default Form.create()(ActualFormOrigin);
