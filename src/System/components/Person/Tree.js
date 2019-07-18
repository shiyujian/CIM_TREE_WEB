import React, { Component } from 'react';
import SimpleTree from './SimpleTree';
import { TreeSelect } from 'antd';
import {getCompanyDataByOrgCode, getUser} from '_platform/auth';
import {addGroup} from '../auth';
import {ORG_NURSERY_CODE, ORG_SUPPLIER_CODE} from '_platform/api';
import moment from 'moment';
const TreeNode = TreeSelect.TreeNode;

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            listVisible: true,
            orgTreeArrList: [],
            permission: false
        };
        this.orgTreeDataArr = [];
    }

    componentWillMount = async () => {
        const {
            actions: { getRegionCodes }
        } = this.props;
        // 获取行政编码
        let rst = await getRegionCodes({}, {});
        let obj = {};
        rst.map(item => {
            obj[item.ID] = item.MergerName;
        });
        window.sessionStorage.setItem('regionCode_name', JSON.stringify(obj));
    }
    componentDidMount = async () => {
        const {
            actions: {
                getOrgTree,
                changeSidebarField,
                getOrgTreeSelect,
                getChildOrgTreeByID,
                getParentOrgTreeByID,
                getOrgTreeDataArr,
                getTablePage,
                getNurseryList
            }
        } = this.props;
        try {
            const user = getUser();
            // 管理员可以查看全部，其他人只能查看自己公司
            let permission = false;
            // 施工文书可以查看苗圃基地和供应商
            let isClericalStaff = false;
            let userRoles = user.roles || '';
            if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('施工文书') !== -1) {
                isClericalStaff = true;
            }
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
                let orgID = user.org;
                // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
                let parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                // 如果在公司下，则获取公司所有的信息
                if (parentOrgData) {
                    let parentOrgCode = parentOrgData.code;
                    // 获取公司线下的所有部门信息
                    orgTreeData = await getChildOrgTreeByID({id: parentOrgCode});
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
                        let nurseryData = await getChildOrgTreeByID({id: ORG_NURSERY_CODE});
                        let supplierData = await getChildOrgTreeByID({id: ORG_SUPPLIER_CODE});
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
                } else {
                    // 如果不在公司下，则至获取他所在的组织机构的数据
                    orgTreeData = await getChildOrgTreeByID({id: orgID});
                    console.log('orgTreeData', orgTreeData);
                    if (orgTreeData && orgTreeData.code) {
                        orgTreeData.children = [];
                        orgTreeArrList.push(orgTreeData);
                        await getOrgTreeDataArr([orgTreeData.code]);
                    }
                }
                this.setState({
                    orgTreeArrList
                });
            }
            // 如果是管理员，获取全部数据
            if (permission) {
                console.log('aaaaaaa');
                let rst = await getOrgTree({});
                console.log('rst', rst);
                // 对苗圃基地和供应商按照区号进行省份和地区的划分
                if (rst && rst instanceof Array) {
                    orgTreeArrList = rst;
                    // 获取苗圃列表
                    let nurseryData = {};
                    let contentData = await getNurseryList();
                    if (contentData && contentData.content) {
                        nurseryData = {
                            ID: moment().unix(),
                            OrgType: '苗圃基地',
                            Orgs: contentData.content,
                            ProjectName: '苗圃基地'
                        };
                        orgTreeArrList.push(nurseryData);
                    }
                    orgTreeArrList.map(async item => {
                        if (item.ProjectName === '苗圃基地') {
                            item.Orgs = await addGroup(item.Orgs, '苗圃基地');
                        }
                    });
                    console.log('orgTreeArrList', orgTreeArrList);

                    this.setState({
                        orgTreeArrList
                    });
                }
                // 进入模块将选中点，表格都清空
                await changeSidebarField('node', '');
                let pagination = {
                    current: 1,
                    total: 0
                };
                await getTablePage(pagination);
            } else {
                if (orgTreeData && orgTreeData.pk) {
                    // 作为选中的节点，将机构的数据上传至redux
                    await changeSidebarField('node', orgTreeData);
                    const codes = Tree.collect(orgTreeData);
                    await this.getOrgUserList(codes);
                }
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }

    getOrgUserList = async (codes) => {
        const {
            actions: {
                getTreeCode,
                getUsers,
                getTablePage,
                getTreeModal
            }
        } = this.props;
        await getTreeCode(codes);
        let userList = await getUsers({}, { org_code: codes, page: 1 });
        if (userList && userList.results) {
            let pagination = {
                current: 1,
                total: userList.count
            };
            await getTablePage(pagination);
        }
        await getTreeModal(false);
    }

    componentDidUpdate () {
    }

    select = async (s, node) => {
        const { node: { props: { eventKey = '' } = {} } = {} } = node || {};
        const {
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
            orgTreeArrList
        } = this.state;
        const user = getUser();
        let topProject = Tree.loop(orgTreeArrList, eventKey);
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
        let userRoles = user.roles || '';
        let isClericalStaff = false;
        if (userRoles.RoleName === '施工文书') {
            isClericalStaff = true;
        }
        if (isClericalStaff && (topProject.topParent === '苗圃基地' || topProject.topParent === '供应商')) {
            return true;
        }
        if (user.username === 'admin') {
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

    render () {
        const {
            sidebar: { node = {} } = {}
        } = this.props;
        const {
            orgTreeArrList
        } = this.state;
        const { code } = node || {};
        return (
            <SimpleTree
                dataSource={orgTreeArrList}
                selectedKey={code}
                onSelect={this.select.bind(this)}
            />
        );
    }
}
