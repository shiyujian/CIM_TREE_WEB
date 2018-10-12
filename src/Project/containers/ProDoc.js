import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from 'antd';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import PkCodeTree from '../components/PkCodeTree';
import reducer, { actions } from '../store/proDoc';
import Button from 'antd/es/button/button';
import AddDirPanel from '../components/ProDoc/AddDirPanel';
import DelDirPanel from '../components/ProDoc/DelDirPanel';
export const Datumcode = window.DeathCode.DATUM_GCWD;

@connect(
    state => {
        const { project: { proDoc = {} } = {}, platform } = state;
        return { ...proDoc, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            {
                ...actions,
                ...platformActions
            },
            dispatch
        )
    })
)
export default class ProDoc extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            treeSelectData: '',
            addDelPanel: '',
            treeSelected: false,
            userButtonAddPermission: false,
            userButtonDelPermission: false,
            currentpk: '',
            currentcode: '',
            isAdmin: false,
            orgCode: '',
            extraOrgLeaf: false,
            extraOrgCode: ''
        };
    }

    componentDidMount = async () => {
        const {
            actions: { getworkTree, savepk, addDir, getOrgParent }
        } = this.props;
        try {
            let user = window.localStorage.getItem('QH_USER_DATA');
            user = JSON.parse(user);
            console.log('user', user);
            let isAdmin = false;
            let parentOrgCode = '';
            let userButtonAddPermission = false;
            if (user && user.username === 'admin') {
                userButtonAddPermission = true;
                isAdmin = true;
            } else {
                let orgCode = user && user.account && user.account.org_code;
                let orgData = await getOrgParent({code: orgCode});
                let parent = orgData && orgData.parent;
                parentOrgCode = parent.code;
            }
            this.setState({
                user: user,
                userButtonAddPermission,
                isAdmin,
                orgCode: parentOrgCode
            });

            let rst = await getworkTree({ code: Datumcode });
            if (!rst.pk) {
                let data = await addDir(
                    {},
                    {
                        status: 'A',
                        obj_type: 'C_DIR',
                        code: Datumcode,
                        name: '工程文档',
                        basic_params: {
                            permitted_orgs: [],
                            model_name: ''
                        }
                    }
                );
                if (data && data.pk) {
                    savepk(data.pk);
                }
            } else {
                savepk(rst.pk);
            }
        } catch (e) {
            console.log('e', e);
        }
    }

    selectStandardDir (keys = [], info) {
        const {
            isAdmin,
            orgCode
        } = this.state;
        let treeSelected = info.selected;
        this.setState({
            addDelPanel: '',
            treeSelected
        });
        let userButtonAddPermission = false;
        let userButtonDelPermission = false;
        if (treeSelected) {
            let treeSelectData = info.node.props.data;
            let extraOrgCode = treeSelectData.extra_params.orgCode ? treeSelectData.extra_params.orgCode : '';
            const [code] = keys;
            if (isAdmin) {
                userButtonAddPermission = true;
                userButtonDelPermission = true;
            } else {
                if (extraOrgCode === orgCode) {
                    userButtonAddPermission = true;
                    if (treeSelectData && treeSelectData.extra_params && treeSelectData.extra_params.orgDel) {
                        userButtonDelPermission = true;
                    }
                }
            }
            let extraOrgLeaf = treeSelectData.extra_params.orgLeaf ? treeSelectData.extra_params.orgLeaf : '';
            this.setState({
                currentpk: code.split('--')[0],
                currentcode: code.split('--')[1],
                userButtonAddPermission,
                userButtonDelPermission,
                treeSelectData,
                extraOrgLeaf,
                extraOrgCode
            });
        } else {
            if (isAdmin) {
                userButtonAddPermission = true;
            }
            this.setState({
                currentpk: '',
                currentcode: '',
                userButtonAddPermission,
                userButtonDelPermission,
                treeSelectData: '',
                extraOrgLeaf: false,
                extraOrgCode: ''
            });
        }
    }

    render () {
        const {
            worktree = []
        } = this.props;
        const {
            userButtonAddPermission,
            userButtonDelPermission,
            addDelPanel,
            treeSelected
        } = this.state;
        return (
            <div>
                <DynamicTitle title='工程文档' {...this.props} />
                <Sidebar>
                    <div
                        style={{
                            borderBottom: 'solid 1px #999',
                            paddingBottom: 8
                        }}
                    >
                        <Button
                            onClick={this.handleAddDir.bind(this)}
                            disabled={!userButtonAddPermission}
                        >
                            新增目录
                        </Button>
                        <Button
                            onClick={this.handleDelDir.bind(this)}
                            disabled={!userButtonDelPermission}
                        >
                            删除目录
                        </Button>
                    </div>
                    <PkCodeTree
                        treeData={worktree}
                        onSelect={this.selectStandardDir.bind(this)}
                    />
                </Sidebar>
                <Content>
                    {
                        !userButtonAddPermission
                            ? null
                            : addDelPanel === 'ADD'
                                ? (
                                    <AddDirPanel {...this.props} {...this.state} handleDirClear={this.handleAddDirClear.bind(this)} />
                                )
                                : addDelPanel === 'DEL'
                                    ? (
                                        <DelDirPanel {...this.props} {...this.state} handleDirClear={this.handleDelDirClear.bind(this)} />
                                    ) : ''
                    }
                </Content>
            </div>
        );
    }

    handleAddDir = (e) => {
        this.setState({
            addDelPanel: 'ADD'
        });
    }

    handleDelDir = (e) => {
        this.setState({
            addDelPanel: 'DEL'
        });
    }
    // 增加目录成功后
    handleAddDirClear = () => {
        this.setState({
            addDelPanel: ''
        });
    }
    // 删除目录成功后
    handleDelDirClear = () => {
        const {
            isAdmin
        } = this.state;
        let userButtonAddPermission = false;
        // 删除后没有选中节点，删除权限取消
        let userButtonDelPermission = false;
        if (isAdmin) {
            userButtonAddPermission = true;
        }
        this.setState({
            addDelPanel: '',
            currentpk: '',
            currentcode: '',
            treeSelectData: '',
            treeSelected: false,
            userButtonAddPermission,
            userButtonDelPermission,
            extraOrgLeaf: false,
            extraOrgCode: ''
        });
    }
}
