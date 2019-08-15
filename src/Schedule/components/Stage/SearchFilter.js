import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import {
    getUser,
    getUserIsManager
} from '_platform/auth';
import {
    WFStatusList
} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class SearchFilter extends Component {
    constructor (props) {
        super(props);
        this.state = {
            optionArray: []
        };
    }
    static propType = {};
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    async componentDidMount () {
        await this.getSection();
    }

    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        // 地块修改，则修改标段
        if (leftkeycode !== prevProps.leftkeycode) {
            this.getSection();
        }
    }

    async getSection () {
        const {
            platform: { tree = {} },
            leftkeycode,
            form: {
                setFieldsValue
            }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let user = getUser();
        let section = user && user.section;
        let optionArray = [];
        let permission = getUserIsManager();
        if (section) {
            let code = section.split('-');
            if (code && code.length === 3) {
                // 获取当前标段所在的项目
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        let units = item.children;
                        units.map(unit => {
                            // 获取当前标段的名字
                            if (unit.No === section) {
                                let currentSectionName = unit.Name;
                                optionArray.push(
                                    <Option
                                        key={unit.No}
                                        value={unit.No}
                                    >
                                        {currentSectionName}
                                    </Option>
                                );
                                setFieldsValue({
                                    section: unit.No
                                });
                            }
                        });
                    }
                });
            }
        } else if (permission) {
            sectionData.map(project => {
                if (leftkeycode && leftkeycode === project.No) {
                    let units = project.children;
                    units.map(d =>
                        optionArray.push(
                            <Option key={d.No} value={d.No}>
                                {d.Name}
                            </Option>
                        )
                    );
                }
            });
        } else {
            optionArray = [];
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
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...SearchFilter.layout} label='标段'>
                                    {
                                        getFieldDecorator('section')(
                                            <Select
                                                placeholder='请选择标段'
                                                style={{width: 220}}
                                                allowClear
                                            >
                                                {optionArray}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...SearchFilter.layout} label='提交时间'>
                                    {
                                        getFieldDecorator('submitDate')(
                                            <RangePicker
                                                showTime={{ format: 'HH:mm:ss' }}
                                                size='default'
                                                format='YYYY-MM-DD HH:mm:ss'
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...SearchFilter.layout}
                                    label='流程状态'
                                >
                                    {getFieldDecorator('status')(
                                        <Select
                                            style={{width: 220}}
                                            placeholder='请选择流程类型'
                                            allowClear
                                        >
                                            {
                                                WFStatusList.map(item => {
                                                    return <Option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </Option>;
                                                })
                                            }
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
                                    type='primary'
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
        let user = getUser();
        let section = user && user.section;
        let permission = getUserIsManager();
        if (permission || section) {
            this.onSearch();
        }
    }

    clear () {
        let user = getUser();
        let section = user && user.section;
        if (section) {
            this.props.form.setFieldsValue({
                section: section
            });
        } else {
            this.props.form.setFieldsValue({
                section: undefined
            });
        }
        this.props.form.setFieldsValue({
            status: undefined,
            submitDate: undefined
        });
        this.onSearch();
    }

    // 搜索
    onSearch () {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
            }
            let stime = '';
            let etime = '';
            if (values.submitDate && values.submitDate.length) {
                stime = moment(values.submitDate[0]).format('YYYY-MM-DD HH:mm:ss');
                etime = moment(values.submitDate[1]).format('YYYY-MM-DD HH:mm:ss');
            }
            // 表单查询
            let key = '';
            let value = '';
            if (values.section) {
                key = 'Section';
                value = values.section;
            }
            let pro = {
                keys: key,
                values: value,
                stime, // 开始时间
                etime, // 结束时间
                status: values.status // 流程状态
            };
            console.log('是数据', values);
            this.props.getWorkList(pro);
        });
    }
}

// export default SearchFilter = Form.create()(SearchFilter);
