import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions} from '../store/workdata';
import { getUser} from '_platform/auth';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button } from 'antd';
import WorkModal from '../components/ScheduleData/WorkModal';
import './quality.less';
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {workdata = {}} = {}, platform} = state;
		return {...workdata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class WorkScheduleData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible: false
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
		}
			, {
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
	//批量上传回调
	setData(data) {
		this.setState({ addvisible: false })
	}
	render() {
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="施工进度" {...this.props} />
				<Row>
					<Button className="btn" type="default" onClick={() => { this.setState({ addvisible: true }) }}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="请输入内容"
						onSearch={value => console.log(value)}
						enterButton />
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]} />
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<WorkModal {...this.props} oncancel={() => { this.setState({ addvisible: false }) }} akey={Math.random() * 1234} onok={this.setData.bind(this)} />
				}
			</div>
		);
	}
}
