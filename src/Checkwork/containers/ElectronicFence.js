import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/electronicFence';
import { actions as platformActions } from '_platform/store/global';
import { ScopeCreateTable } from '../components/ElectronicFence';
import { getCompanyDataByOrgCode, getAreaTreeData } from '_platform/auth';
@connect(
    state => {
        const { checkwork: { electronicFence = {} }, platform } = state;
        return { ...electronicFence, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class ElectronicFence extends Component {
    constructor (props) {
        super(props);
        this.state = {
            parentData: '',
            user: '',
            groupTreeLoading: false,
            areaTreeLoading: false
        };
    }

    componentDidMount = async () => {
        const {
            platform: {
                tree = {}
            },
            actions: {
                getCheckGroupOK
            }
        } = this.props;
        // 获取用户的公司信息
        let user = localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        try {
            if (user.username !== 'admin') {
                // // 获取考勤群体数据
                await this.loadCheckGroupData(user);
                // 获取地块树数据
                if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0) {
                    this.setState({
                        areaTreeLoading: false
                    });
                } else {
                    await this._loadAreaData();
                }
            } else {
                await getCheckGroupOK([]);
            }
        } catch (e) {
            console.log('org', e);
        }
    }

    // 获取考勤群体数据
    loadCheckGroupData = async (user) => {
        const {
            actions: {
                getParentOrgTreeByID,
                getCheckGroup
            }
        } = this.props;
        try {
            this.setState({
                groupTreeLoading: true
            });
            let userOrgID = '';
            let companyOrgID = '';
            let parentData = '';
            // userOrgCode为登录用户自己的部门code
            userOrgID = user.Org;
            parentData = await getCompanyDataByOrgCode(userOrgID, getParentOrgTreeByID);
            companyOrgID = parentData.ID;
            // companyOrgCode为登录用户的公司信息，通过公司的code来获取群体
            let postData = {
                org_code: companyOrgID
            };
            await getCheckGroup({}, postData);
            this.setState({
                user,
                parentData,
                groupTreeLoading: false
            });
        } catch (e) {
            console.log('e', e);
        }
    }

    // 获取地块树数据
    _loadAreaData = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            }
        } = this.props;
        try {
            this.setState({
                areaTreeLoading: true
            });
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];

            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
            this.setState({
                areaTreeLoading: false
            });
        } catch (e) {
            console.log(e);
        }
    }

    render () {
        return (
            <ScopeCreateTable {...this.props} {...this.state} />
        );
    }
}
