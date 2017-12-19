import React, {Component} from 'react';
import {Select, Button, Row, Col, DatePicker, Input, Icon, Checkbox, Tbale, Radio, Table, Card, notification} from 'antd';
import style from './index.css';
import PerCarbon from './PerCarbon';
import Dragger from '_platform/components/panels/Dragger';
import {getUser} from '_platform/auth';
import {SERVICE_API, SCHEDULE_TOTAL_PLAN_URL,SCHEDULE_DGN_DOWNLOAD_URL,WORKFLOW_CODE,STATIC_DOWNLOAD_API } from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class TotalApprovalForm extends Component {
    constructor(props){
        super(props);
        this.state={
            attachmentFile:'',
            actionState:'',
            emailNoticeState:false,
            messageNoticeState:false,
            workflowDetail:null,
            forceUpdate:null,
            reReportTime:null,
            reApprovalTime:null,
            totalDir:null,
            scheduleMaster:null,
            //流程监控
            startDatasource:[],
            total:0,
            loading:false,
            tableVisible:true,
            current:1
        }
        this.constructionUnit = null;
        this.constructionMember = null;
        this.reportTime = null;
        this.supervisionUnit = null;
        this.supervisionMember = null;
        this.approvalTime = null;
        this.remark = null;
        this.attachment = null;
        this.scheduleMaster = null;
        this.file = null;
        this.fdbConnectStr = null;
        this.memberCarbon = [];
        // this.uploadMD5File = null;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {
                    actions: {
                        getScheduleWorkflow,
                        getWorkflowById,
                        getScheduleDir,
                        postScheduleDir,
                        getDocument
                    }
                } = this.props;

                this.setState({
                    tableVisible:false
                })

                let user = getUser();
                let data = {
                    userid:user.id,
                    code:WORKFLOW_CODE.总进度计划报批流程,
                    pk:item.unitProjecte.pk
                }
                getScheduleWorkflow(data).then((rst)=>{
                    console.log('workflow',rst)
                     //获取所选单位工程树有无审批流程
                    if (rst && rst.data && rst.data.length>0) {
                        let data = rst.data;
                        let workflowID = null;
                        for(var i=0;i<data.length;i++){
                            if(data[i] && data[i].state && data[i].state.name && data[i].state.name === '审批'){
                                workflowID=data[i];
                                break;
                            }
                        }
                        if(workflowID){
                            //因为一个单位工程只能发起一次  所以直接查找为审批的流程详情
                            getWorkflowById({ id: workflowID.workflowactivity.id }).then(instance => {
                                console.log('流程详情', instance);
                                
                                if(instance && instance.subject){
                                    debugger
                                    let subject = instance.subject[0]
                                    this.nextStates = getNextStates(instance,workflowID.state.id);
                                    console.log('this.nextStates',this.nextStates)
                                    
                                    this.constructionUnit = JSON.parse(subject.constructionUnit);
                                    this.constructionMember = JSON.parse(subject.constructionMember);
                                    this.reportTime = JSON.parse(subject.reportTime);
                                    this.supervisionUnit = JSON.parse(subject.supervisionUnit);
                                    this.supervisionMember = JSON.parse(subject.supervisionMember);
                                    this.approvalTime = JSON.parse(subject.approvalTime);
                                    this.attachment = JSON.parse(subject.attachment);
                                    this.file = JSON.parse(subject.file);
                                    this.fdbConnectStr = subject.fdbConnectStr;
                                    this.setState({workflowDetail:instance});
                                }

                            })
                            let documentCode = {
                                code:"schedule_" + item.unitProjecte.code
                            }
                            getDocument(documentCode).then((documents)=>{
                                if(documents && documents.code && documents.extra_params ){
                                    if(documents.extra_params.scheduleMaster_Report){
                                        this.scheduleMaster = documents.extra_params.scheduleMaster_Report;
                                        this.setState({
                                            scheduleMaster:documents.extra_params.scheduleMaster_Report
                                        })
                                    }
                                }
                            })
                        }
                    }else{
                        console.log('不存在流程')
                        this.constructionUnit = null;
                        this.constructionMember = null;
                        this.reportTime = null;
                        this.supervisionUnit = null;
                        this.supervisionMember = null;
                        this.approvalTime = null;
                        this.remark = null;
                        this.attachment = null;
                        this.scheduleMaster = null;
                        this.file = null;
                        this.uploadModelFile = null;
                        this.fdbConnectStr = null;
                        this.setState({
                            workflowDetail:null,
                            scheduleMaster:null
                        });
                    }
                })
            }
        }
    }

    componentDidMount(){
        const {
            actions: {
                getProjectTree,
                getReportWorkflow
            }
        } = this.props;

        let me = this
        let user = getUser();
        let startWorkflow = {
            userid:user.id,
            code:WORKFLOW_CODE.总进度计划报批流程,
            page:1
        }
        getReportWorkflow(startWorkflow).then((rst)=>{
            if(rst &&　rst.data && rst.data.length>0){
                let table = []
                for(var i=0;i<rst.data.length;i++){
                    let test = rst.data[i]
                    table.push({
                        index:i+1,
                        unit:JSON.parse(test.workflowactivity.subject[0].unit).name,
                        workflow:'总进度计划报批流程',
                        creator:test.workflowactivity.creator.person_name?test.workflowactivity.creator.person_name:test.workflowactivity.creator.username,
                        currenUser:test.workflowactivity.current[0].participants[0].executor.person_name?test.workflowactivity.current[0].participants[0].executor.person_name:test.workflowactivity.current[0].participants[0].executor.username,
                        status:test.state.name
                    })
                }
                me.setState({
                    startDatasource:table,
                    loading:false,
                    total:rst.count
                })
            }
        })
    }

    onPageChange = (page, pageSize) =>{
        this.setState({
            current: page
        })
    }

    onSwitchPage = (pagination, filters, sorter) =>{
        let onPage = pagination.current
        this.query(onPage.page)
    }

    query(page){
        let me = this;
        const { actions: {getReportWorkflow}} = this.props;
        let user = getUser();
        let startWorkflow = {
            userid:user.id,
            code:WORKFLOW_CODE.总进度计划报批流程,
            page:page
        }

        getReportWorkflow(startWorkflow).then(rst => {
            if(rst && rst.data && rst.data.length>0){
                let workFlows = rst.data
                let table = []
                for(var i=0;i<rst.data.length;i++){
                    let test = rst.data[i]
                    table.push({
                        index:i+1,
                        unit:JSON.parse(test.workflowactivity.subject[0].unit).name,
                        workflow:'总进度计划报批流程',
                        creator:test.workflowactivity.creator.person_name?test.workflowactivity.creator.person_name:test.workflowactivity.creator.username,
                        currenUser:test.workflowactivity.current[0].participants[0].executor.person_name?test.workflowactivity.current[0].participants[0].executor.person_name:test.workflowactivity.current[0].participants[0].executor.username,
                        status:test.state.name
                    })
                }
                this.setState({
                    startDatasource:table,
                    loading:false,
                    total:rst.count
                })
            }else{
                this.setState({
                    startDatasource:[],
                    loading:false,
                    total:rst.count
                })
            }
           
        });
    }

    render() { //todo 
        const{
            item
        }=this.props
        const {
            workflowDetail,
            startDatasource,
            total,
            tableVisible
        }=this.state
        let data = [];
        if(this.scheduleMaster){
            data = this.scheduleMaster
        }

        const columns1 = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index'
            },
            {
                title: '单位工程',
                dataIndex: 'unit',
                key: 'unit'
            },
            {
                title: '流程名称',
                dataIndex: 'workflow',
                key: 'workflow'
            },
            {
                title: '发起人',
                dataIndex: 'creator',
                key: 'creator'
            },
            {
                title: '当前执行人',
                dataIndex: 'currenUser',
                key: 'currenUser'
            },
            {
                title: '当前节点',
                dataIndex: 'status',
                key: 'status'
            }
        ];

        let pagination = {
            defaultPageSize: 15,
            showQuickJumper: false,
            defaultCurrent: 1,
            current: this.state.current,
            total: total,
            onChange: this.onPageChange
        }

        return (
            <div>
                {
                    tableVisible?
                    <div>
                        <Table columns={columns1}
                         dataSource={startDatasource}
                         pagination={pagination}
                         onChange={this.onSwitchPage}
                        />
                    </div>:
                    <div >
                        <Button type="primary" onClick={this.submitPlan.bind(this)}>发送</Button>
                        <h1 style={{textAlign:'center'}}>总进度计划填报通知</h1>
                        <Card className='mb10'>
                            <Row gutter={15} style={{marginBottom:10}}>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">项目名称:</label>
                                    <div className='start_input'>
                                        <label >{item?item.project.name:''}</label>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">单位工程:</label>
                                    <div className='start_input'>
                                        <label >{item?item.unitProjecte.name:''}</label>
                                    </div>
                                    </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">合同进度:</label>
                                    <div className='start_input'>
                                        <label >合同进度</label>
                                    </div>   
                                </Col>
                            </Row>
                            <Row gutter={15} className='mb10'>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">施工单位:</label>
                                    <div className='start_input'>
                                        <label>{this.constructionUnit?this.constructionUnit:''}</label>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报人:</label>
                                    <div className='start_input'>
                                        <label >{this.constructionMember?(this.constructionMember.person_name?this.constructionMember.person_name:this.constructionMember.username):''}</label>                            
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报时间:</label>
                                    <div className='start_input'>
                                        <label >{this.reportTime?this.reportTime:''}</label>
                                    </div>       
                                </Col>
                            </Row>
                            <Row gutter={15} style={{marginTop:10}}>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">监理单位:</label>
                                    <div className='start_input'>
                                        <label>{this.supervisionUnit?this.supervisionUnit:''}</label>                            
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核人:</label>
                                    <div className='start_input'>
                                        <label >{this.supervisionMember?(this.supervisionMember.person_name?this.supervisionMember.person_name:this.supervisionMember.username):''}</label>                            
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核时间:</label>
                                    <div className='start_input'>
                                        <label >{this.approvalTime?this.approvalTime:''}</label>
                                    </div>        
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <p  style={{marginBottom:10}}>总进度计划表:</p>
                            <Row className='mb10'>
                                <Col span={24} >
                                <Table columns={columns} size="small"
                                    dataSource={data}></Table>
                                </Col>
                            </Row>
                            <Row style={{marginTop:10}}>
                                <Col span={12}>
                                    <a style={{textAlign:'center',display: 'block'}} onClick={this.downloadExcel.bind(this)}>下载总进度计划表</a>
                                </Col>
                                <Col span={12}>
                                    <a style={{textAlign:'center',display: 'block'}} onClick={this.downloadModel.bind(this)}>下载施工模型</a>
                                </Col>
                            </Row>
                        </Card>
                        <Card className='mb10'>
                            <Row style={{marginBottom:10}}>
                                <Col span={24}>
                                    <label style={{minWidth: 60,display: 'inline-block'}}>审核意见:</label>
                                    <RadioGroup onChange={this.handleAction.bind(this)} value={this.state.actionState}>
                                        <Radio value={'通过'}>通过</Radio>
                                        <Radio value={'退回'}>退回，并请在</Radio>
                                    </RadioGroup>
                                    <div style={{display: 'inline-block'}}>
                                        <DatePicker size={'small'} 
                                            onChange={this.reReportTimeChange.bind(this)}
                                            placeholder="请选择重新填报日期" 
                                            style={{textIndent:'0',minWidth: 100,marginLeft:5,marginRight:10}}/>
                                    </div>
                                    前完成进度计划调整并重新提交。 
                                </Col>
                            </Row>
                            <Row className='mb10'>
                                <Col span={24} >
                                    <Input 
                                    id='remark'
                                    type="textarea" 
                                    placeholder="请填写审核意见" 
                                    autosize={{minRows:7}} 
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginTop:10}}>
                                <Col span={12}>
                                    <label  style={{minWidth: 80,display: 'inline-block'}} htmlFor="">请选择抄送人:</label>
                                    <div className="perCarbon_input">
                                        <PerCarbon
                                            selectCarbonMember={this.selectCarbonMember.bind(this)}
                                        />
                                    </div>
                                </Col>
                                <Col  span={12}>
                                    <div style={{display:'inline-block',float:'right'}}>
                                        <Checkbox onChange={this.emailNotice.bind(this)} style={{marginLeft:10}}>邮箱通知</Checkbox>
                                        <Checkbox onChange={this.messageNotice.bind(this)} style={{marginLeft:10}}>短信通知</Checkbox>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                        
                    </div>
                }
            </div>
            
        );
    }
    //退回时限定重新填报时间
    reReportTimeChange(value, dateString){
        console.log('Formatted Selected Time: ', dateString);
        if(dateString){
            this.setState({
                reReportTime:dateString
            })
            if(this.approvalLimit){
                let test2 = moment(value).add(this.approvalLimit,'days');
                let test = moment(test2._d).format('YYYY-MM-DD');
                console.log('xxxxxxxxxxxxx',test)
                this.setState({
                    reApprovalTime: test
                });
            }
        }
    }
    //选择通过或退回
    handleAction(action){
        console.log('选择通过或退回',action.target.value);
        
        this.setState({
          actionState: action.target.value
        });
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
    //发送，开始流程
    submitPlan(){
        console.log('发送，开始流程');
        debugger
        const {
            actionState,
            workflowDetail,
            reReportTime
        }=this.state
        console.log("workflowDetail ", workflowDetail);
        if(!workflowDetail){
            notification.error({
                message: '不存在审批流程',
                duration: 2
            })
            return;
        }
        
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
    }
    //通过流程
    handleSubmit(){
        const {
            workflowDetail,
            totalDir
        }=this.state
        const{
            actions:{
                putFlow,
                carbonCopy,
                getScheduleDir,
                postScheduleDir,
                postDocument,
                putScheduleTime,
                getUnitPlanTime,
                getDocument,
                putDocument
            },
            item
        }=this.props
        let me = this;
        const user = getUser();
        let executor = {
            "username": user.username,
            "person_code": user.code,
            "person_name": user.name,
            "id": parseInt(user.id)
        };
        let note = document.querySelector('#remark').value;
        // let executor = this.supervisionMember
        let action_name = '';
        for(var i=0;i<this.nextStates.length;i++){
            if(this.nextStates[i].action_name!='退回'){
                action_name=this.nextStates[i].action_name
            }
        }
        if(note === ""){
            note = action_name+'。';
        }
        let state = workflowDetail.current[0].id;
        let postdata = {
            state : state,
            executor : executor,
            action : action_name,
            note: note,
            attachment: null
        }
        let data={
            pk:workflowDetail.id
        }


        if(this.memberCarbon.length>0){
            let ccuser=[];
            for(var i=0; i<this.memberCarbon.length;i++){
                ccuser.push(
                    {   id: Number(this.memberCarbon[i][3]),
                        username: this.memberCarbon[i][4],
                        person_name: this.memberCarbon[i][2],
                        person_code: this.memberCarbon[i][1]
                    }
                )
            }
            let remark = null;
            let postCarbonData = {
                state : state,
                ccuser : ccuser,
                remark : remark
            }
            console.log('postCarbonData',postCarbonData)
            carbonCopy(data,postCarbonData).then( (value)=>{
                if(value && value.ccmessage_set){
                    notification.success({
                        message: '流程抄送成功',
                        duration: 2
                    })
                }else{
                    notification.error({
                        message: '流程抄送失败',
                        duration: 2
                    })
                    return;
                }
            })
        }

        console.log('postdata',postdata)
        putFlow(data,postdata).then( rst=>{
            console.log('rst',rst)
            if(rst && rst.creator){
                notification.success({
                    message: '流程提交成功',
                    duration: 2
                })

                //返回流程监控页面
                me.query(1)
                me.setState({
                    tableVisible:true
                })
               
                //查看文档数据
                let documentCode = {
                    code:"schedule_" + item.unitProjecte.code
                }

                //修改文档数据
                let changeDocumentData1 = {
                    "extra_params": {
                        "scheduleMaster": '',
                        // "uploadModelFile": '',
                        // "uploadMD5File": '',
                        "fdbConnectStr": ''
                    },
                    "basic_params": {
                        "files": [
                            {
                              "a_file": this.file.a_file,
                              "name": this.file.name,
                              "download_url": this.file.download_url,
                              "misc": this.file.misc,
                              "mime_type": this.file.mime_type
                            },
                        ]
                    },
                    "status": "A",
                    "version": "A"
                }
                
                //是否存在文档
                getDocument(documentCode).then((documents)=>{
                    if(documents && documents.code && documents.extra_params){
                        //获取文档中的模型数据
    
                        let changeDocumentData2 = {
                            "extra_params": {
                                "scheduleMaster": this.scheduleMaster,
                                // "uploadModelFile": changeUploadModelFile,
                                "fdbConnectStr": this.fdbConnectStr
                            },
                            "basic_params": {
                                "files": [
                                    {
                                        "a_file": this.file.a_file,
                                        "name": this.file.name,
                                        "download_url": this.file.download_url,
                                        "misc": this.file.misc,
                                        "mime_type": this.file.mime_type
                                    },
                                ]
                            },
                            "status": "A",
                            "version": "A"
                        }
                        putDocument(documentCode,changeDocumentData1).then((changeDoc1)=>{
                            console.log('第一次修改文档',changeDoc1)
                            if(changeDoc1 && changeDoc1.code ){
                                putDocument(documentCode,changeDocumentData2).then((changeDoc2)=>{
                                    console.log('第二次修改文档',changeDoc2)
                                    if(changeDoc2 && changeDoc2.code ){
                                        let code = {
                                            code:changeDoc2.code
                                        }
                                        //获取单位工程的起始时间和结束时间
                                        getUnitPlanTime(code).then((unitPlanTime)=>{
                                            if(unitPlanTime && unitPlanTime.time_data && unitPlanTime.time_data.endTime && unitPlanTime.time_data.startTime){
                                                let end_time = unitPlanTime.time_data.endTime;
                                                let start_time = unitPlanTime.time_data.startTime
        
                                                let ScheduleTimePk = {
                                                    pk:item.unitProjecte.pk
                                                }
                                                let ScheduleTimeData = {
                                                    extra_params:{
                                                        start_time:start_time,
                                                        end_time:end_time
                                                    },
                                                    version: "A"
                                                }
                                                putScheduleTime(ScheduleTimePk,ScheduleTimeData).then((scheduleTime)=>{
                                                    if(scheduleTime){
                                                        console.log('scheduleTime',scheduleTime)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
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

    //获取单位工程的起始时间和结束时间
    getAndPutScheduleTime = (code) => {
        const {
            item,
            actions: {
                getUnitPlanTime,
                putScheduleTime
            }
        } = this.props;
        //获取单位工程的起始时间和结束时间
        getUnitPlanTime(code).then((unitPlanTime)=>{
            if(unitPlanTime && unitPlanTime.time_data && unitPlanTime.time_data.endTime && unitPlanTime.time_data.startTime){
                let end_time = unitPlanTime.time_data.endTime;
                let start_time = unitPlanTime.time_data.startTime

                let ScheduleTimePk = {
                    pk:item.unitProjecte.pk
                }
                let ScheduleTimeData = {
                    extra_params:{
                        start_time:start_time,
                        end_time:end_time
                    },
                    version: "A",
                }
                putScheduleTime(ScheduleTimePk,ScheduleTimeData).then((scheduleTime)=>{
                    if(scheduleTime){
                        console.log('scheduleTime',scheduleTime)
                    }
                })
            }
        });
    }

    // 去除 静态文件a_file 和 download_url 的服务地址
    covertURLRelative = (originUrl) => {
        return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
    //退回流程
    handleReject(){
        const {
            workflowDetail,
            reReportTime,
            reApprovalTime
        }=this.state
        const{
            actions:{
                putFlow,
                patchDeadline,
                postSubject
            }
        }=this.props
        let me =this;
        if(!reReportTime){
            notification.error({
                message: '请选择重新填报期限',
                duration: 2
            })
            return;
        }
        console.log('reReportTime',reReportTime)
        console.log('reApprovalTime',reApprovalTime)
        const user = getUser();
        let state = workflowDetail.current[0].id;
        let executor = {
            "username": user.username,
            "person_code": user.code,
            "person_name": user.name,
            "id": parseInt(user.id)
        };
        // let executor = this.supervisionMember

        let action = "退回";
        let note = document.querySelector('#remark').value;
        let attachment = null;
        if(note === ""){
            note = '退回。';
        }
        let postdata = {
            state : state,
            executor : executor,
            action : action,
            note: note,
            attachment: attachment
        }
        console.log('postdata',postdata)
        let data={
            pk:workflowDetail.id
        }
        let rejectStateID = null;
        for(var i=0;i<this.nextStates.length;i++){
            if(this.nextStates[i].action_name==='退回'){
                rejectStateID=this.nextStates[i].to_state[0].id
            }
        }
        let reReportTimeData={
            ppk:workflowDetail.id,
            pk:rejectStateID
        }
        let patchReportTime = {
            deadline: reReportTime
        }
        //修改填报时间
        patchDeadline(reReportTimeData,patchReportTime).then( value => {
            if(value && value.deadline){
                console.log('value',value)
            }else{
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return;
            }
        })
        let reApprovalTimeData={
            ppk:workflowDetail.id,
            pk:state
        }
        let patchApprovalTime = {
            deadline: reApprovalTime
        }
        //修改审核时间
        patchDeadline(reApprovalTimeData,patchApprovalTime).then( value => {
            if(value && value.deadline){
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
            "project":oldSubject.project,
            "unit": oldSubject.unit,
            "constructionUnit": oldSubject.constructionUnit,
            "reportTime": JSON.stringify(reReportTime),
            "approvalLimit": oldSubject.approvalLimit,
            "constructionMember": oldSubject.constructionMember,
            "supervisionUnit": oldSubject.supervisionUnit,
            "supervisionMember": oldSubject.supervisionMember,
            "approvalTime": JSON.stringify(reApprovalTime),
            "remark": oldSubject.remark,
            "attachment": oldSubject.attachment,
            "uploadModelFile": oldSubject.uploadModelFile,
            "file": oldSubject.file,
            "fdbConnectStr": oldSubject.fdbConnectStr
        }];

        let newSubject = {
            subject:subject
        }
        //修改subject
        postSubject(data,newSubject).then( value=>{
            console.log('value',value)
        })
        
        putFlow(data,postdata).then( rst=>{
            console.log('rst',rst)
            if(rst && rst.creator){
                notification.success({
                    message: '流程退回成功',
                    duration: 2
                })

                //返回流程监控页面
                me.query(1)
                me.setState({
                    tableVisible:true
                })
            }else{
                notification.error({
                    message: '流程退回失败',
                    duration: 2
                })
                return;
            }
        })

    }
    //下载总进度计划表
    downloadExcel(){
        console.log('下载总进度计划表');
        let link = document.createElement("a");
        if(this.file){
            link.href = STATIC_DOWNLOAD_API + this.file.download_url;
            link.setAttribute('download', this);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }else{
            notification.error({
                message: '不存在审批流程',
                duration: 2
            })
            return;
        }
    }
    //下载施工模型
    downloadModel(){
        console.log('下载施工模型');
        let link = document.createElement("a");
        if(this.file){
            // if(this.uploadModelFile && this.uploadMD5File){
            if(this.uploadModelFile){
                link.href = STATIC_DOWNLOAD_API + this.uploadModelFile.download_url;
                link.setAttribute('download', this);
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // link.href = STATIC_DOWNLOAD_API + this.uploadMD5File.download_url;
                // link.setAttribute('download', this);
                // link.setAttribute('target', '_blank');
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);
            }else{
                notification.error({
                    message: '填报时未上传施工模型',
                    duration: 2
                })
                return;
            }
        }else{
            notification.error({
                message: '不存在审批流程',
                duration: 2
            })
            return;
        }
        
    }
    //抄送选择人员
    selectCarbonMember(memberInfo) {
        this.memberCarbon = [];
        if(memberInfo){
            for(var i=0; i<memberInfo.length; i++){
                let memberValue = memberInfo[i].toString().split('#');
                if(memberValue[0] === 'C_PER'){
                    this.memberCarbon.push(memberValue)
                }
            }
            console.log('this.memberCarbon',this.memberCarbon)
        }
    }
}

const columns=[{
    title: 'WBS编码',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '作业类别',
    dataIndex: 'type',
    key: 'type'
},{
    title: '单位',
    dataIndex: 'company',
    key: 'company'
},{
    title: '施工图工程量',
    dataIndex: 'quantity',
    key: 'quantity'
},{
    title: '产值',
    dataIndex: 'output',
    key: 'output'
},{
    title: '计划开始时间',
    dataIndex: 'startTime',
    key: 'startTime'
},{
    title: '计划结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
},{
    title: '计划工期',
    dataIndex: 'schedule',
    key: 'schedule'
},{
    title: '是否关键路线',
    dataIndex: 'path',
    key: 'path'
},{
    title: '是否里程碑',
    dataIndex: 'milestone',
    key: 'milestone'
},{
    title: '关联工程部位',
    dataIndex: 'site',
    key: 'site'
}]
