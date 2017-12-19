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
import {JYPShenPi} from '../components/JYPShenPi';
import WorkflowHistory from '../components/WorkflowHistory';
import {STATIC_DOWNLOAD_API,USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,DOWNLOAD_FILE,PDF_FILE_API} from '_platform/api';
import {getUser} from '_platform/auth'
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
        actions: bindActionCreators({ ...previewActions,...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)

export default class TianBaoJL extends Component {
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
            wk_shenpi:null
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
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.tianbao.bind(this,record)}>
                        审批
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
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)}>
                        查看
                        </Button>
                    );
                }
            },
        ];
    }
    show(jianyanpi,p2){
        const {getWorkflow} = this.props.cellActions;
        let pk = jianyanpi.extra_params.workflowid || jianyanpi.extra_params.workflow_id || jianyanpi.extra_params.workflow || jianyanpi.extra_params.wfid;
        getWorkflow({pk:pk}).then((wk) => {
            this.setState({show:true,showTarget:jianyanpi,wk:wk});
        })
    }
    tianbao(jianyanpi,p2){
        const {getWorkflow} = this.props.cellActions;
        let pk = jianyanpi.extra_params.workflowid || jianyanpi.extra_params.workflow_id || jianyanpi.extra_params.workflow || jianyanpi.extra_params.wfid;
        getWorkflow({pk:pk}).then((wk) => {
            this.setState({tianbaojianyanpi:jianyanpi,tianbaoing:true,wk_shenpi:wk});
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
        // console.log(fenbu);
        let fenxiangs = [];
        let zifenbus = [];
        this.setState({loading:true});
        let { getUnitTreeByPk } = this.props.cellActions;
        getUnitTreeByPk({ pk: fenbu }).then(rst => {
            console.log(rst);
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
            console.log(rst);
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
                if(ele.extra_params.check_status === 1 ||ele.extra_params.check_status ===  2){
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
        getUnitTreeByPk({ pk: pk }).then(rst => {
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
            this.setState({ fenbus: fenbus, fenxiangs: [], zifenbus: [] });
            this.setState({loading:false});
            console.log('fenbus', fenbus);
        });
    }
    radioChange(e){
        this.setState({jianyanpiType:e.target.value});
    }
    async setData(data){
        let jianyanpi = this.state.tianbaojianyanpi;
        let {postDOC,logWorkflowEvent,getWorkflow,putJianYanPi} = this.props.cellActions;
        let nowWfId;
        let next_state_id; 
        let subject;
        let executor;
        await getWorkflow({pk:jianyanpi.extra_params.workflowid}).then(rst =>{
            subject = rst.subject;
            let current = rst.current.find(ele=>{
                return ele.code ==='STATE05';
            });
            executor = current.participants[0].executor;
            nowWfId = current.id;
        });
        let userData = getUser();
        const logevent_data = {
            state: nowWfId,
            executor:executor,
            action: '通过',     // 必须是state.action中的一项
            note: '通过',
            attachment: null // 附件，空填null
        };
        await logWorkflowEvent({pk:jianyanpi.extra_params.workflowid},logevent_data);
        await putJianYanPi({ pk: jianyanpi.pk }, {
            "qc_counts":{
				"checked":1,
				"fine": 1,
				"is_leaf": true,
				"nonchecked": 0
			},
            "extra_params": {
                jianliComment:data.jianliComment||'未填写',
                check_time:moment(Date.now()).format('L'),
                check_status:2,
                subject:JSON.stringify(subject)
            },
            "version": jianyanpi.version,
        }).then(rst => {
            let docCode = ''+Date.now(); 
            let docData = {
                "basic_params": {
                    "files": jianyanpi.extra_params.file||[],
                },
                "status": "A",
                "version": "A",
                "name": jianyanpi.name  + '附件',
                "obj_type": "C_DOC",
                'code':jianyanpi.code + docCode.substring(docCode.length-5),
                "workpackages":[{pk:jianyanpi.pk,code:jianyanpi.code,obj_type:jianyanpi.obj_type}]
            }
            postDOC({},docData).then(rst=>{
                if(rst.obj_type){
                    message.success('归档成功');
                }
            });
            this.setState({ loading: false,tianbaoing:false});
            this.selectFenxiang(this.state.targetFenxiang.pk);
        });

        
    }
    tianbaoCancel(){
        this.setState({tianbaoing:false});
    }
    render() {
        const { table: { editing = false } = {} } = this.props;
       //this.state.jianyanpis
       //this.columns
        console.log('jianyanpis',this.state.jianyanpis)
        let ds=[];
        let columns =[];
        if(this.state.jianyanpiType==='a'){
            columns = this.columnsa;
            this.state.jianyanpis.forEach(ele=>{
                if(ele.extra_params.check_status === 1&& ele.extra_params.toJianLi===1){
                    ele.tianbaoStatus = getStatus('1');
                    ele.percent =Math.floor(ele.extra_params.qualified_rate*100)+'%';
                    ds.push(ele);
                }
            });
        }else{
            this.state.jianyanpis.forEach(ele=>{
                columns = this.columnsb;
                if(ele.extra_params.check_status === 2){
                    if(ele.extra_params.check_time){
                        ele.tianbaoTime = ele.extra_params.check_time;
                    }else{
                        ele.tianbaoTime = '未定义'
                    }
                    ele.tianbaoStatus = getStatus('2');
                    ele.percent =Math.floor(ele.extra_params.qualified_rate*100)+'%';
                    ds.push(ele);
                }
            });
        }
        console.log('tbjyp',this.state.tianbaojianyanpi);
        return (
            <Main>
                <DynamicTitle title="检验批填报" {...this.props} />
                <Sidebar>
                    <QualityTree
                        nodeClkCallback={this.treeNodeClk.bind(this)}
                        actions={this.props.cellActions} />
                </Sidebar>
                <Content>
                    <Spin spinning={this.state.loading}>
                        <div>
                            {this.state.tianbaoing&&<JYPShenPi {...this.state}
                                postFile={this.props.actions.uploadStaticFile}
                                getAllUsers={this.props.cellActions.getAllUsers}
                                setData={this.setData.bind(this)}
                                cancel={this.tianbaoCancel.bind(this)}
                                wk={this.state.wk_shenpi}
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
                                <RadioButton value="a">未审批</RadioButton>
                                <RadioButton value="b">已审批</RadioButton>
                            </RadioGroup>
                        </div>
                        <div style={{ width: '600px' }}>
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
                    onCancel = {()=>{this.setState({show:false})}}
                    onOk = {()=>{this.setState({show:false})}}
                    visible= {this.state.show}>
                       <div>
                       <Input  addonBefore = '合格数' value = {this.state.showTarget.extra_params.qualified_count} style = {InputStyle}/>
                       <Input  addonBefore = '检验数' value = {this.state.showTarget.extra_params.total_count} style = {InputStyle}/>
                       <Input  addonBefore = '合格率' value = {Math.floor(this.state.showTarget.extra_params.qualified_rate*100)+'%'} style = {InputStyle}/>
                       <Input addonBefore='备注' value={this.state.showTarget.extra_params.remark} style={InputStyle} />
                        {
                            this.state.showTarget.extra_params.img &&
                                <div style={{marginBottom:'10px'}}>
                                    <Carousel autoplay>
                                        {
                                            this.state.showTarget.extra_params.img.map(x => (
                                                <div className="picDiv">
                                                    <img className="picImg" src={`${STATIC_DOWNLOAD_API}${x}`} alt=""/>
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
                       
                       {/*
                       <Button style={{margin:'10px'}} onClick={
                                                    () => {
                                                        let file = item; 
                                                        file.a_file = PDF_FILE_API + file.a_file;
                                                        let { openPreview } = this.props.actions;
                                                        let fname = file.name;
                                                        if(/.+?\.pdf/.test(fname) || /.+?\.docx/.test(fname) || /.+?\.doc/.test(fname)){
                                                            openPreview(file);
                                                        }else{
                                                            message.warning('该类型文件不支持预览，请下载查看');
                                                        }
                                                    }
                                                }
                                           >{'预览'}</Button>

                       this.state.showTarget.extra_params.file.a_file&&
                        <Button
                            onClick={
                                () => {
                                    let file = {...this.state.showTarget.extra_params.file}; 
                                    file.a_file = PDF_FILE_API + file.a_file;
                                    let { openPreview } = this.props.actions;
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
    }
    return '审核中';
}

const InputStyle = {
    width:'180px',
    margin:'10px'
}