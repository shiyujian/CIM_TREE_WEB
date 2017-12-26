import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProjectSum } from '../components/CostListData';
import { ProjectSumExamine } from '../components/CostListData';
import { ProjectSumExcalDelete } from '../components/CostListData';

import { ProjectSumChange } from '../components/CostListData';

import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Row, Col, Table, Input, Button,Popconfirm } from 'antd';
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
			dataSource: []

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
		data.map(item => {
			
			getDocument({ code: item.code }).then(single => {
				
				let temp = {
					code: item.code,
					subproject: single.extra_params.subproject,
					unit: single.extra_params.unit,
					projectcoding: single.extra_params.projectcoding,
					projectname: single.extra_params.projectname,
					company: single.extra_params.company,
					number: single.extra_params.number,
					total: single.extra_params.total,
					remarks: single.extra_params.remarks,

				}
				dataSource.push(temp);
				this.setState({ dataSource });
			})
		})
	}

	// subproject: item.project.name,//项目/子项目
	// unit: item.unit.name,//单位工程
	// projectcoding: item.projectcoding,//项目编号
	// projectname: item.projectname,//项目名称
	// company: item.company,//计量单位
	// number: item.number,//数量
	// total: item.total,//单价
	// remarks: item.remarks,//备注


	oncancel() {
		this.setState({ addvisible: false })
		this.setState({changevisible:false})
	}
	projectfill() {
		this.setState({ addvisible: true })
	}
	delatecancel() {
		this.setState({ delatevisible: false })
	}
	//删除
	// delete(index) {
	// 	let { dataSource } = this.state
	// 	dataSource.splice(index, 1)
	// 	this.setState({ dataSource })
	// }
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

	onSelectChange = (selectedRowKeys) => {
        const {dataSource} = this.state;
        let dataSourceSelected = [];
        for(let i=0;i<selectedRowKeys.length;i++){
            dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        }
        this.setState({selectedRowKeys,dataSourceSelected});
    }

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '项目/子项目',
			dataIndex: 'subproject',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '清单项目编号',
			dataIndex: 'projectcoding',
		}, {
			title: '项目名称',
			dataIndex: 'projectname',
		}, {
			title: '计量单位',
			dataIndex: 'company',
		}, {
			title: '数量',
			dataIndex: 'number',
		}, {
			title: '单价',
			dataIndex: 'total',
		}, {
			title: '备注',
			dataIndex: 'remarks',
		}];
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="工程量结算" {...this.props} />
				<Row>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={this.projectfill.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" onClick={this.setchgVisible.bind(this)}>申请变更</Button>
					<Button className="btn" type="default" onClick={() => { this.setState({ delatevisible: true }) }}>申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
					/>
				</Row>
				<Row >
					<Col >
						<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} rowKey="index" />
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<ProjectSum {...this.props} oncancel={this.oncancel.bind(this)} onok={this.setData.bind(this)} />
				}
				{
					this.state.delatevisible &&
					<ProjectSumExcalDelete {...this.props} {...this.state } oncancel={this.delatecancel.bind(this)} onok={this.delateData.bind(this)} />
				}
				{
					this.state.changevisible &&
					<ProjectSumChange {...this.props} {...this.state } oncancel={this.oncancel.bind(this)} onok={this.setChangeData.bind(this)}/>
                }
			</div>)
	}


};
