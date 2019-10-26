import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select, Spin } from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUser,
    getCompanyDataByOrgCode,
    getUserIsManager
} from '_platform/auth';
import {
    ORGTYPE
} from '_platform/api';
import { actions } from '../../store/ManMachine/manEntranceAndDeparture';
import {
    ManEntranceAndDepartureTable,
    PkCodeTree
} from '../../components/ManMachine/ManEntranceAndDeparture';
const Option = Select.Option;

@connect(
    state => {
        const {
            platform,
            project: { manEntranceAndDeparture }
        } = state;
        return { platform, ...manEntranceAndDeparture };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class ManEntranceAndDeparture extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
            resetkey: 0,
            companyList: [],
            companyListTree: [],
            userCompany: '',
            loading: false,
            // 工种
            workTypesList: [],
            // 班组
            workGroupList: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getOrgTreeByOrgType,
                getOrgTree,
                getWorkTypes
            }
        } = this.props;
        this.setState({
            loading: true
        });
        // 获取左侧公司树
        let projectList = await getOrgTree();
        let permission = getUserIsManager();
        let companyList = [];
        let companyListTree = [];
        if (permission) {
            for (let i = 0; i < ORGTYPE.length; i++) {
                let type = ORGTYPE[i];
                let orgData = await getOrgTreeByOrgType({orgtype: type});
                if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
                    if (orgData.content && orgData.content instanceof Array) {
                        let projectTree = this.handleSortCompanyTree(projectList, orgData.content, type);
                        let companyTree = [];
                        companyTree.push({
                            ID: type,
                            OrgName: type,
                            children: projectTree
                        });
                        companyList = companyList.concat(orgData.content);
                        companyListTree = companyListTree.concat(companyTree);
                    }
                }
            }
            await this.getUserCompany();
        } else {
            let parentData = await this.getUserCompany();
            companyList.push(parentData);
            if (parentData && parentData.ID) {
                companyListTree.push({
                    ID: 1,
                    OrgName: parentData.OrgType,
                    children: parentData
                });
            }
        }
        // 获取工种
        let workTypesList = [];
        let workTypeData = await getWorkTypes();
        if (workTypeData && workTypeData.content) {
            workTypesList = workTypeData.content;
        }
        this.setState({
            workTypesList
        });
        this.setState({
            companyList,
            companyListTree,
            loading: false,
            workTypesList
        });
    }
    handleSortCompanyTree = (projectList, orgData, type) => {
        let projectTree = [];
        // 首先建立项目的树
        projectList.map((project) => {
            projectTree.push({
                ID: `${project.ID}${type}`, // 不同类型下的项目树的ID是相同的，为了区分
                ProjectID: project.ID,
                OrgName: project.ProjectName,
                children: []
            });
        });
        // 遍历公司，将公司按照项目分类
        orgData.map((org) => {
            projectTree.map((project) => {
                if (project.ProjectID === org.ProjectID) {
                    project.children.push(org);
                }
            });
        });
        // 删除项目树中公司项为空的元素
        for (let i = projectTree.length - 1; i >= 0; i--) {
            if (projectTree[i].children.length === 0) {
                projectTree.splice(i, 1);
            }
        }
        return projectTree;
    }
    // 获取用户自己的公司信息
    getUserCompany = async () => {
        const {
            actions: {
                getParentOrgTreeByID
            }
        } = this.props;
        try {
            let user = getUser();
            let parentData = '';
            // admin没有部门
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                let orgID = user.org;
                parentData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                if (parentData && parentData.ID) {
                    let companyOrgID = parentData.ID;
                    this.setState({
                        userCompany: companyOrgID
                    });
                }
            }
            return parentData;
        } catch (e) {
            console.log('getUserCompany', e);
        }
    }
    onSelect = async (keys = [], info) => {
        const {
            actions: {
                getWorkGroup
            }
        } = this.props;
        let keycode = keys[0] || '';
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
        let data = await getWorkGroup({}, {orgid: keycode});
        let workGroupList = [];
        if (data && data.content) {
            workGroupList = data.content;
        }
        this.setState({
            workGroupList
        });
    }
    // 重置
    resetinput (leftkeycode) {
        this.setState({
            resetkey: ++this.state.resetkey
        }, () => {
            this.onSelect([leftkeycode]);
        });
    }
    render () {
        const {
            leftkeycode,
            resetkey,
            loading,
            companyListTree
        } = this.state;

        return (
            <Body>
                <Main>
                    <DynamicTitle title='人员进离场' {...this.props} />
                    <Sidebar>
                        <Spin spinning={loading}>
                            <PkCodeTree
                                treeData={companyListTree}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                            />
                        </Spin>

                    </Sidebar>
                    <Content>
                        <ManEntranceAndDepartureTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
