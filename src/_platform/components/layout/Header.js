import React, { Component } from 'react';
import { Menu, Badge } from 'antd';
import { Icon } from 'react-fa';
import './Header.less';
import { Link } from 'react-router-dom';
import {
    getUser,
    clearUser,
    getPermissions,
    removePermissions
} from '../../auth';
import { loadIgnoreModules, loadHeadLogo } from 'APP/api';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '_platform/store/global/tabs';

@connect(
    state => {
        const { platform = {} } = state;
        return platform;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class Header extends Component {
    static ignoreModules = loadIgnoreModules;

    // static menus = loadMenus;
    state = {
        dotShow: false,
        tasks: 0
    };
    componentDidMount () {
        const user = getUser();
        const tasks = user.tasks;
        if (user && user.ID) {
            if (tasks > 0) {
                this.setState({
                    dotShow: true,
                    tasks: tasks
                });
            }
        } else {
            this.clearSystemUser();
        }
    }

    clearSystemUser = () => {
        const {
            history,
            actions: { clearTab }
        } = this.props;
        clearUser();
        clearTab();
        removePermissions();
        window.localStorage.removeItem('LOGIN_USER_DATA');
        let remember = window.localStorage.getItem('QH_LOGIN_REMEMBER');
        if (!remember) {
            window.localStorage.removeItem('LOGIN_USER_PASSDATA');
        }
        setTimeout(() => {
            history.replace('/login');
        }, 500);
    }

    onClickDot = () => {
        this.setState({
            dotShow: false
        });
    };

    selectKeys () {
        const { match: { params: { module = '' } = {} } = {} } = this.props;
        const { key = '' } =
            Header.menus.find(menu => {
                const pathnames = /^\/(\w+)/.exec(menu.path) || [];
                return pathnames[1] === module;
            }) || {};
        return [key];
    }

    signOut () {
        this.clearSystemUser();
    }

    render () {
        const {
            tabs = {}
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        Header.menus = [
            {
                key: 'home',
                id: 'HOME',
                title: '首页',
                path: '/',
                icon: <Icon name='home' />
            },
            {
                key: 'dashboard',
                id: 'DASHBOARD',
                title: '综合展示',
                path: '/dashboard/onsite',
                icon: <Icon name='map' />
            },
            {
                key: 'overall',
                id: 'OVERALL',
                title: '综合管理',
                path: '/overall/news',
                icon: <Icon name='cubes' />
            },
            {
                key: 'datum',
                id: 'DATUM',
                title: '资料管理',
                path: '/datum/standard',
                icon: <Icon name='book' />
            },
            {
                key: 'schedule',
                id: 'SCHEDULE',
                title: '进度管理',
                path: '/schedule/stagereport',
                icon: <Icon name='random' />
            },
            {
                key: 'forest',
                id: 'FOREST',
                title: '森林大数据',
                path: '/forest/nursoverallinfo',
                icon: <Icon name='tree' />
            },
            {
                key: 'curing',
                id: 'CURING',
                title: '养护管理',
                path: '/curing/taskcreate',
                icon: <Icon name='map' />
            },
            // {
            //     key: 'market',
            //     id: 'MARKET',
            //     title: '苗木市场',
            //     path: '/market/seedlingsupply',
            //     icon: <Icon name='shopping-cart' />
            // },
            {
                key: 'checkwork',
                id: 'CHECKWORK',
                title: '考勤管理',
                path: '/checkwork/attendancecount',
                icon: <Icon name='print' />
            },
            {
                key: 'selfcare',
                id: 'SELFCARE',
                title: '个人中心',
                path: '/selfcare/task',
                icon: <Icon name='user' />
            },
            {
                key: 'system',
                id: 'SYSTEM',
                title: '系统设置',
                path: '/system/person',
                icon: <Icon name='cogs' />
            },
            {
                key: 'project',
                id: 'PROJECT',
                title: '项目管理',
                path: '/project/nurseryManagement',
                icon: <Icon name='sitemap' />
            },
            {
                key: 'dipping',
                id: 'DIPPING',
                title: '三维倾斜',
                path: '/dipping/dipping',
                icon: <Icon name='plane' />
            }
        ];
        const { match: { params: { module = '' } = {} } = {} } = this.props;
        const ignore = Header.ignoreModules.some(m => m === module);
        if (ignore) {
            return null;
        }
        const { username = '', name = '' } = getUser();
        let permissions = getPermissions() || [];
        if (fullScreenState === 'fullScreen') {
            return null;
        }
        return (
            <header className='header'>
                <a className='head-logo' href='/'>
                    <img src={loadHeadLogo} alt='logo' />
                    <div className='brand'>
                        <div>森林大数据建设管理平台</div>
                    </div>
                </a>
                <Menu
                    className='nav-menu head-nav'
                    selectedKeys={this.selectKeys()}
                    mode='horizontal'
                >
                    {Header.menus.map(menu => {
                        let has = permissions.some(
                            permission =>
                                permission.FunctionCode === `appmeta.${menu.id}.READ`
                        );
                        // let has = true;
                        let str;
                        if (has || username === 'admin') {
                            if (username) {
                                /*
									  对用户各个模块权限进行遍历，如果拥有某个子模块的权限，则将子模块的权限
									进行处理变换成子模块的路径
									*/
                                for (var i = 0; i < permissions.length; i++) {
                                    try {
                                        if (permissions[i] && permissions[i].FunctionCode) {
                                            let missArr = permissions[i].FunctionCode.split('.');
                                            if (missArr[0] === 'appmeta' && missArr[1] === menu.id) {
                                                if (
                                                    permissions[i].FunctionCode.indexOf(menu.id) !==
                                                        -1 &&
                                                    permissions[i].FunctionCode !==
                                                        `appmeta.${menu.id}.READ` &&
                                                    permissions[i].FunctionCode.indexOf(`.NONE.READ`) ===
                                                        -1
                                                ) {
                                                    str = permissions[i].FunctionCode;
                                                    break;
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        console.log('e', e);
                                    }
                                }
                                if (str !== undefined) {
                                    str =
                                        str.match(/appmeta(\S*).READ/)[1] || '';
                                    str = str.replace(/\./g, '/').toLowerCase();
                                    menu.path = str;
                                }
                            }

                            return (
                                <Menu.Item key={menu.key} className='nav-item'>
                                    <Link to={menu.path}>
                                        {menu.icon}
                                        <span className='title'>
                                            {menu.title}
                                        </span>
                                    </Link>
                                </Menu.Item>
                            );
                        }
                    })}
                </Menu>
                <div className='head-right'>
                    <div className='head-info'>
                        <a className='user'>{name || username}</a>
                        <Icon
                            name='sign-out'
                            title='退出登录'
                            onClick={this.signOut.bind(this)}
                        />
                    </div>
                    <div className='head-fn'>
                        <Badge count={this.state.tasks}>
                            <Link to='/selfcare/task'>
                                <Icon
                                    style={{ marginTop: '4px' }}
                                    name='tasks'
                                    title='个人任务'
                                    onClick={this.onClickDot.bind(this)}
                                />
                            </Link>
                        </Badge>
                    </div>
                </div>
            </header>
        );
    }
}
