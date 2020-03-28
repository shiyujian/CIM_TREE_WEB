import React, { Component } from 'react';
import {
    TreeSelect,
    Modal,
    Form,
    Row,
    Col,
    Spin,
    Notification,
    Input
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

const FormItem = Form.Item;
class UserRegister extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stepState: 1,
            roleType: 'construction',
            selectCompany: ''
        };
    }
    static layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    componentDidMount = async () => {

    };

    handleTreeModalCancel = async () => {
        await this.props.handleUserRegisterCancel();
    }

    handleChangeRoleType = (value) => {
        this.setState({
            roleType: value,
            selectCompany: ''
        });
    }
    // 切换注册步骤
    handleChangeStepState = (value) => {
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
        } else {
            this.setState({
                stepState: value
            });
        }
    }
    // 公司选中
    handleChangeCompany = (value) => {
        console.log('value', value);
        this.setState({
            selectCompany: value
        });
    }
    render () {
        const {
            adoptTreeModalLoading = false,
            ownerCompanyList,
            constructionCompanyList,
            supervisorCompanyList,
            designCompanyList,
            costCompanyList,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            stepState,
            roleType,
            selectCompany
        } = this.state;
        let roleImg = ownerImg;
        let companyList = constructionCompanyList;
        switch (roleType) {
            case 'construction':
                roleImg = constructionImg;
                companyList = constructionCompanyList;
                break;
            case 'supervisor':
                roleImg = supervisorImg;
                companyList = supervisorCompanyList;
                break;
            case 'design':
                roleImg = designImg;
                companyList = designCompanyList;
                break;
            case 'cost':
                roleImg = costImg;
                companyList = costCompanyList;
                break;
            case 'owner':
                roleImg = ownerImg;
                companyList = ownerCompanyList;
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
                                                <span className='UserRegister-stepOrder'>2</span>
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
                                                {getFieldDecorator('RealName', {
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
                                                {getFieldDecorator('idNum', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入身份证号码'
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
                                                onClick={this.handleChangeStepState.bind(this, 1)}>
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
                                                {getFieldDecorator('RealName', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入用户名'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请输入用户名' />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='手机号码:'
                                            >
                                                {getFieldDecorator('idNum', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入手机号码'
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
                                                {getFieldDecorator('idNum', {
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
                                                            className='UserRegister-accountInformation-input-SecurityCode'
                                                            placeholder='请输入验证码'
                                                        />
                                                        {/* {
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
                                                        } */}
                                                    </div>
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='密码:'
                                            >
                                                {getFieldDecorator('idNum', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入密码'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请输入密码'
                                                    />
                                                )}
                                            </FormItem>
                                            <FormItem
                                                {...UserRegister.layout}
                                                label='密码确认:'
                                            >
                                                {getFieldDecorator('idNum', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请确认密码'
                                                        }
                                                    ]
                                                })(
                                                    <Input
                                                        className='UserRegister-accountInformation-input'
                                                        placeholder='请确认密码'
                                                    />
                                                )}
                                            </FormItem>
                                        </Form>
                                        <div>
                                            <a
                                                style={{marginRight: 12}}
                                                onClick={this.handleChangeStepState.bind(this, 2)}>
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
                                                <a onClick={this.handleChangeStepState.bind(this, 3)}>
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
