/**
 * Created by tinybear on 17/9/20.
 * 设计变更审查弹窗
 */
import React, { Component } from 'react';
import { DOWNLOAD_FILE } from '_platform/api';
import { Row, Col, Popover, Input, Button, message, Radio, Collapse } from 'antd';
import { getUser } from '_platform/auth';
import WorkFlowHistory from './WorkFlowHistory';
import moment from 'moment';
import { getCurUser } from './util';
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;

class ChangeDesignApprovalBox extends Component {
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
        changeWK: null,
        changeType: '1', //1-一般变更 2-重大变更
        isPass: true,
        drawisPass:true,
        modelisPass:true,
        advice: '',
        drawAdvice:'',
        modelAdvice:'',
        changeHistory: [],
        drawModel:false //图纸模型都是同一个人;
    };

    options = [{ label: '通过', value: true }, { label: '不通过', value: false }];

    componentWillMount() {
        let {
            CAD,
            PDF,
            BIM,
            attachmentFile,
            processId,
            changeType,
            changeProcessId,
            // changeStatus,
            changeHistory = []
        } = this.props.drawing.extra_params;
        let { newCAD = null, newBIM = null, newPDF = null, newattachmentFile = null } =
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
            changeHistory
        });
        //获取流程
        const { getWorkflow } = this.props.actions;
        getWorkflow({ id: processId }).then(wk => {
            let subject = wk.subject[0];
            subject.model_checker = JSON.parse(subject.model_checker);
            subject.drawing_checker = JSON.parse(subject.drawing_checker);
            subject.design_unit = JSON.parse(subject.design_unit);
            this.setState({ selectedWK: wk });
            this.getChecker(subject);
        });

        console.log('componentWillMount: ', this.props.drawing.extra_params);
        if (changeProcessId) {
            getWorkflow({ id: changeProcessId }).then(wk => {
                this.setState({ changeWK: wk });
            });
        }

        this.getDesignStage();
    }
    getChecker = (subject) =>{
        if(subject.drawing_checker.id===subject.model_checker.id){
            this.setState({drawModel:true});
        }
    }
    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    getCurUser() {
        let currentUser = getUser();
        currentUser = {
            id: parseInt(currentUser.id),
            username: currentUser.username,
            person_name: currentUser.person_name,
            person_code: currentUser.person_code,
            organization: currentUser.organization
        };
        return currentUser;
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

    genNewDownload = text => {
        return (
            <div>
                {text.newCAD ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.newCAD.download_url}>CAD:{text.newCAD.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.newPDF ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.newPDF.download_url}>PDF:{text.newPDF.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.newBIM ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.newBIM.download_url}>BIM:{text.newBIM.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.newattachmentFile ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.newattachmentFile.download_url}>
                            附件:{text.newattachmentFile.name}
                        </a>
                    </p>
                ) : (
                    ''
                )}
            </div>
        );
    };

    getNextVersion(version) {
        let charCode = version.charCodeAt();
        let nextCharCode = charCode + 1;
        return String.fromCharCode(nextCharCode);
    }
    updatePlanData(extra,drawingDoc){
        //变更内容更新到上报成果
        const { updatePlan } = this.props.actions;
        let files = [];
        extra.CAD && files.push(extra.CAD);
        extra.PDF && files.push(extra.PDF);
        extra.BIM && files.push(extra.BIM);
        extra.attachmentFile && files.push(extra.attachmentFile);
        updatePlan(
            { code: drawingDoc.code },
            {
                extra_params: extra,
                basic_params: {
                    files: files
                }
            }
        ).then(() => {
            const { onSubmit } = this.props;
            onSubmit();
        });
    }
    //提交审查流程
    approvalWorkFlow = () => {
        let me = this;
        const { putFlow, getWorkflow } = this.props.actions;
        const { advice, isPass } = this.state;
        const drawingDoc = this.props.drawing;
        let drawing = drawingDoc.extra_params;
        let changeId = drawing.changeProcessId;
        const executor = getCurUser();

        if (!isPass) {
            if (!advice) {
                message.error('请填写不通过的意见');
                return;
            }
        }

        getWorkflow({ id: changeId }).then(wk => {
            //获取节点id
            const { id, workflow: { states = [] } = {} } = wk;
            const [{ id: state_id }, { id: approvalId }] = states;
            if(this.state.drawModel){
                const {drawisPass,drawAdvice,modelisPass,modelAdvice} = this.state;
                if (!drawisPass) {
                    if (!drawAdvice) {
                        message.error('请填写图纸不通过的意见');
                        return;
                    }
                }
                if (!modelisPass) {
                    if (!modelAdvice) {
                        message.error('请填写模型不通过的意见');
                        return;
                    }
                }
                if(drawisPass && modelisPass){  //图纸审查模型审查都通过;
                    putFlow(
                        { pk: id },
                        {
                            state: approvalId,
                            executor: executor,
                            action: drawisPass ? '通过' : '退回',
                            note: drawAdvice
                            // "attachment": null
                        }
                    ).then(
                        res => {
                            putFlow(
                                { pk: id },
                                {
                                    state: approvalId,
                                    executor: executor,
                                    action: modelisPass ? '通过' : '退回',
                                    note: modelAdvice
                                    // "attachment": null
                                }
                            ).then(
                                wkRes =>{
                                        //变更图纸,保留历史数据
                                        let changeContent = drawing.changeContent;
                                        drawing.changeHistory = drawing.changeHistory || [];
                                        drawing.changeHistory.push({
                                            changeProcessId: drawing.changeProcessId,
                                            changeStatus: '3',
                                            changeType: drawing.changeType
                                        });
                                        drawing.drawingHistory = drawing.drawingHistory || [];
                                        drawing.drawingHistory.push({
                                            version: drawing.version,
                                            CAD: drawing.CAD,
                                            PDF: drawing.PDF,
                                            BIM: drawing.BIM,
                                            attachmentFile: drawing.attachmentFile
                                        });
                                        let extra = {
                                            CAD: changeContent.newCAD,
                                            PDF: changeContent.newPDF,
                                            BIM: changeContent.newBIM,
                                            attachmentFile: changeContent.newattachmentFile,
                                            changeProcessId: '',
                                            changeStatus: '',
                                            changeContent: {
                                                newCAD: '',
                                                newBIM: '',
                                                newPDF: '',
                                                newattachmentFile: ''
                                            },
                                            changeType: '',
                                            changeHistory: drawing.changeHistory,
                                            drawingHistory: drawing.drawingHistory,
                                            submitTime: moment.utc().format()
                                        };
                                        //重大变更修改版本
                                        if (drawing.changeType == '2') {
                                            extra.version = me.getNextVersion(drawing.version);
                                        }
                                        message.info('提交审查流程成功');
                                        return Promise.resolve(extra);
                                }
                            ).then(
                                extra =>{
                                    me.updatePlanData(extra,drawingDoc)
                                },
                                () => {
                                    const { onSubmit } = me.props;
                                    onSubmit();
                                }
                            )
                        }
                        
                    )
                }else{
                    if(drawisPass){
                        putFlow(
                            { pk: id },
                            {
                                state: approvalId,
                                executor: executor,
                                action: drawisPass ? '通过' : '退回',
                                note: drawAdvice
                            }
                        ).then(
                            rest =>{
                                putFlow(
                                    { pk: id },
                                    {
                                        state: approvalId,
                                        executor: executor,
                                        action: modelisPass ? '通过' : '退回',
                                        note: modelAdvice
                                    }
                                ).then(
                                    resu =>{
                                        drawing.status = 3;
                                        message.success('交付计划审批退回成功');
                                        let extra = {
                                            changeStatus: 4
                                        };
                                        return Promise.resolve(extra);
                                    }
                                ).then(
                                    extra =>{
                                        me.updatePlanData(extra,drawingDoc)
                                    },
                                    () => {
                                        const { onSubmit } = me.props;
                                        onSubmit();
                                    }
                                )
                            }
                        )
                    }else{
                        putFlow(
                            { pk: id },
                            {
                                state: approvalId,
                                executor: executor,
                                action: drawisPass ? '通过' : '退回',
                                note: drawAdvice
                            }
                        ).then(
                            result =>{
                                drawing.status = 3;
                                message.success('交付计划审批退回成功');
                                let extra = {
                                    changeStatus: 4
                                };
                                return Promise.resolve(extra);
                            }
                        ).then(
                            extra =>{
                                me.updatePlanData(extra,drawingDoc)
                            },
                            () => {
                                const { onSubmit } = me.props;
                                onSubmit();
                            }
                        )
                    }
                       
                }                
                
            }else{
                putFlow(
                    { pk: id },
                    {
                        state: approvalId,
                        executor: executor,
                        action: isPass ? '通过' : '退回',
                        note: advice
                        // "attachment": null
                    }
                ).then(wkRes => {
                        if (isPass) {
                            //是否需要调用归档接口
                            if (wkRes.status == 3) {
                                //变更图纸,保留历史数据
                                let changeContent = drawing.changeContent;
                                drawing.changeHistory = drawing.changeHistory || [];
                                drawing.changeHistory.push({
                                    changeProcessId: drawing.changeProcessId,
                                    changeStatus: '3',
                                    changeType: drawing.changeType
                                });
                                drawing.drawingHistory = drawing.drawingHistory || [];
                                drawing.drawingHistory.push({
                                    version: drawing.version,
                                    CAD: drawing.CAD,
                                    PDF: drawing.PDF,
                                    BIM: drawing.BIM,
                                    attachmentFile: drawing.attachmentFile
                                });
                                let extra = {
                                    CAD: changeContent.newCAD,
                                    PDF: changeContent.newPDF,
                                    BIM: changeContent.newBIM,
                                    attachmentFile: changeContent.newattachmentFile,
                                    changeProcessId: '',
                                    changeStatus: '',
                                    changeContent: {
                                        newCAD: '',
                                        newBIM: '',
                                        newPDF: '',
                                        newattachmentFile: ''
                                    },
                                    changeType: '',
                                    changeHistory: drawing.changeHistory,
                                    drawingHistory: drawing.drawingHistory,
                                    submitTime: moment.utc().format()
                                };
                                //重大变更修改版本
                                if (drawing.changeType == '2') {
                                    extra.version = me.getNextVersion(drawing.version);
                                }
                                message.info('提交审查流程成功');
                                return Promise.resolve(extra);
                            } else {
                                message.info('提交审查流程成功');
                                return Promise.reject();
                            }
                        } else {
                            drawing.status = 3;
                            message.success('交付计划审批退回成功');
                            //退回变更,保存历史数据
                            // drawing.changeHistory = drawing.changeHistory||[];
                            // drawing.changeHistory.push({
                            //     changeProcessId:drawing.changeProcessId,
                            //     changeStatus:'4'//变更退回
                            // });
                            let extra = {
                                // changeProcessId:'',
                                changeStatus: 4
                                // changeContent:{},
                                // changeHistory:drawing.changeHistory
                            };
                            return Promise.resolve(extra);
                        }
                    })
                    .then(
                        extra =>{
                            me.updatePlanData(extra,drawingDoc)
                        },
                        () => {
                            const { onSubmit } = me.props;
                            onSubmit();
                        }
                    );
            }
            
        });
    };

    render() {
        const { drawing, project, unit, readonly } = this.props;
        const { selectedWK, changeWK, changeHistory, changeType } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        const { designStageEnum = {} } = this.props.plan;
        const { professionPrincipal, projectPrincipal } = drawing.extra_params;
        console.log('this.props.drawing',this.props.drawing)
        return (
            <div>
                {!readonly ? (
                    <Row>
                        <Button style={{ float: 'right' }} onClick={this.approvalWorkFlow}>
                            提交
                        </Button>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ marginBottom: '0px' }}>
                    <Row>
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
                    <Row>
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
                    <Row>
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
                    <Row>
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
                            <span>{changeType === '1' ? '一般变更' : changeType === '2' ? '重大变更' : ''}</span>
                        </Col>
                    </Row>
                </Row>
                <Row style={{ margin: '0 0 0px 0' }}>
                    <label htmlFor="">{!readonly ? '变更前设计文件' : '设计文件'}:</label>
                    <Popover content={this.genDownload(drawing.extra_params)} placement="right">
                        <a href="javascript:;">下载</a>
                    </Popover>
                </Row>
                {!readonly ? (
                    <Row>
                        <label htmlFor="">变更后设计文件:</label>
                        <Popover content={this.genNewDownload(drawing.extra_params.changeContent)} placement="right">
                            <a href="javascript:;">下载</a>
                        </Popover>
                    </Row>
                ) : (
                    ''
                )}
                <Row>
                    {drawing.extra_params.drawingHistory ? (
                        <div>
                            <label htmlFor="">历史版本设计文件:</label>
                            {drawing.extra_params.drawingHistory.map(dh => {
                                return (
                                    <Popover content={this.genDownload(dh)} placement="right">
                                        <a href="javascript:;" style={{ marginRight: 10 }}>
                                            {dh.version}
                                        </a>
                                    </Popover>
                                );
                            })}
                        </div>
                    ) : (
                        ''
                    )}
                </Row>
                {this.state.drawModel ?<div>
                    {!readonly ? (
                    <Row style={{ margin: '10px 0 0' }}>
                        <label htmlFor="">是否通过:</label>
                        <RadioGroup
                            options={this.options}
                            onChange={e => {
                                this.setState({
                                    drawisPass: e.target.value
                                });
                            }}
                            value={this.state.drawisPass}
                        />
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row>
                        <label htmlFor="">图纸审查意见:</label>
                        <Input
                            type="textarea"
                            value={this.state.drawAdvice}
                            onChange={e => {
                                this.setState({ drawAdvice: e.target.value });
                            }}
                        />
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row style={{ margin: '10px 0 0' }}>
                        <label htmlFor="">是否通过:</label>
                        <RadioGroup
                            options={this.options}
                            onChange={e => {
                                this.setState({
                                    modelisPass: e.target.value
                                });
                            }}
                            value={this.state.modelisPass}
                        />
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row>
                        <label htmlFor="">模型审查意见:</label>
                        <Input
                            type="textarea"
                            value={this.state.modelAdvice}
                            onChange={e => {
                                this.setState({ modelAdvice: e.target.value });
                            }}
                        />
                    </Row>
                ) : (
                    ''
                )}
                </div>
                :<div>
                    {!readonly ? (
                    <Row style={{ margin: '10px 0 0' }}>
                        <label htmlFor="">是否通过:</label>
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
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row>
                        <label htmlFor="">审查意见:</label>
                        <Input
                            type="textarea"
                            value={this.state.advice}
                            onChange={e => {
                                this.setState({ advice: e.target.value });
                            }}
                        />
                    </Row>
                ) : (
                    ''
                )}
                </div>}
                
                {readonly ? (
                    <Row>
                        <label>历史变更:</label>
                        <Collapse
                            bordered={false}
                            onChange={([changeProcessId = null]) => {
                                //获取流程
                                let id = changeProcessId;
                                if (!id) return;
                                const { actions: { getWorkflow } } = this.props;
                                let fwk = this.state.changeHistory.find(v => v.changeProcessId == id);
                                if (fwk.wk) return;
                                getWorkflow({ id: id }).then(wk => {
                                    fwk.wk = wk;
                                    this.setState({ changeHistory: this.state.changeHistory.slice() });
                                });
                            }}
                        >
                            {changeHistory.map((ch, i) => {
                                return (
                                    <Panel header={`历史变更流程${i + 1}`} key={ch.changeProcessId}>
                                        {ch.wk ? <WorkFlowHistory wk={ch.wk} label="流程信息" /> : ''}
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    </Row>
                ) : (
                    ''
                )}
                <Row>{changeWK ? <WorkFlowHistory wk={changeWK} label="当前变更流程状态" /> : ''}</Row>
            </div>
        );
    }
}

export default ChangeDesignApprovalBox;
