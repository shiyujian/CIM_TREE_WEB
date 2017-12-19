/**
 * Created by tinybear on 17/8/7.
 */

import React, { Component } from 'react';
import { Row, Col, Button, Select, DatePicker, Input, Icon, Spin, notification, message } from 'antd';
import './CreatePlan.less';
import ProjectUnitWrapper from './ProjectUnitWrapper';
import Dragger from '_platform/components/panels/Dragger';
import { Sidebar, Content } from '_platform/components/layout';
import UserTreeSelect from './UserTreeSelect';
import { getUser } from '_platform/auth';
import { WORKFLOW_CODE } from '_platform/api';
import moment from 'moment';
const Option = Select.Option;

let transUser = user => {
    let { account } = user;
    return {
        id: user.id,
        username: user.username,
        person_name: account.person_name,
        person_code: account.person_code,
        organization: account.organization
    };
};

class CreatePlanPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designUnit: '',
            endDate: '',
            project: '',
            unitProject: '',
            relateOrgs: [],
            designStage: '',
            drawingReviewUnit: '',
            modalReviewUnit: '',
            mark: '',
            attachmentFile: '',
            drawingReviewDays: null,
            modalReviewDays: null,
            //发送
            planWriter: '',
            modelChecker: '',
            drawingChecker: '',
            busying: false,
            disableSubmit: false
        };
    }

    componentDidMount() {
        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        getDesignStage();
    };

    selectProject = (project, unitProject) => {
        this.getRelateOrg(unitProject);
        this.setState({ project, unitProject });
    };

    getRelateOrg = unit => {
        let me = this;
        if (!unit) return;
        const { getWorkpackages } = this.props.actions;
        getWorkpackages({ code: unit.code }).then(pkg => {
            let relateOrgs = pkg.extra_params.unit || [];
            me.setState({ relateOrgs });
        });
    };

    genMsg() {
        let state = this.state;
        const { designStageEnum } = this.props.plan;
        let msg = `请${state.designUnit}单位于${state.endDate.format('YYYY-MM-DD')}前,填报${state.project.label}项目${state
            .unitProject.label}工程${designStageEnum[state.designStage]}成果的交付计划。`;
        return msg;
    }

    submit = () => {
        const state = this.state;
        if (!state.project || !state.unitProject) {
            message.error('请选择单位工程');
            return;
        }
        if (!state.designStage) {
            message.error('请选择设计阶段');
            return;
        }
        if (!state.endDate) {
            message.error('请选择结束时间');
            return;
        }
        if (!state.planWriter || !state.drawingChecker || !state.modelChecker) {
            message.error('请选择发送人');
            return;
        }
        if (!state.drawingReviewDays || !state.modalReviewDays) {
            message.error('请填写审查时间');
            return;
        }

        // let now = state.endDate.valueOf();
        // if (state.drawingReviewDays.valueOf() < now || state.modalReviewDays.valueOf() < now) {
        //     message.error('审查时间不能早于填报计划时间');
        //     return;
        // }

        const {
            unitProject,
            project,
            planWriter,
            modelChecker,
            drawingChecker,
            drawingReviewDays,
            modalReviewDays,
            endDate,
            designUnit,
            drawingReviewUnit,
            modalReviewUnit,
            mark,
            attachmentFile
        } = this.state;
        const subject = [
            {
                plan_writer: JSON.stringify(planWriter),
                plan_write_date: moment().format('YYYY-MM-DD'),
                project: JSON.stringify({
                    pk: project.pk,
                    code: project.code,
                    obj_type: project.obj_type,
                    name: project.name
                }),
                stage: state.designStage,
                unit: JSON.stringify({
                    pk: unitProject.pk,
                    code: unitProject.code,
                    obj_type: unitProject.obj_type,
                    name: unitProject.name
                }),
                drawing_checker: JSON.stringify(drawingChecker),
                model_checker: JSON.stringify(modelChecker),
                design_unit: JSON.stringify(designUnit),
                drawing_ch_unit: JSON.stringify(drawingReviewUnit),
                modal_ch_unit: JSON.stringify(modalReviewUnit),
                fill_end_time: endDate.format('YYYY-MM-DD'),
                note: mark,
                attachment: JSON.stringify(attachmentFile),
                //todo
                //图纸审查天数与模型审查天数
                drawingReviewDayLimit: drawingReviewDays || 7,
                modalReviewDayLimit: modalReviewDays || 15,
                // drawingReviewTime: drawingReviewDays.format('YYYY-MM-DD'),
                // modalReviewTime: modalReviewDays.format('YYYY-MM-DD'),
            }
        ];

        this.launchFlow(subject);
    };

    launchFlow = (subject = []) => {
        const { actions: { createFlow, addActor, commitFlow, startFlow } } = this.props;

        const usr = getUser();
        const currentUser = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };

        this.setState({ busying: true });

        const nextUser = this.state.planWriter;
        let WORKFLOW_MAP = {
            name: '交付计划填报流程',
            desc: '设计管理填报交付计划',
            code: WORKFLOW_CODE.设计计划填报流程
        };
        createFlow(
            {},
            {
                name: WORKFLOW_MAP.name,
                description: WORKFLOW_MAP.desc,
                subject,
                code: WORKFLOW_MAP.code,
                creator: currentUser,
                plan_start_time: moment().format('YYYY-MM-DD'),
                deadline: null
            }
        ).then(instance => {
            const { id, workflow: { states = [] } = {} } = instance;
            const [{ id: state_id, actions: [action] }] = states;
            Promise.all([
                addActor(
                    { ppk: id, pk: state_id },
                    {
                        participants: [nextUser],
                        remark: WORKFLOW_MAP.desc
                    }
                )
            ]).then(() => {
                commitFlow(
                    { pk: id },
                    {
                        creator: currentUser
                    }
                ).then(() => {
                    startFlow(
                        { pk: id },
                        {
                            creator: currentUser
                        }
                    ).then(() => {
                        this.createPlan(id, subject);
                        notification.success({
                            message: '流程信息',
                            description: '交付计划流程提交成功'
                        });
                    });
                });
            });
        });
    }

    createPlan = (processId, subject) => {
        const { unitProject, designStage, attachmentFile } = this.state;
        const { designStageEnum = {} } = this.props.plan;
        const plan = {
            code: 'plan_doc_' + designStage + '_' + Date.now(),
            name: unitProject.name + '_' + designStageEnum[designStage] + '_交付计划',
            obj_type: 'C_DOC',
            workpackages: [{ pk: unitProject.pk, code: unitProject.code, obj_type: unitProject.obj_type }],
            profess_folder: { code: 'folder_code', obj_type: 'C_DIR' },
            extra_params: {
                processId: processId,
                status: 0,
                planStart: moment().format('YYYY-MM-DD'),
                attachments: attachmentFile
            },
            basic_params: {
                files: []
            },
            status: 'A',
            version: 'A',
            ex_change_docs: [{ pk: 'docpk', code: 'anotherdocname', obj_type: 'C_DOC' }]
        };
        const { createPlan } = this.props.actions;
        createPlan({}, plan).then(data => {
            console.log('创建计划成功', data);
            const { bindPlanWorkflow } = this.props.actions;
            subject[0].plans = JSON.stringify([{ pk: data.pk, name: data.name, code: data.code }]);
            bindPlanWorkflow({ id: processId }, { subject }).then(data => {
                this.setState({ busying: false, disableSubmit: true });
            });
        });
    };

    disabledDate(current) {
        let now = new Date();
        let now_1 = now.setDate(now.getDate() - 1);
        return current && current.valueOf() < now_1.valueOf();
    }

    render() {
        const {
            project,
            unitProject,
            relateOrgs,
            designUnit,
            drawingReviewUnit,
            modalReviewUnit,
            busying,
            disableSubmit
        } = this.state;
        const { designStageEnum = {} } = this.props.plan;
        return (
            <div className="create-plan">
                <Sidebar>
                    <div className="project-tree">
                        <ProjectUnitWrapper onSelect={this.selectProject} {...this.props} />
                    </div>
                </Sidebar>
                <Content>
                    <Row>
                        <Col span={24}>
                            <div className="notice-content">
                                <div>
                                    <Button onClick={this.submit} loading={busying} disabled={disableSubmit}>
                                        发送
                                    </Button>
                                    <div style={{ clear: 'both' }}> </div>
                                </div>
                                <h2 className="mb10" style={{ textAlign: 'center' }}>
                                    设计成果交付计划填报通知
                                </h2>
                                <Row className="mb10">
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            项目名称:
                                        </label>
                                        <span>{project ? project.label : ''}</span>
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            单位工程:
                                        </label>
                                        <span>{unitProject ? unitProject.label : ''}</span>
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            设计阶段:
                                        </label>
                                        <Select
                                            value={this.state.designStage}
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                this.setState({ designStage: value });
                                            }}
                                        >
                                            {Object.keys(designStageEnum).map(v => {
                                                return (
                                                    <Option value={v} key={v}>
                                                        {designStageEnum[v]}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className="mb10">
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            设计单位:
                                        </label>
                                        <Select
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                let org = this.state.relateOrgs.find(rt => rt.code === value);
                                                this.setState({ designUnit: org });
                                            }}
                                        >
                                            {relateOrgs.map(r => {
                                                return (
                                                    <Option value={r.code} key={r.code}>
                                                        {r.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            图纸审查单位:
                                        </label>
                                        <Select
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                let org = this.state.relateOrgs.find(rt => rt.code === value);
                                                this.setState({ drawingReviewUnit: org });
                                            }}
                                        >
                                            {relateOrgs.map(r => {
                                                return (
                                                    <Option value={r.code} key={r.code}>
                                                        {r.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            模型审查单位:
                                        </label>
                                        <Select
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                let org = this.state.relateOrgs.find(rt => rt.code === value);
                                                this.setState({ modalReviewUnit: org });
                                            }}
                                        >
                                            {relateOrgs.map(r => {
                                                return (
                                                    <Option value={r.code} key={r.code}>
                                                        {r.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row className="mb10">
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            设计负责人:
                                        </label>
                                        <UserTreeSelect
                                            rootCode={designUnit.code}
                                            placeholder="计划填报人"
                                            onSelect={user => {
                                                this.setState({ planWriter: transUser(user) });
                                            }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            图纸审查负责人:
                                        </label>
                                        <UserTreeSelect
                                            rootCode={drawingReviewUnit.code}
                                            placeholder="图纸审查人"
                                            onSelect={user => {
                                                this.setState({ drawingChecker: transUser(user) });
                                            }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            模型审查负责人:
                                        </label>
                                        <UserTreeSelect
                                            rootCode={modalReviewUnit.code}
                                            placeholder="模型审查人"
                                            onSelect={user => {
                                                this.setState({ modelChecker: transUser(user) });
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb10">
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            填报计划时间:
                                        </label>
                                        <DatePicker
                                            size={'small'}
                                            style={{ textIndent: '0' }}
                                            disabledDate={this.disabledDate}
                                            onChange={date => {
                                                this.setState({ endDate: date });
                                            }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            图纸审查天数:
                                        </label>
                                        <Select
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                this.setState({ drawingReviewDays: value });
                                            }}
                                        >
                                            <Option value="7">7</Option>
                                            <Option value="15">15</Option>
                                            <Option value="30">30</Option>
                                        </Select>
                                        {/* <DatePicker
                                            size={'small'}
                                            style={{ textIndent: '0' }}
                                            disabledDate={this.disabledDate}
                                            onChange={date => {
                                                this.setState({ drawingReviewDays: date });
                                            }}
                                        /> */}
                                    </Col>
                                    <Col span={8}>
                                        <label className="form-item-required" htmlFor="">
                                            模型审查天数:
                                        </label>
                                        <Select
                                            size={'small'}
                                            style={{ minWidth: 120 }}
                                            onChange={value => {
                                                this.setState({ modalReviewDays: value });
                                            }}
                                        >
                                            <Option value="7">7</Option>
                                            <Option value="15">15</Option>
                                            <Option value="30">30</Option>
                                        </Select>
                                        {/* <DatePicker
                                            size={'small'}
                                            style={{ textIndent: '0' }}
                                            disabledDate={this.disabledDate}
                                            onChange={date => {
                                                this.setState({ modalReviewDays: date });
                                            }}
                                        /> */}
                                    </Col>
                                </Row>

                                <Row className="mb10">
                                    <p>备注:</p>
                                    <Input
                                        type="textarea"
                                        placeholder=""
                                        autosize={{ minRows: 4 }}
                                        value={this.state.mark}
                                        onChange={e => {
                                            this.setState({ mark: e.target.value });
                                        }}
                                    />
                                </Row>
                                <Row className="mb10">
                                    附件:
                                    {this.state.attachmentFile ? (
                                        <p>
                                            {this.state.attachmentFile.name}
                                            <a
                                                href="javascript:;"
                                                style={{ marginLeft: '5px' }}
                                                onClick={() => {
                                                    this.setState({ attachmentFile: null });
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
                                            this.setState({ attachmentFile: val });
                                        }}
                                    >
                                        <p>支持上传word、pdf等格式文档</p>
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">点击或者拖拽开始上传</p>
                                    </Dragger>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </div>
        );
    }
}

export default CreatePlanPanel;
