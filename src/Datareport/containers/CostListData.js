import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/CostListData';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message,Popconfirm} from 'antd';
import PriceList from '../components/CostListData/PriceList';
import PriceRmModal from '../components/CostListData/PriceRmModal';
import PriceModifyModal from '../components/CostListData/PriceModifyModal';
import PriceExcelModal from '../components/CostListData/PriceExcelModal';
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
export default class CostListData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
			addvisible:false,
			rmModal: false,
			modifyModal: false,
			excelModal: false,
			dataSource: [],
			cacheDataSource: [],
			subDatas: []
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
			},{
				title:'项目/子项目',
				dataIndex:'subproject',
			},{
				title:'单位工程',
				dataIndex:'unitengineering'
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
			}
		];
	}

	async componentDidMount () {
		const {actions:{
            getScheduleDir,
			postScheduleDir,
			getTagLists,
			getWorkPackageDetails,
			getSearcher
		}} = this.props;
		
		let dataSource = [];
		let data = await getSearcher({key:"priceListName"});
		data.result.map((item,index)=>{
			let temp = {
				code:item.extra_params.code,
				company:item.extra_params.company,
				rate:item.extra_params.rate,
				projectcoding:item.extra_params.projectcoding,
				remarks:item.extra_params.remarks,
				total:item.extra_params.total,
				valuation:item.extra_params.valuation,
				subproject: item.extra_params.subproject,
				unitengineering: item.extra_params.unitengineering,
				extraCode:item.code,
				key: index + 1,
				pk: item.pk
			}
			dataSource.push(temp);
		})
		this.setState({dataSource, cacheDataSource: dataSource});
		debugger;
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
			code:WORKFLOW_CODE["数据报送流程"],
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
            logWorkflowEvent({pk:rst.id},{
				state:rst.current[0].id,
				action:'提交',
				note:'发起填报',
				executor:creator,
				next_states:[{ 
					participants:[participants],
					remark:"",
					state:nextStates[0].to_state[0].id,
				}],
				attachment:null
			}).then(() => {
				this.setState({addvisible:false}),
				message.info("发起成功")						
			})
		})
	}

	setRmData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"计价清单信息删除申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息删除申请",
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
            logWorkflowEvent({pk:rst.id},{
				state:rst.current[0].id,
				action:'提交',
				note:'发起填报',
				executor:creator,
				next_states:[{ 
					participants:[participants],
					remark:"",
					state:nextStates[0].to_state[0].id,
				}],
				attachment:null
			}).then(() => {
				this.setState({rmModal:false}),
				message.info("发起成功")						
			})
		})
	}

	setModifyData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"计价清单信息变更申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息变更申请",
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
            logWorkflowEvent({pk:rst.id},{
				state:rst.current[0].id,
				action:'提交',
				note:'发起填报',
				executor:creator,
				next_states:[{ 
					participants:[participants],
					remark:"",
					state:nextStates[0].to_state[0].id,
				}],
				attachment:null
			}).then(() => {
				this.setState({modifyModal:false}),
				message.info("发起成功")						
			})
		})
	}

	getSelectItems () {
		let dataSource = this.state.dataSource;
		let selectedRowKeys = this.state.selectedRowKeys;
		return selectedRowKeys.map(index => dataSource[index]);
	}

	setExcelData () {
		message.info("excel 数据导出成功")
	}

	oncancel(){
		this.setState({addvisible:false})
	}
	setAddVisible(){
		this.setState({addvisible:true})
	}
	onSelectChange = (selectedRowKeys, selectedRows) => {
		console.log(selectedRows, selectedRowKeys)
		this.setState({ selectedRowKeys, subDatas: selectedRows});
	}
	//全局搜索
	search(value) {
		let dataSource = this.state.cacheDataSource;
		let res = [];
		if(!value.length) {
			this.setState({dataSource});
			return;
		}
		for(var i = 0; i < dataSource.length; ++i) {
			for(var key in dataSource[i]) {
				let val = String(dataSource[i][key]);
				if(val.indexOf(String(value)) !== -1) {
					res.push(dataSource[i]);
					break;
				}
			}
		}
		if(res.length) {
			this.setState({
				dataSource: res
			});
		}else{
			message.info("请换一个字段")
		}
		debugger;
	}
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="计价清单" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>批量导入</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({modifyModal:true})}}>申请变更</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({rmModal:true})}}>申请删除</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({excelModal:true})}}>导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={value => this.search(value)}
						/>
				</Row>
				<Row >
					<Col >
						<Table
							columns={this.columns}
							dataSource={this.state.dataSource}
							rowSelection={rowSelection}
							rowKey="key"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<PriceList {...this.props} oncancel={() => {this.setState({addvisible:false})}} onok={this.setData.bind(this)}/>
				}
				{
					this.state.modifyModal &&
					<PriceModifyModal {...this.props} modifyData={this.state.subDatas} oncancel={() => {this.setState({modifyModal:false})}} onok={this.setModifyData.bind(this)}/>
				}
				{
					this.state.rmModal &&
					<PriceRmModal {...this.props} rmData={this.state.subDatas} oncancel={() => {this.setState({rmModal:false})}} onok={this.setRmData.bind(this)}/>
				}
				{
					this.state.excelModal &&
					<PriceExcelModal {...this.props} excelData={this.state.subDatas} oncancel={() => {this.setState({excelModal:false})}} onok={this.setExcelData.bind(this)}/>
				}
			</div>
		);
	}
}
