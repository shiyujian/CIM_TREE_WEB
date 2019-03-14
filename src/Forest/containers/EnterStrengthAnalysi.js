import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import * as actions from '../store';
import { PkCodeTree } from '../components';
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
    getDefaultProject,
    getUserIsManager
} from '_platform/auth';
import { NurseryAnalysi, VehicleAnalysi } from '../components/EnterStrengthAnalysi';
const TabPane = Tabs.TabPane;
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
export default class EnterStrengthAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: ''
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getTotalThinClass,
                getThinClassTree,
                getThinClassList,
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
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
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
        this.typeselect('')

        // 标段
        let sections = JSON.parse(user.sections);
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

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
        }
        const {
            leftkeycode
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='进场强度分析' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Tabs type='card' tabBarGutter={10}>
                            <TabPane tab='苗木分析' key='2'>
                                <NurseryAnalysi {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='车辆包分析' key='1'>
                                <VehicleAnalysi {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
}
