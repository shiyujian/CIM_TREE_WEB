import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/electronicFence';
import { actions as platformActions } from '_platform/store/global';
import { TaskCreateTable } from '../components/ElectronicFence';

import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
@connect(
    state => {
        const { checkwork:{ electronicFence = {} }, platform } = state;
        return { ...electronicFence, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class ElectronicFence extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {}

    render () {
        return (
            <TaskCreateTable {...this.props} />        
        );
    }
}
