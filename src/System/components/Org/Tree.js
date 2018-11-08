import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { Button, Popconfirm } from 'antd';

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            childList: [],
            list: [],
            listVisible: true
        };
    }
    componentDidMount = async () => {
        const {
            actions: { getOrgTree }
        } = this.props;
        await getOrgTree({}, { depth: 4 });
        await this.getOrgDataList();
    }

    getOrgDataList = async () => {
        const {
            platform: { org: { children = [] } = {} },
            actions: {
                changeOrgTreeDataStatus
            }
        } = this.props;
        try {
            let dataList = [];
            dataList = children.filter(item => {
                if (item.name !== '供应商' && item.name !== '苗圃基地') {
                    return item;
                }
            });
            await this.setState({
                dataList
            });
            await this.getList(dataList);
            await this.setState({ list: this.filiter(children) });
            await changeOrgTreeDataStatus(false);
        } catch (e) {
            console.log('getOrgDataList', e);
        }
    }

    render () {
        const { dataList } = this.state;
        const {
            platform: { org: { children = [] } = {} },
            sidebar: { node = {} } = {}
        } = this.props;
        console.log(children);
        const { code } = node || {};
        return (
            <div>
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
                        新建项目
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
            console.log('aaaaaaaaaaaaaaa');
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

    // 根据标段信息显示组织结构，人员标段信息和组织机构标段信息要匹配
    filiter (list) {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (!user.is_superuser) {
            if (!user.account.sections || user.account.sections == []) {
                return [];
            } else {
                for (let i = 0; i < list.length; i++) {
                    const children = list[i].children;
                    for (let j = 0; j < children.length; j++) {
                        let c = children[j];
                        if (
                            !this.compare(
                                user.account.sections,
                                c.extra_params.sections
                            )
                        ) {
                            delete children[j];
                        }
                    }
                }
            }
        }
        return list;
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

    addOrg () {
        const {
            platform: { org = {} },
            actions: { changeAdditionField, changeSidebarField }
        } = this.props;
        changeSidebarField('parent', org);
        changeAdditionField('visible', true);
    }

    select (s, node) {
        const { node: { props: { eventKey = '' } = {} } = {} } = node || {};
        const {
            platform: { org: { children = [] } = {} },
            actions: { changeSidebarField }
        } = this.props;
        const org = Tree.loop(children, eventKey);
        changeSidebarField('node', org);
    }

    remove = async () => {
        const {
            sidebar: { node = {} } = {},
            actions: { deleteOrg, getOrgTree, changeOrgTreeDataStatus }
        } = this.props;
        try {
            await deleteOrg({ code: node.code });
            await getOrgTree({}, { depth: 4 });
            await changeOrgTreeDataStatus(true);
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
                switch (deep) {
                    case 0:
                        type = 'project';
                        break;
                    case 1:
                        type = 'subProject';
                        break;
                    case 2:
                        type = 'org';
                        break;
                    case 3:
                        type = 'company';
                        break;
                    default:
                        type = 'department';
                        break;
                }
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
