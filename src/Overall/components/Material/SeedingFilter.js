import React, { Component } from 'react';
import { PROJECT_UNITS } from '../../../_platform/api';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    DatePicker,
    Select
} from 'antd';
import { getUser } from '../../../_platform/auth';
const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

export default class SeedingFilter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            optionArray: []
        };
    }
    static propTypes = {};

    static layoutT = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    async componentDidMount () {
        this.getSection();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        // 地块修改，则修改标段
        if (leftkeycode != prevProps.leftkeycode) {
            this.getSection();
        }
    }

    async getSection () {
        const { leftkeycode } = this.props;
        console.log('leftkeycode', leftkeycode);
        let user = getUser();
        let optionArray = [];
        let sections = user.sections;
        sections = JSON.parse(sections);
        if (sections && sections instanceof Array && sections.length > 0) {
            let section = sections[0];
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                PROJECT_UNITS.map(item => {
                    if (code[0] === item.code) {
                        let units = item.units;
                        units.map(unit => {
                            // 获取当前标段的名字
                            if (unit.code == section) {
                                let currentSectionName = unit.value;
                                console.log('unitunitunit', unit);
                                optionArray.push(
                                    <Option
                                        key={unit.code}
                                        value={currentSectionName}
                                    >
                                        {currentSectionName}
                                    </Option>
                                );
                            }
                        });
                    }
                });
            }
        } else {
            PROJECT_UNITS.map(project => {
                if (leftkeycode === project.code) {
                    let units = project.units;
                    units.map(d =>
                        optionArray.push(
                            <Option key={d.value} value={d.value}>
                                {d.value}
                            </Option>
                        )
                    );
                }
            });
        }
        this.setState({
            optionArray: optionArray
        });
    }

    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;

        const { optionArray } = this.state;
        return (
            <Form style={{ marginBottom: 0 }}>
                <Row gutter={24}>
                    <Col span={20}>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...SeedingFilter.layoutT}
                                    label='单位工程:'
                                >
                                    {getFieldDecorator('ssection', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择标段'
                                            }
                                        ]
                                    })(
                                        <Select placeholder='请选择标段'>
                                            {optionArray}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...SeedingFilter.layoutT}
                                    label='名称:'
                                >
                                    {getFieldDecorator('sname', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入名称'
                                            }
                                        ]
                                    })(<Input placeholder='请输入名称' />)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...SeedingFilter.layoutT}
                                    label='编号:'
                                >
                                    {getFieldDecorator('scode', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入编号'
                                            }
                                        ]
                                    })(<Input placeholder='请输入编号' />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    {...SeedingFilter.layoutT}
                                    label='进场日期:'
                                >
                                    {getFieldDecorator('stimedate', {
                                        rules: [
                                            {
                                                type: 'array',
                                                required: false,
                                                message: '请选择时期'
                                            }
                                        ]
                                    })(
                                        <RangePicker
                                            size='default'
                                            format='YYYY-MM-DD'
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    {...SeedingFilter.layoutT}
                                    label='流程状态:'
                                >
                                    {getFieldDecorator('sstatus', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择流程状态'
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择流程类型'
                                            allowClear
                                        >
                                            {/* <Option key={Math.random*4} value={0}>编辑中</Option> */}
                                            {/* <Option key={Math.random*5} value={1}>已提交</Option> */}
                                            <Option
                                                key={Math.random * 6}
                                                value={'2'}
                                            >
                                                执行中
                                            </Option>
                                            <Option
                                                key={Math.random * 7}
                                                value={'3'}
                                            >
                                                已完成
                                            </Option>
                                            {/* <Option key={Math.random*8} value={4}>已废止</Option> */}
                                            {/* <Option key={Math.random*9} value={5}>异常</Option> */}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button
                                    type='Primary'
                                    onClick={this.query.bind(this)}
                                >
                                    查询
                                </Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>
                                    清除
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
            </Form>
        );
    }

    query () {
        this.props.gettaskSchedule();
    }

    clear () {
        this.props.form.setFieldsValue({
            ssection: undefined,
            sname: undefined,
            scode: undefined,
            stimedate: undefined,
            sstatus: undefined
        });
        this.props.gettaskSchedule();
    }
}
