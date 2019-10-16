import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/role';
import { Table } from '../components/Role';

@connect(
    state => {
        const {
            setup: { role = {} },
            platform
        } = state;
        return { ...role, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
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
            </div>
        );
    }
}
