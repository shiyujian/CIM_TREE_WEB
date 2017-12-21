import React, {Component} from 'react';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Radio, Calendar, Modal   } from 'antd';
import './index.less';
import {getUser} from '_platform/auth';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class ProceeTable extends Component {

    constructor(props){
        super(props);
        this.state={
            processData:[]
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {
                    actions:{
                        getDocument
                    }
                }=this.props

                let documentCode = {
                    code: "schedule_" + item.unitProjecte.code
                }
                let table = [];
                let me = this;
                getDocument(documentCode).then((processData)=>{
                    console.log('processData',processData)
                    if(processData && processData.pk && processData.extra_params){
                        if(processData && processData.pk && processData.extra_params && processData.extra_params.process_data){
                            let schedule = processData.extra_params.process_data;
                            for(var i=0;i<schedule.length;i++){
                                //还未完工
                                if(!schedule[i].actual_end_time){
                                    //未完工的与计划结束时间的对比
                                    console.log('还未完工',schedule[i].plan_end_time)
                                    let lagtime = me.dateCalculation(schedule[i].plan_end_time)
                                    if(lagtime>0){
                                        table.push({
                                            code:schedule[i].code?schedule[i].code:'',
                                            name:schedule[i].name?schedule[i].name:'',
                                            type:schedule[i].type?schedule[i].type:'',
                                            company:schedule[i].company?schedule[i].company:'',
                                            quantity:schedule[i].quantity?schedule[i].quantity:'',
                                            output:schedule[i].output?schedule[i].output:'',
                                            startTime: schedule[i].startTime?schedule[i].startTime:'',
                                            plan_end_time: schedule[i].plan_end_time?moment(schedule[i].plan_end_time).format('YYYY-MM-DD'):'',
                                            schedule: schedule[i].schedule?schedule[i].schedule:'',
                                            path: schedule[i].path?schedule[i].path:'',
                                            milestone: schedule[i].milestone?schedule[i].milestone:'',
                                            site: schedule[i].site?schedule[i].site:'',
                                            duration:lagtime
                                        })
                                    }
                                }
                            }
                            if(table.length>0){
                                me.setState({
                                    processData:table
                                })
                            }else{
                                notification.success({
                                    message:'此单位工程的任务已全部完工',
                                    duration:2
                                })
                                me.setState({
                                    processData:[]
                                })
                            }
                        }else{
                            if(processData && processData.code && processData.extra_params && processData.extra_params.scheduleMaster){
                                let schedule = processData.extra_params.scheduleMaster
                                for(var i=0;i<schedule.length;i++){
                                    if(schedule[i].endTime){
                                        let lagtime = me.dateCalculation(schedule[i].endTime)
                                        if(lagtime>0){
                                            table.push({
                                                code:schedule[i].code?schedule[i].code:'',
                                                name:schedule[i].name?schedule[i].name:'',
                                                type:schedule[i].type?schedule[i].type:'',
                                                company:schedule[i].company?schedule[i].company:'',
                                                quantity:schedule[i].quantity?schedule[i].quantity:'',
                                                output:schedule[i].output?schedule[i].output:'',
                                                startTime: schedule[i].startTime?schedule[i].startTime:'',
                                                plan_end_time: schedule[i].endTime?schedule[i].endTime:'',
                                                schedule: schedule[i].schedule?schedule[i].schedule:'',
                                                path: schedule[i].path?schedule[i].path:'',
                                                milestone: schedule[i].milestone?schedule[i].milestone:'',
                                                site: schedule[i].site?schedule[i].site:'',
                                                duration:lagtime
                                            })
                                        }
                                    }
                                }
                                me.setState({
                                    processData:table
                                })
                            }else{
                                notification.error({
                                    message:'此单位工程未发起总计度计划流程',
                                    duration:2
                                })
                                me.setState({
                                    processData:[]
                                })
                            }
                        }
                    }else{
                        notification.error({
                            message:'此单位工程未发起总计度计划流程',
                            duration:2
                        })
                        me.setState({
                            processData:[]
                        })
                    }
                })
            }
        }
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
    

    render() { //todo 进度历史
        const {
            processData 
        }=this.state
        return (
            <Row>
                <Col span={24}>
                    {
                        processData.length===0?
                        <div>
                            <h2 style={{marginBottom:'10'}}>
                            当前单位工程不存在进度报警信息，请选择其他单位工程
                            </h2>
                            <Table columns={columns}
                             dataSource={processData}
                             pagination={true}
                            />
                        </div>:
                        <Table columns={columns}
                         dataSource={processData}
                         pagination={true}
                        />
                    }
                    
                </Col>
            </Row>
        );
    }
    
}

const columns=[ {
    title:'序号',
    dataIndex:'index',
    key:'index',
    width: '5%',
    render: (text,record,index) =>{
        return <div>{index+1}</div>;
    }
},{
    title: 'WBS编码',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
},{
    title: '单位',
    dataIndex: 'company',
    key: 'company'
},{
    title: '施工图工程量',
    dataIndex: 'quantity',
    key: 'quantity'
},{
    title: '计划结束时间',
    dataIndex: 'plan_end_time',
    key: 'plan_end_time'
},{
    title: '滞后时间',
    dataIndex: 'duration',
    key: 'schedule'
},{
    title: '关键与否',
    dataIndex: 'path',
    key: 'path'
}];
