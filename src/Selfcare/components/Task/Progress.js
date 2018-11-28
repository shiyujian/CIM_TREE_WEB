import React, { Component } from 'react';
import {
    Form
} from 'antd';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { WORKFLOW_CODE } from '_platform/api';
// 物资管理
import OverallMaterialDeal from '../TaskDetail/OverallMaterialDeal';

// 表单管理
import OverallDirectorFormDeal from '../TaskDetail/OverallDirectorFormDeal';
import OverallNormalFormDeal from '../TaskDetail/OverallNormalFormDeal';
import OverallReviewFormHandle from '../TaskDetail/OverallReviewFormHandle';
import OverallReviewFormDeal from '../TaskDetail/OverallReviewFormDeal';
// 进度管理
import ScheduleTotalDeal from '../TaskDetail/ScheduleTotalDeal';
import ScheduleDayDeal from '../TaskDetail/ScheduleDayDeal';
import ScheduleStageDeal from '../TaskDetail/ScheduleStageDeal';
import ScheduleWeekPlanHandle from '../TaskDetail/ScheduleWeekPlanHandle';
import ScheduleWeekPlanDeal from '../TaskDetail/ScheduleWeekPlanDeal';
// 质量管理
import QulityCheckDetail from '../TaskDetail/QulityCheckDetail';
import QulityCheckDeal from '../TaskDetail/QulityCheckDeal';
// 安全管理
import SafetySystemHandle from '../TaskDetail/SafetySystemHandle';
import SafetySystemDeal from '../TaskDetail/SafetySystemDeal';
const FormItem = Form.Item;
@connect(
    state => {
        const { selfcare: { task = {} } = {}, platform } = state || {};
        return { ...task, platform };
    },
    dispatch => ({})
)
export default class Progress extends Component {
    constructor (props) {
        super(props);
        this.state = {
            action: '',
            note: '',
            wk: {}
        };
    }

    render () {
        const { state = {}, task, location, states = [] } = this.props;
        const { actions = [] } = state;
        const { workflow: { code } = {}, id, name, subject = [] } = task;
        const { state_id = '0' } = queryString.parse(location.search) || {};
        const currentStates =
            states.find(state => state.id === +state_id) || {};
        const currentStateCode = currentStates.code;
        let stateName = task.current ? task.current[0].name : '';

        if (code === WORKFLOW_CODE.机械设备报批流程 && stateName === '审核') {
            return <OverallMaterialDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.工程材料报批流程 &&
            stateName === '审核'
        ) {
            return <OverallMaterialDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.苗木资料报批流程 &&
            stateName === '审核'
        ) {
            return <OverallMaterialDeal {...this.props} {...this.state} />;
        } else if (code === WORKFLOW_CODE.普通审查流程 && stateName === '审核') {
            return <OverallNormalFormDeal {...this.props} {...this.state} />;
        } else if (code === WORKFLOW_CODE.总监审查流程 && stateName === '审核') {
            return <OverallDirectorFormDeal {...this.props} {...this.state} />;
        } else if (code === WORKFLOW_CODE.审查核定流程 && stateName === '初审') {
            return <OverallReviewFormHandle {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.安全体系报批流程 &&
            stateName === '初审'
        ) {
            return <SafetySystemHandle {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.总进度计划报批流程 &&
            stateName === '审核'
        ) {
            return <ScheduleTotalDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每日进度计划填报流程 &&
            stateName === '审核'
        ) {
            return <ScheduleDayDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每日进度填报流程 &&
            stateName === '审核'
        ) {
            return <ScheduleStageDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每周进度填报流程 &&
            stateName === '监理审核'
        ) {
            return <ScheduleWeekPlanHandle {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每周进度填报流程 &&
            stateName === '业主查看'
        ) {
            return <ScheduleWeekPlanDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.检验批验收审批流程 &&
            stateName === '审核'
        ) {
            return <QulityCheckDeal {...this.props} {...this.state} />;
        } else if (code === WORKFLOW_CODE.审查核定流程 && stateName === '复审') {
            return <OverallReviewFormDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.安全体系报批流程 &&
            stateName === '复审'
        ) {
            return <SafetySystemDeal {...this.props} {...this.state} />;
        } else {
            return (
                null
            );
        }
    }
}
