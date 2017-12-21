import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store/workdata';
import { getUser } from '_platform/auth';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button, message } from 'antd';
import WorkModal from '../components/ScheduleData/WorkModal';
import './quality.less';
import { getNextStates } from '_platform/components/Progress/util';
import moment from 'moment';
import { WORKFLOW_CODE } from '_platform/api.js';
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
			selectedRowKeys: [],
			setEditVisiable: false,
		};
		this.columns = [{
			title: '序号',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: 'WBS编码',
			dataIndex: 'code',
		}, {
			title: '任务名称',
			dataIndex: 'name',
		}, {
			title: '项目/子项目',
			dataIndex: 'project',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '实施单位',
			dataIndex: 'construct_unit',
		}, {
			title: '施工图工程量',
			dataIndex: 'quantity',
		}, {
			title: '实际工程量',
			dataIndex: 'factquantity',
		}, {
			title: '计划开始时间',
			dataIndex: 'planstarttime',
		}, {
			title: '计划结束时间',
			dataIndex: 'planovertime',
		}, {
			title: '实际开始时间',
			dataIndex: 'factstarttime',
		}, {
			title: '实际结束时间',
			dataIndex: 'factovertime',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}];
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
				<DynamicTitle title="施工进度" {...this.props} />
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
							dataSource={[]}
							bordered
							rowSelection={rowSelection}
							style={{ height: 380, marginTop: 20 }}
							pagination={{ pageSize: 10 }}
						/>
					</Col>
				</Row>
				{
					this.state.setEditVisiable &&
					<WorkModal {...this.props} oncancel={this.goCancel.bind(this)} onok={this.setEditData.bind(this)} />
				}
			</div>
		);
	}
}
