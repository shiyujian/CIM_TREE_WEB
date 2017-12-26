import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/scheduledata';
import { getUser } from '_platform/auth';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button, message } from 'antd';
import DesignModal from '../components/ScheduleData/DesignModal';
import './quality.less';
import { getNextStates } from '_platform/components/Progress/util';
import moment from 'moment';
import { WORKFLOW_CODE } from '_platform/api.js';
const Search = Input.Search;
@connect(
	state => {
		const { datareport: { scheduledata = {} } = {}, platform } = state;
		return { ...scheduledata, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)
export default class DesignScheduleData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			selectedRowKeys: [],
			setEditVisiable: false,
		};
		this.columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '专业',
			dataIndex: 'major',
		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
		}, {
			title: '设计单位',
			dataIndex: 'designunit',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}];
	}
	async componentDidMount(){
		const {actions:{
			getScheduleDir,
			postScheduleDir,
		}} = this.props;
		let topDir = await getScheduleDir ({code:'the_only_main_code_datareport'});
		if(topDir.obj_type){
			let dir = await getScheduleDir({code:'datareport_designdata_1111'});
			if(dir.obj_type){
				if(dir.stored_documents.length>0){
					this.generateTableData(dir.stored_documents);
				}
			}
		}
	}
	async generateTableData(data){
		const{actions:{getDocument,}} = this.props;
		let dataSource = [];
		data.map(item=>{
			getDocument({code:item.code}).then(single=>{
				let temp = {
					code:single.extra_params.code,
                    volume:single.extra_params.volume,
                    name:single.extra_params.name,
                    project:single.extra_params.project,
                    unit:single.extra_params.unit,
                    major:single.extra_params.major,
                    factovertime:single.extra_params.factovertime,
                    designunit:single.extra_params.designunit,
                    uploads:single.extra_params.uploads
				}
				dataSource.push(temp);
				this.setState({dataSource});
			})
		})
	}
	goCancel = () => {
		this.setState({ setEditVisiable: false });
	}
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}

	setEditData = (data, participants) => {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "设计进度发起填报",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "设计进度发起填报",
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
					this.setState({ setEditVisiable: false })
				})
		})
	}
	onAddClick = () => {
		this.setState({ setEditVisiable: true });
	}
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="设计进度" {...this.props} />
				<Row>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => this.onAddClick()}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
						/>
				</Row>
				<Row >
					<Col >
						<Table
						 columns={this.columns}
						 dataSource={this.state.dataSource} 
						 bordered
						 rowSelection={rowSelection}
						 style={{ height: 380, marginTop: 20 }}
						 pagination={{ pageSize: 10 }}
						 />
						 
					</Col>
				</Row>
				{
					this.state.setEditVisiable &&
					<DesignModal {...this.props} oncancel={this.goCancel.bind(this)} onok={this.setEditData.bind(this)} />
				}
			</div>
		);
	}
}
