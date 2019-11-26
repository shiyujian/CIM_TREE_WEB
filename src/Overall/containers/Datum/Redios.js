import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Popconfirm, Notification } from 'antd';
import moment from 'moment';
import {
    Main,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {
    getUserIsManager,
    getUserIsDocument,
    getUser,
    getCompanyDataByOrgCode
} from '_platform/auth';
import * as previewActions from '_platform/store/global/preview';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../../store/Datum/redios';
import {
    DatumTree,
    AddDir,
    Table
} from '../../components/Datum/Redios';
@connect(
    state => {
        const {
            overall: { redios = {} },
            platform
        } =
            state || {};
        return { ...redios, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class Redios extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isPermission: false,
            leftKeyCode: '',
            addVisible: false,
            ownerCompany: '',
            treeData: [],
            isLeaf: false,
            addDocPermission: false,
            userCompanyMessage: ''
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getDirTree,
                getOrgTreeByOrgType
            }
        } = this.props;
        // 获取业主单位的信息
        let orgData = await getOrgTreeByOrgType({orgtype: '业主单位'});
        let ownerCompany = '';
        if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
            ownerCompany = orgData.content[0];
        }
        // 获取用户的公司信息
        this.handleGetUserCompanyMessage();
        // 业主和管理员具有增删目录以及增删文档的权限
        let isPermission = getUserIsManager();
        // 业主文书具有上传文档的权限
        let addDocPermission = getUserIsDocument();
        // 获取目录树
        let treeData = await getDirTree({}, {
            dirtype: '会议记录',
            orgid: ownerCompany.ID
        });
        console.log('treeData', treeData);
        this.setState({
            isPermission,
            ownerCompany,
            treeData,
            addDocPermission
        });
    }
    handleGetUserCompanyMessage = async () => {
        const {
            actions: {
                getChildOrgTreeByID,
                getParentOrgTreeByID
            }
        } = this.props;
        const user = getUser();
        // 获取登录用户的公司的信息
        let orgID = user.org;
        let userCompanyMessage = user.orgObj;
        // 根据登录用户的部门code获取所在公司的code，这里没有对苗圃和供应商做对应处理
        let parentOrgData = await getCompanyDataByOrgCode(orgID, getParentOrgTreeByID);
        // 如果在公司下，则获取公司所有的信息
        if (parentOrgData && parentOrgData.ID) {
            let parentOrgID = parentOrgData.ID;
            // 获取公司线下的所有部门信息
            userCompanyMessage = await getChildOrgTreeByID({id: parentOrgID});
        }
        console.log('userCompanyMessage', userCompanyMessage);
        this.setState({
            userCompanyMessage
        });
    }
    componentWillReceiveProps = async (nextProps) => {
        const {
            getDirStatus
        } = nextProps;
        const {
            actions: {
                getDirTree
            }
        } = this.props;
        const {
            ownerCompany
        } = this.state;
        if (getDirStatus && getDirStatus !== this.props.getDirStatus) {
            // 获取目录树
            let treeData = await getDirTree({}, {
                dirtype: '会议记录',
                orgid: ownerCompany.ID
            });
            console.log('treeData', treeData);
            this.setState({
                treeData
            });
        }
    }
    // 新增目录
    handleAddDir () {
        this.setState({
            addVisible: true
        });
    }
    // 删除目录
    handleDelDir = async () => {
        const {
            actions: {
                deleteDir,
                setGetDirStatus
            }
        } = this.props;
        const {
            leftKeyCode
        } = this.state;
        try {
            let dirData = await deleteDir({id: leftKeyCode});
            console.log('dirData', dirData);
            if (dirData && dirData.code && dirData.code === 1) {
                Notification.success({
                    message: '删除目录成功！',
                    duration: 3
                });
                this.setState({
                    leftKeyCode: ''
                });
                await setGetDirStatus(moment().unix());
            } else {
                Notification.error({
                    message: '删除目录失败！',
                    duration: 3
                });
            }
        } catch (e) {
            console.log('handleDelDir', e);
        }
    }
    // 关闭新增目录页面
    handleCloseAddModal () {
        this.setState({
            addVisible: false
        });
    }
    // 目录选择
    onSelect (value = [], e) {
        let isLeaf = true;
        if (e && e.node && e.node.props && e.node.props.children && e.node.props.children.length > 0) {
            isLeaf = false;
        }
        this.setState({
            leftKeyCode: value[0],
            isLeaf
        });
    }

    render () {
        const {
            isPermission = false,
            leftKeyCode = '',
            addVisible = false,
            treeData = []
        } = this.state;

        return (
            <Body>
                <Main>
                    <DynamicTitle title='会议记录' {...this.props} />
                    <Sidebar>
                        {
                            isPermission
                                ? <div>
                                    <Button
                                        style={{marginRight: 5}}
                                        type='primary'
                                        onClick={this.handleAddDir.bind(this)}>
                                    新增目录
                                    </Button>
                                    {
                                        leftKeyCode
                                            ? <Popconfirm
                                                placement='topLeft'
                                                title={`确定要删除目录吗？`}
                                                onConfirm={this.handleDelDir.bind(this)}
                                                okText='Yes'
                                                cancelText='No'>
                                                <Button>
                                            删除目录
                                                </Button>
                                            </Popconfirm>
                                            : <Button disabled>
                                        删除目录
                                            </Button>
                                    }

                                </div>
                                : null
                        }
                        <DatumTree
                            treeData={treeData}
                            selectedKeys={leftKeyCode}
                            onSelect={this.onSelect.bind(this)}
                            {...this.state}
                            {...this.props}
                        />
                    </Sidebar>
                    <Content>
                        <Table
                            {...this.state}
                            {...this.props}
                        />
                        {
                            addVisible
                                ? <AddDir
                                    {...this.state}
                                    {...this.props}
                                    handleCloseAddModal={this.handleCloseAddModal.bind(this)}
                                /> : ''
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}
