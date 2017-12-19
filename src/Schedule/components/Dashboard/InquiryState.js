import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Card,Row,Col,Select} from 'antd';
import {WORKFLOW_CODE} from '../../../_platform/api'
import moment from 'moment';
const Option = Select.Option;

export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            unitProjecte:[],
            unitStage:'',
            totalReportAllCount:0,
            totalReportOverdueCount:0,
            totalApprovalAllCount:0,
            totalApprovalOverdueCount:0,
            stageReportAllCount:0,
            stageReportOverdueCount:0,
            stageApprovalAllCount:0,
            stageApprovalOverdueCount:0,
            projectIntimeCount:0,
            projectOverdueCount:0
        }
    }

    componentDidMount() {
        const {getProjectTree} = this.props.actions;
        //获取最初始的树节点
        let unitProjecte=[];
        let test=[];
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
                    project:test,
                    unitStage:unitProjecte[0].pk
                })
            }
        })
        // let unitProjecte=[];
        // getProjectTree({},{depth:3}).then((rst)=>{
        //     console.log('rst=========',rst)
        //     if(rst){
        //         if(rst.children.length>0){
        //             for(var i=0;i<rst.children.length;i++){
        //                 if(rst.children[i].children.length>0){
        //                     let project=rst.children[i].children;
        //                     for(var t=0; t<project.length;t++){
        //                         if(project[t].children.length>0){
        //                             let item=project[t].children
        //                             for(var s=0;s<item.length;s++){
        //                                 unitProjecte.push(item[s])
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             this.setState({
        //                 unitProjecte:unitProjecte,
        //             })
        //         }
        //     }
            
        // })
    }

    componentDidUpdate(prevProps,prevState){
        const{
            actions:{
                getTotalReportOverdue,
                getTotalReportAll,
                getTotalApprovalOverdue,
                getTotalApprovalAll,
                getStageReportOverdue,
                getStageReportAll,
                getStageApprovalOverdue,
                getStageApprovalAll,
                getProjectProcess
            }
        }=this.props
        const {
            unitStage,
            totalReportAllCount,
            totalReportOverdueCount,
            totalApprovalAllCount,
            totalApprovalOverdueCount,
            stageReportAllCount,
            stageReportOverdueCount,
            stageApprovalAllCount,
            stageApprovalOverdueCount,
            projectIntimeCount,
            projectOverdueCount
        }=this.state
        if(prevState.unitStage != this.state.unitStage){
            let projectProcessData = {
                pk:unitStage
            }
            getProjectProcess(projectProcessData,{is_project:false}).then((rst)=>{
                console.log('rst',rst)
                if(rst && rst.process_count){
                    this.setState({
                        projectIntimeCount:rst.process_count.intime,
                        projectOverdueCount:rst.process_count.overdue
                    })
                }
            })
            let totalReportAlldata = {
                code:WORKFLOW_CODE.总进度计划报批流程,
                pk:unitStage
            }
            getTotalReportAll(totalReportAlldata).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        totalReportAllCount:rst.count
                    })
                }
            })
            let now = moment().subtract(1,'days').format('YYYY-MM-DD')
            let totalReportOverdueData =　{
                code:WORKFLOW_CODE.总进度计划报批流程,
                pk:unitStage,
                date:now
            }
            getTotalReportOverdue(totalReportOverdueData).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        totalReportOverdueCount:rst.count
                    })
                }
            })


            let totalApprovalAlldata = {
                code:WORKFLOW_CODE.总进度计划报批流程,
                pk:unitStage
            }
            getTotalApprovalAll(totalApprovalAlldata).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        totalApprovalAllCount:rst.count
                    })
                }
            })
            let totalApprovalOverdueData =　{
                code:WORKFLOW_CODE.总进度计划报批流程,
                pk:unitStage,
                date:now
            }
            getTotalApprovalOverdue(totalApprovalOverdueData).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        totalApprovalOverdueCount:rst.count
                    })
                }
            })


            let stageReportAlldata = {
                code:WORKFLOW_CODE.进度管控审批流程,
                pk:unitStage
            }
            getStageReportAll(stageReportAlldata).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        stageReportAllCount:rst.count
                    })
                }
            })
            let stageReportOverdueData =　{
                code:WORKFLOW_CODE.进度管控审批流程,
                pk:unitStage,
                date:now
            }
            getStageReportOverdue(stageReportOverdueData).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        stageReportOverdueCount:rst.count
                    })
                }
            })


            let stageApprovalAlldata = {
                code:WORKFLOW_CODE.进度管控审批流程,
                pk:unitStage
            }
            getStageApprovalAll(stageApprovalAlldata).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        stageApprovalAllCount:rst.count
                    })
                }
            })
            let stageApprovalOverdueData =　{
                code:WORKFLOW_CODE.进度管控审批流程,
                pk:unitStage,
                date:now
            }
            getStageApprovalOverdue(stageApprovalOverdueData).then((rst)=>{
                if(rst && rst.total_pages){
                    this.setState({
                        stageApprovalOverdueCount:rst.count
                    })
                }
            })
            
        }
        
        let myChart = echarts.init(document.getElementById('InquiryState'));
        let option = {
            color: ['#4caf50', '#f44336'],
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                y: '8%',
                data:['按期报审','逾期报审']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            series : [
                {
                    name: '填报任务',
                    type: 'pie',
                    radius : '33%',
                    center: ['16.6%', '60%'],
                    data: [{value:totalReportAllCount+stageReportAllCount-totalReportOverdueCount-stageReportOverdueCount, name:'按期报审'},
                        {value:totalReportOverdueCount+stageReportOverdueCount, name:'逾期报审'}],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },{
                    name: '审核任务',
                    type: 'pie',
                    radius : '33%',
                    center: ['50%', '60%'],
                    data: [{value:totalApprovalAllCount+stageApprovalAllCount-totalApprovalOverdueCount-stageApprovalOverdueCount, name:'按期报审'},
                        {value:totalApprovalOverdueCount+stageApprovalOverdueCount, name:'逾期报审'}],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },{
                    name: '进度任务',
                    type: 'pie',
                    radius : '33%',
                    center: ['83.4%', '60%'],
                    data: [{value:projectIntimeCount, name:'按期报审'},
                        {value:projectOverdueCount, name:'逾期报审'}],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        myChart.setOption(option,true);

    }
    render() { //todo 各单位工程进度报审状态统计
        const{
            unitProjecte,
            unitStage
        }=this.state
		return (
            <Card >
                <h1 style={{textAlign:'center'}}>任务统计</h1>
                <Row className='mb10'>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">工程名称:</label>
                        <div className="start_input">
                            <Select style={{ width: '100%' }}
                                value={unitStage}
                                onChange={this.unitStageChange.bind(this)}
                            >
                                {unitProjecte.map((unit)=>{
                                    return <Option value={unit.pk} key={unit.pk} >{unit.name}</Option>
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col span={6}></Col>
                </Row>
                <div id='InquiryState' style={{ width: '100%', height: '422px' }}></div>
                <Row>
                    <Col span={8}>
                        <div style={{textAlign:'center'}}>
                            填报任务
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{textAlign:'center'}}>
                            审核任务
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{textAlign:'center'}}>
                            进度任务
                        </div>
                    </Col>
                </Row>
			</Card>
		);
    }
    
    unitStageChange(value){
        this.setState({
            unitStage:value
        })
    }
}
