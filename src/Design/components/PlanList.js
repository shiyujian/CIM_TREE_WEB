/**
 * Created by tinybear on 17/9/15
 * 填报计划列表
 */
import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import { Sidebar, Content } from '_platform/components/layout';
import ProjectUnitWrapper from './ProjectUnitWrapper';
import FillPlanPanel from '../components/FillPlan';
import ApprovalPlan from '../components/ApprovalPlan';
import ChangePlan from '../components/ChangePlan';
import ApprovalChangePlan from '../components/ApprovalChangePlan';
import QueryBox from './QueryBox/QueryBox';
import { getUser } from '_platform/auth';
import { PAGE_SIZE } from './Const';
import { parseWorkflowId, isDisabledAutoLoad } from './util';
import { WORKFLOW_CODE } from '_platform/api';
const JSON = window.JSON;

class PlanList extends Component {
    constructor(props){
        super(props)
        this.state={
            data: [],
            project: null,
            unitProject: null,
            role: 1, //1-填报 2-审查 3-变更 4-审查计划变更
            fillVisible: false, //填报模态框
            fillReadOnly: false,
            approvalVisible: false, //审查页面
            changeVisible: false,
            changeReadonly: false,
            changeApprovalVisible: false,
            wks: [],
            selectedWK: null,
            query: {}, //查询条件
            pagination: {
                pageSize: PAGE_SIZE,
                current: 1,
                total: 0
            },
            isFixedWk: false //是否处理指定流程
        }
        this.getTableTit=this.getTableTit.bind(this);
    }
    // state = {
        
    // };

    columns = [
        { title: '序号', dataIndex: 'xuhao', key: 'xuhao' },
        { title: '任务编号', dataIndex: 'taskId', key: 'taskId' },
        { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
        { title: '单位工程', dataIndex: 'unitName', key: 'unitName' },
        { title: '设计单位', dataIndex: 'designOrg', key: 'designOrg' },
        { title: '图纸审查', dataIndex: 'drawingOrg', key: 'drawingOrg' },
        { title: '模型审查', dataIndex: 'modelOrg', key: 'modelOrg' },
        { title: '设计阶段', dataIndex: 'designStage', key: 'designStage' },
        { title: '交付时间', dataIndex: 'deliverTime', key: 'deliverTime' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 60,
            render: (text, record) => {
                if (text === 0) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showFillModal(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
                if (text === 1) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    this.showFillBox(record.id);
                                }}
                            >
                                填报
                            </a>
                            <span className="ant-divider" />
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showFillModal(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
                if (text === 2) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    const { wks } = this.state;
                                    let selectedWK = wks.find(w => w.id === record.id);
                                    //调用填报页面
                                    this.setState({ approvalVisible: true, selectedWK, fillReadOnly: false });
                                }}
                            >
                                审查
                            </a>
                            <span className="ant-divider" />
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showFillModal(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
                //3 设计变更
                if (text === 3) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    const { wks } = this.state;
                                    let selectedWK = wks.find(w => w.id === record.id);
                                    //调用填报页面
                                    this.setState({ changeVisible: true, selectedWK });
                                }}
                            >
                                变更
                            </a>
                            <span className="ant-divider" />
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showChangeDetail(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
                //4 变更审查
                if (text === 4) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    const { wks } = this.state;
                                    let selectedWK = wks.find(w => w.id === record.id);
                                    //调用变更审查页面
                                    this.setState({ changeApprovalVisible: true, selectedWK });
                                }}
                            >
                                变更审查
                            </a>
                            <span className="ant-divider" />
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showChangeDetail(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
                if (text === 5) {
                    return (
                        <span>
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.showChangeDetail(record);
                                }}
                            >
                                详情
                            </a>
                        </span>
                    );
                }
            }
        }
    ];

    curUsr = null;
    getTableTit(){
        let TableTit = '';
        switch(this.props.role){
            case 1:
                TableTit = '填报计划';
                break;
            case 2:
                TableTit = '计划审查';
                break;
            case 3:
                TableTit = '计划变更';
                break;
            case 4:
                TableTit = '变更审查';
                break;
            default:
                TableTit = '交付计划任务处理';
                break;
        }
        return TableTit;
    }
    componentDidMount() {
        this.curUsr = getUser();
        this.getDesignStage();
        this.getWorkFlowById();
        this.disableAutoLoad = isDisabledAutoLoad();
    }

    setFirstUnit = () => {
        const { platform: { wp: { projectTree = [] } = {} } } = this.props;
        let project = projectTree.length ? projectTree[0] : null;
        let unitProject = project && project.children.length ? project.children[0] : null;
        if (unitProject) {
            this.selectProject(project, unitProject, true);
        }
    };

    //通过个人任务跳转来的
    getWorkFlowById() {
        let wkId = parseWorkflowId();
        if (wkId) {
            //获取流程 自动打开填报页面
            let query = { ...this.state.query, id: wkId };
            delete query.subject_unit__contains;
            this.setState({ query, isFixedWk: true }, () => {
                this.getPlanWK(1);
            });
        }
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    //打开填报计划弹窗
    showFillBox = id => {
        const { wks } = this.state;
        let selectedWK = wks.find(w => w.id === id);
        //调用填报页面
        this.setState({ fillVisible: true, selectedWK, fillReadOnly: false });
    };

    //查看填报详情
    showFillModal = record => {
        const { wks } = this.state;
        let selectedWK = wks.find(w => w.id === record.id);

        console.log('showFillModal: ', wks)
        console.log('selectedWK: ', selectedWK)

        this.setState({ fillVisible: true, selectedWK, fillReadOnly: true });
    };

    //查看变更详情
    showChangeDetail = record => {
        const { wks } = this.state;
        let selectedWK = wks.find(w => w.id === record.id);

        console.log('showChangeDetail: ', wks)
        console.log('selectedWK: ', selectedWK)

        this.setState({ changeApprovalVisible: true, selectedWK, changeReadonly: true });
    };

    selectProject = (project, unitProject, isAuto) => {
        if (!isAuto) {
            //用户已选单位工程 设置阻止自动加载
            this.disableAutoLoad.setValue(true);
        }

        if (unitProject) {
            const { getWorkpackages } = this.props.actions;
            getWorkpackages({ code: unitProject.code });
            let query = { ...this.state.query, subject_unit__contains: unitProject.code };
            delete query.id;
            this.setState({ query }, () => {
                this.getPlanWK(1, isAuto);
            });
        }

        if (isAuto && this.disableAutoLoad.getValue()) return;
        this.setState({ project, unitProject });
    };

    //防止选择单位工程后执行自动加载
    disableAutoLoad = null;

    //获取计划填报流程
    getPlanWK = (page, isAuto) => {
        let me = this;
        const { getPlanWk, getDocumentList } = this.props.actions;
        const { role } = this.props;
        const { designStageEnum = {} } = this.props.plan;
        const { pagination, query } = me.state;
        getPlanWk(
            { code: WORKFLOW_CODE.设计计划填报流程 },
            {
                order_by: '-real_start_time',
                ...query,
                pagination: true,
                page_size: pagination.pageSize,
                page: page
            }
        ).then(response => {
            if (isAuto && me.disableAutoLoad.getValue()) {
                //阻止自动加载
                return;
            }
            let planWks = response.data;
            pagination.current = page;
            pagination.total = response.count;
            me.setState({ pagination });
            let data = [],
                planIds = [],
                project,
                unitProject;
            planWks.forEach((d, i) => {
                let sb = d.subject[0];
                sb.unit = JSON.parse(sb.unit);
                sb.project = JSON.parse(sb.project);
                sb.model_checker = JSON.parse(sb.model_checker);
                sb.drawing_checker = JSON.parse(sb.drawing_checker);
                sb.design_unit = JSON.parse(sb.design_unit);
                sb.drawing_ch_unit = JSON.parse(sb.drawing_ch_unit);
                sb.modal_ch_unit = JSON.parse(sb.modal_ch_unit);
                sb.plan_writer = JSON.parse(sb.plan_writer);
                sb.plans = JSON.parse(sb.plans);
                project = sb.project;
                unitProject = sb.unit;

                planIds.push(sb.plans[0].code);
                //判断当前用户是否有操作权限
                let action = 0;
                let statusText = '';
                if (d.status === 3) {
                    statusText = '完成';
                }
                if (d.current && d.current.length) {
                    let statuNode = d.current[0].code;
                    let usr = d.current[0].participants.find(pt => {
                        return pt.executor.id === me.curUsr.id;
                    });
                    if (statuNode === 'START') {
                        if (usr && role === 1) action = role;
                        statusText = '待填报';
                    }
                    if (statuNode === 'STATE02') {
                        statusText = '待审查';
                        if (usr && role === 2) {
                            action = role;
                        }
                    }
                }

                data.push({
                    id: d.id,
                    xuhao: i + 1,
                    key: i + 1,
                    taskId: d.id,
                    projectName: sb.project.name,
                    unitName: sb.unit.name,
                    designOrg: sb.design_unit.name,
                    drawingOrg: sb.drawing_ch_unit.name,
                    modelOrg: sb.modal_ch_unit.name,
                    designStage: designStageEnum[sb.stage],
                    deliverTime: sb.fill_end_time,
                    status: statusText,
                    action: action
                });
            });
            this.setState({
                data,
                wks: planWks
            });
            if (query.id && unitProject) {
                me.setState({
                    project: { label: project.name, value: project.code },
                    unitProject: { label: unitProject.name, value: unitProject.code }
                });
            }

            //检查变更状态 获取用户是否有变更权限
            if (role === 3 || role === 4) {
                getDocumentList({}, { key_type: 'code', list: planIds.join() }).then(resData => {
                    let plans = resData.result;
                    plans.forEach(pl => {
                        let { changeStatus, processId } = pl.extra_params;
                        let findIndex = data.findIndex(d => d.id === processId);
                        let wk = planWks.find(d => d.id === processId);
                        let sb = wk.subject[0];

                        //如果当前用户是计划填报人 有变更权限
                        let action = 5;
                        //changeStatus 3-变更退回
                        if (role === 3 && sb.plan_writer.id === me.curUsr.id && (!changeStatus || changeStatus === 3)) {
                            action = role;
                        }
                        if (changeStatus === 1 && role === 4 && wk.creator.id === me.curUsr.id) {
                            action = role;
                        }

                        let status = '';
                        switch (role) {
                            case 3:
                            case 4: {
                                status = '无';
                                if (changeStatus === 1) {
                                    status = '待审查';
                                }
                                break;
                            }
                        }
                        data[findIndex] = Object.assign(data[findIndex], { action, status });
                    });
                    this.setState({ data });
                });
            }
        });
    };

    fillClose = () => {
        this.setState({ fillVisible: false });
    };

    approvalClose = () => {
        this.setState({ approvalVisible: false });
    };

    changeClose = () => {
        this.setState({ changeVisible: false });
    };

    changeApprovalClose = () => {
        this.setState({ changeApprovalVisible: false });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.getPlanWK(pagination.current);
    };

    //查询数据
    queryWks = query => {
        let { unitProject } = this.state;
        if (!unitProject) return;
        let localQuery = {
            subject_unit__contains: unitProject.code,
            ...query
        };

        this.setState({ query: localQuery }, () => {
            this.getPlanWK(1);
        });
    };

    //待更新当前记录的状态
    updateDataTable = (id, dataRow) => {
        // const { data } = this.state;
        // let index = data.findIndex(d => {
        //     return d.id === id;
        // });
        // data[index] = Object.assign(data[index], dataRow);
        // this.setState({ data });
        const { project, unitProject } = this.state;
        this.selectProject( project, unitProject );
    };

    render() {
        let { project, unitProject, pagination } = this.state;
        return (
            <div>
                <Sidebar>
                    <div className="project-tree" style={{ overflow: 'hidden' }}>
                        <ProjectUnitWrapper
                            {...this.props}
                            onLoad={() => {
                                if (!this.state.isFixedWk) {
                                    this.setFirstUnit();
                                }
                            }}
                            onSelect={this.selectProject}
                        />
                    </div>
                </Sidebar>
                <Content>
                    {/*<Row style={{margin:'10px 0'}}>
                        <h2 style={{textAlign:'center'}}>任务处理</h2>
                    </Row>*/}
                    <QueryBox {...this.props} project={project} unitProject={unitProject} onQuery={this.queryWks} />
                    <Table
                        size="small"
                        title={this.getTableTit}
                        columns={this.columns}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        dataSource={this.state.data}
                    >
                        {' '}
                    </Table>
                </Content>
                {this.state.fillVisible ? (
                    <Modal
                        title="设计成果交付计划填报"
                        width="80%"
                        visible={this.state.fillVisible}
                        footer={false}
                        onCancel={this.fillClose}
                    >
                        <FillPlanPanel
                            {...this.props}
                            selectedWK={this.state.selectedWK}
                            readonly={this.state.fillReadOnly}
                            close={this.fillClose}
                            updateDataTable={this.updateDataTable}
                        />
                    </Modal>
                ) : (
                    ''
                )}
                {this.state.approvalVisible ? (
                    <Modal
                        title="设计成果交付计划审查"
                        width="80%"
                        visible={this.state.approvalVisible}
                        footer={false}
                        onCancel={this.approvalClose}
                    >
                        <ApprovalPlan
                            {...this.props}
                            selectedWK={this.state.selectedWK}
                            close={this.approvalClose}
                            updateDataTable={this.updateDataTable}
                        >
                            {' '}
                        </ApprovalPlan>
                    </Modal>
                ) : (
                    ''
                )}
                {this.state.changeVisible ? (
                    <Modal
                        title="设计成果交付计划变更"
                        width="80%"
                        visible={this.state.changeVisible}
                        footer={false}
                        onCancel={this.changeClose}
                    >
                        <ChangePlan
                            {...this.props}
                            project={this.state.project}
                            unitProject={this.state.unitProject}
                            selectedWK={this.state.selectedWK}
                            close={this.changeClose}
                            updateDataTable={this.updateDataTable}
                        >
                            {' '}
                        </ChangePlan>
                    </Modal>
                ) : (
                    ''
                )}
                {this.state.changeApprovalVisible ? (
                    <Modal
                        title={this.state.changeReadonly ? '设计成果交付计划详情' : '设计成果交付计划变更'}
                        width="80%"
                        visible={this.state.changeApprovalVisible}
                        footer={false}
                        onCancel={this.changeApprovalClose}
                    >
                        <ApprovalChangePlan
                            {...this.props}
                            project={this.state.project}
                            unitProject={this.state.unitProject}
                            selectedWK={this.state.selectedWK}
                            close={this.changeApprovalClose}
                            updateDataTable={this.updateDataTable}
                            readonly={this.state.changeReadonly}
                        >
                            {' '}
                        </ApprovalChangePlan>
                    </Modal>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default PlanList;
