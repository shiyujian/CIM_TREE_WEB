import React, {Component} from 'react';
import {Table,Input,Row,Col} from 'antd';
import {WORKFLOW_MAPS,WORKFLOW_CODE} from '_platform/api';
import styles from './index.css';
export default class Detail extends Component {

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 20},
	};

	render() {
		const {platform: {task = {}} = {}} = this.props;
		if(task && task.workflow && task.workflow.code){
			let code = task.workflow.code
			switch (code) {
				case WORKFLOW_CODE.施工包划分填报流程:
					return this.renderPackage(task);
				case WORKFLOW_CODE.申请推迟总进度计划填报流程:
					return this.renderDelay(task);
				default:
					return <div>待定流程</div>
			}
		}else{
			return null
		}
	}

	renderDelay(task = {}){
		let project = {};
		let unit = {};
		let oldReportTime = '';
		let delayReportTime = '';
		let remark = '';
		if(task.subject){
			let subject = task.subject[0]
			project = subject.itemProject?JSON.parse(subject.itemProject):'';
			unit = subject.unit?JSON.parse(subject.unit):'';
			oldReportTime = subject.oldReportTime?JSON.parse(subject.oldReportTime):'';
			delayReportTime = subject.delayReportTime?JSON.parse(subject.delayReportTime):'';
			remark = subject.remark?JSON.parse(subject.remark):'';
		}
		return (
			<div>
				<h3>申请推迟填报流程详情</h3>
				<Row style={{marginTop:'10',marginBottom:'10'}}>
					<Col span={12}>
						<label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">项目:</label>
						<div className='start_input'>
							<label >{project.name?project.name:''}</label>
						</div>
					</Col>
					<Col span={12}>
						<label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">单位工程:</label>
						<div className='start_input'>
							<label >{unit.name?unit.name:''}</label>
						</div>
					</Col>
				</Row>
				<Row style={{marginTop:'10',marginBottom:'10'}}>
					<Col span={12}>
						<label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">原计划填报时间:</label>
						<div className='create_select'>
							<label >{oldReportTime}</label>
						</div>
					</Col>
					<Col span={12}>
						<label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">现申请变更时间:</label>
						<div className='create_select'>
							<label >{delayReportTime}</label>
						</div>
					</Col>
				</Row>
				<Row style={{marginTop:'10',marginBottom:'10'}}>
					<Col span={24}>
						<label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">申请变更理由:</label>
						<div className='start_input'>
							<Input 
							id='remark'
							type="textarea" 
							value={remark}
							disabled={true}
							autosize={{minRows:4}} 
							/>
						</div>
					</Col>
				</Row>
			</div>)
	}

	renderPackage(task = {}) {
		const {subject: [pkg = {}] = []} = task;
		let {project = {}, unit = {}, tablesData = []} = pkg || {};
		if (typeof project === 'string') {
			project = JSON.parse(project);
		}
		if (typeof unit === 'string') {
			unit = JSON.parse(unit);
		}
		if (typeof tablesData === 'string') {
			tablesData = JSON.parse(tablesData);
		}
		return (
			<div>
				<h3 style={{marginBottom: 4}}>填报施工包详情</h3>
				<div style={{color: "#999999", marginBottom: 10}}>
					<span>项目：{project.name}</span>
					<span style={{paddingLeft: 20}}>单位工程：{unit.name}</span>
				</div>
				<Table rowKey="code" columns={this.packageColumns} dataSource={tablesData}/>
			</div>)
	}

	packageColumns = [{
		title: '分部',
		dataIndex: 'ptr'
	}, {
		title: '子分部',
		dataIndex: 'ptr_s'
	}, {
		title: '分项',
		dataIndex: 'itm'
	}]
}
