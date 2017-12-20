import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/CostListData';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button} from 'antd';
import SumSpeed from '../components/CostListData/SumSpeed';
import {getUser} from '_platform/auth';
import './quality.less';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api.js';
var moment = require('moment');
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {CostListData = {}} = {}, platform} = state;
		return {...CostListData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)

export default class BalanceSchedule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addvisible:false
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title: '单位工程',
			dataIndex: 'unitproject',
		  },{
			title: '工作节点目标',
			dataIndex: 'nodetarget',
		  },{
			title: '完成时间',
			dataIndex: 'completiontime',
		  },{
			title: '支付金额（万元）',
			dataIndex: 'summoney',
		  },{
			title: '累计占比',
			dataIndex: 'ratio',
		  },{
			title: '备注',
			dataIndex: 'remarks',
		  }]
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
			name:"结算清单信息填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"结算清单信息填报",
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
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="结算进度表" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>批量导入</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="input search text"
						onSearch={value => console.log(value)}
						/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]} rowKey="key" bordered/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<SumSpeed {...this.props} oncancel={() => {this.setState({addvisible:false})}} onok={this.setData.bind(this)}/>
				}
				{/* <Content>
					结算进度
					<SumSpeed {...this.props}/>
				</Content> */}
			</div>)
	}
};
