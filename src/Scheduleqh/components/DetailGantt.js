import React, {Component} from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/locale/locale_cn.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_smart_rendering.js';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css';
import {Select,Table} from 'antd';
import style from './index.less';
import {Link} from 'react-router-dom';
import moment from 'moment';

const Option = Select.Option;
const gantt = window.gantt;

export default class DetailGantt extends Component {

    constructor(props){
		super(props)
		this.state={
			scheduleMaster:null,
			ganttData:[],
			tasks:{
				data:[]
			}
		}
    }
    setConfig(){
		let me=this;
		gantt.addMarker({
			start_date: new Date(2017,2,31),
			css: "status_line",
			text: "当前节点"
		});
		gantt.config.min_column_width = 100;
		gantt.config.date_scale = "%Y年";
		gantt.config.scale_unit = "year";
		gantt.config.readonly = true;
		gantt.config.subscales = [{
			unit: "day",
			step: 1,
			date: "%Y年%M%d日"
		}];
		gantt.config.scale_height = 60;
		gantt.config.columns = [
            {
				name: "id",
				label: "序列号",
				width: "30"
			},{
				name: "status",
				label: "状态",
                width: "50"
			},{
				name: "code",
				label: "WBS",
                width: "100"
			},{
				name: "text",
				label: "项目",
                width: "100"
			},{
				name: "start_time",
				label: "计划开始时间",
                width: "110"
			},{
				name: "end_time",
				label: "计划结束时间",
				width: "110"
			},{
				name: "actual_end_time",
				label: "实际结束时间",
				width: "110"
			}
		];
		gantt.config.static_background = true;
	}

    componentDidMount() {
		gantt.init('gannt_Detail');
		gantt.clearAll();
    }
    
    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {
                    actions: {
                        getProcessData,
                        getDocument
                    }
                } = this.props;

                let data = {
                    pk:item
                }
                let table = [];
                let me = this;
                let now = moment().format('YYYY-MM-DD');
                getProcessData(data).then((project)=>{
                    console.log('project',project)
                    if(project && project.code ){

                        let workflowData = {
                            code:"schedule_"+project.code
                        }
                        getDocument(workflowData).then((processData)=>{
                            console.log('processData',processData)
                            if(processData && processData.code && processData.extra_params && processData.extra_params.process_data){
                                let schedule = processData.extra_params.process_data;
                                for(var i=0;i<schedule.length;i++){
                                    if(!schedule[i].actual_end_time){
                                        let lagtime = me.dateCalculation(now,schedule[i].plan_end_time);
                                        let duration = me.dateCalculation(schedule[i].endTime,schedule[i].startTime)
                                        if(lagtime>0){
                                            table.push({
                                                "id":i+1, "status":"滞后", "code":schedule[i].code, "text":schedule[i].name, 
                                                "start_time":moment(schedule[i].startTime).format('YYYY年MM月DD日'), 
                                                "end_time":moment(schedule[i].endTime).format('YYYY年MM月DD日'),
                                                "actual_end_time":"未知",
                                                "start_date":moment(schedule[i].startTime).format('DD-MM-YYYY'), 
                                                "duration":duration.toString(),
                                                "progress": 1, "open": true, "priority": "1","textColor":"white"
                                            })
                                        }else{
                                            table.push({
                                                "id":i+1, "status":"正常", "code":schedule[i].code, "text":schedule[i].name, 
                                                "start_time":moment(schedule[i].startTime).format('YYYY年MM月DD日'), 
                                                "end_time":moment(schedule[i].endTime).format('YYYY年MM月DD日'),
                                                "actual_end_time":"未知",
                                                "start_date":moment(schedule[i].startTime).format('DD-MM-YYYY'), 
                                                "duration":duration.toString(),
                                                "progress": 1, "open": true, "priority": "1","textColor":"white"
                                            })
                                        }
                                    }else{
                                        let lagtime = me.dateCalculation(now,schedule[i].actual_end_time)
                                        let duration = me.dateCalculation(schedule[i].endTime,schedule[i].startTime)
                                        if(lagtime>0){
                                            table.push({
                                                "id":i+1, "status":"滞后", "code":schedule[i].code, "text":schedule[i].name, 
                                                "start_time":moment(schedule[i].startTime).format('YYYY年MM月DD日'), 
                                                "end_time":moment(schedule[i].endTime).format('YYYY年MM月DD日'),
                                                "actual_end_time":moment(schedule[i].actual_end_time).format('YYYY年MM月DD日'),
                                                "start_date":moment(schedule[i].startTime).format('DD-MM-YYYY'), 
                                                "duration":duration.toString(),
                                                "progress": 1, "open": true, "priority": "1","textColor":"white"
                                            })
                                        }else{
                                            table.push({
                                                "id":i+1, "status":"正常", "code":schedule[i].code, "text":schedule[i].name, 
                                                "start_time":moment(schedule[i].startTime).format('YYYY年MM月DD日'), 
                                                "end_time":moment(schedule[i].endTime).format('YYYY年MM月DD日'),
                                                "actual_end_time":moment(schedule[i].actual_end_time).format('YYYY年MM月DD日'),
                                                "start_date":moment(schedule[i].startTime).format('DD-MM-YYYY'), 
                                                "duration":duration.toString(),
                                                "progress": 1, "open": true, "priority": "1","textColor":"white"
                                            })
                                        }
                                    }
                                }
        
                                console.log('table',table)
                                me.setState({
                                    tasks:{
                                        data:table,
                                        links:[]
                                    }
                                })
                            }else{ 
                                me.setState({
                                    tasks:{
                                        data:[],
                                        links:[]
                                    }
                                })
                                gantt.clearAll();
                            }
                        })
                    }
                })              
            }
        }
    }

    dateCalculation =(date1,date2) =>{
        let date1Format = moment(date1).format('YYYY-MM-DD');
        let date2Format = moment(date2).format('YYYY-MM-DD');
        let date1Number = Date.parse(date1Format);
        let date2Number = Date.parse(date2Format);
        let number = (date1Number - date2Number)/24/60/60/1000;
        return number;
    }

	componentDidUpdate(){
		gantt.parse(this.state.tasks);
	}

	render() { //todo 进度模拟甘特图
        this.setConfig();
        return (
            <div>
                <div id="gannt_Detail" style = {{width: '100%',height: '723px',float:'left'}}></div>
            </div>
        );
    }
}

