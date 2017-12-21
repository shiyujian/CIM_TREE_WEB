import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {getUser} from '_platform/auth';
import {connect} from 'react-redux';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import EditData from '../components/Stage/EditData';
import moment from 'moment';
import {SERVICE_API} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util';
import './Schedule.less';
import {Link} from 'react-router-dom';
import {WORKFLOW_CODE} from '_platform/api';
import {SMUrl_template11} from '_platform/api';
import EditableCell from '../components/EditableCell';
import EditableCheckbox from '../components/EditableCheckbox';
import queryString from 'query-string';


import {Row, Col,Spin, Card, DatePicker, Upload,Icon,notification,message,
	Input,Button,Modal,Table,Form,Select,Radio,Calendar,Checkbox,Popover} from 'antd';
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

class Stage extends Component {
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
			setSchedulerVisiable:false,
			listObj:{},
			execdate:'',
			schedulerList:[],
			downfinish:true,
			limitdays:0,
			nextExcutor:{},
			btnok:true,
			item:null,
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
		let {stageReportID='0'} = queryString.parse(location.search) || {};

		if(stageReportID==='0'){
			console.log('totalID',0)
			//获取最初始的树节点
			// getProjectTree({},{depth:2}).then((rst)=>{
			// 	if(rst && rst.children && rst.children.length>0){
			// 		let project=rst.children;
			// 		for(var i=0;i<project.length;i++){
			// 			if(project[i].children.length>0){
			// 				let unitProjecte=project[i].children[0];
			// 				console.log('unitProjecte',unitProjecte);
			// 				me.setState({
			// 					item:{
			// 						unitProjecte:unitProjecte,
			// 						project:project[i]
			// 					},
			// 				});
			// 				const usr = getUser();  //,informant:id
			// 				const id = usr.id;
			// 				getScheduler({},{project:project[i].pk,unit:unitProjecte.pk,informant:id}).then(result =>{
			// 					if(result && result.results && result.results.length>0){
			// 						me.setState({schedulerList:result.results,downfinish:false});
			// 					}else{
			// 						notification.info({
			// 							message: '当前单位工程无日程可查询',
			// 							duration: 2
			// 						});
			// 					}
			// 				});
			// 				return;
			// 			}
			// 		}
			// 	}
			// });
		}else{
			
			getWorkflowById({ id: stageReportID }).then((instance)=>{
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
						},()=>{
							me.onSelect(project,unitProjecte)
						})
					}
				}
			})
		}
	}


	popScheduler = () =>{
		this.setState({newKey:Math.random(),setSchedulerVisiable:true});
	}

	goCancel = () => {
		this.setState({setSchedulerVisiable:false});
	}
	//左侧树点击事件
	onSelect = (project,unitProjecte)=>{
		const{
			actions:{
				getScheduler,
				getDocument,
				getProcessData
			},
			location={}
		}=this.props
		const{
			date,
			defaultState
		}=this.state;
		let me = this;
		let {stageReportID='0'} = queryString.parse(location.search) || {};
			
		if(unitProjecte){
			me.setState({
				item:{
					unitProjecte:unitProjecte,
					project:project
				}
			})
			const user = getUser();
			const id = user.id;   //,informant:id
			let table = [];
			getScheduler({},{project:project.pk,unit:unitProjecte.pk,informant:id}).then(result =>{
				if(result && result.results && result.results.length>0){
					me.setState({
						schedulerList:result.results,
						downfinish:false
					});
					let datastr = '';
					let downState = true;
					for(let i=0;i<result.results.length;i++){
						if(result.results[i].audit_status){
							if(result.results[i].audit_status.length===0 || result.results[i].audit_status[0].status==="退回"){
								downState = false
							}
						}
					}
					if(downState){
						me.setState({
							schedulerList:[],
							downfinish:true,
							dataSet:[],
							listObj:{},
							btnok:true
						});
						notification.info({
							message: '当前单位工程无日程可查询',
							duration: 2
						});
						return;
					}


					let workflowData = {
						code:"schedule_"+unitProjecte.code
					}
					getDocument(workflowData).then((rst)=>{
						console.log('document',rst)
						if(rst && rst.code && rst.extra_params){
							if(rst && rst.code && rst.extra_params && rst.extra_params.process_data){
								let process_data = rst.extra_params.process_data
								for(var i=0;i<process_data.length;i++){
									if(process_data[i].actual_end_time){
										table.push({
											code:process_data[i].code?process_data[i].code:'',
											name:process_data[i].name?process_data[i].name:'',
											type:process_data[i].type?process_data[i].type:'',
											company:process_data[i].company?process_data[i].company:'',
											quantity:process_data[i].quantity?process_data[i].quantity:'',
											output:process_data[i].output?process_data[i].output:'',
											finish:'是',
		
											startTime: process_data[i].startTime?process_data[i].startTime:'',
											plan_end_time: process_data[i].endTime?moment(process_data[i].endTime).format('YYYY-MM-DD'):'',
											actual_end_time:process_data[i].actual_end_time?process_data[i].actual_end_time:'',
											schedule: process_data[i].schedule?process_data[i].schedule:'',
											path: process_data[i].path?process_data[i].path:'',
											milestone: process_data[i].milestone?process_data[i].milestone:'',
											site: process_data[i].site?process_data[i].site:'',
											duration:process_data[i].duration?process_data[i].duration:'',
											total:process_data[i].total?process_data[i].total:'',
											editDisabled:true
										})
									}else{
										table.push({
											code:process_data[i].code?process_data[i].code:'',
											name:process_data[i].name?process_data[i].name:'',
											type:process_data[i].type?process_data[i].type:'',
											company:process_data[i].company?process_data[i].company:'',
											quantity:process_data[i].quantity?process_data[i].quantity:'',
											output:process_data[i].output?process_data[i].output:'',
											finish:'否',
		
											startTime: process_data[i].startTime?process_data[i].startTime:'',
											plan_end_time: process_data[i].endTime?moment(process_data[i].endTime).format('YYYY-MM-DD'):'',
											actual_end_time:null,
											schedule: process_data[i].schedule?process_data[i].schedule:'',
											path: process_data[i].path?process_data[i].path:'',
											milestone: process_data[i].milestone?process_data[i].milestone:'',
											site: process_data[i].site?process_data[i].site:'',
											duration:process_data[i].duration?process_data[i].duration:'',
											editDisabled:false
										})
									}
	
									me.setState({
										dataSet:table,
										btnok:true,
										listObj:{}
									})
		
									if(defaultState){
										console.log('stageReportID',stageReportID)
										if(date){
											me.setState({
												defaultState:false
											},()=>{
												me.onCardClick(date)
											})
										}
									}else{
										console.log('stageReportID',stageReportID)
									}
								}
							}else if(rst && rst.code && rst.extra_params && rst.extra_params.scheduleMaster){
								let schedule = rst.extra_params.scheduleMaster
								for(var i=0;i<schedule.length;i++){
									table.push({
										code:schedule[i].code?schedule[i].code:'',
										name:schedule[i].name?schedule[i].name:'',
										type:schedule[i].type?schedule[i].type:'',
										company:schedule[i].company?schedule[i].company:'',
										quantity:schedule[i].quantity?schedule[i].quantity:'',
										output:schedule[i].output?schedule[i].output:'',
										finish:'否',
	
										startTime: schedule[i].startTime?schedule[i].startTime:'',
										plan_end_time: schedule[i].endTime?moment(schedule[i].endTime).format('YYYY-MM-DD'):'',
										actual_end_time:null,
										schedule: schedule[i].schedule?schedule[i].schedule:'',
										path: schedule[i].path?schedule[i].path:'',
										milestone: schedule[i].milestone?schedule[i].milestone:'',
										site: schedule[i].site?schedule[i].site:'',
										duration:schedule[i].duration?schedule[i].duration:'',
										editDisabled:false
									})
								}
								me.setState({
									dataSet:table,
									btnok:true,
									listObj:{}
								})
	
								if(defaultState){
									console.log('stageReportID',stageReportID)
									if(date){
										me.setState({
											defaultState:false
										},()=>{
											me.onCardClick(date)
										})
									}
								}else{
									console.log('stageReportID',stageReportID)
								}
							}else{
								me.setState({
									schedulerList:[],
									downfinish:true,
									dataSet:[],
									listObj:{},
									btnok:true
								});
								notification.info({
									message: '当前单位工程未完成总进度计划报批流程',
									duration: 2
								});
							}
						}else{
							me.setState({
								schedulerList:[],
								downfinish:true,
								dataSet:[],
								listObj:{},
								btnok:true
							});
							notification.info({
								message: '当前单位工程未完成总进度计划报批流程',
								duration: 2
							});
						}
					})
				}else{
					me.setState({
						schedulerList:[],
						downfinish:true,
						dataSet:[],
						listObj:{},
						btnok:true
					});
					notification.info({
		                message: '当前单位工程无日程可查询',
		                duration: 2
		            });
				}
			});
		}
    };
	//在日历表中显示未发起和已退回
	getListData(value) {
		let listData = [];
		const schedulerList = this.state.schedulerList;
		let datastr = '';
		for(let i=0;i<schedulerList.length;i++){
			datastr = schedulerList[i].created_date.slice(0,10);
			if(value.format('YYYY-MM-DD') === datastr){
				if(schedulerList[i].audit_status){
					if(schedulerList[i].audit_status.length===0){
						listData.push({type:'warning',content:schedulerList[i].subject+'(未发起)'});
					}else if(schedulerList[i].audit_status[0].status==="退回"){
						listData.push({type:'error',content:schedulerList[i].subject+'(已退回)'});
					}else if(schedulerList[i].audit_status[0].status==="已填报"){
						console.log('已填报')
					}
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
		//当前操作流程日期
		this.setState({execdate:moment(date).format('YYYY-MM-DD')});
		const {schedulerList} = this.state;
    	for(let i=0;i<schedulerList.length;i++){
    		if(moment(date).format('YYYY-MM-DD') === schedulerList[i].created_date.slice(0,10)){
				if(schedulerList[i].audit_status.length===0 || schedulerList[i].audit_status[0].status==="退回"){
					this.setState({
						listObj:schedulerList[i],
						setSchedulerVisiable:false,
						limitdays:schedulerList[i].time_limit,
						nextExcutor:schedulerList[i].reviewer,
						btnok:false
					});
					return;
				}else{
					notification.error({
						message:'选择的日期不存在待填报日程',
						duration:2
					})
					this.setState({
						listObj:{},
						setSchedulerVisiable:false,
						limitdays:0,
						nextExcutor:{},
						btnok:true
					});
				}
    			
    		}
		}
		this.setState({
			listObj:{},
			setSchedulerVisiable:false,
			limitdays:0,
			nextExcutor:{},
			btnok:true
		});
    }


    onSubmitFlow = () => {
    	const {
			dataSet,
			execdate='',
			item,
			listObj,
			limitdays
		} = this.state;
    	if(dataSet.length===0){
    		notification.error({
    			message:'请上传进度表',
    			duration:2
    		})
    		return;
    	}
    	const 
    		{actions:{
    			createFlow, 
				putFlow,
                getWorkflowById,
                patchDeadline,
                updateSchedulerState,
                correlateSchedulerAndWorkflow,
				postSubject,
				putScheduleTable
            }
		} = this.props;


		let subject = [{
			"date":JSON.stringify(execdate),
			"project":JSON.stringify({"pk": item.project.pk, "code": item.project.code, "obj_type": item.project.obj_type,name:item.project.name}),
			"unit": JSON.stringify({"pk": item.unitProjecte.pk, "code": item.unitProjecte.code, "obj_type": item.unitProjecte.obj_type,name:item.unitProjecte.name})
		}];

		const usr = getUser();
		const currentUser = {
			"username": usr.username,
			"person_code": usr.code,
			"person_name": usr.name,
			"id": parseInt(usr.id)
		};
		
		let postSub = {
			subject:subject
		}
		let me = this;
        if(listObj.audit_status.length===0){   //still no flow was create
	        let WORKFLOW_MAP = {
	            name:"进度管控审批流程",
	            desc:"进度管理进度管控审批流程",
	            code:WORKFLOW_CODE.进度管控审批流程
	        };

	        let postdata={
	            name: WORKFLOW_MAP.name,
	            description: WORKFLOW_MAP.desc,
	            subject: subject,
	            code: WORKFLOW_MAP.code,
	            creator: currentUser,
	            plan_start_time: moment().format('YYYY-MM-DD'),
	            deadline: null,
	            "status":2
	        }
	        createFlow({},postdata).then((instance)=>{
	        	if(!instance.id){
	        		notification.error({
	        			message:'数据提交失败',
	        			duration:2
	        		})
	        		return;
				}
	        	const {id,workflow: {states = []} = {}} = instance;
		        const [{id:state_id,actions:[action]}] = states;
		        const {nextExcutor,listObj} = this.state;
		        let deadline = listObj.created_date?listObj.created_date.slice(0,10):null;
				let schedulepk = listObj._id ? listObj._id : ''; 
				
				getWorkflowById({id:id}).then(instance =>{
					if(instance && instance.current){
						let currentStateId = instance.current[0].id;
						let nextStates = getNextStates(instance,currentStateId);
						console.log('nextStates',nextStates)
						let stateid = nextStates[0].to_state[0].id;
						
						//修改当前节点的deadline
						patchDeadline({ppk:instance.id,pk:currentStateId},{deadline:deadline}).then(value =>{
							if(value && value.deadline){
	
								let schedule_report = {
									schedule_report:dataSet
								}
								
								//修改日程中的schedule_report
								putScheduleTable({pk:schedulepk},schedule_report).then((rst)=>{
									console.log('schedule_report',rst)
									if(rst && rst.schedule_report){

										let postInfo={
											next_states:[{
												state:stateid,
												participants:[nextExcutor],
												deadline:moment().add(limitdays,'days').format('YYYY-MM-DD'),
												remark:null
											}],
											state:instance.workflow.states[0].id,
											executor:currentUser,
											action:nextStates[0].action_name,
											note:"填写完毕，请审批。",
											attachment:null
										}
										let data={pk:id};
										//提交流程到下一步
										putFlow(data,postInfo).then(rst =>{
											if(rst && rst.creator){
												//create flow success,then bind flow and scheduler
												let workflowID = [];
												workflowID.push(id+"");
												correlateSchedulerAndWorkflow({pk:schedulepk},workflowID).then(payload =>{
													if(payload && payload._id){
					
													}else{
														notification.error({
															message: '流程提交失败',
															duration: 2
														});
														return;
													}
												});
												let auditData = {
													audit_status:[{
														status:"已填报"
													}]
												};
												//修改日程状态
												updateSchedulerState({pk:schedulepk},auditData).then(payload =>{
													if(payload && payload._id){
														notification.success({
															message: '流程提交成功',
															duration: 2
														});
													}else{
														notification.error({
															message: '流程提交失败',
															duration: 2
														});
														return;
													}
												});
												me.onSelect(item.project,item.unitProjecte)
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
		        
	        });
        }else if(listObj.audit_status.state!=="退回"){   //there is a flow has been create
        	
	        const {nextExcutor,listObj} = this.state;
	        const id = listObj.flow[0];
	        let schedulepk = listObj._id ? listObj._id : ''; 
			
			getWorkflowById({id:id}).then(instance =>{
				if(instance && instance.current){
					let currentStateId = instance.current[0].id;
					let nextStates = getNextStates(instance,currentStateId);
					if(nextStates[0].to_state.length===0){
						notification.error({
							message: '流程已经发起',
							duration: 2
						});
						return;
					}
					let stateid = nextStates[0].to_state[0].id;
					postSubject({pk:instance.id},postSub).then(rst =>{
						console.log(rst);
					});

					let schedule_report = {
						schedule_report:dataSet
					}
					putScheduleTable({pk:schedulepk},schedule_report).then((rst)=>{
						console.log('schedule_report',rst)
						if(rst && rst.schedule_report){
							let postInfo={
								next_states:[{
									state:stateid,
									participants:[nextExcutor],
									deadline:moment().add(limitdays,'days').format('YYYY-MM-DD'),
									remark:null
								}],
								state:instance.workflow.states[0].id,
								executor:currentUser,
								action:nextStates[0].action_name,
								note:"填写完毕，请审批。",
								attachment:null
							}
							let data={pk:id};
							putFlow(data,postInfo).then(rst =>{
								if(rst && rst.creator){
									let auditData = {
										audit_status:[{
											status:"已填报"
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
									});
									return;
								}
							});
						}
					})
					
					
				}
			});
        }else{
        	notification.error({
                message: '流程已经发起成功',
                duration: 2
            });
            return;
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

	onCellChange = ( index, key ,record ) => {      //编辑某个单元格
		
		return (value) => {
			
			const{
				dataSet
			}=this.state
			console.log('onCellChange',dataSet[index])
			dataSet[index] = {
				code: dataSet[index].code,
				name: dataSet[index].name,
				type: dataSet[index].type,
				company: dataSet[index].company,
				quantity: dataSet[index].quantity,
				output: dataSet[index].output,
				total: value,
				finish:dataSet[index].finish,

				startTime: dataSet[index].startTime,
				plan_end_time: dataSet[index].plan_end_time,
				actual_end_time:dataSet[index].actual_end_time,
				schedule: dataSet[index].schedule,
				path: dataSet[index].path,
				milestone: dataSet[index].milestone,
				site: dataSet[index].site,
				duration:dataSet[index].duration,
				editDisabled:dataSet[index].editDisabled
			}
			console.log('onCellChange',dataSet[index])
			this.setState({
				dataSet
			})
			record[key] = value;
        };
	}

	checkBoxChange = ( index, key ,record ) => {
		return (value) => {
			const{
				dataSet
			}=this.state
			if(value){
				console.log('date',moment().format('YYYY-MM-DDTHH:mm:ss'))
				console.log('date1',dataSet[index].plan_end_time)
				console.log('onCellChange',dataSet[index])
				dataSet[index] = {
					code: dataSet[index].code,
					name: dataSet[index].name,
					type: dataSet[index].type,
					company: dataSet[index].company,
					quantity: dataSet[index].quantity,
					output: dataSet[index].output,
					total: dataSet[index].total?dataSet[index].total:0,
					finish:'是',
					startTime: dataSet[index].startTime,
					plan_end_time: dataSet[index].plan_end_time,
					actual_end_time:moment().format('YYYY-MM-DDTHH:mm:ss'),
					schedule: dataSet[index].schedule,
					path: dataSet[index].path,
					milestone: dataSet[index].milestone,
					site: dataSet[index].site,
					duration:dataSet[index].duration,
					editDisabled:dataSet[index].editDisabled
				}
			}else{
				console.log('value',value)
				console.log('onCellChange',dataSet[index])
				dataSet[index] = {
					code: dataSet[index].code,
					name: dataSet[index].name,
					type: dataSet[index].type,
					company: dataSet[index].company,
					quantity: dataSet[index].quantity,
					output: dataSet[index].output,
					total: dataSet[index].total?dataSet[index].total:0,
					finish:'否',
					startTime: dataSet[index].startTime,
					plan_end_time: dataSet[index].plan_end_time,
					actual_end_time:null,
					schedule: dataSet[index].schedule,
					path: dataSet[index].path,
					milestone: dataSet[index].milestone,
					site: dataSet[index].site,
					duration:dataSet[index].duration,
					editDisabled:dataSet[index].editDisabled
				}
			}
			
			console.log('onCellChange',dataSet[index])
			this.setState({
				dataSet
			})
			record[key] = value;
		}
	}

	render() {
		const {
			btnok,
			listObj,
			item
		}=this.state
		
		const columns = [
			{
				title:'WBS',
				dataIndex:'code',
				key: 'code',
				width: '7%'
			},{
				title:'任务名称',
				dataIndex:'name',
				key: 'name',
				width: '15%'
			},{
				title:'作业类型',
				dataIndex:'type',
				key: 'type',
				width: '10%'
			},{
				title:'单位',
				dataIndex:'company',
				key: 'company',
				width: '10%'
			},{
				title:'施工图工程量',
				dataIndex:'quantity',
				key: 'quantity',
				width: '10%'
			},{
				title:'产值',
				dataIndex:'output',
				key: 'output',
				width: '10%'
			},{
				title:'累计完成工程量',
				dataIndex:'total',
				key: 'total',
				width: '15%',
				render: (text, record ,index) => (
					<div>
						{
							
							record.editDisabled
							?
							<span>{text}</span>
							:
							(text != undefined
							?
							<EditableCell
								value={ text }
								editOnOff = { false }
								onChange={ this.onCellChange( index , "total", record) }
							/>
							:
							<EditableCell
								value={ 0 }
								editOnOff = { true }
								onChange={ this.onCellChange( index , "total", record) }
							/>)
					 	}
					</div>
				)
			},{
				title:'是否完工',
				dataIndex:'finsh',
				key: 'finsh',
				width: '8%',
				render: (text, record ,index) => (
					<div>
						{
							<EditableCheckbox
							editDisabled={record.editDisabled}
							onChange={ this.checkBoxChange( index , "finsh", record) }
							/>
						}
					</div>
				)
			}
		];

		const content = (
        	<div>
        		<p>状态颜色的含义:</p>
        		<p style={{color:'#fac450'}}>待填报</p>
        		<p style={{color:'#f50'}}>被退回</p>
        		<p style={{color:'#108ee9'}}>已发起</p>
        		<p style={{color:'#C0C0C0'}}>已结束</p>
        	</div>
        );
		const options = [
			{ label: '本期计划工程量', value: '本期计划工程量' },
			{ label: '累计完成工程量', value: '累计完成工程量' }
		];

		let dataSource = [];


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

		console.log('this.state.dataSet',this.state.dataSet)
		return (
			<div>
				<DynamicTitle title="进度填报" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
					</div>
				</Sidebar>
				<Content>
					<div style={{float:'left',width:285}}>
						<Card>
							<Row>
								<Button 
								 type="primary" 
								 icon="calendar" 
								 disabled={this.state.downfinish}
								 size="large"
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
										<CheckboxGroup options={options} value={`${listObj.type}`}/>
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
					</div>
					<div style={{display:'inline-block',width:"calc(100% - 290px)"}}>
						<Card>
							<Row>
								<Col span={6}>
						
								</Col>
								<Col span={6}>
									
								</Col>
								<Col span={2} style={{float:'right'}}>
									<Button 
									 type="primary" 
									 icon="check" 
									 disabled={btnok}
									 onClick={()=>this.onSubmitFlow()}>提交</Button>
								</Col>
							</Row>
							<Row>
								{
									btnok?
									<Table 
									columns={columns} 
									dataSource={dataSource}
									bordered
									style={{marginTop:20}}
									/>:
									<Table 
									columns={columns} 
									dataSource={this.state.dataSet}
									bordered
									style={{marginTop:20}}
									/>
								}
							</Row>
						</Card>
					</div>
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
					 monthCellRender={(value)=>this.monthCellRender(value)}
			         onSelect={(date)=>this.onCardClick(date)}
					 />
				</Modal>
			</div>);
	}
};


export default Form.create()(Stage);
