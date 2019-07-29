import React, { Component } from 'react';
import { WORKFLOW_CODE } from '_platform/api';
import styles from './index.css';
// 进度管理模块
import ScheduleTotalDetail from '../TaskDetail/ScheduleTotalDetail';
import ScheduleTotalRefill from '../TaskDetail/ScheduleTotalRefill';
import ScheduleActualDetail from '../TaskDetail/ScheduleActualDetail';
import ScheduleActualRefill from '../TaskDetail/ScheduleActualRefill';
import ScheduleWeekPlanDetail from '../TaskDetail/ScheduleWeekPlanDetail';
import ScheduleWeekPlanRefill from '../TaskDetail/ScheduleWeekPlanRefill';
export default class Detail extends Component {
    render () {
        const { platform: { task = {} } = {} } = this.props;
        if (task && task.workflow && task.workflow.code) {
            let code = task.workflow.code;
            let name = task.current ? task.current[0].name : '结束';
            if (
                code === WORKFLOW_CODE.总进度计划报批流程 &&
                (name === '审核' || name === '结束')
            ) {
                return <ScheduleTotalDetail {...this.props} {...this.state} />;
            } else if (
                code === WORKFLOW_CODE.每日进度填报流程 &&
                (name === '监理审核' || name === '业主查看' || name === '结束')
            ) {
                return <ScheduleActualDetail {...this.props} {...this.state} />;
            } else if (
                code === WORKFLOW_CODE.每周进度填报流程 &&
                (name === '监理审核' || name === '业主查看' || name === '结束')
            ) {
                return <ScheduleWeekPlanDetail {...this.props} {...this.state} />;
            } else if (
                code === WORKFLOW_CODE.总进度计划报批流程 &&
                name === '填报'
            ) {
                return <ScheduleTotalRefill {...this.props} {...this.state} />;
            } else if (
                code === WORKFLOW_CODE.每日进度填报流程 &&
                name === '施工填报'
            ) {
                return <ScheduleActualRefill {...this.props} {...this.state} />;
            } else if (
                code === WORKFLOW_CODE.每周进度填报流程 &&
                name === '施工填报'
            ) {
                return <ScheduleWeekPlanRefill {...this.props} {...this.state} />;
            } else {
                return <div>待定流程</div>;
            }
        } else {
            return null;
        }
    }
}
