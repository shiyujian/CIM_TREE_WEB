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
    componentDidMount = async () => {
        const {
            actions: { getOrgTree },
            platform: {
                org = []
            }
        } = this.props;
        if (!(org && org instanceof Array && org.length > 0)) {
            await getOrgTree({});
        }
    }

    addOrg = async () => {
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

    remove = async () => {
        const {
            sidebar: { node = {} } = {},
            actions: {
                deleteOrg,
                getOrgTree,
                changeOrgTreeDataStatus
            }
        } = this.props;
        try {
            this.setState({
                loading: true
            });
            let deleteData = await deleteOrg({ ID: node.ID });
            if (!deleteData) {
                setTimeout(async () => {
                    Notification.success({
                        message: '删除成功',
                        duration: 3
                    });
                    await getOrgTree({});
                    await changeOrgTreeDataStatus(true);
                    this.setState({
                        loading: false
                    });
                }, 1000);
            } else {
                if (deleteData === 'Error:This Org has Person Members, DELETE NOT ALLOWED') {
                    Notification.error({
                        message: '当前部门下存在人员，不能进行删除',
                        duration: 3
                    });
                } else if (deleteData === 'Error:This Org has children, DELETE NOT ALLOWED') {
                    Notification.error({
                        message: '当前部门下存在子节点，不能进行删除',
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
            console.log('remove', e);
        }
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
        let deleteDisabled = true;
        if (node && node.ID) {
            disabled = false;
            if (node.OrgCode) {
                deleteDisabled = false;
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
                                    disabled
                                    onClick={this.addOrg.bind(this)}
                                >
                                        新建组织机构
                                </Button>

                                : <Button
                                    style={{ float: 'left' }}
                                    type='primary'
                                    ghost

                                    onClick={this.addOrg.bind(this)}
                                >
                                        新建组织机构
                                </Button>

                        }
                        {
                            deleteDisabled
                                ? <Button
                                    style={{ float: 'right' }}
                                    type='danger'
                                    disabled
                                    ghost>
                                    删除
                                </Button>
                                : <Popconfirm
                                    title='是否真的要删除选中项目?'
                                    onConfirm={this.remove.bind(this)}
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
