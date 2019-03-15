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
import { PositionProgress } from '../components/PlantStrengthAnalysi';
import { PlantProgress } from '../components/PlantStrengthAnalysi';
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
    constructor(props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目
            sectionList: [], // 标段列表
            treetypeoption: [],
            typeoption: []
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree,
                getTreeList
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
        } catch (e) {
            console.log('e', e);
        }
    }

    render() {
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
                            <TabPane tab='树种统计' key='3'>
                                <PlantStrength
                                    {...this.props}
                                    {...this.state}
                                    typeselect={this.typeselect.bind(this)}
                                />
                            </TabPane>
                            <TabPane tab='种植进度分析' key='2'>
                                <PlantProgress {...this.props} {...this.state}/>
                            </TabPane>
                            <TabPane tab='定位进度分析' key='1'>
                                <PositionProgress {...this.props} {...this.state}/>
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }

    // 设置树种选项
    setTreeTypeOption(rst) {
        debugger
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

    // 类型选择, 重新获取: 树种
    typeselect(value) {
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

    onSelect(keys) {
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
