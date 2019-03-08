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
import { PlantStrength } from '../components/PlantStrengthAnalysi';
import { getAreaTreeData, getDefaultProject } from '_platform/auth';
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
export default class PlantStrengthAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目
            sectionList: [] // 标段列表
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
        try {
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
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        const {
            platform: { tree = {} }
        } = this.props;
        const {
            leftkeycode
        } = this.state;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList;
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title='栽植进度分析' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <PlantStrength
                            {...this.props}
                            {...this.state}
                        />
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
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
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
