import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/CostListData';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button} from 'antd';
import PriceList from '../components/CostListData/PriceList';
import {getUser} from '_platform/auth';
import './quality.less';
import {getNextStates} from '_platform/components/Progress/util';
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
export default class CostListData extends Component {
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
			title:'项目',
			dataIndex:'project',
		},{
			title:'单位工程',
			dataIndex:'unit',
		},{
			title:'清单项目编号',
			dataIndex:'projectcoding'
		},{
			title:'计价单项',
			dataIndex:'valuation' 
		},{
			title:'工程内容/规格编号',
			dataIndex:'rate'
		},{
			title:'计量单位',
			dataIndex:'company'
		},{
			title:'结合单价（元）',
			dataIndex:'total'
		}, {
			title:'备注',
			dataIndex:'remarks'
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
			name:"计价清单信息填报",
			code:"TEMPLATE_033",
			description:"计价清单信息填报",
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
				<DynamicTitle title="计价清单" {...this.props}/>
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
						<Table columns={this.columns} dataSource={[]} rowKey="key"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<PriceList {...this.props} oncancel={() => {this.setState({addvisible:false})}} onok={this.setData.bind(this)}/>
				}
			</div>
		);
	}
}
