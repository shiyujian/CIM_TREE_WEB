import React, { Component } from 'react';
import { Form, Row, Col, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class SearchInfo extends Component {
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
        const {
            platform: { tree = {} },
            leftkeycode
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
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
                sectionData.map(item => {
                    if (code[0] === item.No) {
                        let units = item.children;
                        units.map(unit => {
                            // 获取当前标段的名字
                            if (unit.No === section) {
                                let currentSectionName = unit.Name;
                                console.log('unitunitunit', unit);
                                optionArray.push(
                                    <Option
                                        key={unit.No}
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
            sectionData.map(project => {
                if (leftkeycode === project.No) {
                    let units = project.children;
                    units.map(d =>
                        optionArray.push(
                            <Option key={d.Name} value={d.Name}>
                                {d.Name}
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
            <Form>
                <Row>
                    <Col span={20}>
                        <Row>
                            <Col span={12}>
                                <FormItem {...SearchInfo.layout} label='标段'>
                                    {getFieldDecorator('sunitproject', {
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
                            <Col span={12}>
                                <FormItem {...SearchInfo.layout} label='编号'>
                                    {getFieldDecorator('snumbercode', {
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
                            <Col span={12}>
                                <FormItem {...SearchInfo.layout} label='日期'>
                                    {getFieldDecorator('stimedate', {
                                        rules: [
                                            {
                                                type: 'array',
                                                required: false,
                                                message: '请选择日期'
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
                            <Col span={12}>
                                <FormItem
                                    {...SearchInfo.layout}
                                    label='流程状态'
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
            sunitproject: undefined,
            snumbercode: undefined,
            stimedate: undefined,
            sstatus: undefined,
            ssuperunit: undefined
        });
        this.props.gettaskSchedule();
    }
}

// export default SearchInfo = Form.create()(SearchInfo);