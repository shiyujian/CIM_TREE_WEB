import React, { Component } from 'react';
import { actions as platformActions } from '_platform/store/global';
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
import {
    getUser,
    getCompanyDataByOrgCode
} from '_platform/auth';
import { actions } from '../../store/ManMachine/manEntranceAndDeparture';
import {
    ManEntranceAndDepartureTable,
    PkCodeTree
} from '../../components/ManMachine/ManEntranceAndDeparture';

@connect(
    state => {
        const {
            platform,
            project: { manEntranceAndDeparture }
        } = state;
        return { platform, ...manEntranceAndDeparture };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...platformActions, ...actions },
            dispatch
        )
    })
)
export default class ManEntranceAndDeparture extends Component {
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
                getWorkGroup,
                getOrgTree,
                getWorkTypes,
                getParentOrgTreeByID
            }
        } = this.props;
        this.setState({
            loading: true
        });
        const user = getUser();
        // 管理员可以查看全部，其他人只能查看自己公司
        let permission = false;
        if (user.username === 'admin') {
            permission = true;
        }
        let parentOrgID = '';
        let parentOrgData = '';
        if (permission) {
            await getOrgTree();
        } else {
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
            }
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
    }
    onSelect = async (keys = [], info) => {
        const {
            actions: {
                getWorkGroup
            }
        } = this.props;
        console.log('keys', keys);
        console.log('info', info);
        let selectOrgData = '';
        if (info.selected) {
            selectOrgData = (info && info.node && info.node.props && info.node.props.value && JSON.parse(info.node.props.value)) || '';
        }
        let keycode = keys[0] || '';
        this.setState({
            leftKeyCode: keycode,
            resetkey: ++this.state.resetkey
        });
        let data = await getWorkGroup({}, {orgid: keycode});
        let workGroupList = [];
        if (data && data.content) {
            workGroupList = data.content;
        }
        this.setState({
            selectOrgData,
            workGroupList
        });
    }
    // 重置
    resetinput (leftKeyCode) {
        this.setState({
            resetkey: ++this.state.resetkey
        }, () => {
            this.onSelect([leftKeyCode]);
        });
    }
    render () {
        const {
            leftKeyCode,
            resetkey,
            permission
        } = this.state;

        return (
            <Body>
                <Main>
                    <DynamicTitle title='人员进离场' {...this.props} />
                    {
                        permission
                            ? (
                                <Sidebar>
                                    <PkCodeTree
                                        selectedKeys={leftKeyCode}
                                        {...this.props}
                                        {...this.state}
                                        onSelect={this.onSelect.bind(this)}
                                    />
                                </Sidebar>
                            ) : ''
                    }
                    <Content>
                        <ManEntranceAndDepartureTable
                            key={resetkey}
                            {...this.props}
                            {...this.state}
                            resetinput={this.resetinput.bind(this)}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
}
