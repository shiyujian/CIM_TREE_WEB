import React, { Component } from 'react';
import { Table, Input, Row, Col, Card, Select, DatePicker, Popconfirm, notification, Button, Form, message } from 'antd';
import { WORKFLOW_MAPS, WORKFLOW_CODE,SOURCE_API,STATIC_DOWNLOAD_API } from '_platform/api';
import styles from './index.css';
import moment from 'moment';
import PerSearch from '../../../Overall/components/FormManage/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
import OverallGeneralDetail from '../TaskDetail/OverallGeneralDetail';
import OverallResourceDetail from '../TaskDetail/OverallResourceDetail';
import ScheduleTotalDetail from '../TaskDetail/ScheduleTotalDetail';
import ScheduleStageDetail from '../TaskDetail/ScheduleStageDetail';
import ScheduleDayDetail from '../TaskDetail/ScheduleDayDetail';
import OverallGeneralRefill from '../TaskDetail/OverallGeneralRefill';
import OverallResourceRefill from '../TaskDetail/OverallResourceRefill';

const FormItem = Form.Item;
export default class Detail extends Component {
	render() {
		const { platform: { task = {} } = {} } = this.props;
		if (task && task.workflow && task.workflow.code) {
			console.log('task', task)
			let code = task.workflow.code
			let name = task.current ? task.current[0].name : '';

			console.log('code',code)
			console.log('WORKFLOW_CODE.每日进度计划填报流程',WORKFLOW_CODE.每日进度计划填报流程)
			console.log('WORKFLOW_CODE.工程材料报批流程',WORKFLOW_CODE.工程材料报批流程)
			console.log('WORKFLOW_CODE.苗木资料报批流程',WORKFLOW_CODE.苗木资料报批流程)
			console.log('name',name)

			if(code === WORKFLOW_CODE.总进度计划报批流程 && (name == '初审' || name == '复审')){
				return (
					<ScheduleTotalDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度填报流程 && (name == '初审' || name == '复审')){
				return (
					<ScheduleStageDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.每日进度计划填报流程 && (name == '初审' || name == '复审')){
				return (
					<ScheduleDayDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.机械设备报批流程 && (name == '初审' || name == '复审')){
				return (
					<OverallGeneralDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.工程材料报批流程 && (name == '初审' || name == '复审')){
				return (
					<OverallResourceDetail {...this.props} {...this.state}/>
				)
			}else if (code === WORKFLOW_CODE.苗木资料报批流程 && (name == '初审' || name == '复审')){
				return (
					<OverallResourceDetail {...this.props} {...this.state}/>
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
			}else {
				return <div>待定流程</div>
			}
		} else {
			return null
		}
	}
	
}
