import React, { Component } from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';
import { TreeSelect } from 'antd';
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
            listVisible: true
        };
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
    componentDidMount () {
        const {
            actions: { getOrgTree, changeSidebarField, getUsers, getTreeModal, getOrgTreeSelect }
        } = this.props;
        getOrgTree({}, { depth: 3 }).then(rst => {
            if (rst && rst.children) {
                rst.children.map(item => {
                    if (item.name === '供应商') {
                        item.children = addGroupSupplier(item.children, '供应商');
                    } else if (item.name === '苗圃基地') {
                        item.children = addGroupNursery(item.children, '苗圃基地');
                    }
                });
                this.getList(rst.children);
                // 目前只针对业主的单位，name为建设单位   所以对建设单位进行loop
                if (rst.children && rst.children instanceof Array && rst.children.length > 0) {
                    rst.children.map((item) => {
                        if (item.name === '建设单位') {
                            if (item && item.children) {
                                let data = Tree.orgloop(item.children);
                                getOrgTreeSelect(data);
                            }
                        }
                    });
                }
            }

            const { children: [first] = [] } = rst || {};
            if (first) {
                changeSidebarField('node', first);
                const codes = Tree.collect(first);
                getUsers({}, { org_code: codes, page: 1 }).then(e => {
                    getTreeModal(false);
                });
            }
        });
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

    select (s, node) {
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
        const o = Tree.loop(children, eventKey);
        let ucode;
        // if(user.account.org_code.length>17){
        // 	 ucode=user.account.org_code.substring(0,17);

        // }else{
        // 	 ucode=user.account.org_code.substring(0,9);
        // }

        const ucodes = user.account.org_code.split('_');
        if (ucodes.length > 5) {
            ucodes.pop();
            const codeu = ucodes.join();
            ucode = codeu.replace(/,/g, '_');
        } else {
            ucode = user.account.org_code.substring(0, 9);
            // ucodes.pop()
            // const codeu=ucodes.join()
            // ucode=codeu.replace(/,/g,'_')
        }
        if (this.compare(user, ucode, o)) {
            if (o.code) {
                getTreeModal(true);
            } else {
                getTreeModal(false);
            }
            changeSidebarField('node', o);
            const codes = Tree.collect(o);

            getTreeCode(codes);
            getUsers({}, { org_code: codes, page: 1 }).then(e => {
                let pagination = {
                    current: 1,
                    total: e.count
                };
                getTreeModal(false);
                setUpdate(true);
                getTablePage(pagination);
                // 控制是否通过角色条件分页
                getIsBtn(true);
            });
        }
    }
    // 人员标段和组织机构标段比较器，如果满足条件返回true
    // compare(user,l1,s){
    // 	if(user.is_superuser){
    // 		return true;
    // 	}
    // 	if(l1==undefined||s==undefined){
    // 		return false
    // 	}
    // 	let l2=s.split(',')
    // 	for (let i = 0; i < l1.length; i++) {
    // 		const e1 = l1[i];
    // 		for (let j = 0; j < l2.length; j++) {
    // 			const e2 = l2[j];
    // 			if(e1==e2){
    // 				return true
    // 			}
    // 		}
    // 	}
    // 	return false;
    // }
    compare (user, l1, o) {
        let s;
        if (o && o.code) {
            s = o.code;
        }
        let groups = user.groups;
        let isClericalStaff = false;
        groups.map((group) => {
            if (group.name === '施工文书') {
                isClericalStaff = true;
            }
        });
        if (isClericalStaff && (o.topParent === '苗圃基地' || o.topParent === '供应商')) {
            return true;
        }
        if (user.is_superuser) {
            return true;
        }
        if (l1 === undefined || s === undefined) {
            return false;
        }
        // let l2 = s.split(',')
        // for (let i = 0; i < l1.length; i++) {
        // 	const e1 = l1[i];
        // 	for (let j = 0; j < l2.length; j++) {
        // 		const e2 = l2[j];
        // 		if (e1 == e2) {
        // 			return true
        // 		}
        // 	}
        // }
        // if(l1>)
        if (s.startsWith(l1)) {
            return true;
        }

        return false;
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
        // children.forEach(n => {
        // 	const codes = Tree.collect(n);
        // 	rst = rst.concat(codes);
        // });
        return rst;
    };
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
}
