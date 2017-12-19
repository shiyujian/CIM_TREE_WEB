/**
 * Created by tinybear on 17/8/15.
 * 生成交付计划
 */

import React, { Component } from 'react';
import { Row, Col, Select, message, Card, Button, Modal } from 'antd';
import ProjectUnitWrapper from './ProjectUnitWrapper';
import { Sidebar, Content } from '_platform/components/layout';
import DeliverDetail from './DeliverDetail';
import './DeliverPlan.less';

import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/locale/locale_cn.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_smart_rendering.js';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css';

import moment from 'moment';
const { Option } = Select;

const gantt = window.gantt;

class DeliverPlanPanel extends Component {

    state = {
        columns: [
            {
                title: '任务编号',
                dataIndex: 'taskId',
                key: 'taskId',
                width: 120,
                render: (value, row, index) => {
                    const obj = {
                        children: <span className="normalColumn">{value}</span>,
                        props: { rowSpan: row.rowSpan }
                    };
                    return obj;
                }
            },
            { title: '卷册编号', dataIndex: 'juance', key: 'juance', width: 200 },
            { title: '任务发起时间', dataIndex: 'planStart', key: 'planStart', width: 100 },
            { title: '计划交付时间', dataIndex: 'deliverTime', key: 'deliverTime', width: 100 },
            { title: '2017年1月', dataIndex: 'time1', key: 'time1', width: 100 },
            { title: '2017年2月', dataIndex: 'time2', key: 'time2', width: 100 }
        ],
        data: [],
        plans: [],
        project: null,
        unitProject: null,
        designStage: '',
        selectedWf: null,
        ganttData: [],
        tasks: {
            data: []
        }
    };

    startTime = null; //整个计划开始时间
    endTime = null; //最晚交付时间

    componentDidMount() {
        gantt.init('gannt_deliver_plan');
        this.setConfig();
        this.getDesignStage();
    }

    setFirstUnit = () => {
        const { platform: { wp: { projectTree = [] } = {} } } = this.props;
        let project = projectTree.length ? projectTree[0] : null;
        let unitProject = project && project.children.length ? project.children[0] : null;
        if (unitProject) {
            this.selectProject(project, unitProject);
        }
    };

    getDesignStage = () => {
        let me = this;
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage().then(() => {
                const { designStageEnum = {} } = me.props.plan;
                let keys = Object.keys(designStageEnum);
                if (keys && keys.length) {
                    me.setState({ designStage: keys[0] });
                }
            });
        } else {
            const { designStageEnum = {} } = me.props.plan;
            let keys = Object.keys(designStageEnum);
            if (keys && keys.length) {
                me.setState({ designStage: keys[0] });
            }
        }
    };
    selectProject = (project, unitProject) => {

        //获取计划
        let me = this;
        if (!unitProject) return;
        this.setState({ project, unitProject });
        this.getPlansByUnit(unitProject).then(() => {
            me.genPlanTable();
        });
    };

    //获取设计阶段和计划编号
    getPlansByUnit = unitProject => {
        let me = this;
        const { getWorkpackages, getDocumentList } = this.props.actions;
        if (!unitProject) {
            message.info('请选择单位工程');
            return;
        }

        return new Promise((resolve, reject) => {
            getWorkpackages({ code: unitProject.code }, { rel_docs: true }).then(data => {
                let docs = data.related_documents;
                let planCodes = docs
                    .filter(d => {
                        return d.code.indexOf('plan_doc_') !== -1;
                    })
                    .map(dc => dc.code);

                getDocumentList({}, { key_type: 'code', list: planCodes.join() }).then(response => {
                    let plans = response.result;
                    //计算设计阶段
                    me.setState({ plans });
                    resolve();
                });
            });
        });
    };

    renderPlan = planDocs => {
        let me = this;
        let data = [];
        let ganttData = [];
        this.startTime = null;
        this.endTime = null;
        planDocs.forEach(plan => {
            let { extra_params } = plan;
            if (extra_params.status === 2) {
                let { processId, plans = [] } = extra_params;
                let length = plans.length;
                plans.forEach((v, i) => {
                    const sub1 = new Date(extra_params.planStart);
                    const date1 = Math.abs(sub1.getTime());

                    const sub2 = new Date(v.deliverTime);
                    const date2 = Math.abs(sub2.getTime());
                    const duration = (date2 - date1) / 24 / 60 / 60 / 1000;

                    ganttData.push({
                        id: length === 1 ? processId : processId + `-${i+1}`,
                        text: v.juance,
                        name: v.name,
                        principal: v.projectPrincipal.person_name || '',
                        time_limit: duration.toString(),
                        start_date: moment(extra_params.planStart).format('DD-MM-YYYY'),
                        start_time: extra_params.planStart,//moment(v).format('YYYY年MM月DD日'),
                        end_time: v.deliverTime, //moment(v.deliverTIme).format('YYYY年MM月DD日'),
                        details: v.id,
                        duration: duration.toString(),
                        progress: 1,
                        open: true,
                        priority: '1',
                        color: 'red',
                        textColor: 'white'
                    });
                });
            }
        });
        console.log('ganttData: ', ganttData)

        me.setState({
            data: data,
            // isPlanOK: true,
            tasks: {
                data: ganttData
            }
        }, () => {
            const ganttData = this.state.tasks;
            gantt.parse(ganttData);
        });
    };

    genPlanTable = () => {

        gantt.clearAll();

        //获取计划列表
        const { plans, designStage } = this.state;
        let selectPlans = plans.filter(p => {
            let { extra_params } = p;
            return p.code.indexOf('plan_doc_' + designStage + '_') !== -1 && extra_params.status === 2;
        });

        //按设计阶段 渲染列表
        if (selectPlans && selectPlans.length) {
            this.renderPlan(selectPlans);
        }
    };

    //选择设计阶段
    changeDesignStage = value => {
        const me = this;
        this.setState({ designStage: value }, () => {
            me.genPlanTable();
        });
    };

    setConfig = () => {
        // const that = this; 
        gantt.addMarker({
            start_date: new Date(2017, 2, 31),
            css: 'status_line',
            text: '当前节点'
        });
        gantt.config.min_column_width = 80;
        // gantt.config.date_scale = '%Y年';
        // gantt.config.scale_unit = 'year';
        gantt.config.date_scale = '%Y年%M';
        gantt.config.scale_unit = 'month';
        gantt.config.readonly = true;
        gantt.config.subscales = [
            {
                unit: 'day',
                step: 1,
                // date: '%Y年%M%d日'
                date: '%d日'
            }
        ];
        gantt.config.scale_height = 60;
        gantt.config.columns = [
            {
                name: 'id',
                label: '任务编号',
                tree: false,
                width: '80'
            },
            {
                name: 'text',
                label: '卷册编号',
                tree: false,
                width: '120'
            },
            {
                name: 'name',
                label: '卷册名称',
                tree: false,
                width: '200'
            },
            {
                name: 'principal',
                label: '项目负责人',
                tree: false,
                width: '100'
            },
            {
                name: 'time_limit',
                label: '天数',
                tree: false,
                width: '60'
            },
            {
                name: 'start_time',
                label: '计划开始时间',
                tree: false,
                width: '110'
            },
            {
                name: 'end_time',
                label: '计划结束时间',
                tree: false,
                width: '110'
            }
        ];

        // gantt.attachEvent('onTaskRowClick', (id, row) => {
        gantt.attachEvent('onTaskDblClick', (id, row) => {
            //any custom logic here
            const { getWorkflow } = this.props.actions;
            // const task = gantt.getTask(id);

            const wf_id = String(id).split('-')[0]
            getWorkflow({id: wf_id}).then(res => {
                this.setState({ 
                    selectedWK: res,
                    changeApprovalVisible: true,
                })
            })
        });

        // gantt.config.static_background = true;
    }

    render() {
        const { project, unitProject, designStage } = this.state;
        const { designStageEnum = {} } = this.props.plan;

        // this.setConfig();

        return (
            <div>
                <Sidebar>
                    <div style={{ overflow: 'hidden' }} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.selectProject} onLoad={this.setFirstUnit} />
                    </div>
                </Sidebar>
                <Content>
                    <Row>
                        <Col span={24}>
                            <Card style={{ marginBottom: 10 }}>
                                <Row>
                                    <Col span={12}>
                                        <label>项目名称:</label>
                                        <b>{project ? project.label : ''}</b>
                                    </Col>
                                    <Col span={12}>
                                        <label>单位工程:</label>
                                        <b>{unitProject ? unitProject.label : ''}</b>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    <Col span={12}>
                                        <label>设计阶段: </label>
                                        <Select
                                            style={{ width: 120 }}
                                            value={designStage}
                                            size="small"
                                            onChange={this.changeDesignStage}
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
                                    {/* <Col>
                                        <Button 
                                            disable={this.state.selectedWf}
                                            onClick={() => {

                                            }}
                                        >
                                            查看详情
                                        </Button>
                                    </Col> */}
                                </Row>
                            </Card>
                            <Row>
                                <div>
                                    <div
                                        id="gannt_deliver_plan"
                                        style={{ width: '100%', height: '723px', float: 'left' }}
                                    />
                                </div>
                            </Row>
                            {this.state.changeApprovalVisible ? (
                                <Modal
                                    title="设计成果交付计划详情"
                                    width="80%"
                                    visible={this.state.changeApprovalVisible}
                                    footer={false}
                                    onCancel={() => {this.setState({changeApprovalVisible: false})}}
                                >
                                    <DeliverDetail
                                        {...this.props}
                                        selectedWK={this.state.selectedWK}
                                    >
                                        {' '}
                                    </DeliverDetail>
                                </Modal>
                            ) : (
                                ''
                            )}
                        </Col>
                    </Row>
                </Content>
            </div>
        );
    }
}

export default DeliverPlanPanel;
