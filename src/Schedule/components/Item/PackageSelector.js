import React, { Component } from 'react';
import { Row, Col, Form, Button, Cascader, Select, Icon, message } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

export default class PackageSelector extends Component {
    static layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };

    render () {
        const {
            workPackage: {
                projectTree = [],
                units = [],
                subunits = [],
                sections = [],
                subsections = [],
                project = [],
                unit,
                subunit,
                section,
                subsection
            } = {}
        } = this.props;
        return (
            <Form
                style={{
                    padding: '24px 24px 0px',
                    background: '#fbfbfb',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6
                }}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <FormItem {...PackageSelector.layout} label='建设项目'>
                            <Cascader
                                placeholder='请选择建设项目'
                                displayRender={PackageSelector.displayRender}
                                options={projectTree}
                                value={project}
                                expandTrigger='hover'
                                onChange={this.changeProject.bind(this)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...PackageSelector.layout} label='单位工程'>
                            <Select
                                placeholder='单位工程'
                                value={unit}
                                allowClear
                                onChange={this.changeUnit.bind(this)}
                            >
                                {units.map(pkg => {
                                    return (
                                        <Option key={pkg.code} value={pkg.code}>
                                            {pkg.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...PackageSelector.layout}
                            label='子单位工程'
                        >
                            <Select
                                placeholder='请输入子单位工程'
                                value={subunit}
                                allowClear
                                onChange={this.changeSubunit.bind(this)}
                            >
                                {subunits.map(pkg => {
                                    return (
                                        <Option key={pkg.code} value={pkg.code}>
                                            {pkg.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <FormItem {...PackageSelector.layout} label='分部工程'>
                            <Select
                                placeholder='分部工程'
                                value={section}
                                allowClear
                                onChange={this.changeSection.bind(this)}
                            >
                                {sections.map(pkg => {
                                    return (
                                        <Option key={pkg.code} value={pkg.code}>
                                            {pkg.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...PackageSelector.layout}
                            label='子分部工程'
                        >
                            <Select
                                placeholder='子分部工程'
                                value={subsection}
                                allowClear
                                onChange={this.changeSubsection.bind(this)}
                            >
                                {subsections.map(pkg => {
                                    return (
                                        <Option key={pkg.code} value={pkg.code}>
                                            {pkg.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Col span={12}>
                            <FormItem>
                                <Button onClick={this.back.bind(this)}>
                                    <Icon type='rollback' />
                                </Button>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                <Button onClick={this.append.bind(this)}>
                                    <Icon type='plus' />
                                </Button>
                            </FormItem>
                        </Col>
                    </Col>
                </Row>
            </Form>
        );
    }

    componentDidMount () {
        const {
            actions: { getProjectTree }
        } = this.props;
        getProjectTree();
    }

    back () {
        const {
            actions: { changeTableField }
        } = this.props;
        changeTableField('editing', false);
    }

    changeProject (keys) {
        const {
            actions: { setProject, getUnits }
        } = this.props;
        if (keys.length >= 1) {
            const key = keys[keys.length - 1];
            setProject(keys);
            getUnits({ code: key });
        } else {
            setProject(keys);
        }
    }

    changeUnit (key) {
        const {
            actions: { setUnit, getSubunits }
        } = this.props;
        setUnit(key);

        if (key) {
            getSubunits({ code: key });
        }
    }

    changeSubunit (key) {
        const {
            actions: { setSubunit, getSections }
        } = this.props;
        setSubunit(key);
        if (key) {
            getSections({ code: key });
        }
    }

    changeSection (key) {
        const {
            actions: { setSection, getSubsections }
        } = this.props;
        setSection(key);
        if (key) {
            getSubsections({ code: key });
        }
    }

    changeSubsection (key) {
        const {
            actions: { setSubsection }
        } = this.props;
        setSubsection(key);
    }

    append () {
        const {
            workPackage: { subsection } = {},
            actions: { pushParameters }
        } = this.props;

        if (subsection) {
            pushParameters({
                code: PackageSelector.index--,
                section: subsection,
                editing: true
            });
        } else {
            message.info('请先选择子分项工程');
        }
    }

    static index = 0;

    static displayRender (label) {
        return label[label.length - 1];
    }
}
