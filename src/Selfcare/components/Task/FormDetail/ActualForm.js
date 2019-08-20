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
class ActualForm extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    getOpinion () {
        const {
            CurrentNodeName,
            ownerList,
            form: { getFieldDecorator }
        } = this.props;
        let node = '';
        if (CurrentNodeName === '业主查看') {

        } else {
            node = <Row style={{marginTop: 20}}>
                <Col span={24}>
                    <Form.Item
                        {...formItemLayout}
                        label='业主查看人'
                    >
                        {getFieldDecorator('NextPeople', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择业主查看人'
                                }
                            ]
                        })(
                            <Select style={{width: 400}}>
                                {
                                    ownerList.length > 0 ? ownerList.map(item => {
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
            </Row>;
        }
        return node;
    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        return (<div>
            <Form >
                <Row style={{marginTop: 20}}>
                    <Col>
                        <Form.Item
                            {...formItemLayout}
                            label='处理意见'
                        >
                            {getFieldDecorator('Opinion', {
                            })(
                                <Input style={{width: 400}} placeholder='请输入处理意见' />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                {
                    this.getOpinion()
                }
                <Row style={{marginTop: 20}}>
                    <Col span={24} style={{textAlign: 'center'}}>
                        <Button
                            type='primary'
                            onClick={this.handleSubmit.bind(this)}
                            style={{ marginRight: 20 }}
                        >
                            同意
                        </Button>
                        <Button onClick={this.handleReject.bind(this)}>
                            退回
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
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [{
                    Key: 'Opinion',
                    FieldType: 0,
                    Val: values.Opinion
                }];
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
                    if (rep && rep.code && rep.code === 1) {
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
                            addSchedule({}, params).then(rst => {
                                if (rst && rst.code && rst.code === 1) {
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
    handleReject () {
        const {
            Starter,
            FlowID,
            FlowName,
            originNodeID,
            WorkID,
            CurrentNode,
            CurrentNodeName,
            Executor,
            actions: {postBackwork},
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
            }
            let FormParams = [{
                Key: 'Opinion',
                FieldType: 0,
                Val: values.Opinion
            }];
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
                NextExecutor: Starter, // 下一节点执行人
                BackNode: originNodeID,
                Executor // 当前节点执行人
            };
            postBackwork({}, params).then(rep => {
                if (rep && rep.code && rep.code === 1) {
                    notification.success({
                        message: '退回成功'
                    });
                    this.props.onBack();
                } else {
                    notification.error({
                        message: '退回失败'
                    });
                }
            });
        });
    }
}
export default Form.create()(ActualForm);
