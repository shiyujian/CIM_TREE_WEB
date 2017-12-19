import React, {Component} from 'react';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Upload, Modal, message  } from 'antd';
import moment from 'moment';
import './index.css';
import {SERVICE_API, SCHEDULE_TOTAL_PLAN_URL, WORKFLOW_CODE, USER, PASSWORD, STATIC_UPLOAD_API} from '_platform/api';



export default class NoticeTable extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            workFlowList:null,
            current:1,
            dataSource:[]
        }
        
    }

    componentDidMount(){
        const{
            actions:{
                getNoticeWorkflow
            }
        }=this.props
        let now = moment().subtract(1,'days').format('YYYY-MM-DD')
        let postNoticeData={
            code:WORKFLOW_CODE.总进度计划报批流程+','+WORKFLOW_CODE.进度管控审批流程,
            // code:WORKFLOW_CODE.总进度计划报批流程,
            date:now,
            page: 1
        }
        let dataList = []
        getNoticeWorkflow(postNoticeData).then((rst)=>{
            console.log('getNoticeWorkflow',rst)
            if(rst && rst.data && rst.data.length>0){
                let workFlows = rst.data
                for(var i=0;i<workFlows.length;i++){
                    let unit = JSON.parse(workFlows[i].workflowactivity.subject[0].unit)
                    let lagtime = moment(workFlows[i].state.deadline, "YYYY-MM-DD").fromNow().split(' ')[0]
                    dataList.push({
                        unitName:unit.name,
                        workflowType:workFlows[i].workflowactivity.workflow.code === WORKFLOW_CODE.总进度计划报批流程?
                        '总进度计划报批流程':'进度管控审批流程',
                        taskName:workFlows[i].state.name,
                        operator:workFlows[i].workflowactivity.current[0].participants[0].executor.person_name?
                                workFlows[i].workflowactivity.current[0].participants[0].executor.person_name:
                                workFlows[i].workflowactivity.current[0].participants[0].executor.username,
                        deadline:workFlows[i].state.deadline,
                        lagTime:lagtime
                    })
                }
                console.log('dataList',dataList)
                this.setState({
                    dataSource:dataList
                })
            }
            this.setState({
                workFlowList:rst.count
            })
        })
    }

    render() { 
        const {
            dataSource
        }=this.state
        let total = '';
        if(this.state.workFlowList){
            total = this.state.workFlowList.count;
        }
        let pagination = {
            defaultPageSize: 15,
            showQuickJumper: false,
            defaultCurrent: 1,
            total:total,
            current: this.state.current,
            onChange: this.onPageChange
        }
        
		return (
            <Table columns={columns}
            dataSource = {dataSource}
            pagination={pagination}
            onChange={this.onSwitchPage.bind(this)}
            />
        )
    }

    onSwitchPage = (pagination, filters, sorter) =>{
        let onPage = pagination.current
        let me = this;
        const { actions: {getNoticeWorkflow}} = this.props;

        let now = moment().subtract(1,'days').format('YYYY-MM-DD')
        let postNoticeData={
            code:WORKFLOW_CODE.总进度计划报批流程+','+WORKFLOW_CODE.进度管控审批流程,
            // code:WORKFLOW_CODE.总进度计划报批流程,
            date:now,
            page: onPage.page
        }
        let dataList = []
        getNoticeWorkflow(postNoticeData).then(rst => {
            if(rst && rst.data && rst.data.length>0){
                let workFlows = rst.data
                for(var i=0;i<workFlows.length;i++){
                    let unit = JSON.parse(workFlows[i].workflowactivity.subject[0].unit);
                    let lagtime = me.dateCalculation(workFlows[i].state.deadline);
                    dataList.push({
                        unitName:unit.name,
                        workflowType:workFlows[i].workflowactivity.workflow.code === WORKFLOW_CODE.总进度计划报批流程?
                                    '总进度计划报批流程':'进度管控审批流程',
                        taskName:workFlows[i].state.name,
                        operator:workFlows[i].workflowactivity.current[0].participants[0].executor.person_name?
                                workFlows[i].workflowactivity.current[0].participants[0].executor.person_name:
                                workFlows[i].workflowactivity.current[0].participants[0].executor.username,
                        deadline:workFlows[i].state.deadline,
                        lagTime:lagtime
                    })
                }
                console.log('dataList',dataList)
                this.setState({
                    dataSource:dataList
                })
            }
            this.setState({
                workFlowList:rst.count
            })
        });
    }

    dateCalculation =(date) =>{
        let now = moment().format('YYYY-MM-DD');
        let dateFormat = moment(date).format('YYYY-MM-DD');
        let date1 = Date.parse(now);
        let date2 = Date.parse(dateFormat);
        let number = (date1 - date2)/24/60/60/1000;
        console.log('number',number);
        return number;
    }

    onPageChange = (page, pageSize) =>{
        this.setState({
            current: page
        })
    }
   
}
const columns = [
    {
        title:'序号',
        dataIndex:'index',
        key:'index',
        width: '5%',
        render: (text,record,index) =>{
            return <div>{index+1}</div>;
        }
    },{
        title:'单位工程',
        dataIndex:'unitName',
        key:'unitName',
        width: '25%'
    },{
        title:'流程类型',
        dataIndex:'workflowType',
        key:'workflowType',
        width: '25%'
    },{
        title:'当前节点',
        dataIndex:'taskName',
        key:'taskName',
        width: '10%'
    },{
        title:'执行人',
        dataIndex:'operator',
        key:'operator',
        width: '10%'
    },{
        title:'任务截止时间',
        dataIndex:'deadline',
        key:'deadline',
        width: '10%'
    },{
        title:'滞后时间',
        dataIndex:'lagTime',
        key:'lagTime',
        width: '10%'
    }
];

