import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/workdata';
import { getUser } from '_platform/auth';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button, message, Progress ,notification} from 'antd';
import { WorkModal, WorkChange, WorkDel } from '../components/ScheduleData';
import './quality.less';
import { getNextStates } from '_platform/components/Progress/util';
import moment from 'moment';
import { WORKFLOW_CODE, NODE_FILE_EXCHANGE_API, DataReportTemplate_ConstructionProgress } from '_platform/api.js';
import Preview from '../../_platform/components/layout/Preview';
const Search = Input.Search;
@connect(
	state => {
		const { datareport: { workdata = {} } = {}, platform } = state;
		return { ...workdata, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)
export default class WorkScheduleData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			showDs: [],
			totalData: null,
			loading: false,
			pagination:{},
			selectedRowKeys: [],
			dataSourceSelected: [],
			setAddVisiable: false,
			setDeleteVisiable: false,
			setEditVisiable: false,
		};
	}
	async componentDidMount() {
		const { actions: {
            getWorkDataList,
        } } = this.props;
		let dataSource = [];
		this.setState({loading:true,percent:0,num:0})
		getWorkDataList()
			.then(data => {
				this.setState({ loading: false ,percent:100});
				data.result.map((single, i) => {
					let temp = {
						key: ++i,
						code: single.extra_params.code,
						name: single.extra_params.name,
						project: single.extra_params.project.name || single.extra_params.project,
						unit: single.extra_params.unit.name || single.extra_params.unit,
						construct_unit: single.extra_params.construct_unit.name||single.extra_params.construct_unit,
						quantity: single.extra_params.quantity,
						factquantity: single.extra_params.factquantity,
						planstarttime: single.extra_params.planstarttime,
						planovertime: single.extra_params.planovertime,
						factstarttime: single.extra_params.factstarttime,
						factovertime: single.extra_params.factovertime,
						uploads: single.extra_params.uploads,
						delcode: single.code,
						wpcode: single.extra_params.unit.code || single.extra_params.wpcode,
						obj_type: single.extra_params.unit.obj_type || single.extra_params.obj_type,
						pk: single.extra_params.unit.pk || single.extra_params.pk,
					}
					dataSource.push(temp);
					this.setState({ dataSource, showDat: dataSource, loading: false , percent:100});
				})
			})
			

	}
	goCancel = () => {
		this.setState({ setAddVisiable: false, setDeleteVisiable: false, setEditVisiable: false });
	}
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
	}
	// 批量录入流程
	setAddData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "施工进度发起填报",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "施工进度发起填报",
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
					this.setState({ setAddVisiable: false })
				})
		})
	}
	// 批量删除流程
	setDeleteData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "施工进度批量删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "施工进度批量删除",
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
					note: '申请删除',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					this.setState({ setDeleteVisiable: false })
				})
		})
	}
	onBtnClick = (type) => {
		if (type === "add") {
			this.setState({ setAddVisiable: true });
		} else if (type === "delete") {
			this.setState({ setDeleteVisiable: true });
		} else if (type === "edit") {
			this.setState({ setEditVisiable: true });
		}
	}
	// 批量变更流程
	setEditData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "施工进度批量变更",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "施工进度批量变更",
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
					note: '申请变更',
					executor: creator,
					next_states: [{
						participants: [participants],
						remark: "",
						state: nextStates[0].to_state[0].id,
					}],
					attachment: null
				}).then(() => {
					this.setState({ setEditVisiable: false })
				})
		})
	}
	onBtnClick = (type) => {
		const { selectedRowKeys } = this.state;
		if (type === "add") {
			this.setState({ setAddVisiable: true });
		} else if (type === "delete") {
			if (selectedRowKeys.length === 0) {
				notification.warning({
                    message: '请先选择数据！',
                    duration: 2
                });
				return
			}
			this.setState({ setDeleteVisiable: true });
		} else if (type === "edit") {
			if (selectedRowKeys.length === 0) {
				notification.warning({
                    message: '请先选择数据！',
                    duration: 2
                });
				return
			}
			this.setState({ setEditVisiable: true });
		}
	}
	
	//数据导出
	getExcel() {
		const { actions: { jsonToExcel } } = this.props;
		const { dataSourceSelected } = this.state;
		let rows = [];
		if(dataSourceSelected.length===0){
			notification.warning({
				message: '请先选择数据！',
				duration: 2
			});
			return;
		}
		rows.push(["WBS编码", "任务名称", "项目/子项目", "单位工程", "实施单位", "施工图工程量", "实际工程量", "计划开始时间", "计划结束时间", "实际开始时间", "实际结束时间", "上传人员"]); 
		dataSourceSelected.map(item => {
			rows.push([
				item.code,
				item.name,
				item.project,
				item.unit,
				item.construct_unit,
				item.quantity,
				item.factquantity,
				item.planstarttime,
				item.planovertime,
				item.factstarttime,
				item.factovertime,
				item.uploads,
			]);
		})
		jsonToExcel({}, { rows: rows })
			.then(rst => {
				this.createLink(this, NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename);
			})
	}

	//模板下载
	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="施工进度" {...this.props} />
				<Row>
					<Button className="btn" type="default" onClick={() => this.onBtnClick('add')}>发起填报</Button>
					<Button className="btn" type="default" onClick={() => this.onBtnClick('edit')}>申请变更</Button>
					<Button className="btn" type="default" onClick={() => this.onBtnClick('delete')}>申请删除</Button>
					<Button className="btn" type="default" onClick={this.getExcel.bind(this)}>导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
						onSearch={text => {
							let result = this.state.dataSource.filter(data => {
								return data.project.indexOf(text) >= 0 || data.unit.indexOf(text) >= 0 || data.name.indexOf(text) >= 0 || data.construct_unit.indexOf(text) >= 0;
							})
							if (text === '') {
								result = this.state.dataSource
							}
							this.setState({ showDat: result });
						}
						}
					/>
				</Row>
				<Row >
					<Col >
						<Table
							columns={this.columns}
							dataSource={this.state.showDat}
							bordered
							rowSelection={rowSelection}
							style={{ height: 380, marginTop: 20 }}
							pagination={{showSizeChanger:true,showQuickJumper:true}}
							rowKey='key'
							loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						/>
					</Col>
				</Row>
				<Preview />
				{
					this.state.setAddVisiable &&
					<WorkModal {...this.props} oncancel={this.goCancel.bind(this)} onok={this.setAddData.bind(this)} />
				}
				{
					this.state.setDeleteVisiable &&
					<WorkDel {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} onok={this.setDeleteData.bind(this)} />
				}
				{
					this.state.setEditVisiable &&
					<WorkChange {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} onok={this.setEditData.bind(this)} />
				}
			</div>
		);
	}
	columns = [{
		title: '序号',
		dataIndex: "key",
		key: "key",
	}, {
		title: 'WBS编码',
		dataIndex: 'code',
		key: "code",
	}, {
		title: '任务名称',
		dataIndex: 'name',
		key: "name",
	}, {
		title: '项目/子项目',
		dataIndex: 'project',
		key: "project",
	}, {
		title: '单位工程',
		dataIndex: 'unit',
		key: "unit",
	}, {
		title: '实施单位',
		dataIndex: 'construct_unit',
		key: "construct_unit",
	}, {
		title: '施工图工程量',
		dataIndex: 'quantity',
		key: "quantity",
	}, {
		title: '实际工程量',
		dataIndex: 'factquantity',
		key: "factquantity",
	}, {
		title: '计划开始时间',
		dataIndex: 'planstarttime',
		key: "planstarttime",
	}, {
		title: '计划结束时间',
		dataIndex: 'planovertime',
		key: "planovertime",
	}, {
		title: '实际开始时间',
		dataIndex: 'factstarttime',
		key: "factstarttime",
	}, {
		title: '实际结束时间',
		dataIndex: 'factovertime',
		key: "factovertime",
	}, {
		title: '上传人员',
		dataIndex: 'uploads',
		key: "uploads",
	}];
}

