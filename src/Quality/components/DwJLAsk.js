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
import {getUser} from '_platform/auth'
import Approval from '_platform/components/singleton/Approval';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import '../containers/fenbu.less';
import ImgShow from './ImgShow.js'
import WorkflowHistory from './WorkflowHistory'
import moment from 'moment'
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD,STATIC_DOWNLOAD_API} from '_platform/api';
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
export default class DwJLAsk extends Component {
    constructor(props){
        super(props);
        this.state = {
            danweiName:'',
            gongchengName:'',
            constructOrg:'',
            allUsers:[],
            jianli:{},
            selectdata:[],
            orgs:{
                '施工单位':[], '监理单位':[], '勘测单位':[], '设计单位':[], '规划单位':[],
            },
            texts:["","","","",""],
            wf:{},
            jianliName:null,
            danwei_data:null,
            uploadVisivle:false,//上传附件模态框
            fileList:[],
            img:[],
        }
    }
    componentDidMount(){
      //  console.log(this.props); 
        // let {getWorkPackageDetail,getUserByUname} = this.props.cellActions;
        // if(this.props.quality.cells.danweistate){
        //     let danweipk = this.props.quality.cells.danweistate.pk;
           
        //     getWorkPackageDetail({pk:danweipk}).then(rst=>{
        //         //debugger
        //         console.log('asdasd',rst);
        //         this.setState({danweiName:rst.name})
        //         let parentname = rst.parent?rst.parent.name:'';
        //         this.setState({gongchengName:parentname});
        //     })
        // }
        // getUserByUname({uname:getUser().username}).then(rst=>{
        //   //  console.log(rst);
        //     this.setState({constructOrg:rst[0].account.organization});
        // })
        // let {getAllUsers} = this.props.cellActions;
        // getAllUsers().then(rst=>{
        //     this.setState({allUsers:rst});
        // })
        // let {getOrgTree} = this.props.cellActions;
        // getOrgTree().then(rst=>{
        //     let set = {};
        //     rst.children.forEach(group=>{
        //         set[group.name] = group.children?group.children:[];
        //     });
        //     this.setState({orgs:set});
        //    // console.log(set);
        // });
        let nowDanwei = this.props.quality.cells.danweistate
        let {getWorkflow,getWorkPackageDetail} = this.props.cellActions;
        getWorkflow({pk:nowDanwei.extra_params.wfid}).then(rst=>{
            this.setState({wf:rst});
            let subjectData = rst.subject[0];
            let sjdata_value = JSON.parse(subjectData.values);
            let sjdata_select = JSON.parse(subjectData.selectdata);
            this.setState({values:sjdata_value,selects:sjdata_select,jianliName: subjectData.jianliName});
            let inputs = document.getElementsByClassName('dwInput');
            let inputs2 = document.getElementsByClassName('dwInput2');
            document.getElementsByClassName('dwInput3')[0].value = subjectData.jianliName;
            for(let i = 0; i<inputs.length;i++){
                inputs[i].value = sjdata_value[i];
            }
            for(let i = 0; i<inputs2.length;i++){
                inputs2[i].value = sjdata_select[i];
            }
            getWorkPackageDetail({pk:subjectData.pk}).then((res) => {
                this.setState({danwei_data:res})
                 //设置附件
                if(res.extra_params.file){
                    this.setState({fileList:res.extra_params.file})
                }
                if(res.extra_params.img){
                    let img = res.extra_params.img || [];
                    this.setState({img})
                }
            })
        });
    }
    componentDidUpdate(){
        if(!this.state.jianliName)
        {
            return;
        }
        let inputs = document.getElementsByClassName('dwInput');
        let inputs2 = document.getElementsByClassName('dwInput2');
        document.getElementsByClassName('dwInput3')[0].value = this.state.jianliName;
        for(let i = 0; i<inputs.length;i++){
            inputs[i].value = this.state.values[i];
        }
        for(let i = 0; i<inputs2.length;i++){
            inputs2[i].value = this.state.selects[i];
        }
    }
    onselect(index,value){
        console.log(index,value);
        let data = this.state.selectdata;
        data[index] = value;
        this.setState({selectdata:data});
    }
    onSubmit() {
        // let { createWorkflow,logWorkflowEvent } = this.props.cellActions;  
        // let values = document.getElementsByTagName('input')//小输入框
        // let valuearr= []
        // for(let i = 0;i<values.length;i++)
        // {
        //     valuearr[i]=values[i].value;
        // }
        // //console.log(values,this.state.jianli,this.state.selectdata);
        // let jianli = this.state.jianli
        // let data = {
        //     "name": this.state.danweiName+"-单位验收",
        //     "description":this.state.danweiName+"-单位验收",
        //     "subject": [
        //         {
        //             "danwei_id": this.props.quality.cells.danweistate.pk,
        //             'values':JSON.stringify(valuearr),
        //             jianliName:jianli.account.person_name,
        //             selectdata:JSON.stringify(this.state.selectdata)
        //         }
        //     ],
        //     "code": "TEMPLATE_024",
        //     "creator": {
        //         "id": getUser().id,
        //         "username":getUser().username,
        //         person_name: getUser().name,
        //         person_code: getUser().code,
        //     },
        //     "plan_start_time": null,
        //     "deadline": null,
        //     "status": 2
        // };
        // let userData = getUser();
        // createWorkflow({},data).then( rst =>{
        //     let wfid = rst.id;
        //     let nowState = rst.current[0].id;
        //     const next_state_id = rst.workflow.transitions.find(x => x.from_state === nowState).to_state;
        //     const logevent_data = {
        //         next_states: [
        //             {
        //                 state: next_state_id,
        //                 participants: [{
        //                     id: jianli.id,
        //                     username: jianli.username,
        //                     person_name: jianli.account.person_name,
        //                     person_code: jianli.account.person_code,
        //                 }],
        //                 deadline: null,
        //                 remark: null
        //             }
        //         ],
        //         state: nowState,
        //         executor: {
        //             id: userData.id,
        //             username: userData.username,
        //             person_name: userData.name,
        //             person_code: userData.code,
        //         },
        //         action: '提交',     // 必须是state.action中的一项
        //         note: '提交',
        //         attachment: null // 附件，空填null
        //     }
        //     logWorkflowEvent({pk:wfid},logevent_data).then(rst=>{
        //         console.log(rst);
        //         let {putJianYanPi} = this.props.cellActions;
        //         let putdata = {
        //             "extra_params": {
        //                 "check_status": 1,
        //                 wfid:wfid,
        //                 JianLiID:jianli.id
        //             },
        //             "version": "A",
        //         }
        //         putJianYanPi({pk:this.props.quality.cells.danweistate.pk},putdata).then(rst =>{
        //             console.log(rst);
        //         });
        //     });
        // });
        // console.log('wf data',data,);
        let {logWorkflowEvent,getWorkflow,putJianYanPi} = this.props.cellActions;
        let nowDanwei = this.props.quality.cells.danweistate
        let userData = getUser();
        console.log(this.state.texts);
        const logevent_data = {
            state: this.state.wf.current[0].id,
            executor: {
                id: userData.id,
                username: userData.username,
                person_name: userData.name,
                person_code: userData.code,
            },
            action: '通过',     // 必须是state.action中的一项
            note: JSON.stringify(this.state.texts),
            attachment: null // 附件，空填null
        }
        logWorkflowEvent({pk:nowDanwei.extra_params.wfid},logevent_data).then(rst =>{
            let jianli_info = {
                overiview:this.state.texts[0],//分部工程
                quality:this.state.texts[1],//质量控制资料核查
                result:this.state.texts[2],//安全和主要使用功能核查及抽查结果
                outlook:this.state.texts[3],//外观质量
                conclusion:this.state.texts[4]//综合验收结论
            }
            let putdata = {
                "extra_params": {
                    jlcomment:JSON.stringify(this.state.texts),
                    "check_status": 2,
                    check_time:moment(Date.now()).format('L'),
                    jianli_info:jianli_info
                },
                "version": "A",
            }
            if(!rst.status){
                message.error('错误');
                return;
            }
            putJianYanPi({pk:this.props.quality.cells.danweistate.pk},putdata).then(rst=>{
                message.success('成功');
                window.history.back();
            });
        })
    }
    generateAllUsers(filter){
        let arr= [];
        this.state.allUsers.forEach((user,index)=>{
            if(filter)
            {
                
                let group = user.groups[0]?user.groups[0].name:'';
                console.log(group,filter);
                if(!(group === filter)){
                    console.log('filting');
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
        this.setState({ jianli: JSON.parse(value) });
    }
    generateAllUsers2(filter) {
        let arr = [];
        this.state.allUsers.forEach((user, index) => {
            if (filter) {
                let group = user.groups[0] ? user.groups[0].name : '';
                console.log(group, filter);
                if (!(group === filter)) {
                    console.log('filting');
                    return;
                }
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key={index} value={JSON.stringify(user)}>{user.account.person_name}</Select.Option>);
            }
            //  console.log(user.account.person_name);
        });
        //console.log(arr);
        return arr;
    }
    changeText(index, p1) {
        console.log(p1.target.value, index);
        let arr = this.state.texts;
        arr[index] = p1.target.value;
        this.setState({ texts: arr });
    }
    render() {
        // console.log(this.state);
        //  console.log('rend',this.state.allUsers);
        return (
            <div
                style={{ backgroundColor: '#fff', position: 'absolute', zIndex: '90', top: '70px', width: '100%' }}>
                <div>
                    <Button onClick={() => {
                        window.history.back();
                    }} type='primary' style={{ margin: '10px',position:'relative',left:"70px",top:"20px" }}>返回</Button>
                </div>
                <div className='fenbu-title'>
                    <h1>单位工程质量验收审批</h1>
                </div>
                <Card className='col-input'>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>工程名称</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' value={this.state.gongchengName} /></Col>
                        <Col span={2}><label>单位工程名称</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' value={this.state.danweiName} /></Col>
                        <Col span={2}><label>施工单位</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' value={this.state.constructOrg} /></Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>分包单位</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' /></Col>
                        <Col span={2}><label>结构类型</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' /></Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>工程造价</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' /></Col>
                        <Col span={2}><label>开工日期</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' /></Col>
                        <Col span={2}><label>竣工日期</label> </Col>
                        <Col span={6}><Input disabled className='dwInput' /></Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>项目经理</label> </Col>
                        <Col span={6}>
                            <Input disabled className='dwInput2' />
                        </Col>
                        <Col span={2}><label>项目技术负责人</label> </Col>
                        <Col span={6}>
                            <Input disabled className='dwInput2' />
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={3}><label>分部工程</label> </Col>
                        <Col span={9}>
                            <div style={{ width: '95%', height: '100px' }}>
                                共<Input disabled className='dwInput' style={{ width: '40px' }} />分部,经查<Input disabled className='dwInput' style={{ width: '40px' }} />分部
                                符合标准及设计要求<Input disabled className='dwInput' style={{ width: '40px' }} />分部
                            </div>
                        </Col>
                        <Col span={9}>
                            <Input
                                onChange={this.changeText.bind(this, 0)}
                                style={{ width: '95%', height: '100px' }}
                                type='textarea'
                                placeholder="监理方备注，比如“合格、齐全”"
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={3}><label>质量控制资料核查</label> </Col>
                        <Col span={9}>
                            <div style={{ width: '95%', height: '100px' }}>
                                共<Input disabled className='dwInput' style={{ width: '40px' }} />项,经查符合要求<Input className='dwInput' style={{ width: '40px' }} />项，
                            经核定符合规范要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                        </div>
                        </Col>
                        <Col span={9}>
                            <Input
                                onChange={this.changeText.bind(this, 1)}
                                style={{ width: '95%' }}
                                type='textarea'
                                placeholder="监理方备注，比如“合格、符合要求”"
                                rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={3}><label>安全和主要使用功能核查及抽查结果</label> </Col>
                        <Col span={9}>
                            <div style={{ width: '95%', height: '100px' }}>
                                共核查<Input disabled className='dwInput' style={{ width: '40px' }} />项,符合要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                            共抽查<Input disabled className='dwInput' style={{ width: '40px' }} />项,符合要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                            经返工处理符合要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                        </div>
                        </Col>
                        <Col span={9}>
                            <Input
                                onChange={this.changeText.bind(this, 2)}
                                style={{ width: '95%' }}
                                type='textarea'
                                placeholder="监理方备注，比如“美观整齐”"
                                rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={3}><label>外观质量检验</label> </Col>
                        <Col span={9}>
                            <div style={{ width: '95%', height: '100px' }}>
                                共抽查<Input disabled className='dwInput' style={{ width: '40px' }} />项,符合要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                            不符合要求<Input disabled className='dwInput' style={{ width: '40px' }} />项
                        </div>
                        </Col>
                        <Col span={9}>
                            <Input
                                onChange={this.changeText.bind(this, 3)}
                                style={{ width: '95%' }}
                                type='textarea'
                                placeholder="监理方填写"
                                rows={4}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={3}><label>综合验收结论</label> </Col>
                        <Col span={9}>
                            <Input
                                onChange={this.changeText.bind(this, 4)}
                                style={{ width: '95%' }}
                                type='textarea'
                                placeholder="监理方填写，比如“质量合格”"
                                rows={4}
                            />
                        </Col>
                    </Row>
                </Card>
                <Card style={{ marginBottom: '10px', marginTop: '10px' }}>
                    <h2 style={{ marginBottom: '10px' }}>参加验收单位</h2>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>施工单位:</label></Col>
                        <Col span={7}>
                            <Input disabled className='dwInput2' style={{width:'250px'}} />
                        </Col>
                        <Col span={2}><label>项目经理:</label></Col>
                        <Col span={7}>
                            <Input disabled className='dwInput2' style={{width:'250px'}}/>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>监理单位:</label></Col>
                        <Col span={7}>
                            <Input disabled className='dwInput2' style={{width:'250px'}}/>
                        </Col>
                        <Col span={2}><label>总监理工程师:</label></Col>
                        <Col span={7}>
                            <Input disabled className='dwInput3' style={{width:'250px'}}/>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>勘测单位:</label></Col>
                        <Col span={7}>
                            <Input disabled className='dwInput2' style={{width:'250px'}}/>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Input disabled  className = 'dwInput2' style={{width:'250px'}}/>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>设计单位:</label></Col>
                        <Col span={7}>
                            <Input disabled className = 'dwInput2' style={{width:'250px'}}/>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Input disabled className = 'dwInput2' style={{width:'250px'}}/>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col span={2}><label>规划单位:</label></Col>
                        <Col span={7}>
                            <Input disabled className = 'dwInput2' style={{width:'250px'}}/>
                        </Col>
                        <Col span={2}><label>项目负责人:</label></Col>
                        <Col span={7}>
                            <Input disabled className = 'dwInput2' style={{width:'250px'}}/>
                        </Col>
                    </Row>
                    <ImgShow style={{marginLeft:'10px'}} img={this.state.img}/>
                    <WorkflowHistory wk={this.state.wf}/>
                </Card>
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
                <div>
                    <div style={{ width: '300px', margin: '0 auto' }}>
                        <Button type="primary" onClick={() => {this.setState({uploadVisivle:true})}}>查看附件</Button>
                        <Button onClick={this.reject} type='danger' style={{ margin: '15px' }}>不予通过</Button>
                        <Button onClick = {this.onSubmit.bind(this)} type='primary'>通过</Button>
                    </div>
                </div>
            </div>
        );
    }
    //不予通过
    reject = () => {
        const {updateWpData,deleteWorkflow} = this.props.cellActions;
        const {danwei_data,wf} = this.state
        let data = {};
        let data_list = [];
        let extra = {};
        extra['check_status'] = 0;
        extra['img'] = '';
        let temp = {
            pk:danwei_data.pk,
            extra_params:extra,
        }
        data_list.push(temp);
        data['data_list'] = data_list;
        updateWpData({},data).then(rst => {
            console.log(rst);
            deleteWorkflow({pk:wf.id}).then(rst => {
                message.info('操作成功，请重新发起验收')
                window.history.back();
            })
        })


    }
}