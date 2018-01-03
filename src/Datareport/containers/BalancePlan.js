/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DynamicTitle, Content } from '_platform/components/layout';
import { Button, Input, Table, Modal, Select, Form, Upload, Icon, Row, Col, Radio, bordered, message, Progress } from 'antd';
import { WORKFLOW_CODE, NODE_FILE_EXCHANGE_API, DataReportTemplate_SettlementPlan} from '_platform/api.js';
import { getUser } from '_platform/auth';
import { actions } from '../store/SumPlanCost';
import { actions as platformActions } from '_platform/store/global';
import { SumPlan } from '../components/CostListData';
import { SumPlanDelate } from '../components/CostListData';
import { SumPlanChange } from '../components/CostListData';
import { getNextStates } from '_platform/components/Progress/util';
const Search = Input.Search;
var moment = require('moment');
@connect(
	state => {
		const { datareport: { SumPlanCost = {} } = {}, platform } = state;
		return { ...SumPlanCost, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)

export default class BanlancePlan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			lanchReapt: false,
			lanchChange: false,
			lanchdelate: false,
			loading:false,
			percent:0,
			dataSource: [],
			dataSourceSelected:[],
            selectedRowKeys: []
		};
	}
	submit() {
		this.setState({ lanchReapt: true })
	}
	examine() {
		this.setState({ lanchChange: true }) 
	}
	 generateTableData(data) {
		 let dataSour = [];
		data.map((item,key) => {
			let datas = {
				key:key+1,
				subproject: item.extra_params.project.name,
				unit: item.extra_params.unit.name || item.extra_params.unit,
				nodetarget: item.extra_params.nodetarget,
				completiontime: item.extra_params.completiontime,
				summoney: item.extra_params.summoney,
				ratio: item.extra_params.ratio,
				remarks: item.extra_params.remarks,
				code:item.code
			}
			dataSour.push(datas)
		})
		this.setState({
			dataSource:dataSour,
			showDat:dataSour
		})
	}

	componentDidMount(){
		const {actions:{ getExBySearch }}=this.props;
		this.setState({loading:true,percent:0})
		getExBySearch().then(rst=>{
			this.setState({loading:false,percent:100})
			this.generateTableData(rst.result)
		})
	}
	lanchOk(data, participants) {
		//批量上传回调
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "结算计划信息填报",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "结算计划信息填报",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: '发起填报',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					this.setState({ lanchReapt: false });
					message.success('发起流程成功')					
				})
		})

	}
	delateOk(data, participants) {
		//批量上传回调
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "结算计划信息删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "结算计划信息删除",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: '发起填报',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					this.setState({ lanchdelate: false });
					message.success('发起流程成功')
				})
		})

	}
	changeOk(data, participants) {
		//批量上传回调
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "结算计划信息变更",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "结算计划信息变更",
			subject: [{
				data: JSON.stringify(data)
			}],
			creator: creator,
			plan_start_time: moment(new Date()).format('YYYY-MM-DD'),
			deadline: null,
			status: "2"
		}
		createWorkflow({}, postdata).then((rst) => {
			let nextStates = getNextStates(rst, rst.current[0].id);
			logWorkflowEvent({ pk: rst.id },
				{
					state: rst.current[0].id,
					action: '提交',
					note: '发起填报',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					this.setState({ lanchChange: false });
					message.success('发起流程成功')
				})
		})

	}

	onSelectChange = (selectedRowKeys, selectedRows) => {
        // const {dataSource} = this.state;
        // let dataSourceSelected = [];
        // for(let i=1;i<selectedRowKeys.length;i++){
        //     dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        // }
        this.setState({selectedRowKeys,dataSourceSelected:selectedRows});
	}


	// 模板下载
	getTemplate(){
		this.createLink('结算计划模板',DataReportTemplate_SettlementPlan)
	}

	//文件下载;
	createLink = (name,url) =>{
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download',this);
		link.setAttribute('target','_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}



	// 表格导出
	getExcel(){
		if(this.state.dataSourceSelected.length <=0){
			message.warning('请先选择要导出的数据');
			return
		}
		const { actions:{jsonToExcel}} = this.props;
		const {dataSourceSelected} = this.state;
		let rows = [];
		rows.push(["项目/子项目名称","单位工程","工作节点目标","完成时间","支付金额(万元)","累计占比","备注"]);
		dataSourceSelected.map(item =>{
			rows.push([
				item.subproject,
				item.unit,
				item.nodetarget,
				item.completiontime,
				item.summoney,
				item.ratio,
				item.remarks
			])
		})
		jsonToExcel({},{rows:rows}).then(
			rst=>{
				this.createLink('name',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
			}
		)
	}

	// 分页
	paginationOnChange(page,pageSize){
		console.log('page',page,pageSize);
	}
	render() {
		// 页面数据条数选择;
		const paginationInfo = {
			onChange: this.paginationOnChange.bind(this),
			showSizeChanger: true,
			pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
			showQuickJumper: true,
		}
		// 表格左侧选中数据
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const columns = [{
			title: '序号',
			dataIndex: 'key'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'subproject',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '工作节点目标',
			dataIndex: 'nodetarget',
		}, {
			title: '完成时间',
			dataIndex: 'completiontime',
		}, {
			title: '支付金额（万元）',
			dataIndex: 'summoney',
		}, {
			title: '累计占比',
			dataIndex: 'ratio',
		}, {
			title: '备注',
			dataIndex: 'remarks',
			render:(text,record,index)=>{
			  return record.remarks ?record.remarks :'—'
			}
		}]
		return (
			<div>
				<DynamicTitle title="结算计划" {...this.props} />
				<Content>
					<Row>
						<Button style={{ margin: '10px 10px 10px 0px' }} type="default" onClick={this.getTemplate.bind(this)}>模板下载</Button>
						<Button className="btn" type="default" onClick={() => { this.setState({ lanchReapt: true }) }}>批量导入</Button>
						<Button className="btn" type="default" onClick={() => { 
							if(this.state.dataSourceSelected.length <=0){
								message.warning('请选择要变更的数据');
								return
							}
							this.setState({ lanchChange: true }) }}>申请变更</Button>
						<Button className="btn" type="default" onClick={() => { 
							if(this.state.dataSourceSelected.length <=0){
								message.warning('请选择要删除的数据');
								return
							}
							this.setState({ lanchdelate: true }) }}>申请删除</Button>
						<Button className="btn" type="default" onClick={this.getExcel.bind(this)} >导出表格</Button>
						<Search
							className="btn"
							style={{ width: "260px" }}
							placeholder="请输入单位工程或工作节点目标"
							onSearch={ text => {
								let result = this.state.dataSource.filter(data => {
									return data.subproject.indexOf(text) >= 0 || data.unit.indexOf(text) >= 0 || data.nodetarget.indexOf(text) >= 0 ;
								})
								if( text === ''){
									result = this.state.dataSource
								}
								this.setState({showDat:result});
							}
						  }
						/>
					</Row>
					<div >
						<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.showDat} pagination={paginationInfo}
							loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}												
						/>
					</div>
					{this.state.lanchReapt &&
						<SumPlan {...this.props} oncancel={() => { this.setState({ lanchReapt: false }) }} onok={this.lanchOk.bind(this)} />
					}
					{this.state.lanchChange &&
						<SumPlanChange {...this.props} {...this.state} oncancel={() => { this.setState({ lanchChange: false }) }} onok={this.changeOk.bind(this)} />
					}
					{this.state.lanchdelate &&
						<SumPlanDelate {...this.props} {...this.state} oncancel={() => { this.setState({ lanchdelate: false }) }} onok={this.delateOk.bind(this)} />
					}
				</Content>
			</div>)
	}
};
