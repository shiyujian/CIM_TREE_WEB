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

class ChangeNurseryInfoModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: []
        };
    }
    render () {
        const {
            form: { getFieldDecorator },
            nurseryList = [],
            supplierList = [],
            treetypes = [],
            platform: { tree = {} }
        } = this.props;
        const {
            sectionsList = []
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let bigTreeList = tree.bigTreeList;
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
                                    label='苗圃名称'
                                >
                                    {getFieldDecorator(
                                        'nurseryName',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择苗圃名称'
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
                                            nurseryList.map((nursery) => {
                                                return <Option key={nursery.ID} value={nursery.ID}>
                                                    {nursery.NurseryName}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='供应商名称'
                                >
                                    {getFieldDecorator(
                                        'supplierName',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择供应商名称'
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
                                            supplierList.map((supplier) => {
                                                return <Option key={supplier.ID} value={supplier.ID}>
                                                    {supplier.SupplierName}
                                                </Option>;
                                            })
                                        }
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='产地'
                                >
                                    {getFieldDecorator(
                                        'place',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入产地'
                                                }
                                            ]
                                        }
                                    )(<Input />)}
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
                                            bigTreeList.map((project) => {
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
                                    )(<Select>
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
                                    label='状态'
                                >
                                    {getFieldDecorator(
                                        'status',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择状态'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        <Option key={'未打包'} value={'0'} title={'未打包'}>
                                            未打包
                                        </Option>,
                                        <Option key={'已打包'} value={'1'} title={'已打包'}>
                                            已打包
                                        </Option>
                                    </Select>)}
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
        let treeList = tree.bigTreeList;
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
}

export default Form.create()(ChangeNurseryInfoModal);
