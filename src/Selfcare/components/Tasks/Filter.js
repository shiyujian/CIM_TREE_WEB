import React, {Component} from 'react';
import {Form, Row, Col, Input, Select, Button, DatePicker} from 'antd';
import {getUser} from '../../../_platform/auth';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;

class Filter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};

	constructor(props){
		super(props);
		this.state = {
			newTaskNameArr : [],
			userSelect:[]
		}
	}

	componentDidMount(){
		const {actions:{getTasksList}} = this.props;
		let ttt=getTasksList();
		console.log('ttt',ttt)
		getTasksList().then(rst => {
			console.log('rst',rst)
			if(rst.length){
				const taskNameArr = [];
				const newTaskNameArr = [];
				rst.forEach(task => {
					const {id,name} = task;
					taskNameArr.push({id,name})
				})
				this.unique(taskNameArr,newTaskNameArr);
				this.setState({newTaskNameArr})
			}
		})
		this.getUserSelect()
	}

	componentDidUpdate(prevProps,prevState){
		const{
			platform:{tasks = []}
		}=this.props
		
		if(tasks && tasks.length>0 && tasks != prevProps.platform.tasks){
			console.log('tasks',tasks )
			console.log('prevProps.platform.tasks',prevProps.platform.tasks )
			console.log('prevProps.platform.tasks === tasks',prevProps.platform.tasks === tasks )
			this.getUserSelect()
		}
	}

	getUserSelect(){
		const{
			platform:{tasks = []}
		}=this.props
		if(tasks && tasks instanceof Array && tasks.length>0){
			let arr = []
			let creators = []
			tasks.map((task)=>{
				creators.push(task.creator)				
			})
			creators = this.getUnique('id',creators)
			creators.map((creator)=>{
				arr.push(<Option value={String(creator.id)} key ={creator.id}>{creator.person_name?creator.person_name:creator.username}</Option>)
			})
			
			this.setState({
				userSelect:arr
			})
		}else{
			this.setState({
				userSelect:[]
			})
		}

	}

	//key指属性名,arr为数组，数组去重方法
	getUnique(key,arr) {
		var unique = [arr[0]];
		for (var i = 1; i < arr.length; i++) {
			if (key === undefined) {
				if (unique.indexOf(arr[i]) == -1){
					unique.push(arr[i])
				};
			} else {
				inner: {
					var has = false;
					for (var j = 0; j < unique.length; j++) {
						if (arr[i][key] == unique[j][key]) {
							has = true;
							break inner;
						}
					}
				}
				if (!has) {
					unique.push(arr[i]);
				}
			}
		}
		console.log('unique',unique)
		return unique;
	}

	render() {
		const { 
			platform: { users = [] }, 
			form: { getFieldDecorator }
		} = this.props;
		const {
			newTaskNameArr = [],
			userSelect =[]
		} = this.state;
		return (
			<Form>
				<Row>
					<Col span={20}>
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label="任务名称">
									{
										getFieldDecorator('workflowactivity',{
											rules: [
                                            	{ required: false ,message:'请输入任务名称'},
                                        	]
										})
										(<Input placeholder="请输入任务名称"/>)
									}	
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="任务类型">
								{
                                    getFieldDecorator('workflow',{
                                        rules: [
                                            { required: false ,message:'请选择任务类型'},
                                        ]
									})
                                    (<Select placeholder="请选择任务类型" allowClear>
										{
											newTaskNameArr.map(item => {
												return <Option key={item.id} value={item.name}>{item.name}</Option>
											})
										}
									</Select>)
                                }							
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="表单状态">
								{
                                    getFieldDecorator('status',{
                                        rules: [
                                            { required: false ,message:'请输入任务类别'},
                                        ]
									})
                                    (<Select placeholder="请选择表单状态" allowClear>
										<Option value="0">编辑中</Option>
										<Option value="1">已提交</Option>
										<Option value="2">执行中</Option>
										<Option value="3">已完成</Option>
										<Option value="4">已废止</Option>
										<Option value="5">异常</Option>
									</Select>)
                                }						
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<FormItem {...Filter.layout} label="发起人">
									{
										getFieldDecorator('creator',{
											rules: [
												{ required: false ,message:'发起人'},
											]}
										)
										(
										// <Input placeholder="请输入发起人姓名"/>
											<Select showSearch allowClear
												placeholder="请选择发起人"
												optionFilterProp="children"
												filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											>
												{
													userSelect
												}
											</Select>
										)
									}
									
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...Filter.layout} label="发起时间">
								{
                                    getFieldDecorator('startTime',{
                                        rules: [
                                            { type: 'array', required: false ,message:'时间'},
                                        ]}
                                    )
                                    (<RangePicker size="default" format="YYYY年MM月DD日" />)
                                } 
								</FormItem>
							</Col>
						</Row>
					</Col>
					<Col span={3} offset={1}>
						<Row>
							<FormItem>
								<Button
									onClick={this.query.bind(this)}>查询</Button>
							</FormItem>
						</Row>
						<Row>
							<FormItem>
								<Button onClick={this.clear.bind(this)}>清除</Button>
							</FormItem>
						</Row>
					</Col>
				</Row>
			</Form>
		);
	}

	unique(arr,newArr) {
		let isRepeated;
		for (let i = 0, len = arr.length; i < len; i++) {
				isRepeated = false;
				for (let j = 0, len = newArr.length; j < len; j++) {
					if (arr[i].name == newArr[j].name) {   
						isRepeated = true;
						break;
					}
			}
			if (!isRepeated) {
				newArr.push(arr[i]);
			}
		}
		return newArr;
	}

	query() {
		const {
			actions: { getTasks ,setLoadingStatus},
			filter = {}
		} = this.props;
		const user = getUser();
		console.log(this.props)
		this.props.form.validateFields(async (err, values) => {
			let conditions = {
				task: filter.type || "processing",
				executor:user.id,
				workflowactivity:values.workflowactivity || "",
				workflow:values.workflow || "",
				creator:values.creator || "",
				status:values.status || "",
				real_start_time_begin:"",
				real_start_time_end:"",
			}
			if (values && values.startTime && values.startTime.length > 0) {
				conditions.real_start_time_begin = moment(values.startTime[0]).format('YYYY-MM-DD 00:00:00');
				conditions.real_start_time_end = moment(values.startTime[1]).format('YYYY-MM-DD 23:59:59');
			}
			for (const key in conditions) {
				if (!conditions[key] || conditions[key] == "") {
					delete conditions[key];
				}
			}
            setLoadingStatus(true);
			await getTasks({},conditions);
            setLoadingStatus(false);
		})
	}

	clear() {
		this.props.form.setFieldsValue({
            workflowactivity: undefined,
            workflow: undefined,
            creator: undefined,
            startTime: undefined,
            status:undefined
        });
	}
};
export default Filter = Form.create()(Filter);
