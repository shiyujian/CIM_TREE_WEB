import React, { Component } from 'react';
import {
    Table,
    Form,
    Spin,
    Input,
    Button,
    Modal,
    Notification,
    Popconfirm,
    Select } from 'antd';
import { getUser } from '_platform/auth';
import { NodeType } from '_platform/api';
const FormItem = Form.Item;
const { Option } = Select;
class NodeTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataListAdd: [{
                key: 1,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 2,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 3,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 4,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 5,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 6,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 7,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 8,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 9,
                FieldType: 0,
                ShowType: 'Input'
            }, {
                key: 10,
                FieldType: 0,
                ShowType: 'Input'
            }] // 新增表单列表
        };
        this.handleOk = this.handleOk.bind(this); // 添加表单
        this.handleCancel = this.handleCancel.bind(this); // 取消
    }
    componentDidMount () {
        if (this.props && this.props.dataListAdd && this.props.dataListAdd.length) {
            // 快速添加重复的
            this.setState({
                dataListAdd: this.props.dataListAdd
            });
        }
    }
    handleOk () {
        const {
            NodeID,
            NodeName,
            actions: { postNodeform }
        } = this.props;
        const { dataListAdd } = this.state;
        let params = [];
        dataListAdd.map(item => {
            if (item.FieldName) {
                params.push({
                    Creater: getUser().ID, // 创建人
                    NodeName: NodeName, // 节点名称
                    NodeID: NodeID, // 节点ID
                    FieldName: item.FieldName, // 字段名称
                    FieldOptions: '', // 字段列表值
                    FieldType: item.FieldType, // 存储方式
                    ShowName: item.ShowName, // 显示名称
                    ShowType: item.ShowType, // 显示类型
                    DefaultValue: '' // 默认值
                });
            }
        });
        console.log('提交', params);
        this.props.setDataListAdd(dataListAdd);
        postNodeform({}, params).then(rep => {
            if (rep && rep.code === 1) {
                Notification.success({
                    message: '新增表单成功',
                    duration: 3
                });
                this.props.handleCancel();
            } else {
                Notification.error({
                    message: `操作失败,${rep && rep.msg}`,
                    duration: 3
                });
            }
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    render () {
        const {
            dataListAdd
        } = this.state;
        return <div>
            <Modal
                width='650'
                title='添加节点表单'
                visible={this.props.showModal}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
            >
                <Table
                    rowKey='key'
                    dataSource={dataListAdd}
                    columns={this.columnsAdd}
                />
            </Modal>
        </div>;
    }
    handleFieldName (index, e) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.FieldName = e.target.value;
            }
        });
        this.setState({
            dataListAdd
        });
    }
    handleShowName (index, e) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.ShowName = e.target.value;
            }
        });
        this.setState({
            dataListAdd
        });
    }
    handleShowType (index, value) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.ShowType = value;
            }
        });
        this.setState({
            dataListAdd
        });
    }
    handleFieldType (index, value) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.FieldType = value;
            }
        });
        this.setState({
            dataListAdd
        });
    }
    columnsAdd = [
        {
            title: '字段名称',
            dataIndex: 'FieldName',
            render: (text, record, index) => {
                return <Input style={{ width: 100 }} onChange={this.handleFieldName.bind(this, index)} />;
            }
        },
        {
            title: '显示名称',
            dataIndex: 'ShowName',
            render: (text, record, index) => {
                return <Input style={{ width: 100 }} onChange={this.handleShowName.bind(this, index)} />;
            }
        },
        {
            title: '显示类型',
            dataIndex: 'ShowType',
            render: (text, record, index) => {
                return <Select defaultValue='Input' style={{ width: 100 }} onChange={this.handleShowType.bind(this, index)}>
                    <Option value='Input' key='Input'>Input</Option>
                    <Option value='Select' key='Select'>Select</Option>
                </Select>;
            }
        },
        {
            title: '存储方式',
            dataIndex: 'FieldType',
            render: (text, record, index) => {
                return <Select defaultValue={0} style={{ width: 100 }} onChange={this.handleFieldType.bind(this, index)}>
                    <Option value={0} key='varchar'>varchar</Option>
                    <Option value={2} key='longtext'>longtext</Option>
                </Select>;
            }
        }
    ];
}
export default Form.create()(NodeTable);
