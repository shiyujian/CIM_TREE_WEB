import React, { Component } from 'react';
import {
    Form
} from 'antd';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { WORKFLOW_CODE } from '_platform/api';
// 进度管理
import ScheduleTotalDeal from '../TaskDetail/ScheduleTotalDeal';
import ScheduleActualHandle from '../TaskDetail/ScheduleActualHandle';
import ScheduleActualDeal from '../TaskDetail/ScheduleActualDeal';
import ScheduleWeekPlanHandle from '../TaskDetail/ScheduleWeekPlanHandle';
import ScheduleWeekPlanDeal from '../TaskDetail/ScheduleWeekPlanDeal';

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
        const { task } = this.props;
        const { workflow: { code } = {} } = task;
        let stateName = task.current ? task.current[0].name : '';

        if (
            code === WORKFLOW_CODE.总进度计划报批流程 &&
            stateName === '审核'
        ) {
            return <ScheduleTotalDeal {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每日进度填报流程 &&
            stateName === '监理审核'
        ) {
            return <ScheduleActualHandle {...this.props} {...this.state} />;
        } else if (
            code === WORKFLOW_CODE.每日进度填报流程 &&
            stateName === '业主查看'
        ) {
            return <ScheduleActualDeal {...this.props} {...this.state} />;
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
        } else {
            return (
                null
            );
        }
    }
}
