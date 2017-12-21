import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Upload, Modal, Radio  } from 'antd';
import moment from 'moment';
import './index.less';
import {getUser} from '_platform/auth';
import {SERVICE_API,SCHEDULE_TOTAL_PLAN_URL,WORKFLOW_CODE} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util'
const uuidv4 = require('uuid/v4');
const Option = Select.Option;
const RadioGroup = Radio.Group;


export default class DelayApproval extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            delayVisible:false,
            actionState:'',
            workflowDetail:null
        }
        //点击单位工程树所查找的流程
        this.itemProject = null;
        this.unit = null;
        this.oldReportTime = null;
        this.delayReportTime = null;
        this.delayApprovalTime = null;
        this.remark = null;
        this.reApprovalTimeData = null;
        this.reReportTimeData = null;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {actions: {
                    getWorkflowById
                }} = this.props;        
                //因为一个单位工程只能发起一次  所以直接查找为填报的流程详情
                // getWorkflowById({ id:  59}).then(instance => {
                //     console.log('流程详情', instance);
                //     let subject = instance.subject[0]

                //     this.itemProject = JSON.parse(subject.itemProject);
                //     this.unit = JSON.parse(subject.unit);
                //     this.oldReportTime = JSON.parse(subject.oldReportTime);
                //     this.delayReportTime = JSON.parse(subject.delayReportTime);
                //     this.delayApprovalTime = JSON.parse(subject.delayApprovalTime);
                //     this.remark = JSON.parse(subject.remark);
                //     this.reApprovalTimeData = JSON.parse(subject.reApprovalTimeData);
                //     this.reReportTimeData = JSON.parse(subject.reReportTimeData);
                //     this.setState({
                //         workflowDetail:instance
                //     });
                // })
 
            }
        }
    }

    render() { //todo 
        const {
            delayReportVisible,
            actionState,
            workflowDetail
        }=this.state
		return (
                <div>  
                    <Modal
                        visible={this.state.delayVisible}
                        onOk={this.delayHandleAction.bind(this)}
                        onCancel={this.delayRejectAction.bind(this)}
                        okText={'提交'}
                        cancelText={'返回'}
                    >        
                        <h2 style={{textAlign:'center',padding:10}}>推迟填报审查</h2>
                        <Row className='mb10'>
                            <Col span={24} >
                                <Row className='mb10' gutter={10}>
                                    <Col span={12}>
                                        <label  style={{minWidth: 40,display: 'inline-block'}} htmlFor="">项目:</label>
                                        <div className="item_input">
                                            <label  style={{minWidth: '100%'}} htmlFor="">{this.itemProject?this.itemProject:''}</label>
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">单位工程:</label>
                                        <div className="start_input">
                                            <label  style={{minWidth: '100%'}} htmlFor="">{this.unit?this.unit.name:''}</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24}>
                                        <label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">原计划填报时间:</label>
                                        <div className="create_select">
                                            <label  style={{minWidth: '100%'}} htmlFor="">{this.oldReportTime?this.oldReportTime:''}</label>
                                        </div> 
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24}>
                                        <label  style={{minWidth: 100,display: 'inline-block'}} htmlFor="">现申请填报时间:</label>
                                        <div className="create_select">
                                            <label  style={{minWidth: '100%'}} htmlFor="">{this.delayReportTime?this.delayReportTime:''}</label>
                                        </div> 
                                    </Col>
                                </Row>
                                <p style={{marginBottom:5}}>申请变更理由:</p>
                                <Row className='mb10'>
                                    <Col span={24} >
                                        <Input 
                                        id='text'
                                        type="textarea" 
                                        value={this.remark?this.remark:''}
                                        disabled={true}
                                        autosize={{minRows:5}} 
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24}>
                                        <Row className='mb10'>
                                            <Col span={24}>
                                                <label style={{minWidth: 60,display: 'inline-block'}}>审核意见:</label>
                                                <RadioGroup onChange={this.handleAction.bind(this)} value={this.state.actionState}>
                                                    <Radio value={'通过'}>通过</Radio>
                                                    <Radio value={'退回'}>退回</Radio>
                                                </RadioGroup>
                                            </Col>
                                        </Row>
                                        <Row className='mb10'>
                                            <Col span={24}>
                                                <Input 
                                                id='remark'
                                                type="textarea" 
                                                placeholder="" 
                                                autosize={{minRows:5}} 
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Modal>
                </div>
		        );
    }

    handleAction(action){
        console.log('选择通过或退回',action.target.value);
        this.setState({
          actionState: action.target.value
        });
    }
    //申请推迟填报审查提交按钮
    delayHandleAction(){
        console.log('申请推迟填报提交按钮');
        const{
            actionState,
            workflowDetail
        }=this.state
        if(actionState === '通过'){
            this.handleSubmit()
        }else if(actionState === '退回'){
            this.handleReject()
        }else if(actionState === ''){
            notification.error({
                message: '请选择审核意见',
                duration: 2
            })
        }
        this.setState({
            delayVisible:false
        });
    }
    handleSubmit(){
        const{
            actions:{
                putFlow,
                patchDeadline,
                postSubject
            }
        }=this.props
        const {
            workflowDetail
        }=this.state

        const user = getUser();
        let state = workflowDetail.current[0].id;
        let executor = {
            "username": user.username,
            "organization": user.org,
            "person_code": user.code,
            "person_name": user.name,
            "id": parseInt(user.id)
        };
        
        let note = document.querySelector('#remark').value;
        let attachment = null;
        if(note === ""){
            note = action_name+'。';
        }
        let action_name = '';
        this.nextStates = getNextStates(workflowDetail,state);
        for(var i=0;i<this.nextStates.length;i++){
            if(this.nextStates[i].action_name!='退回'){
                action_name=this.nextStates[i].action_name
            }
        }
        let postdata = {
            state : state,
            executor : executor,
            action : action_name,
            note: note,
            attachment: attachment
        }
        console.log('postdata',postdata)
        let data={
            pk:workflowDetail.id
        }

        let reReportTimeData = this.reReportTimeData
        let patchReportTime = {
            deadline: this.delayReportTime
        }
        //修改填报时间
        patchDeadline(reReportTimeData,patchReportTime).then( value => {
            if(value.deadline){
                console.log('value',value)
            }else{
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return;
            }
        })

        let reApprovalTimeData = this.reApprovalTimeData
        let patchApprovalTime = {
            deadline: this.delayApprovalTime
        }
        //修改填报时间
        patchDeadline(reApprovalTimeData,patchApprovalTime).then( value => {
            if(value.deadline){
                console.log('value',value)
            }else{
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return;
            }
        })


        let oldSubject = workflowDetail.subject[0]
        let subject = [{
            "unit": oldSubject.unit,
            "constructionUnit": oldSubject.constructionUnit,
            "reportTime": JSON.stringify(this.delayReportTime),
            "approvalLimit": oldSubject.approvalLimit,
            "constructionMember": oldSubject.constructionMember,
            "supervisionUnit": oldSubject.supervisionUnit,
            "supervisionMember": oldSubject.supervisionMember,
            "approvalTime": JSON.stringify(this.reApprovalTimeData),
            "remark": oldSubject.remark,
            "attachment": oldSubject.attachment
        }];

        let newSubject = {
            subject:subject
        }
        let schdelData = {
            pk:this.reApprovalTimeData.ppk
        }
        //修改subject
        postSubject(schdelData,newSubject).then( value=>{
            console.log('value',value)
        })


        putFlow(data,postdata).then( rst=>{
            console.log('rst',rst)
            if(rst.creator){
                notification.success({
                    message: '流程提交成功',
                    duration: 2
                })
            }else{
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return;
            }
        })
    }
    handleReject(){

    }
    //申请推迟填报审查返回按钮
    delayRejectAction(){
        console.log('申请推迟填报返回按钮');
        this.setState({
            delayVisible: false
        });
    }
}

