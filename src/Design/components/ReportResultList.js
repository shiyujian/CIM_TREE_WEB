/**
 * Created by tinybear on 17/9/16.
 */
import React, { Component } from 'react';
import { Table, message, Modal, Popover } from 'antd';
import ProjectUnitWrapper from './ProjectUnitWrapper';
import ReportBox from './ReportBox';
import ApprovalResBox from './ApprovalResBox';
import QueryBox from './QueryBox/QueryBox';
import { getUser } from '_platform/auth';
import { Sidebar, Content } from '_platform/components/layout';
import { PDF_FILE_API, WORKFLOW_CODE } from '_platform/api';
import { PAGE_SIZE } from './Const';
import { parseWorkflowId, isDisabledAutoLoad, getPDFFiles } from './util';
// import moment from 'moment';

class ReportResultList extends Component {
    state = {
        data: [],
        project: null,
        unitProject: null,
        reportVisible: false, //上报成果
        approvalVisible: false, //审查成果
        wks: [],
        drawings: [],
        selectedDrawing: null,
        reportReadonly: false,
        pagination: {
            pageSize: PAGE_SIZE,
            current: 1,
            total: 0
        },
        isFixedWk: false,
        query: {},
        columns: [
            { title: '序号', dataIndex: 'xuhao', key: 'xuhao' },
            { title: '卷册编号', dataIndex: 'juance', key: 'juance' },
            { title: '图纸卷册名称', dataIndex: 'name', key: 'name' },
            { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
            { title: '专业', dataIndex: 'profession', key: 'profession' },
            { title: '版本', dataIndex: 'version', key: 'version' },
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
            { title: '成果交付时间', dataIndex: 'deliverTime', key: 'deliverTime' },
            { title: '实际交付时间', dataIndex: 'actualDeliverTime', key: 'actualDeliverTime' },
            // {title: '计划审查时间', dataIndex: 'approvalTime', key: 'approvalTime'},
            // {title: '实际审查时间', dataIndex: 'actualApprovalTime', key: 'actualApprovalTime'},
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return <span>{this.getState(text)}</span>;
                }
            },
            // {title: '归档时间', dataIndex: 'archivingTime', key: 'archivingTime'},
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
                                    href="javascript:;"
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
                                        href="javascript:;"
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
                                        提交
                                    </a>
                                </span>
                                <span className="ant-divider" />
                                <span>
                                    <a
                                        href="javascript:;"
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
                                        href="javascript:;"
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
                                        href="javascript:;"
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
            },
            {
                title: '预览',
                dataIndex: 'PDF',
                key: 'PDF',
                width: 40,
                render: (text, record) => {
                    let pdfs = getPDFFiles(record);
                    if (pdfs.length === 1) {
                        let pdf = pdfs[0];
                        return (
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    let file = Object.assign({}, pdf, { a_file: PDF_FILE_API + pdf.a_file });
                                    this.previewFile(file);
                                }}
                            >
                                预览
                            </a>
                        );
                    }
                    if (pdfs.length > 1) {
                        return (
                            <Popover content={this.genPreview(pdfs)} placement="left">
                                <a href="javascript:;">预览</a>
                            </Popover>
                        );
                    }
                }
            }
        ]
    };

    curUsr = null;
    //防止选择单位工程后执行自动加载
    disableAutoLoad = null;

    genPreview = pdfs => {
        return (
            <div>
                {pdfs.map((pdf, i) => {
                    return (
                        <p key={i}>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    let file = Object.assign({}, pdf, { a_file: PDF_FILE_API + pdf.a_file });
                                    this.previewFile(file);
                                }}
                            >
                                {pdf.name}
                            </a>
                        </p>
                    );
                })}
            </div>
        );
    };
    getTabTit(){
        let TableTit = '';
        switch(this.props.role){
            case 1:
                TableTit = '设计上报';
                break;
            case 2:
                TableTit = '设计审查';
                break;
            default:
                TableTit = '设计成果';
                break;
        }
        return TableTit;
    }
    showDeitail = record => {
        const { drawings } = this.state;
        let drawing = drawings.find(w => w.code === record.key);
        this.setState({ reportReadonly: true, reportVisible: true, selectedDrawing: drawing });
    };

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
                this.getReportWK(1);
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

    previewFile(file) {
        const { openPreview } = this.props.actions;
        openPreview(file);
    }

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
                this.getReportWK(1, isAuto);
            });
        }
        if (isAuto && this.disableAutoLoad.getValue()) return;
        this.setState({ project, unitProject });
    };

    getReportWK(page, isAuto) {
        let me = this;
        const { getPlanWk, getDocumentList } = this.props.actions;
        const { role } = this.props;
        const { pagination, query } = me.state;
        getPlanWk(
            { code: WORKFLOW_CODE.设计成果上报流程 },
            {
                order_by: '-real_start_time',
                ...query,
                pagination: true,
                page_size: pagination.pageSize,
                page: page
            }
        ).then(response => {
            console.log('getPlanWk: ', response);
            if (isAuto && me.disableAutoLoad.getValue()) {
                //阻止自动加载
                return;
            }
            let reportWks = response.data;
            pagination.current = page;
            pagination.total = response.count;
            me.setState({ pagination });
            let data = [],
                drawingCodes = [],
                project,
                unitProject;
            this.setState({ wks: reportWks });
            reportWks.forEach(wk => {
                let sb = wk.subject[0];
                sb.planitem = JSON.parse(sb.planitem);
                sb.project = JSON.parse(sb.project);
                sb.unit = JSON.parse(sb.unit);
                sb.design_unit = JSON.parse(sb.design_unit);
                sb.plans = JSON.parse(sb.plans);
                project = sb.project;
                unitProject = sb.unit;

                let docCode = sb.planitem.id;
                drawingCodes.push(docCode);
            });
            if (query.id && unitProject) {
                this.setState({
                    project: { label: project.name, value: project.code },
                    unitProject: { label: unitProject.name, value: unitProject.code }
                });
            }
            //批量获取图纸
            getDocumentList({}, { key_type: 'code', list: drawingCodes.join() }).then(result => {
                console.log('getDocumentList: ', result);
                let drs = result.result;
                
                drs.forEach((drawing, i) => {
                    let wk = reportWks.find(w => w.subject[0].planitem.id === drawing.code);
                    if (drawing.extra_params) {
                        //判断当前用户是否有审查权限
                        let action = 0;
                        if (wk.current && wk.current.length) {
                            let participant = wk.current.find(cu => {
                                return cu.participants[0].executor.id === me.curUsr.id;
                            });
                            if (participant) {
                                let statuNode = participant.code;
                                if (statuNode === 'START' && role === 1) {
                                    action = role;
                                }
                                if (role === 2) {
                                    if (statuNode === 'STATE02' || statuNode === 'STATE03') {
                                        action = role;
                                    }
                                }
                            }
                        }

                        let extra = drawing.extra_params;
                        extra.xuhao = i + 1;
                        extra.key = drawing.code;
                        extra.processId = wk ? wk.id : '';
                        extra.action = action;
                        data[i] = extra;
                    }
                });
                this.setState({ data, drawings: drs });
            });
        });
    }

    //计算状态
    getState(status) {
        switch (status) {
            case 0:
                return '待提交';
            case 1:
                return '待审查';
            case 2:
                return '已归档';
            case 3:
                return '已审查、待修改';
        }
    }

    //提交审查流程
    submitWorkFlow = (drawing, wk) => {
        console.log('submitWorkFlow: ', drawing);
        let { data, selectedIndex } = this.state;
        let me = this;

        //提交流程
        const { putFlow } = this.props.actions;

        const usr = getUser();
        const executor = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };

        const { id, sbuject, workflow: { states = [] } = {} } = wk;
        const [{ id: state_id }] = states;

        return putFlow(
            { pk: wk.id },
            {
                state: state_id,
                executor: executor,
                action: '提交',
                note: drawing.mark
                // "attachment": null
            }
        ).then(() => {
            //更新上报成果
            const { updatePlan } = this.props.actions;
            drawing.status = 1;
            drawing.action = 0;
            data[selectedIndex] = drawing;
            this.setState({ data });
            updatePlan(
                { code: drawing.key },
                {
                    extra_params: {
                        status: drawing.status,
                        processId: drawing.processId,
                        actualDeliverTime: drawing.actualDeliverTime,
                        approvalTime: drawing.approvalTime,
                        CAD: drawing.CAD || '',
                        BIM: drawing.BIM || '',
                        PDF: drawing.PDF || '',
                        attachmentFile: drawing.attachmentFile || ''
                    }
                }
            ).then(data => {
                me.setState({ reportVisible: false });
                message.success('保存设计成果成功');
            });
        });
    };

    handleTableChange = (pagination, filters, sorter) => {
        this.getReportWK(pagination.current);
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

    updateTableData = drawing => {
        console.log('updateTableData: ', drawing);
        //审查时间 状态
        // let { data } = this.state;
        // let index = data.findIndex(d => d.key === drawing.key);
        // if (index) {
        //     data[index].status = drawing.status;
        //     data[index].actualApprovalTime = drawing.actualApprovalTime;
        //     data[index].action = drawing.action;
        //     this.setState({ data });
        //     this.forceUpdate();
        // }

        const { project,unitProject } = this.state;
        this.selectProject(project,unitProject);
    };

    render() {
        let { project, unitProject, pagination } = this.state;
        console.log('selectedDrawing: ', this.state.selectedDrawing);
        return (
            <div>
                <Sidebar>
                    <div className="project-tree">
                        <ProjectUnitWrapper
                            {...this.props}
                            onSelect={this.selectProject}
                            onLoad={() => {
                                if (!this.state.isFixedWk) {
                                    this.setFirstUnit();
                                }
                            }}
                        />
                    </div>
                </Sidebar>
                <Content>
                    <QueryBox {...this.props} project={project} unitProject={unitProject} onQuery={this.queryWks} />
                    <Table
                        size="small"
                        title={this.getTabTit.bind(this)}
                        pagination={pagination}
                        columns={this.state.columns}
                        onChange={this.handleTableChange}
                        rowKey="key"
                        dataSource={this.state.data}
                    />
                    {this.state.reportVisible ? (
                        <Modal
                            title="设计成果填报"
                            visible={this.state.reportVisible}
                            onCancel={() => {
                                this.setState({ reportVisible: false });
                            }}
                            footer={null}
                            width="80%"
                        >
                            <ReportBox
                                project={this.state.project}
                                unit={this.state.unitProject}
                                drawing={this.state.selectedDrawing}
                                onSubmit={this.submitWorkFlow}
                                actions={this.props.actions}
                                readonly={this.state.reportReadonly}
                                plan={this.props.plan}
                            />
                        </Modal>
                    ) : (
                        ''
                    )}
                    {this.state.approvalVisible ? (
                        <Modal
                            title="设计成果审查"
                            visible={this.state.approvalVisible}
                            onCancel={() => {
                                this.setState({ approvalVisible: false });
                            }}
                            footer={null}
                            width="80%"
                        >
                            <ApprovalResBox
                                project={this.state.project}
                                unit={this.state.unitProject}
                                drawing={this.state.selectedDrawing}
                                onClose={() => {
                                    this.setState({ approvalVisible: false });
                                }}
                                updateTableData={this.updateTableData}
                                actions={this.props.actions}
                                readonly={this.state.reportReadonly}
                                plan={this.props.plan}
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

export default ReportResultList;
