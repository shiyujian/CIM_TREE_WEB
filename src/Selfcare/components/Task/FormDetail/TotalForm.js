import React, { Component } from 'react';
import {
    Button,
    Form,
    Row,
    Col,
    Input,
    Card,
    Divider,
    Notification
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

    }
    handleReject () {

    }
}
export default Form.create()(TotalForm);
