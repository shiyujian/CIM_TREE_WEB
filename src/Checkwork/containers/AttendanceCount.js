import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceCount';
import { actions as platformActions } from '_platform/store/global';
import { CountTable } from '../components/AttendanceCount';
@connect(
    state => {
        const { checkwork: { attendanceCount = {} }, platform } = state;
        return { ...attendanceCount, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class AttendanceCount extends Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount () {

    }

    render () {
        return (
            <div style={{overflow: 'hidden', padding: '0 20px', marginLeft: '160px', marginTop: '20px'}}>
                <CountTable {...this.props} {...this.state} />
            </div>
        );
    }
}
