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
// 首页
import homeSelect from './layoutImages/首页2.png';
import homeUnselected from './layoutImages/首页1.png';
// 综合展示
import mapSelect from './layoutImages/综合展示2.png';
import mapUnselect from './layoutImages/综合展示1.png';
// 综合管理
import dataSelect from './layoutImages/综合管理2.png';
import dataUnselect from './layoutImages/综合管理1.png';
// 进度管理
import scheduleSelect from './layoutImages/进度管理2.png';
import scheduleUnselect from './layoutImages/进度管理1.png';
// 森林大数据
import forestSelect from './layoutImages/森林大数据2.png';
import forestUnselect from './layoutImages/森林大数据1.png';
// 养护管理
import conservationSelect from './layoutImages/养护管理2.png';
import conservationUnselect from './layoutImages/养护管理1.png';
// 考勤管理
import checkworkSelect from './layoutImages/考勤管理2.png';
import checkworkUnselect from './layoutImages/考勤管理1.png';
// 个人中心
import selfcareSelect from './layoutImages/个人中心2.png';
import selfcareUnselect from './layoutImages/个人中心1.png';
// 系统设置
import setSelect from './layoutImages/系统设置2.png';
import setUnselect from './layoutImages/系统设置1.png';
// 项目管理
import projectSelect from './layoutImages/项目管理2.png';
import projectUnselect from './layoutImages/项目管理1.png';
// 退出
import signOut from './layoutImages/退出1.png';
// 角色
import roleIcon from './layoutImages/role.png';

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
            actions: { clearTab },
            location: { pathname = '' } = {}
        } = this.props;
        console.log('pathname', pathname);
        clearUser();
        clearTab();
        removePermissions();
        window.localStorage.removeItem('LOGIN_USER_DATA');
        let remember = window.localStorage.getItem('QH_LOGIN_REMEMBER');
        if (!remember) {
            window.localStorage.removeItem('LOGIN_USER_PASSDATA');
        }
        window.localStorage.removeItem('RegionCodeList');
        window.localStorage.clear();
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
        const {
            match: {
                params: {
                    module = ''
                } = {}
            } = {},
            location: {
                pathname = ''
            } = {}
        } = this.props;
        const { key = '' } =
            Header.menus.find(menu => {
                const pathnames = /^\/(\w+)/.exec(menu.path) || [];
                return pathnames[1] === module;
            }) || {};
        if (pathname === '/') {
            return ['home'];
        }
        if (key) {
            return [key];
        } else {
            return '';
        }
    }

    signOut () {
        this.clearSystemUser();
    }

    handleOnsiteChange = async (path) => {
        const {
            history,
            actions: { switchFullScreenState },
            location: { pathname = '' } = {}
        } = this.props;
        switchFullScreenState('fullScreen');
        this.startFullScreen();
        history.push(path);
    }
    // 进入全屏
    startFullScreen () {
        try {
            var element = document.documentElement;
            // W3C
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
        } catch (e) {
            console.log('startFullScreen', e);
        }
    }

    render () {
        const {
            tabs = {}
        } = this.props;
        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }
        let href = window.location.href;
        let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
        let result = href.match(reg);

        Header.menus = [
            {
                key: 'home',
                id: 'HOME',
                title: '首页',
                path: '/',
                icon: homeUnselected,
                selectedIcon: homeSelect
            },
            {
                key: 'dashboard',
                id: 'DASHBOARD',
                title: '综合展示',
                path: '/dashboard/onsite',
                icon: mapUnselect,
                selectedIcon: mapSelect
            },
            {
                key: 'overall',
                id: 'OVERALL',
                title: '综合管理',
                path: '/overall/news',
                icon: dataUnselect,
                selectedIcon: dataSelect
            },
            {
                key: 'schedule',
                id: 'SCHEDULE',
                title: '进度管理',
                path: '/schedule/stagereport',
                icon: scheduleUnselect,
                selectedIcon: scheduleSelect
            },
            {
                key: 'forest',
                id: 'FOREST',
                title: '森林大数据',
                path: '/forest/nursoverallinfo',
                icon: forestUnselect,
                selectedIcon: forestSelect
            },
            {
                key: 'conservation',
                id: 'CONSERVATION',
                title: '养护管理',
                path: '/conservation/taskcreate',
                icon: conservationUnselect,
                selectedIcon: conservationSelect
            },
            {
                key: 'checkwork',
                id: 'CHECKWORK',
                title: '考勤管理',
                path: '/checkwork/attendancecount',
                icon: checkworkUnselect,
                selectedIcon: checkworkSelect
            },
            {
                key: 'selfcare',
                id: 'SELFCARE',
                title: '个人中心',
                path: '/selfcare/task',
                icon: selfcareUnselect,
                selectedIcon: selfcareSelect
            },
            {
                key: 'setup',
                id: 'SETUP',
                title: '系统设置',
                path: '/setup/person',
                icon: setUnselect,
                selectedIcon: setSelect
            },
            {
                key: 'project',
                id: 'PROJECT',
                title: '项目管理',
                path: '/project/nurseryManagement',
                icon: projectUnselect,
                selectedIcon: projectSelect
            }
            // {
            //     key: 'dipping',
            //     id: 'DIPPING',
            //     title: '三维倾斜',
            //     path: '/dipping/dipping',
            //     icon: <Icon name='plane' />
            // }
        ];
        const { match: { params: { module = '' } = {} } = {} } = this.props;
        const ignore = Header.ignoreModules.some(m => m === module);
        if (ignore) {
            return null;
        }
        const { username = '', name = '', roles } = getUser();
        let permissions = getPermissions() || [];
        if (fullScreenState === 'fullScreen') {
            return null;
        }
        let roleName = '';
        if (roles && roles.RoleName) {
            roleName = roles.RoleName;
        }
        let selectedKeys = this.selectKeys();
        console.log('selectedKeys', selectedKeys);

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
                    selectedKeys={selectedKeys}
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
                            let titleStyle = 'title';
                            let imgIcon = menu.icon;
                            if (selectedKeys && menu.key.indexOf(selectedKeys) !== -1) {
                                titleStyle = 'selectTitle';
                                imgIcon = menu.selectedIcon;
                            }
                            if (menu.path === '/dashboard/onsite') {
                                return (
                                    <Menu.Item
                                        key={menu.key}
                                        className='nav-item'>
                                        <a onClick={this.handleOnsiteChange.bind(this, menu.path)}>
                                            <img
                                                src={imgIcon}
                                                style={{ verticalAlign: 'middle' }}
                                            />
                                            <span className={`${titleStyle}`}>
                                                {menu.title}
                                            </span>
                                        </a>
                                    </Menu.Item>
                                );
                            } else {
                                return (
                                    <Menu.Item
                                        key={menu.key}
                                        className='nav-item'>
                                        <Link
                                            to={menu.path}>
                                            <img
                                                src={imgIcon}
                                                style={{ verticalAlign: 'middle' }}
                                            />
                                            <span className={`${titleStyle}`}>
                                                {menu.title}
                                            </span>
                                        </Link>
                                    </Menu.Item>
                                );
                            }
                        }
                    })}
                </Menu>
                <div className='head-right'>
                    <div className='head-info'>
                        <a className='userName'>{`${name || username} (${roleName})`}</a>
                        {/* <a onClick={this.onClickDot.bind(this)}>
                            <img
                                src={roleIcon}
                                style={{ verticalAlign: 'middle' }}
                            />
                        </a> */}
                        <Badge count={this.state.tasks}>
                            <Link to='/selfcare/task'>
                                <a onClick={this.onClickDot.bind(this)}>
                                    <img
                                        src={roleIcon}
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                </a>
                            </Link>
                        </Badge>
                        <a onClick={this.signOut.bind(this)}
                            style={{marginLeft: 17}}
                            className='signout'>
                            {/* <img
                                title='退出登录'
                                src={signOut}
                                style={{ verticalAlign: 'middle' }}
                            /> */}
                        </a>
                        {/* <Icon
                            name='sign-out'
                            title='退出登录'
                            onClick={this.signOut.bind(this)}
                        /> */}
                    </div>
                    {/* <div className='head-fn'>
                        <a style={{marginRight: 5}}>{roleName}</a>
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
                    </div> */}
                </div>
            </header>
        );
    }
}
