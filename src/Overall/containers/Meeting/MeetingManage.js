import React, { Component } from 'react';
import { DynamicTitle, Content, Sidebar } from '_platform/components/layout';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getCompanyDataByOrgCode, getUser} from '_platform/auth';
import { actions as platformActions } from '_platform/store/global';
import * as previewActions from '_platform/store/global/preview';
import { actions } from '../../store/Meeting/meetingmanage';
import { TableList, SimpleTree } from '../../components/Meeting/MeetingManage';

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
            leftKeyCode: '',
            permission: false,
            parentOrgID: ''
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getOrgTree,
                getParentOrgTreeByID
            }
        } = this.props;
        const user = getUser();
        // 管理员可以查看全部，其他人只能查看自己公司
        let permission = false;
        if (user.username === 'admin') {
            permission = true;
        }
        let parentOrgID = '';
        if (permission) {
            await getOrgTree();
        } else {
            // 获取登录用户的公司的信息
            let orgID = user.org;
            // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
            let parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
            // 如果在公司下，则获取公司所有的信息
            if (parentOrgData && parentOrgData.ID) {
                parentOrgID = parentOrgData.ID;
            }
        }
        this.setState({
            permission,
            parentOrgID
        });
    }
    // 目录选择
    onSelect (value = [], e) {
        this.setState({
            leftKeyCode: value[0]
        });
    }
    render () {
        const {
            permission
        } = this.state;
        return (
            <div>
                <DynamicTitle title='会议管理' {...this.props} />
                {
                    permission
                        ? (
                            <Sidebar>
                                <SimpleTree
                                    {...this.props}
                                    {...this.state}
                                    onSelect={this.onSelect.bind(this)}
                                />
                            </Sidebar>
                        ) : ''
                }

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
