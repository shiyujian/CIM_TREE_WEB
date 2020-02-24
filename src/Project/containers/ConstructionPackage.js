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
    getAreaTreeData
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
            smallCalssPackageList: [],
            packageDatas: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
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
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys = [], info) {
        const {
            platform: { tree = {} }
        } = this.props;
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
        let section = user.section;
        let permission = getUserIsManager();
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
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
    sectionSelect = async (value) => {
        const {
            actions: {
                getThinClassList,
                setConstructionPackageLoading
            }
        } = this.props;
        await setConstructionPackageLoading(true);
        let smallCalssPackageList = await getConstructionPackageBySection(value, getThinClassList);
        console.log('smallCalssPackageList', smallCalssPackageList);

        this.setSmallClassOption(smallCalssPackageList);
        this.setState({
            smallCalssPackageList
        });
        await setConstructionPackageLoading(false);
    }
    // 设置小班选项
    setSmallClassOption (rst) {
        if (rst instanceof Array) {
            let smallclassOptions = [];
            rst.map(small => {
                smallclassOptions.push(
                    <Option key={small.No} value={small.No} title={small.Name}>
                        {small.Name}
                    </Option>
                );
            });
            smallclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({
                smallclassoption: smallclassOptions
            });
        }
    }
    // 小班选择, 重新获取: 细班
    smallClassSelect (value) {
        const {
            smallCalssPackageList
        } = this.state;
        smallCalssPackageList.map((smallClassData) => {
            if (value === smallClassData.No) {
                let thinClassesData = smallClassData.children;
                this.setState({
                    thinClassesData
                });
                this.setThinClassOption(thinClassesData);
            }
        });
    }
    // 设置细班选项
    setThinClassOption (rst) {
        if (rst instanceof Array) {
            let thinclassOptions = [];
            rst.map(thin => {
                thinclassOptions.push(
                    <Option key={thin.No} value={thin.No} title={thin.Name}>
                        {thin.Name}
                    </Option>
                );
            });
            thinclassOptions.unshift(
                <Option key={-1} value={''} title={'全部'}>
                            全部
                </Option>
            );
            this.setState({ thinclassoption: thinclassOptions });
        }
    }

    // 细班选择, 重新获取: 树种
    thinClassSelect (value) {
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
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
