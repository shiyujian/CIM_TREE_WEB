import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API, PROJECT_UNITS } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Select
} from 'antd';
import { getUser } from '../../../_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;

class Filter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isTreeSelected: false,
            loading: false,
            parent: '',
            sectionArray: [],
            projectArray: []
        };
    }

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    componentDidMount () {
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        return (
            <Form style={{ marginBottom: 10 }}>
                <Row gutter={24}>
                    <Col span={6}>
                        <FormItem {...Filter.layout} label='采购编号'>
                            {getFieldDecorator('searchNo', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入采购编号'
                                    }
                                ]
                            })(
                                <Input placeholder='请输入采购编号' />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...Filter.layout} label='采购名称'>
                            {getFieldDecorator('searchName', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入采购名称'
                                    }
                                ]
                            })(<Input placeholder='请输入采购名称' />)}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...Filter.layout} label='状态'>
                            {getFieldDecorator('searchStatus', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择状态'
                                    }
                                ]
                            })(
                                <Select placeholder='请选择状态'>
                                    <Option key='1' value='状态'>状态</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            <Button
                                type='primary'
                                onClick={this.query.bind(this)}
                            >
                                        查询
                            </Button>
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem>
                            <Button onClick={this.clear.bind(this)}>
                                    清除
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <div style={{float: 'right'}}>
                            <Button
                                type='primary'
                                onClick={this.addVisible.bind(this)}
                            >
                                新增
                            </Button>
                        </div>
                    </Col>
                </Row>
                <hr />
            </Form>
        );
    }

    addVisible () {
        const {
            actions: {
                changeAddDemandModalVisible
            }
        } = this.props;
        changeAddDemandModalVisible(true);
    }

    query () {
        const {
            form: { validateFields }
        } = this.props;
        validateFields((err, values) => {
            console.log('values', values);
            let search = {};
            console.log('err', err);
            if (values.searchNo) {
                search.searchNo = values.searchNo;
            }
            if (values.searchName) {
                search.searchName = values.searchName;
            }
            if (values.searchStatus) {
                search.searchStatus = values.searchStatus;
            }

            let postData = Object.assign({}, search);
            console.log('postData', postData);
        });
    }
    clear () {
        this.props.form.setFieldsValue({
            searchNo: undefined,
            searchName: undefined,
            searchStatus: undefined
        });
    }
}
export default Form.create()(Filter);
