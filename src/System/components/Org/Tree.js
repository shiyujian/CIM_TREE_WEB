import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { Button, Popconfirm, Notification, Spin } from 'antd';

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            childList: [],
            listVisible: true,
            loading: false
        };
    }
    componentDidMount = async () => {
        const {
            actions: { getOrgTree },
            platform: {
                org: { children = [] } = {}
            }
        } = this.props;
        if (!(children && children instanceof Array && children.length > 0)) {
            await getOrgTree({});
        }
        await this.getOrgDataList();
    }

    getOrgDataList = async () => {
        const {
            platform: { org = [] },
            actions: {
                changeOrgTreeDataStatus
            }
        } = this.props;
        try {
            await this.getList(org);
            await changeOrgTreeDataStatus(false);
        } catch (e) {
            console.log('getOrgDataList', e);
        }
    }

    render () {
        const {
            dataList,
            loading
        } = this.state;
        const {
            sidebar: { node = {} } = {}
        } = this.props;
        const { code } = node || {};
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
                        <Button
                            style={{ float: 'left' }}
                            type='primary'
                            ghost
                            onClick={this.addOrg.bind(this)}
                        >
                        新建组织机构
                        </Button>
                        <Popconfirm
                            title='是否真的要删除选中项目?'
                            onConfirm={this.remove.bind(this)}
                            okText='是'
                            cancelText='否'
                        >
                            <Button style={{ float: 'right' }} type='danger' ghost>
                            删除
                            </Button>
                        </Popconfirm>
                    </div>
                    <SimpleTree
                        dataSource={dataList}
                        selectedKey={code}
                        onSelect={this.select.bind(this)}
                    />
                </Spin>
            </div>
        );
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { childList, listVisible } = this.state;
        const {
            orgTreeDataChangeStatus = false
        } = this.props;
        if (childList && childList.length > 0 && listVisible) {
            await this.setListStore();
        }
        if (orgTreeDataChangeStatus && orgTreeDataChangeStatus !== prevProps.orgTreeDataChangeStatus) {
            await this.getOrgDataList();
        }
    }
    // 将二维数组传入store中
    setListStore () {
        const {
            actions: { getListStore }
        } = this.props;
        const { childList } = this.state;
        getListStore(childList);
        this.setState({
            listVisible: false
        });
    }

    // 获取项目下的所有节点的名字和code
    getChildrenArr (data = [], List = []) {
        return data.map(item => {
            if (item.children && item.children.length) {
                List.push({
                    code: item.code,
                    name: item.name
                });

                return this.getChildrenArr(item.children, List);
            } else {
                List.push({
                    code: item.code,
                    name: item.name
                });
            }
        });
    }
    // 将项目分为二维数组，以项目的个数来划分
    getList (data = []) {
        const { childList } = this.state;
        return data.map((item, index) => {
            childList[index] = new Array();
            if (item.children && item.children.length) {
                childList[index].push({
                    code: item.code,
                    name: item.name
                });
                this.getChildrenArr(item.children, childList[index]);
            }
        });
    }
    // 人员标段和组织机构标段比较器，如果满足条件返回true
    compare (l1, s) {
        if (s == undefined) {
            return false;
        }
        let l2 = s.split(',');
        for (let i = 0; i < l1.length; i++) {
            const e1 = l1[i];
            for (let j = 0; j < l2.length; j++) {
                const e2 = l2[j];
                if (e1 == e2) {
                    return true;
                }
            }
        }
        return false;
    }

    addOrg = async () => {
        const {
            platform: { org = {} },
            sidebar: { node = {} } = {},
            actions: { changeAdditionField, changeSidebarField }
        } = this.props;
        console.log('node', node);
        if (node && node.code) {
            await changeSidebarField('parent', node);
        } else {
            await changeSidebarField('parent', org);
        }
        ;
        await changeAdditionField('visible', true);
    }

    select (s, node) {
        const { node: { props: { eventKey = '' } = {} } = {} } = node || {};
        const {
            platform: { org: { children = [] } = {} },
            actions: { changeSidebarField }
        } = this.props;
        if (node && node.selected) {
            const org = Tree.loop(children, eventKey);
            changeSidebarField('node', org);
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
            let deleteData = await deleteOrg({ code: node.code });
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

    static loop = (list, code, deep = 0) => {
        let rst = null;
        list.find((item = {}) => {
            const { code: value, children = [] } = item;
            if (value === code) {
                let type = '';
                rst = { ...item, type };
            } else {
                const tmp = Tree.loop(children, code, deep + 1);
                if (tmp) {
                    rst = tmp;
                }
            }
        });

        return rst;
    };
}
