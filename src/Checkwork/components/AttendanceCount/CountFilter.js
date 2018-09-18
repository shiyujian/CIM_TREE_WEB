import React, { Component } from 'react';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
    Popconfirm,
    DatePicker,
    Select
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class CountFilter extends Component {
    static propTypes = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    render () {
        const {
            form: { getFieldDecorator },
            Doc = []
        } = this.props;
        return (
            <Form style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='项目'>
                                    {getFieldDecorator('projectName', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入项目名称'
                                            }
                                        ]
                                    })(<Input placeholder='请输入项目名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='标段'>
                                    {getFieldDecorator('section', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择标段'
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option
                                                key={'宣传片'}
                                                value={'宣传片'}
                                            >
                                                宣传片
                                            </Option>
                                            <Option
                                                key={'操作视频'}
                                                value={'操作视频'}
                                            >
                                                操作视频
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='姓名'>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入姓名'
                                            }
                                        ]
                                    })(
                                      <Input placeholder='请输入姓名' />) 
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                           <Col span={8}>
                                <FormItem {...Filter.layout} label='时间'>
                                    {getFieldDecorator('searchDate', {
                                        rules: [
                                            {
                                                type: 'array',
                                                required: false,
                                                message: '请选择时间'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            size='default'
                                            format='YYYY-MM-DD'
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='出勤'>
                                    {getFieldDecorator('section', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择是否出勤'
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option
                                                key={'是'}
                                                value={'是'}
                                            >
                                                是
                                            </Option>
                                            <Option
                                                key={'否'}
                                                value={'否'}
                                            >
                                                否
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='状态'>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择状态'
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option
                                                key={'迟到'}
                                                value={'迟到'}
                                            >
                                                迟到
                                            </Option>
                                            <Option
                                                key={'早退'}
                                                value={'早退'}
                                            >
                                                早退
                                            </Option>
                                            <Option
                                                key={'正常'}
                                                value={'正常'}
                                            >
                                                正常
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={5} offset={1}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <Button
                                    type='Primary'
                                    onClick={this.query.bind(this)}
                                >
                                    查询
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button onClick={this.clear.bind(this)}>
                                    清除
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='考勤群体'>
                                    {getFieldDecorator('projectName', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择考勤群体'
                                            }
                                        ]
                                    })(

                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='角色'>
                                    {getFieldDecorator('section', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择角色'
                                            }
                                        ]
                                    })(
                                        <Select>
                                            <Option
                                                key={'宣传片'}
                                                value={'宣传片'}
                                            >
                                                宣传片
                                            </Option>
                                            <Option
                                                key={'操作视频'}
                                                value={'操作视频'}
                                            >
                                                操作视频
                                            </Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...Filter.layout} label='职务'>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择职务'
                                            }
                                        ]
                                    })(
                            
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }

    query () {
       
    }
    clear () {
     
    }

}
export default Form.create()(CountFilter);
