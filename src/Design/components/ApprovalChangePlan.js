/**
 * Created by tinybear on 17/9/8.
 */

import React, { Component } from 'react';
import { Row, Col, Table, Button, Select, Input, Tree, message, Radio, Collapse } from 'antd';
import { getUser } from '_platform/auth';
import WorkFlowHistory from './WorkFlowHistory';
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;

class ApprovalChangePlan extends Component {
    state = {
        projectTree: [],
        wks: [],
        unitProject: null,
        project: null,
        data: [],
        advice: '',
        selectedPlan: null,
        nextuser: null,
        isPass: true,
        approvalAdvice: '',
        changeWK: null,
        changeHistory: []
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
        { title: '新计划交付时间', dataIndex: 'newDeliverTime', key: 'newDeliverTime' }
    ];

    options = [{ label: '通过', value: true }, { label: '不通过', value: false }];

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
            let code = wk.subject[0].plans[0].code;
            getPlan({ code }).then(plan => {
                let { changeHistory = [] } = plan.extra_params;
                me.setState({ selectedPlan: plan, changeHistory: changeHistory });

                //转换表格数据
                let extra = plan.extra_params;

                let { changeProcessId } = extra;
                if (changeProcessId) {
                    getWorkflow({ id: changeProcessId }).then(pwk => {
                        me.setState({ changeWK: pwk, advice: pwk.subject[0].note });
                    });
                }

                let data = [];
                if (extra.plans) {
                    let changContent = extra.changeContent;
                    extra.plans.forEach((v, i) => {
                        let newDeliverTime = changContent ? changContent.find(c => c.id == v.id) : null;
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
                            newDeliverTime: newDeliverTime ? newDeliverTime.newDeliverTime : ''
                        });
                    });
                }
                me.setState({ data, nextuser: wk.creator, advice: wk.subject[0].note });
            });
        }
    }

    submitWorkFlow = () => {
        let me = this;
        const { actions: { putFlow, getWorkflow } } = this.props;
        const { selectedPlan, approvalAdvice, isPass } = this.state;
        if (!isPass) {
            if (!approvalAdvice) {
                message.error('请填写不通过的意见');
                return;
            }
        }
        const usr = getUser();
        let extra = selectedPlan.extra_params;

        //提交流程
        const executor = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };
        getWorkflow({ id: extra.changeProcessId }).then(wk => {
            //获取节点id
            const { id, workflow: { states = [] } = {} } = wk;
            const [{ id: state_id }, { id: approvalId }] = states;
            putFlow(
                { pk: id },
                {
                    state: approvalId,
                    executor: executor,
                    action: isPass ? '通过' : '不通过',
                    note: approvalAdvice,
                    attachment: null
                }
            ).then(() => {
                const { updatePlan, updateDocumentList } = this.props.actions;
                let updateResult = [],
                    statusText = '';
                if (isPass) {
                    //更新计划
                    statusText = '完成';
                    extra.changeStatus = 2;
                    extra.plans.forEach(p => {
                        let item = extra.changeContent.find(c => c.id == p.id);
                        if (item) {
                            p.deliverTime = item.newDeliverTime;
                            updateResult.push({
                                code: p.id,
                                extra_params: {
                                    deliverTime: item.newDeliverTime
                                }
                            });
                        }
                    });
                    extra.changeContent = [];
                } else {
                    statusText = '退回';
                    extra.changeStatus = 3;
                    extra.changeContent = [];
                }
                extra.changeHistory = extra.changeHistory || [];
                extra.changeHistory.push({ id: extra.changeProcessId, status: extra.changeStatus });
                extra.changeProcessId = ''; //完成变更,清空id
                extra.changeStatus = ''; //完成变更,清空变更状态
                updatePlan({ code: selectedPlan.code }, { extra_params: extra }).then(data => {
                    console.log('更新后计划', data);
                    isPass ? message.success('成功提交变更流程') : message.success('变更计划退回成功');
                });
                //更新设计上报流程

                //更新设计成果
                updateDocumentList(
                    {},
                    {
                        data_list: updateResult
                    }
                ).then(data => {
                    console.log('已更新设计成果');
                });

                const { close, updateDataTable } = me.props;
                const { selectedWK } = me.state;
                updateDataTable(selectedWK.id, { status: statusText });
                close();
            });
        });
    };

    render() {
        let me = this;
        let { selectedWK, data, advice, changeWK, selectedPlan, changeHistory } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : {};
        const { readonly } = this.props;
        let creator = selectedWK ? selectedWK.creator : '';
        const { designStageEnum = {} } = this.props.plan;
        console.log('approval change plan render: ', data)
        return (
            <div>
                <Row>
                    {!readonly ? (
                        <Row>
                            <Col span={24}>
                                <Button style={{ float: 'right' }} onClick={this.submitWorkFlow}>
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    ) : (
                        ''
                    )}
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
                    <Row>
                        <Table columns={this.columns} pagination={false} size="small" dataSource={data} />
                    </Row>
                    <Row>
                        <label>历史变更:</label>
                        <Collapse
                            bordered={false}
                            onChange={([id = null]) => {
                                //获取流程
                                if (!id) return;
                                const { actions: { getWorkflow } } = this.props;
                                let fwk = this.state.changeHistory.find(v => v.id == id);
                                if (fwk.wk) return;
                                getWorkflow({ id: id }).then(wk => {
                                    fwk.wk = wk;
                                    this.setState({ changeHistory: this.state.changeHistory.slice() });
                                });
                            }}
                        >
                            {changeHistory.map((ch, i) => {
                                console.log('map', ch);
                                return (
                                    <Panel header={`历史变更流程${i + 1}`} key={ch.id}>
                                        {ch.wk ? <WorkFlowHistory wk={ch.wk} label="流程信息" /> : ''}
                                    </Panel>
                                );
                            })}
                        </Collapse>
                    </Row>
                    {!readonly ? (
                        <Row style={{ margin: '10px 0' }}>
                            <p>
                                计划变更理由: <br /> {advice}
                            </p>
                        </Row>
                    ) : (
                        ''
                    )}
                    {!readonly ? (
                        <Row style={{ margin: '10px 0' }}>
                            <div style={{ margin: '0 0 10px' }}>
                                计划变更审查意见: &nbsp;
                                <span>
                                    {!readonly ? (
                                        <RadioGroup
                                            options={this.options}
                                            onChange={e => {
                                                this.setState({
                                                    isPass: e.target.value
                                                });
                                            }}
                                            value={this.state.isPass}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </span>
                            </div>
                            <Input
                                type="textarea"
                                placeholder=""
                                autosize
                                value={this.state.approvalAdvice}
                                onChange={e => {
                                    this.setState({ approvalAdvice: e.target.value });
                                }}
                            />
                        </Row>
                    ) : (
                        ''
                    )}
                    <Row>
                        <WorkFlowHistory wk={changeWK} />
                    </Row>
                </Row>
            </div>
        );
    }
}

export default ApprovalChangePlan;
