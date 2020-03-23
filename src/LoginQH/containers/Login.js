import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/login';
import { actions as platformActions } from '_platform/store/global';
import {loadFooterYear, loadFooterCompany} from 'APP/api';
import {
    Form,
    Input,
    Button,
    Checkbox,
    message,
    Notification
} from 'antd';
import {
    clearUser
} from '_platform/auth';
import {
    LoginForm,
    AppDownload,
    ForgetPassword
} from '../components';
import './Login.less';

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
export default class Login extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            forgectState: false,
            countDown: 60,
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
        let APKUpdateInfo = await getAPKUpdateInfo();
        console.log('APKUpdateInfo', APKUpdateInfo);
        this.setState({
            APKUpdateInfo
        });
    }

    // 忘记密码
    handleForgetPassword () {
        this.setState({
            forgectState: true,
            appDownloadVisible: false
        });
    }
    // 从忘记密码页面返回
    handleForgetPasswordCancel () {
        this.setState({
            forgectState: false,
            appDownloadVisible: false
        });
    }
    // 点击下载APP
    handleAppDownload = () => {
        this.setState({
            forgectState: false,
            appDownloadVisible: true
        });
    }
    // 从下载APP页面返回
    handleAppDownloadCancel = () => {
        this.setState({
            forgectState: false,
            appDownloadVisible: false
        });
    }
    // 获取二维码计时
    handleChangeCountDown = () => {
        const {
            countDown
        } = this.state;
        console.log('countDown', countDown);
        if (countDown === 1) {
            this.setState({
                countDown: 60
            });
        } else {
            this.setState({
                countDown: countDown - 1
            });
        }
    }
    // 修改密码成功
    handleForgetPasswordCancelOk = () => {
        this.setState({
            countDown: 60,
            forgectState: false,
            appDownloadVisible: false
        });
    }
    render () {
        const {
            forgectState,
            appDownloadVisible
        } = this.state;

        return (
            <div className='login-wrap'>
                <div className='main-center'>
                    {
                        !forgectState && !appDownloadVisible
                            ? <LoginForm
                                {...this.props}
                                {...this.state}
                                handleForgetPassword={this.handleForgetPassword.bind(this)}
                                handleAppDownload={this.handleAppDownload.bind(this)}
                            /> : ''
                    }
                    {
                        forgectState
                            ? <ForgetPassword
                                {...this.props}
                                {...this.state}
                                handleChangeCountDown={this.handleChangeCountDown.bind(this)}
                                handleForgetPasswordCancel={this.handleForgetPasswordCancel.bind(this)}
                                handleForgetPasswordCancelOk={this.handleForgetPasswordCancelOk.bind(this)}
                            /> : ''
                    }
                    {
                        appDownloadVisible
                            ? <AppDownload
                                {...this.props}
                                {...this.state}
                                handleAppDownloadCancel={this.handleAppDownloadCancel.bind(this)}
                            /> : ''
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
                </div>

            </div>
        );
    }
}
