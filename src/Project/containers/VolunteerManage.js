import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUser,
    getAreaTreeData,
    getDefaultProject,
    getUserIsManager
} from '_platform/auth';
import { TreeProjectList } from '../components';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/volunteerManage';
import { Table } from '../components/VolunteerManage';
const Option = Select.Option;
@connect(
    state => {
        const { project: { projectImage = {} } = {}, platform } = state;
        return { ...projectImage, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            {
                ...actions,
                ...platformActions
            },
            dispatch
        )
    })
)
export default class VolunteerManage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '', // 选中项目code
            treetypeoption: [], // 所有树种包含全部
            treetypelist: [], // 所有树种
            sectionsData: [] // 所有标段
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeList,
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            treetypes,
            platform: { tree = {} }
        } = this.props;
        try {
            if (!treetypes) {
                getTreeList().then(x => this.setTreeTypeOption(x));
                if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
                    let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                    let totalThinClass = data.totalThinClass || [];
                    let projectList = data.projectList || [];
                    // 获取所有的小班数据，用来计算养护任务的位置
                    await getTotalThinClass(totalThinClass);
                    // 区域地块树
                    await getThinClassTree(projectList);
                }
                let defaultProject = await getDefaultProject();
                if (defaultProject) {
                    this.onSelect([defaultProject]);
                }
                // 类型
                let typeoption = [
                    <Option key={'全部'} value={''} title={'全部'}>
                        全部
                    </Option>,
                    <Option key={'常绿乔木'} value={'1'} title={'常绿乔木'}>
                        常绿乔木
                    </Option>,
                    <Option key={'落叶乔木'} value={'2'} title={'落叶乔木'}>
                        落叶乔木
                    </Option>,
                    <Option key={'亚乔木'} value={'3'} title={'亚乔木'}>
                        亚乔木
                    </Option>,
                    <Option key={'灌木'} value={'4'} title={'灌木'}>
                        灌木
                    </Option>,
                    <Option key={'地被'} value={'5'} title={'地被'}>
                        地被
                    </Option>
                ];
                this.setState({ typeoption });
            }
        } catch (e) {

        }
    }

    render () {
        let { tree = {} } = this.props.platform;
        let { leftkeycode } = this.state;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='志愿者管理' {...this.props} />
                    <Sidebar>
                        <TreeProjectList
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Table {...this.props} {...this.state}
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                            typeselect={this.typeselect.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
    onSelect (keys) {
        const {
            platform: { tree = {} }
        } = this.props;
        try {
            let treeList = tree.thinClassTree;
            let keycode = keys[0] || '';
            const {
                actions: { setkeycode }
            } = this.props;
            let sectionsData = [];
            if (keycode) {
                treeList.map((treeData) => {
                    if (keycode === treeData.No) {
                        sectionsData = treeData.children;
                    }
                });
                setkeycode(keycode);
                this.setState({
                    leftkeycode: keycode,
                    sectionsData
                });
                // 树种
                this.typeselect('');

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
        } catch (e) {
            console.log('onSelect', e);
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
    // 设置树种选项
    setTreeTypeOption (rst) {
        if (rst instanceof Array) {
            let treetypeoption = rst.map(item => {
                return (
                    <Option key={item.id} value={item.ID} title={item.TreeTypeName}>
                        {item.TreeTypeName}
                    </Option>
                );
            });
            treetypeoption.unshift(
                <Option key={'全部'} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({ treetypeoption, treetypelist: rst });
        }
    }
    // 标段选择
    sectionSelect (value) {
        const {
            sectionsData
        } = this.state;
        sectionsData.map((sectionData) => {
            if (value === sectionData.No) {
                let smallClassesData = sectionData.children;
                this.setState({
                    smallClassesData
                });
                this.setSmallClassOption(smallClassesData);
            }
        });
    }
    // 小班选择
    smallClassSelect (value) {
        const {
            smallClassesData
        } = this.state;
        smallClassesData.map((smallClassData) => {
            if (value === smallClassData.No) {
                let thinClassesData = smallClassData.children;
                this.setState({
                    thinClassesData
                });
                this.setThinClassOption(thinClassesData);
            }
        });
    }
    // 细班选择
    thinClassSelect () {

    }
    // 树种选择
    typeselect (value) {
        const { treetypes = [] } = this.props;
        this.setState({ bigType: value });
        let selectTreeType = [];
        treetypes.map(item => {
            if (item.TreeTypeNo == null) {
            }
            if (item.TreeTypeNo) {
                try {
                    let code = item.TreeTypeNo.substr(0, 1);
                    if (code === value) {
                        selectTreeType.push(item);
                    }
                } catch (e) {}
            }
        });
    }
}
