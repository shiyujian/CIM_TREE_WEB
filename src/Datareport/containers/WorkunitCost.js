import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {ProjectSum} from '../components/CostListData';
import {ProjectSumExamine} from '../components/CostListData';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Row,Col,Table,Input,Button} from 'antd';
import {WORKFLOW_CODE} from '_platform/api.js'
import {getNextStates} from '_platform/components/Progress/util';
import {getUser} from '_platform/auth';
import {actions} from '../store/WorkunitCost';
import {actions as platformActions} from '_platform/store/global';


var moment = require('moment');
const Search = Input.Search;



@connect(
	state => {
		const {datareport: {WorkunitCost = {}} = {}, platform} = state;
		return {...WorkunitCost, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)




export default class WorkunitCost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible:false,
		
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title: '项目/子项目',
			dataIndex: 'subproject',
		  },{
			title: '单位工程',
			dataIndex: 'unit_engineeing',
		  },{
			title: '项目编号',
			dataIndex: 'projectcoding',
		  },{
			title: '项目名称',
			dataIndex: 'projectname',
		  },{
			title: '计量单位',
			dataIndex: 'company',
		  },{
			title: '数量',
			dataIndex: 'number',
		  },{
			title: '单价',
			dataIndex: 'total',
		  }];
	}
	oncancel(){
		this.setState({addvisible:false})
	}
	projectfill(){
		this.setState({addvisible:true})
	}
	//上传回调
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"工程量结算信息填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"工程量结算信息填报",
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
	// checkout(){

	// }
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title ="工程量结算" {...this.props} />
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={this.projectfill.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" >申请变更</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
						/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]} rowKey="index"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<ProjectSum {...this.props} oncancel={this.oncancel.bind(this)} akey={Math.random()*1234} onok={this.setData.bind(this)}/>
				}
				
			</div>)
	}

	
};
