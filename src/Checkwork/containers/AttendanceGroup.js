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
            <Body>
                <Main>
                    <DynamicTitle title='考勤群体' {...this.props} />
                    <Content>
                        <div>
                        考勤群体
                        </div>
                    </Content>
                </Main>
            </Body>
        );
    }
}