import React, {Component} from 'react';
import {DynamicTitle,Content,Sidebar} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {connect} from 'react-redux';
import {actions as schedulerActions} from '../store/scheduler';
import {bindActionCreators} from 'redux';
import AddScheduler from '../components/Scheduler/AddScheduler';
import {actions as scheduleWorkflowActions} from '../store/scheduleWorkflow';
import moment from 'moment';
import {Link} from 'react-router-dom';
import Schedule from './Schedule.css';
import { Calendar,Modal,Form,Card,Button,Row,Col,message,notification } from 'antd';

@connect(
	state => {
		const {schedule:{scheduler = {},scheduleWorkflow={}},platform} = state;
		return {platform,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...schedulerActions,...scheduleWorkflowActions}, dispatch)
	})
)

class Scheduler extends Component {
	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			newKey:Math.random(),
			setAddVisiable:false,
			item:null,
			unit:null,
			peopleList:'',
			schedulerList:[],
			constructionUnitOrgs:[],
			supervisionUnitOrgs:[],
			addDisabled:false
		};
	}

	onEditClick = () => {
		const{
			addDisabled
		}=this.state
		if(addDisabled){
			notification.error({
				message: '该单位工程已发起日程，不能再次发起',
				duration:2
            });
		}else{
			this.setState({newKey:Math.random(),setAddVisiable:true});
		}
	}

	componentDidMount(){
		const {getProjectTree,getScheduler} = this.props.actions;
		//获取最初始的树节点
		let supervisionUnitOrgs = [];
		let constructionUnitOrgs = [];
		getProjectTree({},{depth:2}).then((rst)=>{
			if(rst && rst.children && rst.children.length>0){
				let project=rst.children;
				for(var i=0;i<project.length;i++){
					if(project[i].children.length>0){
						let unitProjecte=project[i].children[0];
						console.log('unitProjecte',unitProjecte);
						this.setState({
							item:{
								unitProjecte:unitProjecte,
								project:project[i]
							}
						});
						if(unitProjecte && unitProjecte.extra_params && unitProjecte.extra_params.unit){
							for(var s=0;s<unitProjecte.extra_params.unit.length;s++){
								if(unitProjecte.extra_params.unit[s].code && unitProjecte.extra_params.unit[s].code!='' && 
								unitProjecte.extra_params.unit[s].code.substring(0,1) ==='C'){
									constructionUnitOrgs.push(unitProjecte.extra_params.unit[s])
								}else if(unitProjecte.extra_params.unit[s].code && unitProjecte.extra_params.unit[s].code!='' && 
								unitProjecte.extra_params.unit[s].code.substring(0,1) ==='J'){
									supervisionUnitOrgs.push(unitProjecte.extra_params.unit[s])
								}
							}
							if(constructionUnitOrgs.length>0){
								this.setState({
									constructionUnitOrgs:constructionUnitOrgs
								})
							}
							if(supervisionUnitOrgs.length>0){
								this.setState({
									supervisionUnitOrgs:supervisionUnitOrgs
								})
							}

						}
						getScheduler({},{project:project[i].pk,unit:unitProjecte.pk}).then(result =>{
							if(result && result.results && result.results.length>0){
								this.setState({
									schedulerList:result.results,
									addDisabled:true
								});
							}else{
								this.setState({
									schedulerList:[],
									addDisabled:false
								});
							}
						});
						return;
					}
				}
			}
		});
	}


	setEditData = () => {
		const {item} = this.state;
		if(!item){
			return;
		}
		const {postScheduler,getScheduler} = this.props.actions;
		
		this.props.form.validateFields((err,values) => {
			console.log('this.props',this.props)
			console.log('this.props.scheduler.reportMember',this.props.scheduler.reportMember)
			console.log('this.props.scheduler.approvalMember',this.props.scheduler.approvalMember)
			let postData = {};
			let item = this.state.item;
			postData.project = item.project.pk;
			postData.unit = item.unitProjecte.pk;
            if(!err){
				let data = {};
				postData.subject = values.subject;
				postData.time_limit = values.range;
				postData.informant = this.props.scheduler.reportMember;
				postData.reviewer = this.props.scheduler.approvalMember;
				postData.content = values.type;
				postData.period = values.cycle;
				postData.remark = values.remark;
				postData.fill_start_time = moment(values.starttime[0]._d).add(8,'hours').unix();
				postData.fill_end_time = moment(values.starttime[1]._d).add(8,'hours').unix();
                postScheduler({},postData).then(rst =>{
                	if(rst._id){
                		message.info('添加成功');
                		getScheduler({},{project:item.project.pk,unit:item.unitProjecte.pk}).then(result =>{
							if(result.results.length>0){
								this.setState({schedulerList:result.results});
							}else{
								this.setState({schedulerList:[]});
							}
						});
                	}else{
                		message.info('添加失败');
                	}
                });
                this.setState({setAddVisiable:false});
            }
        }); 
	}
	

	goCancel = () => {
		this.setState({setAddVisiable:false});
	}

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
					}else if(schedulerList[i].audit_status[0].status==="已填报"){
						listData.push({type:'normal',content:schedulerList[i].subject+'(已填报)'});
					}else if(schedulerList[i].audit_status[0].status==="退回"){
						listData.push({type:'error',content:schedulerList[i].subject+'(被退回)'});
					}else if(schedulerList[i].audit_status[0].status==="完成"){
						listData.push({type:'finish',content:schedulerList[i].subject+'(已完成)'});
					}
				}
			 
			}
		}
		return listData;
	}

	getMonthData(value) {
	  if (value.month() === 8) {
	    return 1394;
	  }
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

	monthCellRender(value) {
	  const num = this.getMonthData(value);
	  return num ? <div className="notes-month">
	    <section>{num}</section>
	    <span>Backlog number</span>
	  </div> : null;
	}

	onSelect = (project,unitProjecte)=>{
		const{
			actions:{
				getScheduler
			}
		}=this.props;
		//选择最下级的工程
		let constructionUnitOrgs = [];
		let supervisionUnitOrgs = [];
		if(unitProjecte){
			this.setState({
				item:{
					unitProjecte:unitProjecte,
					project:project
				}
			});

			if(unitProjecte && unitProjecte.extra_params && unitProjecte.extra_params.unit){
				for(var s=0;s<unitProjecte.extra_params.unit.length;s++){
					if(unitProjecte.extra_params.unit[s].code && unitProjecte.extra_params.unit[s].code!='' && 
					unitProjecte.extra_params.unit[s].code.substring(0,1) ==='C'){
						constructionUnitOrgs.push(unitProjecte.extra_params.unit[s])
					}else if(unitProjecte.extra_params.unit[s].code && unitProjecte.extra_params.unit[s].code!='' && 
					unitProjecte.extra_params.unit[s].code.substring(0,1) ==='J'){
						supervisionUnitOrgs.push(unitProjecte.extra_params.unit[s])
					}
				}
				if(constructionUnitOrgs.length>0){
					this.setState({
						constructionUnitOrgs:constructionUnitOrgs
					})
				}
				if(supervisionUnitOrgs.length>0){
					this.setState({
						supervisionUnitOrgs:supervisionUnitOrgs
					})
				}

			}
			getScheduler({},{project:project.pk,unit:unitProjecte.pk}).then(result =>{
				if(result && result.results && result.results.length>0){
					this.setState({
						schedulerList:result.results,
						addDisabled:true
					});
				}else{
					this.setState({
						schedulerList:[],
						addDisabled:false
					});
				}
			});
		}
	};

	render() {
		const{
			addDisabled
		}=this.state
		return (
			<div>
				<DynamicTitle title="管控日程" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
					</div>
				</Sidebar>
				<Content>
					<Row>
						<Col span={22}>
							<Card>
								<Calendar 
								 dateCellRender={(value)=>this.dateCellRender(value)} 
								 monthCellRender={(value)=>this.monthCellRender(value)}
								 />
							</Card>
						</Col>
						<Col style={{marginLeft:5}} span={1}>
							<Button 
							 style={{float:'right'}} 
							 type="primary"
							 disabled={addDisabled}
							 onClick={()=>this.onEditClick()}>新增</Button>
						</Col>
					</Row>
				</Content>
				<Modal
				 title="新建日程"
				 key={this.state.newKey}
				 visible={this.state.setAddVisiable}
				 onOk={()=>this.setEditData()}
				 maskClosable={false}
				 onCancel={()=>this.goCancel()}>
					<AddScheduler {...this.props} {...this.state} />
				</Modal>
			</div>);
	}
};
export default Form.create()(Scheduler);
