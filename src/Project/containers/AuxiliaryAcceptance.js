import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import reducer, { actions } from '../store/auxiliaryAcceptance';
import AuxiliaryAcceptanceGis from '../components/AuxiliaryAcceptance/AuxiliaryAcceptanceGis.js';

@connect(
    state => {
        const { project: { auxiliaryAcceptance = {} } = {}, platform } = state;
        return { ...auxiliaryAcceptance, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            {
                ...actions,
                ...platformActions
            },
            dispatch
        )
    })
)
export default class AuxiliaryAcceptance extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {

    }

    render () {
        return (
            <div>
                <AuxiliaryAcceptanceGis {...this.props} {...this.state} />
            </div>
        );
    }
}
