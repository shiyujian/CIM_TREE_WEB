import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Carousel} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import './common.less'
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {JYPTianBao2} from '../components/JYPTianBao';
import {JYPTianBao3} from '../components/JYPTianBao3';
import WorkflowHistory from '../components/WorkflowHistory';
import {STATIC_DOWNLOAD_API,USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,DOWNLOAD_FILE,PDF_FILE_API} from '_platform/api';
import {getUser} from '_platform/auth'
import moment from 'moment'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class TianBao extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            fenbus: [],
            zifenbus: [],
            fenxiangs: [],
            jianyanpis: [],
            targetFenxiang: null,
            loading:false,
            tianbaoing:false,
            buchonging:false,
            tianbaojianyanpi:{
                extra_params:{
                    qualified_count:'0',
                    total_count:'0',
                    qualified_rate:'0',
                    file:''
                }
            },
            fileUpLoadAddress:UPLOADFILE_API,
            jianyanpiType:'a',
            show:false,
            showTarget: {
                extra_params: {
                    qualified_count: '0',
                    total_count: '0',
                    qualified_rate: '0',
                    file: ''
                }
            },
            wk:null,
            wk_buchong:null
        };
        this.columnsa = [
            {
                title: '检验批名称',
                dataIndex: 'name',
            }, {
                title: '创建时间',
                dataIndex: 'time',
            }
            , {
                title: '状态',
                dataIndex: 'tianbaoStatus',
            }           
             , {
                title: '合格率',
                dataIndex: 'percent',
            }, {
                title: '操作',
                render:(text,record,index)=>{
                    return(
                        <Button onClick = {this.buchong.bind(this,record)}>
                        填报
                        </Button>
                    );
                }
            },
        ];
        this.columnsb = [
            {
                title: '检验批名称',
                dataIndex: 'name',
            }, {
                title: '创建时间',
                dataIndex: 'time',
            },{
                title: '填报时间',
                dataIndex: 'tianbaoTime',
            } , {
                title: '合格率',
                dataIndex: 'percent',
            }
            , {
                title: '状态',
                dataIndex: 'tianbaoStatus',
            }, {
                title: '操作',
                render:(text,record,index)=>{
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        查看
                        </Button>
                    );
                }
            },
        ];
        this.columnsc = [
            {
                title: '检验批名称',
                dataIndex: 'name',
            }, {
                title: '创建时间',
                dataIndex: 'time',
            }
            , {
                title: '状态',
                dataIndex: 'tianbaoStatus',
            }, {
                title: '操作',
                render:(text,record,index)=>{
                    return(
                        <Button onClick = {this.tianbao.bind(this,record)}>
                        填报
                        </Button>
                    );
                }
            },
        ];
    }
    componentDidMount(){
        let userData = getUser();
        this.setState({userData});
        // let fun = function(){
        //     console.log('hello')
        // };
        // fun.toString = ()=>{
        //     return 'asasdasd';
        // }
        // let xx= {
        //     [fun]:'sxasd'
        // };
        // console.log('sxq',xx);
    }
    show(jianyanpi,p2){
        const {getWorkflow} = this.props.cellActions;
        let pk = jianyanpi.extra_params.workflowid || jianyanpi.extra_params.workflow_id || jianyanpi.extra_params.workflow || jianyanpi.extra_params.wfid;
        getWorkflow({pk:pk}).then((wk) => {
            this.setState({show:true,showTarget:jianyanpi,wk:wk});
        })
    }
async  tianbao(jianyanpi,p2){
        let {putJianYanPi} = this.props.cellActions;
        jianyanpi = await putJianYanPi({ pk: jianyanpi.pk }, {
            "extra_params": {
                XiangMu:this.state.targetXiangmu.name,
                DanWei:this.state.targetDanwei.name,
                FenBu:this.state.targetFenbu.name,
                FenXiang:this.state.targetFenxiang.name
            },
            "version": jianyanpi.version,
        });
        this.setState({tianbaojianyanpi:jianyanpi,tianbaoing:true});
    }
    async  buchong(jianyanpi,p2){
        let {putJianYanPi,getWorkflow} = this.props.cellActions;
        jianyanpi = await putJianYanPi({ pk: jianyanpi.pk }, {
            "extra_params": {
                XiangMu:this.state.targetXiangmu.name,
                DanWei:this.state.targetDanwei.name,
                FenBu:this.state.targetFenbu.name,
                FenXiang:this.state.targetFenxiang.name
            },
            "version": jianyanpi.version,
        });
        let pk = jianyanpi.extra_params.workflowid || jianyanpi.extra_params.workflow_id || jianyanpi.extra_params.workflow || jianyanpi.extra_params.wfid;
        getWorkflow({pk:pk}).then((wk) => {
            this.setState({tianbaojianyanpi:jianyanpi,buchonging:true,wk_buchong:wk});
        })
    }
    getOptions(datas) {
        let arr = [];
        datas.forEach(ele => {
            arr.push(<Option value={ele.pk}>{ele.name}</Option>);
        });
        return arr;
    }
    selectFenbu(fenbu) {
        let fenxiangs = [];
        let zifenbus = [];
        this.setState({loading:true});
        let { getUnitTreeByPk } = this.props.cellActions;
        getUnitTreeByPk({ pk: fenbu }).then(rst => {
            this.setState({targetFenbu:rst});
            if (rst.children.length > 0) {
                if (rst.children[0].obj_type === 'C_WP_PTR_S') {
                    zifenbus = rst.children;
                } else {
                    fenxiangs = rst.children;
                }
            }
            this.setState({ fenxiangs: fenxiangs, zifenbus: zifenbus });
            this.setState({loading:false});
        });
    }
    selectZifenbu(zifenbu) {
        let { getUnitTreeByPk } = this.props.cellActions;
        this.setState({loading:true});
        let fenxiangs = [];
        getUnitTreeByPk({ pk: zifenbu }).then(rst => {
            if (rst.children.length > 0) {
                this.setState({ fenxiangs: rst.children });
            }
            this.setState({loading:false});
        });
    }
    selectFenxiang(fenxiang) {
        let { getUnitTreeByPk } = this.props.cellActions;
        this.setState({loading:true});
        getUnitTreeByPk({ pk: fenxiang }).then(rst => {
            this.setState({ targetFenxiang: rst });
            let ret = rst.children;
            ret.forEach((ele) => {
                delete ele.children;
                if (ele.extra_params.time) {
                    ele.time = ele.extra_params.time;
                }
                if (ele.extra_params.tianbaoStatus) {
                    ele.tianbaoStatus =getStatus(ele.extra_params.tianbaoStatus);
                }else{
                    ele.tianbaoStatus = getStatus('N');
                }
            });
            let jianyanpis =[];
            rst.children.map(ele=>{
                if(!ele.extra_params.check_status){
                    ele.extra_params.check_status = 0;
                }
                if(ele.extra_params.check_status === 0 || ele.extra_params.check_status === 1 ||ele.extra_params.check_status ===  2){
                    jianyanpis.push(ele);
                }
            });
            console.log('jyps',jianyanpis);
            this.setState({ jianyanpis: jianyanpis});
            this.setState({loading:false});
        })
    }
    treeNodeClk(code) {
        let [pk, type,] = code[0].split('--');
        this.setState({loading:true});
        let { getUnitTreeByPk } = this.props.cellActions;
        getUnitTreeByPk({ pk: pk }).then(async rst => {
            let fenbus = [];
            rst.children.map(item => {
				if(item.obj_type === "C_WP_UNT_S"){
					fenbus = fenbus.concat(item.children)
				}else{
					if(item.obj_type === "C_WP_PTR"){
						fenbus.push(item);
					}
				}
			})
            let { getUnitTreeReverseByPk } = this.props.cellActions;
            getUnitTreeReverseByPk({ pk: pk }).then(rst=>{
                console.log('xiangmu',rst.children[0]);
                this.setState({targetXiangmu:rst.children[0]});
            });
            this.setState({targetDanwei:rst, fenbus: fenbus, fenxiangs: [], zifenbus: [] });
            this.setState({loading:false});
        });
    }
    radioChange(e){
        this.setState({jianyanpiType:e.target.value});
    }
    async setData2(data){
        this.setState({tianbaoing:false});    
        data.fileList.forEach(file=>{
            file.a_file = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            file.download_url = file.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        });
        let img = [];
        data.imgList.map(file=>{
            img.push(file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''));
            //file.download_url = file.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            }     
        );
        let jianli = JSON.parse(data.jianli);
        console.log(data);
        let { createWorkflow,logWorkflowEvent,putJianYanPi} = this.props.cellActions;  
        let postdata = {
            "name": this.state.tianbaojianyanpi.name+"-验收",
            "description":this.state.tianbaojianyanpi.name+"-验收",
            "subject": [
                {
                    "project": JSON.stringify({ "pk":this.state.targetXiangmu.pk, "name": this.state.targetXiangmu.name, "code": this.state.targetXiangmu.code}),
                    "unit": JSON.stringify({ "pk": this.state.targetDanwei.pk, "name": this.state.targetDanwei.name, "code":this.state.targetDanwei.code}),
                    "workpackage": JSON.stringify({ "pk": this.state.tianbaojianyanpi.pk, "name": this.state.tianbaojianyanpi.name, "code": this.state.tianbaojianyanpi.code })
                }
            ],
            "code": "TEMPLATE_023",
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
        let workflowid;
        let jianliEx = {
            "id": jianli.id,
            "username":jianli.username,
            person_name: jianli.account.person_name,
            person_code: jianli.account.person_code,
        }
        let creator = {
            "id": getUser().id,
            "username": getUser().username,
            person_name: getUser().name,
            person_code: getUser().code,
        }
        let step_order = [
            {
                from:'START',
                to:"STATE02",
                executor:creator,
                participants:[jianliEx],
                action:'提交'
            },
            {
                from:'STATE02',
                to:"END",
                executor:jianliEx,
                action:'通过',
                participants:[],
            },
            {
                from:'START',
                to:"STATE04",
                executor:creator,
                participants:[creator],
                action:'提交'
            },            {
                from:'STATE04',
                to:"STATE05",
                executor:creator,
                participants:[jianliEx],
                action:'提交'
            },

        ]
        createWorkflow({},postdata).then( async rst =>{
            if (!rst.id) {
                message.error('流程发起失败')
                return;
            }
            workflowid = rst.id;
            // console.log('wfRst', rst);
            let steps = {} 
            rst.workflow.states.forEach(ele=>{
                steps[ele.code] = ele;
            });
            // console.log('steps',steps);
            let logeventRst;
            let logevent_data = {
                next_states: [
                    {
                        state: steps[step_order[0].to].id,
                        participants: step_order[0].participants,
                        deadline: null,
                        remark: null
                    },
                    {
                        state: steps[step_order[2].to].id,
                        participants: step_order[2].participants,
                        deadline: null,
                        remark: null
                    }
                ],
                state: steps[step_order[0].from].id,
                executor: step_order[0].executor,
                action: step_order[0].action,     // 必须是state.action中的一项
                note: 'cnm不存在移动端',
                attachment: null
            }
            await logWorkflowEvent({ pk: workflowid }, logevent_data);
            let logevent_data2 = {
                next_states: [
                    {
                        state: steps[step_order[1].to].id,
                        participants: step_order[1].participants,
                        deadline: null,
                        remark: null
                    }
                ],
                state: steps[step_order[1].from].id,
                executor: step_order[1].executor,
                action: step_order[1].action,     // 必须是state.action中的一项
                note: 'cnm不存在移动端',
                attachment: null
            }
            await logWorkflowEvent({ pk: workflowid }, logevent_data2);
            let logevent_data3 = {
                next_states: [
                    {
                        state: steps[step_order[3].to].id,
                        participants: step_order[3].participants,
                        deadline: null,
                        remark: null
                    }
                ],
                state: steps[step_order[3].from].id,
                executor: step_order[3].executor,
                action: step_order[3].action,     // 必须是state.action中的一项
                note: step_order[3].action,
                attachment: null
            }
            logeventRst = await logWorkflowEvent({ pk: workflowid }, logevent_data3);
            // console.log('final ',logeventRst);
            let putdata = {
                "extra_params": {
                    "check_status": 1,
                    workflowid:workflowid,
                    JianLiID:jianli.id,
                    toJianLi:1,
                    tianbaoTime:moment(Date.now()).format('L'),
                    total_count:data.totalCounts,
                    qualified_count:data.qualifiedCounts,
                    qualified_rate:+data.qualifiedCounts/(data.totalCounts),
                    img:img,
                    file:data.fileList,
                    qualifier:getUser().id,
                    remark:data.remark,
                    jianliCompany:data.jianliCompany,
                    location:data.location? JSON.parse(data.location).name:'',
                    locationId:data.location?JSON.parse(data.location).pk:''
                },
                "version": "A",
            }
            putJianYanPi({pk:this.state.tianbaojianyanpi.pk},putdata).then(rst =>{
                console.log(rst);
                this.selectFenxiang(this.state.targetFenxiang.pk);
            });

        })
    }
    async setData(data){
        this.setState({buchonging:false});        
        data.fileList.forEach(file=>{
            file.a_file = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            file.download_url = file.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        });
        let img = [];
        data.imgList.map(file=>{
            img.push(file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''));
            //file.download_url = file.download_url.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
            }     
        );
        let jianyanpi = this.state.tianbaojianyanpi;
        let {logWorkflowEvent,getWorkflow,putJianYanPi} = this.props.cellActions;
        let nowWfId;
        let next_state_id; 
        let executor;
        await getWorkflow({pk:jianyanpi.extra_params.workflowid}).then(rst =>{
            let current  = rst.current.find(ele=>{
                return ele.code ==='STATE04';
            });
            nowWfId = current.id;
            executor = current.participants[0].executor;
            next_state_id = rst.workflow.transitions.find(ele=>{
                return ele.from_state === nowWfId;
            }).to_state;
        });
        let userData = getUser();
        let jianli = data.jianli;
        if(!jianli){message.error('未选择监理人');return;}
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
            state: nowWfId,
            executor:executor,
            action: '提交',     // 必须是state.action中的一项
            note: '提交',
            attachment: null // 附件，空填null
        }
        let logevent_rst = await logWorkflowEvent({pk:jianyanpi.extra_params.workflowid},logevent_data);
        if(!logevent_rst.status){
            message.error('流程错误');
            return;
        }
        /*let fileList = myFile.map(item => {
            return {
                    a_file:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    name:item.name,
                    download_url:item.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, ''),
                    misc:item.misc,
                    mime_type:item.mime_type   
                }
        }) */
        let date = new Date();
        let datestr = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`;
        await putJianYanPi({ pk: jianyanpi.pk }, {
            "extra_params": {
                tianbaoTime:datestr,
                JianLiID:jianli.id,
                toJianLi:1,
                file: data.fileList,
                img:img,
                qualifier:getUser().id,
                jianliCompany:data.jianliCompany,
                location:data.location? JSON.parse(data.location).name:'',
                locationId:data.location?JSON.parse(data.location).pk:''
            },
            "version": jianyanpi.version,
        }).then(rst => {
            this.setState({ loading: false });
            this.selectFenxiang(this.state.targetFenxiang.pk);
        });
    }
    tianbaoCancel(){
        this.setState({tianbaoing:false,buchonging:false});
    }
    render() {
        const { table: { editing = false } = {} } = this.props;
       //this.state.jianyanpis
       //this.columns
        let ds=[];
        let columns =[];

        if(this.state.jianyanpiType==='b'){
            columns = this.columnsa;
            this.state.jianyanpis.forEach(ele=>{
                if(ele.extra_params.check_status === 1&&!(ele.extra_params.toJianLi === 1)){
                    ele.tianbaoStatus = getStatus('1');
                    ele.percent =Math.floor(ele.extra_params.qualified_rate*100)+'%';
                    ds.push(ele);
                }
            });
        }else if(this.state.jianyanpiType === 'c'){
            this.state.jianyanpis.forEach(ele=>{
                columns = this.columnsb;
                if(ele.extra_params.check_status === 2){
                    ele.tianbaoStatus = getStatus('2');
                    if(ele.extra_params.check_time){
                        ele.tianbaoTime = ele.extra_params.check_time;
                    }else{
                        ele.tianbaoTime = '未定义'
                    }
                    ele.percent =Math.floor(ele.extra_params.qualified_rate*100)+'%';
                    ds.push(ele);
                }
            });
        }else if(this.state.jianyanpiType === 'a'){
            columns = this.columnsc;
            this.state.jianyanpis.forEach(ele=>{
                if(!ele.extra_params.check_status||ele.extra_params.check_status === 0){
                    ele.tianbaoStatus = getStatus('0');
                    ele.percent =Math.floor(ele.extra_params.qualified_rate*100)+'%';
                    ds.push(ele);
                }
            });
        }
        console.log('datasource',ds)
        return (
            <Main>
                <DynamicTitle title={"检验批填报"} {...this.props} />
                <Sidebar>
                    <QualityTree
                        nodeClkCallback={this.treeNodeClk.bind(this)}
                        actions={this.props.cellActions} />
                </Sidebar>
                <Content>
                    <Spin spinning={this.state.loading}>
                        <div>
                            {
                                this.state.tianbaoing&&<JYPTianBao2 {...this.state}
                                postFile={this.props.actions.uploadStaticFile}
                                getAllUsers={this.props.cellActions.getAllUsers}
                                setData={this.setData2.bind(this)}
                                cancel={this.tianbaoCancel.bind(this)}
                                />
                            }
                            {
                                this.state.buchonging&&<JYPTianBao3 {...this.state}
                                postFile={this.props.actions.uploadStaticFile}
                                getAllUsers={this.props.cellActions.getAllUsers}
                                setData={this.setData.bind(this)}
                                cancel={this.tianbaoCancel.bind(this)}
                                wk={this.state.wk_buchong}
                                />
                            }
                            <Select
                                onSelect={this.selectFenbu.bind(this)}
                                className='mySelect' placeholder='分部'>
                                {this.getOptions(this.state.fenbus)}
                            </Select>
                            <Select
                                onSelect={this.selectZifenbu.bind(this)}
                                className='mySelect' placeholder='子分部'>
                                {this.getOptions(this.state.zifenbus)}
                            </Select>
                            <Select
                                onSelect={this.selectFenxiang.bind(this)}
                                className='mySelect' placeholder='分项'>
                                {this.getOptions(this.state.fenxiangs)}
                            </Select>
                            <RadioGroup 
                             onChange = {this.radioChange.bind(this)}
                             defaultValue="a">
                                <RadioButton value="a">web端发起</RadioButton>
                               <RadioButton value="b">web端补充</RadioButton>
                                <RadioButton value="c">已填报</RadioButton>
                            </RadioGroup>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Table
                                className='huafenTable'
                                dataSource={ds}
                                columns={columns}
                            />
                        </div>
                    </Spin>
                    <Modal 
                    width={880}
                    okText='确定'
                    onCancel = {()=>{this.setState({show:false,wk:null})}}
                    onOk = {()=>{this.setState({show:false,wk:null})}}
                    visible= {this.state.show}>
                        <div >
                            <Input addonBefore='合格数' value={this.state.showTarget.extra_params.qualified_count} style={InputStyle} />
                            <Input addonBefore='检验数' value={this.state.showTarget.extra_params.total_count} style={InputStyle} />
                            <Input addonBefore='合格率' value={Math.floor(this.state.showTarget.extra_params.qualified_rate * 100) + '%'} style={InputStyle} />
                            <Input addonBefore='备注' value={this.state.showTarget.extra_params.remark} style={InputStyle} />
                            {
                                this.state.showTarget.extra_params.img &&
                                <div style={{ marginBottom: '10px' }}>
                                    <Carousel autoplay>
                                        {
                                            this.state.showTarget.extra_params.img.map(x => (
                                                <div className="picDiv">
                                                    <img className="picImg" src={`${STATIC_DOWNLOAD_API}${x}`} alt="" />
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                            }
                            {this.state.showTarget.extra_params.file&&
                             this.state.showTarget.extra_params.file.map((item,index) => {
                                return (<div><a href={DOWNLOAD_FILE + item.download_url}>{item.name}</a>
                                            
                                        </div>)
                            })
                        }
                            <WorkflowHistory wk={this.state.wk}/>
                        </div>
                       {/*this.state.showTarget.extra_params.file.a_file&&<a href = {DOWNLOAD_FILE+ this.state.showTarget.extra_params.file.download_url}
                       style = {{margin:'10px'}}
                       >{'相关文件下载'}</a>*/}
                       {/*this.state.showTarget.extra_params.file.a_file&&
                        <Button
                            onClick={
                                () => {
                                    let file = {...this.state.showTarget.extra_params.file};
                                    let {openPreview} = this.props.actions;
                                    file.a_file =PDF_FILE_API+ file.a_file;
                                    let fname = file.name;
                                    if(/.+?\.pdf/.test(fname) || /.+?\.docx/.test(fname) || /.+?\.doc/.test(fname)){
                                        openPreview(file);
                                    }else{
                                        message.warning('该类型文件不支持预览，请下载查看');
                                    }
                                }
                            }
                       >{'预览'}</Button>*/}
                       <Preview/>
                   </Modal>
                </Content>
            </Main>
        );
    }

}

function getStatus(char){
    switch(char){
        case '1':
        return '审核中';
        case '2':
        return '已审核';
        default:
        return '未审核';
    }
}
const InputStyle = {
    width:'180px',
    margin:'10px'
}