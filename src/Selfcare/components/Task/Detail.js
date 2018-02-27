import React, { Component } from 'react';
import { Table, Input, Row, Col, Card, Select, DatePicker, Popconfirm, notification, Button, Form, message } from 'antd';
import { WORKFLOW_MAPS, WORKFLOW_CODE,SOURCE_API,STATIC_DOWNLOAD_API } from '_platform/api';
import styles from './index.css';
import moment from 'moment';
import PerSearch from '../Task/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
//综合管理模块 物资管理
import OverallGeneralDetail from '../TaskDetail/OverallGeneralDetail';
import OverallResourceDetail from '../TaskDetail/OverallResourceDetail';
import OverallGeneralRefill from '../TaskDetail/OverallGeneralRefill';
import OverallResourceRefill from '../TaskDetail/OverallResourceRefill';
//综合管理模块 表单管理
import OverallFormDetail from '../TaskDetail/OverallFormDetail';
import OverallFormRefill from '../TaskDetail/OverallFormRefill';
//进度管理模块
import ScheduleTotalDetail from '../TaskDetail/ScheduleTotalDetail';
import ScheduleTotalRefill from '../TaskDetail/ScheduleTotalRefill';
import ScheduleDayDetail from '../TaskDetail/ScheduleDayDetail';
import ScheduleDayRefill from '../TaskDetail/ScheduleDayRefill';
import ScheduleStageDetail from '../TaskDetail/ScheduleStageDetail';
import ScheduleStageRefill from '../TaskDetail/ScheduleStageRefill';
//质量管理模块
import QulityCheckDetail from '../TaskDetail/QulityCheckDetail';
import QulityCheckRefill from '../TaskDetail/QulityCheckRefill';


const FormItem = Form.Item;
export default class Detail extends Component {
	render() {
		const { platform: { task = {} } = {} } = this.props;
		if (task && task.workflow && task.workflow.code) {
			console.log('task', task)
			let code = task.workflow.code
			let name = task.current ? task.current[0].name : '结束';

			console.log('吾问无为谓无无无无无无无无无无无无无无无无无无无无无无无无无无无无code',code)
			console.log('WORKFLOW_CODE.每日进度计划填报流程',WORKFLOW_CODE.每日进度计划填报流程)
			console.log('WORKFLOW_CODE.工程材料报批流程',WORKFLOW_CODE.工程材料报批流程)
			console.log('WORKFLOW_CODE.苗木资料报批流程',WORKFLOW_CODE.苗木资料报批流程)
			console.log('name',name)

			if(code === WORKFLOW_CODE.总进度计划报批流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<ScheduleTotalDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度计划填报流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<ScheduleDayDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度填报流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<ScheduleStageDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.机械设备报批流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<OverallGeneralDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.工程材料报批流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<OverallResourceDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.苗木资料报批流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<OverallResourceDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.表单管理流程 && (name == '初审' || name == '复审' || name == '结束')){
				return (
					<OverallFormDetail {...this.props} {...this.state}/>
				)
			}else if(code === WORKFLOW_CODE.检验批验收审批流程 && (name == '审核' || name == '结束')){
				return (
					<QulityCheckDetail {...this.props} {...this.state} />
				)
			}else if (code === WORKFLOW_CODE.机械设备报批流程 && name == '填报'){
				return (
					<OverallGeneralRefill {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.工程材料报批流程 && name == '填报'){
				return (
					<OverallResourceRefill {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.苗木资料报批流程 && name == '填报'){
				return (
					<OverallResourceRefill {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.总进度计划报批流程 && name == '填报'){
				return (
					<ScheduleTotalRefill {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度计划填报流程 && name == '填报'){
				return (
					<ScheduleDayRefill {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度填报流程 && name == '填报'){
				return (
					<ScheduleStageRefill {...this.props} {...this.state}/>
				)
			}else if(code === WORKFLOW_CODE.检验批验收审批流程 && name === '填报'){
				return (
					<QulityCheckRefill {...this.props} {...this.state} />
				)
			}else if(code === WORKFLOW_CODE.表单管理流程 && name === '填报'){
				return (
					<OverallFormRefill {...this.props} {...this.state} />
				)
			}else {
				return <div>待定流程</div>
			}
		} else {
			return null
		}
	}
	
}
