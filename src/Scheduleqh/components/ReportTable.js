import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Upload, Modal, message, Steps, Spin  } from 'antd';
import moment from 'moment';
import './index.less';
import PerCarbon from './PerCarbon';
import DelayPerCarbon from './DelayPerCarbon';
import {getUser} from '_platform/auth';
import {SERVICE_API, SCHEDULE_TOTAL_PLAN_URL, WORKFLOW_CODE, USER, PASSWORD, STATIC_UPLOAD_API, modelDownloadAddress} from '_platform/api';
import {getNextStates} from '_platform/components/Progress/util'
import DelayReportTable from './DelayReportTable';
import DelayApproval from './DelayApproval';
import queryString from 'query-string';
import $ from 'jquery';
import DGN from '_platform/components/panels/DGN';
const uuidv4 = require('uuid/v4');
const Option = Select.Option;
const Dragger = Upload.Dragger;
const Step = Steps.Step;
var Dropzone = require('react-dropzone');
var request = require('superagent');


export default class ReportTable extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            //模型存储
            uploadModelFile:null,
            uploadFDBFile:null,
            //推迟填报的项目和单位工程
            unitProjecte:[],
            project:[],
            //短信和邮件抄送
            emailNoticeState:false,
            messageNoticeState:false,
            //流程详情
            workflowDetail:null,
            //进度表文件和数据
            file:null,
            scheduleMaster:null,

            //根目录数据
            totalDir:null,
            //FDB存储
            connectStr: null, // city maker Server  connect


            //流程监控
            startDatasource:[],
            total:0,
            loading:false,
            tableVisible:true,
            current:1,

            //生成和上传模型
            modelWorkflow:0,
            isDgnVisiable:false,
            packaging:false,
            nowShowModel: 'NULL-A',
            uploading:false
        }
        //点击单位工程树所查找的流程
        this.constructionUnit = null;
        this.constructionMember = null;
        this.reportTime = null;
        this.supervisionUnit = null;
        this.supervisionMember = null;
        this.approvalTime = null;
        this.remark = null;
        this.attachment = null;
        this.approvalLimit = null;
        this.memberCarbon = [];
    }

    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                const {
                    actions: {
                        getScheduleWorkflow,
                        getWorkflowById,
                        getScheduleDir,
                        postScheduleDir
                    },
                    roots
                } = this.props;

                this.setState({
                    tableVisible:false
                })

                console.log('roots',roots);
                let name = "前海进度管理总进度计划文档根目录";
                let code = "QH_schedule_total_dir_root";
                // let name = roots.name;
                // let code = "schedule_total_dir_"+roots.code;
                console.log('name',name);
                console.log('code',code)

                //创建目录数据
                let getDirData = {
                    code: code
                }

                let postDirData = {
                    "name": name,
                    "code": code,
                    "obj_type": "C_DIR",
                    "status": "A",
                    "extra_params": {}
                }
                console.log('创建目录数据',postDirData)

                getScheduleDir(getDirData).then( (rst)=>{
                    if(rst && rst.obj_type){
                        console.log('存在目录',rst)
                        this.setState({
                            totalDir:{
                                pk:rst.pk,
                                code:rst.code,
                                obj_type:rst.obj_type
                            }
                        })
                    }else{
                        console.log('不存在目录',rst)
                        
                        postScheduleDir({},postDirData).then((value)=>{
                            console.log('创建目录',value)
                            this.setState({
                                totalDir:{
                                    pk:value.pk,
                                    code:value.code,
                                    obj_type:value.obj_type
                                }
                            })
                        })
                    }
                })


                let user = getUser();
                let data = {
                    userid:user.id,
                    code:WORKFLOW_CODE.总进度计划报批流程,
                    pk:item.unitProjecte.pk
                }
                getScheduleWorkflow(data).then((rst)=>{
                    console.log('workflow',rst)
                    //获取所选单位工程树有无填报流程
                    if (rst && rst.data && rst.data.length>0) {
                        let flow = rst.data;
                        let workflowID = null;
                        for(var i=0;i<flow.length;i++){
                            if(flow[i].state && flow[i].state.name && flow[i].state.name === '填报'){
                                workflowID=flow[i];
                                break;
                            }
                        }
                        if(workflowID){
                            //因为一个单位工程只能发起一次  所以直接查找为填报的流程详情
                            getWorkflowById({ id: workflowID.workflowactivity.id }).then(instance => {
                                if(instance && instance.subject){
                                    console.log('流程详情', instance);
                                    let subject = instance.subject[0]
                                    this.nextStates = getNextStates(instance,workflowID.state.id);
                                    console.log('this.nextStates',this.nextStates)

                                    this.constructionUnit = JSON.parse(subject.constructionUnit);
                                    this.constructionMember = JSON.parse(subject.constructionMember);
                                    this.reportTime = JSON.parse(subject.reportTime);
                                    this.supervisionUnit = JSON.parse(subject.supervisionUnit);
                                    this.supervisionMember = JSON.parse(subject.supervisionMember);
                                    this.approvalTime = JSON.parse(subject.approvalTime);
                                        // remark = JSON.parse(subject.remark)
                                    this.attachment = JSON.parse(subject.attachment);
                                    this.approvalLimit = JSON.parse(subject.approvalLimit);
                                    this.setState({
                                        workflowDetail:instance
                                    });
                                }
                            })
                            
                        }
                    }else{
                        console.log('单位工程不存在流程')
                        this.constructionUnit = null;
                        this.constructionMember = null;
                        this.reportTime = null;
                        this.supervisionUnit = null;
                        this.supervisionMember = null;
                        this.approvalTime = null;
                        this.remark = null;
                        this.attachment = null;
                        this.approvalLimit = null;
                        this.setState({
                            workflowDetail:null
                        });
                    }
                })
            }
        }
    }
    
    componentDidMount(){
        const {
            actions: {
                getProjectTree,
                getReportWorkflow
            },
            location={}
        } = this.props;

        console.log('platform',this.props)
        let me = this
        let user = getUser();
        let {totalID='0'} = queryString.parse(location.search) || {};
        console.log('totalID',totalID)
        
        let startWorkflow = {
            userid:user.id,
            code:WORKFLOW_CODE.总进度计划报批流程,
            page:1
        }
        getReportWorkflow(startWorkflow).then((rst)=>{
            if(rst &&　rst.data && rst.data.length>0){
                let table = []
                for(var i=0;i<rst.data.length;i++){
                    let test = rst.data[i]
                    if(test && test.workflowactivity && test.workflowactivity.subject && test.workflowactivity.subject.length>0){
                        table.push({
                            index:i+1,
                            project:test.workflowactivity.subject[0].project?JSON.parse(test.workflowactivity.subject[0].project).name:'',
                            unit:test.workflowactivity.subject[0].unit?JSON.parse(test.workflowactivity.subject[0].unit).name:'',
                            workflow:'总进度计划报批流程',
                            creator:test.workflowactivity.creator.person_name?test.workflowactivity.creator.person_name:test.workflowactivity.creator.username,
                            currenUser:test.workflowactivity.current[0].participants[0].executor.person_name?test.workflowactivity.current[0].participants[0].executor.person_name:test.workflowactivity.current[0].participants[0].executor.username,
                            status:test.state.name
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
        
        

        
        //申请推迟填报时需要选择项目和单位工程
        let unitProjecte=[];
        let test=[];
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                for(var i=0;i<rst.children.length;i++){
                    let project=rst.children[i]
                    test.push(project)
                    if(project && project.children && project.children.length>0){
                        for(var t=0; t<project.children.length;t++){
                            let item=project.children[t]
                            unitProjecte.push(item)
                        }
                    }
                }
                this.setState({
                    unitProjecte:unitProjecte,
                    project:test
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
        const { actions: {getReportWorkflow}} = this.props;
        let user = getUser();
        let startWorkflow = {
            userid:user.id,
            code:WORKFLOW_CODE.总进度计划报批流程,
            page:page
        }

        getReportWorkflow(startWorkflow).then(rst => {
            if(rst && rst.data && rst.data.length>0){
                let workFlows = rst.data
                let table = []
				for(var i=0;i<rst.data.length;i++){
					let test = rst.data[i]
					if(test && test.workflowactivity && test.workflowactivity.subject && test.workflowactivity.subject.length>0){
                        table.push({
                            index:i+1,
                            project:test.workflowactivity.subject[0].project?JSON.parse(test.workflowactivity.subject[0].project).name:'',
                            unit:test.workflowactivity.subject[0].unit?JSON.parse(test.workflowactivity.subject[0].unit).name:'',
                            workflow:'总进度计划报批流程',
                            creator:test.workflowactivity.creator.person_name?test.workflowactivity.creator.person_name:test.workflowactivity.creator.username,
                            currenUser:test.workflowactivity.current[0].participants[0].executor.person_name?test.workflowactivity.current[0].participants[0].executor.person_name:test.workflowactivity.current[0].participants[0].executor.username,
                            status:test.state.name
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

    render() { //todo 成果交付申请变更百分率
        const {
            scheduleMaster,
            startDatasource,
            total,
            tableVisible
        }=this.state
        const{
            item
        }=this.props
        let fileName = '暂无文件';
        if(this.state.file){
            fileName = this.state.file.name;
        }
        let data = []
        if(scheduleMaster){
            data = scheduleMaster
        }
        const columns1 = [
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
        let isdgnShow ='none';
        if(this.state.isDgnVisiable && this.state.nowShowModel!=='NULL-A' ){
            isdgnShow ='block';
        }
		return (
            <div>
                {
                    tableVisible?
                    <div>
                        <Table columns={columns1}
                         dataSource={startDatasource}
                         pagination={pagination}
                         onChange={this.onSwitchPage}
                        />
                    </div>:
                    <div>
                        <Spin spinning={this.state.loading}>
                            <DelayApproval {...this.props}  {...this.state}/>
                            <Row className='mb10'>
                                <Col span={24}>
                                    <div style={{display:'inline-block'}}>
                                        <Button type='primary' onClick={this.submitWorkflow.bind(this)}>提交</Button>
                                        <DelayReportTable {...this.props} {...this.state}/>
                                    </div>
                                </Col>
                            </Row>
                            <h1 className='title'>总进度计划表填报</h1>
                            <Card className='mb10' >
                                <Row gutter={15} className='mb10' gutter={50}>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">项目名称:</label>
                                        <div className="start_input">
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
                                            <label >合同进度</label>
                                        </div>   
                                    </Col>
                                </Row>
                                <Row gutter={15} className='mb10' gutter={20}>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">施工单位:</label>
                                        <div className='start_input'>
                                            <label>{this.constructionUnit?this.constructionUnit:''}</label>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报人:</label>
                                        <div className='start_input'>
                                            <label >{this.constructionMember?(this.constructionMember.person_name?this.constructionMember.person_name:this.constructionMember.username):''}</label>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">填报时间:</label>
                                        <div className='start_input'>
                                            <label >{this.reportTime?this.reportTime:''}</label>
                                        </div>       
                                    </Col>
                                </Row>
                                <Row gutter={15} className='mb10' gutter={20}>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">监理单位:</label>
                                        <div className='start_input'>
                                            <label>{this.supervisionUnit?this.supervisionUnit:''}</label>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核人:</label>
                                        <div className='start_input'>
                                            <label >{this.supervisionMember?(this.supervisionMember.person_name?this.supervisionMember.person_name:this.supervisionMember.username):''}</label>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">审核时间:</label>
                                        <div className='start_input'>
                                            <label >{this.approvalTime?this.approvalTime:''}</label>
                                        </div>        
                                    </Col>
                                </Row>
                                <Row style={{marginTop:15}} gutter={20}>
                                    <Col span={12}>
                                        <label style={{minWidth: 60,display: 'inline-block'}}>抄送:</label>
                                        <div className='start_input'>
                                            <PerCarbon
                                                selectCarbonMember={this.selectCarbonMember.bind(this)}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox onChange={this.emailNotice.bind(this)} style={{float:'right',marginLeft:10}}>邮箱通知</Checkbox>
                                        <Checkbox onChange={this.messageNotice.bind(this)} style={{float:'right',marginLeft:10}}>短信通知</Checkbox>
                                    </Col>
                                </Row>
                            </Card>
                            <Card className='mb10'>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <label style={{minWidth: 100,display: 'inline-block'}}>请上传总进度计划</label>
                                    </Col>
                                    <Col span={4}>
                                        <Row style={{float:'right'}}>
                                            <Col span={24}>
                                                <label style={{minWidth:50,display:'inline-block'}}>第一步：</label>
                                                <a href={SCHEDULE_TOTAL_PLAN_URL}>下载模版</a>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row style={{float:'right'}}>
                                            <Col span={24}>
                                                <label style={{minWidth:50,display:'inline-block'}}>第二步：</label>
                                                <Upload 
                                                style={{ margin: '10px' }}
                                                onChange={this.uplodachange.bind(this)}
                                                name='file'
                                                showUploadList={false}
                                                action={`${SERVICE_API}/excel/upload-api/`}
                                                beforeUpload = {this.beforeUpload.bind(this)}
                                                >
                                                    <Button>
                                                        <Icon type="upload" />上传进度表(文件名需为英文)
                                                    </Button>
                                                    <span>{`文件：${fileName}`}</span>
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mb10'>
                                    <Col span={24} >
                                    <Table columns={columns}  size="small"
                                        dataSource={data}></Table>
                                    </Col>
                                </Row>
                            </Card>
                            <Card className='mb10'>
                                <Row>
                                    <Col>
                                        <div style = {{width:'90%',margin:'0 auto'}}>
                                            <Steps current ={this.state.modelWorkflow}>
                                                <Step title="第一步" description='选择imodel' />
                                                <Step title="第二步" description='选择fdb文件和生成的zip文件'  />
                                                <Step title="第三步" description='提交流程'  />
                                            </Steps>
                                        </div>
                                        {
                                            this.generateStepContent()
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div style={{display:isdgnShow,position:'relative',width:'99%',height:'823px'}}>
                                            <DGN
                                            style={{position:'relative',zIndex:'90'}}
                                            width='97%'
                                            height='780px'
                                            model={this.state.nowShowModel}/>
                                            <div className="clear-float"></div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Spin>
                    </div>
                }
            </div>
            
		);
    }
    generateStepContent(){
		if(this.state.modelWorkflow===0){
			return(
				<Spin
					tip='正在打包...'
					spinning={this.state.packaging}>
					<div>
						<div style={{ width: '100%', margin: '20px auto' }} className="input-father">
							<Button
								style={{ marginRight: '10px' }}
								type="primary"
								onClick={this.clkMake.bind(this)}>生成打包文件
						</Button>
							<Button
								onClick={this.clkHavePackage.bind(this)}>已有打包文件
						</Button>
						</div>
						<input style={{ display: 'none' }} type='file' id='imodelInput' onChange={this.getImodel.bind(this)} />
						<div className="clear-float"></div>
					</div>
				</Spin>
			)
		}
		if(this.state.modelWorkflow===1){
			return(
                <Spin
                tip='正在打包...'
                spinning={this.state.uploading}>
						<Dropzone ref="dropzone"
							multiple={true}
							acceptedFiles=".zip"
							onDrop={this.onDrop.bind(this)}
							style={{ position: 'relative', margin: '0px auto' }} >
							<div style={{ margin: '20px auto', float: 'none' }} className="input-father">
								<Button
									style={{ marginRight: '10px' }}
									onClick={this.clkRePcakage.bind(this)}>
									重新生成打包文件
							</Button>
								<Button
									type="primary">上传打包文件
							</Button>
							</div>
						</Dropzone>
						<div className="clear-float"></div>
                    </Spin>
			)
		}
		if(this.state.modelWorkflow===2){
			return (
				<div>
					<div className="input-father">
						<Button
							onClick={this.clkReDrop.bind(this)}>
							重新上传打包文件
					   </Button>
					</div>
					<div className="clear-float"></div>
					<div className="clear-float"></div>
				</div>
			)
		}
    }
    getImodel(e){
        if ($.browser != undefined && ($.browser.msie || ($.browser.mozilla && $.browser.version == '11.0'))){
            console.log('这是ie浏览器')
        }else{
            notification.info({
                message: '请选择ie浏览器进行打包',
                duration: 2,
            });
            return
        }
		let filefullname = $("#imodelInput").val();
		let hash = Date.now();
		let filenickname = filefullname.substring(filefullname.lastIndexOf('.'),filefullname.length);
		let modelname = filefullname.substring(filefullname.lastIndexOf('\\')+1,filefullname.lastIndexOf('.'));
		console.log('modelname',modelname);
		this.setState({modelname:modelname,modelHash:hash});
		if(filenickname.trim() === '.imodel'){
			notification.info({
                message: '文件格式正确,开始打包',
                duration: 2,
            });
			console.log('nickname','ok');
			let filename;
			let dir = filefullname.substring(0, filefullname.lastIndexOf('\\'));
			console.log('d1',dir);
			if (dir) {
				console.log('d2',dir);
				filename = filefullname.substr(filefullname.lastIndexOf('\\') + 1);
				filename = filename.substring(0, filename.lastIndexOf('.'));
				window.dgn.PreProcessProjectFile(filename, dir, false);
				window.dgn.OpenDgnDbProject(filename);
			}

			window.dgn.PackageSourceFile(filefullname, 'wbs', 'wbscode', '');
			this.setState({packaging:true});
            let fso;
            
			try {
                fso = new window.ActiveXObject("Scripting.FileSystemObject");
			} catch (e) {
				notification.error({
	                message: '请设置你的浏览器ActiveX',
	                duration: 5,
                });
                this.setState({modelWorkflow:0,packaging:false});
				return;
            }
            //将名字改为zip，不带下划线
			let fullzipname = filefullname.replace('.imodel',`_.zip`);

			let timer = setInterval(() => {
				let f1;
				try {
                    f1 = fso.GetFile(fullzipname);
                    console.log('f1',f1)
				} catch (e) {
                    console.log(e)
				}
				if (f1) {
					console.log('gef file');
					setTimeout(()=>{
						notification.success({
			                message: '打包完成',
			                duration: 2,
			            });
						// message.success('打包完成');
						this.setState({modelWorkflow:1,packaging:false});
					},3000);

					clearInterval(timer);
				} else {
					console.log('not gef file');
				}
			}, 500);
		}else{
			notification.error({
                message: '模型文件格式错误',
                duration: 2,
            });
			// message.error('模型文件格式错误');
			return;
		}
	}
    
    onDrop(files) {
        const{
            actions:{
                postScheduleModel
            }
        }=this.props
        const{
            scheduleMaster
        }=this.state
		if(!files||files.length<1){
			return;
		}
		console.log('dropzone files',files);
		let me = this;
		if(files.length!==2)
		{
			notification.error({
                message: '选中的文件数量不对，请选择ZIP和FDB',
                duration: 2,
            });
			return;
		}
		
		let fileNickNameAll = files[0].name.substring( files[0].name.lastIndexOf('.')+1, files[0].name.length) + files[1].name.substring( files[1].name.lastIndexOf('.')+1, files[1].name.length);
		console.log('filenicknameall',fileNickNameAll);
		if(!(fileNickNameAll === 'zipfdb'||fileNickNameAll === 'fdbzip'||fileNickNameAll === 'zipFDB'||fileNickNameAll === 'FDBzip')){
			notification.error({
                message: '选择的文件格式不正确',
                duration: 2,
            });
			return;
		}
		notification.success({
			message: '文件正确，开始上传',
			duration: 2,
        });
        me.setState({
            uploading:true
        })
		// message.success('文件正确，开始上传');
		files.forEach((file) => {
            let nicname = file.name.substring(file.name.lastIndexOf('.')+1, file.name.length);
            if(nicname === 'zip'){
                setTimeout(function () {

                    const formdata = new FormData();
                    formdata.append('a_file',file);
                    formdata.append('name',file.name);
                    formdata.append('category',1);
                    let downloadState = true
                    postScheduleModel({},formdata,{
                        Authorization: 'Basic ' + btoa(USER + ':' + PASSWORD)
                    }).then(rst=>{
                        if(rst && rst.id){
                            rst.a_file = (rst.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                            rst.download_url = (rst.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                            rst.preview_url = (rst.preview_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                            rst.name = decodeURI((rst.download_url).replace('/media/documents/meta/', ''));
                            console.log('rst.a_file',rst.a_file);
                            console.log('rst.download_url',rst.download_url);
                            console.log('rst.preview_url',rst.preview_url);
                            console.log('rst.name',rst.name);
                            console.log('文件',rst);

                            me.setState({uploadModelFile:rst});


                            if ($.browser != undefined && ($.browser.msie || ($.browser.mozilla && $.browser.version == '11.0'))){
                                console.log('这是ie浏览器')
                            }else{
                                me.setState({ 
                                    modelWorkflow:2,
                                    uploading:false 
                                });
                                notification.info({
                                    message: '模型上传成功,如果要进行预览请选择ie浏览器',
                                    duration: 2,
                                });
                                return
                            }

                            let fileName = rst.name.substring(0,rst.name.indexOf('.zip'));
                            setTimeout(function () {
                                // 开始下载相关模型
                                try{
                                    window.dgn.PreProcessProjectFile(encodeURI(fileName), modelDownloadAddress + '/', true);
                                }catch(e){
                                    console.log('dgn preprocess error',e);
                                }
                                setTimeout(function () {
                                    console.log('encodefilename' + fileName);
                                    notification.info({
                                        message: '模型上传成功',
                                        duration: 2,
                                    });

                                    me.setState({ 
                                        nowShowModel:fileName.substring(0,fileName.lastIndexOf('_')),
                                        isDgnVisiable: true,
                                        modelWorkflow:2,
                                        uploading:false 
                                    });
                                }, 1);
                            }, 0);
                            
                        }else{
                            notification.error({
                                message: '文件上传失败',
                                duration: 2
                            })
                            me.setState({ 
                                isDgnVisiable:false,
                                nowShowModel: 'NULL-A',
                                modelWorkflow:2 ,
                                uploadFDBFile:null,
                                uploadModelFile:null,
                                uploading:false
                            });
                            downloadState = false
                        }
                    });
                }, 0);
            } 
            if(nicname === 'fdb' || nicname === 'FDB'){
                console.log('fdb')
                me.setState({
                    uploadFDBFile:file
                },()=>{
                    if(scheduleMaster){
                        me.postFDBServer()
                    }
                });
            }
			
		});
    }
    clkMake(){
		$("#imodelInput").click();
	}
    clkHavePackage(){
		this.setState({modelWorkflow:1});
	}
	clkRePcakage(){
		this.setState({modelWorkflow:0});
	}
	clkReDrop(){
		this.setState({
            modelWorkflow:1,
            isDgnVisiable:false,
            uploadFDBFile:null,
            uploadModelFile:null
        });
	}
    //处理流程
    submitWorkflow(){
        const{
            workflowDetail,
            scheduleMaster,
            uploadModelFile,
            file,
            uploadFDBFile,
            totalDir,
            connectStr
        }=this.state
        const{
            actions:{
                putFlow,
                carbonCopy,
                postSubject,
                getScheduleDir,
                postScheduleDir,
                postDocument,
                getUnitPlanTime,
                getDocument,
                putDocument
            },
            item
        }=this.props  
        let me = this;
        if(!workflowDetail){
            notification.error({
                message: '不存在填报流程',
                duration: 2
            })
            return;
        }
        if(!scheduleMaster){
            notification.error({
                message: '请上传进度表',
                duration: 2
            })
            return;
        }

        if(uploadModelFile && uploadFDBFile===null){
            notification.error({
                message: '请上传FDB模型',
                duration: 2
            })
            return;
        }

        if(uploadFDBFile && uploadModelFile===null){
            notification.error({
                message: '请上传ZIP模型',
                duration: 2
            })
            return;
        }

        if(uploadFDBFile && scheduleMaster && !connectStr){
            notification.error({
                message: '上传的FDB文件与进度表不匹配，请重新上传新的文件',
                duration: 2
            })
            return;
        }


        const user = getUser();
        let executor = {
            "username": user.username,
            "person_code": user.code,
            "person_name": user.name,
            "id": parseInt(user.id)
        };
        // let executor = this.constructionMember
        let next_state=me.nextStates[0].to_state[0].id;
        let next_states=[];
        let participants=[];
        participants.push(me.supervisionMember)
        next_states.push({
            state: next_state,
            participants: participants,
            deadline: me.approvalTime,
            remark: null
        })
        let state = workflowDetail.current[0].id;
        let postdata = {
            next_states : next_states,
            state : state,
            executor : executor,
            action : me.nextStates[0].action_name,
            note: me.nextStates[0].action_name,
            attachment: null
        }
        let data={
            pk:workflowDetail.id
        }
        console.log('postdata',postdata)


        //FDB service返回的信息
        let FDBStr = null;
        if(connectStr){
            FDBStr = connectStr
        }
        
        let oldSubject = workflowDetail.subject[0]
        
        let subject = [{
            "project":oldSubject.project,
            "unit": oldSubject.unit,
            "constructionUnit": oldSubject.constructionUnit,
            "reportTime": oldSubject.reportTime,
            "approvalLimit": oldSubject.approvalLimit,
            "constructionMember": oldSubject.constructionMember,
            "supervisionUnit": oldSubject.supervisionUnit,
            "supervisionMember": oldSubject.supervisionMember,
            "approvalTime": oldSubject.approvalTime,
            "remark": oldSubject.remark,
            "attachment": oldSubject.attachment,
            "uploadModelFile":JSON.stringify(uploadModelFile),
            "fdbConnectStr": JSON.stringify(FDBStr),
            "file":JSON.stringify(file)
        }];
        let newSubject = {
            subject:subject
        }
        postSubject(data,newSubject).then( value=>{
            console.log('value',value)
        })
        console.log('subject',subject)

        if(me.memberCarbon.length>0){
            let ccuser=[];
            for(var i=0; i<me.memberCarbon.length;i++){
                ccuser.push(
                    {   id: Number(me.memberCarbon[i][3]),
                        username: me.memberCarbon[i][4],
                        person_name: me.memberCarbon[i][2],
                        person_code: me.memberCarbon[i][1]
                    }
                )
            }
            let remark = null;
            let postCarbonData = {
                state : state,
                ccuser : ccuser,
                remark : remark
            }
            console.log('postCarbonData',postCarbonData)
            carbonCopy(data,postCarbonData).then( (value)=>{
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

        putFlow(data,postdata).then( rst=>{
            console.log('rst',rst)
            if(rst && rst.creator){
                notification.success({
                    message: '流程提交成功',
                    duration: 2
                })

                //返回流程监控页面
                me.query(1)
                me.setState({
                    tableVisible:true
                })

                //以项目的pk创建目录   以单位工程的pk创建文档  存储计划表和模型数据
                let name = item.project.name;
                let code = "schedule_total_dir_"+item.project.code;

                //创建目录数据
                let getDirData = {
                    code: "schedule_total_dir_"+item.project.code
                }
                //查看文档数据
                let documentCode = {
                    code:"schedule_" + item.unitProjecte.code
                }

                //创建文档数据
                let date = moment().format(); 
                console.log('当地时间',date);
                
                //创建文档数据
                let postDocumentData = {
                    "code": "schedule_" + item.unitProjecte.code,
                    "name": item.unitProjecte.name,
                    "obj_type": "C_DOC",
                    "workpackages": [{"pk":item.unitProjecte.pk, "code": item.unitProjecte.code, 
                                    "obj_type":item.unitProjecte.obj_type, "rel_type":"related"}],
                    "profess_folder": {"code": code, "obj_type":"C_DIR"},
                    "extra_params": {
                        "scheduleMaster_Report": scheduleMaster,
                    },
                    "basic_params": {
                        "files": [
                            {
                            "a_file": file.a_file,
                            "name": file.name,
                            "download_url": file.download_url,
                            "misc": file.misc,
                            "mime_type": file.mime_type
                            },
                        ]
                    },
                    "status": "A",
                    "version": "A"
                }
                console.log('创建文档数据',postDocumentData)


                let changeDocumentCode = {
                    code:"schedule_" + item.unitProjecte.code
                }
                //修改文档数据
                let changeDocumentData1 = {
                    "extra_params": {
                        "scheduleMaster_Report": '',
                    },
                    "basic_params": {
                        "files": [
                            {
                                "a_file": file.a_file,
                                "name": file.name,
                                "download_url": file.download_url,
                                "misc": file.misc,
                                "mime_type": file.mime_type
                            },
                        ]
                    },
                    "status": "A",
                    "version": "A"
                }
                //创建目录数据
                let postDirData = {
                    "name": name,
                    "code": code,
                    "obj_type": "C_DIR",
                    "status": "A",
                    "extra_params": {},
                    "parent": {"pk":totalDir.pk,"code":totalDir.code,"obj_type":totalDir.obj_type}
                }
                console.log('创建目录数据',postDirData)

                //获取目录
                getScheduleDir({code: "schedule_total_dir_"+item.project.code}).then( (rst)=>{
                    if(rst && rst.obj_type){
                        console.log('存在目录',rst)
                        
                        getDocument(documentCode).then((documents)=>{
                            //是否存在文档
                            if(documents && documents.code && documents.extra_params ){
                                
                                let changeDocumentData2 = {
                                    "extra_params": {
                                        "scheduleMaster_Report": scheduleMaster,
                                    },
                                    "basic_params": {
                                        "files": [
                                            {
                                                "a_file": file.a_file,
                                                "name": file.name,
                                                "download_url": file.download_url,
                                                "misc": file.misc,
                                                "mime_type": file.mime_type
                                            },
                                        ]
                                    },
                                    "status": "A",
                                    "version": "A"
                                }
                                putDocument(changeDocumentCode,changeDocumentData1).then((changeDoc1)=>{
                                    console.log('第一次修改文档',changeDoc1)
                                    if(changeDoc1 && changeDoc1.code ){
                                        putDocument(changeDocumentCode,changeDocumentData2).then((changeDoc2)=>{
                                            if(changeDoc2 && changeDoc2.code ){
                                                console.log('第二次修改文档',changeDoc2)
                                            }
                                        })
                                    }
                                    me.clearALL()
                                })

                            }else{
                                postDocument({},postDocumentData).then((test)=>{
                                    //test为创建的文档数据
                                    if(test && test.code){
                                        console.log('创建文档成功',test)
                                    }
                                    me.clearALL()
                                })
                                
                            }
                        })
                    }else{
                        console.log('不存在目录',rst)
                        postScheduleDir({},postDirData).then((value)=>{
                            //创建的目录数据
                            console.log('创建目录',value)
                            if(value && value.code){
                                getDocument(documentCode).then((documents)=>{
                                    //是否存在文档
                                    if(documents && documents.code && documents.extra_params ){
                                        let changeDocumentData2 = {
                                            "extra_params": {
                                                "scheduleMaster_Report": scheduleMaster,
                                            },
                                            "basic_params": {
                                                "files": [
                                                    {
                                                    "a_file": file.a_file,
                                                    "name": file.name,
                                                    "download_url": file.download_url,
                                                    "misc": file.misc,
                                                    "mime_type": file.mime_type
                                                    },
                                                ]
                                            },
                                            "status": "A",
                                            "version": "A"
                                        }
                                        putDocument(changeDocumentCode,changeDocumentData1).then((changeDoc1)=>{
                                            console.log('第一次修改文档',changeDoc1)
                                            if(changeDoc1 && changeDoc1.code ){
                                                putDocument(changeDocumentCode,changeDocumentData2).then((changeDoc2)=>{
                                                    if(changeDoc2 && changeDoc2.code ){
                                                        console.log('第二次修改文档',changeDoc2)
                                                    }
                                                })
                                            }
                                            me.clearALL()
                                        })
                                        
                                    }else{
                                        postDocument({},postDocumentData).then((test)=>{
                                            //test为创建的文档数据
                                            if(test && test.code){
                                                console.log('创建文档成功2',test)
                                            }
                                            me.clearALL()
                                        })
                                        
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return;
            }
        })
    }

    clearALL(){
        this.setState({
            uploadModelFile:null,
            uploadFDBFile:null,
            emailNoticeState:false,
            messageNoticeState:false,
            workflowDetail:null,
            file:null,
            scheduleMaster:null,
            connectStr: null, // city maker Server  connect
            modelWorkflow:0,
            isDgnVisiable:false,
            packaging:false,
            nowShowModel: 'NULL-A',
            uploading:false
        })
    }

    // 上传FDB到 FDBServer
    postFDBServer() {
        notification.info({
            message: '上传FDB文件与进度表关联中',
            duration: 2
        })
        this.setState({
            loading:true
        })
        const {
            uploadFDBFile,
            scheduleMaster
        } = this.state;
        
        const {
            actions: {
                postScheduleModelFDB
            }
        } = this.props;
        console.log('uploadFDBFile',uploadFDBFile)
        console.log('scheduleMaster',scheduleMaster)
        const formdata = new FormData();
        formdata.append('a_file',uploadFDBFile);
        formdata.append('name',uploadFDBFile.name);
        formdata.append('scheduleTable',JSON.stringify(scheduleMaster));
        
        postScheduleModelFDB({},formdata).then(response => {
            console.log('FDB服务',response)
            // connectStr
            if(response){
                if(response.connectStr){
                    this.setState({
                        connectStr:response.connectStr,
                        loading:false
                    })
                }else{
                    notification.error({
                        message: '上传的FDB文件与进度表不匹配，请重新上传新的FDB文件或者进度表',
                        duration: 2
                    })
                    this.setState({
                        connectStr:null,
                        loading:false
                    })
                }
            }else{
                notification.error({
                    message: 'FDB文件上传失败',
                    duration: 2
                })
                this.setState({ 
                    isDgnVisiable:false,
                    nowShowModel: 'NULL-A',
                    modelWorkflow:2 ,
                    uploadFDBFile:null,
                    uploadModelFile:null,
                    connectStr:null,
                    loading:false
                });
            }
        });        
    }

    //上传excel文件
    beforeUpload(file){
        let {
            actions:{
                postScheduleFile
            }
        } = this.props;
        let type  =  file.name.toString().split('.');
        console.log('type',type)
        let len = type.length
        if(type[len-1]==='xlsx' || type[len-1]==='xls'){
            const formdata = new FormData();
            formdata.append('a_file',file);
            formdata.append('name',file.name);
            let downloadState = true
            postScheduleFile({},formdata).then(rst=>{
                if(rst && rst.id){
                    rst.a_file = (rst.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                    rst.download_url = (rst.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                    rst.preview_url = (rst.preview_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
                    console.log('rst.a_file',rst.a_file);
                    console.log('rst.download_url',rst.download_url);
                    console.log('rst.preview_url',rst.preview_url);
                    console.log('文件',rst)
                    this.setState({file:rst});
                    return true;
                }else{
                    notification.error({
                        message: '文件上传失败',
                        duration: 2
                    })
                    downloadState = false
                    return false;
                }
            });
        }else{
            notification.error({
                message: '请上传excel文件',
                duration: 2
            })
            return false;
        }
    }
    //解析文件
    uplodachange(info){
        const {
            uploadFDBFile
        } = this.state;
        console.log('解析文件',info)
        if (info && info.file && info.file.status !== 'uploading') {
			//console.log(info.file, info.fileList);
        }
        if (info && info.file && info.file.status === 'done') {
            let name = Object.keys(info.file.response)
            let dataList = info.file.response[name[0]]
            console.log('dataList',dataList)
            let scheduleMaster = [];
            for(var i=1;i<dataList.length;i++){
                // if(dataList[i][2] && dataList[i][2]!='建造' && dataList[i][2]!='拆除' && dataList[i][2]!='临时'){
                //     notification.error({
                //         message: '所填作业类别不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // let quantity = /^\d+(\.\d{3,3})$/.test(dataList[i][4])
                // if(!quantity){
                //     console.log('ssssssssssss',dataList[i][4])
                //     console.log('ss=============',i)
                //     notification.error({
                //         message: '所填施工图工程量不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // let output = /^\d+(\.\d{3,3})$/.test(dataList[i][5])
                // if(!output){
                //     notification.error({
                //         message: '所填产值不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // let start = /^[1-9][0-9]*$/.test(dataList[i][6])　
                // if(!start){
                //     notification.error({
                //         message: '所填计划开始时间不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // let end = /^[1-9][0-9]*$/.test(dataList[i][7]) 
                // if(!end){
                //     notification.error({
                //         message: '所填计划结束时间不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // let schedule = /^[1-9][0-9]*$/.test(dataList[i][8])　 
                // if(!schedule){
                //     notification.error({
                //         message: '所填计划工期不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // if(dataList[i][9]!='是' && dataList[i][9]!='否' ){
                //     notification.error({
                //         message: '所填是否关键路线不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }
                // if(dataList[i][10]!='是' && dataList[i][10]!='否' ){
                //     notification.error({
                //         message: '所填是否里程碑不符合规则',
                //         duration: 2
                //     })
                //     return;
                // }

                let strtime = new Date('1900-01-01');
                //将1900到1970的时间戳转化为正整数
                let sub = Math.abs(strtime.getTime());
                console.log('sub',sub)
                // console.log('时间日期',new Date(dataList[i][6]*24*60*60*1000 - sub - 2*24*60*60*1000).toLocaleString().replace(/:\d{1,2}$/,' '));
                let startTime = moment((dataList[i][6])*24*60*60*1000 - sub - 2*24*60*60*1000).format('YYYY-MM-DD');
                let endTime = moment((dataList[i][7])*24*60*60*1000 - sub - 2*24*60*60*1000).format('YYYY-MM-DD');
                console.log('时间日期',startTime);
                let duration = 0;
                if(dataList[i][6] && dataList[i][7]){
                    duration = dataList[i][7] - dataList[i][6]
                }
                console.log('duration',duration);
                scheduleMaster.push({
                    key: i,
                    code: dataList[i][0]?dataList[i][0]:'',
                    name: dataList[i][1]?dataList[i][1]:'',
                    type: dataList[i][2]?dataList[i][2]:'',
                    company: dataList[i][3]?dataList[i][3]:'',
                    quantity: dataList[i][4]?dataList[i][4]:'',
                    output: dataList[i][5]?dataList[i][5]:'',
                    startTime: startTime?startTime:'',
                    endTime: endTime?endTime:'',
                    schedule: dataList[i][8]?dataList[i][8]:'',
                    path: dataList[i][9]?dataList[i][9]:'',
                    milestone: dataList[i][10]?dataList[i][10]:'',
                    site: dataList[i][11]?dataList[i][11]:'',
                    duration:duration
                })
            }
            console.log('scheduleMaster',scheduleMaster)
            this.setState({
                scheduleMaster:scheduleMaster
            },()=>{
                if(uploadFDBFile){
                    this.postFDBServer()
                }
            })
            notification.success({
                message: '文件上传成功',
                duration: 2
            })
		}else if (info && info.file && info.file.status === 'error') {
            this.setState({file:null});
			notification.error({
                message: '文件上传失败',
                duration: 2
            })
            return;
		}
	};
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
    //选择抄送人员
    selectCarbonMember(memberInfo) {
        this.memberCarbon = [];
        if(memberInfo){
            for(var i=0; i<memberInfo.length; i++){
                let memberValue = memberInfo[i].toString().split('#');
                if(memberValue[0] === 'C_PER'){
                    this.memberCarbon.push(memberValue)
                }
            }
            console.log('this.memberCarbon',this.memberCarbon)
        }
    }
}
const columns=[{
    title: 'WBS编码',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '作业类别',
    dataIndex: 'type',
    key: 'type'
},{
    title: '单位',
    dataIndex: 'company',
    key: 'company'
},{
    title: '施工图工程量',
    dataIndex: 'quantity',
    key: 'quantity'
},{
    title: '产值',
    dataIndex: 'output',
    key: 'output'
},{
    title: '计划开始时间',
    dataIndex: 'startTime',
    key: 'startTime'
},{
    title: '计划结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
},{
    title: '计划工期',
    dataIndex: 'schedule',
    key: 'schedule'
},{
    title: '是否关键路线',
    dataIndex: 'path',
    key: 'path'
},{
    title: '是否里程碑',
    dataIndex: 'milestone',
    key: 'milestone'
},{
    title: '关联工程部位',
    dataIndex: 'site',
    key: 'site'
}]
