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
import { PlantStrength, PositionProgress, PlantProgress } from '../components/PlantStrengthAnalysi';
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
class PlantStrengthAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeList: [], // 树列表
            leftkeycode: '', // 项目
            tabPane: '1', // 该次标签
            sectionList: [], // 标段列表
            treeTypeList: [], // 树种类型
            treeKindList: [], // 树种大类
            loading: false
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getTotalThinClass,
                getThinClassList,
                getThinClassTree,
                getTreeList
            },
            treetypes,
            platform: { tree = {} }
        } = this.props;
        if (!treetypes) {
            getTreeList().then(rep => this.setTreeTypeOption(rep));
        } else {
            this.setTreeTypeOption(treetypes);
        }
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            this.setState({
                loading: true
            });
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            await getTotalThinClass(totalThinClass); // 获取所有的小班数据，用来计算养护任务的位置
            await getThinClassTree(projectList); // 区域地块树
            this.setState({
                loading: false
            });
        }
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
        // 类型
        const treeKindList = [{
            value: '',
            title: '全部'
        }, {
            value: '1',
            title: '常绿乔木'
        }, {
            value: '2',
            title: '落叶乔木'
        }, {
            value: '3',
            title: '亚乔木'
        }, {
            value: '4',
            title: '灌木'
        }, {
            value: '5',
            title: '地被'
        }];
        this.setState({ treeKindList });
    }
    componentWillReceiveProps (nextProps) {
        const { tree } = nextProps.platform;
        if (tree) {
            console.log(2);
            this.setState({
                treeList: tree.bigTreeList
            });
        }
    }
    render () {
        const { leftkeycode, treeList, tabPane } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='栽植强度分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            {...this.props}
                            {...this.state}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Tabs type='card' activeKey={tabPane} tabBarGutter={10} onChange={this.handleTabPane.bind(this)}>
                            <TabPane tab='树种统计' key='1'>
                                <PlantStrength {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='种植进度分析' key='2'>
                                <PlantProgress {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='定位进度分析' key='3'>
                                <PositionProgress {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
    handleTabPane (key) {
        this.setState({
            tabPane: key
        });
    }
    // 设置树种选项
    setTreeTypeOption (rst) {
        let treeTypeList = [];
        rst.map(item => {
            treeTypeList.push({
                ID: item.ID,
                TreeTypeName: item.TreeTypeName,
                TreeTypeNo: item.TreeTypeNo
            });
        });
        this.setState({
            treeTypeList
        });
    }
    onSelect (keys) {
        const { tree } = this.props.platform;
        let leftkeycode = keys[0] || '';
        let sectionList = [];
        if (tree.thinClassTree) {
            tree.thinClassTree.map(item => {
                if (item.No === leftkeycode) {
                    sectionList = item.children;
                }
            });
        }
        this.setState({
            leftkeycode,
            sectionList
        });
    }
}
export default PlantStrengthAnalysi;
