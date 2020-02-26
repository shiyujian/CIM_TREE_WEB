import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../store/flowNode';
import { NodeTable } from '../components/FlowNode';
@connect(
    state => {
        const {
            setup: { flowNode = {} },
            platform
        } = state;
        return { platform, ...flowNode };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...previewActions, ...actions },
            dispatch
        )
    })
)

export default class FlowNode extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }
    render () {
        return (<div>
            <DynamicTitle title='流程节点' {...this.props} />
            <Content>
                <NodeTable {...this.props} {...this.state} />
            </Content>
        </div>);
    }
}
