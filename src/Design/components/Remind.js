/**
 * Created by tinybear on 17/8/15.
 */

import React, { Component } from 'react';
import { Row, Col, Radio, Table, message } from 'antd';
import ProjectUnitWrapper from './ProjectUnitWrapper';
import { PAGE_SIZE } from './Const';
import moment from 'moment';
import { Sidebar, Content } from '_platform/components/layout';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DesignRemindPanel extends Component {
    state = {
        project: null,
        unit: null,
        selectedTab: '1',
        project: '',
        unitProject: '',
        data: [],
        loading: false,
        columns: null,
        pagination: {
            pageSize: PAGE_SIZE,
            current: 1,
            total: 0
        },
        newdocument: []
    };

    columns1 = [
        { title: '序号', dataIndex: 'on', key: 'xuhao' },
        { title: '图纸卷册编号', dataIndex: 'juance', key: 'juance' },
        { title: '图纸卷册名称', dataIndex: 'name', key: 'name' },
        { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
        { title: '专业', dataIndex: 'profession', key: 'profession' },
        { title: '当前版本', dataIndex: 'version', key: 'version' },
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
                if (!text) return '';
                return text.person_name ? text.person_name : text;
            }
        },
        { title: '计划交付时间', dataIndex: 'deliverTime', key: 'deliverTime' },
        { title: '剩余时间(天数)', dataIndex: 'ltime', key: 'ltime' }
    ];

    columns2 = [
        { title: '序号', dataIndex: 'on', key: 'xuhao' },
        { title: '图纸卷册编号', dataIndex: 'juance', key: 'juance' },
        { title: '图纸卷册名称', dataIndex: 'name', key: 'name' },
        { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
        { title: '专业', dataIndex: 'profession', key: 'profession' },
        { title: '当前版本', dataIndex: 'version', key: 'version' },
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
                if (!text) return '';
                return text.person_name ? text.person_name : text;
            }
        },
        // {title:'项目负责人',dataIndex:'projectPrincipal',key:'projectPrincipal'},
        // {title:'专业负责人',dataIndex:'professionPrincipal',key:'professionPrincipal'},
        { title: '计划交付时间', dataIndex: 'deliverTime', key: 'deliverTime' },
        { title: '逾期时间(天数)', dataIndex: 'ltime', key: 'ltime' }
    ];

    columns3 = [
        { title: '序号', dataIndex: 'on', key: 'xuhao' },
        { title: '卷册编号', dataIndex: 'juance', key: 'juance' },
        { title: '卷册名称', dataIndex: 'name', key: 'name' },
        { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
        { title: '专业', dataIndex: 'profession', key: 'profession' },
        {
            title: '设计阶段',
            dataIndex: 'stage',
            key: 'stage',
            render: text => {
                const { designStageEnum } = this.props.plan;
                if (!text) return '';
                else return designStageEnum[text];
            }
        },
        { title: '当前版本', dataIndex: 'version', key: 'version' },
        { title: '审查单位', dataIndex: 'approvalUnit', key: 'approvalUnit' },
        { title: '审查负责人', dataIndex: 'approvalPrincipal', key: 'approvalPrincipal' },
        { title: '审查内容', dataIndex: 'approvalContent', key: 'approvalContent' },
        { title: '审查时间', dataIndex: 'approvalTime', key: 'approvalTime' },
        { title: '剩余时间', dataIndex: 'ltime', key: 'ltime' }
    ];

    columns4 = [
        { title: '序号', dataIndex: 'on', key: 'xuhao' },
        { title: '卷册编号', dataIndex: 'juance', key: 'juance' },
        { title: '卷册名称', dataIndex: 'name', key: 'name' },
        { title: '设计模型名称', dataIndex: 'modelName', key: 'modelName' },
        { title: '专业', dataIndex: 'profession', key: 'profession' },
        // {title:'设计阶段',dataIndex:'stage',key:'stage'},
        {
            title: '设计阶段',
            dataIndex: 'stage',
            key: 'stage',
            render: text => {
                const { designStageEnum } = this.props.plan;
                if (!text) return '';
                else return designStageEnum[text];
            }
        },
        { title: '当前版本', dataIndex: 'version', key: 'version' },
        { title: '审查单位', dataIndex: 'approvalUnit', key: 'approvalUnit' },
        { title: '审查负责人', dataIndex: 'approvalPrincipal', key: 'approvalPrincipal' },
        { title: '审查内容', dataIndex: 'approvalContent', key: 'approvalContent' },
        { title: '审查时间', dataIndex: 'approvalTime', key: 'approvalTime' },
        { title: '逾期时间', dataIndex: 'ltime', key: 'ltime' }
    ];

    componentWillMount() {
        this.setState({ columns: this.columns1 });
        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    setTable = selectedTab => {
        switch (selectedTab) {
            case '1':
                this.setState({ columns: this.columns1 });
                break;
            case '2':
                this.setState({ columns: this.columns2 });
                break;
            case '3':
                this.setState({ columns: this.columns3 });
                break;
            case '4':
                this.setState({ columns: this.columns4 });
                break;
        }
    };

    onTypeChange = e => {
        //获取对应的流程
        this.setState({ selectedTab: e.target.value }, () => {
            if (this.state.unit) {
                let query = this.getQuery();
                this.getRemiandData(query);
            }
        });
        this.setTable(e.target.value);
    };

    getQuery() {
        const { unit = {} } = this.state;
        const { selectedTab } = this.state;
        const { pagination } = this.state;
        let pageQuery = {
            pagination: 'true',
            page_size: PAGE_SIZE,
            page: pagination.current
        };
        let query = null;
        switch (selectedTab) {
            case '1':
                //近期待交付
                query = {
                    state_code: 'START',
                    subject_unit__contains: unit.pk,
                    state_deadline_lte: moment()
                        .add(7, 'days')
                        .format('YYYY-MM-DD'),
                    state_deadline_gte: moment().format('YYYY-MM-DD')
                };
                break;
            case '2':
                //逾期交付
                query = {
                    state_code: 'START',
                    subject_unit__contains: unit.pk,
                    // state_deadline_gte:moment().format('YYYY-MM-DD'),
                    state_deadline_lte: moment()
                        .add(-1, 'days')
                        .format('YYYY-MM-DD')
                };
                break;
            case '3':
                //近期待审查
                query = {
                    state_code: 'STATE02,STATE03',
                    subject_unit__contains: unit.pk,
                    state_deadline_lte: moment()
                        .add(7, 'days')
                        .format('YYYY-MM-DD'),
                    state_deadline_gte: moment().format('YYYY-MM-DD')
                };
                break;
            case '4':
                //逾期审查
                query = {
                    state_code: 'STATE02,STATE03',
                    subject_unit__contains: unit.pk,
                    state_deadline_lte: moment()
                        .add(-1, 'days')
                        .format('YYYY-MM-DD')
                };
                break;
            default:
                query = {
                    state_code: 'START',
                    subject_unit__contains: unit.pk,
                    state_deadline_lte: moment()
                        .add(7, 'days')
                        .format('YYYY-MM-DD'),
                    state_deadline_gte: moment().format('YYYY-MM-DD')
                };
        }
        query = Object.assign({}, query, pageQuery);
        return query;
    }

    getRemiandData = query => {
        const { getNearWK, getdocument } = this.props.actions;
        const { pagination = {}, selectedTab } = this.state;
        let ids = [];
        this.setState({ loading: true });
        getNearWK({}, query).then(wks => {
            pagination.current = wks.page;
            pagination.total = wks.count;
            this.setState({ pagination });
            wks.data.map(rst => {
                rst.workflowactivity.subject.map(col => {
                    ids.push(JSON.parse(col.planitem).id);
                });
            });
            let id = ids.toString();
            getdocument({}, { key_type: 'code', list: id }).then(rst => {
                let newdocument = rst.result;
                let lastWkId = null;
                let data = newdocument.map((item, index) => {
                    let sb = item.extra_params;
                    const { processId } = sb;
                    let wk = wks.data.find(v => v.workflowactivity.id === processId);
                    // console.log('sb: ', sb);
                    sb.on = index + 1;
                    sb.key = index + 1;
                    if (wk) {
                        let subject = wk.workflowactivity.subject[0];
                        if (typeof subject.modal_ch_unit !== 'object') {
                            subject.modal_ch_unit = JSON.parse(subject.modal_ch_unit);
                            subject.drawing_ch_unit = JSON.parse(subject.drawing_ch_unit);
                            subject.drawing_checker = JSON.parse(subject.drawing_checker);
                            subject.model_checker = JSON.parse(subject.model_checker);
                        }
                        sb.stage = subject.stage;
                        sb.ltime = 0;
                        //审查处理 计算审查内容

                        // const deadline = wk.state.deadline || moment()

                        if (selectedTab === '3' || selectedTab === '4') {
                            let { current } = wk.workflowactivity;
                            if (current.length === 1) {
                                sb.approvalContent = current[0].code === 'STATE02' ? '图纸' : '模型';
                            }
                            if (current.length === 2) {
                                if (lastWkId === processId) {
                                    sb.approvalContent = current[0].code === 'STATE02' ? '图纸' : '模型';
                                } else {
                                    sb.approvalContent = current[1].code === 'STATE02' ? '图纸' : '模型';
                                }
                            }
                            if (sb.approvalContent === '图纸') {
                                sb.approvalUnit = subject.drawing_ch_unit.name;
                                sb.approvalPrincipal = subject.drawing_checker.person_name;
                                sb.approvalTime = subject.drawingReviewTime;
                            }
                            if (sb.approvalContent === '模型') {
                                sb.approvalUnit = subject.modal_ch_unit.name;
                                sb.approvalPrincipal = subject.model_checker.person_name;
                                sb.approvalTime = subject.modalReviewTime;
                            }

                            if (selectedTab === '3') {
                                sb.ltime = moment(sb.approvalTime).diff(moment(), 'days')
                                // sb.ltime = moment(deadline).diff(moment(), 'days')
                            }

                            //超期天数
                            if (selectedTab === '4') {
                                sb.ltime = moment().diff(moment(sb.approvalTime), 'days')
                                // sb.ltime = moment().diff(moment(deadline), 'days')
                            }

                            lastWkId = processId;
                        }
                        if (selectedTab === '1') {
                            sb.ltime = moment(sb.deliverTime).diff(moment(), 'days')
                            // sb.ltime = moment(deadline).diff(moment(), 'days')
                        }
                        if (selectedTab === '2') {
                            sb.ltime = moment().diff(moment(sb.deliverTime), 'days')
                            // sb.ltime = moment().diff(moment(deadline), 'days')
                        }
                    }
                    return sb;
                });

                this.setState({ loading: false, newdocument: data });
            });
        });
    };

    handleTableChange = pagination => {
        console.log(pagination);
        this.setState({ pagination }, () => {
            let query = this.getQuery();
            this.getRemiandData(query);
        });
    };

    selectProject = (project, unit) => {
        if (!unit) {
            message.success('请选择单位工程');
            return;
        }
        this.setState({ project, unit }, () => {
            let query = this.getQuery();
            this.getRemiandData(query);
        });
    };

    render() {
        const { project, unit, loading } = this.state;
        const { newdocument = [], pagination = {} } = this.state;
        return (
            <div>
                <Sidebar>
                    <div className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.selectProject} />
                    </div>
                </Sidebar>
                <Content>
                    <Row>
                        <Col span={24}>
                            <div>
                                <RadioGroup
                                    defaultValue="1"
                                    size="large"
                                    style={{ marginBottom: '10px' }}
                                    onChange={this.onTypeChange}
                                >
                                    <RadioButton value="1">近期待交付</RadioButton>
                                    <RadioButton value="2">逾期交付</RadioButton>
                                    <RadioButton value="3">近期待审查</RadioButton>
                                    <RadioButton value="4">逾期待审查</RadioButton>
                                </RadioGroup>
                                <Row style={{ marginBottom: 10 }}>
                                    <Col span={12}>
                                        <label>项目名称:</label>
                                        <span>{project ? project.label : ''}</span>
                                    </Col>
                                    <Col span={12}>
                                        <label>单位工程:</label>
                                        <span>{unit ? unit.label : ''}</span>
                                    </Col>
                                </Row>
                                <div>
                                    <Table
                                        columns={this.state.columns}
                                        size="small"
                                        dataSource={newdocument}
                                        {...this.props}
                                        onChange={this.handleTableChange}
                                        pagination={pagination}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </div>
        );
    }
}

export default DesignRemindPanel;
