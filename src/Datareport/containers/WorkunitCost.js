import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProjectSum } from '../components/CostListData';
import { ProjectSumExamine } from '../components/CostListData';
import { ProjectSumExcalDelete } from '../components/CostListData';

import { ProjectSumChange } from '../components/CostListData';
import { ProjectSumExport } from '../components/CostListData';

import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Row, Col, Table, Input, Button,Popconfirm,message } from 'antd';
import { WORKFLOW_CODE } from '_platform/api.js'
import { getNextStates } from '_platform/components/Progress/util';
import { getUser } from '_platform/auth';
import { actions } from '../store/WorkunitCost';
import { actions as platformActions } from '_platform/store/global';


var moment = require('moment');
const Search = Input.Search;

@connect(
	state => {
		const { datareport: { WorkunitCost = {} } = {}, platform } = state;

		return { ...WorkunitCost, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)

export default class WorkunitCost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible: false,
			delatevisible:false,
			changevisible:false,
			exportvisible:false,
			dataSource: [],
			againDataSource:[],

		}
	}
	async componentDidMount() {
		const { actions: { getScheduleDir } } = this.props;
		let topDir = await getScheduleDir({ code: 'the_only_main_code_costsumplans' });
		if (topDir.obj_type) {
			let dir = await getScheduleDir({ code: 'ck' });
			// debugger
			if (dir.obj_type) {
				if (dir.stored_documents.length > 0) {
					this.generateTableData(dir.stored_documents);
				}
			}
		}
	}
	async generateTableData(data) {
		const { actions: {
			getDocument,
	                 } } = this.props;
		let dataSource = [];
		let i=0;
		data.map((item) => {
			getDocument({ code: item.code }).then(single => {
				i++
				let temp = {
					key:i,
					code: item.code,
					subproject: single.extra_params.subproject,//项目/子项目
					unit: single.extra_params.unit,//单位工程
					projectcoding: single.extra_params.projectcoding,//项目编号
					projectname: single.extra_params.projectname,//项目名称
					company: single.extra_params.company,//计量单位
					number: single.extra_params.number,//数量
					total: single.extra_params.total,//单价
					remarks: single.extra_params.remarks,//备注

				}
				dataSource.push(temp);
				
			})
		})
		this.setState({ 
			dataSource:dataSource,
			showDs:dataSource
		 });
		// debugger;
	}
	//点×取消
	oncancel() {
		this.setState({ addvisible: false })
		this.setState({changevisible:false})
		this.setState({exportvisible:false,})
		
	}
	delatecancel() {
		this.setState({ delatevisible: false })
	}

	//发起变更模态框
	projectfill() {
		this.setState({ addvisible: true })
	}
	
   //申请变更模态框
	setchgVisible(){
		this.setState({changevisible:true})
	}

	//上传回调
	setData(data, participants) {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "工程量结算信息填报",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "工程量结算信息填报",
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
					this.setState({ addvisible: false })
				})
		})
	}
	//工程量结算信息删除
	delateData(data, participants) {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "工程量结算信息删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "工程量结算信息删除",
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
					
					this.setState({ delatevisible: false })
				})
		})
	}

	//变更流程
	setChangeData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"工程量结算信息变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"工程量结算信息变更",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		//发起流程
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
						this.setState({changevisible:false})	
						// message.info("发起成功")					
					})
		})
	}
	//导出表格
	setExportData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"工程量结算信息变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"工程量结算信息变更",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
	}
	//序号点击
	onSelectChange = (selectedRowKeys,selectedRows) => {
		console.log('11111',selectedRowKeys,selectedRows)
        // const {dataSource} = this.state;
        // let dataSourceSelected = [];
        // for(let i=0;i<selectedRowKeys.length;i++){
        //     dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        // }
        this.setState({selectedRowKeys,dataSourceSelected:selectedRows});
    }
	
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		// let rowSelection = {
		// 	selectedRowKeys: this.state.selectedRowKeys || [],
		// 	onChange: (selectedRowKeys, selectedRows) => {
		// 		this.setState({ selectedRowKeys: selectedRowKeys, selectedRows });
		// 		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		// 	},
			// onSelect: (record, selected, selectedRows) => {
			// 	console.log(record, selected, selectedRows);
			// },
			// onSelectAll: (selected, selectedRows, changeRows) => {
			// 	console.log(selected, selectedRows, changeRows);
			// },
		// };
		const columns = [{
			title: '序号',
			dataIndex: 'key',
			key:"key",
		}, {
			title: '项目/子项目',
			dataIndex: 'subproject',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '清单项目编号',
			dataIndex: 'projectcoding',
			key:'Projectcoding'
		}, {
			title: '项目名称',
			dataIndex: 'projectname',
			key:'Projectname'
		}, {
			title: '计量单位',
			dataIndex: 'company',
			key:'Company'
		}, {
			title: '数量',
			dataIndex: 'number',
			key:'Number'
		}, {
			title: '单价',
			dataIndex: 'total',
			key:'Total'
		}, {
			title: '备注',
			dataIndex: 'remarks',
			key:'Remarks'
		}];
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="工程量结算" {...this.props} />
				<Row>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={this.projectfill.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" onClick={this.setchgVisible.bind(this)}>申请变更</Button>

					<Button className="btn" type="default" onClick={() => { this.setState({ delatevisible: true })}}>申请删除</Button>
					<Button className="btn" type="default" onClick={() => { this.setState({ exportvisible: true }) }}>导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
						onSearch={(text) => {
							let result = this.state.dataSource.filter(data => {
								console.log('data',data)
								return data.subproject.indexOf(text) >= 0 || data.unit.indexOf(text) >= 0 || data.projectname.indexOf(text) >= 0 || data.company.indexOf(text) >= 0 ;
							});
							console.log(result);
							if (text === '') {
								result = this.state.dataSource;
							}
							this.setState({ showDs: result });
						}}
					/>
				</Row>
				<Row >
					<Col >
						<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.showDs}  />
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<ProjectSum {...this.props} oncancel={this.oncancel.bind(this)} onok={this.setData.bind(this)} rowKey="key" />
				}
				{
					this.state.delatevisible &&
					<ProjectSumExcalDelete {...this.props} {...this.state } oncancel={this.delatecancel.bind(this)} onok={this.delateData.bind(this)} />
				}
				{
					this.state.changevisible &&
					<ProjectSumChange {...this.props} {...this.state } oncancel={this.oncancel.bind(this)} onok={this.setChangeData.bind(this)}/>
				}
				{
					this.state.exportvisible &&
					<ProjectSumExport  {...this.props} {...this.state } oncancel={this.oncancel.bind(this)} onok={this.setExportData.bind(this)}/>
				}
			</div>)
	}


};
