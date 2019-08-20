import React, { Component } from 'react';
import { Table, Button, Popconfirm, Tabs, Notification } from 'antd';
import Card from '_platform/components/panels/Card';
import Addition from './Addition';
import Edit from './Edit';
const TabPane = Tabs.TabPane;

export default class Roles extends Component {
    constructor (props) {
        super(props);
        this.state = {
            additionVisible: false,
            additionType: '',
            editRole: '',
            editVisible: false
        };
    }

    columns = [
        {
            title: '角色ID',
            dataIndex: 'ID'
        },
        {
            title: '角色名称',
            dataIndex: 'RoleName'
        },
        {
            title: '描述',
            dataIndex: 'Remark'
        },
        {
            title: '操作',
            render: role => {
                return [
                    <a
                        key='0'
                        onClick={this.edit.bind(this, role)}
                        style={{ marginRight: '1em' }}
                    >
                        编辑
                    </a>,
                    <Popconfirm
                        key='1'
                        title='确认删除角色吗?'
                        okText='是'
                        cancelText='否'
                        onConfirm={this.remove.bind(this, role.ID)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                ];
            }
        }
    ];
    componentDidMount = async () => {
        const {
            actions: {
                getRoles
            },
            platform: {
                roles = []
            }
        } = this.props;
        if (!(roles && roles instanceof Array && roles.length > 0)) {
            await getRoles();
        }
    }
    // 编辑角色
    edit (role) {
        this.setState({
            editRole: role,
            editVisible: true
        });
    }
    // 取消新增窗口
    handleCloseEditModal = () => {
        this.setState({
            editVisible: false,
            editRole: ''
        });
    }
    // 删除角色
    remove = async (roleId) => {
        const {
            actions: {
                deleteRole,
                getRoles
            }
        } = this.props;
        let deleteData = await deleteRole({ id: roleId });
        if (deleteData && deleteData.code && deleteData.code === 1) {
            Notification.success({
                message: '角色删除成功',
                duration: 3
            });
            await getRoles();
        } else {
            Notification.error({
                message: '角色删除失败',
                duration: 3
            });
        }
    }

    // 新增窗口
    append (type) {
        this.setState({
            additionVisible: true,
            additionType: type
        });
    }
    // 取消新增窗口
    handleCloseAdditionModal = () => {
        this.setState({
            additionVisible: false,
            additionType: ''
        });
    }

    render () {
        const {
            platform: { roles = [] }
        } = this.props;
        const {
            additionVisible,
            editVisible
        } = this.state;
        let parentRoleType = [];
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0) {
                parentRoleType.push(role);
            }
        });
        return (
            <div>
                <Tabs defaultActiveKey='1'>
                    {
                        parentRoleType.map((type) => {
                            let systemRoles = roles.filter(role => role.ParentID === type.ID);
                            return (
                                <TabPane tab={type.RoleName} key={type.ID}>
                                    <Card
                                        title={type.RoleName}
                                        extra={
                                            <Button
                                                type='primary'
                                                ghost
                                                onClick={this.append.bind(this, type.ID)}
                                            >
                                                {`添加${type.RoleName}角色`}
                                            </Button>
                                        }
                                    >
                                        <Table
                                            size='middle'
                                            bordered
                                            style={{
                                                marginBottom: '10px',
                                                overflow: 'hidden'
                                            }}
                                            columns={this.columns}
                                            dataSource={systemRoles}
                                            rowKey='id'
                                        />
                                    </Card>
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
                {
                    additionVisible
                        ? <Addition
                            handleCloseAdditionModal={this.handleCloseAdditionModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                        : ''
                }
                {
                    editVisible
                        ? <Edit
                            handleCloseEditModal={this.handleCloseEditModal.bind(this)}
                            {...this.props}
                            {...this.state} />
                        : ''
                }
            </div>
        );
    }
}
