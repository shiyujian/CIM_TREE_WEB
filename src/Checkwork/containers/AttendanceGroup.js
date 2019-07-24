import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceGroup';
import { actions as platformActions } from '_platform/store/global';
import {
    AttendanceGroupTable,
    AsideTree
} from '../components/AttendanceGroup';
import { TreeSelect, Notification } from 'antd';
import { getCompanyDataByOrgCode, getUser } from '_platform/auth';
import './index.less';
const TreeNode = TreeSelect.TreeNode;
@connect(
    state => {
        const { checkwork: { attendanceGroup = {} }, platform } = state;
        return { ...attendanceGroup, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class AttendanceGroup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userOrgID: '',
            companyOrgID: '',
            parentData: '',
            orgTreeSelectData: []
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getChildOrgTreeByID,
                getParentOrgTreeByID,
                changeAsideTreeLoading,
                getCheckGroup,
                getCheckGroupOK,
                changeSelectState,
                getCheckGroupMansOk,
                changeSelectMemGroup,
                checkGroupMemChangeStatus
            }
        } = this.props;
        try {
            // 将redux中的群体中的人员进行初始化
            await getCheckGroupMansOk([]);
            // redux中左侧考勤群体树的选中节点初始化
            await changeSelectMemGroup();
            // 左侧考勤群体树的节点选中状态初始化
            await changeSelectState(false);
            // 人员是否更新的状态进行初始化
            await checkGroupMemChangeStatus();
            // 左侧考勤群体树的数据初始化
            await getCheckGroupOK([]);
            // 左侧考勤群体树的loading效果初始化
            await changeAsideTreeLoading(true);

            // 获取用户的公司信息
            let user = getUser();
            let userOrgID = '';
            let companyOrgID = '';
            let parentData = '';
            let companyDatas = '';
            let orgTreeSelectData = [];
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                userOrgID = user.org;
                parentData = await getCompanyDataByOrgCode(userOrgID, getParentOrgTreeByID);
                if (parentData && parentData.ID) {
                    companyOrgID = parentData.ID;
                    // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                    let postData = {
                        org_code: companyOrgID
                    };
                    await getCheckGroup({}, postData);
                    // 在关联人员时需要根据各个部门来查找人员，所以需要根据公司的code查找公司内的组织机构
                    companyDatas = await getChildOrgTreeByID({id: companyOrgID});
                    // 获取组织机构后，构建成TreeSelect
                    orgTreeSelectData = AttendanceGroup.orgloop([companyDatas]);
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
                parentData,
                orgTreeSelectData
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        return (
            <div className='AttendanceGroup-Layout'>
                <AsideTree
                    {...this.props}
                    {...this.state}
                    className='AttendanceGroup-aside-Layout' />
                <div className='AttendanceGroup-table-Layout'>
                    <AttendanceGroupTable {...this.props} {...this.state} />
                </div>
            </div>

        );
    }

    static orgloop (data = []) {
        if (data.length === 0) {
            return;
        }
        return data.map((item) => {
            if (item && item.ID && item.children && item.children.length > 0) {
                return (
                    <TreeNode
                        value={item.ID}
                        key={item.ID}
                        title={`${item.OrgName}`}
                    >
                        {
                            AttendanceGroup.orgloop(item.children)
                        }
                    </TreeNode>
                );
            } else {
                if (item && item.ID) {
                    return (
                        <TreeNode
                            value={item.ID}
                            key={item.ID}
                            title={`${item.OrgName}`}
                        />
                    );
                }
            }
        });
    };
}
