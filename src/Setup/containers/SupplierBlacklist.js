import React, { Component } from 'react';
import { TablePerson, PersonModify } from '../components/PersonBlacklist';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions } from '../store/personBlacklist';

@connect(
    state => {
        const {
            platform,
            setup: { personBlacklist }
        } = state;
        return { platform, ...personBlacklist };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class SupplierBlacklist extends Component {
    componentDidMount = async () => {
    }
    render () {
        return (
            <div>
                <DynamicTitle title='供应商黑名单' {...this.props} />
                <Content>
                   123
                </Content>
            </div>
        );
    }
}
