import React, { Component } from 'react';
import SimpleTree from './SimpleTree';
import {getCompanyDataByOrgCode, getUser} from '_platform/auth';
import {addGroup} from '../auth';
import moment from 'moment';

export default class Tree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            listVisible: true,
            orgTreeArrList: []
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
                getChildOrgTreeByID,
                getParentOrgTreeByID,
                getOrgTreeDataArr,
                getCompanyOrgTree,
                getTablePage,
                getNurseryList
            }
        } = this.props;
        try {
            const user = getUser();
            // 管理员可以查看全部，其他人只能查看自己公司
            let permission = false;
            if (user.username === 'admin') {
                permission = true;
            }
            // 施工文书可以查看苗圃基地和供应商
            let isClericalStaff = false;
            let userRoles = user.roles || '';
            if (userRoles && userRoles.RoleName && userRoles.RoleName.indexOf('施工文书') !== -1) {
                isClericalStaff = true;
            }

            let orgTreeData = {};
            let orgTreeArrList = [];
            if (user && user.username !== 'admin') {
                // 获取登录用户的公司的信息
                let orgID = user.org;
                // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
                let parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                // 如果在公司下，则获取公司所有的信息
                if (parentOrgData && parentOrgData.ID) {
                    let parentOrgID = parentOrgData.ID;
                    // 获取公司线下的所有部门信息
                    orgTreeData = await getChildOrgTreeByID({id: parentOrgID});
                    await getCompanyOrgTree(orgTreeData);
                    orgTreeArrList.push(orgTreeData);
                    // 将公司的部门的ID全部进行存储,用来判断用户是否有权限查看点击的组织机构
                    this.orgTreeDataArr = [];
                    await this.orgArrLoop([orgTreeData], 0);
                    await getOrgTreeDataArr(this.orgTreeDataArr);
                    // 如果是施工文书，需要获取苗木基地和供应商，对这两种机构下的人进行审核
                    if (isClericalStaff) {
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
                    }
                } else {
                    // 如果不在公司下，则至获取他所在的组织机构的数据
                    orgTreeData = await getChildOrgTreeByID({id: orgID});
                    console.log('orgTreeData', orgTreeData);
                    if (orgTreeData && orgTreeData.ID) {
                        orgTreeData.children = [];
                        orgTreeArrList.push(orgTreeData);
                        await getOrgTreeDataArr([orgTreeData.ID]);
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
                if (orgTreeData && orgTreeData.ID) {
                    // 作为选中的节点，将机构的数据上传至redux
                    await changeSidebarField('node', orgTreeData);
                    await this.getOrgUserList(orgTreeData.ID);
                }
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }

    getOrgUserList = async (org) => {
        const {
            actions: {
                getUsers,
                getTablePage
            }
        } = this.props;
        let postData = {
            org: org,
            page: 1,
            size: 10
        };
        let userList = await getUsers({}, postData);
        if (userList && userList.code && userList.code === 200) {
            let pagination = {
                current: 1,
                total: userList.pageinfo.total
            };
            await getTablePage(pagination);
        }
    }

    select = async (s, node) => {
        const {
            node: {
                props: {
                    eventKey = ''
                } = {}
            } = {}
        } = node || {};
        const {
            actions: {
                changeSidebarField,
                getUsers,
                getTablePage
            }
        } = this.props;
        const {
            orgTreeArrList
        } = this.state;
        if (eventKey) {
            let selectOrgData = JSON.parse(eventKey);
            if (selectOrgData && selectOrgData.ID) {
                const user = getUser();
                if (this.compare(user, selectOrgData, selectOrgData.ID)) {
                    await changeSidebarField('node', selectOrgData);
                    let orgID = '';
                    if (selectOrgData && selectOrgData.OrgPK) {
                        orgID = selectOrgData.OrgPK;
                    } else {
                        orgID = selectOrgData.ID;
                    }
                    let postData = {
                        org: orgID,
                        page: 1,
                        size: 10
                    };
                    let userList = await getUsers({}, postData);
                    if (userList && userList.code && userList.code === 200) {
                        let pagination = {
                            current: 1,
                            total: userList.pageinfo.total
                        };
                        await getTablePage(pagination);
                    }
                }
            }
        }
    }
    // 判断点击的点  用户是否有权限查看
    compare (user, selectOrgData, eventKey) {
        let userRoles = user.roles || '';
        let isClericalStaff = false;
        if (userRoles.RoleName === '施工文书') {
            isClericalStaff = true;
        }
        if (isClericalStaff && selectOrgData.NurseryName) {
            return true;
        }
        if (user.username === 'admin') {
            return true;
        }
        let status = false;
        this.orgTreeDataArr.map((ID) => {
            if (ID === eventKey) {
                status = true;
            }
        });
        return status;
    }

    // 设置登录用户所在公司的所有部门作为选项数组,用来判断用户点击的部门是否是自己所在的公司下的部门
    orgArrLoop (data = [], loopTimes = 0) {
        try {
            if (data.length === 0) {
                return;
            }
            return data.map((item) => {
                if (item.children && item.children.length > 0) {
                    this.orgTreeDataArr.push(item.ID);
                    this.orgArrLoop(item.children, loopTimes + 1);
                } else {
                    this.orgTreeDataArr.push(item.ID);
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
        return (
            <SimpleTree
                dataSource={orgTreeArrList}
                selectedKey={JSON.stringify(node)}
                onSelect={this.select.bind(this)}
            />
        );
    }
}
