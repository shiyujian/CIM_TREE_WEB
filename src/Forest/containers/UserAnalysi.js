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
import { AccountPandect, SectionAlone } from '../components/UserAnalysi';
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
export default class UserAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tabPane: '1' // 该次标签
        };
    }

    componentDidMount = async () => {
    }

    render () {
        const { tabPane } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='用户分析' {...this.props} />
                    <Content>
                        <Tabs type='card' activeKey={tabPane} tabBarGutter={10} onChange={this.handleTabPane.bind(this)}>
                            <TabPane tab='账号总览' key='1'>
                                <AccountPandect {...this.props} {...this.state} />
                            </TabPane>
                            <TabPane tab='标段分览' key='2'>
                                <SectionAlone {...this.props} {...this.state} />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Main>
            </Body>
        );
    }
    handleTabPane (key) {
        this.setState({
            tabPane: key
        });
    }
}
