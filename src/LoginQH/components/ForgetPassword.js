import React, { Component } from 'react';
import {loadFooterYear, loadFooterCompany} from 'APP/api';
import {
    Form,
    Input,
    Button,
    Checkbox,
    message,
    Notification
} from 'antd';
import QRCode from 'qrcode.react';
import {
    clearUser,
    setPermissions,
    removePermissions
} from '_platform/auth';
import '../containers/Login.less';
import returnIcon from './loginImages/arrow1.png';
const FormItem = Form.Item;

class Login extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            forgectState: false,
            checked: '',
            getSecurityCodeStatus: false,
            countDown: 60,
            setUserStatus: false,
            appDownloadVisible: false,
            APKUpdateInfo: ''
        };
        clearUser();
    }

    componentDidMount = async () => {
        const {
            actions: {
                getAPKUpdateInfo
            }
        } = this.props;
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
        let APKUpdateInfo = await getAPKUpdateInfo();
        console.log('APKUpdateInfo', APKUpdateInfo);
        this.setState({
            APKUpdateInfo
        });
    }
    // 输入用户名
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
    // 点击下载APP
    handleAppDownload = () => {
        this.setState({
            forgectState: true,
            appDownloadVisible: true
        });
    }
    // 返回登录
    handleAppDownloadCancel = () => {
        this.setState({
            forgectState: false,
            appDownloadVisible: false
        });
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
    // 是否可以点击接收验证码
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
    render () {
        const { getFieldDecorator } = this.props.form;
        const {
            forgectState,
            getSecurityCodeStatus,
            setUserStatus,
            countDown,
            appDownloadVisible,
            APKUpdateInfo
        } = this.state;

        return (
            <div className='login-wrap'>
                <div className='main-center'>
                    {
                        !forgectState ? (
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
                        ) : (
                            appDownloadVisible
                                ? (
                                    <div className='main-box'>
                                        <div className='main-img'>
                                            <div style={{marginLeft: 31}}>
                                                <div className='appDownload-title'>
                                                    雄安森林APP下载：
                                                </div>
                                                <div>
                                                    <span className='appDownloadTips' >
                                                        请用浏览器打开
                                                    </span>
                                                </div>
                                                <QRCode
                                                    style={{
                                                        width: 215,
                                                        height: 215
                                                    }}
                                                    className='QRCodeLayout'
                                                    key={APKUpdateInfo.url}
                                                    id={APKUpdateInfo.url}
                                                    value={APKUpdateInfo.url} />
                                                <div className='appDownload-edition'>
                                                    {APKUpdateInfo.versionName}版本
                                                </div>
                                                <a key='返回'
                                                    title='返回'
                                                    id='frogetPasswordReturnButton'
                                                    className='froget-password-return-button'
                                                    onClick={this.handleAppDownloadCancel.bind(this)}
                                                >
                                                    <span className='froget-password-return-button-text'>
                                                    返回
                                                    </span>
                                                    <img src={returnIcon} />
                                                </a>
                                            </div>
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
                                            <div className='froget-password-title'>
                                                忘记密码
                                            </div>
                                            <Form
                                                onSubmit={this.sureSubmit.bind(this)}
                                                className='login-form'
                                                id='loginForm'
                                            >
                                                <FormItem
                                                    style={{
                                                        marginTop: '16px'
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
                                                            className='login-usernameInput'
                                                            id='nickname'
                                                            onChange={this.handleChangeUser.bind(this)}
                                                            placeholder='请输入用户名'
                                                        />
                                                        // <Input
                                                        //     id='nickname'
                                                        //     style={{
                                                        //         color: '#000000',
                                                        //         borderBottom:
                                                        //     '1px solid #cccccc'
                                                        //     }}
                                                        //     onChange={this.handleChangeUser.bind(this)}
                                                        //     placeholder='请输入用户名'
                                                        // />
                                                    )}
                                                </FormItem>

                                                <FormItem
                                                    style={{
                                                        marginTop: '16px'
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
                                                                className='login-usernameInput'
                                                                id='phoneNumber'
                                                                placeholder='请输入手机号'
                                                            />
                                                        </div>
                                                    )}
                                                </FormItem>
                                                <FormItem
                                                    style={{
                                                        marginTop: '16px'
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
                                                        <div>
                                                            <Input
                                                                id='securityCode'
                                                                className='login-usernameInput'
                                                                placeholder='请输入验证码'
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
                                                        marginTop: '16px'
                                                    }}
                                                >
                                                    {getFieldDecorator('newPassWord', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '6到16位（至少包括字母、数字以及特殊符号中的2种）'
                                                            },
                                                            {
                                                                validator: this.checkPassWord
                                                            }
                                                        ]
                                                    })(
                                                        <Input
                                                            id='newPassWord'
                                                            className='login-usernameInput'
                                                            placeholder='6到16位（至少包括字母、数字以及特殊符号中的2种）'
                                                        />
                                                    )}
                                                </FormItem>
                                                <a key='确认'
                                                    title='确认'
                                                    id='frogetPasswordButton'
                                                    className='froget-password-button'
                                                    onClick={this.sureSubmit.bind(this)}
                                                >
                                                    <span className='froget-password-button-text'>
                                                        确认
                                                    </span>
                                                </a>
                                                <a key='返回'
                                                    title='返回'
                                                    id='frogetPasswordReturnButton'
                                                    className='froget-password-return-button'
                                                    onClick={this.cancel.bind(this)}
                                                >
                                                    <span className='froget-password-return-button-text'>
                                                    返回
                                                    </span>
                                                    <img src={returnIcon} />
                                                </a>
                                            </Form>
                                        </div>
                                    </div>
                                )
                        )
                    }
                </div>
                <div className='login-footer'>
                    <span>Copyright&nbsp;</span>
                    <span>&copy;{loadFooterYear}&nbsp;</span>
                    <span>
                        <a style={{color: 'white'}}>
                            {loadFooterCompany}&nbsp;|&nbsp;
                        </a>
                    </span>
                    <span>
                        <a href='http://www.beian.miit.gov.cn/' target='_Blank' style={{color: 'white'}}>
                            浙ICP备18040969号-4
                        </a>
                    </span>
                    {/* <div>
                        <span>&copy;{loadFooterYear}&nbsp;</span>
                        <span>
                            {loadFooterCompany}
                        </span>
                    </div>
                    <div>
                        <a href='http://www.beian.miit.gov.cn/' target='_Blank' style={{color: 'white'}}>
                            浙ICP备18040969号-4
                        </a>
                    </div> */}
                </div>

            </div>
        );
    }
}

export default Form.create()(Login);
