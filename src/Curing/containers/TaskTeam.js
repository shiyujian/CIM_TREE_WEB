import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reducer, { actions } from '../store/taskTeam';
import { actions as platformActions } from '_platform/store/global';
import {
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    TaskTeamTable,
    AsideTree
} from '../components/TaskTeam';

@connect(
    state => {
        const {
            curing: { taskTeam = {} },
            platform
        } =
            state || {};
        return { ...taskTeam, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class TaskTeam extends Component {
    render () {
        return (
            <div>
                <DynamicTitle title='养护班组' {...this.props} />
                <Sidebar>
                    <AsideTree
                        {...this.props}
                    />
                </Sidebar>
                <Content>
                    <TaskTeamTable {...this.props} {...this.state} />
                </Content>
            </div>
        );
    }
}
