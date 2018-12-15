import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { CuringTable } from '../components/CuringInfo';
import { actions as platformActions } from '_platform/store/global';
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
    getUserIsManager
} from '_platform/auth';
const Option = Select.Option;
@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class CuringInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            leftkeycode: '',
            resetkey: 0,
            curingTypesOption: [],
            sectionsData: [],
            smallClassesData: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getForestUsers,
                getTreeNodeList,
                setkeycode,
                getCuringTypes,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            users,
            platform: { tree = {} }
        } = this.props;
        // 避免反复获取森林用户数据，提高效率
        if (!users) {
            getForestUsers();
        }
        getCuringTypes().then((curingTypesData) => {
            let curingTypes = curingTypesData && curingTypesData.content;
            let curingTypesOption = [];
            try {
                curingTypes.map((type) => {
                    curingTypesOption.push(<Option title={type.Base_Name} key={type.ID} value={type.ID}>{type.Base_Name}</Option>);
                });
                this.setState({
                    curingTypesOption
                });
            } catch (e) {
                console.log('获取养护类型', e);
            }
        });
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }

        setkeycode('');
    }

    render () {
        const { keycode } = this.props;
        const {
            leftkeycode,
            sectionoption,
            smallclassoption,
            thinclassoption,
            resetkey,
            curingTypesOption
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
                    <DynamicTitle title='养护信息' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <CuringTable
                            key={resetkey}
                            {...this.props}
                            sectionoption={sectionoption}
                            sectionSelect={this.sectionSelect.bind(this)}
                            smallclassoption={smallclassoption}
                            smallClassSelect={this.smallClassSelect.bind(this)}
                            thinclassoption={thinclassoption}
                            thinClassSelect={this.thinClassSelect.bind(this)}
                            leftkeycode={leftkeycode}
                            keycode={keycode}
                            resetinput={this.resetinput.bind(this)}
                            curingTypesOption={curingTypesOption}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys = [], info) {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = tree.thinClassTree;

        let user = getUser();
        let keycode = keys[0] || '';
        const {
            actions: { setkeycode }
        } = this.props;
        setkeycode(keycode);
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
        let sections = JSON.parse(user.sections);
        console.log('sections', sections);
        let permission = getUserIsManager();
        if (permission) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else {
            sectionsData.map((sectionData) => {
                if (sections[0] === sectionData.No) {
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
            this.setState({ smallclassoption: smallclassOptions });
        }
    }

    // 小班选择, 重新获取: 细班
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
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }
}
