import React, { Component } from 'react';
import { DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/news';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import NewsTable from '../components/News/NewsTable';
import NoticeTable from '../components/News/NoticeTable';

const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {
            overall: { news = {} },
            platform
        } = state || {};
        return { ...news, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class News extends Component {
    static propTypes = {};
    array = [];
    constructor (props) {
        super(props);
        this.state = {
            publicUnit: []
        };
    }
    async componentDidMount () {
        const {
            actions: { setTabActive }
        } = this.props;
        setTabActive('1');
    }

    // 新闻和通知的切换
    tabChange (tabValue) {
        const {
            actions: { setTabActive }
        } = this.props;
        setTabActive(tabValue);
    }

    render () {
        const { tabValue = '1' } = this.props;
        return (
            <div style={{ overflow: 'hidden', padding: 20 }}>
                <DynamicTitle title='新闻通知' {...this.props} />

                <Tabs activeKey={tabValue} onChange={this.tabChange.bind(this)}>
                    <TabPane tab='新闻管理' key='1'>
                        <NewsTable {...this.props} array={this.array} />
                    </TabPane>
                    <TabPane tab='通知管理' key='2'>
                        <NoticeTable {...this.props} array={this.array} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
