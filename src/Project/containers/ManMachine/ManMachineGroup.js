import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TreeSelect, Notification } from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import * as actions from '../../store/ManMachine/manMachineGroup';
import { getCompanyDataByOrgCode, getUser } from '_platform/auth';
import {
    AsideTree,
    ManMachineGroupTable
} from '../../components/ManMachine/ManMachineGroup';
@connect(
    state => {
        const {
            project: {
                manMachineGroup = {}
            },
            platform
        } = state;
        return { ...manMachineGroup, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class ManMachineGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userOrgID: '',
            companyOrgID: '',
            parentData: ''
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getChildOrgTreeByID,
                getParentOrgTreeByID,
                changeAsideTreeLoading,
                getWorkGroup,
                getWorkGroupOK,
                changeSelectState,
                changeSelectMemGroup
            }
        } = this.props;
        try {
            // redux中左侧考勤群体树的选中节点初始化
            await changeSelectMemGroup();
            // 左侧考勤群体树的节点选中状态初始化
            await changeSelectState(false);
            // 左侧考勤群体树的数据初始化
            await getWorkGroupOK([]);
            // 左侧考勤群体树的loading效果初始化
            await changeAsideTreeLoading(true);

            // 获取用户的公司信息
            let user = getUser();
            let userOrgID = '';
            let companyOrgID = '';
            let parentData = '';
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                userOrgID = user.org;
                parentData = await getCompanyDataByOrgCode(userOrgID, getParentOrgTreeByID);
                if (parentData && parentData.ID) {
                    companyOrgID = parentData.ID;
                    // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                    let postData = {
                        orgid: companyOrgID
                    };
                    await getWorkGroup({}, postData);
                    // 在关联人员时需要根据各个部门来查找人员，所以需要根据公司的code查找公司内的组织机构
                    await getChildOrgTreeByID({id: companyOrgID});
                } else {
                    Notification.warning({
                        message: '当前用户不在公司下，请重新登录',
                        duration: 3
                    });
                }
            }

            await changeAsideTreeLoading(false);
            this.setState({
                userOrgID,
                companyOrgID,
                parentData
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        return (
            <Body>
                <Main>
                    <DynamicTitle title='班组维护' {...this.props} />
                    <Sidebar>
                        <AsideTree
                            {...this.props}
                            {...this.state}
                        />
                    </Sidebar>
                    <Content>
                        <ManMachineGroupTable
                            {...this.props}
                            {...this.state}
                        />
                    </Content>
                </Main>
            </Body>

        );
    }
}
