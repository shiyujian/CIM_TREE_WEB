
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/thinClassStorage';
import { Table } from '../components/ThinClassStorage';

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
class ThinClassStorage extends Component {
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
                <DynamicTitle title='细班导入' {...this.props} />
                <Table {...this.props} />
            </div>
        );
    }
}

export default ThinClassStorage;
