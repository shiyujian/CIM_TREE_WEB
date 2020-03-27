import React, { Component } from 'react';
import { TreeSelect, Modal, Form, Row, Col, Spin } from 'antd';
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

class UserRegister extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stepState: 'roleSelect',
            roleType: 'construction'
        };
    }

    componentDidMount = async () => {

    };

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }

    handleTypeData = (type, curingTypeData) => {
        let times = 0;
        for (let i in curingTypeData) {
            if (i === type && curingTypeData[i]) {
                times = curingTypeData[i];
            }
        }
        return times;
    }

    handleCuringMess = () => {
        const {
            curingMess
        } = this.props;
        if (curingMess && curingMess instanceof Array && curingMess.length > 0) {
            let curingType = [];
            let curingTimes = [];
            let curingData = [];
            let curingTypeData = {};
            for (let i = 0; i < curingMess.length; i++) {
                let data = curingMess[i];
                let typeName = data.typeName;
                if (curingType.indexOf(typeName) === -1) {
                    curingType.push(typeName);
                    curingTimes[typeName] = 1;

                    curingTypeData[typeName] = curingTimes[typeName];
                } else {
                    curingTimes[typeName] = curingTimes[typeName] + 1;
                    curingTypeData[typeName] = curingTimes[typeName];
                }
                if (i < 3) {
                    curingData.push(data);
                }
            }
            let curingObject = {
                curingTypeData,
                curingData
            };
            return curingObject;
        }
    }
    handleChangeRoleType = (value) => {
        this.setState({
            roleType: value
        });
    }
    handleChangeStepState = (value) => {
        this.setState({
            stepState: value
        });
    }
    render () {
        const {
            seedlingMess = '',
            treeMess = '',
            UserRegister = '',
            adoptTreeModalLoading = false,
            curingMess = ''
        } = this.props;
        const {
            stepState,
            roleType
        } = this.state;
        let curingObject = this.handleCuringMess();
        let curingTypeData = (curingObject && curingObject.curingTypeData) || {};
        let curingData = (curingObject && curingObject.curingData) || [];
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
                            onClick={this.handleTreeModalCancel.bind(this)}
                            className='UserRegister-modal-topImg' />
                        <img src={closeImg}
                            onClick={this.handleTreeModalCancel.bind(this)}
                            className='UserRegister-modal-closeImg' />
                        <Row className='UserRegister-modal-title'>
                            个人注册
                        </Row>
                        <Row style={{paddingLeft: 24, paddingTop: 41}}>
                            {
                                stepState === 'roleSelect'
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>1</span>
                                        <span className='UserRegister-stepName-select'>角色选择</span>
                                    </Col> : <Col span={6}>
                                        <img src={stepImg} />
                                        <span className='UserRegister-stepOrder'>1</span>
                                        <span className='UserRegister-stepName'>角色选择</span>
                                    </Col>
                            }
                            {
                                stepState === 'realNameAuthentication'
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>2</span>
                                        <span className='UserRegister-stepName-select'>实名认证</span>
                                    </Col> : <Col span={6}>
                                        <img src={stepImg} />
                                        <span className='UserRegister-stepOrder'>2</span>
                                        <span className='UserRegister-stepName'>实名认证</span>
                                    </Col>
                            }
                            {
                                stepState === 'accountInformation'
                                    ? <Col span={6}>
                                        <img src={stepSelectImg} />
                                        <span className='UserRegister-stepOrder-select'>3</span>
                                        <span className='UserRegister-stepName-select'>账户信息</span>
                                    </Col> : <Col span={6}>
                                        <img src={stepImg} />
                                        <span className='UserRegister-stepOrder'>3</span>
                                        <span className='UserRegister-stepName'>账户信息</span>
                                    </Col>
                            }
                            {
                                stepState === 'submitSuccessfully'
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
                                stepState === 'roleSelect'
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
                                                />
                                            </div>
                                        </div>

                                        <div className='UserRegister-stepChange-button'>
                                            <a onClick={this.handleChangeStepState.bind(this, 'realNameAuthentication')}>
                                                <span className='UserRegister-stepChange-button-text'>
                                                    下一步
                                                </span>
                                            </a>
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
