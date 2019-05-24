import React, { Component, Children } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select,
    Notification,
    Button,
    Popconfirm
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
        const {
            currentRecord,
            form: {
                setFieldsValue
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let section = (currentRecord && currentRecord.Section) || '';
            let project = '';
            if (section) {
                let sectionList = section.split('-');
                if (sectionList && sectionList instanceof Array && sectionList.length > 0) {
                    project = sectionList[0];
                    let treeList = tree.bigTreeList;
                    let sectionsList = [];
                    if (project) {
                        treeList.map((treeData) => {
                            if (project === treeData.No) {
                                sectionsList = treeData.children;
                            }
                        });
                    }
                    this.setState({
                        sectionsList
                    });
                }
            }
            // 防止出现数值为0 无法初始化的问题
            let isShrub = '';
            if (currentRecord && currentRecord.IsShrub) {
                isShrub = currentRecord.IsShrub;
            } else if (currentRecord.IsShrub === 0) {
                isShrub = 0;
            } else {
                isShrub = '';
            }
            // 防止出现数值为0 无法初始化的问题
            let status = '';
            if (currentRecord && currentRecord.Status) {
                status = currentRecord.Status;
            } else if (currentRecord.Status === 0) {
                status = 0;
            } else {
                status = '';
            }
            setFieldsValue({
                carNumber: (currentRecord && currentRecord.LicensePlate) || '',
                status: status,
                project: project,
                section: section,
                isShrub: isShrub,
                treeStandards: (currentRecord && currentRecord.Standard) || '',
                totalNumber: (currentRecord && currentRecord.NurseryNum) || '',
                dirverName: (currentRecord && currentRecord.Driver) || '',
                dirverPhone: (currentRecord && currentRecord.DriverPhone) || ''
            });
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    // 修改车辆信息
    handleChangeCarInfoOk = async () => {
        const {
            form: {
                validateFields
            },
            actions: {
                putChangCarPackInfo
            },
            currentRecord
        } = this.props;
        try {
            validateFields(async (err, values) => {
                console.log('values', values);
                if (!err) {
                    let postData = {
                        'Status': values.status,
                        'LicensePlate': values.carNumber,
                        'Section': values.section,
                        'IsShrub': values.isShrub,
                        'Standard': values.treeStandards,
                        'NurseryNum': values.totalNumber,
                        'Driver': values.dirverName,
                        'DriverPhone': values.dirverPhone,
                        'ID': currentRecord.ID
                    };
                    console.log('postData', postData);
                    let data = await putChangCarPackInfo({}, postData);
                    console.log('data', data);
                    if (data && data.code === 1) {
                        Notification.success({
                            message: '修改车辆信息成功',
                            duration: 3
                        });
                        await this.props.onEditCarModalOk();
                    } else {
                        Notification.error({
                            message: '修改车辆信息失败',
                            duration: 3
                        });
                    }
                }
            });
        } catch (e) {
            console.log('handleChangeCarInfoOk', e);
        }
    }
    // 关闭修改车辆信息弹窗
    handleChangeCarInfoCancel = async () => {
        this.props.onEditCarModalCancel();
    }
    projectSelect = (value) => {
        const {
            platform: { tree = {} },
            form: {
                setFieldsValue
            }
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
        setFieldsValue({
            section: ''
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
    // 自定义校验总数
    checkTotalNumber = async (rule, value, callback) => {
        if (value) {
            let reg = /^[1-9]\d*$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                if (value > 0) {
                    callback();
                } else {
                    callback(`请输入数字`);
                }
            } else {
                callback(`请输入数字`);
            }
        } else {
            callback();
        }
    }
    render () {
        const {
            form: { getFieldDecorator },
            platform: { tree = {} },
            currentRecord
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
                footer={null}
                onCancel={this.handleChangeCarInfoCancel.bind(this)}
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
                                        <Option key={'0'} value={-1} title={'打包'}>
                                        打包
                                        </Option>
                                        <Option key={'1'} value={0} title={'施工提交'}>
                                        施工提交
                                        </Option>
                                        <Option key={'-1'} value={1} title={'监理合格'}>
                                        监理合格
                                        </Option>
                                        <Option key={'-1'} value={2} title={'监理退苗'}>
                                        监理退苗
                                        </Option>
                                        <Option key={'-1'} value={3} title={'监理合格施工同意'}>
                                        监理合格施工同意
                                        </Option>
                                        <Option key={'-1'} value={4} title={'监理合格施工不同意'}>
                                        监理合格施工不同意
                                        </Option>
                                        <Option key={'-1'} value={5} title={'监理退苗施工同意'}>
                                        监理退苗施工同意
                                        </Option>
                                        <Option key={'-1'} value={6} title={'监理退苗施工不同意'}>
                                        监理退苗施工不同意
                                        </Option>
                                        <Option key={'-1'} value={7} title={'业主合格'}>
                                        业主合格
                                        </Option>
                                        <Option key={'-1'} value={8} title={'业主退苗'}>
                                        业主退苗
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
                                        'isShrub',
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
                                                },
                                                {
                                                    validator: this.checkTotalNumber
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
                                onClick={this.handleChangeCarInfoCancel.bind(this)}
                            >
                            取消
                            </Button>
                            {
                                currentRecord && currentRecord.LicensePlate
                                    ? <Popconfirm
                                        title={`确定要修改 ${currentRecord.LicensePlate}(${currentRecord.Section}) 的车辆信息么`}
                                        onConfirm={this.handleChangeCarInfoOk.bind(this)}
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
                                    : <Button
                                        disabled
                                        style={{marginLeft: 30}}
                                    >
                                        确定
                                    </Button>
                            }

                        </div>
                    </Row>
                </div>

            </Modal>
        );
    }
}

export default Form.create()(ChangeCarInfoModal);
