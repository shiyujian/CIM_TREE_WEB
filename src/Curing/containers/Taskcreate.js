import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/taskCreate';
import { actions as platformActions } from '_platform/store/global';
import { TaskCreateTable } from '../components/TaskCreate';
@connect(
    state => {
        const {
            curing: { taskCreate = {} },
            platform
        } = state;
        return { ...taskCreate, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class TaskCreate extends Component {
    render () {
        return <TaskCreateTable {...this.props} />;
    }
}
