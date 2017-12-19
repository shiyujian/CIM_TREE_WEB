/**
 * Created by tinybear on 17/9/17.
 * 审查设计成果组件
 */

import React, { Component } from 'react';
import { Row, Col, Radio, Input, Button, message, Popover } from 'antd';
import { getUser } from '_platform/auth';
import moment from 'moment';
import { DOWNLOAD_FILE } from '_platform/api';
import { DeisgnDirCode } from './util';
const RadioGroup = Radio.Group;

class ApprovalResBox extends Component {
    state = {
        CAD: null,
        PDF: null,
        BIM: null,
        attachmentFile: null,
        selectedWK: null,
        isPass: true,
        drawingIsPass: true,
        modelIsPass: true,
        advice: '',
        drawingAdvice: '',
        modelAdvice: '',
        busying: false,
        approvalType: null //1-图纸 2-模型 3-都是同一个人
    };

    componentDidMount() {
        let { CAD, PDF, BIM, attachmentFile, processId } = this.props.drawing.extra_params;
        this.setState({ CAD, PDF, BIM, attachmentFile });
        //获取流程
        const { getWorkflow } = this.props.actions;
        getWorkflow({ id: processId }).then(wk => {
            console.log('getWorkflow: ', wk);
            let subject = wk.subject[0];
            subject.model_checker = JSON.parse(subject.model_checker);
            subject.drawing_checker = JSON.parse(subject.drawing_checker);
            subject.design_unit = JSON.parse(subject.design_unit);
            subject.drawing_ch_unit = JSON.parse(subject.drawing_ch_unit);
            subject.modal_ch_unit = JSON.parse(subject.modal_ch_unit);
            this.setState({ selectedWK: wk });
            this.setState({ approvalType: this.getApprovalType() });
        });
        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    componentWillReceiveProps(nextProps) {
        let { CAD, PDF, BIM, attachmentFile } = nextProps.drawing;
        this.setState({ CAD, PDF, BIM, attachmentFile });
    }

    genDownload = text => {
        return (
            <div>
                {text.CAD ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.CAD.download_url}>CAD:{text.CAD.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.PDF ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.PDF.download_url}>PDF:{text.PDF.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.BIM ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.BIM.download_url}>BIM:{text.BIM.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.attachmentFile ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.attachmentFile.download_url}>附件:{text.attachmentFile.name}</a>
                    </p>
                ) : (
                    ''
                )}
            </div>
        );
    };

    previewFile(file) {
        const { openPreview } = this.props.actions;
        openPreview(file);
    }

    options = [{ label: '通过', value: true }, { label: '不通过', value: false }];

    //计算当前审查类型
    getApprovalType = () => {
        const { selectedWK } = this.state;
        if (!selectedWK) return;

        let wk = selectedWK;
        let usr = getUser();
        let isTheSame = true;
        wk.current.forEach(cu => {
            let isOk = cu.participants[0].executor.id === usr.id;
            if (!isOk) isTheSame = false;
        });

        if (isTheSame && wk.current.length === 2) {
            return 3;
        }

        let participant = wk.current.find(cu => {
            return cu.participants[0].executor.id === usr.id;
        });
        let statuNode = participant.code;
        let type = statuNode === 'STATE02' ? 1 : 2; //1-图纸 2-模型 3-都是同一个人
        return type;
    };

    //图纸模型都是同一个人的时候
    approvalDrawingModel = (wk, executor, drawingIsPass, drawingAdvice, modelIsPass, modelAdvice) => {
        const { putFlow } = this.props.actions;
        const { id, workflow: { states = [] } = {} } = wk;
        const [{ id: state_id }, { id: approvalId02 }, { id: approvalId03 }] = states;
        console.log('approvalDrawingModel: ', wk, executor, state_id, approvalId02, approvalId03);
        if (!drawingIsPass) {
            return putFlow(
                { pk: id },
                {
                    state: approvalId02,
                    executor: executor,
                    action: drawingIsPass ? '通过' : '退回',
                    note: drawingAdvice,
                    attachment: null
                }
            )
        }
        if (!modelIsPass) {
            return putFlow(
                { pk: id },
                {
                    state: approvalId03,
                    executor: executor,
                    action: modelIsPass ? '通过' : '退回',
                    note: modelAdvice,
                    attachment: null
                }
            )
        }
        return Promise.all([
            putFlow(
                { pk: id },
                {
                    state: approvalId02,
                    executor: executor,
                    action: drawingIsPass ? '通过' : '退回',
                    note: drawingAdvice,
                    attachment: null
                }
            ),
            putFlow(
                { pk: id },
                {
                    state: approvalId03,
                    executor: executor,
                    action: modelIsPass ? '通过' : '退回',
                    note: modelAdvice,
                    attachment: null
                }
            )
        ]).then(res => {
            let item = res.find(v => v.status === 3);
            return item ? item : res[0];
        });
    };

    //提交流程审查节点
    approvalOne = (wk, executor, isPass, advice) => {
        let usr = getUser();
        const { putFlow } = this.props.actions;
        let participant = wk.current.find(cu => {
            return cu.participants[0].executor.id === usr.id;
        });
        let statuNode = participant.code;
        const { id, workflow: { states = [] } = {} } = wk;
        const [{ id: state_id }, { id: approvalId02 }, { id: approvalId03 }] = states;
        console.log('approvalOne: ', wk, executor, isPass, advice);
        return putFlow(
            { pk: id },
            {
                state: statuNode === 'STATE02' ? approvalId02 : approvalId03,
                executor: executor,
                action: isPass ? '通过' : '退回',
                note: advice
                // "attachment": null
            }
        );
    };

    //计算审查时间
    calculateApprovalTime = wk => {
        let usr = getUser();
        let isTheSame = true;
        let date = moment().format('YYYY-MM-DD');
        let drawingApprovalTime = null,
            modelApprovalTime = null;
        wk.current.forEach(cu => {
            isTheSame = cu.participants[0].executor.id === usr.id;
        });
        if (!isTheSame) {
            let participant = wk.current.find(cu => {
                return cu.participants[0].executor.id === usr.id;
            });
            let statuNode = participant.code;
            if (statuNode === 'STATE02') {
                drawingApprovalTime = date;
            } else {
                modelApprovalTime = date;
            }
        } else {
            drawingApprovalTime = date;
            modelApprovalTime = date;
        }

        let res = {};
        if (drawingApprovalTime) res.drawingActualApprovalTime = drawingApprovalTime;
        if (modelApprovalTime) res.modelActualApprovalTime = modelApprovalTime;
        return res;
    };

    //更新施工包里的单位工程图纸提交数量统计值
    updateDrawingNum = unit => {
        const { getWorkpackagesStatistics, putWorkpackagesStatistics } = this.props.actions;
        //获取施工包
        getWorkpackagesStatistics({ code: unit.code }).then(wpSt => {
            // console.log(wpSt);
            //更新施工包
            let { drawingNum = 0 } = wpSt.extra_params;
            putWorkpackagesStatistics(
                { code: unit.code },
                {
                    version: wpSt.version,
                    extra_params: { drawingNum: ++drawingNum }
                }
            ).then(rest => {
                // console.log(rest);
            });
        });
    };

    approvalWorkFlow = () => {
        let me = this;
        const { putFlow } = this.props.actions;
        const { unit } = this.props;
        let { advice, isPass, selectedWK, modelIsPass, drawingIsPass, drawingAdvice, modelAdvice } = this.state;
        const drawingDoc = this.props.drawing;
        let drawing = drawingDoc.extra_params;

        let usr = getUser();
        //获取节点id
        let wk = selectedWK;
        let subject = wk.subject[0];

        //如果图纸和模型都是同一人
        let isTheSame = true;
        wk.current.forEach(cu => {
            let isOk = cu.participants[0].executor.id === usr.id;
            if (!isOk) isTheSame = false;
        });
        
        if (wk.current.length === 1) {
            isTheSame = false
        }

        if (!isPass && !isTheSame) {
            if (!advice) {
                message.error('请填写不通过的意见');
                return;
            }
        }

        if (!modelIsPass && isTheSame) {
            if (!modelAdvice) {
                message.error('请填写不通过的意见');
                return;
            }
        }

        if (!drawingIsPass && isTheSame) {
            if (!drawingAdvice) {
                message.error('请填写不通过的意见');
                return;
            }
        }

        // let usr = getUser();
        const executor = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };

        me.setState({ busying: true });

        (() => {
            // //如果图纸和模型都是同一人
            // let isTheSame = true;
            // wk.current.forEach(cu => {
            //     let isOk = cu.participants[0].executor.id === usr.id;
            //     if (!isOk) isTheSame = false;
            // });
            if (isTheSame) {
                isPass = drawingIsPass && modelIsPass ? true : false;
                return this.approvalDrawingModel(
                    selectedWK,
                    executor,
                    drawingIsPass,
                    drawingAdvice,
                    modelIsPass,
                    modelAdvice
                );
            } else {
                return this.approvalOne(selectedWK, executor, isPass, advice);
            }
        })()
            .then(wkRes => {
                /*let participant =  wk.current.find(cu=>{
                return cu.participants[0].executor.id == usr.id
            });
            let statuNode = participant.code;
            const {id, workflow: {states = []} = {}} = wk;
            const [{id: state_id},{id:approvalId02},{id:approvalId03}] = states;
            putFlow({pk: id}, {
                "state": statuNode === 'STATE02'?approvalId02:approvalId03,
                "executor": executor,
                "action": isPass?"通过":"退回",
                "note": advice,
                "attachment": null
            }).then((wkRes)=>{*/
                if (isPass) {
                    //是否需要调用归档接口
                    if (wkRes.status === 3) {
                        this.updateDrawingNum(this.props.unit);
                        const { archiveDesign } = this.props.actions;
                        return archiveDesign(
                            { pk: drawing.processId },
                            { code: unit.code + '_' + DeisgnDirCode }
                        ).then(() => {
                            drawing.status = 2;
                            drawing.archivingTime = moment().format('YYYY-MM-DD');
                            message.success('提交审查通过成功,并已归档');
                            return Promise.resolve(true);
                        });
                    }
                    message.success('提交审查通过成功');
                    return Promise.resolve(true);
                } else {
                    drawing.status = 3;
                    message.success('设计成功退回成功');
                    return Promise.resolve(true);
                }
            })
            .then(isUpdateDoc => {
                me.setState({ busying: false });
                //更新上报成果
                if (isUpdateDoc) {
                    const { updatePlan } = this.props.actions;
                    const { designStageEnum = {} } = this.props.plan;
                    let approvalDate = this.calculateApprovalTime(selectedWK);
                    //files 存入basic_params 为资料管理展示
                    let files = [];
                    drawing.CAD && files.push(drawing.CAD);
                    drawing.PDF && files.push(drawing.PDF);
                    drawing.BIM && files.push(drawing.BIM);
                    drawing.attachmentFile && files.push(drawing.attachmentFile);
                    updatePlan(
                        { code: drawingDoc.code },
                        {
                            extra_params: {
                                status: drawing.status,
                                actualApprovalTime: drawing.actualApprovalTime,
                                //图纸审查时间 //模型审查时间
                                ...approvalDate,
                                archivingTime: drawing.archivingTime || '',
                                submitTime: moment.utc().format(),
                                designUnit: subject.design_unit,
                                stage: subject.stage,
                                stageName: designStageEnum[subject.stage]
                            },
                            basic_params: {
                                files: files
                            }
                        }
                    );
                }
                const { onClose, updateTableData } = this.props;
                onClose();
                //更新列表状态
                drawing.action = 0; //更新权限按钮 不生效原因排查
                updateTableData(drawing);
            });
    };

    render() {
        const { drawing, project, unit, readonly } = this.props;
        const {
            selectedWK,
            busying,
            approvalType,
            drawingAdvice,
            modelAdvice,
            drawingIsPass,
            modelIsPass
        } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        const { designStageEnum } = this.props.plan;
        const { professionPrincipal, projectPrincipal } = drawing.extra_params;
        return (
            <div>
                {!readonly ? (
                    <Row>
                        <Button style={{ float: 'right' }} loading={busying} onClick={this.approvalWorkFlow}>
                            提交
                        </Button>
                    </Row>
                ) : (
                    ''
                )}
                <Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={8}>
                            <label htmlFor="">项目名称:</label>
                            <span>{project ? project.label : ''}</span>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">单位工程:</label>
                            <span>{unit ? unit.label : ''}</span>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">设计阶段:</label>
                            <span>{subject ? designStageEnum[subject.stage] : ''}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={8}>
                            <label htmlFor="">设计单位:</label>
                            <span>{subject ? subject.design_unit.name : ''}</span>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">图纸审查单位:</label>
                            <span>{subject ? subject.drawing_ch_unit.name : ''}</span>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">模型审查单位:</label>
                            <span>{subject ? subject.modal_ch_unit.name : ''}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={8}>
                            <label htmlFor="">
                                图纸卷册编号: <span>{drawing.extra_params.juance}</span>
                            </label>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">
                                图纸卷册名称: <span>{drawing.extra_params.name}</span>
                            </label>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">
                                专业: <span>{drawing.extra_params.profession}</span>
                            </label>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={8}>
                            <label htmlFor="">
                                项目负责人:
                                <span>
                                    {projectPrincipal.person_name ? projectPrincipal.person_name : projectPrincipal}
                                </span>
                            </label>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">
                                专业负责人:
                                <span>
                                    {professionPrincipal.person_name
                                        ? professionPrincipal.person_name
                                        : professionPrincipal}
                                </span>
                            </label>
                        </Col>
                        <Col span={8}>
                            <label htmlFor="">
                                成果交付时间: <span>{drawing.extra_params.deliverTime}</span>
                            </label>
                        </Col>
                    </Row>
                </Row>
                <Row style={{ margin: '10px 0 0' }}>
                    <label htmlFor="">成果下载:</label>
                    <Popover content={this.genDownload(drawing.extra_params)} placement="right">
                        <a href="javascript:;">下载</a>
                    </Popover>
                </Row>
                {approvalType === 3 ? (
                    <div>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">图纸是否通过:</label>
                            <RadioGroup
                                options={this.options}
                                onChange={e => {
                                    this.setState({
                                        drawingIsPass: e.target.value
                                    });
                                }}
                                value={this.state.drawingIsPass}
                            />
                        </Row>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">图纸审查意见:</label>
                            <Input
                                type="textarea"
                                value={this.state.drawingAdvice}
                                onChange={e => {
                                    this.setState({ drawingAdvice: e.target.value });
                                }}
                            />
                        </Row>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">模型是否通过:</label>
                            <RadioGroup
                                options={this.options}
                                onChange={e => {
                                    this.setState({
                                        modelIsPass: e.target.value
                                    });
                                }}
                                value={this.state.modelIsPass}
                            />
                        </Row>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">模型审查意见:</label>
                            <Input
                                type="textarea"
                                value={this.state.modelAdvice}
                                onChange={e => {
                                    this.setState({ modelAdvice: e.target.value });
                                }}
                            />
                        </Row>
                    </div>
                ) : (
                    <div>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">{approvalType === 1 ? '图纸' : '模型'}是否通过:</label>
                            <RadioGroup
                                options={this.options}
                                onChange={e => {
                                    this.setState({
                                        isPass: e.target.value
                                    });
                                }}
                                value={this.state.isPass}
                            />
                        </Row>
                        <Row style={{ margin: '10px 0 0' }}>
                            <label htmlFor="">审查意见:</label>
                            <Input
                                type="textarea"
                                value={this.state.advice}
                                onChange={e => {
                                    this.setState({ advice: e.target.value });
                                }}
                            />
                        </Row>
                    </div>
                )}
            </div>
        );
    }
}

export default ApprovalResBox;
