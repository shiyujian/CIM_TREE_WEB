import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../store';
import { actions as platformActions } from '_platform/store/global';
import DashboardPage from '../components/DashboardPage';
@connect(
    state => {
        const { dashboard, platform } = state;
        return { ...dashboard, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class OnSite extends Component {
    render () {
        return <DashboardPage {...this.props} {...this.state} />;
    }
}
