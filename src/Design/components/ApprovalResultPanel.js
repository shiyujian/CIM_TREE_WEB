/**
 * Created by tinybear on 17/8/21.
 */
import React,{Component} from 'react';
import {Row,Col,Table,Tree,Select,Modal,Radio,Input,Button,message,Popover} from 'antd';
import {getUser} from '_platform/auth';
import moment from 'moment';
import {DOWNLOAD_FILE, WORKFLOW_CODE} from '_platform/api';
import {designStageEnum} from './enum';
const {TreeNode} = Tree;
const {Option} = Select;
const RadioGroup = Radio.Group;

class ApprovalResultPanel extends Component{

    state = {
        workingProjects : [],
        workingUnitProjects : [],
        wks:[],//当前用户在执行的流程
        data : [],
        designStage:'',
        approvalVisible:false,
        isPass:true,
        selectedIndex:null,
        selectedDrawing:null,
        advice:''
    };

    stageMap = {};

    componentDidMount(){
        let me  = this;
        const {getProjectTree} = this.props.actions;

        const {getPlanWKByUser} = this.props.actions;
        let workingProjects = [],workingUnitProjects=[],plansCodes=[];
        let usr = getUser();

        Promise.all([getProjectTree({},{depth:3}),
            getPlanWKByUser({username:usr.username,template:WORKFLOW_CODE.设计成果上报流程})])
            .then((data)=>{
                let wks = data[1];

                wks = wks.filter(d=>{
                    let {subject} = d;
                    let sb = subject[0];
                    return sb.checker == usr.id;
                });

                wks.forEach(d=>{
                    let {subject} = d;
                    let sb = subject[0];
                    sb.project = JSON.parse(subject[0].project);
                    sb.unit = JSON.parse(subject[0].unit);
                    sb.plans = JSON.parse(subject[0].plans);
                    sb.planitem = JSON.parse(subject[0].planitem);
                    if(!plansCodes.find(p=>p.code == sb.plans[0].code)) {
                        plansCodes.push(sb.plans[0]);
                        workingProjects.push(sb.project);
                        workingUnitProjects.push(sb.unit);

                        //计算设计阶段
                        let stages = me.stageMap[sb.unit.code]||[];
                        stages.push(sb.stage);
                        me.stageMap[sb.unit.code] = stages;
                    }
                });
                const {
                    platform:{wp:{projectTree=[]}={}}
                } = me.props;
                me.filterProjectTree(projectTree,workingProjects,
                    workingUnitProjects);
                me.setState({projectTree,wks});
            });
    }

    genDownload = (text)=>{
        return (<div>
            {text.CAD?
                <p><a href={DOWNLOAD_FILE+text.CAD.download_url}>{text.CAD.name}</a></p>:''}
            {text.PDF?
                <p><a href={DOWNLOAD_FILE+text.PDF.download_url}>{text.PDF.name}</a></p>:''}
            {text.BIM?
                <p><a href={DOWNLOAD_FILE+text.BIM.download_url}>{text.BIM.name}</a></p>:''}
        </div>)
    };

    columns = [
        {title:'序号',dataIndex:'xuhao',key:'xuhao'},
        {title:'图纸卷册编号',dataIndex:'juance',key:'juance'},
        {title:'图纸卷册名称',dataIndex:'name',key:'name'},
        {title:'设计模型名称',dataIndex:'modelName',key:'modelName'},
        {title:'专业',dataIndex:'profession',key:'profession'},
        {title:'当前版本',dataIndex:'version',key:'version'},
        {title:'项目负责人',dataIndex:'projectPrincipal',key:'projectPrincipal'},
        {title:'专业负责人',dataIndex:'professionPrincipal',key:'professionPrincipal'},
        {title:'计划交付时间',dataIndex:'deliverTime',key:'deliverTime'},
        {title:'实际交付时间',dataIndex:'actualDeliverTime',key:'actualDeliverTime'},
        {title:'计划审查时间',dataIndex:'approvalTime',key:'approvalTime'},
        {title:'实际审查时间',dataIndex:'actualApprovalTime',key:'actualApprovalTime'},
        {title:'当前状态',dataIndex:'status',key:'status',render:(text,record)=>{
            return (<span>{this.getState(text)}</span>)
        }},
        {title:'归档时间',dataIndex:'archivingTime',key:'archivingTime'},
        {title:'审批',dataIndex:'reportResult',key:'reportResult',
            render:(text,record,index)=>(
                <span><a href="javascript:;"
                         disabled={record.status == 2?'disabled':''}
                         onClick={()=>{this.showApprovalBox(index)}}
                >点击审查</a></span>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) =>{
                return (<span>
                    <Popover content={this.genDownload(text)}
                             placement="left">
                       <a href="javascript:;">下载</a>
                    </Popover>
                    <span className="ant-divider" />
                    <a href="javascript:;" className="ant-dropdown-link"
                       onClick={()=>{
                        text.PDF&&this.previewFile(text.PDF)
                    }}>
                        预览
                    </a>
                </span>)
            }
        }
    ];

    showApprovalBox=(index)=>{
        this.setState({
            approvalVisible:true,
            selectedDrawing:this.state.data[index],selectedIndex:index});
    };

    previewFile(file){
        const {openPreview} = this.props.actions;
        openPreview(file);
    }

    selectProject=(keys)=>{
        const {
            projectTree
        } = this.state;
        let key = keys[0];
        let project = null;
        let unitProject = null;
        let isFind = false;
        projectTree.forEach(p1=>{
            if(!isFind){
                project = p1;
                p1.children.forEach(p2=>{
                    if(p2.value === key){
                        isFind = true;
                        unitProject = p2;
                    }
                })
            }
        });
        let me = this;
        if(project && unitProject) {
            let stages = me.stageMap[unitProject.code];
            this.setState({project, unitProject,
                designStage:stages.length?stages[0]:''}, ()=> {
                me.filterWKs();
            });
        }
    };

    //筛选待审批流程
    filterWKs=()=>{
        let me  = this;
        const {getPlan} = this.props.actions;
        const {wks,designStage,unitProject} = this.state;

        let findWKs = [];
        wks.find(w=>{
            let {subject} = w;
            let sb = subject[0];
            if( sb.unit.code === unitProject.code && sb.stage === designStage) {
                findWKs.push(w);
            }
        });

        //挨个获取交付成果
        let data = [];
        findWKs.forEach((v,i)=>{
            let w = v;
            let code = w.subject[0].planitem.id;
            getPlan({code:code}).then(drawing=>{
                if( drawing.extra_params ) {
                    let extra = drawing.extra_params;
                    extra.xuhao = i + 1;
                    extra.key = code;
                    data.push(extra);
                    me.setState({data});
                }
            });
        });
    };

    filterProjectTree(projectTree,workingProjects,
                      workingUnitProjects){
        let me = this;
        let length = projectTree.length;
        for(let i=length-1;i>=0;i--){
            let p = projectTree[i];
            let findP = workingProjects.find(v=> v.code == p.value);
            let findPU = workingUnitProjects.find(v=>v.code == p.value);
            if(!findP && !findPU){
                projectTree.splice(i,1);
            }
            if(p.children && p.children.length){
                me.filterProjectTree(p.children,workingProjects,workingUnitProjects);
            }
        }
    }

    loop(data = []) {
        let me = this;
        return data.map((item) => {
            if (item.children && item.children.length) {

                return (
                    <TreeNode key={`${item.value}`}
                              title={item.label}>
                        {
                            me.loop(item.children)
                        }
                    </TreeNode>
                );
            }
            return <TreeNode key={`${item.value}`}
                             title={item.label}/>;
        });
    };

    //选择设计阶段
    changeDesignStage=(value)=>{
        let me = this;
        this.setState({designStage:value},()=>{
            me.filterWKs();
        });
    };

    options = [
        { label: '无需修改完善,直接归档', value: true },
        { label: '需要修改完善', value: false }
    ];

    submitWorkFlow=()=>{
        let me = this;
        const {putFlow,getWorkflow} = this.props.actions;
        const {advice,isPass,selectedDrawing,data,selectedIndex} = this.state;
        let drawing = selectedDrawing;
        let usr = getUser();
        const executor = {
            "username": usr.username,
            "organization": usr.org,
            "person_code": usr.code,
            "person_name": usr.name,
            "id": parseInt(usr.id)
        };
        getWorkflow({id:selectedDrawing.processId}).then((wk)=>{
            //获取节点id
            const {id, workflow: {states = []} = {}} = wk;
            const [{id: state_id},{id:approvalId}] = states;
            putFlow({pk: id}, {
                "state": approvalId,
                "executor": executor,
                "action": isPass?"通过":"退回",
                "note": advice,
                "attachment": null
            }).then(()=>{
                if(isPass) {
                    //是否需要调用归档接口
                    const {archiveDesign} = this.props.actions;
                    return archiveDesign({pk:drawing.processId}).then(()=>{
                        drawing.status = 2;
                        drawing.archivingTime = moment().format('YYYY-MM-DD');
                        message.success('交付计划审批通过,并已归档');
                        return Promise.resolve();
                    });
                }else{
                    drawing.status = 3;
                    message.success('交付计划审批退回成功');
                    return Promise.resolve();
                }
            })
            .then(()=>{
                //更新上报成果
                const {updatePlan} = this.props.actions;
                drawing.actualApprovalTime = moment().format('YYYY-MM-DD');
                data[selectedIndex] = drawing;
                this.setState({data});
                updatePlan({code:drawing.key},{extra_params:{
                    "status": drawing.status,
                    "processId": drawing.processId,
                    "deliverTime": drawing.deliverTime,
                    "name": drawing.name,
                    "projectPrincipal": drawing.projectPrincipal,
                    "profession": drawing.profession,
                    "professionPrincipal": drawing.professionPrincipal,
                    "modelName": drawing.modelName,
                    "version": drawing.version,
                    "juance": drawing.juance,
                    "approvalTime":drawing.approvalTime,
                    actualDeliverTime:drawing.actualDeliverTime,
                    actualApprovalTime:drawing.actualApprovalTime,
                    archivingTime:drawing.archivingTime,
                    stage:drawing.stage,
                    CAD:drawing.CAD||'',
                    BIM:drawing.BIM||'',
                    PDF:drawing.PDF||'',
                    attachmentFile:drawing.attachmentFile||''
                }})
            })
        });
    };

    //计算状态
    getState(status){
        switch (status){
            case 0:
                return '待提交';
            case 1:
                return '待审查';
            case 2:
                return '已归档';
            case 3:
                return '已审查、待修改';
        }
    }

    render(){
        let {projectTree,data,wks,unitProject} = this.state;
        let me = this;
        let stages = unitProject?me.stageMap[unitProject.code]:[];
        return (<div>
            {
                wks&&wks.length? <Row>
                    <Col span={4} className="project-tree">
                        <Tree className='global-tree-list' showLine
                              onSelect={this.selectProject}>
                            {
                                this.loop(projectTree)
                            }
                        </Tree>
                    </Col>
                    <Col span={20}>
                        <Row style={{margin:'10px 0'}}>
                            <label>设计方案: </label>
                            <Select value={this.state.designStage}
                                    style={{width:'120px'}}
                                    onChange={this.changeDesignStage} >
                                {
                                    stages && stages.map((v)=>{
                                        return <Option value={v} key={v}>{designStageEnum[v]}</Option>
                                    })
                                }
                            </Select>
                        </Row>
                        <Row>
                            <Table columns={this.columns} dataSource={data} pagination={false}></Table>
                        </Row>
                    </Col>
                </Row> :
                    <h3 style={{textAlign:'center',lineHeight:'28px'}}>没有查询到审查任务</h3>
            }
            <Modal
                title={`审查成果-卷册${this.state.selectedDrawing?this.state.selectedDrawing.juance:''}`}
                visible={this.state.approvalVisible}
                onCancel={()=>{this.setState({approvalVisible:false})}}
                footer={false}
            >
                <div>
                    <div >
                        <RadioGroup options={this.options} onChange={(e)=>{
                            this.setState({
                              isPass: e.target.value
                            });
                        }} value={this.state.isPass}/>
                    </div>
                    <div style={{margin:'10px 0 0'}}>
                        <label htmlFor="">审查意见:</label>
                        <Input type="textarea" value={this.state.advice} onChange={(e)=>{
                            this.setState({advice:e.target.value});
                        }}/>
                    </div>
                    <div>发送:</div>
                    <div>抄送:</div>
                    <Row>
                        <Button style={{float:'right'}} onClick={this.submitWorkFlow}>提交</Button>
                    </Row>
                </div>
            </Modal>
        </div>)
    }
}

export  default ApprovalResultPanel;
