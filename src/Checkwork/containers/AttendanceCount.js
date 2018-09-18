import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceCount';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
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

    componentDidMount () {}

    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='考勤统计' {...this.props} />
                    <Content>
                      
                    </Content>
                </Main>
            </Body>
        );
    }
}
