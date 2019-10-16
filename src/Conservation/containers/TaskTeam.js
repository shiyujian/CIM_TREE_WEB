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
import './index.less';

@connect(
    state => {
        const {
            conservation: { taskTeam = {} },
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
            <div className='taskTeam-Layout'>
                <AsideTree className='aside-Layout'
                    {...this.props}
                />
                {/* <Content> */}
                <div className='table-Layout'>
                    <TaskTeamTable
                        {...this.props} {...this.state} />
                </div>

                {/* </Content> */}
            </div>
        );
    }
}
