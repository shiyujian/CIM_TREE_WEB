/**
 * Created by tinybear on 17/8/18.
 */
import React, { Component } from 'react';
import { Row, Col, Button, Table, Radio, Input, message } from 'antd';
import { getUser } from '_platform/auth';
import { PlanDirCode } from './util';
const RadioGroup = Radio.Group;

class ApprovalPlan extends Component {
    state = {
        data: [],
        isPass: true,
        advice: '',
        wks: [],
        selectedWK: null,
        unitProject: null,
        designStage: '',
        busying: false
    };

    columns = [
        { title: '序号', dataIndex: 'xuhao', key: 'xuhao' },
        { title: '图纸卷册编号', dataIndex: 'juance', key: 'juance' },
        { title: '图纸卷册名称', dataIndex: 'name', key: 'name' },
        { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
        {
            title: '专业',
            dataIndex: 'profession',
            key: 'profession',
            render: text => {
                return text && text.name ? text.name : text ? text : '';
            }
        },
        { title: '当前版本', dataIndex: 'version', key: 'version' },
        {
            title: '项目负责人',
            dataIndex: 'projectPrincipal',
            key: 'projectPrincipal',
            render: text => {
                return text.person_name ? text.person_name : text;
            }
        },
        {
            title: '专业负责人',
            dataIndex: 'professionPrincipal',
            key: 'professionPrincipal',
            render: text => {
                return text.person_name ? text.person_name : text;
            }
        },
        { title: '成果交付时间', dataIndex: 'deliverTime', key: 'deliverTime' }
    ];

    options = [{ label: '通过', value: true }, { label: '不通过', value: false }];

    componentWillMount() {
        const { selectedWK } = this.props;
        this.setState({ selectedWK: selectedWK });
        this.getPlan(selectedWK);
        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    //获取计划
    getPlan = wk => {
        const { getPlan, getWorkflow } = this.props.actions;

        if (wk) {
            getWorkflow({ id: wk.id }).then(wkflow => {
                let subject = wkflow.subject[0];
                subject.unit = JSON.parse(subject.unit);
                subject.project = JSON.parse(subject.project);
                subject.model_checker = JSON.parse(subject.model_checker);
                subject.drawing_checker = JSON.parse(subject.drawing_checker);
                subject.design_unit = JSON.parse(subject.design_unit);
                subject.drawing_ch_unit = JSON.parse(subject.drawing_ch_unit);
                subject.modal_ch_unit = JSON.parse(subject.modal_ch_unit);
                subject.plan_writer = JSON.parse(subject.plan_writer);
                this.setState({ selectedWK: wkflow, unitProject: subject.unit, designStage: subject.stage });
            });

            // let code = JSON.parse(wk.subject[0].plans)[0].code;
            const code = wk.subject[0].plans[0].code;
            getPlan({ code }).then(plan => {
                this.setState({ selectedPlan: plan });
                //转换表格数据
                let extra = plan.extra_params;
                // extra.plans
                let data = [];
                if (extra.plans) {
                    extra.plans.forEach((v, i) => {
                        data.push({
                            id: v.id,
                            key: i + 1,
                            xuhao: i + 1,
                            juance: v.juance,
                            name: v.name,
                            modelName: v.modelName,
                            profession: v.profession.name,
                            version: v.version,
                            projectPrincipal: v.projectPrincipal,
                            professionPrincipal: v.professionPrincipal,
                            deliverTime: v.deliverTime,
                            approvalTime: v.approvalTime,
                            stage: v.stage,
                            action: 'normal'
                        });
                    });
                }
                this.setState({ data });
            });
        }
    };

    createDesigns = (processId = '') => {
        const { unitProject, designStage, data, selectedWK } = this.state;
        const { createDocumentList } = this.props.actions;
        const { designStageEnum = {} } = this.props.plan;
        const sb = selectedWK.subject[0];
        let drawings = {
            data_list: []
        };
        data.forEach(v => {
            const drawing = {
                code: v.id,
                name: unitProject.name + '_' + designStageEnum[designStage] + '_设计成果',
                obj_type: 'C_DOC',
                workpackages: [{ pk: unitProject.pk, code: unitProject.code, obj_type: unitProject.obj_type }],
                profess_folder: { code: 'folder_code', obj_type: 'C_DIR' },
                extra_params: {
                    processId: processId,
                    status: 0,
                    juance: v.juance,
                    name: v.name,
                    modelName: v.modelName,
                    profession: v.profession,
                    version: v.version,
                    projectPrincipal: v.projectPrincipal,
                    professionPrincipal: v.professionPrincipal,
                    deliverTime: v.deliverTime,
                    //todo 
                    drawingApprovalTime: v.drawingReviewTime,
                    modelApprovalTime: v.modalReviewTime,
                    // drawingApprovalTime: sb.drawingReviewDayLimit + v.deliverTime,
                    // modelApprovalTime: sb.modalReviewDayLimit + v.deliverTime,
                    // drawingApprovalTime: sb.drawingReviewTime,
                    // modelApprovalTime: sb.modalReviewTime,
                    stage: v.stage
                },
                basic_params: {
                    files: []
                },
                status: 'A',
                version: 'A',
                ex_change_docs: [{ pk: 'docpk', code: 'anotherdocname', obj_type: 'C_DOC' }]
            };
            drawings.data_list.push(drawing);
        });
        return createDocumentList({}, drawings);
    };

    submitWorkFlow = () => {
        const { close, updateDataTable } = this.props;
        const { putFlow } = this.props.actions;
        const { selectedWK, advice, isPass, unitProject } = this.state;

        if (!isPass) {
            if (!advice) {
                message.error('请填写不通过的意见');
                return;
            }
        }
        const usr = getUser();
        const executor = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };
        this.setState({ busying: true });
        //获取节点id
        const { id, workflow: { states = [] } = {} } = selectedWK;
        const [{ id: state_id }, { id: approvalId }] = states;
        putFlow(
            { pk: id },
            {
                state: approvalId,
                executor: executor,
                action: isPass ? '通过' : '退回',
                note: advice,
                attachment: null
            }
        ).then((res) => {
            if (isPass) {
                //发起设计成果上报流程
                const { createReportWK } = this.props.actions;
                createReportWK({ pk: selectedWK.id }, { code: unitProject.code + '_' + PlanDirCode }).then(data => {
                    const processId = data.length ? data[0] : '';
                    //创建设计成果文档
                    this.createDesigns(processId).then(() => {
                        message.success('交付计划审批成功');
                        this.setState({ busying: false });
                        close();
                    });
                });
            } else {
                message.success('交付计划审批退回成功');
                this.setState({ busying: false });
                close();
            }

            //待更新table
            updateDataTable(id, { status: '完成', action: 0 });
        });
    };

    //待完成 审批计划变更
    render() {
        let { selectedWK, busying } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : {};
        let creator = selectedWK ? selectedWK.creator : '';
        const { designStageEnum = {} } = this.props.plan;
        return (
            <div>
                {
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <Button style={{ float: 'right' }} loading={busying} onClick={this.submitWorkFlow}>
                                        提交
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{ margin: '10px 0' }}>
                                <Col span={8}>
                                    <label htmlFor="">项目名称:</label>
                                    <span>{subject ? subject.project.name : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label htmlFor="">单位工程:</label>
                                    <span>{subject ? subject.unit.name : ''}</span>
                                </Col>
                                <Col span={4}>
                                    <label htmlFor="">设计阶段:</label>
                                    <span>{designStageEnum[subject.stage]}</span>
                                </Col>
                                <Col span={4}>
                                    <label htmlFor="">建设负责人:</label>
                                    <span>{creator ? creator.person_name : ''}</span>
                                </Col>
                            </Row>
                            <Row style={{ margin: '10px 0' }}>
                                <Col span={8}>
                                    <label htmlFor="">设计单位:</label>
                                    <span>{subject ? subject.design_unit.name : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label htmlFor="">图纸审查:</label>
                                    <span>{subject ? subject.drawing_ch_unit.name : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label htmlFor="">模型审查:</label>
                                    <span>{subject ? subject.modal_ch_unit.name : ''}</span>
                                </Col>
                            </Row>
                            <Row style={{ margin: '10px 0' }}>
                                <Col span={8}>
                                    <label htmlFor="">设计负责人:</label>
                                    <span>{subject ? subject.plan_writer.person_name : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label htmlFor="">图纸审查负责人:</label>
                                    <span>{subject ? subject.drawing_checker.person_name : ''}</span>
                                </Col>
                                <Col span={8}>
                                    <label htmlFor="">模型审查负责人:</label>
                                    <span>{subject ? subject.model_checker.person_name : ''}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Table
                                    dataSource={this.state.data}
                                    pagination={false}
                                    size="small"
                                    columns={this.columns}
                                />
                            </Row>
                            <Row style={{ margin: '10px 0' }}>
                                <div style={{ margin: '0 0 10px' }}>
                                    设计成果交付计划审查意见: &nbsp;
                                    <span>
                                        <RadioGroup
                                            options={this.options}
                                            onChange={e => {
                                                this.setState({
                                                    isPass: e.target.value
                                                });
                                            }}
                                            value={this.state.isPass}
                                        />
                                    </span>
                                </div>
                                <Input
                                    type="textarea"
                                    placeholder=""
                                    autosize
                                    value={this.state.advice}
                                    onChange={e => {
                                        this.setState({ advice: e.target.value });
                                    }}
                                />
                            </Row>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

export default ApprovalPlan;
