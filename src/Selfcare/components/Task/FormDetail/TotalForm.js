import React, { Component } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Card,
    Divider,
    notification
} from 'antd';
const FormItem = Form.Item;
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
class TotalForm extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
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

            }
            let FormValue = [{
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
                FormValue, // 表单值
                NextExecutor: 0, // 下一节点执行人
                Executor // 当前节点执行人
            };
            postSendwork({}, params).then(rep => {
                if (rep && rep.code && rep.code === 1) {
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
        });
    }
    handleReject () {
        const {
            FlowID,
            FlowName,
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

            }
            let FormValue = [{
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
                FormValue, // 表单值
                NextExecutor: '', // 下一节点执行人
                BackNode: '', // 退回节点
                Executor // 当前节点执行人
            };
            postBackwork({}, params).then(rep => {
                if (rep && rep.code && rep.code === 1) {
                    notification.success({
                        message: '提交成功'
                    });
                }
            });
        });
    }
}
export default Form.create()(TotalForm);
