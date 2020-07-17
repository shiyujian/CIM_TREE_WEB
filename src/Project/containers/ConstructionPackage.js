import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
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
    getUserIsManager,
    getAreaTreeData,
    getCompanyDataByOrgCode
} from '_platform/auth';
import {
    getConstructionPackageBySection
} from '../components/ConstructionPackage/auth';
import { actions } from '../store/constructionPackage';
import {
    ConstructionPackageTable,
    PkCodeTree
} from '../components/ConstructionPackage';
const Option = Select.Option;

@connect(
    state => {
        const {
            platform,
            project: { constructionPackage }
        } = state;
        return { platform, ...constructionPackage };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class ConstructionPackage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            sectionOption: [],
            leftkeycode: '',
            resetkey: 0,
            sectionsData: [],
            packageDatas: [],
            // 获取公司信息
            parentOrgData: '',
            parentOrgID: '',
            selectOrgData: '',
            isOwner: false
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getParentOrgTreeByID
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
        let rst = await getTreeNodeList();
        if (rst instanceof Array && rst.length > 0) {
            rst.forEach((item, index) => {
                rst[index].children = [];
            });
        }
        // 项目级
        let projectList = [];
        // 子项目工程级
        let regionList = [];
        if (rst instanceof Array && rst.length > 0) {
            rst.map(node => {
                if (node.Type === '项目工程') {
                    projectList.push({
                        Name: node.Name,
                        No: node.No
                    });
                } else if (node.Type === '子项目工程') {
                    let noArr = node.No.split('-');
                    if (noArr && noArr instanceof Array && noArr.length === 2) {
                        regionList.push({
                            Name: node.Name,
                            No: node.No,
                            Parent: noArr[0]
                        });
                    }
                }
            });
            for (let i = 0; i < projectList.length; i++) {
                projectList[i].children = regionList.filter(node => {
                    return node.Parent === projectList[i].No;
                });
            }
        }
        this.setState({
            packageDatas: projectList
        });

        let userInfo = await getUser();
        // 获取用户的公司信息
        let currentUserSection = userInfo.section || '';
        let isOwner = false;
        if ((userInfo.roles && userInfo.roles.RoleName.indexOf('设计') !== -1) || userInfo.username === 'admin') {
            isOwner = true;
        }
        this.setState({
            isOwner,
            currentUserSection
        });

        let parentOrgID = '';
        let parentOrgData = '';
        if (userInfo.username !== 'admin') {
            // 获取登录用户的公司的信息
            let orgID = userInfo.org;
            // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
            parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
            console.log('parentOrgData', parentOrgData);

            // 如果在公司下，则获取公司所有的信息
            if (parentOrgData && parentOrgData.ID) {
                parentOrgID = parentOrgData.ID;
                this.setState({
                    parentOrgData,
                    parentOrgID
                });
            } else {
                Notification.warning({
                    message: '当前用户不在公司下，请重新登录',
                    duration: 3
                });
            }
        }
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys = [], info) {
        const {
            platform: { tree = {} }
        } = this.props;
        const {
            parentOrgData,
            isOwner
        } = this.state;
        let treeList = tree.thinClassTree;

        let keycode = keys[0] || '';
        this.setState({
            leftkeycode: keycode,
            resetkey: ++this.state.resetkey
        });
        let sectionsData = [];
        if (keycode) {
            treeList.map((treeData) => {
                if (keycode === treeData.No) {
                    sectionsData = treeData.children;
                }
            });
        }
        this.setState({
            sectionsData
        });

        // 标段
        let user = getUser();
        console.log('user', user);
        let section = user.section;
        let newSectionList = [];
        if (isOwner) {
            // 根据公司所关联的标段展示施工包树
            let companySection = (parentOrgData && parentOrgData.Section) || '';
            if (companySection) {
                let sectionList = companySection.split(',');
                console.log('sectionList', sectionList);

                if (sectionList && sectionList instanceof Array && sectionList.length > 0) {
                    sectionsData.map((item) => {
                        if (sectionList.indexOf(item.No) !== -1) {
                            newSectionList.push(item);
                        }
                    });
                };
            }
        }
        let permission = getUserIsManager();
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else if (isOwner) {
            console.log('newSectionList', newSectionList);
            this.setSectionOption(newSectionList);
        } else {
            sectionsData.map((sectionData) => {
                if (section && section === sectionData.No) {
                    this.setSectionOption(sectionData);
                }
            });
        }
    }
    // 设置标段选项
    setSectionOption (rst) {
        let sectionOptions = [];
        try {
            if (rst instanceof Array) {
                rst.map(sec => {
                    sectionOptions.push(
                        <Option key={sec.No} value={sec.No} title={sec.Name}>
                            {sec.Name}
                        </Option>
                    );
                });
                this.setState({ sectionoption: sectionOptions });
            } else {
                sectionOptions.push(
                    <Option key={rst.No} value={rst.No} title={rst.Name}>
                        {rst.Name}
                    </Option>
                );
                this.setState({ sectionoption: sectionOptions });
            }
        } catch (e) {
            console.log('e', e);
        }
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
            resetkey
        } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='施工包管理' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <ConstructionPackageTable
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
