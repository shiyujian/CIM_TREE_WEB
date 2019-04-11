import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Icon,
    Button,
    Table,
    Modal,
    Select,
    Radio
} from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ChangeLocInfoModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            smallClassList: [],
            thinClassList: []
        };
    }
    render () {
        const {
            form: { getFieldDecorator },
            platform: { tree = {} },
            treetypes
        } = this.props;
        const {
            sectionsList = [],
            smallClassList = [],
            thinClassList = []
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let thinClassTree = tree.thinClassTree;
        return (
            <Modal
                width={850}
                title='修改信息'
                visible
                onOk={this.handleChangeInfoOk.bind(this)}
                onCancel={this.handleChangeInfoCancel.bind(this)}
            >
                <Form>
                    <Row>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='项目'
                                >
                                    {getFieldDecorator(
                                        'project',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择项目'
                                                }
                                            ]
                                        }
                                    )(<Select onSelect={this.projectSelect.bind(this)}>
                                        {
                                            thinClassTree.map((project) => {
                                                return <Option key={project.No} value={project.No}>
                                                    {project.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='标段'
                                >
                                    {getFieldDecorator(
                                        'section',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择标段'
                                                }
                                            ]
                                        }
                                    )(<Select onSelect={this.sectionSelect.bind(this)}>
                                        {
                                            sectionsList.map((section) => {
                                                return <Option key={section.No} value={section.No}>
                                                    {section.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='小班'
                                >
                                    {getFieldDecorator(
                                        'smallClass',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择小班'
                                                }
                                            ]
                                        }
                                    )(<Select onSelect={this.smallClassSelect.bind(this)}>
                                        {
                                            smallClassList.map((smallClass) => {
                                                return <Option key={smallClass.No} value={smallClass.No}>
                                                    {smallClass.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='细班'
                                >
                                    {getFieldDecorator(
                                        'thinClass',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择细班'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        {
                                            thinClassList.map((thinClass) => {
                                                return <Option key={thinClass.No} value={thinClass.No}>
                                                    {thinClass.Name}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='树种'
                                >
                                    {getFieldDecorator(
                                        'treeType',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择树种'
                                                }
                                            ]
                                        }
                                    )(<Select allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {
                                            treetypes.map((type) => {
                                                return <Option key={type.ID} value={type.ID}>
                                                    {type.TreeTypeName}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='测量人'
                                >
                                    {getFieldDecorator(
                                        'inputer',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入测量人'
                                                }
                                            ]
                                        }
                                    )(<Input />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='高度'
                                >
                                    {getFieldDecorator(
                                        'height',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择高度'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='冠幅'
                                >
                                    {getFieldDecorator(
                                        'GF',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择冠幅'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='胸径'
                                >
                                    {getFieldDecorator(
                                        'XJ',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择胸径'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='地径'
                                >
                                    {getFieldDecorator(
                                        'DJ',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择地径'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='土球直径'
                                >
                                    {getFieldDecorator(
                                        'TQZJ',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择土球直径'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='土球厚度'
                                >
                                    {getFieldDecorator(
                                        'TQHD',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择土球厚度'
                                                }
                                            ]
                                        }
                                    )(<RadioGroup>
                                        <Radio value={'x10'}>x10</Radio>
                                        <Radio value={'100'}>100</Radio>
                                        <Radio value={'/10'}>/10</Radio>
                                        <Radio value={'/100'}>/100</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </Modal>
        );
    }

    handleChangeInfoOk = () => {
        this.props.onOk();
    }
    handleChangeInfoCancel = () => {
        this.props.onCancel();
    }
    projectSelect = (value) => {
        const {
            platform: { tree = {} }
        } = this.props;
        console.log('value', value);
        let treeList = tree.thinClassTree;
        let sectionsList = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    sectionsList = treeData.children;
                }
            });
        }
        this.setState({
            sectionsList
        });
    }

    sectionSelect = (value) => {
        const {
            sectionsList
        } = this.state;
        console.log('value', value);
        let smallClassList = [];
        if (value) {
            sectionsList.map((section) => {
                if (value === section.No) {
                    smallClassList = section.children;
                }
            });
        }
        this.setState({
            smallClassList
        });
    }
    smallClassSelect = (value) => {
        const {
            smallClassList
        } = this.state;
        console.log('value', value);
        let thinClassList = [];
        if (value) {
            smallClassList.map((smallClass) => {
                if (value === smallClass.No) {
                    thinClassList = smallClass.children;
                }
            });
        }
        this.setState({
            thinClassList
        });
    }
}

export default Form.create()(ChangeLocInfoModal);
