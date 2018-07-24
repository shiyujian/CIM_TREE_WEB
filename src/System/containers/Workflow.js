import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { FlowContainer } from '_platform/modules/FlowDesign';
// import {actions} from '../store/workflow';
import { actions as platformActions } from '_platform/store/global';
// import {Type, Info} from '../components/workflow';

const Flow = FlowContainer.Flow;

@connect(
    state => {
        const { system: platform } = state;
        return platform;
    },
    dispatch => ({
        actions: bindActionCreators({ ...platformActions }, dispatch)
    })
)
export default class Workflow extends Component {
    static propTypes = {};

    render () {
        return (
            <div>
                <DynamicTitle title='流程设置' {...this.props} />
                <Content>
                    <Flow />
                </Content>
            </div>
        );
    }
}
