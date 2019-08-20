import React, { Component } from 'react';
import SimpleTree from './SimpleTree';
import { Button, Popconfirm, Notification, Spin } from 'antd';

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    static loop = (list, ID, deep = 0) => {
        let rst = null;
        list.find((item = {}) => {
            if (item && item.OrgCode) {
                let children = (item && item.children) || [];
                if (item.ID === ID) {
                    rst = { ...item };
                } else {
                    const tmp = Tree.loop(children, ID, deep + 1);
                    if (tmp) {
                        rst = tmp;
                    }
                }
            } else {
                if (item && item.Orgs) {
                    let orgs = (item && item.Orgs) || [];
                    if (item.ID === ID) {
                        rst = { ...item };
                    } else {
                        const tmp = Tree.loop(orgs, ID, deep + 1);
                        if (tmp) {
                            rst = tmp;
                        }
                    }
                }
            }
        });
        return rst;
    };
    componentDidMount = async () => {
        const {
            actions: { getOrgTree },
            platform: {
                org = []
            }
        } = this.props;
        // 因用户管理对redux中的部门进行了更改，添加了苗圃基地，所以暂时先自己获取
        // if (!(org && org instanceof Array && org.length > 0)) {
        //     await getOrgTree({});
        // }
        await getOrgTree({});
    }

    handleAddOrg = async () => {
        const {
            sidebar: { node = {} } = {},
            actions: {
                changeAdditionField,
                changeSidebarField
            }
        } = this.props;
        if (node && node.ID) {
            await changeSidebarField('parent', node);
            await changeAdditionField('visible', true);
        }
    }

    handleAddProject = async () => {
        const {
            sidebar: { node = {} } = {},
            actions: {
                changeAddProjectVisible
            }
        } = this.props;
        if (!(node && node.ID)) {
            await changeAddProjectVisible(true);
        }
    }

    handleOrgSelect (s, treeNode) {
        const { node: { props: { eventKey = '' } = {} } = {} } = treeNode || {};
        console.log('s', s);
        const {
            platform: { org = [] },
            actions: { changeSidebarField }
        } = this.props;
        if (treeNode && treeNode.selected) {
            const orgData = Tree.loop(org, eventKey);
            changeSidebarField('node', orgData);
        } else {
            changeSidebarField('node', '');
        }
    }

    handleRemoveOrg = async () => {
        const {
            sidebar: { node = {} } = {},
            actions: {
                deleteOrg,
                getOrgTree,
                changeSidebarField
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let deleteData = await deleteOrg({ ID: node.ID });
            if (deleteData && deleteData.code && deleteData.code === 1) {
                setTimeout(async () => {
                    Notification.success({
                        message: '删除成功',
                        duration: 3
                    });
                    await getOrgTree({});
                    await changeSidebarField('node', '');
                    this.setState({
                        loading: false
                    });
                }, 1000);
            } else {
                if (deleteData.msg && deleteData.msg === '当前组织机构存在用户，不能进行删除！') {
                    Notification.error({
                        message: '当前组织机构存在用户，不能进行删除！',
                        duration: 3
                    });
                } else if (deleteData.msg && deleteData.msg === '当前组织机构存在子组织机构，不能进行删除！') {
                    Notification.error({
                        message: '当前组织机构存在子组织机构，不能进行删除！',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '删除失败',
                        duration: 3
                    });
                }
                this.setState({
                    loading: false
                });
            }
        } catch (e) {
            console.log('handleRemoveOrg', e);
        }
    }

    handleRemoveProject = async () => {
        const {
            actions: {
                deleteProject,
                getOrgTree,
                changeSidebarField
            },
            sidebar: { node = {} } = {}
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let deleteData = await deleteProject({ ID: node.ID });
            if (deleteData && deleteData.code && deleteData.code === 1) {
                Notification.success({
                    message: '删除成功',
                    duration: 3
                });
                await getOrgTree({});
                await changeSidebarField('node', '');
                this.setState({
                    loading: false
                });
            } else {
                if (deleteData.msg && deleteData.msg === '当前组织机构存在用户，不能进行删除！') {
                    Notification.error({
                        message: '当前组织机构存在用户，不能进行删除！',
                        duration: 3
                    });
                } else if (deleteData.msg && deleteData.msg === '该项目存在组织机构关联，请先删除组织机构！') {
                    Notification.error({
                        message: '该项目存在组织机构关联，请先删除组织机构！',
                        duration: 3
                    });
                } else {
                    Notification.error({
                        message: '删除失败',
                        duration: 3
                    });
                }
                this.setState({
                    loading: false
                });
            }
        } catch (e) {
            console.log('handleRemoveProject', e);
        }
    }

    render () {
        const {
            loading
        } = this.state;
        const {
            sidebar: { node = {} } = {},
            platform: { org = [] }
        } = this.props;
        const { ID = '' } = node;
        let disabled = true;
        let deleteOrgDisabled = true;
        let deleteProjectDisabled = true;
        if (node && node.ID) {
            disabled = false;
            if (node.OrgCode) {
                deleteOrgDisabled = false;
                deleteProjectDisabled = true;
            } else {
                deleteProjectDisabled = false;
            }
        }
        return (
            <div>
                <Spin spinning={loading}>
                    <div
                        style={{
                            height: 35,
                            paddingBottom: 5,
                            borderBottom: '1px solid #dddddd',
                            textAlign: 'center',
                            marginBottom: 10
                        }}
                    >
                        {
                            disabled
                                ? <Button
                                    style={{ float: 'left' }}
                                    type='primary'
                                    ghost
                                    onClick={this.handleAddProject.bind(this)}
                                >
                                        新建项目
                                </Button>

                                : <Button
                                    style={{ float: 'left' }}
                                    type='primary'
                                    ghost
                                    onClick={this.handleAddOrg.bind(this)}
                                >
                                        新建组织机构
                                </Button>

                        }
                        {
                            deleteOrgDisabled
                                ? (
                                    !deleteProjectDisabled
                                        ? <Popconfirm
                                            title='是否要删除选中项目?'
                                            onConfirm={this.handleRemoveProject.bind(this)}
                                            okText='是'
                                            cancelText='否'
                                        >
                                            <Button
                                                style={{ float: 'right' }}
                                                type='danger'
                                                ghost>
                                            删除
                                            </Button>
                                        </Popconfirm>
                                        : <Button
                                            style={{ float: 'right' }}
                                            type='danger'
                                            disabled
                                            ghost>
                                            删除
                                        </Button>
                                )
                                : <Popconfirm
                                    title='是否真的要删除选中组织机构?'
                                    onConfirm={this.handleRemoveOrg.bind(this)}
                                    okText='是'
                                    cancelText='否'
                                >
                                    <Button
                                        style={{ float: 'right' }}
                                        type='danger'
                                        ghost>
                                        删除
                                    </Button>
                                </Popconfirm>
                        }

                    </div>
                    <SimpleTree
                        dataSource={org}
                        selectedKey={ID}
                        onSelect={this.handleOrgSelect.bind(this)}
                    />
                </Spin>
            </div>
        );
    }
}
