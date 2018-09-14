
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
import { actions as platformActions } from '_platform/store/global';
import reducer, { actions } from '../store/nurseryManagement';
import { Table } from '../components/SupplierManagement';
@connect(
    state => {
        const {
            project: { nurseryManagement = {} },
            platform
        } = state || {};
        return { ...nurseryManagement, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Supplieranagement extends Component {
    static propTypes = {};

    render () {
        return (
            <div
                style={{
                    padding: 20,
                    height: 'calc(100% - 37px)',
                    minHeight: '505px',
                    overflowY: 'auto'
                }}
            >
                <DynamicTitle title='供应商管理' {...this.props} />
                <Table {...this.props} />
            </div>
        );
    }
}
