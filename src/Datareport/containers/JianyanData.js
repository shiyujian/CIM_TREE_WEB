import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/quality';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message} from 'antd';
import JianyanModal from '../components/Quality/JianyanModal'
import {WORKFLOW_CODE} from '_platform/api.js'
import './quality.less'
import {getUser} from '_platform/auth'
import {getNextStates} from '_platform/components/Progress/util';
var moment = require('moment');
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class JianyanData extends Component {
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
			title:'项目/子项目',
			dataIndex:'project'
		},{
			title:'单位工程',
			dataIndex:'unit'
		},{
			title:'WBS编码',
			dataIndex:'code'
		},{
			title:'名称',
			dataIndex:'name'
		},{
			title:'检验合格率',
			dataIndex:'rate'
		},{
			title:'质量等级',
			dataIndex:'level'
		},{
			title:'施工单位',
			dataIndex:'construct_unit'
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
			name:"其它验收信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"其它验收信息批量录入",
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
	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="其他检验信息" {...this.props}/>
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
					<JianyanModal {...this.props} oncancel={() => {this.setState({addvisible:false})}} akey={Math.random()*1234} onok={this.setData.bind(this)}/>
				}
			</div>
		);
	}
}
