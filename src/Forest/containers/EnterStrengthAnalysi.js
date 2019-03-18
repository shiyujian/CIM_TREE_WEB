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
            treeList: [], // 树列表数据
            sectionList: [], // 标段列表
            leftkeycode: '' // 项目code
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getTotalThinClass,
                getThinClassTree,
                getThinClassList
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
                            <TabPane tab='车辆包分析' key='1'>
                                <VehicleAnalysi {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='苗木分析' key='2'>
                                <NurseryAnalysi {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
    // 树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect (keys) {
        const { treeList } = this.state;
        let leftkeycode = keys[0] || '';
        let sectionList = [];
        treeList.map(item => {
            if (item.No === leftkeycode) {
                sectionList = item.children;
            }
        });
        this.setState({
            leftkeycode,
            sectionList
        });
    }
}
