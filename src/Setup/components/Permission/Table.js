import React, { Component } from 'react';
import { Table, Button, Switch, Spin, Notification } from 'antd';
import { MODULES } from '_platform/api';
import Card from '_platform/components/panels/Card';
import './index.css';

export default class PermissionTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            permissionData: [],
            editing: false,
            loading: false,
            allPermissions: []
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
                    table: { permissionsCodes = [] } = {}
                } = this.props;
                const {
                    editing
                } = this.state;

                const key = `appmeta.${item.id}.READ`;
                // permissions里面是当前用户拥有的所有的权限
                const value = permissionsCodes.some(
                    permissionCode => permissionCode === key
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
    componentDidMount = async () => {
        const {
            actions: {
                getAllPermissions
            }
        } = this.props;
        try {
            let permissionData = PermissionTable.loop(MODULES);
            let allPermissions = await getAllPermissions();
            if (allPermissions && allPermissions instanceof Array) {
                this.setState({
                    allPermissions
                });
            }
            this.setState({
                permissionData
            });
        } catch (e) {
            console.log('e', e);
        }
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
            table: { permissionsCodes = [] } = {},
            actions: { changeTableField }
        } = this.props;
        const {
            permissionData
        } = this.state;

        let currentKey = key.slice(key.indexOf('appmeta.') + 8, key.indexOf('.READ'));
        if (checked) {
            let parentDatas = this.findParent(permissionData, currentKey);
            console.log('parentDatas', parentDatas);
            if (parentDatas && parentDatas.length > 0) {
                parentDatas.map((data) => {
                    let id = `appmeta.${data.id}.READ`;
                    if (permissionsCodes.indexOf(id) === -1) {
                        permissionsCodes.push(id);
                    }
                });
            }
            let childDatas = this.findChildren(permissionData, currentKey);
            console.log('childDatas', childDatas);

            if (childDatas && childDatas.length > 0) {
                childDatas.map((data) => {
                    if (data) {
                        let id = `appmeta.${data}.READ`;
                        if (permissionsCodes.indexOf(id) === -1) {
                            permissionsCodes.push(id);
                        }
                    }
                });
            }
        } else {
            let childDatas = this.findChildren(permissionData, currentKey);
            if (childDatas && childDatas.length > 0) {
                childDatas.map((data) => {
                    if (data) {
                        let id = `appmeta.${data}.READ`;
                        if (permissionsCodes.indexOf(id) !== -1) {
                            permissionsCodes.splice(permissionsCodes.indexOf(id), 1);
                        }
                    }
                });
            }
            let parentDatas = this.findParent(permissionData, currentKey);
            console.log('parentDatas', parentDatas);
            if (parentDatas && parentDatas.length > 0) {
                for (let i = parentDatas.length - 1; i >= 0; i--) {
                    let data = parentDatas[i];
                    if (i === parentDatas.length) {
                        let id = `appmeta.${data.id}.READ`;
                        if (permissionsCodes.indexOf(id) !== -1) {
                            permissionsCodes.splice(permissionsCodes.indexOf(id), 1);
                        }
                    } else {
                        if (data && data.children && data.children.length > 0) {
                            let children = data.children;
                            let isEmpty = true;
                            for (let s = 0; s < children.length; s++) {
                                let child = children[s];
                                let id = `appmeta.${child.id}.READ`;
                                if (permissionsCodes.indexOf(id) !== -1) {
                                    isEmpty = false;
                                }
                            }
                            if (isEmpty) {
                                let id = `appmeta.${data.id}.READ`;
                                if (permissionsCodes.indexOf(id) !== -1) {
                                    permissionsCodes.splice(permissionsCodes.indexOf(id), 1);
                                }
                            }
                        }
                    }
                }
            }
        }
        changeTableField('permissionsCodes', permissionsCodes);
    }
    save = async () => {
        const {
            table: {
                role = {},
                permissionsCodes = []
            } = {},
            actions: {
                changeTableField,
                changeRolePermission,
                getRoles
            }
        } = this.props;
        const {
            allPermissions
        } = this.state;
        try {
            this.setState({
                loading: true
            });
            let functions = [];
            permissionsCodes.map((permissionCode) => {
                allPermissions.map((allPermission) => {
                    if (permissionCode === allPermission.FunctionCode) {
                        functions.push({
                            ID: allPermission.ID
                        });
                    }
                });
            });
            let postData = {
                ID: role.ID,
                Functions: functions
            };
            let changePermissionData = await changeRolePermission({}, postData);
            if (changePermissionData && changePermissionData.code && changePermissionData.code === 1) {
                let roles = await getRoles();
                if (roles && roles instanceof Array) {
                    let myrole = roles.find(theRole => {
                        return theRole.ID === role.ID;
                    });
                    if (myrole && myrole.ID && myrole.ParentID && myrole.Functions) {
                        let newPermissionsCodes = [];
                        myrole.Functions.map((permission) => {
                            newPermissionsCodes.push((permission.FunctionCode));
                        });
                        await changeTableField('role', myrole);
                        await changeTableField('permissionsCodes', newPermissionsCodes);
                    }
                };
                Notification.success({
                    message: '权限设置成功',
                    duration: 3
                });
            } else {
                Notification.error({
                    message: '权限设置失败',
                    duration: 3
                });
            }

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
        if (role && role.ID) {
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
