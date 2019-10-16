import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/taskReport';
import { actions as platformActions } from '_platform/store/global';
import { TaskReportTable } from '../components/TaskReport';
@connect(
    state => {
        const {
            conservation: { taskReport = {} },
            platform
        } = state;
        return { ...taskReport, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class TaskReport extends Component {
    render () {
        return <TaskReportTable {...this.props} />;
    }
}
