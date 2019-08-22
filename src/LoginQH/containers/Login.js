import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/login';
import { actions as platformActions } from '_platform/store/global';
import {
    Form,
    Input,
    Button,
    Checkbox,
    message,
    Notification
} from 'antd';
import {
    clearUser,
    setPermissions,
    removePermissions
} from '_platform/auth';
import './Login.less';

const FormItem = Form.Item;

@connect(
    state => {
        const { login: { login = {} } = {}, platform } = state;
        return { ...login, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
class Login extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            isPwd: true,
            forgectState: false,
            checked: '',
            getSecurityCodeStatus: false,
            countDown: 60,
            setUserStatus: false
        };
        clearUser();
    }

    componentDidMount () {
        // 页面加载后自动聚焦
        this.nameInput.focus();
        let LOGIN_USER_PASSDATA = window.localStorage.getItem('LOGIN_USER_PASSDATA');
        if (LOGIN_USER_PASSDATA) {
            LOGIN_USER_PASSDATA = JSON.parse(LOGIN_USER_PASSDATA) || {};
            if (LOGIN_USER_PASSDATA.username && LOGIN_USER_PASSDATA.password) {
                const { setFieldsValue } = this.props.form;
                setFieldsValue({
                    username: LOGIN_USER_PASSDATA.username,
                    password: LOGIN_USER_PASSDATA.password,
                    remember: LOGIN_USER_PASSDATA.remember
                });

                document.getElementById('username').value =
                    LOGIN_USER_PASSDATA.username;
                document.getElementById('pwdInp').value =
                    LOGIN_USER_PASSDATA.password;
                this.state.checked = LOGIN_USER_PASSDATA.remember;
            }
        }
    }

    handleChangeUser = (value) => {
        console.log('value', value);
        if (value) {
            this.setState({
                setUserStatus: true
            });
        } else {
            this.setState({
                setUserStatus: false
            });
        }
    }
    checkUserName = async (rule, value, callback) => {
        if (value) {
            // 不允许空格
            let reg = /^[^\s]*$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                if (value) {
                    if (value.length >= 0 && value.length <= 16) {
                        callback();
                    } else {
                        callback('请输入用户名(16位以下)');
                    }
                } else {
                    callback(`请输入正确的用户名`);
                }
            } else {
                callback(`请输入正确的用户名`);
            }
        } else {
            callback();
        }
    }
    checkPassWord = async (rule, value, callback) => {
        if (value) {
            let reg = /^[^\s]*$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                if (value) {
                    if (value.length >= 6 && value.length <= 16) {
                        callback();
                    } else {
                        callback('请输入密码(6到16位)');
                    }
                } else {
                    callback(`请输入正确的密码`);
                }
            } else {
                callback(`请输入正确的密码`);
            }
        } else {
            callback();
        }
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            forgectState,
            getSecurityCodeStatus,
            setUserStatus,
            countDown
        } = this.state;
        const loginTitle = require('./images/logo1.png');
        const docDescibe = require('./images/doc.png');
        const hello = require('./images/hello.png');
        const pwdType = this.state.isPwd ? 'password' : 'text';
        /// 密码输入框类型改变时图标变化
        let chgTypeImg = require('./images/icon_eye1.png');
        if (this.state.isPwd) {
            chgTypeImg = require('./images/icon_eye1.png');
        } else {
            chgTypeImg = require('./images/icon_eye2.png');
        }

        return (
            <div className='login-wrap'>
                <div className='main-center'>
                    <div className='main-logo'>
                        <img className='main-logos' src={docDescibe} />
                        <div className='main-on' />
                        <a className='login-title1'>
                            <img src={loginTitle} />
                        </a>
                    </div>
                    {
                        !forgectState ? (
                            <div className='main-box'>
                                <div className='main-at' />
                                <a className='login-title'>
                                    <img src={hello} />
                                </a>
                                <div className='main-img'>
                                    <Form
                                        onSubmit={this.handleSubmit.bind(this)}
                                        className='login-form'
                                        id='loginForm'
                                    >
                                        <p
                                            style={{
                                                fontSize: '25px',
                                                color: '#108EE9',
                                                textAlign: 'center',
                                                marginTop: '20px',
                                                marginLeft: '5px'
                                            }}
                                        >
                                            森林大数据建设管理平台
                                        </p>
                                        <FormItem
                                            style={{
                                                marginTop: '20px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('username', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入用户名(16位以下)'
                                                    },
                                                    {
                                                        validator: this.checkUserName
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    style={{
                                                        color: '#000000',
                                                        borderBottom:
                                                            '1px solid #cccccc'
                                                    }}
                                                    ref={(input) => { this.nameInput = input; }}
                                                    id='username'
                                                    placeholder='请输入用户名(4到16位)'
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            style={{
                                                marginTop: '50px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('password', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入密码(6到16位)'
                                                    },
                                                    {
                                                        validator: this.checkPassWord
                                                    }
                                                ]
                                            })(
                                                <div>
                                                    <Input
                                                        style={{
                                                            color: '#000000',
                                                            borderBottom:
                                                                '1px solid #cccccc'
                                                        }}
                                                        id='pwdInp'
                                                        type={pwdType}
                                                        placeholder='请输入密码(6到16位)'
                                                    />
                                                    <a
                                                        className='btn-change-type'
                                                        style={{
                                                            backgroundImage: `url(${chgTypeImg})`
                                                        }}
                                                        onClick={this.handleClick.bind(
                                                            this
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            style={{
                                                marginTop: '40px',
                                                marginLeft: '10px'
                                            }}
                                        >
                                            {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: false
                                            })(
                                                <div>
                                                    <Checkbox
                                                        style={{
                                                            color: 'gray',
                                                            paddingLeft: '5%'
                                                        }}
                                                        onChange={this.loginRememberChange.bind(
                                                            this
                                                        )}
                                                        checked={
                                                            this.state.checked
                                                        }
                                                    >
                                                        记住密码
                                                    </Checkbox>
                                                    <span
                                                        className='forgetPassword'
                                                        onClick={this.ForgetPassword.bind(
                                                            this
                                                        )}
                                                    >
                                                        忘记密码
                                                    </span>
                                                </div>
                                            )}
                                        </FormItem>
                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            className='login-form-button'
                                        >
                                            登录
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className='main-box'>
                                <div className='main-img'>
                                    <h1
                                        style={{
                                            textAlign: 'center',
                                            color: 'red'
                                        }}
                                    />
                                    <Form
                                        onSubmit={this.sureSubmit.bind(this)}
                                        className='login-form'
                                        id='loginForm'
                                    >
                                        <FormItem
                                            style={{
                                                marginTop: '40px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('nickname', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入用户名'
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    id='nickname'
                                                    style={{
                                                        color: '#000000',
                                                        borderBottom:
                                                            '1px solid #cccccc'
                                                    }}
                                                    onChange={this.handleChangeUser.bind(this)}
                                                    placeholder='请输入用户名'
                                                />
                                            )}
                                        </FormItem>

                                        <FormItem
                                            style={{
                                                marginTop: '30px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('phone', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入手机号'
                                                    }
                                                ]
                                            })(
                                                <div>
                                                    <Input
                                                        style={{
                                                            color: '#000000',
                                                            borderBottom:
                                                                '1px solid #cccccc'
                                                        }}
                                                        id='phoneNumber'
                                                        placeholder='请输入手机号'
                                                    />
                                                    {
                                                        getSecurityCodeStatus && setUserStatus
                                                            ? <a
                                                                className='security-code-status'
                                                            >{`${countDown}秒后重发`}</a>
                                                            : <a
                                                                className='security-code-type'
                                                                onClick={this.handleGetSecurityCode.bind(
                                                                    this
                                                                )}
                                                            >获取验证码</a>
                                                    }

                                                </div>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            style={{
                                                marginTop: '30px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('securityCode', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入验证码'
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    id='securityCode'
                                                    style={{
                                                        color: '#000000',
                                                        borderBottom:
                                                            '1px solid #cccccc'
                                                    }}
                                                    placeholder='请输入验证码'
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem
                                            style={{
                                                marginTop: '30px',
                                                marginLeft: '24px'
                                            }}
                                        >
                                            {getFieldDecorator('newPassWord', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入新密码'
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    id='newPassWord'
                                                    style={{
                                                        color: '#000000',
                                                        borderBottom:
                                                            '1px solid #cccccc'
                                                    }}
                                                    placeholder='请输入新密码'
                                                />
                                            )}
                                        </FormItem>
                                        <Button
                                            type='primary'
                                            onClick={this.cancel.bind(this)}
                                            style={{
                                                width: '35%',
                                                height: '45px',
                                                marginTop: 50,
                                                marginLeft: '10%',
                                                fontSize: 18
                                            }}
                                        >
                                            返回
                                        </Button>
                                        <Button
                                            type='primary'
                                            htmlType='submit'
                                            style={{
                                                width: '35%',
                                                height: '45px',
                                                marginTop: 50,
                                                marginLeft: '10%',
                                                fontSize: 18
                                            }}
                                        >
                                            确定
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

    loginRememberChange (e) {
        this.state.checked = e.target.checked;
        if (e.target.checked) {
            window.localStorage.setItem('QH_LOGIN_REMEMBER', true);
        } else {
            window.localStorage.setItem('QH_LOGIN_REMEMBER', false);
        }
    }
    // 忘记密码
    ForgetPassword () {
        this.setState({
            forgectState: true
        });
    }
    // 返回登录
    backLogin () {
        this.setState({
            forgectState: false
        });
    }
    handleClick (e) {
        e.preventDefault();
        this.setState({
            isPwd: !this.state.isPwd
        });
    }

    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const data = {
                    username: values.username,
                    password: values.password,
                    remember: values.remember
                };
                this.loginFunc(data, 0, values);
            }
        });
    }

    loginFunc = async (data, loginType, values) => {
        const {
            actions: {
                getTasks,
                loginForest,
                getRolePermission,
                getUsers
            },
            history: { replace }
        } = this.props;
        await clearUser();
        await clearUser();
        await removePermissions();
        await removePermissions();
        console.log('loginFuncloginFuncdata', data);
        let postData = {};
        postData = {
            phone: data.username,
            pwd: data.password,
            imei: ''
        };
        // }
        let forestUserData = await loginForest({}, postData);
        console.log('forestUserData', forestUserData);
        if (forestUserData && forestUserData instanceof Array && forestUserData.length === 1) {
            let forestLoginUserData = forestUserData[0];
            if (!forestLoginUserData.Number && forestLoginUserData.User_Name !== 'admin') {
                Notification.error({
                    message: '该用户未进行实名认证，不能登录',
                    duration: 2
                });
                return;
            }
            if (forestLoginUserData.IsBlack === 1) {
                Notification.error({
                    message: '该用户已被拉黑，不能登录',
                    duration: 2
                });
                return;
            } else if (forestLoginUserData.IsForbidden === 1) {
                Notification.error({
                    message: '该用户已被禁用，不能登录',
                    duration: 2
                });
                return;
            } else if (forestLoginUserData.Status === 0) {
                Notification.error({
                    message: '该用户未经过审核，不能登录',
                    duration: 2
                });
                return;
            }
            // let tasks = [];
            // tasks = await getTasks(
            //     {},
            //     {
            //         task: 'processing',
            //         executor: forestLoginUserData.id,
            //         pagination: true,
            //         page: 1
            //     });
            let userRole = forestLoginUserData.Roles;
            if (userRole && userRole instanceof Array && userRole.length > 0) {
                let permissions = await getRolePermission({roleId: userRole[0].ID});
                await setPermissions(permissions);
            } else {
                await setPermissions([]);
            }

            Notification.open({
                message: loginType
                    ? '自动登录成功'
                    : '登录成功',
                description: forestLoginUserData.User_Name
            });

            window.localStorage.setItem(
                'LOGIN_USER_DATA',
                JSON.stringify(forestLoginUserData)
            );

            if (loginType === 0) {
                if (values.remember) {
                    window.localStorage.setItem(
                        'LOGIN_USER_PASSDATA',
                        JSON.stringify(data)
                    );
                } else {
                    window.localStorage.removeItem(
                        'LOGIN_USER_PASSDATA'
                    );
                }
            }
            setTimeout(() => {
                replace('/');
            }, 500);
        } else {
            let userData = await getUsers({}, {username: data.username});
            console.log('nickname', userData);
            if (userData && userData.content && userData.content instanceof Array && userData.content.length > 0) {
                Notification.error({
                    message: '密码错误！',
                    duration: 2
                });
            } else {
                Notification.error({
                    message: '用户名不存在！',
                    duration: 2
                });
            }
        }
    }

    // 获取验证码
    handleGetSecurityCode = async () => {
        const {
            actions: {
                getSecurityCode,
                getUsers
            },
            form: {
                getFieldValue
            }
        } = this.props;
        try {
            let phone = getFieldValue('phone');
            let username = getFieldValue('nickname');
            if (!username) {
                Notification.error({
                    message: '请输入用户名',
                    duration: 2
                });
                return;
            }
            if (!phone) {
                Notification.error({
                    message: '请输入手机号',
                    duration: 2
                });
                return;
            }
            let partn = /^1[0-9]{10}$/;
            if (!partn.exec(phone)) {
                Notification.error({
                    message: '手机号格式输入错误！',
                    duration: 2
                });
                return;
            }
            let userData = await getUsers({}, {username: username});
            console.log('nickname', userData);
            if (userData && userData.content && userData.content instanceof Array) {
                if (userData.content.length > 0) {
                    let content = userData.content[0];
                    let phonenumber = (content && content.Phone) || '';
                    if (!phonenumber) {
                        Notification.error({
                            message: '该用户未关联手机号，请联系管理员修改',
                            duration: 2
                        });
                        this.handleSecurityCodeStatus();
                        return;
                    }

                    if (phone !== phonenumber) {
                        Notification.error({
                            message: '填写手机号错误，请确认后重新输入',
                            duration: 2
                        });
                        // this.handleSecurityCodeStatus();
                        return;
                    }
                    let partn = /^1[0-9]{10}$/;
                    if (!partn.exec(phone)) {
                        Notification.error({
                            message: '手机号格式输入错误！',
                            duration: 2
                        });
                        this.handleSecurityCodeStatus();
                        return;
                    } else {
                        this.setState({
                            getSecurityCodeStatus: true
                        });
                        const data = {
                            action: 'vcode',
                            phone: phonenumber
                        };
                        let rst = await getSecurityCode({}, data);
                        let status = false;
                        if (rst.indexOf('code') !== -1) {
                            let handleData = rst.substring(1, rst.length - 1);
                            let handleDataArr = handleData.split(',');
                            if (handleDataArr && handleDataArr instanceof Array && handleDataArr.length > 0) {
                                let codeArr = handleDataArr[0].split(':');
                                if (codeArr && codeArr instanceof Array && codeArr.length === 2) {
                                    if (codeArr[1] === '1') {
                                        status = true;
                                    }
                                }
                            };
                        }
                        if (status) {
                            Notification.success({
                                message: '验证码发送成功',
                                duration: 3
                            });
                        } else {
                            Notification.error({
                                message: '验证码发送失败',
                                duration: 3
                            });
                        }
                        this.handleSecurityCodeStatus();
                    }
                } else {
                    Notification.error({
                        message: '此用户名不存在，请重新确认',
                        duration: 3
                    });
                    this.handleSecurityCodeStatus();
                    return;
                }
            }
        } catch (e) {
            console.log('handleGetSecurityCode', e);
        }
    }

    handleSecurityCodeStatus = () => {
        const {
            countDown
        } = this.state;
        if (countDown === 1) {
            this.setState({
                countDown: 60,
                getSecurityCodeStatus: false
            });
        } else {
            this.setState({
                countDown: countDown - 1,
                getSecurityCodeStatus: true
            });
            setTimeout(async () => {
                await this.handleSecurityCodeStatus();
            }, 1000);
        }
    }
    //	忘记密码确定
    sureSubmit (e) {
        e.preventDefault();
        const {
            actions: { getSecurityCode }
        } = this.props;
        try {
            this.props.form.validateFieldsAndScroll(async (err, values) => {
                if (!err) {
                    let partn = /^1[0-9]{10}$/;
                    let phonenumber = values.phone;
                    if (!partn.exec(phonenumber)) {
                        Notification.error({
                            message: '手机号输入错误！',
                            duration: 2
                        });
                    } else {
                        const data = {
                            action: 'modifypwd',
                            phone: phonenumber,
                            vcode: values.securityCode,
                            pwd: values.newPassWord,
                            username: values.nickname
                        };
                        let rst = await getSecurityCode({}, data);
                        let status = false;
                        if (rst.indexOf('code') !== -1) {
                            let handleData = rst.substring(1, rst.length - 1);
                            let handleDataArr = handleData.split(',');
                            if (handleDataArr && handleDataArr instanceof Array && handleDataArr.length > 0) {
                                let codeArr = handleDataArr[0].split(':');
                                if (codeArr && codeArr instanceof Array && codeArr.length === 2) {
                                    if (codeArr[1] === '1') {
                                        status = true;
                                    }
                                }
                            };
                        }
                        if (status) {
                            Notification.success({
                                message: '密码修改成功',
                                duration: 3
                            });
                        } else {
                            Notification.error({
                                message: '密码修改失败',
                                duration: 3
                            });
                        }
                        this.setState({
                            forgectState: false,
                            getSecurityCodeStatus: false,
                            setUserStatus: false,
                            countDown: 60
                        });
                    }
                }
            });
        } catch (e) {
            console.log('sureSubmit', e);
        }
    }
    cancel () {
        this.setState({
            forgectState: false
            // getSecurityCodeStatus: false,
            // setUserStatus: false,
            // countDown: 60
        });
    }
}

export default Form.create()(Login);
