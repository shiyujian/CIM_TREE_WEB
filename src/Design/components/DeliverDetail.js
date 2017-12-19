import React, { Component } from 'react';
import { Row, Col, Table, Collapse } from 'antd';
import { parseAll } from './util'
import WorkFlowHistory from './WorkFlowHistory';
const Panel = Collapse.Panel;

class DeliverDetail extends Component {
    state = {
        projectTree: [],
        wks: [],
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
        { title: '计划交付时间', dataIndex: 'deliverTime', key: 'deliverTime' }
        // { title: '新计划交付时间', dataIndex: 'newDeliverTime', key: 'newDeliverTime' }
    ];

    options = [{ label: '通过', value: true }, { label: '不通过', value: false }];

    componentWillMount() {
        //筛选已完成生成计划的流程
        const { selectedWK } = this.props;
        selectedWK.subject[0] = parseAll(selectedWK.subject[0])
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

    getPlan = wk => {
        const { getPlan, getWorkflow } = this.props.actions;

        if (wk) {
            // const code = JSON.parse(wk.subject[0].plans)[0].code;
            const code = wk.subject[0].plans[0].code;
            getPlan({ code }).then(plan => {
                let { changeHistory = [] } = plan.extra_params;
                this.setState({ selectedPlan: plan, changeHistory: changeHistory });

                //转换表格数据
                let extra = plan.extra_params;

                let { changeProcessId } = extra;
                if (changeProcessId) {
                    getWorkflow({ id: changeProcessId }).then(pwk => {
                        this.setState({ changeWK: pwk, advice: pwk.subject[0].note });
                    });
                }

                let data = [];
                if (extra.plans) {
                    let changContent = extra.changeContent;
                    extra.plans.forEach((v, i) => {
                        let newDeliverTime = changContent ? changContent.find(c => c.id === v.id) : null;
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
                this.setState({ data, nextuser: wk.creator, advice: wk.subject[0].note });
            });
        }
    };

    render() {
        let { selectedWK, data, changeWK, changeHistory } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : {};
        let creator = selectedWK ? selectedWK.creator : '';
        const { designStageEnum = {} } = this.props.plan;
        return (
            <div>
                <Row>
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
                    {
                        changeHistory.length ?
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
                        </Row> : 
                        <Row>
                            <WorkFlowHistory wk={selectedWK} />
                        </Row>
                    }
                </Row>
            </div>
        );
    }
}

export default DeliverDetail;
