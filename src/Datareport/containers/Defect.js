import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/quality';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message} from 'antd';
import {getUser} from '_platform/auth'
import DefectModal from '../components/Quality/DefectModal'
import './quality.less'
import {WORKFLOW_CODE} from '_platform/api.js'
import {getNextStates} from '_platform/components/Progress/util';
const Search = Input.Search;
var moment = require('moment');
@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Defect extends Component {
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
			title:'项目/子项目名称',
			dataIndex:'project'
		},{
			title:'单位工程',
			dataIndex:'unit'
		},{
			title:'WBS编码',
			dataIndex:'code'
		},{
			title:'责任单位',
			dataIndex:'respon_unit'
		},{
			title:'事故类型',
			dataIndex:'acc_type'
		},{
			title:'上报时间',
			dataIndex:'uploda_date'
		},{
			title:'核查时间',
			dataIndex:'check_date'
		},{
			title:'整改时间',
			dataIndex:'do_date'
		},{
			title:'事故描述',
			dataIndex:'descrip'
		},{
			title:'排查结果',
			dataIndex:'check_result'
		},{
			title:'整改期限',
			dataIndex:'deadline'
		},{
			title:'整改结果',
			dataIndex:'result'
		}, {
			title:'附件',
			render:(text,record,index) => {
				return <span>
					<a>预览</a>
					<span className="ant-divider" />
					<a>下载</a>
				</span>
			}
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
			name:"质量缺陷信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"质量缺陷信息批量录入",
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
						this.setState({addvisible:false})	
						message.info("发起成功")					
					})
		})
	}
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="质量缺陷信息" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">申请删除</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
						enterButton/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]}/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<DefectModal {...this.props} oncancel={() => {this.setState({addvisible:false})}} akey={Math.random()*1234} onok={this.setData.bind(this)}/>
				}
			</div>
		);
	}
}
