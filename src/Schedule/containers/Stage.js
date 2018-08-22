import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { getUser } from '_platform/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import './Schedule.less';
import { Link } from 'react-router-dom';
import { WORKFLOW_CODE } from '_platform/api';
import queryString from 'query-string';
import { Stagereporttab, All, Plan } from '../components/stagereport';
import { PkCodeTree, Cards } from '../components';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import reducer, { actions } from '../store/stage';

import {
    Tabs
} from 'antd';
const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {
            schedule: { stage = {} },
            platform
        } = state;
        return { platform, ...stage };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...previewActions, ...actions },
            dispatch
        )
    })
)
export default class Stage extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            treetyoption: [],
            treeLists: [],
            leftkeycode: ''
        };
    }

    async componentDidMount () {
        const {
            actions: {
                getScheduleTaskList
            },
            platform: { tree = {} }
        } = this.props;

        if (!tree.scheduleTaskList) {
            let data = await getScheduleTaskList();
            if (data && data instanceof Array && data.length > 0) {
                data = data[0];
                let leftkeycode = data.No ? data.No : '';
                this.setState({
                    leftkeycode
                });
            }
        } else {
            let data = tree.projectList;
            if (data && data instanceof Array && data.length > 0) {
                data = data[0];
                let leftkeycode = data.No ? data.No : '';
                this.setState({
                    leftkeycode
                });
            }
        }
    }

    render () {
        const { leftkeycode } = this.state;
        const {
            platform: { tree = {} }
        } = this.props;
        let treeList = [];
        if (tree.scheduleTaskList) {
            treeList = tree.scheduleTaskList;
        }
        console.log('tree', tree);
        return (
            <div>
                <DynamicTitle title='进度填报' {...this.props} />
                <Sidebar>
                    <div
                        style={{ overflow: 'hidden' }}
                        className='project-tree'
                    >
                        <PkCodeTree
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            // onExpand={this.onExpand.bind(this)}
                        />
                    </div>
                </Sidebar>
                <Content>
                    <div>
                        <Tabs>
                            <TabPane tab='总计划进度' key='1'>
                                <All {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='每日计划进度' key='2'>
                                <Plan {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='每日实际进度' key='3'>
                                <Stagereporttab
                                    {...this.props}
                                    {...this.state}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </Content>
            </div>
        );
    }

    // 树选择
    onSelect (value = []) {
        console.log('stagestage选择的树节点', value);
        let keycode = value[0] || '';
        const {
            actions: { getTreeList, gettreetype }
        } = this.props;
        this.setState({ leftkeycode: keycode });
    }
}

// 连接树children
function getNewTreeData (treeData, curKey, child) {
    const loop = data => {
        data.forEach(item => {
            if (curKey == item.No) {
                item.children = child;
            } else {
                if (item.children) loop(item.children);
            }
        });
    };
    try {
        loop(treeData);
    } catch (e) {
        console.log(e);
    }
}
