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
class ActualForm extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    getOpinion () {
        const {
            CurrentNodeName,
            NextPeopleList,
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
                        })(
                            <Select style={{width: 400}}>
                                {
                                    NextPeopleList.length > 0 ? NextPeopleList.map(item => {
                                        return <Option value={item.ID} key={item.ID}>{item.Full_Name}</Option>;
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
            <Form layout='inline'>
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
                            提交
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
            actions: {postSendwork},
            form: { validateFields }
        } = this.props;
        console.log('提交', FlowID, FlowName, WorkID, CurrentNode, CurrentNodeName);
        validateFields((err, values) => {
            if (!err) {
                let FormParams = [{
                    Key: 'Opinion',
                    FieldType: 0,
                    Val: values.Opinion
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
                        notification.success({
                            message: '提交成功'
                        });
                        this.props.onBack();
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
        console.log('提交', FlowID, FlowName, WorkID, CurrentNode, CurrentNodeName);
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
                    NextExecutor: Starter, // 下一节点执行人
                    BackNode: originNodeID,
                    Executor // 当前节点执行人
                };
                postBackwork({}, params).then(rep => {
                    if (rep.code === 1) {
                        notification.success({
                            message: '提交成功'
                        });
                        this.props.onBack();
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
export default Form.create()(ActualForm);
