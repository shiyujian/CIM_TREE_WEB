import React, { Component } from 'react';
import {
    Form,
    Input,
    Notification
} from 'antd';
import './Login.less';
import returnIcon from './loginImages/arrow1.png';
const FormItem = Form.Item;

class ForgetPassword extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            getSecurityCodeStatus: false,
            setUserStatus: false,
            appDownloadVisible: false,
            APKUpdateInfo: ''
        };
    }

    componentDidMount = async () => {
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
    handleSecurityCodeStatus = async () => {
        const {
            countDown
        } = this.props;
        if (countDown === 1) {
            this.setState({
                getSecurityCodeStatus: false
            });
        } else {
            this.setState({
                getSecurityCodeStatus: true
            });
            setTimeout(async () => {
                await this.props.handleChangeCountDown();
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
                            getSecurityCodeStatus: false,
                            setUserStatus: false
                        });
                        this.props.handleForgetPasswordCancelOk();
                    }
                }
            });
        } catch (e) {
            console.log('sureSubmit', e);
        }
    }
    // 退出忘记密码
    cancel () {
        this.props.handleForgetPasswordCancel();
    }
    render () {
        const {
            countDown,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            getSecurityCodeStatus,
            setUserStatus
        } = this.state;

        return (
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
                                        (getSecurityCodeStatus && setUserStatus) || countDown !== 60
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
        );
    }
}

export default Form.create()(ForgetPassword);
