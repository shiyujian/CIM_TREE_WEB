import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { TreeSelect } from 'antd';
import {getCompanyDataByOrgCode, addGroup} from '_platform/auth';
import {ORG_NURSERY_CODE, ORG_SUPPLIER_CODE} from '_platform/api';
const TreeNode = TreeSelect.TreeNode;

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            childList: [],
            listVisible: true,
            orgTreeArrList: [],
            permission: false
        };
        this.orgTreeDataArr = [];
    }

    componentWillMount () {
        const {
            actions: { getSupplierList, getRegionCodes, getNurseryList }
        } = this.props;
        getRegionCodes({}, {}).then(rst => {
            let obj = {};
            rst.map(item => {
                obj[item.ID] = item.MergerName;
            });
            window.sessionStorage.setItem('regionCode_name', JSON.stringify(obj));
        });
        getSupplierList().then(rst => {
            window.sessionStorage.setItem('Supplier_list', JSON.stringify(rst.content));
            let obj = {};
            rst.content.map(item => {
                obj[item.OrgPK] = item.RegionCode;
            });
            window.sessionStorage.setItem('supplier_regionCode', JSON.stringify(obj));
        });
        getNurseryList().then(rst => {
            let obj = {};
            rst.content.map(item => {
                obj[item.OrgPK] = item.RegionCode;
            });
            window.sessionStorage.setItem('nursery_regionCode', JSON.stringify(obj));
        });
    }
    componentDidMount = async () => {
        const {
            actions: {
                getOrgTree,
                changeSidebarField,
                getUsers,
                getTreeModal,
                getOrgTreeSelect,
                getOrgTreeByCode,
                getOrgTreeDataArr,
                getTablePage,
                getTreeCode
            }
        } = this.props;
        try {
            const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
            // 管理员可以查看全部，其他人只能查看自己公司
            let permission = false;
            // 施工文书可以查看苗圃基地和供应商
            let isClericalStaff = false;
            let groups = user.groups || [];
            groups.map((group) => {
                if (group.name.indexOf('施工文书') !== -1) {
                    isClericalStaff = true;
                }
            });
            if (user.username === 'admin') {
                permission = true;
            }
            this.setState({
                permission
            });
            let orgTreeData = {};
            let orgTreeArrList = [];
            if (user && user.username !== 'admin') {
                // 获取登录用户的公司的信息
                let org_code = user.account.org_code;
                // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
                let parentOrgData = await getCompanyDataByOrgCode(org_code, getOrgTreeByCode);
                let parentOrgCode = parentOrgData.code;
                // 获取公司线下的所有部门信息
                orgTreeData = await getOrgTreeByCode({code: parentOrgCode});
                orgTreeArrList.push(orgTreeData);
                // 将公司下的所有部门设置为Select的选项
                let orgTreeSelectData = Tree.orgloop([orgTreeData]);
                this.orgTreeDataArr = [];
                await getOrgTreeSelect(orgTreeSelectData);
                // 将公司的部门的code全部进行存储
                await this.orgArrLoop([orgTreeData], 0);
                await getOrgTreeDataArr(this.orgTreeDataArr);
                // 如果是施工文书，需要获取苗木基地和供应商，对这两种机构下的人进行审核
                if (isClericalStaff) {
                    let nurseryData = await getOrgTreeByCode({code: ORG_NURSERY_CODE});
                    let supplierData = await getOrgTreeByCode({code: ORG_SUPPLIER_CODE});
                    orgTreeArrList.push(nurseryData);
                    orgTreeArrList.push(supplierData);
                    orgTreeArrList.map(item => {
                        if (item.name === '供应商') {
                            item.children = addGroup(item.children, '供应商');
                        } else if (item.name === '苗圃基地') {
                            item.children = addGroup(item.children, '苗圃基地');
                        }
                    });
                }
                this.setState({
                    orgTreeArrList
                });
            }
            // 如果是管理员，获取全部数据
            if (permission) {
                let rst = await getOrgTree({}, {depth: 7});
                // 对苗圃基地和供应商按照区号进行省份和地区的划分
                if (rst && rst.children) {
                    rst.children.map(item => {
                        if (item.name === '供应商') {
                            item.children = addGroup(item.children, '供应商');
                        } else if (item.name === '苗圃基地') {
                            item.children = addGroup(item.children, '苗圃基地');
                        }
                    });
                    this.getList(rst.children);
                }
                const { children: [first] = [] } = rst || {};
                if (first) {
                    // 作为选中的节点，将机构的数据上传至redux
                    await changeSidebarField('node', first);
                    const codes = Tree.collect(first);
                    await getTreeCode(codes);
                    let userList = await getUsers({}, { org_code: codes, page: 1 });
                    if (userList && userList.count) {
                        let pagination = {
                            current: 1,
                            total: userList.count
                        };
                        await getTablePage(pagination);
                    }
                    await getTreeModal(false);
                }
            } else {
                if (orgTreeData && orgTreeData.pk) {
                    // 作为选中的节点，将机构的数据上传至redux
                    await changeSidebarField('node', orgTreeData);
                    const codes = Tree.collect(orgTreeData);
                    await getTreeCode(codes);
                    let userList = await getUsers({}, { org_code: codes, page: 1 });
                    if (userList && userList.count) {
                        let pagination = {
                            current: 1,
                            total: userList.count
                        };
                        await getTablePage(pagination);
                    }
                    await getTreeModal(false);
                }
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }

    componentDidUpdate () {
        const { childList, listVisible } = this.state;
        if (childList && childList.length > 0 && listVisible) {
            this.setListStore();
        }
    }

    render () {
        const {
            platform: { org: { children = [] } = {} },
            sidebar: { node = {} } = {}
        } = this.props;
        const {
            orgTreeArrList,
            permission
        } = this.state;
        const { code } = node || {};
        return (
            <SimpleTree
                dataSource={permission ? children : orgTreeArrList}
                selectedKey={code}
                onSelect={this.select.bind(this)}
            />
        );
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

    // 将项目分为二维数组，以项目的个数来划分
    getList (data = []) {
        const { childList } = this.state;
        return data.map((item, index) => {
            childList[index] = [];
            if (item.children && item.children.length) {
                childList[index].push({
                    code: item.code,
                    name: item.name
                });
                this.getChildrenArr(item.children, childList[index]);
            }
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

    select = async (s, node) => {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const { node: { props: { eventKey = '' } = {} } = {} } = node || {};
        const {
            platform: { org: { children = [] } = {} },
            actions: {
                changeSidebarField,
                getUsers,
                getTreeModal,
                setUpdate,
                getTablePage,
                getTreeCode
            }
        } = this.props;
        const {
            orgTreeArrList,
            permission
        } = this.state;
        let topProject = '';
        if (permission) {
            topProject = Tree.loop(children, eventKey);
        } else {
            topProject = Tree.loop(orgTreeArrList, eventKey);
        }
        if (this.compare(user, topProject, eventKey)) {
            if (topProject.code) {
                await getTreeModal(true);
            } else {
                await getTreeModal(false);
            }
            await changeSidebarField('node', topProject);
            const codes = Tree.collect(topProject);

            await getTreeCode(codes);
            let userList = await getUsers({}, { org_code: codes, page: 1 });
            let pagination = {
                current: 1,
                total: userList.count
            };
            await getTreeModal(false);
            await setUpdate(true);
            await getTablePage(pagination);
        }
    }
    compare (user, topProject, eventKey) {
        let groups = user.groups;
        let isClericalStaff = false;
        groups.map((group) => {
            if (group.name === '施工文书') {
                isClericalStaff = true;
            }
        });
        if (isClericalStaff && (topProject.topParent === '苗圃基地' || topProject.topParent === '供应商')) {
            return true;
        }
        if (user.is_superuser) {
            return true;
        }
        let status = false;
        this.orgTreeDataArr.map((code) => {
            if (code === eventKey) {
                status = true;
            }
        });
        return status;
    }
    static loop = (list, code, loopTimes = 0, topParent) => {
        let rst = null;
        list.forEach((item = {}) => {
            if (loopTimes === 0) {
                topParent = item.name;
            }
            const { code: value, children = [] } = item;
            if (value === code) {
                rst = item;
                rst.topParent = topParent;
            } else {
                const tmp = Tree.loop(children, code, loopTimes + 1, topParent);
                if (tmp) {
                    rst = tmp;
                    rst.topParent = topParent;
                }
            }
        });
        return rst;
    };

    static collect = (node = {}) => {
        const { code } = node;
        let rst = [];
        rst.push(code);
        return rst;
    };
    // 设置登录用户所在的公司的部门项
    static orgloop (data = [], loopTimes = 0) {
        if (data.length === 0) {
            return;
        }
        return data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode disabled
                        key={`${item.code}`}
                        value={JSON.stringify(item)}
                        title={`${item.name}`}>
                        {
                            Tree.orgloop(item.children, loopTimes + 1, item.name)
                        }
                    </TreeNode>
                );
            } else {
                return (<TreeNode
                    disabled={loopTimes === 0 && true}
                    key={`${item.code}`}
                    value={JSON.stringify(item)}
                    title={`${item.name}`} />);
            }
        });
    };
    // 设置登录用户所在公司的所有部门作为选项数组
    orgArrLoop (data = [], loopTimes = 0) {
        try {
            if (data.length === 0) {
                return;
            }
            return data.map((item) => {
                if (item.children && item.children.length > 0) {
                    this.orgTreeDataArr.push(item.code);
                    this.orgArrLoop(item.children, loopTimes + 1);
                } else {
                    this.orgTreeDataArr.push(item.code);
                }
            });
        } catch (e) {
            console.log('orgArrLoop', e);
        }
    }
}
