import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import {Link} from 'react-router-dom';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Row,Col,Card,Checkbox} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD,STATIC_DOWNLOAD_API} from '_platform/api';
import {getUser} from '_platform/auth';
import {Fenbu_WordTemplate, previewWord_API} from '_platform/api';
import ImgShow from '../components/ImgShow';
import WorkflowHistory from "../components/WorkflowHistory"
var moment = require('moment');

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { cells = {} } = state.quality || {};
        return {...cells};
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class FenbuCheck extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],//表格数据
            avePassPercent:'',//平均合格率
            fenbuPk:'',//当前验收分部的pk
            allUsers:[],//全部人员
            projectManager:'',//项目经理
            constructorUnit:'',//施工单位
            supervisionBoss:'',//总监理
            supervisionUnit:'',//监理单位
            fenbu:{},//记录当前分部信息
            constructorView:{},//施工方意见
            wfstate:'',//流程state
            checkAuth:false,//是否有权限审查
            workUnitOptions: [],//施工单位下拉框选项
            supervisorUnitOptions:[],//监理单位下拉框选项
            surveyUnit:[],//勘测单位下拉框选项
            designUnit:[],//设计单位下拉框选项
            constructorUnit:[],//建设单位下拉框选项
            org_person:{
                supervisionUnit:'',
                constructorUnit:'',
                surveyUnit:'',
                designUnit:'',
                workUnit:'',
                workUnit_p:'',
                supervisionBoss:'',
                surveyUnit_p:'',
                designUnit_p:'',
                constructorUnit_p:'',
            },
            basic_info:{
                projectName:'',//项目名称
                unitName:'',//单位工程名称
                constructorUnit:'',//施工单位
                fenbuName:'',//分部名称
                check_quduan:'',//检验区段
                projectManager:'',//项目经理
                checkRespon:'',//质检负责人
                techRespon:'',//项目技术负责人
                fenbaoUnit:'',//分包单位
                fenbaoProjectManager:'',//分包项目经理
                fenbao_tech_respon:'',//分包项目技术负责人
                fenbao_check_respon:'',//分包质检负责人
            },//基本信息
            // label
            label:{
            },
            modalVisible: false,
            modalContent: null,
            uploadVisivle:false,//上传附件模态框
            fileList:[],
            img:[],
            wk:[]
        };
        this.columns = [
            {
                title: '分项工程',
                dataIndex: 'name',
            }, {
                title: '检验批数',
                dataIndex: 'num',
            }, {
                title: '合格率',
                dataIndex: 'passPercent',
            }, {
                title: '监理验收意见',
                dataIndex: 'supervision',
            }
        ];
    }
    //生成施工单位选项
    initOptions = () => {
        const { getOrgTree } = this.props.cellActions;
        getOrgTree().then(res => {
            console.log('initOptions', res)
            if (!res.pk) return
            const workUnit_f = res.children.find(x => x.name === '施工单位')
            const workUnitOptions = workUnit_f ? workUnit_f.children.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
            const supervisorUnit_f = res.children.find(x => x.name === '监理单位')
            const supervisorUnitOptions = supervisorUnit_f ? supervisorUnit_f.children.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
            const surveyUnit_f = res.children.find(x => x.name === '勘测单位')
            const surveyUnit = surveyUnit_f ? surveyUnit_f.children.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
            const designUnit_f = res.children.find(x => x.name === '设计单位')
            const designUnit = designUnit_f ? designUnit_f.children.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
            const constructorUnit_f = res.children.find(x => x.name === '建设单位')
            const constructorUnit = constructorUnit_f ? constructorUnit_f.children.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
            this.setState({workUnitOptions, supervisorUnitOptions,surveyUnit,designUnit,constructorUnit})
        })
    }
    async componentDidMount(){
        let {getAllUsers,getWorkflow} = this.props.cellActions;
        getAllUsers().then(rst=>{
            this.setState({allUsers:rst});
        })
        this.initOptions();
        let { fenbuState={} } = this.props;
        let state = fenbuState.state;
        let fenbuPk = state.fenbuPk;
        const {getWorkPackageDetail} = this.props.cellActions;
        let checked = [];
        let arrs = [];
        let fenbu = {};
        let people = getUser();
        let avePassPercent = '';
        await getWorkPackageDetail({pk:fenbuPk}).then((rst) => {
            //设置附件
            if(rst.extra_params.file){
                this.setState({fileList:rst.extra_params.file})
            }
            if(rst.extra_params.img){
                let img = rst.extra_params.img || [];
                this.setState({img})
            }
            let pk = rst.extra_params.workflowid ||rst.extra_params.workflow_id || rst.extra_params.workflow || rst.extra_params.wfid;
			//显示流程详情
			getWorkflow({pk:pk}).then( res => {
				this.setState({wk:res})
			}) 
            fenbu = rst;
            checked = rst.extra_params.checked;
            this.setState({org_person:rst.extra_params.org_person,basic_info:rst.extra_params.basic_info})
            try{
                if(fenbu.extra_params.check_status === 1){
                    this.setConstructorView(fenbu.extra_params.workflow_id);
                }else if(fenbu.extra_params.check_status === 2){
                    document.querySelector("#qualityControl").value = fenbu.extra_params.constructorView.qualityControl;
                    document.querySelector('#testReport').value = fenbu.extra_params.constructorView.testReport;
                    document.querySelector('#outlook').value = fenbu.extra_params.constructorView.outlook;
                    document.querySelector("#qualityControl1").value = fenbu.extra_params.supervisionView.qualityControl;
                    document.querySelector('#testReport1').value = fenbu.extra_params.supervisionView.testReport;
                    document.querySelector('#outlook1').value = fenbu.extra_params.supervisionView.outlook;
                    document.querySelector('#conclusion').value = fenbu.extra_params.supervisionView.conclusion;
                }
            }catch(e){
                console.log(e);
            }
            try{
                if(fenbu.extra_params.executor.username === people.username && fenbu.extra_params.check_status !== 2){
                    this.setState({checkAuth:true});
                }
            }catch(e){
                console.log(e);
            }          
            /*try{
                debugger
                if(rst.children_wp[0].obj_type_hum === '子分部工程'){
                    let children = rst.children_wp;
                    children.map((item) => {
                        arrs.push(getWorkPackageDetail({pk:item.pk}));
                    })
                    let res = [];
                    Promise.all(arrs).then(rst => {
                        for(let i = 0; i<rst.length;i++){
                            res = res.concat(rst[i].children_wp);
                        }
                        checked = this.setCheck(res);
                        avePassPercent = this.getAvePassPercent(checked);
                    })    
                }else{
                    checked = this.setCheck(rst.children_wp);
                    avePassPercent = this.getAvePassPercent(checked);
                }
            }catch(e){
                console.log(e);
                checked = this.setCheck(rst.children_wp);
               
            }*/
            avePassPercent = this.getAvePassPercent(checked);
        });
        
        this.setState({tableData:checked,avePassPercent,fenbuPk:fenbuPk,fenbu});
       
    }
    //将施工方意见填写回去
    setConstructorView(pk){
        let constructorView = {};
        const {logWorkflowEvent,getWorkflow} = this.props.cellActions;
        getWorkflow({pk:pk}).then(rst => {
            constructorView.qualityControl = rst.subject[0].constructorView_qualityControl;
            constructorView.testReport = rst.subject[0].constructorView_testReport;
            constructorView.outlook = rst.subject[0].constructorView_outlook;
            document.querySelector("#qualityControl").value = constructorView.qualityControl;
            document.querySelector('#testReport').value = constructorView.testReport;
            document.querySelector('#outlook').value = constructorView.outlook; 
            this.setState({constructorView,wfstate:rst.current[0].id});
        })
        
    }
     //将得到的数据分类，已检验 未检验,flag为true时，代表要
    setCheck(data){
        let checked = [];
        for(let i=0;i<data.length;i++){
            try{
                if(data[i].extra_params.check_status  && data[i].extra_params.check_status === 2){
                    checked.push(data[i]);
                }
            }catch(e){
                console.log(e);
            } 
        }
        //this.handleData(unChecked);
        this.handleData(checked);
        return checked;
    }
    //处理check 和 unchecked数据
    handleData(data){
        data.map((item) => {
            try{
                item.num = item.basic_params.qc_counts.nonchecked + item.basic_params.qc_counts.checked;
                item.num = isNaN(item.num) ? 0 : item.num;
                item.passPercent = item.basic_params.qc_counts.fine / item.num * 100;
                item.passPercent = isNaN(item.passPercent) ? 0 : item.passPercent;
                item.cStatus = item.basic_params.qc_counts.nonchecked === 0 ? '已验收' : '待验收';
            }catch(e){
                item.cStatus = '待验收';
            }           
        })
    }
    //计算平均合格率
    getAvePassPercent(data){
        if(!data){
            data = [];
        }
        let avg = 0;
        data.map(item => {
            avg += parseInt(item.passPercent);
        })
        return (avg/data.length).toFixed(2) + '%';
    }
    //下拉框选择变化
    handleSelectChange(type,value){
        this.state[type] = value;
        this.forceUpdate();
    }   
    //返回
    getBack(){
        /*const { saveFenbuState } = this.props.cellActions;
        let {fenbuState} = this.props;
        console.log(this.props);
        fenbuState.flag = true;
        saveFenbuState(fenbuState);*/
    }
    //生成人员下拉框选项
    generateAllUsers(){
        let arr= [];
        this.state.allUsers.forEach((user,index)=>{
            if (user.account.person_name) {
                arr.push(<Select.Option key ={index} value={user.username}>{user.account.person_name}</Select.Option>);
            }
        });
        return arr;
    }
    //提交
    async submit(){
        let {fenbu,constructorView,fenbuPk,wfstate} = this.state;
        const {logWorkflowEvent,getWorkflow,updateWpData} = this.props.cellActions;
        let supervisionView = {};
        supervisionView.qualityControl = document.querySelector("#qualityControl1").value;
        supervisionView.testReport = document.querySelector('#testReport1').value;
        supervisionView.outlook = document.querySelector('#outlook1').value; 
        supervisionView.conclusion = document.querySelector('#conclusion').value;
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        logWorkflowEvent({pk:fenbu.extra_params.workflow_id},{state:wfstate,action:'通过',note:'同意',executor:executor,attachment:null}).then(rst => {
            console.log(rst);
            let data = {};
            let data_list = [];
            let extra = {};
            extra['check_status'] = 2;
            extra['workflow_id'] = rst.id;
            extra['check_time'] =  moment(new Date()).format('YYYY-MM-DD');
            extra['constructorView'] = constructorView;
            extra['supervisionView'] = supervisionView;
            let temp = {
                pk:fenbuPk,
                'extra_params':extra
            }
            data_list.push(temp);
            data['data_list'] = data_list;
            updateWpData({},data).then(rst => {
                console.log(rst);
                message.info('操作成功');
                window.history.back();
            })
        })
    }
    //回绝
    reject(){
        let {fenbu,constructorView,fenbuPk,wfstate} = this.state;
        const {logWorkflowEvent,getWorkflow,updateWpData,deleteWorkflow} = this.props.cellActions;
        let data = {};
        let data_list = [];
        let extra = {};
        extra['check_status'] = 0;
        extra['img'] = '';
        let temp = {
            pk:fenbuPk,
            'extra_params':extra
        }
        data_list.push(temp);
        data['data_list'] = data_list;
        updateWpData({},data).then(rst => {
            console.log(rst);
            deleteWorkflow({pk:fenbu.extra_params.workflow_id}).then(rst => {
                message.info('操作成功');
                window.history.back();
            })
        })
    }
    render() {
        let checkVisible = this.state.checkAuth ? '' : 'none';
        let auth_edit = !this.state.checkAuth;
        const {modalContent,modalVisible,workUnitOptions,supervisorUnitOptions,surveyUnit,designUnit,constructorUnit,org_person,basic_info = {}} = this.state;
        return (
            <div style={{display: 'inline-block', textAlign: 'center', position: 'relative',padding: 20,left:150}}>
                <Link to='/quality/yanshou/fenbu'>
                    <Button
                        style={{position: 'absolute',  left: '-92px'}}
                        type="primary"
                        icon="rollback"
                        onClick={this.getBack.bind(this)}
                    >
                        返回
                    </Button>
                </Link>
            <div className="wrapperDiv">
                <h2 style={{marginBottom:'20px'}}>分部工程质量验收记录</h2>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>工程名称</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.projectName}/></Col>
                        <Col span={2}><label>单位工程名称</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.unitName}/></Col>
                        <Col span={2}><label disabled >施工单位</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled placeholder="请在下方页面选择" value={basic_info.constructorUnit}/></Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>分部工程名称</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.fenbuName}/></Col>
                        <Col span={2}><label>项目经理</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.projectManager} disabled/></Col>
                        <Col span={2}><label>检验区段</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.check_quduan}/></Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>质检负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.checkRespon}/></Col>
                        <Col span={2}><label>项目技术负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.techRespon}/></Col>
                        <Col span={2}><label>分包单位</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.fenbaoUnit}/></Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>分包项目经理</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.fenbaoProjectManager}/></Col>
                        <Col span={2}><label>分包项目技术负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.fenbao_tech_respon}/></Col>
                        <Col span={2}><label>分包质检负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input disabled value={basic_info.fenbao_check_respon}/></Col>
                    </Row>
                    <Table
                        style={{marginTop:'20px'}}
                        dataSource={this.state.tableData}
                        columns={this.columns}
                    />
                    <Row style={{marginTop:'10px',marginBottom:'20px'}}>
                        <Col span={2}><label>平均合格率</label></Col>
                        <Col span={6}><Input disabled value={this.state.avePassPercent}/></Col>
                    </Row>
                    <Card>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>质量控制材料:</label> </Col>
                        <Col span={10}>
                            <Input 
                             disabled
                             id='qualityControl'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input 
                             disabled={auth_edit}
                             id='qualityControl1'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>安全功能检测报告:</label> </Col>
                        <Col span={10}>
                            <Input 
                             disabled
                             id='testReport'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input 
                             disabled={auth_edit}
                             id='testReport1'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>外观质量验收:</label> </Col>
                        <Col span={10}>
                            <Input 
                             disabled
                             id='outlook'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input
                             disabled={auth_edit} 
                             id='outlook1'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>分部（子分部）工程质量检验结论:</label> </Col>
                        <Col span={10}>
                            <Input
                             disabled={auth_edit} 
                             id='conclusion'
                             style={{width:'95%'}}
                             type='textarea'
                             rows={4}
                            />
                        </Col>
                    </Row>
                </Card>
                <Card style={{marginBottom:'20px',marginTop:'20px'}}>
                    <h2 style={{marginBottom:'20px'}}>参加验收单位</h2>
                    <Row style={{marginBottom:'20px'}}>
                    <Col span={3}><label>施工单位:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.workUnit} style={{width:'200px',marginRight:'20px'}} onChange={this.handleSelectChange.bind(this,'constructorUnit')}>
                            {workUnitOptions}
                        </Select>
                    </Col>
                    <Col span={3}><label>项目经理:</label></Col>
                    <Col span={9}>
                        <Select disabled style={{width:'200px'}} value={org_person.workUnit_p} onChange={this.handleSelectChange.bind(this,'projectManager')}>
                            {this.generateAllUsers()}
                        </Select>
                    </Col>
                   {/* <Col span={4}>
                        <label>已确认</label>
                    </Col>*/}
                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <Col span={3}><label>监理单位:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.supervisionUnit} style={{width:'200px',marginRight:'20px'}} onChange={this.handleSelectChange.bind(this,'supervisionUnit')}>
                            {supervisorUnitOptions}
                        </Select>
                    </Col>
                    <Col span={3}><label>总监理工程师:</label></Col>
                    <Col span={9}>
                        <Select disabled style={{width:'200px'}} value={org_person.supervisionBoss} onChange={this.handleSelectChange.bind(this,'supervisionBoss')}>
                            {this.generateAllUsers()}
                        </Select>
                    </Col>

                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <Col span={3}><label>勘察单位:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.surveyUnit} style={{width:'200px',marginRight:'20px'}}>
                            {surveyUnit}
                        </Select>   
                    </Col>
                    <Col span={3}><label>项目负责人:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.surveyUnit_p} style={{width:'200px'}}>
                            {this.generateAllUsers()}
                        </Select>
                    </Col>
                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <Col span={3}><label>设计单位:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.designUnit} style={{width:'200px',marginRight:'20px'}}>
                            {designUnit}
                        </Select>
                    </Col>
                    <Col span={3}><label>项目负责人:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.designUnit_p} style={{width:'200px'}} >
                            {this.generateAllUsers()}
                        </Select>
                    </Col>
                </Row>
                <Row style={{marginBottom:'20px'}}>
                    <Col span={3}><label>建设单位:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.constructorUnit} style={{width:'200px',marginRight:'20px'}} >
                            {constructorUnit}
                        </Select>
                    </Col>
                    <Col span={3}><label>项目负责人:</label></Col>
                    <Col span={9}>
                        <Select disabled value={org_person.constructorUnit_p} style={{width:'200px'}} >
                            {this.generateAllUsers()}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={3} className="ColSpan8">
                        <label style={{color:'rgba(0, 0, 0, 0.85)'}}>现场图片:</label>
                    </Col>
                    <Col span={21} className="ColSpan8">
                        <ImgShow style={{marginLeft:'10px'}} img={this.state.img}/>
                    </Col>
                </Row>
                <WorkflowHistory wk={this.state.wk}/>
            </Card>
            <div style={{textAlign: 'right'}}>
                <Button type="primary" style={{marginRight:'15px'}} onClick={() => {this.setState({uploadVisivle:true})}}>查看附件</Button>
                <Button type='primary' onClick={this.handlePreview.bind(this)} style={{marginRight:'15px'}}>预览表单</Button>
                <Button disabled={auth_edit} onClick={this.submit.bind(this)} type='primary' style={{marginRight:"10px"}}>审核通过</Button>
                <Button disabled={auth_edit} onClick={this.reject.bind(this)} type='danger' style={{marginRight:"10px"}}>不予通过</Button>
            </div>
                {
                    this.state.uploadVisivle &&
                        <Modal
                            okText='确认'
                            visible={true}
                            onOk={() => this.setState({uploadVisivle: false})}
                            onCancel={() => this.setState({uploadVisivle: false})}>
                            <div style={{ width: '450px' }}>
                                    <div style={{marginTop:'5px'}}>已上传文件:</div>
                                    { 
                                        this.state.fileList.map(item => {
                                            return (<p><a href={`${STATIC_DOWNLOAD_API}${item.download_url}`}>{item.name}</a></p>)           
                                        })
                                    }
                            </div>
                        </Modal>
                }
                {modalVisible &&
                    <Modal
                        title="分部（子分部）验收表单预览"
                        width={1200}
                        height={800}
                        visible={true}
                        footer={null}
                        maskClosable={false}
                        onCancel={() => {this.setState({modalVisible: false, modalContent: null})}}
                    >
                        {this.getModalContent(modalContent)}
                        <div style={{textAlign: 'right', marginTop: 10}}>
                            <Button type="primary" onClick={() => {
                                document.querySelector('#root').insertAdjacentHTML('afterend',
                                '<iframe src="'+`${modalContent.download_url}`+'" style="display: none"></iframe>')
                            }}>打印</Button>
                        </div>
                    </Modal>
                }
                </div>
            </div>
        );
    }
     getModalContent = (modalContent) => {
        return (
            <iframe style={{width:"100%", height:"700px"}}
                src={`${previewWord_API}${modalContent.a_file}`}
            >
                <p>您的浏览器不支持  iframe 标签。</p>
            </iframe>
        )
    }
//预览表单
    handlePreview(){   
        let {fenbu,tableData,avePassPercent} = this.state;
        const {label,basic_info,tianbaoTime} = fenbu.extra_params;
        let date = new Date();
        let tts = tianbaoTime.split('-');
        let constructorView_qualityControl = document.querySelector("#qualityControl").value;
        let constructorView_testReport = document.querySelector('#testReport').value;
        let constructorView_outlook = document.querySelector('#outlook').value;
        let qualityControl = document.querySelector("#qualityControl1").value;
        let testReport = document.querySelector('#testReport1').value;
        let outlook = document.querySelector('#outlook1').value; 
        let conclusion = document.querySelector('#conclusion').value;
        let lots = [];
        tableData.map((item,index) => {
            lots.push({
                index:index+1,
                fxgc:item.name,
                jyps:item.num,
                rate:item.passPercent,
                view:item.supervision || '',
            })
        })
        const pageData = {
           gcmc:basic_info.projectName || '',
           dwgcmc:basic_info.unitName || '',
           sgdw:basic_info.constructorUnit || '',
           fbdw:basic_info.fenbaoUnit || '',
           fbgc:basic_info.fenbuName || '',
           jyqd:basic_info.check_quduan || '',
           xmjl:basic_info.projectManager || '',
           fbxmjl:basic_info.fenbaoProjectManager || '',
           xmjsfzr:basic_info.techRespon || '',
           fbxmjsfzr:basic_info.fenbao_tech_respon || '',
           zjfzr:basic_info.checkRespon || '',
           fbzjfzr:basic_info.fenbao_check_respon || '',
           lots:lots,
           ave:avePassPercent || '',
           sgv1:constructorView_qualityControl || '',
           sgv2:constructorView_testReport || '',
           sgv3:constructorView_outlook || '',
           jlv1:qualityControl || '',
           jlv2:testReport || '',
           jlv3:outlook || '',
           conslusion:conclusion || '',
           sg:label.sgdw || '',
           jl:label.jldw || '',
           kc:label.kcdw || '',
           sj:label.sjdw || '',
           js:label.jsdw || '',
           sgp:label.workUnit_p || '',
           jlp:label.supervisionBoss || '',
           kcp:label.surveyUnit_p || '',
           sjp:label.designUnit_p || '',
           jsp:label.constructorUnit_p || '',
           y2:date.getFullYear(),
           m2:date.getMonth() + 1,
           d2:date.getDate(),
           y1:tts[0] || '',
           m1:tts[1] || '',
           d1:tts[2] || '',
           y3:'',
           m3:'',
           d3:'',
           y4:'',
           m4:'',
           d4:'',
           y5:'',
           m5:'',
           d5:'',
           doc_template_url: Fenbu_WordTemplate,
        }
        const {exchangeWordFile} = this.props.cellActions;
        exchangeWordFile({}, pageData).then(exfile_res  => {
            const modalContent = JSON.parse(exfile_res)
            console.log(modalContent);
            this.setState({
                modalVisible: true,
                modalContent: modalContent,
            })
        })
    }
}
