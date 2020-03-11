import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../../store/Form/visaManagement';
import { TableListInitiate, TableListCommission, TableListFinished } from '../../components/Form/VisaManagement/';
import TreeProjectList from '../../components/TreeProjectList';
import { getAreaTreeData, getDefaultProject, getUser } from '_platform/auth';
const { TabPane } = Tabs;
@connect(
    state => {
        const {
            platform,
            overall: { visaManagement }
        } = state;
        return { platform, ...visaManagement };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class VisaManagement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isOwner: false, // 是否为业主管理员
            allowKeyArr: [], // 显示的标签页数组
            activeKey: '', // 默认标签页
            ConstructionList: [], // 施工文书列表
            SupervisorList: [], // 监理文书列表
            CostList: [], // 造价文书列表
            OwnerList: [], // 业主文书列表
            leftkeycode: '', // 项目
            sectionList: [] // 标段列表
        };
        this.filterTreeList = this.filterTreeList.bind(this); // 过滤项目
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;
        try {
            if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                let projectList = data.projectList || [];
                // 区域地块树
                await getThinClassTree(projectList);
            }
            let defaultProject = await getDefaultProject();
            if (defaultProject) {
                this.onSelect([defaultProject]);
            }
            // 获取监理审核人列表
            this.getAuditor();
        } catch (e) {
            console.log('e', e);
        }
    }
    getAuditor = async () => {
        const {
            actions: {
                getUsers,
                getRoles
            }
        } = this.props;
        let userInfo = await getUser();
        let roles = await getRoles();
        let postConstructionID = ''; // 施工文书ID
        let postCostID = ''; // 造价文书ID
        let postSupervisorID = ''; // 监理文书ID
        let postOwnerID = ''; // 业主文书ID
        roles.map((role) => {
            if (role && role.ID && role.ParentID && role.RoleName === '施工文书') {
                postConstructionID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '监理文书') {
                postSupervisorID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '造价文书') {
                postCostID = role.ID;
            } else if (role && role.ID && role.ParentID && role.RoleName === '业主文书') {
                postOwnerID = role.ID;
            }
        });
        let postConstructiondata = {
            role: postConstructionID,
            section: userInfo.section || '',
            status: 1,
            page: '',
            size: ''
        };
        let postSupervisordata = {
            role: postSupervisorID,
            section: userInfo.section || '',
            status: 1,
            page: '',
            size: ''
        };
        let postCostdata = {
            role: postCostID,
            // section: userInfo.section || '',
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

        let ConstructionData = await getUsers({}, postConstructiondata);
        let SupervisorData = await getUsers({}, postSupervisordata);
        let CostData = await getUsers({}, postCostdata);
        let OwnerData = await getUsers({}, postOwnerdata);
        let activeKey = 'initiate';
        let allowKeyArr = ['initiate', 'commission', 'finished'];
        if (userInfo.roles && userInfo.roles.RoleName === '施工文书') {
            activeKey = 'initiate';
            allowKeyArr = ['initiate'];
        } else {
            activeKey = 'commission';
            allowKeyArr = ['commission', 'finished'];
        }
        if (ConstructionData.code === 200 && SupervisorData.code === 200 && CostData.code === 200 && OwnerData.code === 200) {
            // 获取监理，施工，业主文书列表
            let ConstructionList = [], SupervisorList = [], CostList = [], OwnerList = [];
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
            CostData.content.map(item => {
                CostList.push({
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
            let isOwner = false;
            if ((userInfo.roles && userInfo.roles.RoleName === '业主文书') || userInfo.username === 'admin') {
                isOwner = true;
            }
            this.setState({
                isOwner,
                allowKeyArr,
                activeKey,
                ConstructionList,
                SupervisorList,
                CostList,
                OwnerList
            });
        }
    }
    handleTab (key) {
        this.setState({
            activeKey: key
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
            platform: { tree = {} }
        } = this.props;
        const {
            allowKeyArr,
            activeKey,
            leftkeycode
        } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='签证管理' {...this.props} />
                    <Sidebar>
                        {
                            treeList.length > 0 ? <TreeProjectList
                                treeData={this.filterTreeList(treeList)}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                            /> : ''
                        }
                    </Sidebar>
                    <Content>
                        {
                            activeKey && allowKeyArr.length ? <Tabs defaultActiveKey={activeKey} onChange={this.handleTab.bind(this)}>
                                {
                                    allowKeyArr.map(item => {
                                        let nodeArr = [];
                                        if (item === 'initiate') {
                                            nodeArr.push(<TabPane tab='发起流程' key='initiate'>
                                                <TableListInitiate
                                                    {...this.state}
                                                    {...this.props}
                                                />
                                            </TabPane>);
                                        } else if (item === 'commission') {
                                            nodeArr.push(<TabPane tab='待处理' key='commission'>
                                                <TableListCommission
                                                    {...this.state}
                                                    {...this.props}
                                                />
                                            </TabPane>);
                                        } else if (item === 'finished') {
                                            nodeArr.push(<TabPane tab='流程跟踪' key='finished'>
                                                <TableListFinished
                                                    {...this.state}
                                                    {...this.props}
                                                />
                                            </TabPane>);
                                        }
                                        return nodeArr;
                                    })
                                }
                            </Tabs> : ''
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
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
}
