import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select
} from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;

class ChangeCarInfoModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: []
        };
    }
    componentDidMount = async () => {

    }
    handleChangeCarInfoOk = () => {
        this.props.onEditCarModalCancel();
    }
    handleChangeCarInfoCancel = () => {
        this.props.onEditCarModalCancel();
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
    render () {
        const {
            form: { getFieldDecorator },
            platform: { tree = {} }
        } = this.props;
        const {
            sectionsList = []
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let bigTreeList = tree.bigTreeList || [];
        return (
            <Modal
                width={850}
                title='修改信息'
                visible
                maskClosable={false}
                onOk={this.handleChangeCarInfoOk.bind(this)}
                onCancel={this.handleChangeCarInfoCancel.bind(this)}
            >
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                {...FormItemLayout}
                                label='车牌号'
                            >
                                {getFieldDecorator(
                                    'carNumber',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入车牌号'
                                            }
                                        ]
                                    }
                                )(<Input />)}
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
                                    </Option>
                                    <Option key={'已打包'} value={'1'} title={'已打包'}>
                                        已打包
                                    </Option>
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
                                label='苗木类型'
                            >
                                {getFieldDecorator(
                                    'treeType',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择苗木类型'
                                            }
                                        ]
                                    }
                                )(<Select>
                                    <Option key={'地被'} value={'1'} title={'地被'}>
                                        地被
                                    </Option>
                                    <Option key={'乔灌'} value={'0'} title={'乔灌'}>
                                        乔灌
                                    </Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...FormItemLayout}
                                label='苗木规格'
                            >
                                {getFieldDecorator(
                                    'treeStandards',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入苗木规格'
                                            }
                                        ]
                                    }
                                )(<Input />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...FormItemLayout}
                                label='总数'
                            >
                                {getFieldDecorator(
                                    'totalNumber',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入总数'
                                            }
                                        ]
                                    }
                                )(<Input />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...FormItemLayout}
                                label='司机姓名'
                            >
                                {getFieldDecorator(
                                    'dirverName',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入司机姓名'
                                            }
                                        ]
                                    }
                                )(<Input />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                {...FormItemLayout}
                                label='司机电话'
                            >
                                {getFieldDecorator(
                                    'dirverPhone',
                                    {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入司机电话'
                                            }
                                        ]
                                    }
                                )(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ChangeCarInfoModal);
