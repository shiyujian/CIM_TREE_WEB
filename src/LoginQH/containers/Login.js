import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/login';
import { actions as platformActions } from '_platform/store/global';
import {loadFooterYear, loadFooterCompany} from 'APP/api';
import {ORGTYPE} from '_platform/api';
import {
    clearUser
} from '_platform/auth';
import {
    LoginForm,
    AppDownload,
    ForgetPassword,
    UserRegister
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
            APKUpdateInfo: '',
            ownerCompanyList: [],
            constructionCompanyList: [],
            supervisorCompanyList: [],
            designCompanyList: [],
            costCompanyList: [],
            curingCompanyList: [],
            registerVisible: false
        };
        clearUser();
    }

    componentDidMount = async () => {
        const {
            actions: {
                getAPKUpdateInfo,
                getLoginTreeNodeList,
                getOrgTreeByProjectOrgType
            }
        } = this.props;
        let APKUpdateInfo = await getAPKUpdateInfo();
        console.log('APKUpdateInfo', APKUpdateInfo);
        let wpunit = await getLoginTreeNodeList();
        console.log('wpunit', wpunit);
        let ownerCompanyList = [];
        let constructionCompanyList = [];
        let supervisorCompanyList = [];
        let designCompanyList = [];
        let costCompanyList = [];
        let curingCompanyList = [];
        for (let i = 0; i < ORGTYPE.length; i++) {
            console.log('ORGTYPE', ORGTYPE);
            let type = ORGTYPE[i];
            let orgDatas = await getOrgTreeByProjectOrgType({orgtype: type});
            if (orgDatas && orgDatas instanceof Array && orgDatas.length > 0) {
                let companyList = [];
                for (let i = 0; i < orgDatas.length; i++) {
                    let orgData = orgDatas[i];
                    if (orgData.Orgs && orgData.Orgs instanceof Array && orgData.Orgs.length > 0) {
                        let list = await this.getCompanyList(orgData.Orgs, orgData);
                        let treeData = {
                            title: orgData.ProjectName,
                            value: orgData.ID,
                            key: orgData.ID,
                            children: list,
                            selectable: false
                        };
                        companyList.push(treeData);
                    }
                }
                switch (type) {
                    case '业主单位':
                        ownerCompanyList = companyList;
                        break;
                    case '施工单位':
                        constructionCompanyList = companyList;
                        break;
                    case '监理单位':
                        supervisorCompanyList = companyList;
                        break;
                    case '设计单位':
                        designCompanyList = companyList;
                        break;
                    case '造价单位':
                        costCompanyList = companyList;
                        break;
                    case '养护单位':
                        curingCompanyList = companyList;
                        break;
                }
            }
        }
        console.log('ownerCompanyList', ownerCompanyList);
        console.log('constructionCompanyList', constructionCompanyList);
        console.log('supervisorCompanyList', supervisorCompanyList);
        console.log('designCompanyList', designCompanyList);
        console.log('costCompanyList', costCompanyList);
        console.log('curingCompanyList', curingCompanyList);
        this.setState({
            APKUpdateInfo,
            ownerCompanyList,
            constructionCompanyList,
            supervisorCompanyList,
            designCompanyList,
            costCompanyList,
            curingCompanyList
        });
    }

    // 查找所有的公司的List
    getCompanyList = async (list, orgData) => {
        list.map((data) => {
            data.ProjectName = orgData.ProjectName;
            data.title = data.OrgName;
            data.value = data.ID;
            data.key = data.ID;
        });
        console.log('list', list);
        return list;
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
    // 用户注册
    handleUserRegister = () => {
        this.setState({
            registerVisible: true
        });
    }
    // 取消用户注册
    handleUserRegisterCancel = () => {
        this.setState({
            registerVisible: false
        });
    }
    render () {
        const {
            forgectState,
            appDownloadVisible,
            registerVisible
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
                                handleUserRegister={this.handleUserRegister.bind(this)}
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
                    {
                        registerVisible
                            ? <UserRegister
                                {...this.props}
                                {...this.state}
                                handleUserRegisterCancel={this.handleUserRegisterCancel.bind(this)}
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
