import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { TreeSelect } from 'antd';
import {getCompanyDataByOrgCode} from '_platform/auth';
import {ORG_NURSERY_CODE, ORG_SUPPLIER_CODE} from '_platform/api';
const TreeNode = TreeSelect.TreeNode;
const addGroup = (childrenList, str) => {
    const nursery_regionCode = JSON.parse(window.sessionStorage.getItem('nursery_regionCode'));
    const supplier_regionCode = JSON.parse(window.sessionStorage.getItem('supplier_regionCode'));
    const regionCode_name = JSON.parse(window.sessionStorage.getItem('regionCode_name'));
    if (str === '供应商') {
        childrenList.map(item => {
            item.RegionCode = supplier_regionCode[item.code];
            if (regionCode_name[item.RegionCode]) {
                const regionNameArr = regionCode_name[item.RegionCode].split(',');
                item.province = regionNameArr[1];
                item.city = regionNameArr[2];
                item.county = regionNameArr[3];
            }
        });
    } else {
        childrenList.map(item => {
            item.RegionCode = nursery_regionCode[item.code];
            if (regionCode_name[item.RegionCode]) {
                const regionNameArr = regionCode_name[item.RegionCode].split(',');
                item.province = regionNameArr[1];
                item.city = regionNameArr[2];
                item.county = regionNameArr[3];
            }
        });
    }
    let provinceArr = [];
    childrenList.map(item => {
        if (!provinceArr.includes(item.province)) {
            provinceArr.push(item.province);
        }
    });
    let newChildren = [];
    provinceArr.map((item) => {
        let cityArr = [];
        childrenList.map(row => {
            if (item === row.province && !cityArr.includes(row.city)) {
                cityArr.push(row.city);
            }
        });
        let provinceChildren = [];
        cityArr.map((row) => {
            let cityChildren = [];
            let countyArr = [];
            childrenList.map(record => {
                if (row === record.city && !countyArr.includes(record.county)) {
                    countyArr.push(record.county);
                }
            });
            countyArr.map(record => {
                let countyChildren = [];
                childrenList.map(ite => {
                    if (row === ite.city && record === ite.county) {
                        countyChildren.push(ite);
                    }
                });
                cityChildren.push({
                    name: record || '其他',
                    code: str + item + row + record,
                    children: countyChildren
                });
            });
            provinceChildren.push({
                name: row || '其他',
                code: str + item + row,
                children: cityChildren
            });
        });
        newChildren.push({
            name: item || '其他',
            code: str + item,
            children: provinceChildren
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
                getOrgTreeDataArr
            }
        } = this.props;
        try {
            const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
            let permission = false;
            let groups = user.groups || [];
            groups.map((group) => {
                if (group.name.indexOf('业主') !== -1) {
                    permission = true;
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

                this.setState({
                    orgTreeArrList
                });
            }
            if (permission) {
                let rst = await getOrgTree({}, {depth: 7});
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
                    await changeSidebarField('node', first);
                    const codes = Tree.collect(first);
                    await getUsers({}, { org_code: codes, page: 1 });
                    await getTreeModal(false);
                }
            } else {
                if (orgTreeData && orgTreeData.pk) {
                    await changeSidebarField('node', orgTreeData);
                    const codes = Tree.collect(orgTreeData);
                    console.log('codes', codes);
                    await getUsers({}, { org_code: codes, page: 1 });
                    await getTreeModal(false);
                }
            }
        } catch (e) {
            console.log('e', e);
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
        console.log('orgTreeArrList', orgTreeArrList);
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
            let e = await getUsers({}, { org_code: codes, page: 1 });
            let pagination = {
                current: 1,
                total: e.count
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
