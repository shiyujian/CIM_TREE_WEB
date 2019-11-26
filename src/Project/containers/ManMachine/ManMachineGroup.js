import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { getCompanyDataByOrgCode, getUser } from '_platform/auth';
import * as actions from '../../store/ManMachine/manMachineGroup';
import {
    PkCodeTree,
    AsideTree,
    ManGroupTable,
    ManGroupTablePermission
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
            permission: false,
            parentOrgData: '',
            parentOrgID: '',
            selectOrgData: '',
            leftKeyCode: '',
            resetkey: 0,
            userCompany: '',
            loading: false,
            // 工种
            workTypesList: [],
            // 班组
            workGroupList: []
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getParentOrgTreeByID,
                getWorkTypes,
                getWorkGroup,
                getOrgTree,
                getWorkGroupOK,
                changeAsideTreeLoading,
                changeSelectMemGroup
            }
        } = this.props;
        try {
            // 获取用户的公司信息
            let user = getUser();
            let permission = false;
            if (user.username === 'admin') {
                permission = true;
            }
            let parentOrgID = '';
            let parentOrgData = '';
            if (permission) {
                await getOrgTree();
            } else {
                // loading效果初始化
                await changeAsideTreeLoading(true);
                // 班组的数据初始化
                await getWorkGroupOK([]);
                // 默认不选中班组
                await changeSelectMemGroup();
                // 获取登录用户的公司的信息
                let orgID = user.org;
                // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
                parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
                // 如果在公司下，则获取公司所有的信息
                if (parentOrgData && parentOrgData.ID) {
                    parentOrgID = parentOrgData.ID;
                    let data = await getWorkGroup({}, {orgid: parentOrgID});
                    let workGroupList = [];
                    if (data && data.content) {
                        workGroupList = data.content;
                    }
                    this.setState({
                        workGroupList
                    });
                } else {
                    Notification.warning({
                        message: '当前用户不在公司下，请重新登录',
                        duration: 3
                    });
                }
                await changeAsideTreeLoading(false);
            }
            // 获取工种
            let workTypesList = [];
            let workTypeData = await getWorkTypes();
            if (workTypeData && workTypeData.content) {
                workTypesList = workTypeData.content;
            }
            this.setState({
                workTypesList
            });
            this.setState({
                permission,
                parentOrgData,
                parentOrgID,
                loading: false,
                workTypesList
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    onSelect = async (keys = [], info) => {
        const {
            actions: {
                getWorkGroup
            }
        } = this.props;
        let selectOrgData = '';
        if (info.selected) {
            selectOrgData = (info && info.node && info.node.props && info.node.props.value && JSON.parse(info.node.props.value)) || '';
        }
        let keycode = keys[0] || '';
        let data = await getWorkGroup({}, {orgid: keycode});
        let workGroupList = [];
        if (data && data.content) {
            workGroupList = data.content;
        }
        this.setState({
            leftKeyCode: keycode,
            resetkey: ++this.state.resetkey,
            selectOrgData,
            workGroupList
        });
    }
    render () {
        const {
            leftKeyCode,
            permission
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title='班组维护' {...this.props} />
                    {
                        permission
                            ? (
                                <div>
                                    <Sidebar>
                                        <PkCodeTree
                                            selectedKeys={leftKeyCode}
                                            {...this.props}
                                            {...this.state}
                                            onSelect={this.onSelect.bind(this)}
                                        />
                                    </Sidebar>
                                    <Content>
                                        <ManGroupTablePermission
                                            {...this.props}
                                            {...this.state}
                                        />
                                    </Content>
                                </div>
                            ) : (
                                <div>
                                    <Sidebar>
                                        <AsideTree
                                            {...this.props}
                                            {...this.state}
                                        />
                                    </Sidebar>
                                    <Content>
                                        <ManGroupTable
                                            {...this.props}
                                            {...this.state}
                                        />
                                    </Content>
                                </div>
                            )
                    }
                </Main>
            </Body>

        );
    }
}
