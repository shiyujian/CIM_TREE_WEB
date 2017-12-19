import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Upload, Modal, message  } from 'antd';
import moment from 'moment';
import './index.css';
import Dragger from '_platform/components/panels/Dragger';
import PerCarbon from './PerCarbon';
import DelayPerCarbon from './DelayPerCarbon';
import {getUser} from '_platform/auth';
import {SERVICE_API,SCHEDULE_TOTAL_PLAN_URL,WORKFLOW_CODE} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util'
const uuidv4 = require('uuid/v4');
const Option = Select.Option;


export default class DelayReportTable extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            unitProjecte:[],
            project:[],
            delayVisible:false,
            emailNoticeState:false,
            messageNoticeState:false,
            unitStage:'',
            protectStage:'',
            workflowDetail:null,
            oldReportTime:null,
            delayReportTime:null,
            delayReportValue:null,
            delayApprovalTime:null,
            itemProject:null,
            delayReportWorkflow:false
        }
        //点击单位工程树所查找的流程
        this.constructionMember = null;

        //申请推迟填报的流程
        this.creator = null;
        this.delayUnitStage = null;
        this.constructionMember = null;
        this.delayReportTime = null;
        this.delayApprovalLimit = null;
    }
 
    componentDidMount(){
        const {getProjectTree} = this.props.actions;
        let unitProjecte=[];
        let test=[];
        //申请推迟填报时需要选择项目和单位工程
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                for(var i=0;i<rst.children.length;i++){
                    let project=rst.children[i]
                    test.push(project)
                    if(project.children.length>0){
                        for(var t=0; t<project.children.length;t++){
                            let item=project.children[t]
                            unitProjecte.push(item)
                        }
                    }
                }
                this.setState({
                    unitProjecte:unitProjecte,
                    project:test
                })
            }
        })
    }

    render() { //todo 
        const {
            protectStage,
            project
        }=this.state
		return (
                <div style={{display:'inline-block'}}>
                    {/*<Button type='primary' style={{marginLeft:20}} onClick={this.handleDelay.bind(this)}>申请推迟填报</Button>*/}
                    <Button type='primary' style={{marginLeft:20}} onClick={this.handleDelay.bind(this)}>申请推迟填报</Button>
                    <Modal
                        visible={this.state.delayVisible}
                        onOk={this.delayHandleAction.bind(this)}
                        onCancel={this.delayRejectAction.bind(this)}
                        okText={'提交'}
                        cancelText={'返回'}
                    >
                        <h2 className='title'>申请推迟填报</h2>
                        <Row className='mb10'>
                            <Col span={24} >
                                <Row className='mb10' gutter={10}>
                                    <Col span={12}>
                                        <label  style={{minWidth: 40,display: 'inline-block'}} htmlFor="">项目:</label>
                                        <div className="item_input">
                                            <Select size={'small'} style={{ width: '100%' }}
                                                value={this.state.protectStage}
                                                onChange={this.projectChange.bind(this)}
                                            >
                                                {project.map((pro)=>{
                                                    return <Option value={pro.code} key={pro.pk} >{pro.name}</Option>
                                                })}
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">单位工程:</label>
                                        <div className="start_input">
                                            <Select size={'small'} style={{ width: '100%' }}
                                                value={this.state.unit}
                                                onChange={this.unitStageChange.bind(this)}
                                            >
                                                {project.map((pro)=>{
                                                    if(pro.code=== protectStage){
                                                        if(pro.children.length>0){
                                                            let unitArray=[];
                                                            for(var i=0;i<pro.children.length;i++){
                                                                let unit= pro.children[i];
                                                                unitArray.push(
                                                                    <Option value={unit.pk} key={unit.pk} >{unit.name}</Option>
                                                                ) 
                                                            }
                                                            return unitArray;
                                                        }
                                                    }
                                                })}
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24}>
                                        <label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">原计划填报时间:</label>
                                        <div className="create_select">
                                            <label>{this.delayReportTime?this.delayReportTime:''}</label>
                                        </div> 
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24}>
                                        <label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">现申请填报时间:</label>
                                        <div className="create_select">
                                            <DatePicker size={'small'} 
                                            format="YYYY-MM-DD"
                                            onChange={this.delayReportTimeChange.bind(this)}
                                            style={{textIndent:'0',width: '100%' }}/>
                                        </div> 
                                    </Col>
                                </Row>
                                <p style={{marginBottom:5}}>请填写变更理由:</p>
                                <Row>
                                    <Col span={24} >
                                        <Input 
                                        id='remark'
                                        type="textarea" 
                                        placeholder="" 
                                        autosize={{minRows:5}} 
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={10} className='mb10'>
                                    <Col span={12}>
                                        <label  style={{minWidth: 40,display: 'inline-block'}} htmlFor="">发送:</label>
                                        <div className="item_input">
                                            <label>{this.creator?(this.creator.person_name?this.creator.person_name:this.creator.username):''}</label>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <label  style={{minWidth: 40,display: 'inline-block'}} htmlFor="">抄送:</label>
                                        <div className="item_input">
                                            <DelayPerCarbon
                                                delaySelectCarbonMember={this.delaySelectCarbonMember.bind(this)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mb10">
                                    <Col span={24}>
                                        <div style={{display:'inline-block'}}>
                                            <Checkbox onChange={this.emailNotice.bind(this)} style={{marginLeft:10}}>邮箱通知</Checkbox>
                                            <Checkbox onChange={this.messageNotice.bind(this)} style={{marginLeft:10}}>短信通知</Checkbox>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal>
                    
                </div>
            
		);
    }
    
    //邮箱通知
    emailNotice(emailState){
        console.log('邮箱通知',emailState.target.checked);
        this.setState({
            emailNoticeState: emailState.target.checked
        });
    }
    //短信通知
    messageNotice(messageState){
        console.log('短信通知',messageState.target.checked);
        this.setState({
            messageNoticeState: messageState.target.checked
        });
    } 
    //点击申请推迟填报
    handleDelay(){
        console.log('申请推迟填报');
        this.setState({
            delayVisible:true
        });
    }
    //推迟填报界面选择项目
    projectChange(value){
        const {
            project
        }=this.state

        this.setState({
            protectStage:value
        })
        let itemProject = null;
        project.map((pro)=>{
            if(pro.code=== value){
                itemProject = pro
            }
        })
        this.creator = null;
        this.delayUnitStage = null;
        this.constructionMember = null;
        this.delayReportTime = null;
        this.delayApprovalLimit = null;
        console.log('itemProject',itemProject)
        this.setState({
            delayWorkflowDetail:null,
            itemProject:{
                code:itemProject.code,
                pk:itemProject.pk,
                name:itemProject.name
            },
            unit:null
        })

    }
    //推迟填报界面选择单位工程
    unitStageChange(value){
        const {
            unitProjecte,
            delayReportTime,
            delayReportValue
        }=this.state
        const {
            actions: {
                getScheduleWorkflow,
                getWorkflowById,
                getDelayReportWorkflow
        }} = this.props;

        const unitStage = unitProjecte.find(x=>x.pk===value)
        this.setState({
            unitStage:unitStage,
            unit:unitStage.name
        })
        
        let user = getUser();
        let data = {
            userid:user.id,
            code:WORKFLOW_CODE.总进度计划报批流程,
            pk:value
        }
        getScheduleWorkflow(data).then((rst)=>{
            console.log('workflow',rst)
            if (rst && rst.data && rst.data.length>0) {
                let data = rst.data;
                let workflowID = null;
                for(var i=0;i<data.length;i++){
                    if(data[i].state.name === '填报'){
                        workflowID=data[i];
                        break;
                    }
                }
                if(workflowID){
                    let delayData = {
                        code:WORKFLOW_CODE.申请推迟总进度计划填报流程,
                        pk:value
                    }
                    getDelayReportWorkflow(delayData).then((value)=>{
                        if(value.data.length>0){
                            this.setState({
                                delayReportWorkflow:true
                            })
                        }else{
                            this.setState({
                                delayReportWorkflow:false
                            })
                        }
                    })
                    getWorkflowById({ id: workflowID.workflowactivity.id }).then(instance => {
                        if(instance){
                            console.log('流程详情', instance);
                            let subject = instance.subject[0];
                            this.delaySubject = instance.subject[0];
                            this.delayNextStates = getNextStates(instance,workflowID.state.id);
                            console.log('this.delayNextStates',this.delayNextStates);
                            this.creator = instance.creator;
                            this.delayUnitStage = JSON.parse(subject.unit);
                            this.constructionMember = JSON.parse(subject.constructionMember);
                            this.delayReportTime = JSON.parse(subject.reportTime);
                            this.delayApprovalLimit = JSON.parse(subject.approvalLimit);
    
                            this.reReportTimeData={
                                ppk:instance.id,
                                pk:workflowID.state.id
                            }
    
                            let approalStateID = this.delayNextStates[0].to_state[0].id
                            this.reApprovalTimeData={
                                ppk:instance.id,
                                pk:approalStateID
                            }
    
                            if(this.delayApprovalLimit){
                                let test2 = moment(delayReportValue).add(this.delayApprovalLimit,'days');
                                let test = moment(test2._d).format('YYYY-MM-DD');
                                console.log('xxxxxxxxxxxxx',test)
                                this.setState({
                                    delayApprovalTime: test
                                });
                            }
                            this.setState({
                                delayWorkflowDetail:instance
                            });
                        }
                        
                    })
                    
                }else{
                    console.log('单位工程不存在填报流程')
                    this.creator = null;
                    this.delayUnitStage = null;
                    this.constructionMember = null;
                    this.delayReportTime = null;
                    this.delayApprovalLimit = null;
                    this.setState({
                        delayWorkflowDetail:null,
                        delayReportWorkflow:false
                    });
                }
            }else{
                console.log('单位工程不存在填报流程')
                this.creator = null;
                this.delayUnitStage = null;
                this.constructionMember = null;
                this.delayReportTime = null;
                this.delayApprovalLimit = null;
                this.setState({
                    delayWorkflowDetail:null,
                    delayReportWorkflow:false
                });
            }
        })
    }
    //发起申请推迟填报流程
    delayHandleAction(){
        const {
            unitStage,
            delayReportTime,
            oldReportTime,
            delayApprovalTime,
            itemProject,
            delayReportWorkflow
        } =this.state
        const {
            actions: {
                createFlow, 
                carbonCopy,
                putFlow
            }
        } = this.props;

        let remark = document.querySelector('#remark').value;
        
        if(!itemProject){
            notification.error({
                message: '请选择项目',
            });
            return
        }
        if(!this.delayReportTime){
            notification.error({
                message: '请选择要推迟填报的单位工程',
            });
            return
        }
        if(!this.creator){
            notification.error({
                message: '请选择要推迟填报的单位工程',
            });
            return
        }
        if(delayReportWorkflow){
            notification.error({
                message: '该单位工程已发起申请推迟填报流程',
            });
            return
        }
        if(!delayReportTime){
            notification.error({
                message: '请选择现申请填报时间',
            });
            return
        }

        const usr = getUser();
        const currentUser = {
            "username": usr.username,
            "person_code": usr.code,
            "person_name": usr.name,
            "id": parseInt(usr.id)
        };

        let WORKFLOW_MAP = {
            name:"申请推迟总进度计划填报流程",
            desc:"总进度计划报批流程申请推迟总进度计划填报流程",
            code:WORKFLOW_CODE.申请推迟总进度计划填报流程
        };

        let subject = [{
            "itemProject": JSON.stringify(itemProject),
            "unit": this.delaySubject.unit,
            "oldReportTime": this.delaySubject.reportTime,
            "delayReportTime": JSON.stringify(delayReportTime),
            "delayApprovalTime": JSON.stringify(delayApprovalTime),
            "remark": JSON.stringify(remark),
            "reApprovalTimeData": JSON.stringify(this.reApprovalTimeData),
            "reReportTimeData": JSON.stringify(this.reReportTimeData)
        }];

        let postdata={
            name: WORKFLOW_MAP.name,
            description: WORKFLOW_MAP.desc,
            subject: subject,
            code: WORKFLOW_MAP.code,
            creator: currentUser,
            plan_start_time: moment().format('YYYY-MM-DD'),
            deadline: null,
            status: 2
        }

        createFlow({},postdata).then((value) => {
            if(!value.id){
                notification.error({
                    message: '申请推迟填报流程发起失败',
                    duration: 2
                })
                return;
            }
            console.log('申请推迟填报流程',value)
            let currentStateID = value.current[0].id;
            let nextStates = getNextStates(value,currentStateID);


            let next_state = nextStates[0].to_state[0].id;
            let currActionName = nextStates[0].action_name;
            let next_states = [];
            let participants = [];
            participants.push(this.creator)
            next_states.push({
                state: next_state,
                participants: participants,
                deadline: null,
                remark: null
            })
            let next_postdata = {
                next_states: next_states,
                state: currentStateID,
                executor: currentUser,
                action: currActionName,
                note: remark,
                attachment: null
            }
            let data= {
                pk:value.id
            }
            putFlow(data,next_postdata).then((rst)=>{
                if(rst.current){
                    notification.success({
                        message: '流程发起成功',
                        duration: 2
                    })
                }else{
                    notification.error({
                        message: '流程发起失败',
                        duration: 2
                    })
                    return;
                }
            })

        })
        this.setState({
            delayVisible:false
        });
    }
    //申请推迟填报返回按钮
    delayRejectAction(){
        console.log('申请推迟填报返回按钮');
        this.setState({
            delayVisible: false
        });
    }
    //选择推迟填报抄送人员
    delaySelectCarbonMember(memberInfo) {
        this.delayMemberCarbon = [];
        if(memberInfo){
            for(var i=0; i<memberInfo.length; i++){
                let memberValue = memberInfo[i].toString().split('#');
                if(memberValue[0] === 'C_PER'){
                    this.delayMemberCarbon.push(memberValue)
                }
            }
        }
    }
    //申请推迟填报重新填报时间
    delayReportTimeChange(value, dateString){
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        if(dateString){
            this.setState({
                delayReportTime:dateString,
                delayReportValue:value
            })
            if(this.delayApprovalLimit){
                let test2 = moment(value).add(this.delayApprovalLimit,'days');
                let test = moment(test2._d).format('YYYY-MM-DD');
                console.log('xxxxxxxxxxxxx',test)
                this.setState({
                    delayApprovalTime: test
                });
            }
        }
    }
}

