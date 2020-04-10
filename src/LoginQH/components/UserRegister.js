import React, { Component } from 'react';
import {
    TreeSelect,
    Modal,
    Form,
    Row,
    Col,
    Spin,
    Notification,
    Input,
    Select
} from 'antd';
import './UserRegister.less';
import moment from 'moment';
import closeImg from './UserRegisterImg/close.png';
import topImg from './UserRegisterImg/顶部发光条.png';
import stepImg from './UserRegisterImg/步骤圆环1.png';
import stepSelectImg from './UserRegisterImg/步骤圆环2.png';
import ownerImg from './UserRegisterImg/业主.png';
import constructionImg from './UserRegisterImg/施工.png';
import supervisorImg from './UserRegisterImg/监理.png';
import designImg from './UserRegisterImg/设计.png';
import costImg from './UserRegisterImg/造价.png';
import returnImg from './UserRegisterImg/返回3.png';
import stepSuccessImg from './UserRegisterImg/步骤成功.png';
import submitSuccessImg from './UserRegisterImg/提交成功.png';
import submitFailImg from './UserRegisterImg/提交失败.png';
const Option = Select.Option;
const RealNameAuthentication = (addition) => {
    return new Promise((resolve) => {
        fetch(`https://idcert.market.alicloudapi.com/idcard?idCard=${addition.idNum}&name=${addition.FullName}`, {
            headers: {
                'Authorization': 'APPCODE ' + 'c091fa7360bc48ff87a3471f028d5645'
            }
        }).then(rep => {
            return rep.json();
        }).then(rst => {
            if (rst.status === '01') {
                Notification.success({
                    message: '实名认证通过'
                });
                resolve();
            } else {
                Notification.warning({
                    message: '实名认证失败，请确认信息是否正确'
                });
            }
        });
    });
};
const FormItem = Form.Item;
class UserRegister extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stepState: 3,
            roleType: 'construction',
            selectCompany: '',
            getSecurityCodeStatus: false,
            setUserStatus: false,
            countDown: 60,
            companyList: [],
            sectionList: []
        };
    }
    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    componentDidMount = async () => {
        const {
            actions: {
                getRoles
            },
            platform: {
                roles = []
            }
        } = this.props;
        const {
            roleType
        } = this.state;
        if (!(roles && roles instanceof Array && roles.length > 0)) {
            await getRoles();
        }
        this.handleChangeRoleType(roleType);
    };

    handleTreeModalCancel = async () => {
        await this.props.handleUserRegisterCancel();
    }

    handleChangeRoleType = (value) => {
        const {
            ownerCompanyList,
            constructionCompanyList,
            supervisorCompanyList,
            designCompanyList,
            costCompanyList
        } = this.props;
        let companyList = constructionCompanyList;
        switch (value) {
            case 'construction':
                companyList = constructionCompanyList;
                break;
            case 'supervisor':
                companyList = supervisorCompanyList;
                break;
            case 'design':
                companyList = designCompanyList;
                break;
            case 'cost':
                companyList = costCompanyList;
                break;
            case 'owner':
                companyList = ownerCompanyList;
                break;
        }
        this.setState({
            roleType: value,
            selectCompany: '',
            companyList,
            sectionList: []
        });
    }
    // 公司选中
    handleChangeCompany = (value, node) => {
        console.log('value', value);
        console.log('node', node);
        let sectionList = [];
        if (node && node.props && node.props.Section) {
            console.log('node.Section', node.props.Section);
            let sectionData = node.props.Section;
            if (sectionData instanceof Array) {
                sectionList = sectionData;
            } else {
                sectionList = sectionData.split(',');
            }
        }
        this.setState({
            selectCompany: value,
            sectionList
        });
    }
    // 身份证号校验
    checkIdNum = async (rule, value, callback) => {
        if (value) {
            // 身份证正则
            let reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
            console.log('reg.test(value)', reg.test(value));
            if (reg.test(value)) {
                callback();
            } else {
                callback(`请输入正确的身份证号码`);
            }
        } else {
            callback();
        }
    }
    // 用户名校验
    checkUserName = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[a-zA-Z0-9]{4,16}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (reg.test(value)) {
                callback();
            } else {
                callback(`请输入4到16位（字母，数字）用户名`);
            }
        } else {
            callback();
        }
    }
    // 手机号校验
    checkPersonTelephone = async (rule, value, callback) => {
        if (value) {
            // 手机号正则
            let reg = /^[1]([3-9])[0-9]{9}$/;
            console.log('reg.test(value)', reg.test(value));
            // isNaN(value);
            if (!isNaN(value) && reg.test(value)) {
                callback();
            } else {
                callback(`请输入正确的手机号`);
            }
        } else {
            callback();
        }
    }
    // 密码输入校验
    checkPassWord = async (rule, value, callback) => {
        if (value) {
            let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
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
    //
    checkRepeatPassWord = (rule, value, callback) => {
        const {
            form: {
                getFieldValue
            }
        } = this.props;
        let password = getFieldValue('passwordUserRegister');
        if (value) {
            if (!password) {
                callback('请输入密码');
            } else {
                if (value !== password) {
                    callback('密码输入不一致，请确认');
                } else {
                    callback();
                }
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
            let phone = getFieldValue('phoneNumUserRegister');
            let username = getFieldValue('userNameUserRegister');
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
            let partn = /^[1]([3-9])[0-9]{9}$/;
            if (!partn.exec(phone)) {
                Notification.error({
                    message: '手机号格式输入错误！',
                    duration: 2
                });
                return;
            }
            let userData = await getUsers({}, {username: username});
            console.log('nickname', userData);
            this.setState({
                getSecurityCodeStatus: true
            });
            const data = {
                action: 'vcode',
                phone: phone
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
    // 切换注册步骤
    handleChangeStepState = async (value) => {
        const {
            selectCompany,
            stepState
        } = this.state;
        if (stepState === 1) {
            if (selectCompany) {
                this.setState({
                    stepState: value
                });
            } else {
                Notification.error({
                    message: '请选择单位'
                });
            }
        } else if (stepState === 2) {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    console.log('values', values);
                    let realNameValues = {
                        idNum: values.idNumUserRegister,
                        FullName: values.realNameUserRegister
                    };
                    let data = await RealNameAuthentication(realNameValues);
                    console.log('data', data);
                    this.setState({
                        stepState: value,
                        idNum: values.idNumUserRegister,
                        FullName: values.realNameUserRegister
                    });
                }
            });
        } else if (stepState === 3) {
            this.handleUserRegister();
        } else if (stepState === 4) {
            this.setState({
                stepState: value
            });
        } else {
            this.setState({
                stepState: value
            });
        }
    }
    getRoleByCompanyType = (type) => {
        const {
            platform: {
                roles = []
            }
        } = this.props;
        console.log('roles', roles);

        let roleID = '';
        let parentRoleTypeID = '';
        roles.map((role) => {
            if (role && role.ID && role.ParentID === 0 && role.RoleName.indexOf(type) !== -1) {
                parentRoleTypeID = role.ID;
            }
        });
        roles.map((role) => {
            if (role && role.ID && role.ParentID === parentRoleTypeID && role.RoleName.indexOf('普通') !== -1) {
                roleID = role.ID;
            }
        });
        return roleID;
    }
    handleUserRegister = () => {
        const {
            actions: {
                postForestUser,
                getSecurityCode
            }
        } = this.props;
        const {
            roleType,
            idNum,
            FullName,
            selectCompany,
            sectionList
        } = this.state;
        try {
            this.props.form.validateFields(async (err, values) => {
                console.log('values', values);

                if (!err) {
                    const data = {
                        action: 'checkvcode',
                        phone: values.phoneNumUserRegister,
                        vcode: values.checkCodeUserRegister
                    };
                    let rst = await getSecurityCode({}, data);
                    console.log('rest', rst);
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
                            message: '验证码校验成功',
                            duration: 3
                        });
                    } else {
                        Notification.error({
                            message: '验证码校验失败，请重新输入验证码',
                            duration: 3
                        });
                        return;
                    }
                    let sction = '';
                    if (sectionList && sectionList instanceof Array && sectionList.length > 0) {
                        sction = sectionList[0];
                    }
                    let duty = '普通施工';
                    let roleID = '';
                    switch (roleType) {
                        case 'construction':
                            duty = '普通施工';
                            roleID = this.getRoleByCompanyType('施工');
                            break;
                        case 'supervisor':
                            duty = '普通监理';
                            roleID = this.getRoleByCompanyType('监理');
                            break;
                        case 'design':
                            duty = '普通设计';
                            roleID = this.getRoleByCompanyType('设计');
                            break;
                        case 'cost':
                            duty = '普通造价';
                            roleID = this.getRoleByCompanyType('造价');
                            break;
                        case 'owner':
                            duty = '业主';
                            roleID = this.getRoleByCompanyType('业主');
                            break;
                    }
                    console.log('roleID', roleID);
                    let sex = 0;
                    let sexNum = 0;
                    if (idNum) {
                        if (idNum.length === 18) {
                            sexNum = idNum.substring(17, 18);
                            console.log('sexNum', sexNum);
                        } else if (idNum.length === 15) {
                            sexNum = idNum.substring(15);
                            console.log('sexNum', sexNum);
                        }
                    }
                    if (Number(sexNum) % 2 === 0) {
                        sex = 1;
                    } else {
                        sex = 0;
                    }
                    let postUserPostData = {
                        Full_Name: FullName, // 姓名
                        User_Name: values.userNameUserRegister, // 用户名
                        Org: selectCompany, // 组织机构
                        Phone: values.phoneNumUserRegister, // 电话
                        Password: values.passwordUserRegister, // 密码
                        Duty: duty || '', // 职务
                        EMail: '',
                        Sex: sex, // 性别
                        Status: 0, // 状态
                        Section: sction, // 标段
                        Number: idNum, // 身份证号码
                        Card: '', // 身份证正面照片
                        CardBack: '', // 身份证背面照片
                        Face: '',
                        Roles: [{
                            ID: Number(roleID) // 角色ID
                            // ID: 8
                        }]
                    };
                    let userData = await postForestUser({}, postUserPostData);
                    console.log('userData', userData);
                    if (userData && userData.code === 1) {
                        const msgs = JSON.parse(userData.msg);
                        if (msgs && msgs.status && msgs.status === 400 && msgs.error &&
                                msgs.error === 'This id_num is blacklist'
                        ) {
                            Notification.warning({
                                message: '身份证号已经加入黑名单'
                            });
                        } else {
                            Notification.success({
                                message: '信息已提交成功，请等待审核'
                            });
                            this.setState({
                                stepState: 4
                            });
                        }
                    } else {
                        if (userData.code === 2) {
                            Notification.warning({
                                message: '用户名已存在！'
                            });
                        } else if (userData.code === 0) {
                            if (userData.msg === '账户注册的苗圃基地已被拉黑！') {
                                Notification.error({
                                    message: '账户注册的苗圃基地已被拉黑！'
                                });
                            } else {
                                Notification.error({
                                    message: '新增人员失败'
                                });
                            }
                        } else {
                            Notification.error({
                                message: '新增人员失败'
                            });
                        }
                    }
                }
            });
        } catch (e) {
            console.log('handleUserRegister', e);
        }
    }
    // 返回
    handleChangeBackStepState = (value) => {
        this.setState({
            stepState: value
        });
    }
    render () {
        const {
            adoptTreeModalLoading = false,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            stepState,
            roleType,
            selectCompany,
            getSecurityCodeStatus,
            setUserStatus,
            countDown,
            companyList,
            sectionList
        } = this.state;
        let roleImg = ownerImg;
        switch (roleType) {
            case 'construction':
                roleImg = constructionImg;
                break;
            case 'supervisor':
                roleImg = supervisorImg;
                break;
            case 'design':
                roleImg = designImg;
                break;
            case 'cost':
                roleImg = costImg;
                break;
            case 'owner':
                roleImg = ownerImg;
                break;
        }

        return (
            <Modal
                title={null}
                visible
                footer={null}
                width={800}
                closable={false}
                wrapClassName={'web'}
                maskClosable={false}
                onOk={this.handleTreeModalCancel.bind(this)}
                onCancel={this.handleTreeModalCancel.bind(this)}
            >
                <Spin spinning={adoptTreeModalLoading}>
                    <div className='UserRegister-background'>
                        <img src={topImg}
                            className='UserRegister-modal-topImg' />
                        <Row className='UserRegister-modal-title'>
                            个人注册
                            <img src={closeImg}
                                onClick={this.handleTreeModalCancel.bind(this)}
                                className='UserRegister-modal-closeImg' />
                        </Row>
                        <div className='UserRegister-top-line' />
                        <Row style={{paddingLeft: 24, paddingTop: 41}}>
                            {
                                stepState === 1
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>1</span>
                                        <span className='UserRegister-stepName-select'>角色选择</span>
                                        <span className='UserRegister-step-line' />
                                    </Col> : <Col span={6}>
                                        <img src={stepSuccessImg} />
                                        <span className='UserRegister-stepName'>角色选择</span>
                                        <span className='UserRegister-step-line-select' />
                                    </Col>
                            }
                            {
                                stepState === 2
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>2</span>
                                        <span className='UserRegister-stepName-select'>实名认证</span>
                                        <span className='UserRegister-step-line' />
                                    </Col> : (
                                        stepState > 2
                                            ? <Col span={6}>
                                                <img src={stepSuccessImg} />
                                                <span className='UserRegister-stepName'>实名认证</span>
                                                <span className='UserRegister-step-line-select' />
                                            </Col> : <Col span={6}>
                                                <img src={stepImg} />
                                                <span className='UserRegister-stepOrder'>2</span>
                                                <span className='UserRegister-stepName'>实名认证</span>
                                                <span className='UserRegister-step-line' />
                                            </Col>
                                    )
                            }
                            {
                                stepState === 3
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>3</span>
                                        <span className='UserRegister-stepName-select'>账户信息</span>
                                        <span className='UserRegister-step-line' />
                                    </Col> : (
                                        stepState > 3
                                            ? <Col span={6}>
                                                <img src={stepSuccessImg} />
                                                <span className='UserRegister-stepName'>账户信息</span>
                                                <span className='UserRegister-step-line-select' />
                                            </Col> : <Col span={6}>
                                                <img src={stepImg} />
                                                <span className='UserRegister-stepOrder'>3</span>
                                                <span className='UserRegister-stepName'>账户信息</span>
                                                <span className='UserRegister-step-line' />
                                            </Col>
                                    )
                            }
                            {
                                stepState === 4
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>4</span>
                                        <span className='UserRegister-stepName-select'>提交成功</span>
                                    </Col> : <Col span={6}>
                                        <img src={stepImg} />
                                        <span className='UserRegister-stepOrder'>4</span>
                                        <span className='UserRegister-stepName'>提交成功</span>
                                    </Col>
                            }
                        </Row>
                        <Row className='UserRegister-step-content'>
                            {
                                stepState === 1
                                    ? <Row>
                                        <div>
                                            <div className='UserRegister-roleImg-layout'>
                                                <img src={roleImg} />
                                            </div>
                                        </div>

                                        <div className='UserRegister-StatusButton'>
                                            <a key='施工'
                                                title='施工'
                                                className={roleType === 'construction' ? 'UserRegister-button-statusSel' : 'UserRegister-button-status'}
                                                onClick={this.handleChangeRoleType.bind(this, 'construction')}
                                                style={{
                                                    marginRight: 8
                                                // marginTop: 8
                                                }}
                                            >
                                                <span className={roleType === 'construction' ? 'UserRegister-button-status-textSel' : 'UserRegister-button-status-text'}>
                                                施工
                                                </span>
                                            </a>
                                            <a key='监理'
                                                title='监理'
                                                className={roleType === 'supervisor' ? 'UserRegister-button-statusSel' : 'UserRegister-button-status'}
                                                onClick={this.handleChangeRoleType.bind(this, 'supervisor')}
                                                style={{
                                                    marginRight: 8
                                                // marginTop: 8
                                                }}
                                            >
                                                <span className={roleType === 'supervisor' ? 'UserRegister-button-status-textSel' : 'UserRegister-button-status-text'}>
                                                监理
                                                </span>
                                            </a>
                                            <a key='设计'
                                                title='设计'
                                                className={roleType === 'design' ? 'UserRegister-button-statusSel' : 'UserRegister-button-status'}
                                                onClick={this.handleChangeRoleType.bind(this, 'design')}
                                                style={{
                                                    marginRight: 8
                                                // marginTop: 8
                                                }}
                                            >
                                                <span className={roleType === 'design' ? 'UserRegister-button-status-textSel' : 'UserRegister-button-status-text'}>
                                                设计
                                                </span>
                                            </a>
                                            <a key='造价'
                                                title='造价'
                                                className={roleType === 'cost' ? 'UserRegister-button-statusSel' : 'UserRegister-button-status'}
                                                onClick={this.handleChangeRoleType.bind(this, 'cost')}
                                                style={{
                                                    marginRight: 8
                                                // marginTop: 8
                                                }}
                                            >
                                                <span className={roleType === 'cost' ? 'UserRegister-button-status-textSel' : 'UserRegister-button-status-text'}>
                                                造价
                                                </span>
                                            </a>
                                            <a key='业主'
                                                title='业主'
                                                className={roleType === 'owner' ? 'UserRegister-button-statusSel' : 'UserRegister-button-status'}
                                                onClick={this.handleChangeRoleType.bind(this, 'owner')}
                                                style={{
                                                    marginRight: 8
                                                // marginTop: 8
                                                }}
                                            >
                                                <span className={roleType === 'owner' ? 'UserRegister-button-status-textSel' : 'UserRegister-button-status-text'}>
                                                业主
                                                </span>
                                            </a>
                                        </div>
                                        <div>
                                            <div className='UserRegister-TreeSelect'>
                                                <TreeSelect
                                                    style={{width: '100%'}}
                                                    placeholder='请选择单位'
                                                    treeData={companyList}
                                                    value={selectCompany}
                                                    onSelect={this.handleChangeCompany.bind(this)}
                                                />
                                            </div>
                                        </div>
                                        <div className='UserRegister-stepChange-button'>
                                            <a onClick={this.handleChangeStepState.bind(this, 2)}>
                                                <span className='UserRegister-stepChange-button-text'>
                                                    下一步
                                                </span>
                                            </a>
                                        </div>
                                    </Row> : ''
                            }
                            {
                                stepState === 2
                                    ? <Row className='UserRegister-realNameAuthentication-layout'>
                                        <Form>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='真实姓名:'
                                            >
                                                {getFieldDecorator('realNameUserRegister', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入真实姓名'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-realNameAuthentication-input'
                                                        placeholder='请输入真实姓名' />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='身份证号码:'
                                            >
                                                {getFieldDecorator('idNumUserRegister', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入身份证号码'
                                                        },
                                                        {
                                                            validator: this.checkIdNum
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-realNameAuthentication-input'
                                                        placeholder='请输入身份证号码'
                                                    />
                                                )}
                                            </FormItem>
                                        </Form>
                                        <div>
                                            <a
                                                style={{marginRight: 12}}
                                                onClick={this.handleChangeBackStepState.bind(this, 1)}>
                                                <img src={returnImg} />
                                            </a>
                                            <div className='UserRegister-realNameAuthentication-stepChange-button'>
                                                <a onClick={this.handleChangeStepState.bind(this, 3)}>
                                                    <span className='UserRegister-realNameAuthentication-stepChange-button-text'>
                                                    下一步
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </Row> : ''
                            }
                            {
                                stepState === 3
                                    ? <Row className='UserRegister-accountInformation-layout'>
                                        <Form>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='用户名:'
                                            >
                                                {getFieldDecorator('userNameUserRegister', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入4到16位（字母，数字）用户名'
                                                        },
                                                        {
                                                            validator: this.checkUserName
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请输入用户名（不区分大小写）' />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='手机号码:'
                                            >
                                                {getFieldDecorator('phoneNumUserRegister', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入手机号码'
                                                        },
                                                        {
                                                            validator: this.checkPersonTelephone
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请输入手机号码'
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='验证码:'
                                            >
                                                {getFieldDecorator('checkCodeUserRegister', {
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
                                                            className='UserRegister-accountInformation-input'
                                                            placeholder='请输入验证码'
                                                        />
                                                        {
                                                            (getSecurityCodeStatus && setUserStatus) || countDown !== 60
                                                                ? <a
                                                                    className='UserRegister-accountInformation-security-code-status'
                                                                >{`${countDown}秒后重发`}</a>
                                                                : <a
                                                                    className='UserRegister-accountInformation-security-code-type'
                                                                    onClick={this.handleGetSecurityCode.bind(
                                                                        this
                                                                    )}
                                                                >获取验证码</a>
                                                        }
                                                    </div>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='密码:'
                                            >
                                                {getFieldDecorator('passwordUserRegister', {
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
                                                    <Input.Password
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请输入6到16位密码（至少包括字母、数字以及特殊符号中的2种）'
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='密码确认:'
                                            >
                                                {getFieldDecorator('passwordCheckUserRegister', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请确认密码'
                                                        },
                                                        {
                                                            validator: this.checkRepeatPassWord
                                                        }
                                                    ]
                                                })(
                                                    <Input.Password
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请确认密码'
                                                    />
                                                )}
                                            </FormItem>
                                        </Form>
                                        <div>
                                            <a
                                                style={{marginRight: 12}}
                                                onClick={this.handleChangeBackStepState.bind(this, 2)}>
                                                <img src={returnImg} />
                                            </a>
                                            <div className='UserRegister-accountInformation-stepChange-button'>
                                                <a onClick={this.handleChangeStepState.bind(this, 4)}>
                                                    <span className='UserRegister-accountInformation-stepChange-button-text'>
                                                    下一步
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </Row> : ''
                            }
                            {
                                stepState === 4
                                    ? <Row className='UserRegister-SubmitSuccess-layout'>
                                        <div>
                                            <div className='UserRegister-SubmitSuccess-submitState'>
                                                <img src={submitSuccessImg} />
                                            </div>
                                        </div>
                                        <div className='UserRegister-SubmitSuccess-text-layout'>
                                            <div className='UserRegister-SubmitSuccess-text-first'>
                                                提交成功
                                            </div>
                                            <div className='UserRegister-SubmitSuccess-text-second'>
                                                请通知本单位文书进行账号审核
                                            </div>
                                        </div>
                                        <div>
                                            <div className='UserRegister-SubmitSuccess-stepChange-button'>
                                                <a onClick={this.handleTreeModalCancel.bind(this)}>
                                                    <span className='UserRegister-SubmitSuccess-stepChange-button-text'>
                                                    确认
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </Row> : ''
                            }
                        </Row>
                    </div>
                </Spin>
            </Modal>

        );
    }
}
export default Form.create()(UserRegister);
