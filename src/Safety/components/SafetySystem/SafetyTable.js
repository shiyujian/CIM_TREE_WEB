import React, { Component } from 'react';
import { Form, Icon, Table, Spin, Tabs, Modal, Row, Col, Select, DatePicker, Button, Input, InputNumber, Progress, message,Popconfirm,notification } from 'antd';
import {FILE_API,base, SOURCE_API, DATASOURCECODE,SERVICE_API,PROJECT_UNITS,WORKFLOW_CODE } from '../../../_platform/api';
import '../index.less';
import '../../../Datum/components/Datum/index.less'
import { getUser } from '../../../_platform/auth';
import TaskDetail from './TaskDetail';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchInfo from './SearchInfo';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class SafetyTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			taskVisible:false,
			taskList:[],
			filterTaskList:[],
			TaskDetailData:{},
			//多选
			selectedRowKeys: [],
            dataSourceSelected: [],			
		}
	}
	static layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};
	async componentDidMount() {
		this.gettaskSchedule()
	}

	async componentDidUpdate(prevProps,prevState){
		const{
			leftkeycode,
			searchSafety
		}=this.props
		if(searchSafety != prevProps.searchSafety){
			this.gettaskSchedule()
		}
		if(leftkeycode != prevProps.leftkeycode){
			this.filterTask()
		}
	}

	gettaskSchedule = async ()=>{
		const { actions: { getWorkflows } } = this.props;
		let reqData={};
		this.props.form.validateFields((err, values) => {
			console.log("安全体系报批流程", values);
			console.log("err", err);
			
			values.SSection?reqData.subject_sectionName__contains = values.SSection : '';
            values.SSafeName?reqData.subject_Safename__contains = values.SSafeName : '';
            values.SNumbercode?reqData.subject_numbercode__contains = values.SNumbercode : '';
			values.SDocument?reqData.subject_document__contains = values.SDocument : '';
			if(values.SSimedate && values.SSimedate instanceof Array && values.SSimedate.length>0){
            	values.SSimedate?reqData.real_start_time_begin = moment(values.SSimedate[0]._d).format('YYYY-MM-DD 00:00:00') : '';
            	values.SSimedate?reqData.real_start_time_end = moment(values.SSimedate[1]._d).format('YYYY-MM-DD 23:59:59') : '';
			}
			values.SStatus?reqData.status = values.SStatus : (values.SStatus === 0? reqData.SStatus = 0 : '');
		})
		console.log('reqData',reqData)
        

        let tmpData = Object.assign({}, reqData);


		let task = await getWorkflows({ code: WORKFLOW_CODE.安全体系报批流程 },tmpData);

		let taskList = [];
		if(task && task instanceof Array){
			task.map((item,index)=>{
				let subject = item.subject[0];
				let creator = item.creator;
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
                    submitperson:creator.person_name?creator.person_name+'('+creator.username+')':creator.username,
					submittime:moment(item.workflow.created_on).utc().zone(-8).format('YYYY-MM-DD'),
					submitUnit:postData.upload_unit?postData.upload_unit:'',
                    status:item.status,
                    document:subject.document?JSON.parse(subject.document):'',
                    file:subject.file?JSON.parse(subject.file):'',
					dataReview:subject.dataReview?JSON.parse(subject.dataReview).person_name:'',
					TreatmentData: subject.TreatmentData?JSON.parse(subject.TreatmentData):[]
                }
                taskList.push(itemarrange);
			})
			console.log('taskList',taskList)
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
			selectCode = code[0] || '';

			taskList.map((task)=>{
			
				let projectName = task.projectName
				let projectCode = this.getProjectCode(projectName)
				
				if(projectCode === selectCode && task.section === sections[0]){
					filterTaskList.push(task);
				}
			})
		}else{
			//不关联标段的人可以看选择项目的进度流程
			selectCode = leftkeycode
			taskList.map((task)=>{
			
				let projectName = task.projectName
				let projectCode = this.getProjectCode(projectName)
				
				if(projectCode === selectCode ){
					filterTaskList.push(task);
				}
			})

		}      
		
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
		const {
			filterTaskList,
			taskVisible,
			selectedRowKeys
		}=this.state

		let user = getUser()
        let username = user.username

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
		};
		

		return (
			<div>
				<SearchInfo {...this.props} {...this.state} gettaskSchedule={this.gettaskSchedule.bind(this)}/>
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
				{
                    username === 'admin'?
                    <Popconfirm
                      placement="leftTop"
                      title="确定删除吗？"
                      onConfirm={this.deleteClick.bind(this)}
                      okText="确认"
                      cancelText="取消"
                    >
                        <Button >删除</Button>
                    </Popconfirm>
                    :
                    ''
                }
				<Table
                    columns={this.columns}
                    rowSelection={username === 'admin'?rowSelection:null} 
                    dataSource={filterTaskList} 
                    bordered
                    className='foresttable'
				/>
			</div>
		);
	}
	onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys',selectedRowKeys)
        console.log('selectedRows',selectedRows)
        this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
	}
	
	// 删除
    deleteClick = async () => {
        const{
            actions:{
                deleteFlow
            }
        }=this.props
        const { 
            dataSourceSelected 
        } = this.state
        if (dataSourceSelected.length === 0) {
            notification.warning({
                message: '请先选择数据！',
                duration: 3
            });
            return
        } else {

            let user = getUser()
            let username = user.username

            if(username != 'admin'){
                notification.warning({
                    message: '非管理员不得删除！',
                    duration: 3
                });
                return
            }

            let flowArr = dataSourceSelected.map((data)=>{
                if(data && data.id){
                    return data.id
                }
            })
             
            let promises = flowArr.map((flow)=>{
                let data = flow
                let postdata = {
                    pk:data
                }
                return deleteFlow(postdata)
            })

            Promise.all(promises).then(rst => {
                console.log('rst',rst)
                notification.success({
                    message: '删除流程成功',
                    duration: 3
                });
                this.setState({
                    selectedRowKeys:[],
                    dataSourceSelected:[]
                })
                this.gettaskSchedule()
            });
        }
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

export default Form.create()(SafetyTable)

