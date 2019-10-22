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
import { getDefaultProject } from '_platform/auth';
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
            treeList: [], // 树列表
            tabPane: '1', // 该次标签
            sectionList: [], // 标段列表
            leftkeycode: '' // 项目code
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList
            },
            platform: { tree = {} }
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
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
        const { leftkeycode, treeList, tabPane } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='进场强度分析' {...this.props} />
                    <Sidebar>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Tabs type='card' activeKey={tabPane} tabBarGutter={10} onChange={this.handleTabPane.bind(this)}>
                            <TabPane tab='车辆包分析' key='1'>
                                <VehicleAnalysi {...this.props} {...this.state} />
                            </TabPane><TabPane tab='苗木分析' key='2'>
                                <NurseryAnalysi {...this.props} {...this.state} />
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
