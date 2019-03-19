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
    Content,
    DynamicTitle,
    Sidebar
} from '_platform/components/layout';
import { NurseryFrom, NurseryGlobal } from '../components/NurserySourseAna';
import { getDefaultProject } from '_platform/auth';
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
export default class NurserySourseAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: ''
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
                    <DynamicTitle title='苗木来源地分析' {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <Tabs type='card' tabBarGutter={10}>
                            <TabPane tab='苗圃总览' key='1'>
                                <NurseryGlobal {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='苗源地分析' key='2'>
                                <NurseryFrom {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }

    onSelect (keys) {
        let keycode = keys[0] || '';
        if (keycode) {
            this.setState({
                leftkeycode: keycode
            });
        }
    }
}
