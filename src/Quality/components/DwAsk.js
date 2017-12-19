import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Row,Col,Card,Checkbox,Upload} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import {getUser} from '_platform/auth'
import Approval from '_platform/components/singleton/Approval';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import '../containers/fenbu.less';
import ImgFileUpload from './ImgFileUpload.js'
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD} from '_platform/api';
import moment from 'moment'
const Option = Select.Option;

@connect(
    state => {
        const { quality = {} } = state || {};
        return state;
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class DwAsk extends Component {
    constructor(props){
        super(props);
        this.state = {
            danweiName:'',
            gongchengName:'',
            constructOrg:'',
            allUsers:[],
            jianli:{},
            selectdata:[],
            danwei_data:null,
            uploadVisivle:false,//上传附件模态框
            fileList:[],
            img:[],//上传的图片
            workUnitOptions:[],
            supervisorUnitOptions:[],
            surveyUnit:[],
            designUnit:[],
            constructorUnit:[],
        }
    }
    componentDidMount(){        
      //  console.log(this.props); 
        let {getWorkPackageDetail,getUserByUname} = this.props.cellActions;
        if(this.props.quality.cells.danweistate){
            let danweipk = this.props.quality.cells.danweistate.pk;
           
            getWorkPackageDetail({pk:danweipk}).then(rst=>{
                this.initOptions(rst)
                //设置附件
                if(rst.extra_params.file){
                    this.setState({fileList:rst.extra_params.file})
                }
                if(rst.extra_params.img){
                    let img = rst.extra_params.img || [];
                    this.setState({img})
                }
                //debugger
                //console.log('asdasd',rst);
                this.setState({danweiName:rst.name,danwei_data:rst})
                let parentname = rst.parent?rst.parent.name:'';
                this.setState({gongchengName:parentname});
            })
        }
        getUserByUname({uname:getUser().username}).then(rst=>{
          //  console.log(rst);
            this.setState({constructOrg:rst[0].account.organization});
        })
        let {getAllUsers} = this.props.cellActions;
        getAllUsers().then(rst=>{
            this.setState({allUsers:rst});
        })

    }
    onselect(index,value){
        console.log(index,value);
        let data = this.state.selectdata;
        data[index] = value;
        this.setState({selectdata:data});
    }
    onSubmit() {
        let { createWorkflow,logWorkflowEvent } = this.props.cellActions;  
        let {danwei_data} = this.state;
        let values = document.getElementsByTagName('input')//小输入框
        let valuearr= []
        for(let i = 0;i<values.length;i++)
        {
            valuearr[i]=values[i].value;
        }
        //console.log(values,this.state.jianli,this.state.selectdata);
        let jianli = this.state.jianli;
        if(!jianli.account){
            message.error('未选择监理人');
            return;
        }
        let data = {
            "name": this.state.danweiName+"-单位验收",
            "description":this.state.danweiName+"-单位验收",
            "subject": [
                {
                    "danwei_id": this.props.quality.cells.danweistate.pk,
                    'values':JSON.stringify(valuearr),
                    jianliName:jianli.account.person_name,
                    selectdata:JSON.stringify(this.state.selectdata),
                    pk:danwei_data.pk,
                    code:danwei_data.code,
                    obj_type:danwei_data.obj_type,
                    obj_type_hum:danwei_data.obj_type_hum
                }
            ],
            "code": "TEMPLATE_024",
            "creator": {
                "id": getUser().id,
                "username":getUser().username,
                person_name: getUser().name,
                person_code: getUser().code,
            },
            "plan_start_time": null,
            "deadline": null,
            "status": 2
        };
        //将数据存到extra当中
        let constructor_input_info = {
            project_name:valuearr[0],//工程（项目）名称
            unit_name:valuearr[1],//单位工程名称
           // construct_unit:valuearr[2],//施工单位
            sub_item_unit:valuearr[3],//分包单位
            org_type:valuearr[4],//结构类型
            project_price:valuearr[5],//工程造价
            start_date:valuearr[6],//开工日期
            end_date:valuearr[7],//竣工日期
            check_a:valuearr[8],//
            check_b:valuearr[9],//
            check_c:valuearr[10],//
            check_d:valuearr[11],//
            check_e:valuearr[12],//
            check_f:valuearr[13],//
            check_g:valuearr[14],//
            check_h:valuearr[15],//
            check_i:valuearr[16],//
            check_j:valuearr[17],//
            check_k:valuearr[18],//
            check_l:valuearr[19],//
            check_o:valuearr[20],//
            check_p:valuearr[21],//
        }
        let constructor_select_info = {
            //project_manager:this.state.selectdata[0],//项目经理
            tech_responsor:this.state.selectdata[1],//项目技术负责人
            construct_unit:this.state.selectdata[2],//施工单位
            c_project_manager:this.state.selectdata[3],//项目经理
            jianli_unit:this.state.selectdata[4],//监理单位
            jianli_people:this.state.jianli.account.person_name,//总监理工程师
            gongyingshang:this.state.selectdata[5],//勘测单位
            gongying_proj_respon:this.state.selectdata[6],//勘测单位负责人
            design_unit:this.state.selectdata[7],//设计单位
            design_people:this.state.selectdata[8],//设计单位负责人
            boss_unit:this.state.selectdata[9],//规划单位
            boss:this.state.selectdata[10],//规划单位负责人
        }
        let userData = getUser();

        createWorkflow({},data).then( rst =>{
            let wfid = rst.id;
            let nowState = rst.current[0].id;
            let current = rst.current[0];
            let executor = current.participants[0].executor;
            const next_state_id = rst.workflow.transitions.find(x => x.from_state === nowState).to_state;
            const logevent_data = {
                next_states: [
                    {
                        state: next_state_id,
                        participants: [{
                            id: jianli.id,
                            username: jianli.username,
                            person_name: jianli.account.person_name,
                            person_code: jianli.account.person_code,
                        }],
                        deadline: null,
                        remark: null
                    }
                ],
                state: nowState,
                executor:executor,
                action: '提交',     // 必须是state.action中的一项
                note: '提交',
                attachment: null // 附件，空填null
            }
            let extra_file_list = this.state.fileList.map(item => {
                return {
                            a_file:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            name:item.name,
                            download_url:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                            misc:item.misc,
                            mime_type:item.mime_type   
                        }
                    })
            logWorkflowEvent({pk:wfid},logevent_data).then(rst=>{
                //console.log(rst);
                let jthis =this;
                let {putJianYanPi} = this.props.cellActions;
                let fenbus =  this.props.quality.cells.fenbus;
                let total = 0;
                let qual = 0;
                console.log(fenbus);
                fenbus && fenbus.forEach(fenbu=>{
                    console.log('fvb',fenbu);
                    total = total+ (fenbu.extra_params.check_status === 2? fenbu.extra_params.total_count:0);
                    qual = qual+ (fenbu.extra_params.check_status === 2? fenbu.extra_params.qualified_count:0);
                });
                console.log(total,qual);
                let putdata = {
                    "extra_params": {
                        "check_status": 1,
                        wfid:wfid,
                        JianLiID:jianli.id,
                        tianbaoTime:moment(Date.now()).format('L'),
                        total_count:total,
                        qualified_count:qual,
                        qualified_rate:total>0?qual/total:0,
                        file:extra_file_list,
                        img:this.state.img,
                        constructor_input_info:constructor_input_info,
                        constructor_select_info:constructor_select_info,
                    },
                    "version": "A",
                }
                putJianYanPi({pk:this.props.quality.cells.danweistate.pk},putdata).then(rst =>{
                    console.log(rst);
                    window.history.back();
                });

            });
        });
        //console.log('wf data',data,);
    }
    generateAllUsers(filter){
        let arr= [];
        this.state.allUsers.forEach((user,index)=>{
            if(filter)
            {
                let have = false;
                let groups = user.groups;
                groups.forEach(ele=>{
                    if(ele.name === filter){
                        have = true;
                    }
                });
                //console.log(group,filter);
                if(!have){
                    //console.log('filting');
                    return;
                }
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key ={index} value={user.account.person_name}>{user.account.person_name}</Select.Option>);
            }
          //  console.log(user.account.person_name);
        });
     //   console.log(arr);
        return arr;
    }
    selectJianLi(value){
        this.setState({jianli:JSON.parse(value)});
    }
    generateAllUsers2(filter){
        let arr= [];
        this.state.allUsers.forEach((user,index)=>{
            console.log(user);
            if(filter)
            {
                let have = false;
                let groups = user.groups;
                console.log(groups);
                if (groups) {
                    groups.forEach(ele => {
                        if (ele.name.indexOf(filter) >= 0) {
                            have = true;
                        }
                    });
                }
                if(!have){
                    return;
                }
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key ={index} value={JSON.stringify(user)}>{user.account.person_name}</Select.Option>);
            }
        });
        return arr;
    }
    render() {
        let {fileList} = this.state;
        return (
            <div style={{overflow:"hidden"}}>
                <div>
                    <Button
                        type="primary"
                        icon="rollback"
                        style={{position:'relative',left:'50px',marginTop:'20px'}}
                        onClick={() => { window.history.back();}}
                    >
                        返回
                    </Button>
                </div>
                <div className='fenbu-title'>
                   <h1>单位工程质量验收记录</h1>
                </div>
                <Card className='col-input'>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>工程名称</label> </Col>
                        <Col span={6}><Input className = 'dwInput' value = {this.state.gongchengName}/></Col>
                        <Col span={2}><label>单位工程名称</label> </Col>
                        <Col span={6}><Input className = 'dwInput' value = {this.state.danweiName}/></Col>
                        <Col span={2}><label>施工单位</label> </Col>
                        <Col span={6}><Input className = 'dwInput'  value = {this.state.constructOrg}/></Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>分包单位</label> </Col>
                        <Col span={6}><Input  className = 'dwInput' /></Col>
                        <Col span={2}><label>结构类型</label> </Col>
                        <Col span={6}><Input  className = 'dwInput' /></Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>工程造价</label> </Col>
                        <Col span={6}><Input  className = 'dwInput' /></Col>
                        <Col span={2}><label>开工日期</label> </Col>
                        <Col span={6}><Input  className = 'dwInput' /></Col>
                        <Col span={2}><label>竣工日期</label> </Col>
                        <Col span={6}><Input  className = 'dwInput' /></Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>项目经理</label> </Col>
                        <Col span={6}>
                            <Select
                            onSelect = {this.onselect.bind(this,0)}
                            style={{ marginLeft:'10px',width: '200px' }}>
                               {this.generateAllUsers()}
                            </Select>
                        </Col>
                        <Col span={2}><label>项目技术负责人</label> </Col>
                        <Col span={6}>                            
                            <Select
                            onSelect = {this.onselect.bind(this,1)}
                            style={{ marginLeft: '10px', width: '200px' }}>
                                {this.generateAllUsers()}
                            </Select>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={3}><label>分部工程</label> </Col>
                        <Col span={9}>
                            <div style = {{width:'95%',height:'100px'}}>
                                共<Input  className = 'dwInput'  style = {{width:'40px'}}/>分部,经查<Input  className = 'dwInput'  style = {{width:'40px'}}/>分部
                                符合标准及设计要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>分部
                            </div>
                        </Col>
                         <Col span={9}>
                            <Input 
                            disabled
                             className = 'dwInput' 
                             style={{width:'95%',height:'100px'}}
                             type='textarea'
                             placeholder="监理方备注，比如“合格、齐全”"
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={3}><label>质量控制资料核查</label> </Col>
                        <Col span={9}>
                        <div style = {{width:'95%',height:'100px'}}>
                            共<Input  className = 'dwInput' style = {{width:'40px'}}/>项,经查符合要求<Input  className = 'dwInput' style = {{width:'40px'}}/>项，
                            经核定符合规范要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                        </div>
                    </Col>
                         <Col span={9}>
                            <Input 
                            disabled
                             className = 'dwInput' 
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方备注，比如“合格、符合要求”"
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={3}><label>安全和主要使用功能核查及抽查结果</label> </Col>
                        <Col span={9}>
                        <div style = {{width:'95%',height:'100px'}}>
                            共核查<Input  className = 'dwInput'  style = {{width:'40px'}}/>项,符合要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                            共抽查<Input  className = 'dwInput'  style = {{width:'40px'}}/>项,符合要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                            经返工处理符合要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                        </div>
                    </Col>
                         <Col span={9}>
                            <Input 
                            disabled
                             className = 'dwInput' 
                             style={{width:'95%'}}
                             type='textarea'
                             placeholder="监理方备注，比如“美观整齐”"
                             rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={3}><label>外观质量检验</label> </Col>
                        <Col span={9}>
                        <div style = {{width:'95%',height:'100px'}}>
                            共抽查<Input  className = 'dwInput'  style = {{width:'40px'}}/>项,符合要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                            不符合要求<Input  className = 'dwInput'  style = {{width:'40px'}}/>项
                        </div>
                    </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                    <Col span={3}><label>综合验收结论</label> </Col>
                    <Col span={9}>
                        <Input 
                        disabled
                         className = 'dwInput' 
                         style={{width:'95%'}}
                         type='textarea'
                         placeholder="监理方填写，比如“质量合格”"
                         rows={4}
                        />
                    </Col>
                </Row>
                </Card>
                <Card style={{marginBottom:'10px',marginTop:'10px'}}>
                    <h2 style={{marginBottom:'10px'}}>参加验收单位</h2>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>施工单位:</label></Col>
                        <Col span={7}>
                                <Select
                                onSelect = {this.onselect.bind(this,2)}
                                style={{ width: '200px', marginRight: '20px' }}>
                                    {this.state.workUnitOptions}
                                </Select>
                        </Col>
                        <Col span={2}><label>项目经理:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,3)}
                                style={{ marginLeft: '10px', width: '200px' }}>
                                {this.generateAllUsers()}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>监理单位:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,4)}
                            style={{ width: '200px', marginRight: '20px' }}>
                            {this.state.supervisorUnitOptions}
                            </Select>
                        </Col>
                        <Col span={2}><label>总监理工程师:</label></Col>
                        <Col span={7}>
                        <Select
                        onSelect = {this.selectJianLi.bind(this)}
                        style={{ marginLeft:'10px',width: '200px' }}>
                           {this.generateAllUsers2('监理')}
                        </Select>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:'10px'}}>
                        <Col span={2}><label>勘测单位:</label></Col>
                        <Col span={7}>
                            <Select
                             onSelect = {this.onselect.bind(this,5)}
                             style={{ width: '200px', marginRight: '20px' }}>
                             {this.state.surveyUnit}
                            </Select>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,6)}
                                style={{ marginLeft: '10px', width: '200px' }}>
                                {this.generateAllUsers()}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>设计单位:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,7)}
                            style={{ width: '200px', marginRight: '20px' }}>
                            {this.state.designUnit}
                            </Select>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,8)}
                                style={{ marginLeft: '10px', width: '200px' }}>
                                {this.generateAllUsers()}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>建设单位:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,9)}
                            style={{ width: '200px', marginRight: '20px' }}>
                            {this.state.constructorUnit}
                            </Select>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Select
                            onSelect = {this.onselect.bind(this,10)}
                                style={{ marginLeft: '10px', width: '200px' }}>
                                {this.generateAllUsers()}
                            </Select>
                        </Col>
                    </Row>
                    <div style={{position:'relative',left:"-90px"}}>
                        <ImgFileUpload img={this.state.img} onChange={this.handleFormChange}/>
                    </div>
                </Card>
                <div>
                    <div style={{ width: '300px', margin: '0 auto' }}>
                        <Button type='primary' style={{ margin: '15px' }} onClick={() => {this.setState({uploadVisivle:true})}}>上传附件</Button>
                        <Button onClick = {this.onSubmit.bind(this)} type='primary'>确认发起</Button>
                    </div>
                </div>
                {
                    this.state.uploadVisivle &&
                        <Modal
                            okText='确认'
                            visible={true}
                            onOk={this.ok.bind(this)}
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
    //上传附件ok
    ok(){
        this.setState({uploadVisivle:false});
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
}