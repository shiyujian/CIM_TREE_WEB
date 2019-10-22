import React, { Component } from 'react';
import { DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs } from 'antd';
import {ORGTYPE} from '_platform/api';
import { actions } from '../store/dispatch';
import {ReceivePage, SendPage} from '../components/Dispatch';
import {getCompanyDataByOrgCode, getUser} from '_platform/auth';
const TabPane = Tabs.TabPane;

@connect(
    state => {
        const {
            overall: {
                dispatch = {}
            },
            platform
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
            orgTreeArrList: [],
            companyList: [],
            parentOrgID: undefined,
            permission: false,
            personOrgID: ''
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getOrgTree,
                getOrgTreeByOrgType,
                getParentOrgTreeByID,
                setGetMessageStatus
            }
        } = this.props;
        await setGetMessageStatus(false);
        const user = getUser();
        console.log('user', user);
        let permission = false;
        let parentOrgID = '';
        let personOrgID = '';
        if (user.username === 'admin') {
            permission = true;
        }
        if (!permission) {
            // 获取登录用户的公司的信息
            personOrgID = user.org;
            // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
            let parentOrgData = await getCompanyDataByOrgCode(personOrgID, getParentOrgTreeByID);
            // 如果在公司下，则获取公司所有的信息
            if (parentOrgData && parentOrgData.ID) {
                parentOrgID = parentOrgData.ID;
            }
        }
        let orgTreeArrList = await getOrgTree();
        this.setState({
            orgTreeArrList
        });
        let companyList = [];
        for (let i = 0; i < ORGTYPE.length; i++) {
            let type = ORGTYPE[i];
            let orgData = await getOrgTreeByOrgType({orgtype: type});
            if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
                if (orgData.content && orgData.content instanceof Array) {
                    companyList = companyList.concat(orgData.content);
                }
            }
        }
        console.log('companyList', companyList);
        this.setState({
            orgTreeArrList,
            companyList,
            parentOrgID,
            permission,
            personOrgID
        });
        await setGetMessageStatus(true);
    }

    render () {
        return (
            <div style={{ overflow: 'hidden', padding: 20 }}>
                <DynamicTitle title='现场收发文' {...this.props} />
                <Tabs>
                    <TabPane tab='收文管理' key='1'>
                        <ReceivePage {...this.props} {...this.state} />
                    </TabPane>
                    <TabPane tab='发文管理' key='2'>
                        <SendPage {...this.props} {...this.state} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
