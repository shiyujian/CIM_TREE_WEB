import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
import { PROJECT_UNITS } from '_platform/api';
import { actions as platformActions } from '_platform/store/global';
import { DataStatisTable } from '../components/DataStatis';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUser,
    getAreaTreeData
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
export default class DataStatis extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '',
            resetkey: 0,
            typeoption: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            treetypeoption: [],
            sectionsData: [],
            smallClassesData: []
        };
    }

    componentDidMount = async () => {
        this.biaoduan = [];
        for (let i = 0; i < PROJECT_UNITS.length; i++) {
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            });
        }
        const {
            actions: {
                getTreeList,
                getForestUsers,
                getTreeNodeList,
                setkeycode,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            users,
            treetypes,
            platform: { tree = {} }
        } = this.props;
        try {
            // 避免反复获取森林用户数据，提高效率
            if (!users) {
                getForestUsers();
            }
            // 避免反复获取森林树种列表，提高效率
            if (!treetypes) {
                getTreeList().then(x => this.setTreeTypeOption(x));
            }
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
            // 类型
            let typeoption = [
                <Option key={'-1'} value={''} title={'全部'}>
                全部
                </Option>,
                <Option key={'1'} value={'1'} title={'常绿乔木'}>
                常绿乔木
                </Option>,
                <Option key={'2'} value={'2'} title={'落叶乔木'}>
                落叶乔木
                </Option>,
                <Option key={'3'} value={'3'} title={'亚乔木'}>
                亚乔木
                </Option>,
                <Option key={'4'} value={'4'} title={'灌木'}>
                灌木
                </Option>,
                <Option key={'5'} value={'5'} title={'地被'}>
                地被
                </Option>
            ];
            this.setState({ typeoption });
        } catch (e) {

        }
    }

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const {
            leftkeycode,
            resetkey
        } = this.state;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='数据统计' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <DataStatisTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            sectionselect={this.sectionselect.bind(this)}
                            smallclassselect={this.smallclassselect.bind(this)}
                            thinclassselect={this.thinclassselect.bind(this)}
                            resetinput={this.resetinput.bind(this)}
                            typeselect={this.typeselect.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }

    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys, info) {
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
        console.log('info', info);
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
        // 树种
        this.typeselect('');

        let sections = JSON.parse(user.sections);
        // 标段
        if (sections.length === 0) {
            // 是admin或者业主
            this.setSectionOption(sectionsData);
        } else {
            sectionsData.map((sectionData) => {
                if (sections[0] === sectionData) {
                    this.setSectionOption(sectionData);
                }
            });
        }
    }

    // 设置标段选项
    setSectionOption (rst) {
        if (rst instanceof Array) {
            let sectionOptions = [];
            rst.map(sec => {
                sectionOptions.push(
                    <Option key={sec.No} value={sec.No} title={sec.Name}>
                        {sec.Name}
                    </Option>
                );
            });
            this.setState({ sectionoption: sectionOptions });
        }
    }

    sectionselect (value) {
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
    smallclassselect (value) {
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
    thinclassselect (value) {
    }

    // 重置
    resetinput (leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode]);
        });
    }

    // 类型选择, 重新获取: 树种
    typeselect (value) {
        const { treetypes } = this.props;
        this.setState({ bigType: value });
        let selectTreeType = [];
        treetypes.map(item => {
            if (item.TreeTypeNo == null) {
                // console.log('itemitemitemitemitem',item)
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
        this.setTreeTypeOption(selectTreeType);
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
                <Option key={-1} value={''} title={'全部'}>
                        全部
                </Option>
            );
            this.setState({ treetypeoption, treetypelist: rst });
        }
    }
}
