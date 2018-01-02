import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProjectSum } from '../components/CostListData';
import { ProjectSumExamine } from '../components/CostListData';
import { ProjectSumExcalDelete } from '../components/CostListData';
import { ProjectSumChange } from '../components/CostListData';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input,Progress,Col } from 'antd';
import { WORKFLOW_CODE ,NODE_FILE_EXCHANGE_API,DataReportTemplate_ProjectVolumeSettlement} from '_platform/api.js'
import { getNextStates } from '_platform/components/Progress/util';
import { getUser } from '_platform/auth';
import { actions } from '../store/WorkunitCost';
import { actions as platformActions } from '_platform/store/global';


var moment = require('moment');
const Search = Input.Search;

@connect(
	state => {
		const { datareport: { WorkunitCost = {} } = {}, platform } = state;

		return { ...WorkunitCost, platform }
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions, ...platformActions }, dispatch)
	})
)

export default class WorkunitCost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible: false,
			delatevisible:false,
			changevisible:false,
			exportvisible:false,
			dataSource: [],
			againDataSource:[],

		}
	
	}
	async componentDidMount() {

		const { actions: { getScheduleDir } } = this.props;
		this.setState({loading:true,percent:0,num:0})
		let topDir = await getScheduleDir({ code: 'the_only_main_code_costsumplans' });
		if (topDir.obj_type) {
			let dir = await getScheduleDir({ code: 'ck' });
			if (dir.obj_type) {
				if (dir.stored_documents.length > 0) {
					this.generateTableData(dir.stored_documents);
				
				}
			}
		}
	}
	async generateTableData(data) {
		const { actions: {getDocument}} = this.props;  
		let dataSour = [];
		let i=0;
		data.map((item) => {
			getDocument({ code: item.code }).then(single => {
				i++
				let temp = {
					key:i,
					code: item.code,
					subproject: single.extra_params.subproject || rst.extra_params.project,//项目/子项目
					unit: single.extra_params.unit || rst.extra_params.unit,//单位工程
					projectcoding: single.extra_params.projectcoding,//项目编号
					projectname: single.extra_params.projectname,//项目名称
					company: single.extra_params.company,//计量单位
					number: single.extra_params.number,//数量
					total: single.extra_params.total,//单价
					remarks: single.extra_params.remarks,//备注

				}
				dataSour.push(temp);
				this.setState({ 
					dataSource:dataSour,
					showDs:dataSour,
					loading:false,
					percent:100
				});
			})
		})
		
	}
	//点×取消
	oncancel() {
		this.setState({ addvisible: false });
		this.setState({changevisible:false});
	}
	delatecancel() {
		this.setState({ delatevisible: false })
	}
	//模板下载
	DownloadExcal(){
		this.createLink("工程量结算模板下载",DataReportTemplate_ProjectVolumeSettlement)
	}
	createLink = (name, url) => {
		let link = document.createElement("a");
		link.href=url;
		link.setAttribute("download",this);
		link.setAttribute("target","_blank");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	//发起变更模态框
	projectfill() {
		this.setState({ addvisible: true })
	}
	
   //申请变更模态框
	setchgVisible(){
		let {selectedRowKeys,dataSourceSelected,dataSource} = this.state;
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0){
			this.setState({changevisible:true});
			return;
		}else{
			message.warning('请选择数据');
		}
	}
	//申请删除
	setDeleteVisible(){
		let {selectedRowKeys,dataSourceSelected,dataSource} = this.state;
		// console.log('this.state',this.state)
		// console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
		// console.log('this.state.selectedRowKeys.length',this.state.selectedRowKeys.length)
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0){
			this.setState({ delatevisible: true });
			return;
		}else{
			message.warning('请选择数据');
		}
		
	}
	//导出表格
	setExportvisible(){
		let {selectedRowKeys,dataSourceSelected,dataSource} = this.state;
		if(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0){
			const {actions:{jsonToExcel}}=this.props;
			const {dataSourceSelected} =this.state;
			let rows =[];
			rows.push(['序号','项目/子项目','单位工程','清单项目编号','项目名称','计量单位','数量','单价','备注']);
			dataSourceSelected.map(o =>{
				rows.push([
					o.key,
					o.subproject,
					o.unit,
					o.projectcoding,
					o.projectname,
					o.company,
					o.number,
					o.total,
					o.remarks
				]);
			})
		
			jsonToExcel({},{rows:rows}).then(rst =>{
				this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
			})
			return
		}else{
			message.warning('请选择数据');
		}
	}

	//上传回调
	setData(data, participants) {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "工程量结算信息填报",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "工程量结算信息填报",
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
					this.setState({ addvisible: false })
				})
		})
	}
	//工程量结算信息删除
	delateData(data, participants) {
		const { actions: { createWorkflow, logWorkflowEvent } } = this.props
		let creator = {
			id: getUser().id,
			username: getUser().username,
			person_name: getUser().person_name,
			person_code: getUser().person_code,
		}
		let postdata = {
			name: "工程量结算信息删除",
			code: WORKFLOW_CODE["数据报送流程"],
			description: "工程量结算信息删除",
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
					
					this.setState({ delatevisible: false })
				})
		})
	}

	//变更流程
	setChangeData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"工程量结算信息变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"工程量结算信息变更",
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
						this.setState({changevisible:false})	
						// message.info("发起成功")					
					})
		})
	}

	//序号点击
	onSelectChange = (selectedRowKeys,selectedRows) => {
		// console.log('11111',selectedRowKeys,selectedRows)
        // const {dataSource} = this.state;
        // let dataSourceSelected = [];
        // for(let i=0;i<selectedRowKeys.length;i++){
        //     dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        // }
        this.setState({selectedRowKeys,dataSourceSelected:selectedRows});
    }
	//分页
    paginationOnChange(page,pageSize){
		console.log('page',page,pageSize);
	}
	

	render() {
		
		const paginationInfo = {
			onChange: this.paginationOnChange.bind(this),
			showSizeChanger: true,
			pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
			showQuickJumper: true,
		}

		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const columns = [{
			title: '序号',
			dataIndex: 'key',
			key:"key",
		}, {
			title: '项目/子项目',
			dataIndex: 'subproject',
		}, {
			title: '单位工程',
			dataIndex: 'unit',
		}, {
			title: '清单项目编号',
			dataIndex: 'projectcoding',
			key:'Projectcoding'
		}, {
			title: '项目名称',
			dataIndex: 'projectname',
			key:'Projectname'
		}, {
			title: '计量单位',
			dataIndex: 'company',
			key:'Company'
		}, {
			title: '数量',
			dataIndex: 'number',
			key:'Number'
		}, {
			title: '单价',
			dataIndex: 'total',
			key:'Total'
		}, {
			title: '备注',
			dataIndex: 'remarks',
			key:'Remarks'
		}];
		return (
			<div style={{ overflow: 'hidden', padding: 20 }}>
				<DynamicTitle title="工程量结算" {...this.props} />
				<Row>
					<Button style={{ margin: '10px 10px 10px 0px' }} type="default" onClick={this.DownloadExcal.bind(this)}>模板下载</Button>
					<Button className="btn" type="default" onClick={this.projectfill.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" onClick={this.setchgVisible.bind(this)}>申请变更</Button>
					<Button className="btn" type="default" onClick={this.setDeleteVisible.bind(this) }>申请删除</Button>
					<Button className="btn" type="default" onClick={this.setExportvisible.bind(this)}>导出表格</Button>
					<Search
						className="btn"
						style={{ width: "200px" }}
						placeholder="输入搜索条件"
						onSearch={(text) => {
							let result = this.state.dataSource.filter(data => {
								return data.subproject.indexOf(text) >= 0 || data.unit.indexOf(text) >= 0 || data.projectname.indexOf(text) >= 0 || data.total.indexOf(text) >= 0 || data.projectcoding.indexOf(text) >= 0 
							});
							if (text === '') {
								result = this.state.dataSource;
							}
							this.setState({ showDs: result });
						}}
					/>
				</Row>
				<Row >
					<Col >
						<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.showDs } 
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}} pagination={paginationInfo}/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<ProjectSum {...this.props} oncancel={this.oncancel.bind(this)} onok={this.setData.bind(this)} rowKey="key" />
				}
				{
					this.state.delatevisible &&
					<ProjectSumExcalDelete {...this.props} {...this.state } oncancel={this.delatecancel.bind(this)} onok={this.delateData.bind(this)} />
				}
				{
					this.state.changevisible &&
					<ProjectSumChange {...this.props} {...this.state } oncancel={this.oncancel.bind(this)} onok={this.setChangeData.bind(this)}/>
				}
				
			</div>)
	}


};
