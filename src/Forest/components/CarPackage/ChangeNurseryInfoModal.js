import React, { Component } from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Modal,
    Select,
    Radio,
    Popconfirm,
    Button,
    Notification
} from 'antd';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class ChangeNurseryInfoModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionsList: [],
            nurseryID: '',
            supplierID: ''
        };
    }
    componentDidMount = async () => {
        const {
            form: {
                setFieldsValue
            },
            platform: {
                tree = {}
            },
            example
        } = this.props;
        try {
            if (example) {
                let section = (example && example.BD) || '';
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
                let isPack = '';
                if (example && example.IsPack) {
                    isPack = example.IsPack;
                } else if (example.IsPack === 0) {
                    isPack = 0;
                } else {
                    isPack = '';
                }
                setFieldsValue({
                    nurseryName: (example && example.NurseryName) || '',
                    supplierName: (example && example.Factory) || '',
                    place: (example && example.TreePlace) || '',
                    treeTypeNursery: (example && example.TreeType) || '',
                    project: project,
                    section: section,
                    isPack: isPack,
                    GD: '',
                    GF: '',
                    XJ: '',
                    DJ: '',
                    TQZJ: '',
                    TQHD: ''
                });
                this.setState({
                    nurseryID: (example && example.NurseryID) || '',
                    supplierID: (example && example.SupplierID) || ''
                });
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    // 修改苗圃信息
    handleChangeNurseryInfoOk = () => {
        const {
            form: {
                validateFields
            },
            actions: {
                putChangeNurseryInfoInCar
            },
            selectedRowSXM
        } = this.props;
        const {
            nurseryID,
            supplierID
        } = this.state;
        validateFields(async (err, values) => {
            console.log('values', values);
            if (!err) {
                let postData = {
                    'XJ': values.XJ,
                    'GD': values.GD,
                    'GF': values.GF,
                    'DJ': values.DJ,
                    'TQZJ': values.TQZJ,
                    'TQHD': values.TQHD,
                    'TreeType': values.treeTypeNursery,
                    'NurseryName': values.nurseryName,
                    'Factory': values.supplierName,
                    'TreePlace': values.place,
                    'NurseryID': nurseryID,
                    'SupplierID': supplierID,
                    'BD': values.section,
                    'IsPack': values.isPack,
                    'ZZBM': selectedRowSXM
                };
                console.log('postData', postData);
                let data = await putChangeNurseryInfoInCar({}, postData);
                console.log('data', data);
                if (data && data.code === 1) {
                    Notification.success({
                        message: '修改苗圃信息成功',
                        duration: 3
                    });
                    await this.props.onChangeNurseryInfoModalOk();
                } else {
                    if (data.msg === '修改前后树种的苗圃测量参数不一致，不允许进行树种修改！') {
                        Notification.error({
                            message: '修改前后树种的苗圃测量参数不一致，不允许进行树种修改！',
                            duration: 3
                        });
                    } else {
                        Notification.error({
                            message: '修改苗圃信息失败',
                            duration: 3
                        });
                    }
                }
            }
        });
    }
    handleChangeNurseryInfoCancel = () => {
        this.props.onChangeNurseryInfoModalCancel();
    }
    // 选择项目，获取标段数据
    projectSelect = async (value) => {
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
    // 选择苗圃，设置苗圃ID
    handleNurserySelect = async (value, info) => {
        const {
            nurseryList,
            form: {
                setFieldsValue
            }
        } = this.props;
        let nurseryDetail = '';
        nurseryList.map((nursery) => {
            if (nursery.ID === value) {
                nurseryDetail = nursery;
            }
        });
        if (nurseryDetail) {
            setFieldsValue({
                place: nurseryDetail.Address || ''
            });
        }
        this.setState({
            nurseryID: value
        });
    }
    // 选择供应商，设置供应商ID
    handleSupplierSelect = async (value, info) => {
        console.log('info', info);
        this.setState({
            supplierID: value
        });
    }
    render () {
        const {
            form: { getFieldDecorator },
            nurseryList = [],
            supplierList = [],
            treetypes = [],
            platform: { tree = {} },
            selectedRowSXM
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
                width={1100}
                title='修改信息'
                visible
                maskClosable={false}
                footer={null}
                onCancel={this.handleChangeNurseryInfoCancel.bind(this)}
            >
                <div>
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
                                        )(<Select
                                            onSelect={this.handleNurserySelect.bind(this)}
                                            allowClear
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
                                        )(<Select
                                            onSelect={this.handleSupplierSelect.bind(this)}
                                            allowClear
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
                                            'treeTypeNursery',
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
                                            'isPack',
                                            {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择状态'
                                                    }
                                                ]
                                            }
                                        )(<Select>
                                            <Option key={'未打包'} value={0} title={'未打包'}>
                                            未打包
                                            </Option>
                                            <Option key={'已打包'} value={1} title={'已打包'}>
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
                                            'GD',
                                            {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择高度'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
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
                                                        required: false,
                                                        message: '请选择冠幅'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
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
                                                        required: false,
                                                        message: '请选择胸径'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
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
                                                        required: false,
                                                        message: '请选择地径'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
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
                                                        required: false,
                                                        message: '请选择土球直径'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
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
                                                        required: false,
                                                        message: '请选择土球厚度'
                                                    }
                                                ]
                                            }
                                        )(<RadioGroup>
                                            <Radio value={'/100'}>/100</Radio>
                                            <Radio value={'/10'}>/10</Radio>
                                            <Radio value={''}>1</Radio>
                                            <Radio value={'*10'}>x10</Radio>
                                            <Radio value={'*100'}>x100</Radio>
                                        </RadioGroup>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                    <Row style={{marginTop: 20}}>
                        <div style={{float: 'right'}}>
                            <Button
                                type='primary'
                                style={{marginLeft: 30}}
                                onClick={this.handleChangeNurseryInfoCancel.bind(this)}
                            >
                            取消
                            </Button>
                            {
                                selectedRowSXM && selectedRowSXM instanceof Array && selectedRowSXM.length > 0
                                    ? <Popconfirm
                                        title={`此次修改共有 ${selectedRowSXM.length} 条信息产生变化，确定修改么`}
                                        onConfirm={this.handleChangeNurseryInfoOk.bind(this)}
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

export default Form.create()(ChangeNurseryInfoModal);
