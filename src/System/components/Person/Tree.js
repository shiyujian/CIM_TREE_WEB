import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { TreeSelect } from 'antd';
import {getCompanyDataByOrgCode} from '_platform/auth';
const TreeNode = TreeSelect.TreeNode;

const addGroupSupplier = (supplier_list, str) => {
    const supplier_regionCode = JSON.parse(window.sessionStorage.getItem('supplier_regionCode'));
    const regionCode_province = JSON.parse(window.sessionStorage.getItem('regionCode_province'));
    let arr_province = [];
    supplier_list.map(item => {
        item.RegionCode = supplier_regionCode[item.code];
        item.province = regionCode_province[item.RegionCode];
        if (!arr_province.includes(item.province)) {
            arr_province.push(item.province);
        }
    });
    let newChildren = [];
    arr_province.map((item, index) => {
        let arr1 = [];
        supplier_list.map(record => {
            if (item === record.province) {
                arr1.push(record);
            }
        });
        newChildren.push({
            name: item || '其他',
            children: arr1,
            code: index
        });
    });
    return newChildren;
};

const addGroupNursery = (nursery_list, str) => {
    const nursery_regionCode = JSON.parse(window.sessionStorage.getItem('nursery_regionCode'));
    const regionCode_province = JSON.parse(window.sessionStorage.getItem('regionCode_province'));
    let arr_province = [];
    nursery_list.map(item => {
        item.RegionCode = nursery_regionCode[item.code];
        item.province = regionCode_province[item.RegionCode];
        if (!arr_province.includes(item.province)) {
            arr_province.push(item.province);
        }
    });
    let newChildren = [];
    arr_province.map((item, index) => {
        let arr1 = [];
        nursery_list.map(record => {
            if (item === record.province) {
                arr1.push(record);
            }
        });
        newChildren.push({
            name: item || '其他',
            children: arr1,
            code: index
        });
    });
    return newChildren;
};

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            childList: [],
            listVisible: true,
            orgTreeData: []
        };
        this.orgTreeDataArr = [];
    }

    render () {
        const {
            platform: { org: { children = [] } = {} },
            sidebar: { node = {} } = {}
        } = this.props;
        const { code } = node || {};
        return (
            <SimpleTree
                dataSource={children}
                selectedKey={code}
                onSelect={this.select.bind(this)}
            />
        );
    }

    componentWillMount () {
        const {
            actions: { getSupplierList, getRegionCodes, getNurseryList }
        } = this.props;
        getRegionCodes({}, {grade: 3}).then(rst => {
            let obj = {};
            rst.map(item => {
                obj[item.ID] = item.MergerName.split(',')[1];
            });
            window.sessionStorage.setItem('regionCode_province', JSON.stringify(obj));
        });
        getSupplierList().then(rst => {
            console.log(rst, '苗圃');
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
                getOrgTreeDataArr
            }
        } = this.props;
        try {
            const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
            if (user && user.username !== 'admin') {
                // 获取登录用户的公司的信息
                let org_code = user.account.org_code;
                let parentOrgData = await getCompanyDataByOrgCode(org_code, getOrgTreeByCode);
                let parentOrgCode = parentOrgData.code;
                // 获取公司线下的所有部门信息
                let orgTreeData = await getOrgTreeByCode({code: parentOrgCode});
                // 将公司下的所有部门设置为Select的选项
                let orgTreeSelectData = Tree.orgloop([orgTreeData]);
                this.orgTreeDataArr = [];
                await getOrgTreeSelect(orgTreeSelectData);
                // 将公司的部门的code全部进行存储
                await this.orgArrLoop([orgTreeData], 0);
                await getOrgTreeDataArr(this.orgTreeDataArr);
            }
            let rst = await getOrgTree({}, { depth: 3 });
            console.log(rst, '11111');
            if (rst && rst.children) {
                rst.children.map(item => {
                    if (item.name === '供应商') {
                        item.children = addGroupSupplier(item.children, '供应商');
                    } else if (item.name === '苗圃基地') {
                        item.children = addGroupNursery(item.children, '苗圃基地');
                    }
                });
                this.getList(rst.children);
            }
            const { children: [first] = [] } = rst || {};
            if (first) {
                await changeSidebarField('node', first);
                const codes = Tree.collect(first);
                await getUsers({}, { org_code: codes, page: 1 });
                await getTreeModal(false);
            }
        } catch (e) {
            console.log('e', e);
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

    componentDidUpdate () {
        const { childList, listVisible } = this.state;
        if (childList && childList.length > 0 && listVisible) {
            this.setListStore();
        }
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
                getTreeCode,
                getIsBtn
            }
        } = this.props;

        const topProject = Tree.loop(children, eventKey);
        if (this.compare(user, topProject, eventKey)) {
            if (topProject.code) {
                await getTreeModal(true);
            } else {
                await getTreeModal(false);
            }
            await changeSidebarField('node', topProject);
            const codes = Tree.collect(topProject);

            await getTreeCode(codes);
            let e = await getUsers({}, { org_code: codes, page: 1 });
            let pagination = {
                current: 1,
                total: e.count
            };
            await getTreeModal(false);
            await setUpdate(true);
            await getTablePage(pagination);
            // 控制是否通过角色条件分页
            await getIsBtn(true);
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
        console.log('data', data);
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
    // 设置登录用户所在公司的所有部门选项数组
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
