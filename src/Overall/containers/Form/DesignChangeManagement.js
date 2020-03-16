import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tabs } from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../../store/Form/designChangeManagement';
import {
    TableListCommission,
    TableListFinished,
    TableListInitiate
} from '../../components/Form/DesignChangeManagement';
import TreeProjectList from '../../components/TreeProjectList';
import {
    getUser,
    getAreaTreeData,
    getDefaultProject,
    getUserIsManager
} from '_platform/auth';
const { TabPane } = Tabs;
@connect(
    state => {
        const {
            platform,
            overall: { designChangeManagement }
        } = state;
        return { platform, ...designChangeManagement };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class DesignChangeManagement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            list: [], // 列表数据
            projectList: [], // 地块标段数据
            section: '', // 当前登录用户标段信息
            userid: '', // 当前登录用户id
            org: '', // 当前登录用户单位
            username: '', // 当前登录用户name
            name: '', // 当前用户名
            phone: '', // 当前登录用户电话
            loading: true,
            leftkeycode: '',
            currentUserRole: '', // 当前登录用户角色
            TechnicalDirectorList: [],
            sectionList: [], // 标段列表
            flowId: '', // 流程id
            flowName: '', // 流程名称
            originNodeID: '' // 节点id
        };
        this.filterTreeList = this.filterTreeList.bind(this); // 过滤项目
    }
    componentWillMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率

        // 避免反复获取森林树种列表，提高效率
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的区段数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                projectList: projectList
            });
        }
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            let data = await getTreeNodeList();
            if (data && data instanceof Array && data.length > 0) {
                this.setState({
                    loading: false
                });
            }
        } else {
            this.setState({
                loading: false
            });
        }
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
        this.getAuditor();
    }
    componentDidMount = async () => {
        let user = getUser();
        let section = user.section; // 获取当前登录用户的标段
        let userid = user.ID; // 获取当前登录用户的id
        let org = user.orgObj ? user.orgObj.OrgName : '';// 获取当前登录用户的单位
        let username = user.username; // 获取当前登录用户的用户名
        let name = user.name; // 获取当前登录用户名称
        let phone = user.phone; // 获取当前登录用户联系方式
        let currentUserRole = user.roles ? user.roles.RoleName : ''; // 获取当前登录用户的角色
        this.setState({
            section: section,
            userid: userid,
            org: org,
            username: username,
            name: name,
            phone: phone,
            currentUserRole: currentUserRole
        });
    }

    getAuditor = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let userInfo = await getUser();
        let userRoles = userInfo.roles;
        let userRoleName = (userInfo && userInfo.roles && userRoles.RoleName) || '';
        if (userRoleName) {
            let roles = await getRoles();
            let technicalDirectorRoleID = ''; // 项目技术负责人ID

            roles.map((role) => {
                if (role && role.ID && role.ParentID && role.RoleName) {
                    if (role.RoleName === '项目技术负责人') {
                        technicalDirectorRoleID = role.ID;
                    }
                }
            });
            let TechnicalDirectorList = []; // 项目技术负责人
            if (userRoleName === '设计文书') {
                // 获取项目技术负责人
                let postTechnicalDirectorData = {
                    role: technicalDirectorRoleID,
                    section: '',
                    status: 1,
                    page: '',
                    size: ''
                };
                let TechnicalDirectorData = await getUsers({}, postTechnicalDirectorData);
                if (TechnicalDirectorData && TechnicalDirectorData.code && TechnicalDirectorData.code === 200) {
                    TechnicalDirectorData.content.map(item => {
                        TechnicalDirectorList.push({
                            Full_Name: item.Full_Name,
                            User_Name: item.User_Name,
                            id: item.ID
                        });
                    });
                }
            }

            this.setState({
                TechnicalDirectorList
            });
        }
    }

    // 树选择
    onSelect (keys) {
        let keycode = keys[0] || '';
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        let sectionList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        treeList.map(item => {
            if (item.No === keycode) {
                sectionList = item.children;
            }
        });
        this.setState({
            leftkeycode: keycode,
            sectionList
        });
    }
    filterTreeList (treeList) {
        const {
            isOwner,
            leftkeycode
        } = this.state;
        let newTreeList = [];
        if (leftkeycode) {
            treeList.map(item => {
                if (item.No === leftkeycode) {
                    newTreeList.push(item);
                }
            });
        } else {
            newTreeList = treeList;
        }
        // 业主和超管看到所有项目
        if (isOwner) {
            newTreeList = treeList;
        }
        return newTreeList;
    }

    render () {
        const {
            leftkeycode,
            loading,
            currentUserRole
        } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }

        let html = [];
        if (currentUserRole.indexOf('设计文书') > -1) {
            html.push(
                <div>
                    <TableListInitiate
                        {...this.props}
                        {...this.state}
                        key='initiate'
                    />
                </div>
            );
        } else {
            let tab1 = '', tab2 = '';
            if (currentUserRole.indexOf('业主文书') > -1 || currentUserRole.indexOf('监理') > -1 || currentUserRole.indexOf('造价') > -1 ||
                currentUserRole.indexOf('项目技术负责人') > -1 || currentUserRole.indexOf('项目经理') > -1
            ) {
                tab1 = '表单详情';
                tab2 = '流程跟踪';
            } else if (currentUserRole.indexOf('施工') > -1) {
                tab1 = '变更通知';
                tab2 = '变更申请';
            }
            html.push(
                <div>
                    <Tabs
                        defaultActiveKey='pending'
                    >
                        <TabPane tab={tab1} key='pending'>
                            <TableListCommission
                                {...this.props}
                                {...this.state}
                                tabs='pending'
                                key='tab1'
                            />
                        </TabPane>
                        <TabPane tab={tab2} key='processed'>
                            <TableListFinished
                                {...this.props}
                                {...this.state}
                                tabs='processed'
                                key='tab2'
                            />
                        </TabPane>
                    </Tabs>
                </div>
            );
        }

        return (
            <Body>
                <Main>
                    <DynamicTitle title='设计变更' {...this.props} />
                    {
                        loading
                            ? <Spin spinning={loading} tip='Loading...' />
                            : <div>
                                <Sidebar>
                                    <TreeProjectList
                                        treeData={this.filterTreeList(treeList)}
                                        selectedKeys={leftkeycode}
                                        onSelect={this.onSelect.bind(this)}
                                    />
                                </Sidebar>
                                <Content>
                                    {html}
                                </Content>
                            </div>
                    }
                </Main>
            </Body>
        );
    }
}
