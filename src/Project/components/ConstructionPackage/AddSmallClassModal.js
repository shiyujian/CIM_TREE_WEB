import React, { Component } from 'react';
import { TREETYPENO, NURSERYPARAM, TREEPARAM } from '_platform/api';
import { getForestImgUrl } from '_platform/auth';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    InputNumber,
    Icon,
    Radio,
    Select,
    Notification
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddSmallClassModal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    static layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
    };

    cancel = async () => {
        // const {
        //     form: { setFieldsValue }
        // } = this.props;
        // await setFieldsValue({
        // });
        await this.props.handleAddSmallClassCancel();
    }

    save = async () => {
        // const {
        //     form: { setFieldsValue }
        // } = this.props;
        // this.props.form.validateFields(async (err, values) => {
        //     console.log('Received values of form: ', values);
        //     if (!err) {
        //         await setFieldsValue({
        //         });
        //     }
        // });
        await this.props.handleAddSmallClassCancel();
    }
    firsrNumChange = async (value) => {

    }
    secondNumChange = async (value) => {

    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div>
                <Modal
                    title='新增小班'
                    width={920}
                    visible
                    maskClosable={false}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={8} />
                                            <Col span={8}>
                                                <RadioGroup>
                                                    <Radio value={'multiple'} key={'multiple'}>新增多个小班</Radio>
                                                    <Radio value={'one'} key={'one'}>新增一个小班</Radio>
                                                </RadioGroup>
                                            </Col>
                                            <Col span={8} />
                                        </Row>

                                    </Col>
                                    <Col span={24} style={{marginTop: 20}}>
                                        <Row>
                                            <Col span={8}>
                                                <span>编码选择</span>
                                            </Col>
                                            <Col span={8}>
                                                <InputNumber onChange={this.firsrNumChange.bind(this)} />
                                            </Col>
                                            <Col span={8}>
                                                <InputNumber onChange={this.secondNumChange.bind(this)} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(AddSmallClassModal);
