/**
 * Created by tinybear on 17/9/19.
 */

import React, { Component } from 'react';
import { Row, Col, Popover, Input, Button, Select, message } from 'antd';
import { getUser } from '_platform/auth';
import { WORKFLOW_CODE } from '_platform/api';
import { getCurUser } from './util';
const { Option } = Select;
const JSON = window.JSON;

class ChangeDesignStartBox extends Component {
    state = {
        selectedWK: null,
        changeType: '2', //1-一般变更 2-重大变更
        advice: ''
    };

    componentDidMount() {
        let { CAD, PDF, BIM, attachmentFile, processId } = this.props.drawing.extra_params;
        this.setState({ CAD, PDF, BIM, attachmentFile });
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

    //检查是否已发起变更流程
    findChangeWK = () => {
        const { drawing } = this.props;
        const { getPlan } = this.props.actions;
        return new Promise((resolve, reject) => {
            getPlan({ code: drawing.code }).then(dr => {
                let id = dr.extra_params.changeProcessId;
                let status = dr.extra_params.changeStatus;
                if (id && (status === 1 || status === 2)) {
                    // reject();
                    resolve(id);
                } else {
                    reject();
                }
            });
        });
    };

    //发起变更流程
    createChangeWK = () => {
        const { drawing, project, unit } = this.props;
        const { changeType, selectedWK, advice } = this.state;

        let currentUser = getCurUser();

        let sb = selectedWK.subject[0];
        sb.plan_writer = JSON.parse(sb.plan_writer);

        const { actions: { createFlow, addActor } } = this.props;

        let WORKFLOW_MAP = {
            name: project.label + unit.label + '设计成果变更流程',
            desc: project.label + unit.label + '设计成果变更流程',
            code: changeType == '1' ? WORKFLOW_CODE.设计成果一般变更流程 : WORKFLOW_CODE.设计成果重大变更流程
        };
        let subject = [
            {
                project: JSON.stringify(project),
                unit: JSON.stringify(unit),
                drawingId: drawing.code,
                note: advice,
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
            return new Promise((resolve, reject) => {
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

    submit = () => {
        let me = this;
        const { onSubmit } = this.props;
        this.findChangeWK().then(
            id => {
                if (id) {
                    message.info('变更流程已被发起');
                }
            },
            () => {
                me.createChangeWK().then(wk => {
                    console.log('变更流程', wk);
                    //指定填报人

                    //更新状态 //更新列表
                    const { drawing } = me.props;
                    const { updatePlan } = me.props.actions;
                    let extra = {};
                    extra.changeProcessId = wk.id;
                    extra.changeStatus = 1; //1-待填报 2-待审查 3-完成 4-退回
                    extra.changeType = me.state.changeType;
                    updatePlan({ code: drawing.code }, { extra_params: extra }).then(data => {
                        console.log('更新后图纸', data);
                        message.info('变更流程发起成功');
                        onSubmit();
                    });
                });
            }
        );
    };

    render() {
        const { drawing, project, unit } = this.props;
        const { selectedWK } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        const { designStageEnum = {} } = this.props.plan;
        const { professionPrincipal, projectPrincipal } = drawing.extra_params;
        return (
            <div>
                <Row>
                    {/*<Button style={{float:'right'}} onClick={()=>{}}>暂存</Button>*/}
                    <Button style={{ float: 'right' }} onClick={this.submit}>
                        提交
                    </Button>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
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
                            <span>重大变更</span>
                        </Col>
                    </Row>
                </Row>
                <Row>
                    <label htmlFor="">备注:</label>
                    <Input
                        type="textarea"
                        onChange={e => {
                            this.setState({ advice: e.target.value });
                        }}
                    />
                </Row>
            </div>
        );
    }
}

export default ChangeDesignStartBox;
