import React, { Component } from 'react';
import { DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import { actions } from '../store/dispatch';
import { getUser } from '_platform/auth';
const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {
            platform,
            overall: { dispatch = {} }
        } = state || {};
        return { ...dispatch, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Dispatch extends Component {
    constructor (props) {
        super(props);
        this.state = {
            datas: [],
            orgList: []
        };
    }
    static propTypes = {};

    componentDidMount () {
        const {
            actions: { getReceiveInfoAc, getSentInfoAc, getOrgTree }
        } = this.props;
        const user = getUser();
        let orgCode = user.org;
        if (orgCode) {
            let orgListCodes = orgCode.split('_');
            orgListCodes.pop();
            let codeu = orgListCodes.join();
            let ucode = codeu.replace(/,/g, '_');
            getOrgTree().then(item => {
                if (user.username === 'admin') {
                    getReceiveInfoAc({
                        user: encodeURIComponent('admin')
                    });
                } else {
                    getReceiveInfoAc({
                        user: encodeURIComponent(ucode)
                    });
                }
                if (user.username === 'admin') {
                    getSentInfoAc({
                        user: encodeURIComponent('admin')
                    });
                } else {
                    getSentInfoAc({
                        user: encodeURIComponent(ucode)
                    });
                }
                this.setState({
                    orgList: item
                });
            });
        }
    }
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
                <DynamicTitle title='现场收发文' {...this.props} />
                现场收发文
            </div>
        );
    }
}
