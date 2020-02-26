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
const FormItem = Form.Item;
const { Option } = Select;
class NodeTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataListForm: [] // 表单列表
        };
        this.getNodefieldList = this.getNodefieldList.bind(this); // 查看节点表单
        this.handleCancel = this.handleCancel.bind(this); // 取消
    }
    componentDidMount () {
        this.getNodefieldList();
    }
    getNodefieldList () {
        const {
            NodeID,
            actions: { getNodefieldList }
        } = this.props;
        getNodefieldList({}, {
            nodeid: NodeID // 节点ID
        }).then(rep => {
            this.setState({
                dataListForm: rep
            });
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    render () {
        const {
            dataListForm
        } = this.state;
        return <div>
            <Modal
                width='650'
                title='查看'
                okButtonProps={{disabled: true}}
                visible={this.props.showModal}
                onCancel={this.handleCancel}
            >
                <Table
                    dataSource={dataListForm}
                    columns={this.columnsForm}
                />
            </Modal>
        </div>;
    }
    onDeleteField () {

    }
    columnsForm = [
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
        },
        {
            title: '操作',
            dataIndex: 'active',
            width: '200',
            render: (text, record) => {
                return (<div>
                    {/* <a onClick={this.onEditForm.bind(this, record.ID)}>编辑</a> */}
                    {/* <a onClick={this.onDeleteField.bind(this, record.ID)}>删除</a> */}
                </div>);
            }
        }
    ];
}
export default Form.create()(NodeTable);
