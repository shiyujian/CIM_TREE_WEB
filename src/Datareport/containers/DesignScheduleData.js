import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions} from '../store/scheduledata';
import { getUser} from '_platform/auth';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';
import { Row, Col, Table, Input, Button } from 'antd';
import DesignModal from '../components/ScheduleData/DesignModal';
import './quality.less';
import {getNextStates} from '_platform/components/Progress/util';
import moment from 'moment';
import {WORKFLOW_CODE} from '_platform/api.js';
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {scheduledata = {}} = {}, platform} = state;
		return {...scheduledata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class DesignScheduleData extends Component {
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
			title: '编码',
			dataIndex: 'code',
		}, {
			title: '卷册',
			dataIndex: 'volume',
		}, {
			title: '名称',
			dataIndex: 'name',
		}, {
			title: '专业',
			dataIndex: 'major',
		}, {
			title: '实际供图时间',
			dataIndex: 'factovertime',
		}, {
			title: '设计单位',
			dataIndex: 'unit',
		}, {
			title: '上传人员',
			dataIndex: 'uploads',
		}];
	}
	//批量上传回调
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"设计进度发起填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"设计进度发起填报",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
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
						this.setState({addvisible:false})						
					})
		})
	}
	oncancel(){
		this.setState({addvisible:false})
	}
	setAddVisible(){
		this.setState({addvisible:true})
	}
	render() {
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="设计进度" {...this.props} />
				<Row>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => { this.setState({ addvisible: true }) }}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
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
					<DesignModal {...this.props} oncancel={this.oncancel.bind(this)} akey={Math.random() * 1234} onok={this.setData.bind(this)} />
				}
			</div>
		);
	}
}
