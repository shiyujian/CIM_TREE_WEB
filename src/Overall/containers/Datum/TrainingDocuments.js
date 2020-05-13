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
    getUserIsDocument,
    getUser
} from '_platform/auth';
import * as previewActions from '_platform/store/global/preview';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../../store/Datum/trainingDocuments';
import {
    DatumTree,
    AddDir,
    Table
} from '../../components/Datum/TrainingDocuments';

@connect(
    state => {
        const {
            overall: { trainingDocuments = {} },
            platform
        } =
            state || {};
        return { ...trainingDocuments, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions, ...previewActions },
            dispatch
        )
    })
)
export default class TrainingDocuments extends Component {
    constructor (props) {
        super(props);
        this.state = {
            operatePermission: false,
            leftKeyCode: '',
            addVisible: false,
            ownerCompany: '',
            treeData: [],
            isLeaf: false,
            downloadPermission: false,
            userCompanyMessage: '',
            loading: false
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getOrgTreeByOrgType
            }
        } = this.props;
        // 获取业主单位的信息
        let orgData = await getOrgTreeByOrgType({orgtype: '业主单位'});
        let ownerCompany = '';
        if (orgData && orgData.content && orgData.content instanceof Array && orgData.content.length > 0) {
            orgData.content.map((org) => {
                if (org.OrgName.indexOf('雄安集团') !== -1) {
                    ownerCompany = org;
                }
            });
            if (!ownerCompany) {
                ownerCompany = orgData.content[0];
            }
        }
        const user = getUser();
        console.log('user', user);

        let operatePermission = false;
        // 管理员具有增删目录以及增删文档的权限
        if (user && user.username && user.username === 'admin') {
            operatePermission = true;
        }
        // 业主文书具有下载文档的权限
        let downloadPermission = getUserIsDocument();
        this.setState({
            operatePermission,
            ownerCompany,
            downloadPermission
        }, async () => {
            await this.handleQueryDirTree();
        });
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            getDirStatus
        } = this.props;
        if (getDirStatus && getDirStatus !== prevProps.getDirStatus) {
            this.handleQueryDirTree();
        }
    }
    // 获取目录文档
    handleQueryDirTree = async () => {
        const {
            actions: {
                getDirTree
            }
        } = this.props;
        const {
            ownerCompany
        } = this.state;
        this.setState({
            loading: true
        });
        // 获取目录树
        let treeData = await getDirTree({}, {
            dirtype: '培训文档',
            orgid: ownerCompany.ID
        });
        console.log('treeData', treeData);
        this.setState({
            treeData,
            loading: false
        });
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
                deleteDir
            }
        } = this.props;
        const {
            leftKeyCode
        } = this.state;
        try {
            let dirData = await deleteDir({id: leftKeyCode});
            if (dirData && dirData.code && dirData.code === 1) {
                Notification.success({
                    message: '删除目录成功！',
                    duration: 3
                });
                this.setState({
                    leftKeyCode: ''
                });
                await this.handleQueryDirTree();
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
    // 新增成功
    handleCloseAddModalOk = async () => {
        await this.handleQueryDirTree();
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
            operatePermission = false,
            leftKeyCode = '',
            addVisible = false,
            treeData = []
        } = this.state;

        return (
            <Body>
                <Main>
                    <DynamicTitle title='培训文档' {...this.props} />
                    <Sidebar>
                        {
                            operatePermission
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
                                    handleCloseAddModalOk={this.handleCloseAddModalOk.bind(this)}
                                /> : ''
                        }
                    </Content>
                </Main>
            </Body>
        );
    }
}
