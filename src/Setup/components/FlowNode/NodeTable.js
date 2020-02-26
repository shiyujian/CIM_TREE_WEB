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
import ModalAddField from './ModalAddField';
import ModalAddForm from './ModalAddForm';
import ModalSee from './ModalSee';
const FormItem = Form.Item;
const { Option } = Select;
class NodeTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            NodeID: '', // 节点ID
            NodeName: '', // 节点名称
            showModalAddForm: false, // 节点表单新建
            showModalSee: false, // 查看
            showModalAddField: false, // 新增字段
            dataListAdd: [], // 节点表单
            dataList: [] // 节点列表
        };
        this.setDataListAdd = this.setDataListAdd.bind(this); // 设置
        this.onSearch = this.onSearch.bind(this); // 查询
        this.handleCancelAddForm = this.handleCancelAddForm.bind(this); // 取消
        this.handleCancelSee = this.handleCancelSee.bind(this); // 取消
        this.getNodeList = this.getNodeList.bind(this); // 获取节点列表
    }
    componentDidMount () {
        this.getNodeList(); // 获取节点列表
    }
    getNodeList (values = {}) {
        const { getNodeList } = this.props.actions;
        getNodeList({}, {
            flowid: values.flowID || '', // 流程ID
            name: values.nodeName || '', // 节点名称
            type: '', // 节点类型
            status: '' // 节点状态
        }).then(rep => {
            this.setState({
                dataList: rep
            });
        });
    }
    onSearch () {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
                this.getNodeList(values);
            }
        });
    }
    onSee (ID) {
        this.setState({
            showModalSee: true,
            NodeID: ID
        });
    }
    onDelete (ID) {
        const { deleteNode } = this.props.actions;
        deleteNode({
            ID
        }, {}).then(rep => {
            if (rep.code === 1) {
                Notification.success({
                    message: '删除节点成功'
                });
                this.getNodeList();
            } else {
                Notification.error({
                    message: '删除节点失败'
                });
            }
        });
    }
    onAddForm (ID, Name) {
        this.setState({
            NodeID: ID,
            NodeName: Name,
            showModalAddForm: true
        });
    }
    handleCancelAddForm () {
        this.setState({
            showModalAddForm: false
        });
    }
    setDataListAdd (dataListAdd) {
        this.setState({
            dataListAdd: dataListAdd
        });
    }
    render () {
        const {
            NodeName,
            NodeID,
            showModalSee,
            showModalAddForm,
            showModalAddField,
            dataList
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (<div>
            <div>
                <Form layout='inline'>
                    <FormItem
                        label='节点名称'
                    >
                        {getFieldDecorator('nodeName', {
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label='流程ID'
                    >
                        {getFieldDecorator('flowID', {
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                    >
                        <Button onClick={this.onSearch}>查询</Button>
                    </FormItem>
                </Form>
            </div>
            <Spin tip='Loading...' spinning={false}>
                <Table
                    rowKey='ID'
                    dataSource={dataList}
                    columns={this.columns}
                />
            </Spin>
            {
                showModalSee ? <ModalSee
                    showModal={showModalSee}
                    handleCancel={this.handleCancelSee}
                    NodeID={NodeID}
                    NodeName={NodeName}
                    {...this.props}
                /> : ''
            }
            {
                showModalAddForm ? <ModalAddForm
                    showModal={showModalAddForm}
                    handleCancel={this.handleCancelAddForm}
                    setDataListAdd={this.setDataListAdd}
                    NodeID={NodeID}
                    NodeName={NodeName}
                    {...this.props}
                /> : ''
            }
            {
                showModalAddField ? <ModalAddField
                    showModal={showModalAddField}
                    {...this.props}
                /> : ''
            }
        </div>);
    }
    handleCancelSee () {
        this.setState({
            showModalSee: false
        });
    }
    onAddField (nodeID, nodeName) {
        this.setState({
            nodeID,
            nodeName,
            showModalAddField: true
        });
    }
    onSeeForm (ID) {

    }
    onDeleteForm (ID) {
        const { deleteNodeform } = this.props.actions;
        deleteNodeform({
            ID
        }).then(rep => {
            if (rep && rep.code === 1) {
                Notification.success({
                    message: '删除成功'
                });
            } else {
                Notification.error({
                    message: `删除失败, ${rep && rep.msg}`
                });
            }
        });
    }
    columns = [
        {
            title: '流程名称',
            dataIndex: 'FlowName'
        },
        {
            title: '流程ID',
            dataIndex: 'FlowID'
        },
        {
            title: '节点名称',
            dataIndex: 'Name'
        },
        {
            title: '节点ID',
            dataIndex: 'ID'
        },
        {
            title: '节点类型',
            dataIndex: 'NodeType',
            render: (text, record, index) => {
                let str = '';
                NodeType.map(item => {
                    if (item.value === text) {
                        str = item.label;
                    }
                });
                return str;
            }
        },
        {
            title: '节点状态',
            dataIndex: 'Status',
            render: (text, record, index) => {
                return text === 1 ? '启用' : '禁用';
            }
        },
        {
            title: '操作',
            dataIndex: 'active',
            width: '20%',
            render: (text, record) => {
                return (<div>
                    <a onClick={this.onSee.bind(this, record.ID)}>查看</a>
                    <a onClick={this.onAddForm.bind(this, record.ID, record.Name)} style={{marginLeft: 20}}>新增表单</a>
                    {/* <a onClick={this.onAddField.bind(this, record.ID, record.Name)} style={{marginLeft: 20}}>新增字段</a> */}
                    <Popconfirm
                        title='你确定删除该节点吗？'
                        okText='是' cancelText='否'
                        onConfirm={this.onDelete.bind(this, record.ID)}
                    >
                        <a href='#' style={{marginLeft: 20}}>
                            删除节点
                        </a>
                    </Popconfirm>
                    <Popconfirm
                        title='你确定删除该节点的表单吗？'
                        okText='是' cancelText='否'
                        onConfirm={this.onDeleteForm.bind(this, record.ID)}
                    >
                        <a href='#' style={{marginLeft: 20}}>
                            删除表单
                        </a>
                    </Popconfirm>
                </div>);
            }
        }
    ];
}
export default Form.create()(NodeTable);
