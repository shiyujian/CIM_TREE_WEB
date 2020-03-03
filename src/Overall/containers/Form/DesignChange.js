import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tabs} from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../../store/Form/designChange';
import { TableList, Query, PkCodeTree, Details, TableListSee, TableListInitiate } from '../../components/Form/DesignChange';
import {
    getUser,
    getAreaTreeData,
    getUserIsManager
} from '_platform/auth';
const { TabPane } = Tabs;
@connect(
    state => {
        const {
            platform,
            overall: { designChange }
        } = state;
        return { platform, ...designChange };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class DesignChange extends Component {
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
            role: '', // 当前登录用户角色
            ConstructionList: [], // 施工文书列表
            SupervisorList: [], // 监理文书列表
            OwnerList: [], // 业主文书列表
            CostList: [], // 造价文书列表
            DesignList: [], // 设计文书列表
            sectionList: [], // 标段列表
            flowId: '', // 流程id
            flowName: '', // 流程名称
            originNodeID: '' // 节点id
        };
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
        this.getAuditor();
        // let user = getUser();
        // let section = user.section;
        // if (section) {
        //     let code = section.split('-');
        //     if (code && code.length === 3) {
        //         this.setState({
        //             leftkeycode: code[0]
        //         });
        //     }
        // }
    }
    componentDidMount = async () => {
        let user = getUser();
        let section = user.section; // 获取当前登录用户的标段
        let userid = user.ID; // 获取当前登录用户的id
        let org = user.orgObj ? user.orgObj.OrgName : '';// 获取当前登录用户的单位
        let username = user.username; // 获取当前登录用户的用户名
        let name = user.name; // 获取当前登录用户名称
        let phone = user.phone; // 获取当前登录用户联系方式
        let role = user.roles ? user.roles.RoleName : ''; // 获取当前登录用户的角色
        let permission = getUserIsManager(); // 是否是admin或业主
        this.setState({
            section: section,
            userid: userid,
            org: org,
            username: username,
            name: name,
            phone: phone,
            role: role
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
        // if (!(userInfo && userInfo.section)) {
        //     return;
        // }
        let roles = await getRoles();
        let postConstructionID = ''; // 施工文书ID
        let postSupervisorID = ''; // 监理文书ID
        let postOwnerID = ''; // 业主文书ID
        let postCostID = ''; // 造价文书ID
        let postDesignID = ''; // 设计文书ID
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '施工文书') {
                postConstructionID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '监理文书') {
                postSupervisorID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '业主文书') {
                postOwnerID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '造价文书') {
                postCostID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '设计文书') {
                postDesignID = role.ID;
            }
        });
        let postConstructiondata = {
            role: postConstructionID,
            section: userInfo.section,
            status: 1,
            page: '',
            size: ''
        };
        let postSupervisordata = {
            role: postSupervisorID,
            section: userInfo.section,
            status: 1,
            page: '',
            size: ''
        };
        let postOwnerdata = {
            role: postOwnerID,
            section: '',
            status: 1,
            page: '',
            size: ''
        };
        let postCostdata = {
            role: postCostID,
            section: '',
            status: 1,
            page: '',
            size: ''
        };
        let postDesigndata = {
            role: postDesignID,
            section: '',
            status: 1,
            page: '',
            size: ''
        };
        let ConstructionData = await getUsers({}, postConstructiondata);
        let SupervisorData = await getUsers({}, postSupervisordata);
        let OwnerData = await getUsers({}, postOwnerdata);
        let CostData = await getUsers({}, postCostdata);
        let DesignData = await getUsers({}, postDesigndata);
        // let activeKey = 'initiate';
        // let allowKey = ['initiate', 'commission', 'finished'];
        // if (userInfo.duty === '施工文书') {
        //     activeKey = 'initiate';
        //     allowKey = ['initiate'];
        // } else {
        //     activeKey = 'commission';
        //     allowKey = ['commission', 'finished'];
        // }
        if (ConstructionData.code === 200 && SupervisorData.code === 200 && OwnerData.code === 200 && CostData.code === 200 && DesignData.code === 200) {
            // 获取监理，施工，业主文书列表
            let ConstructionList = [], SupervisorList = [], OwnerList = [], CostList = [], DesignList = [];
            ConstructionData.content.map(item => {
                ConstructionList.push({
                    Full_Name: item.Full_Name,
                    User_Name: item.User_Name,
                    id: item.ID
                });
            });
            SupervisorData.content.map(item => {
                SupervisorList.push({
                    Full_Name: item.Full_Name,
                    User_Name: item.User_Name,
                    id: item.ID
                });
            });
            OwnerData.content.map(item => {
                OwnerList.push({
                    Full_Name: item.Full_Name,
                    User_Name: item.User_Name,
                    id: item.ID
                });
            });
            CostData.content.map(item => {
                CostList.push({
                    Full_Name: item.Full_Name,
                    User_Name: item.User_Name,
                    id: item.ID
                });
            });
            DesignData.content.map(item => {
                DesignList.push({
                    Full_Name: item.Full_Name,
                    User_Name: item.User_Name,
                    id: item.ID
                });
            });
            this.setState({
                // allowKey,
                // activeKey: activeKey,
                ConstructionList,
                SupervisorList,
                OwnerList,
                CostList,
                DesignList
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

    render () {
        const { leftkeycode, loading } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }

        let html = [];
        if (this.state.role.indexOf('设计') > -1) {
            html.push(
                <div>
                    <TableListInitiate
                        {...this.props}
                        {...this.state}
                        list={this.state.list}
                        projectList={this.state.projectList}
                        section={this.state.section}
                        userid={this.state.userid}
                        org={this.state.org}
                        username={this.state.username}
                        name={this.state.name}
                        phone={this.state.phone}
                        key='initiate'
                    />
                </div>
            );
        } else {
            let tab1 = '', tab2 = '';
            if (this.state.role.indexOf('业主') > -1 || this.state.role.indexOf('监理') > -1 || this.state.role.indexOf('造价') > -1) {
                tab1 = '表单详情';
                tab2 = '流程跟踪';
            } else if (this.state.role.indexOf('施工') > -1) {
                tab1 = '变更通知';
                tab2 = '变更申请';
            }
            html.push(
                <div>
                    <Tabs
                        defaultActiveKey='pending'
                    >
                        <TabPane tab={tab1} key='pending'>
                            <TableList
                                {...this.props}
                                {...this.state}
                                list={this.state.list}
                                projectList={this.state.projectList}
                                section={this.state.section}
                                userid={this.state.userid}
                                org={this.state.org}
                                username={this.state.username}
                                name={this.state.name}
                                phone={this.state.phone}
                                tabs='pending'
                                key='tab1'
                            />
                        </TabPane>
                        <TabPane tab={tab2} key='processed'>
                            <TableListSee
                                {...this.props}
                                {...this.state}
                                list={this.state.list}
                                projectList={this.state.projectList}
                                section={this.state.section}
                                userid={this.state.userid}
                                org={this.state.org}
                                username={this.state.username}
                                name={this.state.name}
                                phone={this.state.phone}
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
                                    <div
                                        style={{ overflow: 'hidden' }}
                                        className='project-tree'>
                                        <PkCodeTree
                                            treeData={treeList}
                                            selectedKeys={leftkeycode}
                                            onSelect={this.onSelect.bind(this)}
                                        // onExpand={this.onExpand.bind(this)}
                                        />
                                    </div>
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
