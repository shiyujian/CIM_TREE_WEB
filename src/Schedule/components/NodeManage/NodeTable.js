import React, { Component } from 'react';
import {
    Table,
    Form,
    Spin,
    Input,
    Button,
    Modal,
    notification,
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
            dataListAdd: [], // 新增表单列表
            dataListForm: [], // 表单列表
            dataList: [] // 节点列表
        };
        this.getNodefieldList = this.getNodefieldList.bind(this); // 查看节点表单
        this.getNodeList = this.getNodeList.bind(this); // 获取节点列表
        this.handleOk = this.handleOk.bind(this); // 添加表单
    }
    componentDidMount () {
        this.getNodeList(); // 获取节点列表
    }
    getNodeList (pro = {}) {
        const { getNodeList } = this.props.actions;
        getNodeList({}, {
            flowid: pro.flowID || '', // 流程ID
            name: '', // 节点名称
            type: '', // 节点类型
            status: '' // 节点状态
        }).then(rep => {
            this.setState({
                dataList: rep
            });
        });
    }
    getNodefieldList () {
        const { NodeID } = this.state;
        const { getNodefieldList } = this.props.actions;
        getNodefieldList({}, {
            nodeid: NodeID // 节点ID
        }).then(rep => {
            console.log('节点表单', rep);
            this.setState({
                dataListForm: rep
            });
        });
    }
    onSee (ID) {
        this.setState({
            visible: true,
            NodeID: ID
        }, () => {
            this.getNodefieldList();
        });
    }
    onDelete (ID) {
        const { deleteNode } = this.props.actions;
        deleteNode({
            ID
        }, {}).then(rep => {
            if (rep.code === 1) {
                notification.success({
                    message: '删除节点成功'
                });
                this.getNodeList();
            } else {
                notification.error({
                    message: '删除节点失败'
                });
            }
        });
    }
    onEdit (ID, Name) {
        console.log('编辑', ID, Name);
        this.setState({
            NodeID: ID,
            NodeName: Name,
            visibleAdd: true,
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
            }]
        });
    }
    handleOk () {
        const { postNodeform } = this.props.actions;
        const { validateFields } = this.props.form;
        const { NodeID, NodeName, dataListAdd } = this.state;
        let userID = getUser().ID;
        let params = [];
        dataListAdd.map(item => {
            if (item.FieldName) {
                params.push({
                    Creater: userID, // 创建人
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
        postNodeform({}, params).then(rep => {
            if (rep.code === 1) {
                notification.success({
                    message: '新增表单成功',
                    duration: 3
                });
                this.setState({
                    dataListAdd: []
                });
                this.handleCancel();
            }
        });
    }
    onSearch () {
        const { validateFields } = this.props.form;
        validateFields((err, values) => {
            if (!err) {
                let pro = {
                    flowID: values.flowID
                };
                this.getNodeList(pro);
            }
        });
    }
    render () {
        const { dataList, dataListForm, dataListAdd } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (<div>
            <div>
                <Form layout='inline'>
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
                        <Button onClick={this.onSearch.bind(this)}>查询</Button>
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
            <Modal
                width='650'
                title='查看'
                visible={this.state.visible}
                onCancel={this.handleCancel.bind(this)}
            >
                <Table
                    dataSource={dataListForm}
                    columns={this.columnsForm}
                />
            </Modal>
            <Modal
                width='650'
                title='添加节点表单'
                visible={this.state.visibleAdd}
                onCancel={this.handleCancel.bind(this)}
                onOk={this.handleOk.bind(this)}
            >
                <Table
                    dataSource={dataListAdd}
                    columns={this.columnsAdd}
                />
            </Modal>
        </div>);
    }
    handleCancel () {
        this.setState({
            visible: false,
            visibleAdd: false
        });
    }
    handleShowName (index, e) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.ShowName = e.target.value;
            }
        });
    }
    handleFieldName (index, e) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.FieldName = e.target.value;
            }
        });
    }
    handleShowType (index, value) {
        const { dataListAdd } = this.state;
        console.log('值', value);
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.ShowType = value;
            }
        });
    }
    handleFieldType (index, value) {
        const { dataListAdd } = this.state;
        dataListAdd.map((item, ind) => {
            if (ind === index) {
                item.FieldType = value;
            }
        });
    }
    columnsAdd = [
        {
            title: '显示名称',
            dataIndex: 'ShowName',
            render: (text, record, index) => {
                console.log(text, record);
                return <Input style={{ width: 100 }} onChange={this.handleShowName.bind(this, index)} />;
            }
        },
        {
            title: '字段名称',
            dataIndex: 'FieldName',
            render: (text, record, index) => {
                return <Input style={{ width: 100 }} onChange={this.handleFieldName.bind(this, index)} />;
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
                    <a onClick={this.onEdit.bind(this, record.ID, record.Name)} style={{marginLeft: 20}}>编辑</a>
                    <Popconfirm
                        title='你确定删除该节点吗？'
                        okText='是' cancelText='否'
                        onConfirm={this.onDelete.bind(this, record.ID)}
                    >
                        <a href='#' style={{marginLeft: 20}}>
                            删除
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
    columnsForm = [
        {
            title: '显示名称',
            dataIndex: 'ShowName'
        },
        {
            title: '字段名称',
            dataIndex: 'FieldName'
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
    onSeeForm (ID) {

    }
    onDeleteForm (ID) {
        const { deleteNodeform } = this.props.actions;
        deleteNodeform({
            ID
        }).then(rep => {

        });
    }
}
export default Form.create()(NodeTable);
