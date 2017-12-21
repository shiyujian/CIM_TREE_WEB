import React, {Component} from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/locale/locale_cn.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_smart_rendering.js';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_broadway.css';
import {Select,Table,Spin} from 'antd';
import './index.less';
import {Link} from 'react-router-dom';
import moment from 'moment';

const Option = Select.Option;
const gantt = window.gantt;

export default class Warning extends Component {

    constructor(props){
		super(props)
		this.state={
			scheduleMaster:null,
			ganttData:[],
			tasks:{
				data:[]
			},
			loading:true
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
				tree: false,
				width: "50"
			},{
				name: "text",
				label: "项目",
				tree: true,
                width: "300",
                render: text => <div className="column"><span title={text} href="#">{text}</span></div>
			},{
				name: "time_limit",
				label: "工期",
				tree: false,
				width: "60"
			},{
				name: "start_time",
				label: "计划开始时间",
				tree: false,
				width: "110"
			},{
				name: "end_time",
				label: "计划结束时间",
				tree: false,
				width: "110"
			}
		];

		// gantt.attachEvent("onTaskRowClick", function(id,row){
		// 	// console.log('test',test)
		// 	let to = `/schedule/dgndetail`;
		// 	// me.props.history.push('/schedule/dgndetail'); 
		// });

		gantt.attachEvent("onTaskDblClick", function(id,e){
			let test = gantt.getTask(id);
			let pk = '';
			if(test && test.details){
				pk = test.details
				let to = `/schedule/dgndetail/?unitPk=${pk}`;
				setTimeout(function(){me.props.history.push(to)},500); 
			}
			return true;
		});

		gantt.config.static_background = true;
	}

    
    componentDidMount() {
		const{
			actions:{
				getProjectTree,
				getTotalPlanTime
			}
		} = this.props
		gantt.init('gannt_total');
		gantt.clearAll();
		//获取最初始的树节点
		let tasks = [];
		let parent = 1;
		let ganttData = [];
        getProjectTree({},{depth:1}).then((rst)=>{
            if(rst && rst.pk ){
				let rootPk = {
					pk: rst.pk
				}
				getTotalPlanTime(rootPk).then((value)=>{
					if(value && value.children && value.children.length>0){
						for(var i=0;i<value.children.length;i++){
							let project = value.children[i]
							if(project.start_time && project.end_time){
								tasks.push({
									pk:project.pk,
									name:project.name,
									start_time:project.start_time,
									end_time:project.end_time,
									obj_type:'project'
								})
								if(project.children && project.children.length>0){
									for(var s=0;s<project.children.length;s++){
										let unit = project.children[s]
										if(unit.start_time && unit.end_time){
											tasks.push({
												pk:unit.pk,
												name:unit.name,
												start_time:unit.start_time,
												end_time:unit.end_time,
												obj_type:'unit'
											})
										}
									}
								}
							}
						}
					}

					for(var i=0;i<tasks.length;i++){
						if(tasks[i].obj_type === 'project'){
							parent = i+1;
							let sub1 = new Date(tasks[i].start_time)
							let date1 = Math.abs(sub1.getTime())

							let sub2 = new Date(tasks[i].end_time)
							let date2 = Math.abs(sub2.getTime())

							let duration = (date2 - date1)/24/60/60/1000
							ganttData.push({
								"id":i+1, "text":tasks[i].name, "time_limit":duration.toString(), "start_time":moment(tasks[i].start_time).format('YYYY年MM月DD日'), 
								"end_time":moment(tasks[i].end_time).format('YYYY年MM月DD日'),"start_date":moment(tasks[i].start_time).format('DD-MM-YYYY'), "duration":duration.toString(),
								"progress": 1, "open": true, "priority": "1","color":"red","textColor":"white"
							})
						}else if(tasks[i].obj_type === 'unit'){
							let sub1 = new Date(tasks[i].start_time)
							let date1 = Math.abs(sub1.getTime())

							let sub2 = new Date(tasks[i].end_time)
							let date2 = Math.abs(sub2.getTime())

							let duration = (date2 - date1)/24/60/60/1000
							ganttData.push({
								"id":i+1, "text":tasks[i].name, "time_limit":duration.toString(), "start_time":moment(tasks[i].start_time).format('YYYY年MM月DD日'), 
								"end_time":moment(tasks[i].end_time).format('YYYY年MM月DD日'),"details":tasks[i].pk,"start_date":moment(tasks[i].start_time).format('DD-MM-YYYY'), "duration":duration.toString(),
								"parent":parent.toString(), "progress": 1, "open": true, "priority": "1"
							})
						}
					}

					console.log('ganttData',ganttData)
					this.setState({
						tasks:{
							data:ganttData
						},
						loading:false
					})
				})
            }
        })		
	}

	componentDidUpdate(){
		
		gantt.parse(this.state.tasks);
	}

	render() { //todo 总体进度

        this.setConfig();
        const {
			projects = [], currentNode, unitChildren = [], childrenWorkPackages = []
		} = this.props;
        return (
			<div>
				<Spin spinning={this.state.loading}>
					<div id="gannt_total" 
					style = {{width: '100%',height: '723px',float:'left'}}
					ref={function(input) {
						if (input != null) {
						input.focus();
						}
					}}
					></div>
				</Spin>
            </div>
        );
    }
}

