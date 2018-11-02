import React, { Component } from 'react';
import { Row, Input, Steps } from 'antd';
import { FOREST_API } from '_platform/api';
import styles from './style.css';
import moment from 'moment';
const Step = Steps.Step;

export default class RiskDetail extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    // 树节点信息查看图片时格式转换
    _onImgClick (data) {
        let srcs = [];
        try {
            if (data) {
                let arr = data.split(',');
                arr.map(rst => {
                    let src = rst.replace(/\/\//g, '/');
                    src = `${FOREST_API}/${src}`;
                    srcs.push(src);
                });
            }
        } catch (e) {
            // console.log('处理图片', e);
        }
        return srcs;
    }

    _handleFlow (flow) {
        let arr = [];
        if (flow && flow.length > 0) {
            for (let i = flow.length - 1; i >= 0; i--) {
                let fullName = '';
                let userName = '';
                if (flow[i].CreateUserObj) {
                    fullName = flow[i].CreateUserObj.Full_Name ? flow[i].CreateUserObj.Full_Name : '';
                    userName = flow[i].CreateUserObj.User_Name ? flow[i].CreateUserObj.User_Name : '';
                }
                flow[i].Full_Name = fullName;
                flow[i].User_Name = userName;
                arr.push(flow[i]);
            }
        }
        return arr;
    }
    _handleRiskStatus (Status) {
        let status = '';
        if (Status === -1) {
            status = '已提交';
        } else if (Status === 0) {
            status = '未审核通过';
        } else if (Status === 1) {
            status = '（审核通过）整改中';
        } else if (Status === 2) {
            status = '整改完成';
        } else if (Status === 3) {
            status = '确认完成';
        }
        return status;
    }

    _handleSection (section) {
        const {
            platform: { tree = {} }
        } = this.props;
        let sectionData = (tree && tree.bigTreeList) || [];
        let data = '';
        if (section) {
            try {
                let arr = section.split('-');
                if (arr && arr.length === 3) {
                    sectionData.map((project) => {
                        if (project.No === arr[0]) {
                            let units = project.children;
                            data = project.Name;
                            units.map((unit) => {
                                if (unit.No === section) {
                                    data = data + unit.Name;
                                }
                            });
                        }
                    });
                }
            } catch (e) {

            }
        }
        return data;
    }

    /**
     *  CreateTime  上报时间   EventType  事件类型   InputerObj：上报对象  Pics：隐患照片  Problem：问题描述   ProblemType：问题类型
        Reorganizer：整改人  ReorganizeTime：整改时间  ReorganizeInfo：整改信息   ReorganizePics：整改照片
        ReorganizeRequireTime：整改要求期限
        隐患关联线路  Section 标段 ：Status  状态  Supervisor：监理
        EventType :  0:质量缺陷 1：安全隐患 2：文明施工，3：其他
        Status  -1:提交  0:未审核通过 1：（审核通过）整改中 2：整改完成  3：确认完成
     */

    render () {
        const { riskMess } = this.props;
        // 隐患照片
        let beforeImgs = this._onImgClick(riskMess.Pics);
        let afterImgs = this._onImgClick(riskMess.ReorganizePics);
        let flow = this._handleFlow(riskMess.Flows);
        let status = this._handleRiskStatus(riskMess.Status);
        let location = this._handleSection(riskMess.Section);
        return (
            <Row gutter={28}>
                <Input
                    readOnly
                    style={{
                        marginTop: '10px'
                    }}
                    size='large'
                    addonBefore='隐患内容'
                    value={riskMess.ProblemType}
                />
                <Input
                    readOnly
                    style={{
                        marginTop: '10px'
                    }}
                    size='large'
                    addonBefore='隐患描述'
                    value={riskMess.Problem}
                />
                <Input
                    readOnly
                    style={{
                        marginTop: '10px'
                    }}
                    size='large'
                    addonBefore='隐患区域'
                    value={location}
                />
                <Input
                    readOnly
                    style={{
                        marginTop: '10px'
                    }}
                    size='large'
                    addonBefore='隐患位置'
                    value={`${riskMess.X} , ${
                        riskMess.Y
                    }`}
                />
                <Input
                    readOnly
                    style={{
                        marginTop: '10px'
                    }}
                    size='large'
                    addonBefore='整改状态'
                    value={status}
                />
                <div className={`mb`}>
                    {(beforeImgs && beforeImgs.length > 0)
                        ? beforeImgs.map(src => {
                            return (
                                <div>
                                    <h3 style={{
                                        marginTop: '15px'
                                    }}>整改前照片：</h3>
                                    <img
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            display: 'block',
                                            marginTop: '10px',
                                            marginLeft: 70
                                        }}
                                        src={src}
                                        alt='整改前照片'
                                    />
                                </div>
                            );
                        })
                        : ''}
                </div>
                <div className={`mb`}>
                    {(afterImgs && afterImgs.length > 0)
                        ? afterImgs.map(src => {
                            return (
                                <div>
                                    <h3 style={{
                                        marginTop: '15px'
                                    }}>整改后照片：</h3>
                                    <img
                                        style={{
                                            width: '300px',
                                            height: '300px',
                                            display: 'block',
                                            marginTop: '10px',
                                            marginLeft: 70
                                        }}
                                        src={src}
                                        alt='整改后照片'
                                    />
                                </div>
                            );
                        })
                        : ''}
                </div>
                <div className={`${styles.divLine} ${styles.mb}`} />
                <div className={styles.mb}>
                    <h3 style={{
                        marginTop: '15px'
                    }} >处理过程：</h3>
                    <Steps direction='vertical' size='small' current={history.length - 1} style={{marginLeft: 70}}>
                        {
                            flow.map((step, index) => {
                                return (
                                    <Step
                                        key={index}
                                        title={`${step.Node}`}
                                        description={
                                            <div style={{ lineHeight: 2.6 }}>
                                                <div>意见：{step.Info}</div>
                                                <div>
                                                    <span>执行人:{`${step.Full_Name}` || `${step.User_Name}`} [{step.User_Name}]</span>
                                                    <span
                                                        style={{ paddingLeft: 20 }}>执行时间：{moment(step.CreateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                </div>
                                            </div>
                                        }
                                    />);
                            })
                        }
                    </Steps>
                </div>
            </Row>
        );
    }
}
