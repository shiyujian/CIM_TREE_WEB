import React, { Component } from 'react';
import { Table, Button, Switch, Spin } from 'antd';
import { MODULES } from '_platform/api';
import Card from '_platform/components/panels/Card';
import './index.css';

export default class PermissionTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            permissionData: [],
            editing: false,
            loading: false
        };
    }
    columns = [
        {
            title: '模块',
            dataIndex: 'name',
            width: '50%'
        },
        {
            title: '是否可见',
            width: '25%',
            render: item => {
                const {
                    table: { permissions = [] } = {}
                } = this.props;
                const {
                    editing
                } = this.state;

                const key = `appmeta.${item.id}.READ`;
                // permissions里面是当前用户拥有的所有的权限
                const value = permissions.some(
                    permission => permission === key
                );
                return (
                    <Switch
                        checked={value}
                        disabled={!editing}
                        checkedChildren='开'
                        unCheckedChildren='关'
                        onChange={this.check.bind(this, key)}
                    />
                );
            }
        }
    ];
    static loop = (MODULES, oldParentID = '') => {
        return MODULES.map(module => {
            const { children = [] } = module || {};
            if (oldParentID) {
                module.parentID = oldParentID;
            }
            let newParentID = module.id;
            PermissionTable.loop(children, newParentID);
            return module;
        });
    };
    componentDidMount () {
        let permissionData = PermissionTable.loop(MODULES);
        this.setState({
            permissionData
        });
    }
    findParent = (data2, nodeId2) => {
        let arrRes = [];
        if (data2.length === 0) {
            if (nodeId2) {
                arrRes.unshift(data2);
            }
            return arrRes;
        }
        let rev = (data, nodeId) => {
            for (let i = 0, length = data.length; i < length; i++) {
                let node = data[i];
                if (node.id === nodeId) {
                    arrRes.unshift(node);
                    rev(data2, node.parentID);
                    break;
                } else {
                    if (node.children) {
                        rev(node.children, nodeId);
                    }
                }
            }
            return arrRes;
        };
        arrRes = rev(data2, nodeId2);
        return arrRes;
    }
    findChildren = (array, id) => {
        let childList = [];
        let arrRes = [];
        let readList = [];
        let loopData = (list, key) => {
            for (let i = 0, length = list.length; i < length; i++) {
                let node = list[i];
                if (node.id === key) {
                    childList.push(node.id);
                    let addChild = (node) => {
                        if (node.children) {
                            for (let s = 0; s < node.children.length; s++) {
                                let child = node.children[s];
                                childList.push(child.id);
                                addChild(child);
                            }
                        };
                        return childList;
                    };
                    arrRes = arrRes.concat(addChild(node));
                    readList = arrRes;
                    return arrRes;
                } else {
                    if (node.children) {
                        loopData(node.children, key);
                    }
                }
            }
        };
        loopData(array, id);
        return readList;
    }
    check (key, checked) {
        const {
            table: { permissions = [] } = {},
            actions: { changeTableField }
        } = this.props;
        const {
            permissionData
        } = this.state;
        let currentKey = key.slice(key.indexOf('appmeta.') + 8, key.indexOf('.READ'));
        if (checked) {
            let datas = this.findParent(permissionData, currentKey);
            if (datas && datas.length > 0) {
                datas.map((data) => {
                    let id = `appmeta.${data.id}.READ`;
                    if (permissions.indexOf(id) === -1) {
                        permissions.push(id);
                    }
                });
            }
        } else {
            let datas = this.findChildren(permissionData, currentKey);
            if (datas && datas.length > 0) {
                datas.map((data) => {
                    if (data) {
                        let id = `appmeta.${data}.READ`;
                        if (permissions.indexOf(id) !== -1) {
                            permissions.splice(permissions.indexOf(id), 1);
                        }
                    }
                });
            }
        }
        changeTableField('permissions', permissions);
    }
    save = async () => {
        const {
            table: { role = {}, permissions = [] } = {},
            actions: { changeTableField, putRole, getRoles }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            await putRole(
                { id: role.id },
                { name: role.name, grouptype: role.grouptype, permissions }
            );
            let roles = await getRoles();
            if (roles && roles instanceof Array) {
                let myrole = roles.find(theRole => {
                    return theRole.id === role.id;
                });
                myrole && changeTableField('role', myrole);
                myrole &&
                    myrole.permissions &&
                    changeTableField('permissions', myrole.permissions);
            };
            this.setState({
                editing: false,
                loading: false
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    handleChangeEditStatus = async () => {
        this.setState({
            editing: true
        });
    }

    render () {
        let userPermi = MODULES.map(ele => {
            return { ...ele };
        });
        const {
            loading,
            editing
        } = this.state;
        const {
            table: { role = {} } = {}
        } = this.props;
        let disabled = true;
        if (role && role.id) {
            disabled = false;
        }
        return (
            <div>
                <Spin spinning={loading}>
                    <Card
                        title='权限详情'
                        extra={
                            <div>
                                {editing || (
                                    <Button
                                        type='primary'
                                        ghost
                                        disabled={disabled}
                                        onClick={this.handleChangeEditStatus.bind(this)}
                                    >
                                    编辑
                                    </Button>
                                )}
                                {editing && (
                                    <Button
                                        disabled={disabled}
                                        type='primary'
                                        onClick={this.save.bind(this)}
                                    >
                                    保存
                                    </Button>
                                )}
                            </div>
                        }
                    >
                        <Table
                            showLine
                            columns={this.columns}
                            dataSource={userPermi}
                            bordered
                            pagination={false}
                            rowKey='id'
                            className='tableLevel2'
                        />
                    </Card>
                </Spin>
            </div>
        );
    }
}
