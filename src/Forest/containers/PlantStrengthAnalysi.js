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
            leftkeycode: '', // 项目
            sectionList: [], // 标段列表
            treetypeList: [], // 树种类型
            treeCategory: [] // 树种大类
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
        }
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            await getTotalThinClass(totalThinClass); // 获取所有的小班数据，用来计算养护任务的位置
            await getThinClassTree(projectList); // 区域地块树
        }
        let defaultProject = await getDefaultProject();
        if (defaultProject) {
            this.onSelect([defaultProject]);
        }
        // 类型
        const treeCategory = [{
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
        this.setState({ treeCategory });
    }
    componentWillReceiveProps (nextProps) {
        const { tree } = nextProps.platform;
        if (tree) {
            this.setState({
                treeList: tree.bigTreeList
            });
        }
    }
    render () {
        const { leftkeycode, treeList } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='栽植强度分析' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Tabs type='card' tabBarGutter={10}>
                            <TabPane tab='种植进度分析' key='2'>
                                <PlantProgress {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='树种统计' key='1'>
                                {/* <PlantStrength
                                    {...this.props}
                                    {...this.state}
                                    typeselect={this.typeselect.bind(this)}
                                /> */}
                            </TabPane>
                            <TabPane tab='定位进度分析' key='3'>
                                {/* <PositionProgress {...this.props} {...this.state} /> */}
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
    // 设置树种选项
    setTreeTypeOption (rst) {
        console.log('rst树种', rst);
        let treetypeList = [];
        rst.map(item => {
            treetypeList.push({
                ID: item.ID,
                TreeTypeName: item.TreeTypeName,
                TreeTypeNo: item.TreeTypeNo
            });
        });
        this.setState({
            treetypeList
        });
    }
    // 类型选择, 重新获取: 树种
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
                } catch (e) { }
            }
        });
        this.setTreeTypeOption(selectTreeType);
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
