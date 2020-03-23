/* eslint-disable standard/no-callback-literal */
import React, { Component } from 'react';
import {
    Form,
    Input,
    Checkbox,
    Notification
} from 'antd';
import {
    clearUser,
    setPermissions,
    removePermissions
} from '_platform/auth';
import './Login.less';
const FormItem = Form.Item;

class LoginForm extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            forgectState: false,
            checked: false,
            countDown: 60,
            appDownloadVisible: false
        };
        clearUser();
    }

    componentDidMount = async () => {
        // 页面加载后自动聚焦至输入用户名
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
    // 用户名输入校验
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
    // 密码输入校验
    checkPassWord = async (rule, value, callback) => {
        if (value) {
            let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
            // let reg = /^[^\s]*$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                if (value) {
                    if (value.length >= 6 && value.length <= 16) {
                        callback();
                    } else {
                        // eslint-disable-next-line standard/no-callback-literal
                        callback('6到16位（至少包括字母、数字以及特殊符号中的2种）');
                    }
                } else {
                    callback(`6到16位（至少包括字母、数字以及特殊符号中的2种）`);
                }
            } else {
                callback(`6到16位（至少包括字母、数字以及特殊符号中的2种）`);
            }
        } else {
            callback();
        }
    }
    // 切换记住密码状态
    loginRememberChange (e) {
        this.state.checked = e.target.checked;
        if (e.target.checked) {
            window.localStorage.setItem('QH_LOGIN_REMEMBER', true);
        } else {
            window.localStorage.setItem('QH_LOGIN_REMEMBER', false);
        }
    }
    // 点击登录
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
                loginForest,
                getRolePermission,
                getUsers
            },
            history,
            history: { replace },
            form: {
                setFieldsValue
            }
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
            let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
            if (!reg.test(data.password)) {
                Notification.warning({
                    message: '尊敬的用户，系统升级，检测到您的密码强度过低，为了保障账户安全，请您重新设置登录密码！',
                    duration: 3
                });
                this.setState({
                    forgectState: true
                }, () => {
                    setFieldsValue({
                        nickname: data.username
                        // phone: forestLoginUserData.Phone
                    });
                });
                return;
            }

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
                window.localStorage.clear();
                let href = window.location.href;
                if (href.indexOf('www.xaqnxl.com' !== -1)) {
                    history.replace('/login');
                    Notification.warning({
                        message: '验证已过期，请重新登录',
                        duration: 3
                    });
                }
            }, 21600000);
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
    // 点击下载APP
    handleAppDownload = () => {
        this.props.handleAppDownload();
    }
    // 忘记密码
    ForgetPassword () {
        this.props.handleForgetPassword();
    }
    render () {
        const {
            form: {
                getFieldDecorator
            },
            APKUpdateInfo
        } = this.props;
        const {
            forgectState,
            countDown,
            appDownloadVisible
        } = this.state;

        return (
            <div className='main-box'>
                <div className='main-img'>
                    <Form
                        autocomplete='off'
                        onSubmit={this.handleSubmit.bind(this)}
                        className='login-form'
                        id='loginForm'
                    >
                        <div className='login-title'>
                                    森林大数据建设管理平台
                        </div>
                        <FormItem
                            style={{
                                marginTop: '33px'
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
                                    className='login-usernameInput'
                                    ref={(input) => { this.nameInput = input; }}
                                    id='username'
                                    placeholder='请输入用户名(4到16位)'
                                />
                            )}
                        </FormItem>
                        <FormItem
                            style={{
                                marginTop: '22px'
                            }}
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '6到16位（至少包括字母、数字以及特殊符号中的2种）'
                                    }
                                    // {
                                    //     validator: this.checkPassWord
                                    // }
                                ]
                            })(
                                <div>
                                    <Input.Password
                                        className='login-passwordInput'
                                        id='pwdInp'
                                        placeholder='请输入密码'
                                    />
                                </div>
                            )}
                        </FormItem>
                        <FormItem
                            style={{
                                marginTop: '21px'
                            }}
                        >
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: false
                            })(
                                <div style={{display: 'inlineBlock'}}>
                                    <Checkbox
                                        className='password-remember-text'
                                        onChange={this.loginRememberChange.bind(this)}
                                        checked={this.state.checked}
                                    >
                                                记住密码
                                    </Checkbox>
                                    <span
                                        className='forgetPassword'
                                        onClick={this.ForgetPassword.bind(this)}
                                    >
                                                忘记密码
                                    </span>
                                </div>
                            )}
                        </FormItem>
                        {/* <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                >
                                    登录
                                </Button> */}
                        <a key='登录'
                            title='登录'
                            id='loginButton'
                            className='login-form-button'
                            onClick={this.handleSubmit.bind(this)}
                        >
                            <span className='login-form-button-text'>
                                        登录
                            </span>
                        </a>
                        <div>
                            <a
                                className='app-download-button'
                                disabled={!(APKUpdateInfo && APKUpdateInfo.url)}
                                onClick={this.handleAppDownload.bind(this)}>
                                            APP下载
                            </a>
                        </div>
                    </Form>
                </div>
            </div>

        );
    }
}

export default Form.create()(LoginForm);
