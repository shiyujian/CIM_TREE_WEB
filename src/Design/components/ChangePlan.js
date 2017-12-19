/**
 * Created by tinybear on 17/8/21.
 */

import React, { Component } from 'react';
import { Row, Col, Table, Button, Input, DatePicker, message, Spin } from 'antd';
import WorkFlowHistory from './WorkFlowHistory';
import moment from 'moment';
import { getCurUser } from './util';
import { WORKFLOW_CODE } from '_platform/api';
const JSON = window.JSON;

class ChangePlan extends Component {
    state = {
        projectTree: [],
        unitProject: null,
        project: null,
        data: [],
        advice: '',
        selectedPlan: null,
        nextuser: null,
        selectedWK: null,
        changeWK: null,
        isProcessing: false,
        submitting: false,
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
                return text.name ? text.name : text;
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
        { title: '计划交付时间', dataIndex: 'deliverTime', key: 'deliverTime' },
        {
            title: '新计划交付时间',
            dataIndex: 'newDeliverTime',
            key: 'newDeliverTime',
            render: (text, record, index) => {
                return this.renderDatePicker(this.state.data, index, 'newDeliverTime', text);
            }
        }
    ];

    handleDateChange(key, index, value) {
        const { data } = this.state;
        // 【设计管理】修复计划变更时，新计划时间点击X时，报错问题;
        data[index][key].value = !value ? '' : value.format('YYYY-MM-DD');
        this.setState({ data });
    }
    disabledDate(current) {
        let now = new Date();
        let now_1 = now.setDate(now.getDate() - 1);
        return current && current.valueOf() < now_1.valueOf();
    }

    renderDatePicker(data, index, key, text) {
        const { editable } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <div>
                {!editable ? (
                    <span>{text.value}</span>
                ) : (
                    <DatePicker
                        value={text.value ? moment(text.value, 'YYYY-MM-DD') : null}
                        disabledDate={this.disabledDate}
                        onChange={date => this.handleDateChange(key, index, date)}
                    />
                )}
            </div>
        );
    }

    componentWillMount() {
        let me = this;
        //筛选已完成生成计划的流程
        const { selectedWK } = me.props;
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

    getPlan(wk) {
        let me = this;
        const { getPlan, getWorkflow } = this.props.actions;

        if (wk) {
            //获取计划填报流程
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
                me.setState({ selectedWK: wkflow });
            });

            let code = wk.subject[0].plans[0].code;
            getPlan({ code }).then(plan => {
                me.setState({ selectedPlan: plan });
                //判断是否已有变更流程
                const { changeStatus, changeProcessId, changeContent } = plan.extra_params;
                let isProcessing = false;
                if (changeStatus === 1 && changeProcessId) {
                    //已有在变更流程
                    isProcessing = true;
                    //获取变更流程
                    getWorkflow({ id: changeProcessId }).then(pwk => {
                        me.setState({ changeWK: pwk, advice: pwk.subject[0].note });
                    });
                }
                me.setState({ isProcessing });
                //转换表格数据
                let extra = plan.extra_params;
                // extra.plans
                let data = [];
                if (extra.plans) {
                    extra.plans.forEach((v, i) => {
                        let item = changeContent ? changeContent.find(c => c.id === v.id) : null;
                        let newDeliverTime = item ? item.newDeliverTime : '';
                        data.push({
                            id: v.id,
                            key: i + 1,
                            xuhao: i + 1,
                            juance: v.juance,
                            name: v.name,
                            modelName: v.modelName,
                            profession: v.profession,
                            version: v.version,
                            projectPrincipal: v.projectPrincipal,
                            professionPrincipal: v.professionPrincipal,
                            deliverTime: v.deliverTime,
                            newDeliverTime: { editable: !isProcessing, value: newDeliverTime }
                        });
                    });
                }
                me.setState({ data, nextuser: wk.creator });
            });
        }
    }

    startWorkFlow = () => {
        let me = this;
        const { actions: { createFlow, putFlow }, project, unitProject } = this.props;

        const { designStage, selectedPlan, advice, data, nextuser, selectedWK } = this.state;
        const subject1 = selectedWK.subject[0];
        let planStart = moment(subject1.plan_write_date).valueOf();
        // 生成当前点击时时间；只要新时间大于当前时间就可以
        let newData = moment().valueOf();

        //验证计划时间是否合理
        let isTimeOk = true;
        let changeContent = [];
        data.forEach(d => {
            if (d.newDeliverTime && d.newDeliverTime.value) {
                let deliverTime = moment(d.newDeliverTime.value).valueOf();
                if (deliverTime < planStart || deliverTime < newData) {
                    isTimeOk = false;
                }
                changeContent.push({
                    newDeliverTime: d.newDeliverTime.value,
                    id: d.id
                });
            }
        });

        if (!changeContent.length) {
            message.error('请填写变更内容');
            this.setState({submitting: false})
            return;
        }
        if (!isTimeOk) {
            message.error('成果交付时间不能早于计划发起时间和当前时间');
            this.setState({submitting: false})
            return;
        }

        const currentUser = getCurUser();
        let extra = selectedPlan.extra_params;

        let WORKFLOW_MAP = {
            name: project.label + unitProject.label + '交付计划变更流程',
            desc: project.label + unitProject.label + '交付计划变更流程',
            code: WORKFLOW_CODE.设计计划变更流程
        };
        let subject = [
            {
                project: JSON.stringify({
                    pk: project.pk,
                    code: project.code,
                    obj_type: project.obj_type,
                    name: project.name
                }),
                unit: JSON.stringify({
                    pk: unitProject.pk,
                    code: unitProject.code,
                    obj_type: unitProject.obj_type,
                    name: unitProject.name
                }),
                stage: designStage,
                note: advice,
                attachments: '[]',
                plans: JSON.stringify([{ pk: selectedPlan.pk, name: selectedPlan.name, code: selectedPlan.code }])
            }
        ];

        createFlow(
            {},
            {
                name: WORKFLOW_MAP.name,
                description: WORKFLOW_MAP.desc,
                subject,
                code: WORKFLOW_MAP.code,
                creator: currentUser,
                plan_start_time: moment().format('YYYY-MM-DD'),
                deadline: null,
                status: 2
            }
        ).then(instance => {
            const { id, workflow: { states = [] } = {} } = instance;
            const [{ id: state_id }, { id: next_id }] = states;
            putFlow(
                { pk: id },
                {
                    next_states: [
                        {
                            state: next_id,
                            participants: [nextuser],
                            deadline: null,
                            remark: null
                        }
                    ],
                    state: state_id,
                    executor: currentUser,
                    action: '提交',
                    note: '提交变更',
                    attachment: null
                }
            ).then(() => {
                //保存流程变更信息
                const { updatePlan } = this.props.actions;
                extra.changeProcessId = id;
                extra.changeStatus = 1;
                extra.changeContent = changeContent;
                updatePlan({ code: selectedPlan.code }, { extra_params: extra }).then(data => {
                    console.log('更新后计划', data);
                    message.success('成功提交变更流程');
                    this.setState({submitting: false})
                    const { close, updateDataTable } = me.props;
                    const { selectedWK } = me.state;
                    updateDataTable(selectedWK.id, { status: '已提交变更' });
                    close();
                });
            });
        });
    };

    render() {
        let { isProcessing, advice, changeWK, submitting } = this.state;
        let { selectedWK, data } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : {};
        let creator = selectedWK ? selectedWK.creator : '';
        // const { readonly } = this.props;
        const { designStageEnum = {} } = this.props.plan;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Button
                            style={{ float: 'right' }}
                            disabled={isProcessing}
                            loading={submitting}
                            onClick={() => {
                                if (this.state.submitting) return
                                this.setState({submitting: true}, () => {
                                    this.startWorkFlow()
                                })
                            }}
                        >
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
                        <label htmlFor="">图纸审查单位:</label>
                        <span>{subject ? subject.drawing_ch_unit.name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查单位:</label>
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
                <Row style={{ margin: '10px 0' }}>
                    <Table columns={this.columns} size="small" pagination={false} dataSource={data} />
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    计划变更理由:
                    <Input
                        type="textarea"
                        value={advice}
                        onChange={e => {
                            this.setState({ advice: e.target.value });
                        }}
                    />
                </Row>
                <Row>
                    <WorkFlowHistory wk={changeWK} />
                </Row>
            </div>
        );
    }
}

export default ChangePlan;
