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
        console.log(tree, '树数据');
        if (tree.thinClassTree) {
            treeList = tree.thinClassTree;
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
    onSelect () {

    }
}
