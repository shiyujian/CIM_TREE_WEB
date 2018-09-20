import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceGroup';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    AttendanceGroupTable,
    AsideTree
} from '../components/AttendanceGroup';
import './index.less';
@connect(
    state => {
        const { checkwork: { attendanceGroup = {} }, platform } = state;
        return { ...attendanceGroup, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class AttendanceGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {}

    render () {
        return (       
            <div className='taskTeam-Layout'>
                <AsideTree {...this.props} {...this.state} className='aside-Layout'/>
                <div className='table-Layout'>
                    <AttendanceGroupTable {...this.props} {...this.state} />
                </div>
            </div>
               
        );
    }
}
