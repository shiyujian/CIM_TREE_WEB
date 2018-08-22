import { injectReducer } from '../store';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Main, Aside, Body } from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import ContainerRouters from '_platform/components/panels/ContainerRouters';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as actions2 } from './store/cells';
import { actions as actions3 } from './store/subitem';
import { Icon } from 'react-fa';
import { getUser } from '_platform/auth';
import { message } from 'antd';
class Quality extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dwysjl: false
        };
    }

    async componentDidMount () {
        const { default: reducer } = await import('./store');
        const Containers = await import('./containers');
        console.log('Containers', Containers);
        injectReducer('quality', reducer);
        this.setState({
            ...Containers
        });
        let { getUserById } = this.props.cellActions;
        getUserById({ pk: getUser().id }).then(rst => {
            let orgcode;
            try {
                orgcode = rst.account.org_code;
                if (!orgcode) {
                    // message.error('当前用户无组织部门');
                    return;
                }
            } catch (e) {
                return;
            }
            let { fetchRootOrg } = this.props.hyjActions;
            fetchRootOrg({ code: orgcode }).then(rst => {
                console.log('当前用户组织结构反转', rst);
                // if (rst.children[0].name.indexOf('监理')>=0) {
                // 	this.setState({ dwysjl: true });
                // 	//message.info('当前登录为监理单位');
                // }
                if (rst.name.indexOf('监理') >= 0) {
                    this.setState({ dwysjl: true });
                    // message.info('当前登录为监理单位');
                }
                // if (rst.children[0].name.indexOf('施工')>=0) {
                // 	//message.info('当前登录为施工单位');
                // }
                if (rst.name.indexOf('施工') >= 0) {
                    // message.info('当前登录为施工单位');
                }
            });
            console.log(rst);
            let have = false;
            if (rst) {
                console.log(rst);
                if (rst && rst.groups) {
                    rst.groups.forEach(ele => {
                        if (ele.name.indexOf('监理') >= 0) {
                            have = true;
                        }
                    });
                }
            }
            if (have) {
                this.setState({ dwysjl: true });
            }
        });
    }
    render () {
        const {
            Defect,
            // Search,
            Appraising,
            Faithanalyze,
            Qualityanalyze
        } = this.state || {};

        return (
            <Body>
                <Aside>
                    <Submenu {...this.props} menus={menus} />
                </Aside>
                <Main>
                    {/* {Search && (
                        <Route path='/quality/search' component={Search} />
                    )} */}
                    {Appraising && (
                        <Route
                            path='/quality/appraising'
                            component={Appraising}
                        />
                    )}
                    {Defect && (
                        <Route path='/quality/defect' component={Defect} />
                    )}
                    {Faithanalyze && (
                        <Route
                            path='/quality/faithanalyze'
                            component={Faithanalyze}
                        />
                    )}
                    {Qualityanalyze && (
                        <Route
                            path='/quality/qualityanalyze'
                            component={Qualityanalyze}
                        />
                    )}
                </Main>
            </Body>
        );
    }
}
export default connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
        hyjActions: bindActionCreators({ ...actions3 }, dispatch)
    })
)(Quality);

const menus = [
    // {
    //     key: 'search',
    //     name: '质量评分',
    //     id: 'QUALITY.SEARCH',
    //     exact: true,
    //     path: '/quality/search',
    //     icon: <Icon name='tasks' />
    // },
    {
        key: 'appraising',
        id: 'QUALITY.APPRAISING',
        name: '质量评优',
        path: '/quality/appraising',
        icon: <Icon name='tasks' />
    },
    {
        key: 'defect',
        id: 'QUALITY.DEFECT',
        name: '质量缺陷',
        path: '/quality/defect',
        icon: <Icon name='life-buoy' />
    },
    {
        key: 'qualityanalyze',
        id: 'QUALITY.QUALITYANALYZE',
        path: '/quality/qualityanalyze',
        name: '种植质量分析'
    },
    {
        key: 'faithanalyze',
        id: 'QUALITY.FAITHANALYZE',
        name: '诚信供应商分析',
        path: '/quality/faithanalyze',
        icon: <Icon name='crosshairs' />
    }
];
