import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/taskStatis';
import { actions as platformActions } from '_platform/store/global';
import { TaskStatisPage } from '../components/TaskStatis';
@connect(
    state => {
        const {
            conservation: { taskStatis = {} },
            platform
        } = state;
        return { ...taskStatis, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class TaskStatis extends Component {
    render () {
        return <TaskStatisPage {...this.props} />;
    }
}
