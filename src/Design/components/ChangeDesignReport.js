/**
 * Created by tinybear on 17/9/19.
 */

import React, { Component } from 'react';
import { DOWNLOAD_FILE, WORKFLOW_CODE } from '_platform/api';
import { Row, Col, Popover, Input, Button, Select, message } from 'antd';
import Dragger from '_platform/components/panels/Dragger';
// import { getUser } from '_platform/auth';
import { getCurUser } from './util';
const { Option } = Select;

class ChangeDesignReport extends Component {
    state = {
        CAD: null,
        PDF: null,
        BIM: null,
        attachmentFile: null,
        newCAD: null,
        newPDF: null,
        newBIM: null,
        newattachmentFile: null,
        selectedWK: null,
        changeType: '1', //1-一般变更 2-重大变更
        isChanging: false,
        advice: ''
    };

    componentWillMount() {
        let {
            CAD,
            PDF,
            BIM,
            attachmentFile,
            processId,
            changeType,
            changeProcessId,
            changeStatus,
        } = this.props.drawing.extra_params;
        let { newCAD = null, newBIM = null, newPDF = null, newattachmentFile = null, advice = '' } =
            this.props.drawing.extra_params.changeContent || {};

        this.setState({
            CAD,
            PDF,
            BIM,
            attachmentFile,
            newCAD,
            newBIM,
            newPDF,
            newattachmentFile,
            changeType,
            advice: advice,
            isChanging: changeProcessId && (changeStatus === 1 || changeStatus === 2) ? true : false
        });
        //获取流程
        const { getWorkflow } = this.props.actions;
        getWorkflow({ id: processId }).then(wk => {
            let subject = wk.subject[0];
            subject.model_checker = JSON.parse(subject.model_checker);
            subject.drawing_checker = JSON.parse(subject.drawing_checker);
            subject.design_unit = JSON.parse(subject.design_unit);
            this.setState({ selectedWK: wk });
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

    //保存变更内容
    saveChangeContent = () => {
        const { drawing } = this.props;
        const { updatePlan } = this.props.actions;
        const { newCAD, newBIM, newPDF, newattachmentFile, advice } = this.state;
        let extra = {};
        extra.changeContent = { newCAD, newBIM, newPDF, newattachmentFile, advice };
        //保存到当前列表
        drawing.extra_params.changeContent = extra.changeContent;
        updatePlan({ code: drawing.code }, { extra_params: extra }).then(data => {
            console.log(data);
            message.info('保存变更内容成功');
        });
    };

    //检查是否已发起变更流程
    findChangeWK = () => {
        const { drawing } = this.props;
        const { getPlan } = this.props.actions;
        return new Promise((resolve, reject) => {
            getPlan({ code: drawing.code }).then(dr => {
                let id = dr.extra_params.changeProcessId;
                let status = dr.extra_params.changeStatus;
                if (id && status === 1) {
                    resolve(dr);
                } else {
                    reject();
                }
            });
        });
    };

    //发起变更流程
    createChangeWK = () => {
        const { drawing, project, unit } = this.props;
        const { changeType, selectedWK } = this.state;

        let currentUser = getCurUser();
        let sb = selectedWK.subject[0];
        sb.plan_writer = JSON.parse(sb.plan_writer);

        const { actions: { createFlow, addActor } } = this.props;

        let WORKFLOW_MAP = {
            name: project.label + unit.label + '设计成果变更流程',
            desc: project.label + unit.label + '设计成果变更流程',
            code: changeType === '1' ? WORKFLOW_CODE.设计成果一般变更流程 : WORKFLOW_CODE.设计成果重大变更流程
        };
        let subject = [
            {
                project: JSON.stringify(project),
                unit: JSON.stringify(unit),
                drawingId: drawing.code,
                note: '',
                attachments: '[]'
            }
        ];

        return createFlow(
            {},
            {
                name: WORKFLOW_MAP.name,
                description: WORKFLOW_MAP.desc,
                subject,
                code: WORKFLOW_MAP.code,
                creator: currentUser,
                plan_start_time: null,
                deadline: null,
                status: 2
            }
        ).then(instance => {
            const { id, workflow: { states = [] } = {} } = instance;
            const [{ id: state_id }] = states;
            return new Promise(resolve => {
                addActor(
                    { ppk: id, pk: state_id },
                    {
                        participants: [sb.plan_writer],
                        deadline: null,
                        remark: null
                    }
                ).then(() => {
                    resolve(instance);
                });
            });
        });
    };

    //提交变更流程
    submitChangeWK = () => {
        let me = this;
        const { actions: { putFlow, getWorkflow } } = this.props;
        let currentUser = getCurUser();
        const { selectedWK, advice } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        if (!this.state.changeType) {
            message.error('请选择变更类型');
            return;
        }
        this.findChangeWK().then(dr => {
                me.setState({ changeType: dr.extra_params.changeType });
                return getWorkflow({ id: dr.extra_params.changeProcessId });
            }, 
            this.createChangeWK).then(instance => {
                const { id, workflow: { states = [] } = {} } = instance;
                const [{ id: state_id }, { id: next_id }] = states;
                //获取审查人
                putFlow(
                    { pk: id },
                    {
                        next_states: [
                            {
                                state: next_id,
                                participants: [subject.drawing_checker, subject.model_checker],
                                deadline: null,
                                remark: null
                            }
                        ],
                        state: state_id,
                        executor: currentUser,
                        action: '提交',
                        note: advice,
                        attachment: null
                    }
                ).then(() => {
                    //更新设计成果文档
                    const { drawing } = me.props;
                    const { updatePlan } = me.props.actions;
                    const { newCAD, newBIM, newPDF, newattachmentFile } = this.state;
                    let extra = {};
                    extra.changeProcessId = id;
                    extra.changeStatus = 2;
                    extra.changeType = me.state.changeType;
                    extra.changeContent = { newCAD, newBIM, newPDF, newattachmentFile, advice };
                    updatePlan({ code: drawing.code }, { extra_params: extra }).then(data => {
                        console.log(data);
                        message.info('提交设计变更流程成功');
                        const { onSubmit } = me.props;
                        onSubmit();
                    });
                });
            });
    };

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

    render() {
        const { drawing, project, unit, readonly } = this.props;
        const { selectedWK, changeType } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        const { designStageEnum = {} } = this.props.plan;
        const { professionPrincipal, projectPrincipal } = drawing.extra_params;
        return (
            <div>
                {!readonly ? (
                    <Row>
                        <Button style={{ float: 'right' }} onClick={this.submitChangeWK}>
                            提交
                        </Button>
                        <Button style={{ float: 'right' }} onClick={this.saveChangeContent}>
                            暂存
                        </Button>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">项目名称:</label>
                        <span>{project ? project.label : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">单位工程:</label>
                        <span>{unit ? unit.label : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">设计单位:</label>
                        <span>{subject ? subject.design_unit.name : ''}</span>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">图纸审查:</label>
                        <span>{subject ? subject.drawing_checker.person_name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查:</label>
                        <span>{subject ? subject.model_checker.person_name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">设计阶段:</label>
                        <span>{subject ? designStageEnum[subject.stage] : ''}</span>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">
                            图纸卷册编号: <span>{drawing.extra_params.juance}</span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            图纸卷册编名称: <span>{drawing.extra_params.name}</span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            专业: <span>{drawing.extra_params.profession}</span>
                        </label>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
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
                        <label htmlFor="">变更类型: </label>
                        {!readonly ? (
                            <Select
                                style={{ width: '100px' }}
                                onChange={value => {
                                    this.setState({ changeType: value });
                                }}
                                value={this.state.changeType}
                                size="small"
                                disabled={this.state.isChanging}
                            >
                                <Option value="1">一般变更</Option>
                                <Option value="2">重大变更</Option>
                            </Select>
                        ) : (
                            <span>{changeType === '1' ? '一般变更' : '重大变更'}</span>
                        )}
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <label htmlFor="">设计文件:</label>
                    <Popover content={this.genDownload(drawing.extra_params)} placement="right">
                        <a >下载</a>
                    </Popover>
                </Row>
                {!readonly ? (
                    <Row gutter={16}>
                        <Col span={12}>
                            CAD图:
                            {this.state.newCAD ? (
                                <p>
                                    {this.state.newCAD.name}
                                    <a
                                        // href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ newCAD: '' });
                                        }}
                                    >
                                        删除
                                    </a>
                                </p>
                            ) : (
                                ''
                            )}
                            <Dragger
                                style={{ height: '50px' }}
                                isShowProgress={true}
                                accept={null}
                                onChange={val => {
                                    this.setState({ newCAD: val });
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                        <Col span={12}>
                            PDF:
                            {this.state.newPDF ? (
                                <p>
                                    {this.state.newPDF.name}
                                    <a
                                        // href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ newPDF: '' });
                                        }}
                                    >
                                        删除
                                    </a>
                                </p>
                            ) : (
                                ''
                            )}
                            <Dragger
                                style={{ height: '50px' }}
                                isShowProgress={true}
                                accept={null}
                                onChange={val => {
                                    this.setState({ newPDF: val });
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row gutter={16}>
                        <Col span={12}>
                            BIM模型:
                            {this.state.newBIM ? (
                                <p>
                                    {this.state.newBIM.name}
                                    <a
                                        // href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ newBIM: '' });
                                        }}
                                    >
                                        删除
                                    </a>
                                </p>
                            ) : (
                                ''
                            )}
                            <Dragger
                                style={{ height: '50px' }}
                                isShowProgress={true}
                                accept={null}
                                onChange={val => {
                                    this.setState({ newBIM: val });
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                        <Col span={12}>
                            附件:
                            {this.state.newattachmentFile ? (
                                <p>
                                    {this.state.newattachmentFile.name}
                                    <a
                                        // href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ newattachmentFile: '' });
                                        }}
                                    >
                                        删除
                                    </a>
                                </p>
                            ) : (
                                ''
                            )}
                            <Dragger
                                style={{ height: '50px' }}
                                isShowProgress={true}
                                accept={null}
                                onChange={val => {
                                    this.setState({ newattachmentFile: val });
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ margin: '10px 0' }}>
                    <label htmlFor="">备注:</label>
                    <Input
                        type="textarea"
                        disabled={readonly}
                        value={this.state.advice}
                        onChange={e => {
                            this.setState({ advice: e.target.value });
                        }}
                    />
                </Row>
            </div>
        );
    }
}

export default ChangeDesignReport;
