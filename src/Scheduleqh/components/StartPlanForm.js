import React, {Component} from 'react';
import {Select, Button, Row, Col, DatePicker, Input, Icon, Checkbox, Card, notification, Table } from 'antd';
import  './index.less';
import PerCarbon from './PerCarbon';
import Dragger from '_platform/components/panels/Dragger';
import moment from 'moment';
import PerByOrg from './PerByOrg';
import {getUser} from '_platform/auth';
import {WORKFLOW_CODE} from '_platform/api';
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class StartPlanForm extends Component {
    constructor(props){
        super(props);
        this.state={
            attachmentFile:'',
            project:'',
            unitProject:'',
            supervisionUnitOrgs:[],
            constructionUnitOrgs:[],
            supervisionUnit:[],
            constructionUnit:[],
            constructionPeopleList:[],
            supervisionPeopleList:[],
            constructPerson:null,
            superPerson:null,
            
            emailNoticeState:false,
            messageNoticeState:false,
            reportTime: null,
            approvalTime: null,
            workflowDetail:null,
            workflowDisabled:true,
            approvalLimit:null,
            reportValue:null,
            current:1,
            startDatasource:[],
            loading:false,
            total:0,
            tableVisible:true
        }
        this.supervision = null;
        this.construction = null;
        this.supervisionMember = null;
        this.constructionMember = null;
        this.memberCarbon = [];
    }
    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {actions: {
                    getUnitWorkflow
                }} = nextProps;
                let constructionUnitOrgs = [];
                let supervisionUnitOrgs = [];
                if(item.unitProjecte && item.unitProjecte.extra_params && item.unitProjecte.extra_params.unit){
                    for(var s=0;s<item.unitProjecte.extra_params.unit.length;s++){
                        if(item.unitProjecte.extra_params.unit[s].code && item.unitProjecte.extra_params.unit[s].code!='' && 
                        item.unitProjecte.extra_params.unit[s].code.substring(0,1) ==='C'){
                            constructionUnitOrgs.push(item.unitProjecte.extra_params.unit[s])
                        }else if(item.unitProjecte.extra_params.unit[s].code && item.unitProjecte.extra_params.unit[s].code!='' && 
                        item.unitProjecte.extra_params.unit[s].code.substring(0,1) ==='J'){
                            supervisionUnitOrgs.push(item.unitProjecte.extra_params.unit[s])
                        }
                    }
                    if(constructionUnitOrgs.length>0){
                        this.setState({
                            constructionUnitOrgs:constructionUnitOrgs
                        })
                    }else{
                        this.setState({
                            constructionUnitOrgs:[]
                        })
                    }
                    if(supervisionUnitOrgs.length>0){
                        this.setState({
                            supervisionUnitOrgs:supervisionUnitOrgs
                        })
                    }else{
                        this.setState({
                            supervisionUnitOrgs:[]
                        })
                    }
    
                }
                this.setState({
                    tableVisible:false
                })
                let data = {
                    code:WORKFLOW_CODE.总进度计划报批流程,
                    pk:item.unitProjecte.pk
                }
                //所选择的单位工程有没有发起过流程，正在执行中或者执行完成的都算在内
                getUnitWorkflow(data).then((rst)=>{
                    if (rst && rst.data && rst.data.length>0) {
                        this.setState({
                            workflowDisabled:true
                        })     
                    }else{
                        this.setState({
                            workflowDisabled:false
                        })  
                    }
                })
            }
            
        }
    }
    componentDidMount(){
        const {
            actions: {
                getOrgTree,
                getStartWorkflow
            }
        } = this.props;
        let me=this
        
        let startWorkflow = {
            code:WORKFLOW_CODE.总进度计划报批流程,
            page:1
        }
        getStartWorkflow(startWorkflow).then((rst)=>{
            if(rst &&　rst.data && rst.data.length>0){
                let table = []
                for(var i=0;i<rst.data.length;i++){
                    let test = rst.data[i]
                    if(test  && test.subject && test.subject.length>0){
                        table.push({
                            index:i+1,
                            project:test.subject[0].project?JSON.parse(test.subject[0].project).name:'',
                            unit:test.subject[0].unit?JSON.parse(test.subject[0].unit).name:'',
                            workflow:'总进度计划报批流程',
                            creator:test.creator.person_name?test.creator.person_name:test.creator.username,
                            currenUser:test.current[0].participants[0].executor.person_name?test.current[0].participants[0].executor.person_name:test.current[0].participants[0].executor.username,
                            status:test.current[0].name
                        })  
                    }
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
        const { actions: {getStartWorkflow}} = this.props;

        let startWorkflow = {
			code:WORKFLOW_CODE.总进度计划报批流程,
			page: page
		}
        getStartWorkflow(startWorkflow).then(rst => {
            if(rst && rst.data && rst.data.length>0){
                let workFlows = rst.data
                let table = []
				for(var i=0;i<rst.data.length;i++){
                    let test = rst.data[i]
                    if(test  && test.subject && test.subject.length>0){
                        table.push({
                            index:i+1,
                            project:test.subject[0].project?JSON.parse(test.subject[0].project).name:'',
                            unit:test.subject[0].unit?JSON.parse(test.subject[0].unit).name:'',
                            workflow:'总进度计划报批流程',
                            creator:test.creator.person_name?test.creator.person_name:test.creator.username,
                            currenUser:test.current[0].participants[0].executor.person_name?test.current[0].participants[0].executor.person_name:test.current[0].participants[0].executor.username,
                            status:test.current[0].name
                        })  
                    }
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


    render() { //todo 发起计划
        const{
            supervisionUnitOrgs,
            constructionUnitOrgs,
            startDatasource,
            total,
            tableVisible,
            constructionPeopleList,
            supervisionPeopleList
        }=this.state;
        const{
            item
        }=this.props
        const date = [
            1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
        ]
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index'
            },
            {
                title: '项目',
                dataIndex: 'project',
                key: 'project'
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
                        <Table columns={columns}
                         dataSource={startDatasource}
                         pagination={pagination}
                         onChange={this.onSwitchPage}
                        />
                    </div>:
                    <div >
                        <Button type="primary" onClick={this.submitPlan.bind(this)}>发送</Button>
                        <h1 style={{textAlign:'center'}}>总进度计划填报通知</h1>
                        <Row gutter={30} className='mb10'>
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
                                    <label >{item?item.project.name:''}</label>
                                </div>   
                            </Col>
                        </Row>
                        <Row gutter={30} className='mb10'>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">施工单位:</label>
                                <div className="start_input">
                                    <Select  style={{ width: '100%' }}
                                        placeholder="请选择施工单位"
                                        onChange={this.constructChange.bind(this)}>
                                        {
                                            constructionUnitOrgs.map(r=>{
                                                return <Option value={r.code} key={r.code} >{r.name}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报人:</label>
                                <div className="start_input">
                                    <Select  style={{ width: '100%' }}
                                    value={this.state.constructPerson}
                                    onSelect={this.constructSelect.bind(this)}
                                    placeholder="请选择填报人">
                                        {	
                                            constructionPeopleList.map(r=>{
                                                return <Option value={r.id} key={r.id} >{r.person_name}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报时间:</label>
                                <div className="start_input">
                                    <DatePicker  
                                    format="YYYY-MM-DD"
                                    placeholder="请选择填报时间"
                                    onChange={this.reportTimeChange.bind(this)}
                                    style={{textIndent:'0',width: '100%' }}/>
                                </div>        
                            </Col>
                        </Row>
                        <Row gutter={30} className='mb10'>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">监理单位:</label>
                                <div className="start_input">
                                    <Select  style={{ width: '100%' }}
                                    placeholder="请选择监理单位"
                                    onChange={this.superChange.bind(this)}
                                    >
                                        {
                                            supervisionUnitOrgs.map(r=>{
                                                return <Option value={r.code} key={r.code} >{r.name}</Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </Col>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核人:</label>
                                <div className="start_input">
                                    <Select style={{ width: '100%' }} 
                                    onSelect={this.superSelect.bind(this)}
                                    value={this.state.superPerson}
                                    placeholder="请选择审核人">
                                    {	
                                        supervisionPeopleList.map(r=>{
                                            return <Option value={r.id} key={r.id} >{r.person_name}</Option>
                                        })
                                    }
                                    </Select>
                                </div>
                            </Col>
                            <Col span={8}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核时限:</label>
                                <div className="limit_input">
                                    <Select  style={{ width: '100%' }}
                                    placeholder="请输入或选择审核时限"
                                    showSearch
                                    onChange = {this.approvalTimeChange.bind(this)}
                                    >
                                    {
                                        date.map(r=>{
                                            return <Option value={r} key={r} >{r}</Option>
                                        })
                                    }
                                    </Select>
                                </div>
                                <label  style={{minWidth: 30,display: 'inline-block'}} htmlFor="">day</label>    
                            </Col>
                        </Row>
                        <p style={{marginBottom:5}}>备注:</p>
                        <Row>
                            <Col span={24} >
                                <Input 
                                id='remark'
                                type="textarea" 
                                placeholder="" 
                                autosize={{minRows:7}} 
                                />
                            </Col>
                        </Row>
                        
                        <p className="ant-upload-text">附件：</p>
                        <Row gutter={10} className='mb10'>
                            <Col span={24} >
                                {
                                    this.state.attachmentFile?
                                    <p>{this.state.attachmentFile.name}
                                        <a href="javascript:;" style={{marginLeft:'5px'}}
                                        onClick={()=>{
                                        this.setState({attachmentFile:null});
                                    }}>删除</a></p>:
                                    ''
                                }
                                <Dragger style={{height:'50px'}} onChange={(val)=>{
                                        this.setState({attachmentFile:val});
                                }}>
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="inbox"/>
                                    </p>
                                    <p className="ant-upload-text">
                                        点击或者拖拽开始上传</p>
                                </Dragger>
                            </Col>
                        </Row>
                        <Row className="mb10">
                            <Col span={12}>
                                <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">抄送:</label>
                                <div className="start_input">
                                    <PerCarbon
                                        selectCarbonMember={this.selectCarbonMember.bind(this)}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div style={{display:'inline-block',float:'right'}}>
                                    <Checkbox onChange={this.emailNotice.bind(this)} style={{marginLeft:10}}>邮箱通知</Checkbox>
                                    <Checkbox onChange={this.messageNotice.bind(this)} style={{marginLeft:10}}>短信通知</Checkbox>
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
    superChange(value){
        const{
            supervisionUnitOrgs
        }=this.state
        let org = supervisionUnitOrgs.find(rt=>rt.code === value);
        this.setSupervisionPeopleList(org);
        this.supervisionMember = null;
        this.setState({
            supervisionUnit:org,
            superPerson:null
        });
    }

    constructChange(value){
        const{
            constructionUnitOrgs
        }=this.state
        let org = constructionUnitOrgs.find(rt=>rt.code === value);
        this.setConstructionPeopleList(org);
        this.constructionMember = null;
        this.setState({
            constructionUnit:org,
            constructPerson:null
        });
    }

    setConstructionPeopleList(unit){
		const {getOrgByCode,getEmployByOrgCode} = this.props.actions;
		let peopleList = [];
		this.setState({constructionPeopleList:[]});
		if(!unit){
			return;
		}
		if(unit.code){
			getOrgByCode({code:unit.code}).then((rst) => {
				if(rst.children){
					for(let i=0;i<rst.children.length;i++){
						getEmployByOrgCode({},{org_code:rst.children[i].code}).then((rsp) => {
							if(rsp.length!==0){    //该部门下面有员工
								for(let j=0;j<rsp.length;j++){
									let people = {};
									people.person_code = rsp[j].account.person_code;
									people.id = rsp[j].id;
									people.person_name = rsp[j].account.person_name;
									people.username = rsp[j].username;
									peopleList.push(people);
									this.setState({
                                        constructionPeopleList:peopleList
                                    });
								}
							}
						});
					}
				}
			});
		}else{
			this.setState({constructionPeopleList:[]});
			return;
		}

	}
    setSupervisionPeopleList(unit){
		const {getOrgByCode,getEmployByOrgCode} = this.props.actions;
		let peopleList = [];
		let supervisionArray = []
		this.setState({supervisionPeopleList:[]});
		if(!unit){
			return;
		}
		if(unit.code){
			getOrgByCode({code:unit.code}).then((rst) => {
				if(rst.children){
					for(let i=0;i<rst.children.length;i++){
						getEmployByOrgCode({},{org_code:rst.children[i].code}).then((rsp) => {
							if(rsp.length!==0){    //该部门下面有员工
								for(let j=0;j<rsp.length;j++){
									let people = {};
									people.person_code = rsp[j].account.person_code;
									people.id = rsp[j].id;
									people.person_name = rsp[j].account.person_name;
									people.username = rsp[j].username;
									peopleList.push(people);
								}
								this.setState({supervisionPeopleList:peopleList});
							}
						});
					}
				}
			});
		}else{
			this.setState({supervisionPeopleList:[]});
			return;
		}
    }
    //选择填报人
    constructSelect(value){
		const{
			constructionPeopleList
        }=this.state
        this.setState({
            constructPerson:value
        })
		let member = constructionPeopleList.find((rst)=> rst.id===value);
        this.constructionMember = member;
	}
    //选择审核人
	superSelect(value){
		const{
			supervisionPeopleList
        }=this.state
        this.setState({
            superPerson:value
        })
		let member = supervisionPeopleList.find((rst)=> rst.id===value);
        this.supervisionMember = member;
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
        const {
            actions: {
                createFlow, 
                addActor, 
                commitFlow, 
                startFlow,
                carbonCopy
            },
            item
        } = this.props;
        const{
            reportTime,
            approvalTime,
            constructionUnit,
            supervisionUnit,
            attachmentFile,
            workflowDisabled,
            approvalLimit
        }=this.state
        if(workflowDisabled){
            notification.error({
                message: '此单位工程发起的流程正在执行中，不能再次发起',
            });
            return
        }
        let remark = document.querySelector('#remark').value;
        if(!item.unitProjecte){
            notification.error({
                message: '请选择单位工程',
            });
            return
        }
        if(!constructionUnit){
            notification.error({
                message: '请选择施工单位',
            });
            return
        }
        if(!this.constructionMember){
            notification.error({
                message: '请选择填报人',
            });
            return
        }
        if(!reportTime){
            notification.error({
                message: '请选择填报时间',
            });
            return
        }
        if(!supervisionUnit){
            notification.error({
                message: '请选择监理单位',
            });
            return
        }
        if(!this.supervisionMember){
            notification.error({
                message: '请选择审核人',
            });
            return
        }
        if(!approvalLimit){
            notification.error({
                message: '请选择审核时限',
            });
            return
        }
        let now = reportTime.valueOf();
        if(approvalTime.valueOf()<now){
            notification.error({
                message: '审查时间不能早于填报时间',
            });
            return;
        }

        const usr = getUser();
        const currentUser = {
            "username": usr.username,
            "person_code": usr.code,
            "person_name": usr.name,
            "id": parseInt(usr.id)
        };
        let subject = [{
            "project":JSON.stringify({"pk": item.project.pk, "code": item.project.code, "obj_type": item.project.obj_type,name:item.project.name}),
            "unit": JSON.stringify({"pk": item.unitProjecte.pk, "code": item.unitProjecte.code, "obj_type": item.unitProjecte.obj_type,name:item.unitProjecte.name}),
            "constructionUnit": JSON.stringify(constructionUnit.name),
            "reportTime": JSON.stringify(reportTime),
            "approvalLimit": JSON.stringify(approvalLimit),
            "constructionMember": JSON.stringify(this.constructionMember),
            "supervisionUnit": JSON.stringify(supervisionUnit.name),
            "supervisionMember": JSON.stringify(this.supervisionMember),
            "approvalTime": JSON.stringify(approvalTime),
            "remark": JSON.stringify(remark),
            "attachment":JSON.stringify(attachmentFile)
        }];

        const nextUser = this.constructionMember;
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
            plan_start_time: moment().format('YYYY-MM-DD'),
            deadline: null
        }

        createFlow({},postdata).then((instance)=>{
            if(!instance.id){
                notification.error({
                    message: '流程发起失败',
                    duration: 2
                })
                return;
            }
            const {id, workflow: {states = []} = {}} = instance;
            const [{id: state_id, actions: [action]}] = states;
            
            addActor({ppk: id, pk: state_id}, {
                participants: [nextUser],
                deadline: reportTime,
                remark: WORKFLOW_MAP.desc
            }).then((data)=>{
                if(!data.participants){
                    notification.error({
                        message: '流程发起失败',
                        duration: 2
                    })
                    return;
                }
                let postCommitData = {currentUser}
                commitFlow({pk: id}, {
                    creator: currentUser
                }).then(()=>{
                    startFlow({pk: id},{
                        creator: currentUser
                    }).then((postCommitValue)=>{
                        if(postCommitValue && postCommitValue.creator && postCommitValue.creator.id && postCommitValue.creator.id === currentUser.id){
                            notification.success({
                                message: '流程发起成功',
                                duration: 2
                            })

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
                                    state : state_id,
                                    ccuser : ccuser,
                                    remark : remark
                                }
                                carbonCopy({pk: id},postCarbonData).then( (value)=>{
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

                            
                            this.query(1)
                            this.setState({
                                tableVisible:true
                            })

                        }else{
                            notification.error({
                                message: '流程发起失败',
                                duration: 2
                            })
                            return;
                        }
                    })
                })
            })
        })
    }
    //修改填报时间
    reportTimeChange(value, dateString){
        const {
            approvalLimit
        }=this.state

        if(dateString){
            this.setState({
                reportTime: dateString,
                reportValue: value
            });
            if(approvalLimit){
                let test2 = moment(value).add(approvalLimit,'days');
                let test = moment(test2._d).format('YYYY-MM-DD');
                this.setState({
                    approvalTime: test
                });
            }
        }
    }
    //修改审核时限
    approvalTimeChange(value){
        const {
            reportValue
        }=this.state
        if(value){
            
            this.setState({
                approvalLimit:value
            });
            if(reportValue){
                let test2 = moment(reportValue).add(value,'days');
                let test = moment(test2._d).format('YYYY-MM-DD');
                this.setState({
                    approvalTime: test
                });
            }
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
        }
    }
}
