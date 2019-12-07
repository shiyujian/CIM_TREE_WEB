import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../store';
import { actions as platformActions } from '_platform/store/global';
import OnSite from '../components/OnSite/OnSite';
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
export default class MapContainer extends Component {
    render () {
        return <OnSite {...this.props} {...this.state} />;
    }
}
