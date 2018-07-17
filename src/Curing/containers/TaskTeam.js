import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
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
        const { platform } = state;
        return { platform };
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
            <Body>
                <Main>
                    <DynamicTitle title='养护班组' {...this.props} />
                    <Sidebar>
                        <AsideTree
                            {...this.props}
                            // treeData={tree}
                            // selectedKeys={keycode}
                            // onSelect={this.onSelect.bind(this)}
                            // {...this.state}
                        />
                    </Sidebar>
                    <Content>
                        <TaskTeamTable {...this.props} {...this.state} />
                    </Content>
                </Main>
            </Body>
        );
    }
}
