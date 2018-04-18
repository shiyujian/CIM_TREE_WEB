import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import {Link} from 'react-router-dom';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Row,Col,Card,Checkbox,Upload} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD} from '_platform/api';
import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {Fenbu_WordTemplate, previewWord_API} from '_platform/api';
import ImgFileUpload from '../components/ImgFileUpload';
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
export default class FenbuRecord extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],//表格数据
            avePassPercent:'',//平均合格率
            fenbuPk:'',//当前验收分部的pk
            allUsers:[],//全部人员
            projectManager:'',//项目经理
            fenbu:null,//当前分布 
            supervisionBoss:'',//总监理
            supervisionUnit:'',//监理单位
            workUnitOptions: [],//施工单位下拉框选项
            supervisorUnitOptions:[],//监理单位下拉框选项
            surveyUnit:[],//勘测单位下拉框选项
            designUnit:[],//设计单位下拉框选项
            constructorUnit:[],//建设单位下拉框选项
            workUnitOptions_p: [],//施工单位下拉框选项renyuan
            supervisorUnitOptions_p:[],//监理单位下拉框选项renyuan
            surveyUnit_p:[],//勘测单位下拉框选项renyuanrenyuan
            designUnit_p:[],//设计单位下拉框选项renyuan
            constructorUnit_p:[],//建设单位下拉框选项renyuan
            org_person:{},//对应记录单位和人员信息
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
            fileList:[],//附件
            img:[],
            uploadVisivle:false,//上传附件模态框
            targetDanwei:null,
            peoples_sg:null,
            peoples_jl:null,
            peoples_kc:null,
            peoples_sj:null,
            peoples_js:null,
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
    componentDidMount(){
        try{
            let {getAllUsers} = this.props.cellActions;
            getAllUsers().then(rst=>{
                this.setState({allUsers:rst});
            })
            let { fenbuState={} } = this.props;
            let state = fenbuState.state;
            let avePassPercent = this.getAvePassPercent(state.checked);
            this.initBasicParam(state.fenbuPk);
            this.setState({tableData:state.checked,avePassPercent,fenbuPk:state.fenbuPk});  
        }catch(e){
            console.log(e);
        }
        
    }
    //得到项目名称等
    async initBasicParam(pk){
        const {getWorkPackageDetail} = this.props.cellActions;
        getWorkPackageDetail({pk:pk}).then(rst => {
            this.setState({fenbu:rst});
            //设置附件
            if(rst.extra_params.file){
                this.setState({fileList:rst.extra_params.file})
            }
            let {basic_info} = this.state;
            if(rst.obj_type_hum === '分部工程'){
                basic_info.fenbuName = rst.name;
                getWorkPackageDetail({pk:rst.parent.pk}).then(rst => { 
                    if(rst.obj_type_hum === '单位工程'){
                        basic_info.unitName = rst.name;
                        basic_info.projectName = rst.parent.name;
                        this.initOptions(rst);
                        this.setState({basic_info,targetDanwei:rst});
                    }else{
                        getWorkPackageDetail({pk:rst.parent.pk}).then(rst =>{ 
                            basic_info.unitName = rst.name;
                            basic_info.projectName = rst.parent.name;
                            this.setState({basic_info});
                        })    
                    }   
                })
            }else{
                basic_info.fenbuName = rst.parent.name;
                getWorkPackageDetail({pk:rst.parent.pk}).then(rst => {
                    getWorkPackageDetail({pk:rst.parent.pk}).then(rst => {
                        if(rst.obj_type_hum === '单位工程'){
                            basic_info.unitName = rst.name;
                            basic_info.projectName = rst.parent.name;
                            this.setState({basic_info});
                        }else{
                            getWorkPackageDetail({pk:rst.parent.pk}).then(rst => {  
                                basic_info.unitName = rst.name;
                                basic_info.projectName = rst.parent.name;
                                this.setState({basic_info});
                            })    
                        }   
                    })  
                })
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
    
    //返回
    getBack(){
        const { saveFenbuState } = this.props.cellActions;
        let {fenbuState = {}} = this.props;
        console.log(this.props);
        fenbuState.flag = true;
        saveFenbuState(fenbuState);
    }
    //生成施工单位选项
    initOptions = (data) => {
        console.log('initOptions', data)
        if (!data) return
        const workUnit_f = data.extra_params.unit.filter(x => x.type === '施工单位')
        const workUnitOptions = workUnit_f ? workUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        const supervisorUnit_f = data.extra_params.unit.filter(x => x.type === '监理单位')
        const supervisorUnitOptions = supervisorUnit_f ? supervisorUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        const surveyUnit_f = data.extra_params.unit.filter(x => x.type === '勘测单位')
        const surveyUnit = surveyUnit_f ? surveyUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        const designUnit_f = data.extra_params.unit.filter(x => x.type === '设计单位')
        const designUnit = designUnit_f ? designUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        const constructorUnit_f = data.extra_params.unit.filter(x => x.type === '建设单位')
        const constructorUnit = constructorUnit_f ? constructorUnit_f.map(x => <Option key={String(x.code)}>{x.name}</Option>) : []
        this.setState({workUnitOptions, supervisorUnitOptions,surveyUnit,designUnit,constructorUnit})
    }
    //提交
    async submit(){
        const {createWorkflow,updateWpData,getUserByUname,logWorkflowEvent} = this.props.cellActions;
        let {fenbuPk,fenbu} = this.state;
        let constructorView_qualityControl = document.querySelector("#qualityControl").value;
        let constructorView_testReport = document.querySelector('#testReport').value;
        let constructorView_outlook = document.querySelector('#outlook').value;
        //创建数据对象
        let person = getUser();
        let data = {};
        let subject = {};
        subject = 
            {
                pk:fenbu.pk,
                code:fenbu.code,
                obj_type:fenbu.obj_type,
                obj_type_hum:fenbu.obj_type_hum,
                constructorView_qualityControl: constructorView_qualityControl,
                constructorView_testReport: constructorView_testReport,
                constructorView_outlook: constructorView_outlook
            }
        data.subject = [subject];
        data.name = '施工包质量验收流程';
        data.description = "分部验收";
        data.code = "TEMPLATE_024";
        //流程创建者
        let creator = {};
        creator.id = person.id;
        creator.username = person.username;
        creator.person_name = person.name;
        creator.person_code = person.code;
        data.creator = creator;
        let date = new Date(); 
        data.plan_start_time = moment(date).format('YYYY-MM-DD'); 
        data.deadline = null;
        //下一步计划执行人
        let participants = [];
        let {supervisionBoss} = this.state;
        if(supervisionBoss===''){
            message.info('请选择总监理工程师');
            return;
        }
        let p = {};
        await getUserByUname({uname:supervisionBoss}).then(rst => {
            p.id = rst[0].id;
            p.username = rst[0].username;
            p.person_code = rst[0].account.person_code;
            p.person_name = rst[0].account.person_name;
        })
        participants.push(p);
        data.participants = [creator];
        data.status = 2;
        console.log(data);
        await createWorkflow({},data).then(rst => {
            let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'同意',
                    executor:creator,
                    next_states:[{
                        participants:participants,
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(rst => {
                    console.log(rst);
                    let data = {};
                    let data_list = [];
                    let extra = {};
                    let {org_person,basic_info,tableData,fileList,img} = this.state;
                    extra['check_status'] = 1;
                    extra['workflow_id'] = rst.id;
                    extra['tianbaoTime'] = rst.plan_start_time;
                    extra['executor'] = p;
                    extra['org_person'] = org_person;
                    extra['basic_info'] = basic_info;
                    extra['checked'] = tableData;
                    extra['label'] = this.state.label;
                    let total_count = 0;
                    let qualified_count = 0;
                    tableData.map(item => {
                        total_count += item.extra_params.total_count;
                        qualified_count += item.extra_params.qualified_count;
                    })
                    extra['total_count'] = total_count || 0;
                    extra['qualified_count'] = qualified_count || 0;
                    extra['qualified_rate'] = total_count === 0||isNaN(total_count) ? 0 : qualified_count / total_count;
                    let extra_file_list = fileList.map(item => {
                    return {
                                a_file:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                                name:item.name,
                                download_url:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                                misc:item.misc,
                                mime_type:item.mime_type   
                            }
                        })
                    extra['file'] = extra_file_list;
                    extra['img'] = img;
                    let temp = {
                        pk:fenbuPk,
                        extra_params:extra,
                    }
                    data_list.push(temp);
                    data['data_list'] = data_list;
                    updateWpData({},data).then(rst => {
                        console.log(rst);
                        message.info('操作成功');
                        window.history.back();
                    })
                })
           
        })

    }
    //获取某个单位下的所有人员，包括其一级zi子单位
    getAllUsersByOrgcode = async(orgcode) => {
        const {getOrgTreeByCode,fetchUsersByOrgCode} = this.props.cellActions
        let org_code = orgcode
        let rst = await getOrgTreeByCode({code:orgcode});
        rst.children.map((item) => {
            org_code += `,${item.code}`        
        })
        let res = await fetchUsersByOrgCode({org_code:org_code})
        return res;
    }
     //生成监理审批人
     generateAllUsers2(data,filter){
        let arr= [];
        data.forEach((user,index)=>{
            if(filter)
            {
                let group = '';
                user.groups.map(item => {
                    group += item.name;
                })
                if(group.indexOf(filter) === -1){
                    return;
                }
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key ={index} value={user.username}>{user.account.person_name}</Select.Option>);
            }
          //  console.log(user.account.person_name);
        });
        //console.log(arr);
        return arr;
    }
    //处理下拉框
    handleSupervisorUnit = async(type,value, option) => {
        let {org_person,label} = this.state;
        label[type] = option.props.children;
        org_person.supervisionUnit = value;
        let peoples_jl = await this.getAllUsersByOrgcode(value)
        this.setState({
            peoples_jl,
            org_person,
            label
        })
    }
     handleConstructorUnit = async(type,value, option) => {
        let {org_person,label} = this.state;
        label[type] = option.props.children;
        org_person.constructorUnit = value;
        let peoples_js = await this.getAllUsersByOrgcode(value)
        this.setState({
            peoples_js,
            org_person,
            label
        })
    }
     handleSurveyUnit = async(type,value, option) => {
        let {org_person,label} = this.state;
        label[type] = option.props.children;
        org_person.surveyUnit = value
        let people_kc = await this.getAllUsersByOrgcode(value)
        this.setState({
            people_kc,
            org_person,
            label
        })
    }
     handleDesignUnit = async(type,value, option) => {
        let {org_person,label} = this.state;
        label[type] = option.props.children;
        org_person.designUnit = value;
        let people_sj = await this.getAllUsersByOrgcode(value)
        this.setState({
            people_sj,
            org_person,
            label
        })
    }
     handleUnitOptions = async(type,value, option) => {
        console.log(option);
        let {org_person,label,basic_info} = this.state;
        label[type] = option.props.children;
        basic_info.constructorUnit = option.props.children;
        org_person.workUnit = value;
        let peoples_sg = await this.getAllUsersByOrgcode(value)
         this.setState({
                org_person,
                label,
                basic_info,
                peoples_sg
            })
    }
    handlePClick(type,value,option){
         let {org_person,label,basic_info} = this.state;
         label[type] = option.props.children;
         org_person[type] = value;
         if(type === "workUnit_p"){
            basic_info.projectManager = option.props.children
         }
         this.setState({org_person,label,basic_info});
    }
     //下拉框选择变化
    handleSelectChange(type,value,option){
        this.state[type] = value;
        let {org_person,label} = this.state;
        label[type]= option.props.children;
        org_person[type] = value;
        this.setState({org_person,label});
    }  
    textChange(type,e){
        let{basic_info} = this.state;
        basic_info[type] = e.target.value;
        this.setState({basic_info});
    }
    render() {
        const {workUnitOptions,supervisorUnitOptions,surveyUnit,designUnit,constructorUnit,
                workUnitOptions_p,supervisorUnitOptions_p,surveyUnit_p,designUnit_p,constructorUnit_p,basic_info,
                modalContent,modalVisible,fileList} = this.state;
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
                        <Col className="ColSpan8" span={6}><Input placeholder="请在下方页面选择" value={basic_info.projectManager} disabled/></Col>
                        <Col span={2}><label>检验区段</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.check_quduan} onChange={this.textChange.bind(this,'check_quduan')}/></Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>质检负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.checkRespon} onChange={this.textChange.bind(this,'checkRespon')}/></Col>
                        <Col span={2}><label>项目技术负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.techRespon} onChange={this.textChange.bind(this,'techRespon')}/></Col>
                        <Col span={2}><label>分包单位</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.fenbaoUnit} onChange={this.textChange.bind(this,'fenbaoUnit')}/></Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={2}><label>分包项目经理</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.fenbaoProjectManager} onChange={this.textChange.bind(this,'fenbaoProjectManager')}/></Col>
                        <Col span={2}><label>分包项目技术负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.fenbao_tech_respon} onChange={this.textChange.bind(this,'fenbao_tech_respon')}/></Col>
                        <Col span={2}><label>分包质检负责人</label> </Col>
                        <Col className="ColSpan8" span={6}><Input value={basic_info.fenbao_check_respon} onChange={this.textChange.bind(this,'fenbao_check_respon')}/></Col>
                    </Row>
                    <Table
                        style={{marginTop:'20px'}}
                        dataSource={this.state.tableData}
                        columns={this.columns}
                    />
                    <Row style={{marginTop:'10px',marginBottom:'20px'}}>
                        <Col span={2}><label>平均合格率</label></Col>
                        <Col span={6}><Input value={this.state.avePassPercent}/></Col>
                    </Row>
                    <Card>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>质量控制材料:</label> </Col>
                        <Col span={10}>
                            <Input 
                             id='qualityControl'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="施工方备注，比如“合格、齐全”"
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input
                             disabled 
                             id='qualityControl1'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方备注，比如“合格、齐全”"
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>安全功能检测报告:</label> </Col>
                        <Col span={10}>
                            <Input 
                             id='testReport'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="施工方备注，比如“合格、符合要求”"
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input 
                             disabled
                             id='testReport1'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方备注，比如“合格、符合要求”"
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>外观质量验收:</label> </Col>
                        <Col span={10}>
                            <Input 
                             id='outlook'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="施工方备注，比如“美观整齐”"
                             rows={4}
                            />
                        </Col>
                         <Col span={10}>
                            <Input 
                             disabled
                             id='outlook1'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方备注，比如“美观整齐”"
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={4}><label>分部（子分部）工程质量检验结论:</label> </Col>
                        <Col span={10}>
                            <Input 
                             disabled
                             id='conclusion'
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方填写，比如“质量合格”"
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
                            <Select style={{width:'200px',marginRight:'20px'}} id='workUnit' onSelect={this.handleUnitOptions.bind(this,'sgdw')}>
                                {workUnitOptions}
                            </Select>
                        </Col>
                        <Col span={3}><label>项目经理:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px'}} onSelect={this.handlePClick.bind(this,'workUnit_p')}>
                                {   
                                    this.state.peoples_sg &&
                                    this.generateAllUsers2(this.state.peoples_sg,'')
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={3}><label>监理单位:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px',marginRight:'20px'}} onSelect={this.handleSupervisorUnit.bind(this,'jldw')}>
                                {supervisorUnitOptions}
                            </Select>
                        </Col>
                        <Col span={3}><label>总监理工程师:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px'}} onSelect={this.handleSelectChange.bind(this,'supervisionBoss')}>
                                {   
                                    this.state.peoples_jl &&
                                    this.generateAllUsers2(this.state.peoples_jl,'监理')
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={3}><label>勘测单位:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px',marginRight:'20px'}} onSelect={this.handleSurveyUnit.bind(this,'kcdw')}>
                                {surveyUnit}
                            </Select>
                        </Col>
                        <Col span={3}><label>项目负责人:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px'}} onSelect={this.handlePClick.bind(this,'surveyUnit_p')}>
                                {   
                                    this.state.peoples_kc &&
                                    this.generateAllUsers2(this.state.peoples_kc,'')
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={3}><label>设计单位:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px',marginRight:'20px'}} onSelect={this.handleDesignUnit.bind(this,'sjdw')}>
                                {designUnit}
                            </Select>
                        </Col>
                        <Col span={3}><label>项目负责人:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px'}} onSelect={this.handlePClick.bind(this,'designUnit_p')}>
                                {   
                                    this.state.peoples_sj &&
                                    this.generateAllUsers2(this.state.peoples_sj,'')
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'20px'}}>
                        <Col span={3}><label>建设单位:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px',marginRight:'20px'}} onSelect={this.handleConstructorUnit.bind(this,'jsdw')}>
                                {constructorUnit}
                            </Select>
                        </Col>
                        <Col span={3}><label>项目负责人:</label></Col>
                        <Col span={9}>
                            <Select style={{width:'200px'}} onSelect={this.handlePClick.bind(this,'constructorUnit_p')}>
                                {   
                                    this.state.peoples_js &&
                                    this.generateAllUsers2(this.state.peoples_js,'')
                                }
                            </Select>
                        </Col>
                    </Row>
                    <ImgFileUpload style={{overflow:'auto'}} img={this.state.img} onChange={this.handleFormChange}/>
                </Card>
                <div style={{textAlign: 'right'}}>
                    <Button type="primary" style={{marginRight:'15px'}} onClick={() => {this.setState({uploadVisivle:true})}}>上传附件</Button>
                    <Button type='primary' onClick={this.handlePreview.bind(this)} style={{marginRight:'15px'}}>预览表单</Button>
                    <Button type='primary' onClick={this.submit.bind(this)}>确认发起</Button>
                </div>
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
                {
                    this.state.uploadVisivle &&
                        <Modal
                            okText='确认'
                            visible={true}
                            onOk={() => this.setState({uploadVisivle: false})}
                            onCancel={() => this.setState({uploadVisivle: false})}>
                            <div style={{ width: '450px' }}>
                                    <Upload
                                        style={{ margin: '10px' }}
                                        showUploadList={true}
                                        beforeUpload={this.beforeUpload.bind(this)}
                                    >
                                        <Button style={{ marginRight: '10px' }}>上传相关文件</Button>
                                    </Upload>
                                    <div style={{marginTop:'5px'}}>已上传文件:</div>
                                    { 
                                        fileList.map((item,index) => {
                                            return (<div><a href='#'>{item.name}</a>
                                                        <span style={{marginLeft:'20px',color:'red'}}
                                                            onClick={ () => {
                                                                const {deleteStaticFile} = this.props.actions;
                                                                deleteStaticFile({id:fileList[index].id});
                                                                //let {fileList} = this.state;
                                                                fileList.splice(index,1);
                                                                this.setState({fileList});
            
                                                            }}
                                                        >x</span>
                                                </div>)
                                        })
                                    }
                            </div>
                        </Modal>
                }
                </div>
            </div>

        );
    }
     //上传图片组件变化
     handleFormChange = (changedFields) => {
        console.log(changedFields);
        let img = [];
        changedFields.img && changedFields.img.value.map(item => {
            img.push(item.a_file)
        })
        this.setState({img})
      }
    //beforeupload
    beforeUpload(file){
        const {uploadStaticFile} = this.props.actions;
        const formdata = new FormData();
        formdata.append('a_file',file);
        formdata.append('name',file.name);
        //debugger;
       // console.log(file,formdata.get('a_file'));
        uploadStaticFile({},formdata).then(rst=>{
           console.log(rst);
            if(rst.id){
                message.success('上传成功');
                let {fileList} = this.state;
                fileList.push(rst);
                console.log(fileList);
                this.setState({fileList});
            }else{
                message.error('上传失败');
            }
        });
        return false;
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
        let {org_person,basic_info,tableData,avePassPercent,label} = this.state;
        let date = new Date();
        //console.log(label);
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
           y1:date.getFullYear(),
           m1:date.getMonth() + 1,
           d1:date.getDate(),
           y2:'',
           m2:'',
           d2:'',
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
