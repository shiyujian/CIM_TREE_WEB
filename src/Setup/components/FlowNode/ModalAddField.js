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
            NodeID: '', // 节点ID
            NodeName: '', // 节点名称
            visibleAdd: false,
            visible: false,
            dataList: [] // 新增节点列表
        };
        this.handleOk = this.handleOk.bind(this); // 添加表单
    }
    componentDidMount () {
        this.setState({
            dataList: [{
                key: 1,
                FieldType: 0,
                ShowType: 'Input'
            }]
        });
    }
    handleOk () {
        const {
            actions: { postNodefield }
        } = this.props;
        let param = {
            Creater: getUser().ID,
            DefaultValue: getUser().ID,
            FieldName: getUser().ID,
            FieldOptions: getUser().ID,
            FieldType: getUser().ID,
            NodeID: getUser().ID,
            NodeName: getUser().ID,
            ShowName: getUser().ID,
            ShowType: 'Input'
        };
        postNodefield({}, param).then(rep => {

        });
    }
    handleCancel () {

    }
    render () {
        const {
            dataList
        } = this.state;
        return <div>
            hh
            <Modal
                width='650'
                title='添加节点表单'
                visible={this.props.showModal}
                onCancel={this.handleCancel.bind(this)}
                onOk={this.handleOk.bind(this)}
            >
                <Table
                    dataSource={dataList}
                    columns={this.columnsAdd}
                />
            </Modal>
        </div>;
    }
    dataList = [
        {
            title: '字段名称',
            dataIndex: 'FieldName'
        },
        {
            title: '显示名称',
            dataIndex: 'ShowName'
        },
        {
            title: '显示类型',
            dataIndex: 'ShowType'
        },
        {
            title: '存储方式',
            dataIndex: 'FieldType'
        }
    ];
}
export default Form.create()(NodeTable);
