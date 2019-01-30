import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/volunteerManage';
import { Table } from '../components/VolunteerManage';

@connect(
    state => {
        const { project: { projectImage = {} } = {}, platform } = state;
        return { ...projectImage, platform };
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
export default class VolunteerManage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {
        console.log('ssssss', this.props.actions);
    }

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
                <DynamicTitle title='志愿者管理' {...this.props} />
                <Table {...this.props} />
            </div>
        );
    }
}
