import React, { Component } from 'react';
import {
    Menu,
    Badge,
    Dropdown,
    Modal,
    Row,
    Col,
    Form,
    Select,
    Input,
    Notification,
    Spin,
    Button
} from 'antd';
import { Icon } from 'react-fa';
import './Header.less';
import { Link } from 'react-router-dom';
import {
    getUser,
    clearUser,
    getPermissions,
    removePermissions,
    getAreaTreeData
} from '../../auth';
import {
    getProjectNameByBigTreeListSection,
    getSectionNameByBigTreeListSection
} from '../../gisAuth';
import { loadIgnoreModules, loadHeadLogo } from 'APP/api';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '_platform/store/global/tabs';
import { actions as platformActions } from '_platform/store/global';
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
const FormItem = Form.Item;
const { Option } = Select;
@connect(
    state => {
        const { platform = {} } = state;
        return platform;
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)
class Header extends Component {
    constructor (props) {
        super(props);
        this.state = {
            changeSectionModalVisible: false,
            dotShow: false,
            tasks: 0,
            changeSectionLoading: false
        };
    }
    static ignoreModules = loadIgnoreModules;
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    static layoutT = {
        labelCol: { span: 18 },
        wrapperCol: { span: 6 }
    };
    static layoutR = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList
            },
            tree = {}
        } = this.props;
        if (!(tree && tree.bigTreeList && tree.bigTreeList instanceof Array && tree.bigTreeList.length > 0)) {
            await getTreeNodeList();
        }
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
        window.localStorage.removeItem('RegionCodeList');
        window.localStorage.removeItem('LOGIN_USER_PARENTORGDATA');
        window.localStorage.removeItem('LOGIN_USER_PARENTORGID');
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

    handleChangeUserSection = () => {
        this.setState({
            changeSectionModalVisible: true
        });
    }
    handleChangeSectionCancel = () => {
        this.setState({
            changeSectionModalVisible: false
        });
    }
    handleChangeSectionOk = async () => {
        const {
            actions: {
                putForestUser,
                getUsers,
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            history,
            location: { pathname = '' } = {}
        } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 修改标段  获取人员信息
                const user = getUser();
                // 根据用户名无法获取token
                let token = user.token;
                // 修改人员信息
                let putUserPostData = {
                    ID: user.ID, // 用户ID
                    Full_Name: user.name, // 姓名
                    User_Name: user.username, // 用户名
                    Org: user.org, // 组织机构
                    Phone: user.phone, // 电话
                    Duty: user.duty, // 职务
                    EMail: user.email,
                    Sex: user.sex, // 性别
                    Status: 1, // 状态
                    Section: values.section, // 标段
                    Number: user.number, // 身份证号码
                    Card: '', // 身份证正面照片
                    CardBack: '', // 身份证背面照片
                    Face: '',
                    Roles: [{ // 角色
                        ID: Number(user.roles.ID) // 角色ID
                    }]
                };
                console.log('putUserPostData', putUserPostData);
                this.setState({
                    changeSectionLoading: true
                });
                let userData = await putForestUser({}, putUserPostData);
                console.log('userData', userData);

                if (userData && userData.code && userData.code === 1) {
                    setTimeout(async () => {
                        // let token = '';
                        // let passwordData = window.localStorage.getItem('LOGIN_USER_PASSDATA');
                        // if (passwordData && passwordData.) {

                        // }

                        let userNewData = await getUsers({}, {username: user.username});
                        if (userNewData && userNewData.content && userNewData.content instanceof Array && userNewData.content.length > 0) {
                            window.localStorage.removeItem('LOGIN_USER_DATA');
                            let loginUserNewData = userNewData.content[0];
                            console.log('loginUserNewData', loginUserNewData);
                            loginUserNewData.Token = token;
                            setTimeout(async () => {
                                window.localStorage.setItem(
                                    'LOGIN_USER_DATA',
                                    JSON.stringify(loginUserNewData)
                                );
                                // 用户可以切换标段，切换标段之后，需要重新获取数据，因此需要更新数据
                                let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
                                let totalThinClass = data.totalThinClass || [];
                                let projectList = data.projectList || [];
                                // 获取所有的小班数据，用来计算养护任务的位置
                                await getTotalThinClass(totalThinClass);
                                // 区域地块树
                                await getThinClassTree(projectList);
                                history.replace('/');

                                // let href = window.location.href;
                                // let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
                                // let result = href.match(reg);
                                // console.log('href', href);
                                // console.log('result', result);
                                // console.log('history', history);
                                // console.log('pathname', pathname);
                                // history.replace(pathname);
                                Notification.success({
                                    message: '修改标段成功'
                                });
                                this.setState({
                                    changeSectionModalVisible: false,
                                    changeSectionLoading: false
                                });
                            }, 500);
                        }
                    }, 500);
                } else {
                    this.setState({
                        changeSectionLoading: false
                    });
                    Notification.error({
                        message: '修改标段失败'
                    });
                }
            }
        });
    }

    render () {
        const {
            tabs = {},
            tree = {},
            match: { params: { module = '' } = {} } = {},
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            changeSectionModalVisible,
            changeSectionLoading
        } = this.state;
        const {
            username = '',
            name = '',
            roles,
            section = '',
            companySectionList = []
        } = getUser();

        let fullScreenState = '';
        if (tabs && tabs.fullScreenState) {
            fullScreenState = tabs.fullScreenState;
        }

        const ignore = Header.ignoreModules.some(m => m === module);
        if (ignore) {
            return null;
        }
        if (fullScreenState === 'fullScreen') {
            return null;
        }

        let permissions = getPermissions() || [];
        // 修改标段  获取人员信息
        const user = getUser();

        let roleName = '';
        if (user.roles && user.roles && user.roles.RoleName) {
            roleName = user.roles.RoleName;
        }
        let sectionChangeMenu = '';
        let bigTreeList = (tree && tree.bigTreeList) || [];
        if (section && section.indexOf('P009') !== -1) {
            let sectionName = getSectionNameByBigTreeListSection(section, bigTreeList);
            let projectName = getProjectNameByBigTreeListSection(section, bigTreeList);
            sectionChangeMenu = (
                <Menu onClick={this.handleChangeUserSection.bind(this)}>
                    <Menu.Item>{`${sectionName}  (${projectName})`}</Menu.Item>
                </Menu>
            );
        }
        let sectionList = [];
        for (let i = 0; i < companySectionList.length; i++) {
            let compnaySection = companySectionList[i];
            if (compnaySection) {
                let sectionName = getSectionNameByBigTreeListSection(compnaySection, bigTreeList);
                sectionList.push({
                    No: compnaySection,
                    Name: sectionName
                });
            }
        }
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
        let selectedKeys = this.selectKeys();
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
                                * 对用户各个模块权限进行遍历，如果拥有某个子模块的权限，则将子模块的权限
                                * 进行处理变换成子模块的路径
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
                        {
                            sectionChangeMenu
                                ? <Dropdown overlay={sectionChangeMenu}>
                                    <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                                        <a className='userName'>{`${name || username} (${roleName})`}</a>
                                    </a>
                                </Dropdown> : <a className='userName'>{`${name || username} (${roleName})`}</a>
                        }

                        <Badge count={this.state.tasks}>
                            {/* <Link to='/selfcare/task'> */}
                            {/* <a onClick={this.onClickDot.bind(this)}> */}
                            <img
                                src={roleIcon}
                                style={{
                                    verticalAlign: 'middle',
                                    width: 25,
                                    height: 25
                                }}
                            />
                            {/* </a> */}
                            {/* </Link> */}
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
                <Modal
                    title='切换标段'
                    visible={changeSectionModalVisible}
                    footer={null}
                    maskClosable={false}
                    closable={false}
                    onOk={this.handleChangeSectionOk.bind(this)}
                    onCancel={this.handleChangeSectionCancel.bind(this)}
                >
                    <Spin spinning={changeSectionLoading}>

                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem
                                        {...Header.layout}
                                        label='用户名:'
                                    >
                                        {getFieldDecorator('UserName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入用户名，且不超过15位',
                                                    max: 15
                                                }
                                            ],
                                            initialValue: `${user.username}`
                                        })(
                                            <Input
                                                readOnly
                                                placeholder='请输入用户名'
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Header.layout}
                                        label='姓名:'
                                    >
                                        {getFieldDecorator('FullName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入姓名'
                                                }
                                            ],
                                            initialValue: `${user.name}`
                                        })(
                                            <Input
                                                readOnly
                                                placeholder='请输入姓名'
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Header.layout}
                                        label='身份证号码:'
                                    >
                                        {getFieldDecorator('idNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入身份证号码'
                                                }
                                            ],
                                            initialValue: `${user.number}`
                                        })(
                                            <Input
                                                placeholder='请输入身份证号码'
                                                readOnly
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Header.layout}
                                        label='手机号码:'
                                    >
                                        {getFieldDecorator('telephone', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入手机号码'
                                                }
                                            ],
                                            initialValue: `${user.phone}`
                                        })(
                                            <Input
                                                placeholder='请输入手机号码'
                                                readOnly
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Header.layout}
                                        label='职务:'
                                    >
                                        {getFieldDecorator('titles', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择职务'
                                                }
                                            ],
                                            initialValue: `${user.duty}`
                                        })(
                                            <Input
                                                placeholder='请选择职务'
                                                readOnly
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Header.layout}
                                        label='角色:'
                                    >
                                        {getFieldDecorator('roles', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择角色'
                                                }
                                            ],
                                            initialValue: `${roleName}`
                                        })(
                                            <Input
                                                placeholder='请选择角色'
                                                readOnly
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem {...Header.layout} label='标段'>
                                        {getFieldDecorator('section', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择标段'
                                                }
                                            ],
                                            initialValue: `${user.section}`
                                        })(
                                            <Select
                                                allowClear
                                                placeholder='请选择标段'
                                                style={{ width: '100%' }}
                                            >
                                                {(sectionList && sectionList.length > 0)
                                                    ? sectionList.map(item => {
                                                        return (
                                                            <Option
                                                                key={item.No}
                                                                value={item.No}
                                                            >
                                                                {item.Name}
                                                            </Option>
                                                        );
                                                    })
                                                    : ''}
                                            </Select>
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                key='submit'
                                type='primary'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.handleChangeSectionOk.bind(this)}
                            >
                                确定
                            </Button>
                            <Button
                                key='back'
                                style={{marginLeft: 30, float: 'right'}}
                                onClick={this.handleChangeSectionCancel.bind(this)}>
                                关闭
                            </Button>
                        </Row>
                    </Spin>
                </Modal>
            </header>
        );
    }
}
export default Form.create()(Header);
