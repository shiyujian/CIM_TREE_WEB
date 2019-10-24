import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Tabs } from 'antd';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../../store/Meeting/meetingmanage';
import { TableList } from '../../components/Meeting/MeetingManage';

@connect(
    state => {
        const {
            overall: { meetingmanage = {} },
            platform
        } = state;
        return { platform, ...meetingmanage };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...previewActions, ...actions },
            dispatch
        )
    })
)
export default class BasicRules extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount = () => {
    }
    render () {
        return (
            <div>
                <DynamicTitle title='会议管理' {...this.props} />
                <Content>
                    <TableList
                        {...this.props}
                        {...this.state}
                    />
                </Content>
            </div>
        );
    }
}
