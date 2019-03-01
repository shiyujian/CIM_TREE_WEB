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
import { NurseryAnalysi, VehicleAnalysi } from '../components/EnterStrengthAnalysi';
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
export default class EnterStrengthAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
    }

    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='进场强度分析' {...this.props} />
                    <Content>
                        <Tabs type='card' tabBarGutter={10}>
                            <TabPane tab='苗木分析' key='2'>
                                <NurseryAnalysi {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='车辆包分析' key='1'>
                                <VehicleAnalysi {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
}
