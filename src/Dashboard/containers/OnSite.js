import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store';
import { actions as platformActions } from '_platform/store/global';
import OnSiteCom from '../components/OnSite';
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
export default class OnSite extends Component {
    render () {
        return <OnSiteCom {...this.props} />;
    }
}
