import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import * as actions from '../store';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { DataOverview, ActivityAnalysis } from '../components/UserAnalysis';
const TabPane = Tabs.TabPane;
@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class UserAnalysis extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
        try {
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='用户行为分析' {...this.props} />
                    <Content>
                        <Tabs type='card' size='large' tabBarGutter='10'>
                            <TabPane tab='数据概览' key='1'>
                                <DataOverview {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='活跃度分析' key='2'>
                                <ActivityAnalysis {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
}
