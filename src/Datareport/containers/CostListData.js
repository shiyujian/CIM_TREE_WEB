import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/CostListData';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message,Popconfirm,Progress} from 'antd';
import PriceList from '../components/CostListData/PriceList';
import PriceRmModal from '../components/CostListData/PriceRmModal';
import PriceModifyModal from '../components/CostListData/PriceModifyModal';
import {getUser} from '_platform/auth';
import './quality.less';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE, NODE_FILE_EXCHANGE_API,DataReportTemplate_ValuationList} from '_platform/api.js';

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
		this.header = ['序号','项目/子项目','单位工程','清单项目编号','计价单项',
						'工程内容/规格编号','计量单位','结合单价(元)','备注'];
		this.state = {
			selectedRowKeys: [],
			addvisible:false,
			rmModal: false,
			modifyModal: false,
			excelModal: false,
			dataSource: [],
			cacheDataSource: [],
			selectedRows: [],
			showDs: [],
            percent: 0,
            loading: false
		};
		this.columns = [{
				title:'序号',
				dataIndex:'index',
				render:(text,record,index) => {
					return record.key
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
		this.setState({
			loading: true,
			percent: 50
		})
		let data = await getSearcher({key:"priceListName"});
		data.result.map((item,index)=>{
			let temp = {
				code:item.code,
				company:item.extra_params.company,
				rate:item.extra_params.rate,
				projectcoding:item.extra_params.projectcoding,
				remarks:item.extra_params.remarks,
				total:item.extra_params.total,
				valuation:item.extra_params.valuation,
				subproject: item.extra_params.subproject,
				unitengineering: item.extra_params.unitengineering,
				key: index + 1,
				pk: item.pk
			}
			dataSource.push(temp);
		});
		this.setState({dataSource, cacheDataSource: dataSource, showDs: dataSource, loading: false, percent: 100});
	}

	//流程发起
	processFlow (postdata, participants, note, cb) {
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props;
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},{
				state:rst.current[0].id,
				action:'提交',
				note:note,
				executor:this.getCreator(),
				next_states:[{ 
					participants:[participants],
					remark:"",
					state:nextStates[0].to_state[0].id,
				}],
				attachment:null
			}).then(() => {
				this.setState({addvisible:false}),
				message.info("发起成功");						
			}).catch(() => {
				message.info("发起失败")
			})
			cb();
		})
	}

	//发起人
	getCreator () {
		return {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
	}
	//批量填报
	setData(data,participants){
		let postdata = {
			name:"计价清单信息填报",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息填报",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:this.getCreator(),
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		let cb = () => this.setState({addvisible:false})
		this.processFlow(postdata,participants,"发起填报",cb);
	}
	//批量删除
	setRmData(data,participants){
		let postdata = {
			name:"计价清单信息删除申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息删除申请",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:this.getCreator(),
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		let cb = () => this.setState({rmModal:false});
		this.processFlow(postdata,participants,"发起删除",cb);
	}
	//批量变更
	setModifyData(data,participants){
		let postdata = {
			name:"计价清单信息变更申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"计价清单信息变更申请",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:this.getCreator(),
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		let cb = () => this.setState({modifyModal:false});
		this.processFlow(postdata,participants,"发起变更",cb);
	}

	oncancel(){
		this.setState({addvisible:false})
	}
	setAddVisible(){
		this.setState({addvisible:true})
	}
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({selectedRowKeys, selectedRows});
	}
	//全局搜索
	search(value) {
		value = String(value);
		let oldData = this.state.dataSource;
		let dataSource = this.state.cacheDataSource;
		let res = [];
		if(!value.length) {
			if(oldData.length !== dataSource.length){
				this.setState({dataSource});
				return;
			}else {
				message.warn("请输入查询字段");
				return;
			}
		}
		for(var i = 0; i < dataSource.length; ++i) {
			for(var key in dataSource[i]) {
				let val = String(dataSource[i][key]);
				if(val.indexOf(value) !== -1) {
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
	}

	openModal (type) {
		if(!this.state.selectedRows.length) {
			message.warn("请选择数据");
			return;
		}
		this.setState({
			[type]: true
		})
	}

	getExcel () {
		const {actions:{jsonToExcel}} = this.props;
		const showDs = this.state.selectedRows;
		if(!showDs.length) {
			message.warn('至少选择一条数据');
			return;
		};
        let rows = [];
        rows.push(this.header);
        showDs.map((item,index) => {
            rows.push([index+1,item.subproject,item.unitengineering,item.projectcoding,item.valuation,item.rate,item.company,item.total,item.remarks]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            // console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink('计价清单下载',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
		}).catch(e => {
			console.log(e);
		})
	}

	//下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

	render() {
		const { selectedRowKeys, dataSource } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="计价清单" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default" onClick={() => this.createLink('downLoadTemplate', DataReportTemplate_ValuationList)}>模板下载</Button>
					<Button className="btn" type="default" onClick={() => {this.setState({addvisible:true})}}>批量导入</Button>
					<Button className="btn" type="default" onClick={this.openModal.bind(this, "modifyModal")}>申请变更</Button>
					<Button className="btn" type="default" onClick={this.openModal.bind(this, "rmModal")}>申请删除</Button>
					<Button className="btn" type="default" onClick={this.getExcel.bind(this)}>导出表格</Button>
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
							dataSource={dataSource}
							rowSelection={rowSelection}
							pagination={{showQuickJumper:true,showSizeChanger:true,total:dataSource.length}} 
							rowKey="key"
							loading={{
								tip: <Progress
									style={{ width: 200 }}
									percent={this.state.percent}
									status="active" strokeWidth={5}
								/>
								, spinning: this.state.loading
							}}/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<PriceList {...this.props} oncancel={() => {this.setState({addvisible:false})}} onok={this.setData.bind(this)}/>
				}
				{
					this.state.modifyModal &&
					<PriceModifyModal {...this.props} modifyData={this.state.selectedRows} oncancel={() => {this.setState({modifyModal:false})}} onok={this.setModifyData.bind(this)}/>
				}
				{
					this.state.rmModal &&
					<PriceRmModal {...this.props} rmData={this.state.selectedRows} oncancel={() => {this.setState({rmModal:false})}} onok={this.setRmData.bind(this)}/>
				}
			</div>
		);
	}
}
