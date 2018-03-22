import React, { Component } from 'react';
import { Form, Icon, Table, Spin, Tabs, Modal, Row, Col, Select, DatePicker, Button, Input, InputNumber, Progress, message } from 'antd';
import {FILE_API,base, SOURCE_API, DATASOURCECODE,UNITS,SERVICE_API,PROJECT_UNITS,SECTIONNAME,WORKFLOW_CODE } from '../../../_platform/api';
import '../index.less';
import '../../../Datum/components/Datum/index.less'
import { getUser } from '../../../_platform/auth';
import TaskDetail from './TaskDetail';
import moment from 'moment';
import 'moment/locale/zh-cn';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class SafetyTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			taskVisible:false,
			taskList:[],
			filterTaskList:[],
			TaskDetailData:{}			
		}
	}
	static layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	async componentDidMount() {
		const{
			actions:{
				getTaskSafety
			}
		}=this.props
		getTaskSafety({code:WORKFLOW_CODE.安全体系报批流程})
	}

	async componentDidUpdate(prevProps,prevState){
		const{
			safetyTaskList
		}=this.props
		if(safetyTaskList != prevProps.safetyTaskList){
			this.getTaskList()
		}
	}

	getTaskList(){
		const{
			safetyTaskList
		}=this.props
		let taskList = [];
		if(safetyTaskList && safetyTaskList instanceof Array){
			safetyTaskList.map((item,index)=>{
				let subject = item.subject[0];
				let postData = subject.postData?JSON.parse(subject.postData):null;
				
                let itemarrange = {
                    index:index+1,
                    id:item.id,
                    section: subject.section?JSON.parse(subject.section):'',
                    sectionName: subject.sectionName?JSON.parse(subject.sectionName):'',
					projectName: subject.projectName?JSON.parse(subject.projectName):'',
					Safename: subject.Safename?JSON.parse(subject.Safename):'',
                    type: postData.type,
                    numbercode:subject.numbercode?JSON.parse(subject.numbercode):'',
                    submitperson:item.creator.person_name,
					submittime:item.real_start_time,
					submitUnit:postData.upload_unit?postData.upload_unit:'',
                    status:item.status,
                    document:subject.document?JSON.parse(subject.document):'',
                    file:subject.file?JSON.parse(subject.file):'',
                    dataReview:subject.dataReview?JSON.parse(subject.dataReview).person_name:''
                }
                taskList.push(itemarrange);
			})
			this.setState({
				taskList:taskList
			},()=>{
				this.filterTask()
			})
		}
	}

	//对流程信息根据选择项目进行过滤
    filterTask(){
        const {
            taskList 
        }=this.state
        const{
            leftkeycode
        }=this.props
        let filterTaskList = []
        let user = getUser()
        
        let sections = user.sections
        
        sections = JSON.parse(sections)
        let selectCode = ''
        //关联标段的人只能看自己项目的进度流程
        if(sections && sections instanceof Array && sections.length>0){
            let code = sections[0].split('-')
            selectCode = code[0] || ''
        }else{
            //不关联标段的人可以看选择项目的进度流程
            selectCode = leftkeycode
        }
        
        taskList.map((task)=>{
            let projectName = task.projectName
            let projectCode = this.getProjectCode(projectName)
            if(projectCode === selectCode){
                filterTaskList.push(task);
            }
        })   
        
        this.setState({
            filterTaskList:filterTaskList
        })
	}
	
	//获取项目code
    getProjectCode(projectName){
        let projectCode = ''
        PROJECT_UNITS.map((item)=>{
            if(projectName === item.value){
                projectCode = item.code
            }
        })
		
		return projectCode 
    }

	render() {
		const{
			safetyTaskList
		}=this.props
		const {
			filterTaskList,
			taskVisible
		}=this.state
		return (
			<div>
                {
                    taskVisible &&
                    <TaskDetail
                        {...this.props}
						{...this.state}
						{...this.state.TaskDetailData}
                        oncancel={this.taskDetailCancle.bind(this)}
                        onok={this.taskDetailOk.bind(this)}
                    />
                }
                <Button onClick={this.addClick.bind(this)}>新增</Button>
				<Table
                    columns={this.columns}
                    // rowSelection={rowSelection}
                    dataSource={filterTaskList} 
                    bordered
                    className='foresttable'
				/>
			</div>
		);
	}
	 // 新增按钮
	 addClick = () => {
        const { actions: { AddVisible } } = this.props;
		AddVisible(true);
	}
	// 操作--查看
    clickInfo(record) {
        this.setState({ taskVisible: true ,TaskDetailData:record});
	}
	// 取消
    taskDetailCancle() {
        this.setState({ taskVisible: false });
    }
    // 确定
    taskDetailOk() {
        this.setState({ taskVisible: false });
    }
	columns = [
		{
			title: "标段",
			key:'sectionName',
			dataIndex: 'sectionName',
		}, {
			title: "名称",
			dkey:'Safename',
			dataIndex: 'Safename',
		}, {
			title: "编号",
			key:'numbercode',
			dataIndex: 'numbercode',
		}, {
			title: "文档类型",
			key:'document',
			dataIndex: 'document',
		}, {
			title: "提交单位",
			key:'submitUnit',
			dataIndex: 'submitUnit',
		}, {
			title: "提交人",
			key:'submitperson',
			dataIndex: 'submitperson',
		}, {
			title: "提交时间",
			key:'submittime',
			dataIndex: 'submittime',
			sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD')
			}
		}, {
			title: '流程状态',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			render:(record,index)=>{
                if(record===1){
                    return '已提交'
                }else if(record===2){
                    return '执行中'
                }else if(record===3){
                    return '已完成'
                }else{
                    return ''
                }
            }
		}, {
			title: "操作",
			render: record => {
				return (
					<span>
						<a onClick={this.clickInfo.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		}
	];
}

