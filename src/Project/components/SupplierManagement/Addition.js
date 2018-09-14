import React, { Component } from 'react';
import { FOREST_API } from '../../../_platform/api';

import {
    Icon,
    Form,
    Input,
    Button,
    Upload,
    Row,
    Col,
    Modal,
    Table,
    notification,
    Divider,
    message,
    Popconfirm
} from 'antd';
const FormItem = Form.Item;

const layoutT = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

class Addition extends Component {
    constructor (props) {
        super(props);
        this.state = {
            addVisible: false,
            seeVisible: false,
            newKey: Math.random()
        };
        this.toAdd = this.toAdd.bind(this); // 新增苗圃弹框
        this.toSave = this.toSave.bind(this); // 新增苗圃
        this.seeBlackList = this.seeBlackList.bind(this); // 查看黑名单弹框
        this.handleCancel = this.handleCancel.bind(this); // 隐藏弹框
        this.checkPhone = this.checkPhone.bind(this); // 校验手机号
        this.checkCardNo = this.checkCardNo.bind(this); // 校验身份证
    }

    export () {}

    render () {
        const { addVisible = false, seeVisible = false } = this.state;

        const {
            form: { getFieldDecorator }
        } = this.props;

        return (
            <div className='supplier-additon'>
                <div style={{ float: 'right', marginBottom: 12 }}>
                    <Button type='primary' onClick={this.see.bind(this)}>
                        查看黑名单
                    </Button>
                    <Button
                        type='primary'
                        style={{ marginLeft: '5px' }}
                        onClick={this.add.bind(this)}
                    >
                        新增苗圃
                    </Button>
                </div>
                <Modal
                    title='查看黑名单'
                    width='80%'
                    visible={seeVisible}
                    onOk={this.save1.bind(this)}
                    //    key={this.state.newKey}
                    onCancel={this.cancel1.bind(this)}
                >
                    <Button
                        type='primary'
                        style={{ marginBottom: '5px' }}
                        onClick={this.export.bind(this)}
                    >
                        导出表格
                    </Button>
                    <Table
                        // dataSource={arrList}
                        columns={this.columns}
                        // expandedRowRender={record=> <p>{111111111}</p>}
                        bordered
                    />
                </Modal>
                <Modal
                    title='新增苗圃'
                    width={920}
                    visible={addVisible}
                    onOk={this.save.bind(this)}
                    //    key={this.state.newKey}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            {...Addition.layoutT}
                                            label='供应商:'
                                        >
                                            {getFieldDecorator('SFactory', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入供应商'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入供应商' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Addition.layoutT}
                                            label='苗圃名称:'
                                        >
                                            {getFieldDecorator('SNurseryName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入苗圃名称'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入苗圃名称' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Addition.layoutT}
                                            label='行政区划:'
                                        >
                                            {getFieldDecorator('SRegionName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入行政区划'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入行政区划' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Addition.layoutT}
                                            label='行政区划编码:'
                                        >
                                            {getFieldDecorator('SRegionCode', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            '请输入行政区划编码'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入行政区划编码' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...Addition.layoutT}
                                            label='产地:'
                                        >
                                            {getFieldDecorator('STreePlace', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入产地'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入产地' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }

    add () {
        this.setState({
            // newKey: Math.random(),
            addVisible: true
        });
    }
    see () {
        this.setState({
            // newKey: Math.random(),
            seeVisible: true
        });
    }
    cancel1 () {
        this.setState({
            seeVisible: false
        });
    }
    cancel () {
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({
            SFactory: undefined,
            SNurseryName: undefined,
            SRegionCode: undefined,
            SRegionName: undefined,
            STreePlace: undefined
        });

        this.setState({
            addVisible: false
        });
    }
    save1 () {
        this.setState({
            seeVisible: false
        });
    }
    save () {
        const {
            actions: { postNursery, getNurseryList },
            form: { setFieldsValue }
        } = this.props;
        let me = this;
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                let postdata = {
                    Factory: values.SFactory,
                    NurseryName: values.SNurseryName,
                    RegionCode: values.SRegionCode,
                    RegionName: values.SRegionName,
                    TreePlace: values.STreePlace
                };
                postNursery({}, postdata).then(rst => {
                    console.log('rst', rst);
                    if (rst && rst.code) {
                        if (rst.msg && rst.msg === '苗圃已存在') {
                            notification.error({
                                message: '名称已存在',
                                duration: 3
                            });
                        } else {
                            notification.success({
                                message: '新增苗圃成功',
                                duration: 2
                            });
                            getNurseryList();
                            setFieldsValue({
                                SFactory: undefined,
                                SNurseryName: undefined,
                                SRegionCode: undefined,
                                SRegionName: undefined,
                                STreePlace: undefined
                            });
                            me.setState({
                                addVisible: false
                            });
                        }
                    } else {
                        notification.error({
                            message: '新增苗圃失败',
                            duration: 2
                        });
                    }
                });
            }
        });
    }
    columns = [
        // {
        // 	title: '序号',
        // 	key: 'key',
        // 	dataIndex: 'key',
        // },
        {
            title: '苗圃ID',
            key: 'ID',
            width: '6%',
            dataIndex: 'ID'
        },
        {
            title: '供应商',
            key: 'Factory',
            width: '20%',
            dataIndex: 'Factory'
        },
        {
            title: '苗圃名称',
            key: 'NurseryName',
            width: '16%',
            dataIndex: 'NurseryName'
        },
        {
            title: '行政区划编码',
            key: 'RegionCode',
            width: '10%',
            dataIndex: 'RegionCode'
        },
        {
            title: '行政区划',
            key: 'RegionName',
            width: '16%',
            dataIndex: 'RegionName'
        },
        {
            title: '产地',
            key: 'TreePlace',
            width: '16%',
            dataIndex: 'TreePlace'
        },
        {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            render: (text, record, index) => {
                if (record.ID) {
                    return (
                        <div>
                            <a onClick={this.edite.bind(this, record)}>修改</a>
                            <Divider type='vertical' />
                            <Popconfirm
                                title='是否真的要删除该苗圃?'
                                onConfirm={this.delet.bind(this, record)}
                                okText='是'
                                cancelText='否'
                            >
                                <a>删除</a>
                            </Popconfirm>
                            <Divider type='vertical' />
                            <a>加入黑名单</a>
                        </div>
                    );
                }
            }
        }
    ];
}

export default Form.create()(Addition);
