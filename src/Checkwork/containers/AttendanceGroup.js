import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceGroup';
import { actions as platformActions } from '_platform/store/global';
import {
    AttendanceGroupTable,
    AsideTree
} from '../components/AttendanceGroup';
import { TreeSelect } from 'antd';
import { getCompanyDataByOrgCode } from '_platform/auth';
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
            userOrgCode: '',
            companyOrgCode: '',
            parentData: '',
            companyDatas: '',
            user: '',
            orgTreeSelectData: []
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getOrgTreeByCode,
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
            let user = localStorage.getItem('QH_USER_DATA');
            user = JSON.parse(user);
            let userOrgCode = '';
            let companyOrgCode = '';
            let parentData = '';
            let companyDatas = '';
            let orgTreeSelectData = [];
            if (user.username !== 'admin') {
                // userOrgCode为登录用户自己的部门code
                userOrgCode = user.account.org_code;
                parentData = await getCompanyDataByOrgCode(userOrgCode, getOrgTreeByCode);
                companyOrgCode = parentData.code;
                // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
                let postData = {
                    org_code: companyOrgCode
                };
                await getCheckGroup({}, postData);
                // 在关联人员时需要根据各个部门来查找人员，所以需要根据公司的code查找公司内的组织机构
                companyDatas = await getOrgTreeByCode({code: companyOrgCode});
                // 获取组织机构后，构建成TreeSelect
                orgTreeSelectData = AttendanceGroup.orgloop([companyDatas]);
            }

            await changeAsideTreeLoading(false);
            this.setState({
                user,
                userOrgCode,
                companyOrgCode,
                parentData,
                companyDatas,
                orgTreeSelectData
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    render () {
        return (
            <div className='AttendanceGroup-Layout'>
                <AsideTree {...this.props} {...this.state} className='AttendanceGroup-aside-Layout' />
                <div className='AttendanceGroup-table-Layout'>
                    <AttendanceGroupTable {...this.props} {...this.state} />
                </div>
            </div>

        );
    }

    // 设置登录用户所在的公司的部门项
    static orgloop (data = [], loopTimes = 0) {
        if (data.length === 0) {
            return;
        }
        return data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode disabled
                        key={`${item.code}`}
                        value={item.code}
                        title={`${item.name}`}>
                        {
                            AttendanceGroup.orgloop(item.children, loopTimes + 1, item.name)
                        }
                    </TreeNode>
                );
            } else {
                return (<TreeNode
                    disabled={loopTimes === 0 && true}
                    key={`${item.code}`}
                    value={item.code}
                    title={`${item.name}`} />);
            }
        });
    };
}
