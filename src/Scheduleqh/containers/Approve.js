import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {getUser} from '_platform/auth';
import {connect} from 'react-redux';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import EditData from '../components/Stage/EditData';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api';
import {SMUrl_template11,} from '_platform/api';
import queryString from 'query-string';

import {Row, Col,Spin, Card, DatePicker, Upload,Icon,notification,
	Input,Button,Modal,Table,Form,Select,Radio,Checkbox,Calendar,Popover} from 'antd';
const {RangePicker} = DatePicker;
const {Option} = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(
	state => {
		const {schedule:{scheduler = {}},platform} = state;
		return {platform,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...schedulerActions}, dispatch)
	})
)

class Approve extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			dataSet:[],
			newKey:Math.random(),
			index:-1,
			record:{},
			value:1, //the type of radiogroup
			selectLength:1,
			timePick:null,
			pickergo:true,
			notifiy:[],
			setSchedulerVisiable:false,
			listObj:{},
			currentDate:'',
			item:null,
			schedulerList:[],
			downfinish:true,
			nextExcutor:{},
			date:null,
			defaultState:false
		};
	}

	componentDidMount(){
		const{
			actions:{
				getProjectTree,
				getDoctimestats,
				getScheduler,
				getWorkflowById
			},
			location={}
		}=this.props
		let me = this;
		let {stageApprovalID='0'} = queryString.parse(location.search) || {};
		
		if(stageApprovalID==='0'){
			console.log('totalID',0)
			//获取最初始的树节点
			// getProjectTree({},{depth:2}).then((rst)=>{
			// 	if(rst && rst.children && rst.children.length>0){
			// 		let project=rst.children;
			// 		for(var i=0;i<project.length;i++){
			// 			if(project[i].children.length>0){
			// 				let unitProjecte=project[i].children[0];
			// 				console.log('unitProjecte',unitProjecte);
			// 				this.setState({
			// 					item:{
			// 						unitProjecte:unitProjecte,
			// 						project:project[i]
			// 					},
			// 					unit:project[i].children[0].extra_params.unit[0],
			// 				});
			// 				const user = getUser();   //,reviewer:id
			// 				const id = user.id;
			// 				let test = true;
			// 				getScheduler({},{project:project.pk,unit:unitProjecte.pk,reviewer:id}).then(result =>{
			// 					if(result && result.results && result.results.length>0){
			// 						for(var i=0;i<result.results.length;i++){
			// 							if(result.results[i].audit_status && result.results[i].audit_status.length>0 && result.results[i].audit_status[0].status==="已填报"){
			// 								test= false;
			// 								this.setState({
			// 									schedulerList:result.results,
			// 									downfinish:false
			// 								});
			// 								return
			// 							}else{
			// 								this.setState({
			// 									schedulerList:[],
			// 									downfinish:true,
			// 									dataSet:[],
			// 									listObj:{}
			// 								});
			// 							}
			// 						}
			// 						if(test){
			// 							this.setState({
			// 								schedulerList:[],
			// 								downfinish:true,
			// 								dataSet:[],
			// 								listObj:{}
			// 							});
			// 							notification.info({
			// 								message: '当前单位工程无日程可查询',
			// 								duration: 2
			// 							});
			// 							return;
			// 						}

			// 					}else{
			// 						this.setState({
			// 							schedulerList:[],
			// 							downfinish:true,
			// 							dataSet:[],
			// 							listObj:{}
			// 						});
			// 						notification.info({
			// 							message: '当前单位工程无日程可查询',
			// 							duration: 2
			// 						});
			// 						return;
			// 					}
			// 				});
			// 				return;
			// 			}
			// 		}
			// 	}
			// });
		}else{
			getWorkflowById({ id: stageApprovalID }).then((instance)=>{
				if(instance && instance.subject){
					console.log('流程详情', instance);
					let subject = instance.subject[0];
					let unitProjecte = subject.unit?JSON.parse(subject.unit):null;
					let project = subject.project?JSON.parse(subject.project):null;
					let date =  subject.date?JSON.parse(subject.date):null;
					if(unitProjecte && project && date){
						me.setState({
							date:date,
							defaultState:true
						})
						me.onSelect(project,unitProjecte)
					}
				}
			})
		}
		
	}

	onSelect = (project,unitProjecte)=>{
		const{
			actions:{
				getProjectTree,
				getDoctimestats,
				getScheduler,
				getWorkflowById
			},
			location={}
		}=this.props
		const{
			date,
			defaultState
		}=this.state
		let me = this;
		let {stageApprovalID='0'} = queryString.parse(location.search) || {};

		//选择最下级的工程
		if(unitProjecte){
			this.setState({
				item:{
					unitProjecte:unitProjecte,
					project:project
				}
			});
			const usr = getUser();
			const id = usr.id;   //,reviewer:id
			let test = true
			getScheduler({},{project:project.pk,unit:unitProjecte.pk,reviewer:id}).then(result =>{
				if(result && result.results && result.results.length>0){
					for(var i=0;i<result.results.length;i++){
						if(result.results[i].audit_status && result.results[i].audit_status.length>0 && result.results[i].audit_status[0].status==="已填报"){
							test = false;
						}
					}

					if(test){
						this.setState({
							schedulerList:[],
							downfinish:true,
							dataSet:[],
							listObj:{}
						});
						notification.info({
							message: '当前单位工程无日程可查询',
							duration: 2
						});
						return;
					}
					//是否从个人中心跳转过来
					if(defaultState){
						console.log('stageApprovalID',stageApprovalID)
						if(date){
							this.setState({
								schedulerList:result.results,
								downfinish:false,
								defaultState:false
							},()=>{
								me.onCardClick(date)
							});
							return
						}
					}else{
						console.log('stageApprovalID',stageApprovalID)
						this.setState({
							schedulerList:result.results,
							downfinish:false
						});
						return
					}

				}else{
					this.setState({
						schedulerList:[],
						downfinish:true,
						dataSet:[],
						listObj:{}
					});
					notification.info({
		                message: '当前单位工程无日程可查询',
		                duration: 2
		            });
					return;
				}
			});
		}
    };

	onRadioChange = (e) => {
		if(e.target.value===1){
			this.setState({value:e.target.value,pickergo:true});
		}else{
			this.setState({value:e.target.value,pickergo:false});
		}
	}

	popScheduler = () =>{
		this.setState({newKey:Math.random(),setSchedulerVisiable:true});
	}

	onTimeChange = (date,dateString) => {
		this.setState({timePick:dateString});
	}

	goCancel = () => {
		this.setState({setSchedulerVisiable:false});
	}
	onAddClick = () => {
		let length = this.state.selectLength+1;
		this.setState({selectLength:length});
	}

	getListData(value) {
		let listData = [];
		const schedulerList = this.state.schedulerList;
		let datastr = '';
		for(let i=0;i<schedulerList.length;i++){
			datastr = schedulerList[i].created_date.slice(0,10);
			if(value.format('YYYY-MM-DD') === datastr){
				if(schedulerList[i].audit_status && schedulerList[i].audit_status.length>0 && schedulerList[i].audit_status[0].status==="已填报"){
					listData.push({type:'normal',content:schedulerList[i].subject+'(已填报)'});
				}
			}
		}
		return listData;
	}

	dateCellRender(value) {
		const listData = this.getListData(value);
		return (
			<ul className="events">
			{
				listData.map(item => (
				<li key={item.content}>
					<span className={`event-${item.type}`}>●</span>
					{item.content}
				</li>
				))
			}
			</ul>
		);
	}

	getMonthData(value) {
		if (value.month() === 8) {
			return 1394;
		}
	}

	monthCellRender(value) {
		const num = this.getMonthData(value);
		return num ? <div className="notes-month">
			<section>{num}</section>
			<span>Backlog number</span>
		</div> : null;
	}

	onCardClick = (date) =>{
		const {actions:{getWorkflowById}} = this.props;
		const {schedulerList} = this.state;
    	this.setState({currentDate:moment(date).format('YYYY-MM-DD').toString()});
    	for(let i=0;i<schedulerList.length;i++){
    		//选中的时间和列表中时间相同
    		if(moment(date).format('YYYY-MM-DD') === schedulerList[i].created_date.slice(0,10)){
				if(schedulerList[i].audit_status && schedulerList[i].audit_status.length>0 && schedulerList[i].audit_status[0].status==="已填报"){
					if(schedulerList[i].flow.length===0){
						return;
					}
					let data = {date:moment(date).format('YYYY-MM-DD')};
					console.log('schedule_report',schedulerList[i].schedule_report)
					this.setState({
						listObj:schedulerList[i],
						setSchedulerVisiable:false,
						nextExcutor:schedulerList[i].informant,
						dataSet:schedulerList[i].schedule_report
					});
					return;
				}else{
					this.setState({
						dataSet:[],
						listObj:{},
						setSchedulerVisiable:false,
						nextExcutor:{}
					});
				}
    		}
		}
		this.setState({
			dataSet:[],
			listObj:{},
			setSchedulerVisiable:false,
			nextExcutor:{}
		});
    }

    onSubmitClick = () =>{
    	let note = document.querySelector('#remark').value;
    	const usr = getUser();
		const {
			listObj = {},
			timePick,dataSet,
			item
		} = this.state;
		
    	const id = listObj.flow[0];
    	let schedulepk = listObj._id ? listObj._id : ''; 
        const currentUser = {
            "username": usr.username,
            "person_code": usr.code,
            "person_name": usr.name,
            "id": parseInt(usr.id)
        };
    	const 
    		{actions:{
				putFlow,
				getWorkflowById,
				getScheduleWorkFlow,
				patchDeadline,
				updateSchedulerState,
				putScheduleTable,
				putProcessData,
				putDocument
			}
        } = this.props;
        if(listObj.audit_status.length===0){
        	notification.warning({
                message: '流程不可审批',
                duration: 2
            });
            return;
        }
        if(listObj.audit_status[0].status!=="已填报"){
        	notification.warning({
                message: '流程不可审批',
                duration: 2
            });
            return;
		}
		let me = this;
		if(this.state.value===1){   //通过
			getWorkflowById({id:id}).then(instance =>{
				if(instance && instance.current){
					const user = getUser();
					let postInfo={
						state:instance.current[0].id,
						executor:currentUser,
						action:"通过",
						note:note,
						attachment:null
					}
					let data={pk:id};

					let changeDocumentCode = {
						code:"schedule_" + item.unitProjecte.code
					}

					//修改文档数据
					let changeDocumentData1 = {
						"extra_params": {
							"process_data": '',
						},
						"status": "A",
						"version": "A"
					}


					let changeDocumentData2 = {
						"extra_params": {
							"process_data": dataSet,
						},
						"status": "A",
						"version": "A"
					}
					putDocument(changeDocumentCode,changeDocumentData1).then((processData)=>{
						console.log('第一次修改processData',processData)
						if(processData && processData.code){
							putDocument(changeDocumentCode,changeDocumentData2).then((value)=>{
								console.log('第二次修改processData',value)
								if(value && value.code){
									let schedule_table = {
										schedule_table:dataSet
									}
									putScheduleTable({pk:schedulepk},schedule_table).then((rst)=>{
										console.log('schedule_table',rst)
										if(rst && rst.schedule_table){
											putFlow(data,postInfo).then(rst =>{
												if(rst && rst.creator){
													
													let auditData = {
														audit_status:[{
															status:"完成"
														}]
													};
													updateSchedulerState({pk:schedulepk},auditData).then(payload =>{
														if(payload && payload._id){
															notification.success({
																message: '流程提交成功',
																duration: 2
															});
															me.onSelect(item.project,item.unitProjecte)
														}else{
															notification.error({
																message: '流程提交成功，但是日程状态改变失败',
																duration: 2
															});
															return;
														}
													});
												}else{
													notification.error({
														message: '流程提交失败',
														duration: 2
													});
													return;
												}
											});
										}
									})
								}
							})
						}
					})
				}
			});
			
		}else{   //拒绝
			if(!timePick){
				notification.error({
					message:'请选择重新填报时间',
					duration:2
				})
				return
			}
			getWorkflowById({id:id}).then(instance =>{
				if(instance && instance.current){
					let currentStateId = instance.current[0].id;
					let nextStates = getNextStates(instance,currentStateId);
					//use rejectStateID to patch deadline for previous data.
					let rejectStateID = '';
					for(var i=0;i<nextStates.length;i++){
						if(nextStates[i].action_name==='退回'){
							rejectStateID=nextStates[i].to_state[0].id
						}
					}
					let postInfo={
						state:instance.current[0].id,
						executor:currentUser,
						action:"退回",
						note:note,
						attachment:null
					}
					let data={pk:id};
					patchDeadline({ppk:instance.id,pk:rejectStateID},{deadline:timePick}).then(value =>{
						if(value && value.deadline){
							putFlow(data,postInfo).then(rst =>{
								if(rst && rst.creator){
									let auditData = {
										audit_status:[{
											status:"退回"
										}]
									};
									updateSchedulerState({pk:schedulepk},auditData).then(payload =>{
										if(payload && payload._id){
											notification.success({
												message: '流程提交成功',
												duration: 2
											});
											me.onSelect(item.project,item.unitProjecte)
										}else{
											notification.error({
												message: '流程提交成功，但是日程状态改变失败',
												duration: 2
											});
											return;
										}
									});
								}else{
									notification.error({
										message: '流程提交失败',
										duration: 2
									});
									return;
								}
							});
						}else{
							notification.error({
								message: '流程提交失败',
								duration: 2
							})
							return;
						}
					});
					
				}
			});
    		
    	}
    }

    getPeriod(period){
		switch(period){
			case 'month':
				return "每月";
			case 'day':
				return "每天";
			case 'workday':
				return "每工作日";
			case 'week':
				return "每周";
			case 'week2':
				return "每两周";
			case 'month3':
				return "每三个月";
			default :
				return "每天";
		}
	}

	render() {
		const {
			item,
			listObj
		}=this.state
		const columns = [
			{
				title:'WBS',
				dataIndex:'code',
				width: '7%'
			},{
				title:'任务名称',
				dataIndex:'name',
				width: '15%'
			},{
				title:'作业类型',
				dataIndex:'type',
				width: '10%'
			},{
				title:'单位',
				dataIndex:'company',
				width: '10%'
			},{
				title:'施工图工程量',
				dataIndex:'quantity',
				width: '10%'
			},{
				title:'产值',
				dataIndex:'output',
				width: '10%'
			},{
				title:'累计完成工程量',
				dataIndex:'total',
				width: '15%'
			},{
				title:'是否完工',
				dataIndex:'finish',
				width: '8%'
			}
		];
        // const content = (
        // 	<div>
        // 		<p>状态颜色的含义:</p>
        // 		<p style={{color:'#fac450'}}>未填报</p>
        // 		<p style={{color:'#f50'}}>已退回</p>
        // 		<p style={{color:'#108ee9'}}>已填报</p>
        // 		<p style={{color:'#C0C0C0'}}>已结束</p>
        // 	</div>
        // );
        const options = [
        	{label:'短信通知',value:'1'},
        	{label:'邮件通知',value:'2'}
        ];
        let props = {
			action: '',
			showUploadList: false
		};

		const option = [
			{ label: '本期计划工程量', value: '本期计划工程量' },
			{ label: '累计完成工程量', value: '累计完成工程量' }
		];

		listObj.subject = listObj.subject?listObj.subject:'';
		listObj.people = listObj.informant?(listObj.informant.person_name?listObj.informant.person_name:listObj.informant.username):'';
		listObj.admin = listObj.reviewer?(listObj.reviewer.person_name?listObj.reviewer.person_name:listObj.reviewer.username):'';
		listObj.starttime = listObj.fill_start_time?listObj.fill_start_time.slice(0,16):'';
		listObj.endtime = listObj.fill_end_time?listObj.fill_end_time.slice(0,16):'';
		listObj.range = listObj.time_limit?listObj.time_limit:'';
		listObj.type = listObj.content?listObj.content:[];
		listObj.remark = listObj.remark?listObj.remark:'';
		listObj.cycle = listObj.period?this.getPeriod(listObj.period):'';
		let start0 = listObj.starttime==='' ? ['',''] : listObj.starttime.split('T');
		let start1 = listObj.endtime==='' ? ['',''] : listObj.endtime.split('T');
		let btnok = listObj.subject==='' ? true : false;
		return (
			<div>
				<DynamicTitle title="进度审批" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
					</div>
				</Sidebar>
				<Content>
					<Row style={{marginBottom:'10px'}}>
						<Row style={{marginTop:10}}>
	                    	<Col span={6} style={{textAlign:'center'}}>
	                    		<span style={{fontSize:16}}>审核意见</span>
	                    		<RadioGroup 
								 onChange={(e)=>this.onRadioChange(e)} 
								 value={this.state.value}
								 style={{marginLeft:5}}
								 size="large">
									<Radio value={1}>通过</Radio>
									<Radio value={2}>退回</Radio>
								</RadioGroup>
	                    	</Col>
	                    	<Col span={16}>
	                    		<span style={{fontSize:16,marginRight:5}}>并请在</span>
	                    		<DatePicker 
	                    		 onChange={(date,dateString)=>this.onTimeChange(date,dateString)}
	                    		 disabled={this.state.pickergo} />
	                    		<span style={{fontSize:16,marginLeft:5}}>前完成进度计划调整并重新提交</span>
	                    	</Col>
	                    	<Col span={2} style={{float:'right'}}>
								<Button 
								 type="primary" 
								 icon="check" 
								 disabled={btnok}
								 onClick={()=>this.onSubmitClick()}>提交</Button>
							</Col>
	                    </Row>
	                     <Row style={{marginTop:5}}>
	                    	<Input.TextArea id='remark' rows={4} placeholder="请填写审核意见"/>
	                    </Row>
					</Row>
					<Row >
						<Row style={{float:'left',width:285}}>
							<Card>
								<Row>
									<Button 
									 type="primary" 
									 icon="calendar" 
									 size="large"
									 disabled={this.state.downfinish}
									 onClick={()=>this.popScheduler()}
									 >选择日程</Button>
									 {/*<Popover placement="rightTop" content={content} trigger="hover">
			                            <Button 
			                             type="primary" 
			                             style={{marginLeft:12}}
			                             size="large"
			                             icon="paper-clip"
			                             >颜色示例</Button>
									</Popover>*/}
								</Row>
								<Row style={{marginTop:15}}>
									<span style={{fontSize:16}}>{`项目：${item?(item.project?item.project.name:''):''}`}</span>
								</Row>
								<Row style={{marginTop:20}}>
									<span style={{fontSize:16}}>{`单位工程：${item?(item.unitProjecte?item.unitProjecte.name:''):''}`}</span>
								</Row>
								<Row style={{marginTop:20}}>
									<span style={{fontSize:16}}>{`主题：${listObj.subject}`}</span>
								</Row>
								<Row style={{marginTop:20}}>
									<span style={{fontSize:16}}>{`填报人： ${listObj.people}`}</span>
								</Row>
								<Row style={{marginTop:20}}>
									<Col span={8}>
										<p>{`${start0[0]}`}</p>
										<span style={{fontSize:20}}>{`${start0[1]}`}</span>
									</Col>
									<Col span={5} style={{marginTop:10}}>
										<Button icon="right"></Button>
									</Col>
									<Col span={10}>
										<p>{`${start1[0]}`}</p>
										<span style={{fontSize:20}}>{`${start1[1]}`}</span>
									</Col>
								</Row>
								<Row style={{marginTop:20}}>
									<span style={{fontSize:16}}>{`审核人： ${listObj.admin}`}</span>
								</Row>
								<Row style={{marginTop:20}}>
									<span style={{fontSize:16}}>{`审核时限： ${listObj.range}  天`}</span>
								</Row>
								<Row style={{marginTop:10}}>
									<Card>
										<Row><span style={{fontSize:16}}>填报内容：</span></Row>
											<Row>
												<CheckboxGroup options={option} value={`${listObj.type}`}/>
											</Row>
									</Card>
								</Row>
								<Row  style={{marginTop:10}}><span style={{fontSize:16,marginTop:10}}>{`周期： ${listObj.cycle}`}</span></Row>
								<p style={{fontSize:16}}>备注</p>
								<Input 
								 value={listObj.remark===""?'no remark here':listObj.remark}
								 style={{marginTop:3}}
								 disabled={true}/>
							</Card>
						</Row>
						<Row style={{display:'inline-block',width:"calc(100% - 290px)",marginLeft:'5px'}}>
							<Card>
								<Row>
									<Table 
				                     columns={columns} 
				                     dataSource={this.state.dataSet}
				                     bordered
				                     style={{marginTop:20}}
				                    />
								</Row>
							</Card>
						</Row>
					</Row>
				</Content>
				<Modal
				 title="选择日程"
				 key={this.state.newKey}
				 visible={this.state.setSchedulerVisiable}
				 width="1000"
				 maskClosable={false}
				 onCancel={()=>this.goCancel()}
				 footer={null}
				>
					<Calendar 
					 dateCellRender={(value)=>this.dateCellRender(value)} 
			         onSelect={(date)=>this.onCardClick(date)}
					 monthCellRender={(value)=>this.monthCellRender(value)}
					 />
				</Modal>
			</div>);
	}
};
export default Form.create()(Approve);
