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
import reducer, { actions } from '../store/engineeringImage';
import Button from 'antd/es/button/button';
import AddDirPanel from '../components/EngineeringImage/AddDirPanel';
import DelDirPanel from '../components/EngineeringImage/DelDirPanel';
export const Datumcode = window.DeathCode.DATUM_GCYX;

@connect(
    state => {
        const { project: { engineeringImage = {} } = {}, platform } = state;
        return { ...engineeringImage, platform };
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
export default class EngineeringImage extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            treeSelectData: '',
            buttonDisabled: true,
            addDelPanel: '',
            treeSelected: false,
            userButtonPermission: false,
            currentpk: '',
            currentcode: ''
        };
    }

    selectStandardDir (keys = [], info) {
        const {
            user
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
            console.log('treeSelectData', treeSelectData);
            const [code] = keys;
            console.log('code', code);
            if (user && user.username === 'admin') {
                userButtonPermission = true;
            } else {
                let extraOrgLeaf = treeSelectData.extra_params.orgLeaf ? treeSelectData.extra_params.orgLeaf : '';
                if (extraOrgLeaf) {
                    userButtonPermission = true;
                }
            }
            this.setState({
                currentpk: code.split('--')[0],
                currentcode: code.split('--')[1],
                userButtonPermission,
                treeSelectData
            });
        } else {
            if (user && user.username === 'admin') {
                userButtonPermission = true;
            }
            this.setState({
                currentpk: '',
                currentcode: '',
                userButtonPermission,
                treeSelectData: ''
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
                <DynamicTitle title='工程影像' {...this.props} />
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

    handleAddDirClear = () => {
        this.setState({
            addDelPanel: ''
        });
    }

    handleDelDirClear = () => {
        const {
            user
        } = this.state;
        let userButtonPermission = false;
        if (user && user.username === 'admin') {
            userButtonPermission = true;
        }
        console.log('userButtonPermission', userButtonPermission);
        this.setState({
            addDelPanel: '',
            currentpk: '',
            currentcode: '',
            treeSelectData: '',
            treeSelected: false,
            userButtonPermission
        });
    }

    componentDidMount () {
        const {
            actions: { getworkTree, savepk, addDir }
        } = this.props;
        let user = window.localStorage.getItem('QH_USER_DATA');
        user = JSON.parse(user);
        console.log('user', user);
        let userButtonPermission = false;
        if (user && user.username === 'admin') {
            userButtonPermission = true;
        }
        this.setState({
            user: user,
            userButtonPermission
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
}
