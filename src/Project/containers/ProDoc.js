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
            userButtonPermission: false,
            currentpk: '',
            currentcode: '',
            isAdmin: false,
            orgCode: '',
            extraOrgLeaf: false,
            extraOrgCode: ''
        };
    }

    componentDidMount () {
        const {
            actions: { getworkTree, savepk, addDir }
        } = this.props;
        let user = window.localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);
        let isAdmin = false;
        let orgCode = '';
        let userButtonPermission = false;
        if (user && user.username === 'admin') {
            userButtonPermission = true;
            isAdmin = true;
        } else {
            orgCode = user && user.account && user.account.org_code;
        }
        this.setState({
            user: user,
            userButtonPermission,
            isAdmin,
            orgCode
        });
        getworkTree({ code: Datumcode }).then(rst => {
            if (!rst.pk) {
                addDir(
                    {},
                    {
                        status: 'A',
                        obj_type: 'C_DIR',
                        code: Datumcode,
                        name: '制度规范',
                        basic_params: {
                            permitted_orgs: [],
                            model_name: ''
                        }
                    }
                ).then(rst => {
                    savepk(rst.pk);
                });
            } else {
                savepk(rst.pk);
            }
        });
    }

    selectStandardDir (keys = [], info) {
        const {
            isAdmin,
            orgCode
        } = this.state;
        console.log('info', info);
        console.log('keys', keys);
        let treeSelected = info.selected;
        this.setState({
            addDelPanel: '',
            treeSelected
        });
        let userButtonPermission = false;
        if (treeSelected) {
            let treeSelectData = info.node.props.data;
            let extraOrgCode = treeSelectData.extra_params.orgCode ? treeSelectData.extra_params.orgCode : '';
            console.log('treeSelectData', treeSelectData);
            const [code] = keys;
            console.log('code', code);
            if (isAdmin) {
                userButtonPermission = true;
            } else {
                if (extraOrgCode === orgCode) {
                    userButtonPermission = true;
                }
            }
            let extraOrgLeaf = treeSelectData.extra_params.orgLeaf ? treeSelectData.extra_params.orgLeaf : '';
            this.setState({
                currentpk: code.split('--')[0],
                currentcode: code.split('--')[1],
                userButtonPermission,
                treeSelectData,
                extraOrgLeaf,
                extraOrgCode
            });
        } else {
            if (isAdmin) {
                userButtonPermission = true;
            }
            this.setState({
                currentpk: '',
                currentcode: '',
                userButtonPermission,
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
            userButtonPermission,
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
                            disabled={!userButtonPermission}
                        >
                            新增目录
                        </Button>
                        <Button
                            onClick={this.handleDelDir.bind(this)}
                            disabled={!userButtonPermission || !treeSelected}
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
                        !userButtonPermission
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
        let userButtonPermission = false;
        if (isAdmin) {
            userButtonPermission = true;
        }
        console.log('userButtonPermission', userButtonPermission);
        this.setState({
            addDelPanel: '',
            currentpk: '',
            currentcode: '',
            treeSelectData: '',
            treeSelected: false,
            userButtonPermission,
            extraOrgLeaf: false,
            extraOrgCode: ''
        });
    }
}
