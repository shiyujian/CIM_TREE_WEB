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
import FormTree from '../components/FormTree';
import reducer, { actions } from '../store/formmanage';
import Button from 'antd/es/button/button';
import AddFormTree from '../components/FormManage/AddFormTree';
import DelFormTree from '../components/FormManage/DelFormTree';
export const Datumcode = window.DeathCode.OVERALL_FORM;

@connect(
    state => {
        const { project: { formmanage = {} } = {}, platform } = state;
        return { ...formmanage, platform };
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
export default class FormManage extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            hidden: {
                'margin-right': '8px',
                visibility: 'hidden'
            },
            show: {
                'margin-right': '8px',
                visibility: 'visible'
            },
            data: '',
            depth: ''
        };
    }

    componentDidMount () {
        const {
            actions: { getworkTree, savepk, addDir }
        } = this.props;
        getworkTree({ code: Datumcode }).then(rst => {
            console.log(rst);
            // debugger
            if (!rst.pk) {
                addDir(
                    {},
                    {
                        status: 'A',
                        obj_type: 'C_DIR',
                        code: Datumcode,
                        name: '表单管理',
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

    state = {
        addOrDel: 'NOR',
        hadSelectDir: false
    };

    selectMaterialDir (value = [], node) {
        let data = node.node.props.data[0].children
            ? node.node.props.data[0].children
            : 'undefined';
        if (value && value.length) {
            let arr = value[0].split('--');
            let depth = arr[2];
            this.setState({
                depth: depth
            });
        }
        this.setState({
            data: data
        });
        this.setState({ hadSelectDir: true });
        const [code] = value;
        console.log('code', code);
        const {
            actions: { setcurrentcode, savecode, setcurrentpk, refreshPanelTo }
        } = this.props;
        if (code === undefined) {
            setcurrentcode({});
            setcurrentpk({});
            savecode({});
            refreshPanelTo('NOR');
        } else {
            console.log(code.split('--')[1]);
            setcurrentcode(code.split('--')[1]);
            setcurrentpk(code.split('--')[0]);
            savecode(code);
            refreshPanelTo('NOR');
        }
    }
    render () {
        const {
            // platform: {dir: {list = [],} = {}} = {},
            worktree = [],
            adddelpanel = 'NOR',
            keycode = [],
            currentcode
        } = this.props;
        console.log('keycode', keycode);
        const { hadSelectDir } = this.state;

        let {
            actions: { refreshPanelTo }
        } = this.props;

        return (
            <div>
                <DynamicTitle title='表单管理' {...this.props} />
                <Sidebar>
                    <div
                        style={{
                            borderBottom: 'solid 1px #999',
                            paddingBottom: 8
                        }}
                    >
                        <Button
                            style={
                                (this.state.depth !== '3' || JSON.stringify(currentcode) === '{}')
                                    ? this.state.show
                                    : this.state.hidden
                            }
                            onClick={() => {
                                refreshPanelTo('ADD');
                            }}
                        >
                            新增目录
                        </Button>
                        <Button
                            onClick={() => {
                                refreshPanelTo('DEL');
                            }}
                        >
                            删除目录
                        </Button>
                    </div>
                    <FormTree
                        treeData={worktree}
                        selectedKeys={keycode}
                        onSelect={this.selectMaterialDir.bind(this)}
                    />
                </Sidebar>
                <Content>
                    {adddelpanel === 'NOR' ? null : adddelpanel === 'ADD' ? (
                        <AddFormTree {...this.props} {...this.state} />
                    ) : hadSelectDir ? (
                        <DelFormTree {...this.props} />
                    ) : (
                        <Alert
                            message='请在左侧选择需要删除的目录'
                            type='error'
                            closable
                        />
                    )}
                </Content>
            </div>
        );
    }
}
