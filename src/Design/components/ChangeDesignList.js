/**
 * Created by tinybear on 17/8/21.
 */
import React, { Component } from 'react';
import { Col, Row, Table, Modal } from 'antd';
import { getUser } from '_platform/auth';
import { Sidebar, Content } from '_platform/components/layout';
import ChangeDesignReport from './ChangeDesignReport';
import ChangeDesignStartBox from './ChangeDesignStartBox';
import ChangeDesignApprovalBox from './ChangeDesignApprovalBox';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import QueryBox from './QueryBox/QueryBox';
import { PAGE_SIZE } from './Const';
import { parseWorkflowId, isDisabledAutoLoad } from './util';
import { WORKFLOW_CODE } from '_platform/api';
const JSON = window.JSON;

class ChangeDesignContent extends Component {
    state = {
        data: [],
        project: null,
        unitProject: null,
        reportVisible: false, //上报成果
        startVisible: false, //发起变更
        approvalVisible: false, //审查成果
        wks: [], //上报流程
        changeWks: [], //变更流程
        drawings: [], //图纸列表
        selectedDrawing: null,
        reportReadonly: false,
        pagination: {
            pageSize: PAGE_SIZE,
            current: 1,
            total: 0
        },
        query: {},
        isFixedWk: false,
        isMaster: false,
        columns: [
            { title: '序号', dataIndex: 'xuhao', key: 'xuhao' },
            { title: '卷册编号', dataIndex: 'juance', key: 'juance' },
            { title: '图纸卷册名称', dataIndex: 'name', key: 'name' },
            { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
            { title: '专业', dataIndex: 'profession', key: 'profession' },
            { title: '版本', dataIndex: 'version', key: 'version' },
            { title: '设计单位', dataIndex: 'designUint', key: 'designUint' },
            {
                title: '项目负责人',
                dataIndex: 'projectPrincipal',
                key: 'projectPrincipal',
                render: (text, record, index) => {
                    return text.person_name ? text.person_name : text;
                }
            },
            {
                title: '专业负责人',
                dataIndex: 'professionPrincipal',
                key: 'professionPrincipal',
                render: (text, record, index) => {
                    return text.person_name ? text.person_name : text;
                }
            },
            {
                title: '变更类型',
                dataIndex: 'changeType',
                key: 'changeType',
                render: text => {
                    if (text === '1') return <span>{'一般变更'}</span>;
                    if (text === '2') return <span>{'重大变更'}</span>;
                }
            },
            {
                title: '状态',
                dataIndex: 'changeStatus',
                key: 'status',
                render: (text, record) => {
                    return <span>{this.getState(text)}</span>;
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 80,
                render: (text, record, index) => {
                    if (text === 0) {
                        return (
                            <span>
                                <a
                                    // href="javascript:;"
                                    onClick={() => {
                                        this.showDeitail(record);
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
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            const { drawings } = this.state;
                                            let drawing = drawings.find(w => w.code === record.key);
                                            this.setState({
                                                reportVisible: true,
                                                selectedDrawing: drawing,
                                                reportReadonly: false
                                            });
                                        }}
                                    >
                                        变更
                                    </a>
                                </span>
                                <span className="ant-divider" />
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            this.showDeitail(record);
                                        }}
                                    >
                                        详情
                                    </a>
                                </span>
                            </span>
                        );
                    }
                    if (text === 2) {
                        return (
                            <span>
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            const { drawings } = this.state;
                                            let drawing = drawings.find(w => w.code === record.key);
                                            this.setState({
                                                approvalVisible: true,
                                                selectedDrawing: drawing,
                                                reportReadonly: false
                                            });
                                        }}
                                    >
                                        审查
                                    </a>
                                </span>
                                <span className="ant-divider" />
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            this.showDeitail(record);
                                        }}
                                    >
                                        详情
                                    </a>
                                </span>
                            </span>
                        );
                    }
                    if (text === 3) {
                        return (
                            <span>
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            const { drawings } = this.state;
                                            let drawing = drawings.find(w => w.code === record.key);
                                            this.setState({
                                                startVisible: true,
                                                selectedDrawing: drawing,
                                                reportReadonly: false
                                            });
                                        }}
                                    >
                                        发起
                                    </a>
                                </span>
                                <span className="ant-divider" />
                                <span>
                                    <a
                                        // href="javascript:;"
                                        onClick={() => {
                                            this.showDeitail(record);
                                        }}
                                    >
                                        详情
                                    </a>
                                </span>
                            </span>
                        );
                    }
                }
            }
        ]
    };

    curUsr = null;
    //防止选择单位工程后执行自动加载
    disableAutoLoad = null;

    showDeitail = record => {
        const { drawings } = this.state;
        let drawing = drawings.find(w => w.code === record.key);
        this.setState({ reportReadonly: true, approvalVisible: true, selectedDrawing: drawing });
    };

    componentWillMount() {
        const { getOrgTreeByCode } = this.props.actions;
        const usr = getUser();
        getOrgTreeByCode({code: usr.org_code}, {reverse: true}).then(res => {
            console.log('getOrgTreeByCode: ', res)
            if (res.children.length && res.children[0].name === '业主单位') {
                this.setState({isMaster: true})
            } else {
                this.setState({isMaster: false})
            }
        })
    }

    componentDidMount() {
        this.curUsr = getUser();
        // const {getProjectTree} = this.props.actions;
        // getProjectTree({},{depth:3});
        this.getWorkFlowById();
        this.disableAutoLoad = isDisabledAutoLoad();
    }

    getTabTit(){
        let TableTit = '';
        switch(this.props.role){
            case 1:
                TableTit = '设计变更';
                break;
            case 2:
                TableTit = '变更审查';
                break;
            case 3:
                TableTit = '发起变更';
                break;
            default:
                TableTit = '设计变更';
                break;
        }
        return TableTit;
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
        let me = this;
        let wkId = parseWorkflowId();
        if (wkId) {
            //获取流程 自动打开填报页面
            // 获取变更流程
            const { getWorkflow, getPlan } = this.props.actions;
            getWorkflow({ id: wkId })
                .then(wk => {
                    return getPlan({ code: wk.subject[0].drawingId });
                })
                .then(doc => {
                    // 获取document 得到流程Id
                    let query = { ...this.state.query, id: doc.extra_params.processId };
                    delete query.subject_unit__contains;
                    this.setState({ query }, () => {
                        me.getReportWK(1);
                    });
                });
        }
    }

    //计算状态
    getState(status) {
        switch (status) {
            case 0:
                return '待提交';
            case 1:
                return '已发起';
            case 2:
                return '待审查';
            default:
                return '无';
        }
    }

    getReportWK(page, isAuto) {
        let me = this;
        const { getPlanWk, getDocumentList } = this.props.actions;
        const { pagination, query, isMaster } = me.state;
        const { role } = this.props;

        console.log('role: ', role);

        // me.setState({data:[]});
        getPlanWk(
            { code: WORKFLOW_CODE.设计成果上报流程 },
            {
                order_by: '-real_start_time',
                ...query,
                status: 3,
                pagination: true,
                page_size: pagination.pageSize,
                page: page
            }
        ).then(response => {
            if (isAuto && me.disableAutoLoad.getValue()) {
                //阻止自动加载
                return;
            }

            let wks = response.data;
            pagination.current = page;
            pagination.total = response.count;
            me.setState({ pagination, wks });
            let data = [],
                changeIds = [],
                drawingCodes = [],
                project,
                unitProject;
            //获取图纸列表
            wks.forEach(wk => {
                let sb = wk.subject[0];
                sb.planitem = JSON.parse(sb.planitem);
                sb.project = JSON.parse(sb.project);
                sb.unit = JSON.parse(sb.unit);
                sb.model_checker = JSON.parse(sb.model_checker);
                sb.drawing_checker = JSON.parse(sb.drawing_checker);
                sb.plan_writer = JSON.parse(sb.plan_writer);
                project = sb.project;
                unitProject = sb.unit;

                let docCode = sb.planitem.id;
                drawingCodes.push(docCode);
            });
            if (query.id && unitProject) {
                me.setState({
                    project: { label: project.name, value: project.code },
                    unitProject: { label: unitProject.name, value: unitProject.code }
                });
            }

            //批量获取图纸
            getDocumentList({}, { key_type: 'code', list: drawingCodes.join() }).then(result => {
                let drs = result.result;
                console.log('getDocumentList: ', drs)
                drs.forEach((dr, i) => {
                    let wk = wks.find(w => w.subject[0].planitem.id === dr.code);
                    let sb = wk.subject[0];
                    sb.design_unit = JSON.parse(sb.design_unit);
                    let action = 0;
                    let changeStatus = dr.extra_params.changeStatus;
                    if (dr.extra_params.changeProcessId) {
                        changeIds.push(dr.extra_params.changeProcessId);
                    }
                    //计算填报权限
                    if (role === 1 && (!changeStatus || changeStatus === 1 || changeStatus === 4)) {
                        //当前人员是否有变更权限
                        if (sb.plan_writer.id === me.curUsr.id) action = role;
                    }
                    //计算是否有审查权限
                    if (role === 2 && changeStatus === 2) {
                        if (sb.model_checker.id === me.curUsr.id || sb.drawing_checker.id === me.curUsr.id) {
                            action = role;
                        }
                    }
                    //计算发起权限
                    if (role === 3 && (changeStatus === 3 || !changeStatus)) {
                        if (isMaster) action = role;
                    }
                    if (dr.extra_params) {
                        let extra = dr.extra_params;
                        const changeHistory = extra.changeHistory
                        extra.xuhao = i + 1;
                        extra.key = dr.code;
                        // extra.processId = wk?wk.id:'';
                        extra.designUint = sb.design_unit.name;
                        extra.action = action;
                        extra.changeType = !changeHistory ?(extra.changeType!=="" ?extra.changeType :'') :changeHistory[changeHistory.length - 1].changeType
                        data[i] = extra;
                    }
                });
                this.setState({ data, drawings: drs });

                //获取变更流程
                if (changeIds.length) {
                    getPlanWk(
                        { code: `${WORKFLOW_CODE.设计成果一般变更流程},${WORKFLOW_CODE.设计成果重大变更流程}` },
                        { id: changeIds.join(), detail: true }
                    ).then(changeWks => {
                        console.log('getPlanWk: ', changeWks)
                        let { data } = me.state;
                        changeWks.forEach(c => {
                            if (c.history.length > 1) {
                                //如果图纸模型审查人都是同一个人跳过检查
                                const current = c.current[0];
                                if (current.participants.length > 1) {
                                    let one = current.participants[0];
                                    let two = current.participants[1];
                                    if (one.executor.id === two.executor.id) {
                                        return;
                                    }
                                }
                                //判断当前用户是否已审查
                                const records = c.history[1].records;
                                const participant = records && records.length ? records[0].participant : null;
                                const executor = participant ? participant.executor : null;
                                if (executor && executor.id === me.curUsr.id) {
                                    //已审查 隐藏审查按钮
                                    let findDrawing = data.find(d => d.key === c.subject[0].drawingId);
                                    if (findDrawing) {
                                        if (findDrawing.changeStatus === 2 && role === 2) {
                                            findDrawing.action = 0;
                                        }
                                    }
                                }
                                // let findDrawing = data.find(d => d.key === c.subject[0].drawingId);
                                // if (findDrawing) {
                                //     if (findDrawing.changeStatus === 2 && role === 2) {
                                //         findDrawing.action = 0;
                                //     }
                                // }
                            }
                        });
                        me.setState({ data });
                    });
                }
            });
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.getReportWK(pagination.current);
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
            this.setState({ query, isFixedWk: true }, () => {
                this.getReportWK(1, isAuto);
            });
        }
        if (isAuto && this.disableAutoLoad.getValue()) return;
        this.setState({ project, unitProject });
    };

    closeReportBox = () => {
        this.setState({ reportVisible: false });
    };

    closeStartBox = () => {
        this.setState({ startVisible: false });
    };

    closeApprovalBox = () => {
        this.setState({ approvalVisible: false });
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
            this.getReportWK(1);
        });
    };

    render() {
        let { project, unitProject } = this.state;
        let { data, pagination } = this.state;
        return (
            <div>
                <Sidebar>
                    <div className="project-tree">
                        <ProjectUnitWrapper
                            {...this.props}
                            onLoad={() => {
                                if (!this.isFixedWk) {
                                    this.setFirstUnit();
                                }
                            }}
                            onSelect={this.selectProject}
                        />
                    </div>
                </Sidebar>
                <Content>
                    <Row>
                        <Col span={24}>
                            <QueryBox
                                {...this.props}
                                project={project}
                                unitProject={unitProject}
                                onQuery={this.queryWks}
                            />
                            <Table
                                size="small"
                                title={this.getTabTit.bind(this)}
                                columns={this.state.columns}
                                pagination={pagination}
                                onChange={this.handleTableChange}
                                dataSource={data}
                            />
                        </Col>
                    </Row>
                    {this.state.reportVisible ? (
                        <Modal
                            title="设计变更填报"
                            visible={this.state.reportVisible}
                            onCancel={this.closeReportBox}
                            footer={null}
                            width="80%"
                        >
                            <ChangeDesignReport
                                project={this.state.project}
                                unit={this.state.unitProject}
                                drawing={this.state.selectedDrawing}
                                onSubmit={() => {
                                    const { project, unitProject } = this.state;
                                    this.closeReportBox();
                                    this.selectProject( project, unitProject );
                                }}
                                onClose={this.closeReportBox}
                                actions={this.props.actions}
                                plan={this.props.plan}
                            />
                        </Modal>
                    ) : (
                        ''
                    )}
                    {this.state.startVisible ? (
                        <Modal
                            title="发起设计变更"
                            visible={this.state.startVisible}
                            onCancel={this.closeStartBox}
                            footer={null}
                            width="80%"
                        >
                            <ChangeDesignStartBox
                                project={this.state.project}
                                unit={this.state.unitProject}
                                drawing={this.state.selectedDrawing}
                                onSubmit={() => {
                                    const { project, unitProject } = this.state;
                                    this.closeStartBox();
                                    this.selectProject( project, unitProject );
                                }}
                                onClose={this.closeStartBox}
                                actions={this.props.actions}
                                plan={this.props.plan}
                            />
                        </Modal>
                    ) : (
                        ''
                    )}
                    {this.state.approvalVisible ? (
                        <Modal
                            title="设计变更审查"
                            visible={this.state.approvalVisible}
                            onCancel={this.closeApprovalBox}
                            footer={null}
                            width="80%"
                        >
                            <ChangeDesignApprovalBox
                                project={this.state.project}
                                unit={this.state.unitProject}
                                drawing={this.state.selectedDrawing}
                                onSubmit={() => {
                                    const { project, unitProject } = this.state;
                                    this.closeApprovalBox();
                                    this.selectProject( project, unitProject );
                                }}
                                onClose={this.closeApprovalBox}
                                actions={this.props.actions}
                                plan={this.props.plan}
                                readonly={this.state.reportReadonly}
                            />
                        </Modal>
                    ) : (
                        ''
                    )}
                </Content>
            </div>
        );
    }
}

export default ChangeDesignContent;
