import React, { Component } from 'react';
import {
    Button,
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select,
    Table,
    DatePicker,
    Notification,
    Radio,
    Popconfirm,
    InputNumber
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;

class AddCarPack extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            loading: false,
            dataSource: [],
            stime: moment().format('YYYY-MM-DD hh:mm:ss'),
            pagination: {},
            dataChecked: '',
            selectRecort: ''
        };
    }
    // 新增车辆包
    handleAddCarPackOk = async () => {
        const {
            form: {
                validateFields
            },
            actions: {
                postAddCarPack
            },
            currentRecord
        } = this.props;
        try {
            validateFields(async (err, values) => {
                console.log('values', values);
                if (!err) {
                    let postData = {
                        'Inputer': currentRecord.Inputer,
                        'LicensePlate': values.addCarNumber,
                        'LiferTime': values.addLiferTime && moment(values.addLiferTime._d).format('YYYY-MM-DD hh:mm:ss'),
                        'IsShrub': values.addIsShrub,
                        'Section': values.addSection,
                        'Standard': values.addTreeStandards,
                        'Driver': values.addDirverName,
                        'DriverPhone': values.addDirverPhone
                    };
                    console.log('postData', postData);
                    let rst = await postAddCarPack({}, postData);
                    if (rst && rst.code && rst.code === 1) {
                        Notification.success({
                            message: '新增车辆包成功',
                            duration: 3
                        });
                        await this.props.handleAddCarPackCancel();
                    } else if (rst && rst.msg && rst.msg === '打包车辆已存在！') {
                        Notification.error({
                            message: '打包车辆已存在！',
                            duration: 3
                        });
                    } else {
                        Notification.error({
                            message: '新增车辆包失败',
                            duration: 3
                        });
                    }
                }
            });
        } catch (e) {
            console.log('handleChangeCarInfoOk', e);
        }
    }
    handleAddCarPackCancel = () => {
        this.props.handleAddCarPackCancel();
    }
    projectSelect = (value) => {
        const {
            platform: { tree = {} },
            form: {
                setFieldsValue
            }
        } = this.props;
        let treeList = tree.bigTreeList;
        let sectionsList = [];
        if (value) {
            treeList.map((treeData) => {
                if (value === treeData.No) {
                    sectionsList = treeData.children;
                }
            });
        }
        setFieldsValue({
            addProject: value,
            addSection: ''
        });
        this.setState({
            sectionsList
        });
    }
    // 自定义校验手机号
    checkDirverPhone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[1]([3-9])[0-9]{9}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入正确的手机号`);
                }
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
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
                width={1000}
                title='选择车辆'
                visible
                maskClosable={false}
                footer={null}
                onCancel={this.handleAddCarPackCancel.bind(this)}
            >
                <div>
                    <Form>
                        <Row>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='车牌号'
                                >
                                    {getFieldDecorator(
                                        'addCarNumber',
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
                                    label='起苗时间'
                                >
                                    {getFieldDecorator(
                                        'addLiferTime',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择起苗时间'
                                                }
                                            ]
                                        }
                                    )(<DatePicker
                                        style={{
                                            verticalAlign: 'middle',
                                            width: '100%'
                                        }}
                                        placeholder='请选择起苗时间'
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format={'YYYY-MM-DD HH:mm:ss'}
                                    />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem
                                    {...FormItemLayout}
                                    label='项目'
                                >
                                    {getFieldDecorator(
                                        'addProject',
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
                                        'addSection',
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
                                        'addIsShrub',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择苗木类型'
                                                }
                                            ]
                                        }
                                    )(<Select>
                                        <Option key={'地被'} value={1} title={'地被'}>
                                        地被
                                        </Option>
                                        <Option key={'乔灌'} value={0} title={'乔灌'}>
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
                                        'addTreeStandards',
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
                                    label='司机姓名'
                                >
                                    {getFieldDecorator(
                                        'addDirverName',
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
                                        'addDirverPhone',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入司机电话'
                                                },
                                                {
                                                    validator: this.checkDirverPhone
                                                }
                                            ]
                                        }
                                    )(<Input />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row style={{marginTop: 20}}>
                        <div style={{float: 'right'}}>
                            <Button
                                type='primary'
                                style={{marginLeft: 30}}
                                onClick={this.handleAddCarPackCancel.bind(this)}
                            >
                            取消
                            </Button>
                            <Popconfirm
                                title={
                                    <p>{`确定创建此车辆包吗？`}</p>
                                }
                                onConfirm={this.handleAddCarPackOk.bind(this)}
                                okText='确认'
                                cancelText='取消'
                            >
                                <Button
                                    type='primary'
                                    style={{marginLeft: 30}}
                                >
                                确定
                                </Button>
                            </Popconfirm>

                        </div>
                    </Row>
                </div>
            </Modal>
        );
    }
}

export default Form.create()(AddCarPack);
