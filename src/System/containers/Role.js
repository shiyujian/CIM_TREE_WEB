import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions, actions3 } from '../store/role';
import { actions as actions2 } from '../store/coop';
import { Table, Member, Addition } from '../components/Role';

@connect(
    state => {
        const {
            system: { role = {} },
            platform
        } = state;
        return { ...role, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...actions2, ...actions3 },
            dispatch
        )
    })
)
export default class Role extends Component {
    static propTypes = {};
    render () {
        return (
            <div style={{ overflow: 'hidden', padding: 20 }}>
                <DynamicTitle title='角色设置' {...this.props} />
                <Table {...this.props} />
                <Member {...this.props} />
                <Addition {...this.props} />
            </div>
        );
    }
}
