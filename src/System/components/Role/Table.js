import React, { Component } from 'react';
import { Table, Button, Popconfirm, Tabs } from 'antd';
import Card from '_platform/components/panels/Card';
import { getUser } from '_platform/auth';
import Member from './Member';
export default class Roles extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userLogin: ''
        };
    }
    static propTypes = {};

    componentDidMount () {
        const {
            actions: {
                getRoles
            }
        } = this.props;
        getRoles();
        let user = getUser();
        if (user && user.username && user.username === 'admin') {
            this.setState({
                userLogin: 'admin'
            });
        } else {
            this.setState({
                userLogin: 'common'
            });
        }
    }

    append (type) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('visible', true);
        changeAdditionField('type', type);
        changeAdditionField('role', undefined);
    }

    edit (role) {
        const {
            actions: { resetAdditionField }
        } = this.props;
        resetAdditionField({ ...role, visible: true, type: role.grouptype });
    }

    remove (roleId) {
        const {
            actions: { deleteRole, getRoles }
        } = this.props;
        deleteRole({ id: roleId }).then(rst => {
            getRoles();
        });
    }

    columns = [
        {
            title: '角色ID',
            dataIndex: 'id'
        },
        {
            title: '角色名称',
            dataIndex: 'name'
        },
        {
            title: '描述',
            dataIndex: 'description'
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
                        onConfirm={this.remove.bind(this, role.id)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                ];
            }
        },
        {
            title: '关联用户',
            render: role => {
                return (
                    <a onClick={this.associate.bind(this, role)}>关联用户</a>
                );
            }
        }
    ];

    associate = async (role, event) => {
        event.preventDefault();
        const {
            actions: {
                changeMemberField
            }
        } = this.props;
        await changeMemberField('role', role);
        await changeMemberField('visible', true);
    }

    render () {
        const {
            platform: { roles = [] },
            member: { visible = false } = {}
        } = this.props;
        let systemRoles;
        if (this.state.userLogin === 'admin') {
            systemRoles = roles.filter(role => role.grouptype === 0);
        } else {
            systemRoles = roles.filter(role => {
                if (role.grouptype === 0 && role.name !== '超级管理员') {
                    return true;
                }
            });
        }
        const projectRoles = roles.filter(role => role.grouptype === 1);
        const professionRoles = roles.filter(role => role.grouptype === 2);
        const departmentRoles = roles.filter(role => role.grouptype === 3);
        const curingRoles = roles.filter(role => role.grouptype === 4);
        const supplierRoles = roles.filter(role => role.grouptype === 6);
        const TabPane = Tabs.TabPane;
        return (
            <div>
                <Tabs defaultActiveKey='1'>
                    <TabPane tab='苗圃角色' key='1'>
                        <Card
                            title='苗圃角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 0)}
                                >
                                    添加苗圃角色
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
                    <TabPane tab='施工角色' key='2'>
                        <Card
                            title='施工角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 1)}
                                >
                                    添加施工角色
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
                                dataSource={projectRoles}
                                rowKey='id'
                            />
                        </Card>
                    </TabPane>
                    <TabPane tab='监理角色' key='3'>
                        <Card
                            title='监理角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 2)}
                                >
                                    添加监理角色
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
                                dataSource={professionRoles}
                                rowKey='id'
                            />
                        </Card>
                    </TabPane>
                    <TabPane tab='业主角色' key='4'>
                        <Card
                            title='业主角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 3)}
                                >
                                    添加业主角色
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
                                dataSource={departmentRoles}
                                rowKey='id'
                            />
                        </Card>
                    </TabPane>
                    <TabPane tab='养护角色' key='5'>
                        <Card
                            title='养护角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 4)}
                                >
                                    添加养护角色
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
                                dataSource={curingRoles}
                                rowKey='id'
                            />
                        </Card>
                    </TabPane>
                    <TabPane tab='供应商角色' key='6'>
                        <Card
                            title='供应商角色'
                            extra={
                                <Button
                                    type='primary'
                                    ghost
                                    onClick={this.append.bind(this, 6)}
                                >
                                    添加供应商角色
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
                                dataSource={supplierRoles}
                                rowKey='id'
                            />
                        </Card>
                    </TabPane>
                </Tabs>
                {visible ? <Member {...this.props} /> : ''}
            </div>
        );
    }
}
