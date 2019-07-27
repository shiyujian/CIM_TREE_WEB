import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Schedule.less';
import { NodeTable } from '../components/NodeManage';
import { Spin, Tabs } from 'antd';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../store/nodeManage';
import { getUser } from '_platform/auth';
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
class NodeManage extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    render () {
        return (<div
            style={{
                padding: 20,
                height: 'calc(100% - 37px)',
                minHeight: '505px',
                overflowY: 'auto'
            }}
        >
            <DynamicTitle title='节点管理' {...this.props} />
            <NodeTable {...this.props} {...this.state} />
        </div>);
    }
}
export default NodeManage;
