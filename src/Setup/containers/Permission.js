import React, { Component } from 'react';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../store/permission';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { Roles, Table } from '../components/Permission';

@connect(
    state => {
        const { setup: { permission = {} } = {}, platform } = state;
        return { ...permission, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Permission extends Component {
    static propTypes = {};

    render () {
        const {} = this.props;

        return (
            <div>
                <DynamicTitle title='权限设置' {...this.props} />
                <Sidebar>
                    <Roles {...this.props} />
                </Sidebar>
                <Content>
                    <Table {...this.props} />
                </Content>
            </div>
        );
    }
}
