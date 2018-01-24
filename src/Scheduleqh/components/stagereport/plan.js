import React, {Component} from 'react';
import {Row, Col,Input, Form, Spin,Icon,Button,Table,Modal,DatePicker,Progress,Upload,Select,Checkbox} from 'antd';
// import {UPLOAD_API} from '_platform/api';
import moment from 'moment';
import {WORKFLOW_CODE} from '_platform/api';
import {getNextStates} from '../../../_platform/components/Progress/util';
import PerSearch from './PerSearch';
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const FILE_API = "";
const Dragger = Upload.Dragger;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
export default class Stagereporttab extends Component {

	constructor(props) {
		super(props);
		this.state = {
			addvisible:false,
			editvisible:false,
			departOptions:"",
			data:{
				stime1: moment().format(''),
                etime1: moment().format(''),
			},
			selectedRowKeys:"",
			stime1: moment().format(''),
            etime1: moment().format(''),
			tabledata:[
				{
					gongcheng:"qwd"
				},{
					gongcheng:"qwd"
				},{
					gongcheng:"qwd"
				},{
					gongcheng:"qwd"
				},{
					gongcheng:"qwd"
				}]
		};
	}
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    state={
        progress:0,
        isUploading: false
    }
	render() {
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14}
		};
		let {progress,isUploading} = this.state;
		// const {
		// 	form: {getFieldDecorator}
		// } = this.props.props;
		const dataSource = [
			{project:"www"}
		];
		const columns = [
			{
				title:'2单位工程',
				dataIndex:'gongcheng',
				key: 'gongcheng',
				width: '15%'
			},{
				title:'进度类型',
				dataIndex:'type',
				key: 'type',
				width: '10%'
			},{
				title:'编号',
				dataIndex:'company',
				key: 'company',
				width: '10%'
			},{
				title:'提交人',
				dataIndex:'quantity',
				key: 'quantity',
				width: '10%'
			},{
				title:'日期',
				dataIndex:'output',
				key: 'output',
				width: '10%'
			},{
				title:'流程状态',
				dataIndex:'total',
				key: 'total',
				width: '15%',
			},{
			title: '操作',
			render: (record) => {
				let nodes = [];
				nodes.push(
					<div>
						<a onClick={this.previewFile.bind(this, record)}>查看</a>
						<a style={{ marginLeft: 10 }} onClick={this.download.bind(this, record)}>下载</a>					
						<a style={{ marginLeft: 10 }} type="primary" onClick={this.look.bind(this)}>查看流程卡</a>
					</div>
				);
				return nodes;
			    }
		    }
		];
		const columns1 = [
			{
				title:'项目',
				dataIndex:'project',
				key: 'project',
				width: '60%'
			},{
				title:'单位',
				dataIndex:'unit',
				key: 'unit',
				width: '15%'
			},{
				title:'数量',
				dataIndex:'number',
				key: 'number',
				width: '15%'
			}
		];
		const columns2 = [
			{
				title:'名称',
				dataIndex:'gongcheng',
				key: 'gongcheng',
				width: '15%'
			},{
				title:'备注',
				dataIndex:'type',
				key: 'type',
				width: '10%'
			},{
				title:'操作',
				dataIndex:'company',
				key: 'company',
				width: '10%'
			}
		];
		
		return (
			<div>
				<Form>
					<Row>
					<Col span={7}>
						<FormItem {...formItemLayout} label="单位工程">
							
								<Input type="text" onChange={this.search.bind(this,'gongcheng')} value={this.state.data.gongcheng}/>
							
						</FormItem>
					</Col>
					<Col span={7}>
						<FormItem {...formItemLayout} label="编号">

								<Input type="text" onChange={this.search.bind(this,'number')} value={this.state.data.number}/>
							
						</FormItem>
					</Col>	
					<Col span={7}>
						<FormItem {...formItemLayout} label="监理单位">
						
								<Input type="text" onChange={this.search.bind(this,'jianli')} value={this.state.data.jianli}/>
							
						</FormItem>
					</Col>
					<Col span={3}>
						<Button onClick={this.clear.bind(this)}>清空</Button>
					</Col>
					</Row>
					<Row>
					<Col span={7}>
						<FormItem {...formItemLayout} label="日期">
								<RangePicker 
									style={{verticalAlign:"middle"}} 
									Value={[moment(this.state.data.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.data.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
									showTime={{ format: 'HH:mm:ss' }}
									format={'YYYY/MM/DD HH:mm:ss'}
									onChange={this.datepick.bind(this)}
									onOk={this.datepickok.bind(this)}
									>
									</RangePicker>
								{/*<Input type="text" onChange={this.search.bind(this,'data')} value={this.state.data.data}/>*/}
							
						</FormItem>
					</Col>
					<Col span={3}></Col>
					<Col span={7}>
						<FormItem {...formItemLayout} label="流程状态">
						
								<Input type="text" onChange={this.search.bind(this,'status')} value={this.state.data.status}/>
							
						</FormItem>
					</Col>
					<Col span={4}>
					</Col>
					<Col span={3}>
						<Button type="primary" onClick={this.query.bind(this)}>查询</Button>
					</Col>
					</Row>
				</Form>
				<Button onClick={this.add.bind(this)}>新增</Button>
				<Button>删除</Button>
				<Table 
						columns={columns} 
						dataSource={this.state.tabledata}
						bordered
						rowSelection={this.rowSelection}
						pagination={{pageSize: 9}}
						style={{marginTop:20}}
						/>
				<Modal title="新增总计划进度"
					width={900}
					visible={this.state.addvisible}
					onOk={this.save.bind(this)}
					onCancel={this.close.bind(this)}>
					<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="单位工程">
								
									<Input type="text" onChange={this.search.bind(this,'gongcheng')} />
								
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem {...formItemLayout} label="编号">

									<Input type="text" onChange={this.search.bind(this,'number')} />
								
							</FormItem>
						</Col>
						</Row>
						<Row>	
						<Col span={12}>
							<FormItem {...formItemLayout} label="监理单位">
							
									<Input type="text" onChange={this.search.bind(this,'jianli')} />
								
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem {...formItemLayout} label="日期">
									<RangePicker 
									style={{verticalAlign:"middle"}} 
									Value={[moment(this.state.data.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.data.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
									showTime={{ format: 'HH:mm:ss' }}
									format={'YYYY/MM/DD HH:mm:ss'}
									onChange={this.datepick.bind(this)}
									onOk={this.datepickok.bind(this)}
									>
									</RangePicker>
							
									{/*<Input type="text" onChange={this.search.bind(this,'number')}/>*/}
								
							</FormItem>
						</Col>
						</Row>
						<Row>
							<Table 
								columns={columns1} 
								dataSource={dataSource}
								rowSelection={this.rowSelection}
								bordered
								style={{marginTop:20}}
								/>
						</Row>
						<Row>
							<Button onClick={this.addtext.bind(this)}>添加</Button>
							<Button>删除</Button>
						</Row>
						<Row style={{position:"relative"}}>
							<Col span={12} style={{position:"absolute",top:"20px"}}>
							<FormItem {...formItemLayout} label="审核人">
								<PerSearch
									selectMember={this.selectMember.bind(this)}
								/>
								{/* <Select 
									placeholder="请选择部门"
									notFoundContent="暂无数据"
									value=""
									onSelect={this.onDepartments.bind(this,'departments') }>
									{this.state.departOptions}
								</Select> */}
							</FormItem>
							</Col>
							<Col span={12} style={{position:"absolute",top:"20px",left:"200px"}}>
							<FormItem {...formItemLayout}>
								<Checkbox>短信通知</Checkbox>
							</FormItem>
							</Col>
						</Row>
				</Modal>
				<Modal title="新增文档"
						width={900}
						visible={this.state.editvisible}
						onOk={this.editSave.bind(this)}
						onCancel={this.editClose.bind(this)}>
						<Row>
						<Col span={12}>
							<FormItem {...formItemLayout} label="单位工程">
								
									<Input type="text" onChange={this.search.bind(this,'gongcheng')}  />
								
							</FormItem>
						</Col>
						<Col span={12}>
							<FormItem {...formItemLayout} label="编号">

									<Input type="text" onChange={this.search.bind(this,'number')}/>
								
							</FormItem>
						</Col>
						</Row>
						<Row>	
						<Col span={12}>
							<FormItem {...formItemLayout} label="监理单位">
							
									<Input type="text" onChange={this.search.bind(this,'jianli')}/>
								
							</FormItem>
						</Col>
						<Col span={12}>
							<Button type="primary">模板下载</Button>
						</Col>
						</Row>
						<Row>
							<Dragger {...this.uploadProps}
											accept={fileTypes}
											onChange={this.changeDoc.bind(this)}>
									<p className="ant-upload-drag-icon">
										<Icon type="inbox"/>
									</p>
									<p className="ant-upload-text">点击或者拖拽开始上传</p>
									<p className="ant-upload-hint">
										支持 pdf、doc、docx 文件

									</p>
								</Dragger>
								<Progress percent={progress} strokeWidth={5}/>
						</Row>
						<Row>
							<Table 
								columns={columns2} 
								dataSource={dataSource}
								bordered
								style={{marginTop:20}}
								/>
						</Row>
						<Row style={{position:"relative"}}>
							<Col span={12} style={{position:"absolute",top:"20px"}}>
							<FormItem {...formItemLayout} label="审核人" >
								<PerSearch
									selectMember={this.selectMember.bind(this)}
								/>
								{/* <Select 
										placeholder="请选择部门"
										notFoundContent="暂无数据"
										value=""
										onSelect={this.onDepartments.bind(this,'departments') }>
										{this.state.departOptions}
								</Select> */}
							</FormItem>
							</Col>
							<Col span={12} style={{position:"absolute",top:"20px",left:"200px"}}>
							<FormItem {...formItemLayout} >
								<Checkbox onChange={this.check.bind(this)}>短信通知</Checkbox>
							</FormItem>
							</Col>
						</Row>
				</Modal>
			</div>
		)
	}
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			this.setState({
				selectedRowKeys:selectedRowKeys,
			})
		},
		// onChange: (selectedRowKeys,selectedRows) => {
		// 	// this.selectedCodes = selectedRowKeys;
		// 	console.log(selectedRowKeys);
			
		// }
	};

	//选择人员
    selectMember(memberInfo) {
        const{
            form:{
                setFieldsValue
            }
        }=this.props
        this.member = null;
        if(memberInfo){
            let memberValue = memberInfo.toString().split('#');
            if(memberValue[0] === 'C_PER'){
                this.member = {
                    "username": memberValue[4],
                    "person_code": memberValue[1],
                    "person_name": memberValue[2],
                    "id": parseInt(memberValue[3])
                }
            }
        }else{
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member
        });
        console.log('this.member',this.member)
    }
	previewFile(){

	}
	download(){
        console.log(this.props);
	}
	look(){

	}
	datepick(e){
        console.log(e);
	}
    datepickok(e){
    	console.log(e);
    	this.setState({
       	  data: {
	        	...this.state.data,
	        	begin:e[0]?moment(e[0]).add(8, 'h').unix():'',
	        	end:e[1]?moment(e[1]).add(8, 'h').unix():'',
	        }

       })
    }

	search(key,e){
       console.log(key,e.target.value);
       this.setState({
       	  data: {
	        	...this.state.data,
	        	[key]:e.target.value
	        }

       })
	}
	check(e){
		console.log(e.target.checked);

	}
	query(){
		console.log(this.state.data);

	}
	clear(){
		this.setState({
			data:{}
		})
	}
	add(){
		this.setState({
			addvisible:true,
		})
	}
	addtext(){
		this.setState({
			editvisible:true,
		})
	}
	
	save(){
		const {
            actions: {
                createFlow, 
                addActor, 
                commitFlow, 
                startFlow,
				carbonCopy,
				getWorkflowById
			},
			item
		} = this.props;
		
		const user = getUser();
        const currentUser = {
            "username": user.username,
            "person_code": user.code,
            "person_name": user.name,
            "id": parseInt(user.id)
		};
		let subject = [{
            "project":JSON.stringify({"code": item.project}),
		}];
		
        let WORKFLOW_MAP = {
            name:"总进度计划报批流程",
            desc:"进度管理总进度计划填报审批流程",
            code:WORKFLOW_CODE.总进度计划报批流程
		};
		let postdata={
            name: WORKFLOW_MAP.name,
            description: WORKFLOW_MAP.desc,
            subject: subject,
            code: WORKFLOW_MAP.code,
            creator: currentUser,
            plan_start_time: null,
			deadline: null,
			status:2
		}

		const nextUser = this.member;
		
		createFlow({},postdata).then((instance)=>{
			if(!instance.id){
				notification.error({
					message:'流程提交失败',
					duration:2
				})
				return;
			}
			const {id,workflow: {states = []} = {}} = instance;
			const [{id:state_id,actions:[action]}] = states;
		   
			getWorkflowById({id:id}).then(instance =>{
				if(instance && instance.current){
					let currentStateId = instance.current[0].id;
					let nextStates = getNextStates(instance,currentStateId);
					console.log('nextStates',nextStates)
					let stateid = nextStates[0].to_state[0].id;

					let postInfo={
						next_states:[{
							state:stateid,
							participants:[nextUser],
							deadline:null,
							remark:null
						}],
						state:instance.workflow.states[0].id,
						executor:currentUser,
						action:nextStates[0].action_name,
						note:"提交",
						attachment:null
					}
					let data={pk:id};
					//提交流程到下一步
					putFlow(data,postInfo).then(rst =>{
						if(rst && rst.creator){
							notification.success({
								message: '流程提交成功',
								duration: 2
							});
							me.setState({
								addvisible:false
							})
						}else{
							notification.error({
								message: '流程提交失败',
								duration: 2
							});
							return;
						}
					});
					
					
				}
			});
			
		});
		
	}
	close(){
		this.setState({
			addvisible:false
		})
	}
	editSave(){
		this.setState({
			editvisible:false
		})
	}
	editClose(){
		this.setState({
			editvisible:false
		})
	}
	changeDoc(){}

	uploadProps = {
        name: 'file',
        action: `${FILE_API}/api/user/files/`,
        showUploadList: false,
        data(file) {
            return {
                name: file.fileName,
                a_file: file,
            };
        },
        beforeUpload(file) {
            const valid = fileTypes.indexOf(file.type) >= 0;
            //console.log(file);
            if (!valid) {
                message.error('只能上传 pdf、doc、docx 文件！');
            }
            return valid;
            this.setState({ progress: 0 });
        },
    };
    changeDoc({file, fileList, event}) {
        const {
            docs = [],
            actions: {changeDocs}
        } = this.props;
        if (file.status === 'done') {
            changeDocs([...docs, file]);
        }
        this.setState({
            isUploading: file.status === 'done' ? false : true
        })
        if(event){
            let {percent} = event;
            if(percent!==undefined)
                this.setState({progress:parseFloat(percent.toFixed(1))});
        }
    }
}
