import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/safetyMonitor';
import AddFile from '../components/MonitorStation/AddStation';
import EditFile from '../components/MonitorStation/EditStation';
import styles from './RiskEvaluation.css';
import {actions as schemeActions} from '../store/scheme';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {SOURCE_API, STATIC_DOWNLOAD_API,SAFETY_MONITOR} from '_platform/api';
//0 测斜项目  3  一般项目
import moment from 'moment';
import {
    SMUrl_template0,SMUrl_template3
} from '_platform/api';
import {
    Table,
    Row,
    Col,
    Form,
    Modal,
    Button,
    Input,
    Select,
    Popconfirm,
    notification,
    Upload,
    Icon
} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
@connect(
    state => {
        const {platform,safety:{safetyMonitor={}} = {}} = state;
        return {platform,safetyMonitor}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class MonitorStation extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            newKey:Math.random(),
            newKey1:Math.random(),
            project:{},
            unitProject:{},
            construct:{},
            fileObj:{},
            record:{},
            companyName:'',
            infoObj:{},
            typeArray:[],    //监测项目列表
            currentTypeValue:'',   //当前select的value
            isSurvey:false,    //当前选中的是否为测斜项目
            nodeArray:[],       //监测点列表
            setAddVisiable:false,
            setEditVisiable:false,
            depthArray:[]
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getProjectTree,
                getMonitorType,
                getMonitorNodes
            } 
        } = this.props;
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                let project=rst.children;
                let unitProject = {};
                for(var i=0;i<project.length;i++){
                    if(project[i].children.length>0){
                        unitProject=project[i].children[0];
                        this.setState({
                            unitProject:unitProject,
                            project:project[i]
                        });
                        break;
                    }
                }
                getMonitorType({},{unit:unitProject.code}).then((rst)=>{
                    if(rst.results){
                        let typeArray = [];
                        rst.results.map((item)=>{
                            typeArray.push(item);
                        });
                        this.setState({typeArray});
                    }
                });
                getMonitorNodes({},{unit:unitProject.code}).then((rst)=>{
                    if(rst.results){
                        let nodeArray = [];
                        rst.results.map((item)=>{
                            item.id = item._id;
                            item.x = item.coord.x;
                            item.y = item.coord.y;
                            item.z = item.coord.z;
                            item.monitorProject = item.m_type.name;
                            item.project_part = item.project_part===null?'':item.project_part;
                            nodeArray.push(item);
                        });
                        this.setState({nodeArray});
                    }
                });
            }
        });
    }
    
    delete(record,index){
        let datas = this.state.nodeArray;
        const { 
            actions: { 
                deleteMonitorNode
            } 
        } = this.props;
        deleteMonitorNode({pk:record.id}).then((rst)=>{
            debugger
            if(rst===""){
                notification.warning({
                    message: '删除成功！',
                    duration: 2
                });
                datas.splice(index,1);
                this.setState({nodeArray:datas});
            }else{
                notification.warning({
                    message: '删除失败！',
                    duration: 2
                });
                return;
            }
        });
    }
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onDownClick(record,index){
        const {isSurvey,currentTypeValue} = this.state;
        if(currentTypeValue===''){
            notification.warning({
                message: '请选择监测项目！',
                duration: 2
            });
            return;
        }
        let apiGet = '';
        if(isSurvey===false){
            apiGet = SMUrl_template3;
        }else{
            apiGet = SMUrl_template0;
        }
        this.createLink(this,apiGet);
    }

    onAddClick(type){
        if(type==="download"){
            const {isSurvey,currentTypeValue} = this.state;
            if(currentTypeValue===''){
                notification.warning({
                    message: '请选择监测项目！',
                    duration: 2
                });
                return;
            }
            let apiGet = '';
            if(isSurvey===false){
                apiGet = SMUrl_template3;
            }else{
                apiGet = SMUrl_template0;
            }
            this.createLink(this,apiGet);
        }else if(type==="add"){
            const {currentTypeValue} = this.state;
            if(currentTypeValue===''){
                notification.warning({
                    message: '请选择一个监测项目！',
                    duration: 2
                });
                return;
            }
            this.setState({newKey: Math.random(),setAddVisiable:true});
        }
    }

    goCancel(){
        this.setState({setAddVisiable:false,setEditVisiable:false});
    }

    setEditData(){
        const {unitProject,currentTypeValue,record} = this.state;
        const {deepArray=[]} = this.props.safetyMonitor;
        const { 
            actions: { 
                patchMonitorNode,
                getMonitorNodes,
                setDepthArray
            } 
        } = this.props;
        let datas = this.state.dataSet;
        let m_type = currentTypeValue.split("-")[0];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let projectData = {
                    number:values.number,
                    instrument:values.instrument,
                    coord:{
                        x:values.x,
                        y:values.y,
                        z:values.z
                    },
                }
                if(values.project_part){
                    projectData.project_part = values.project_part;
                }
                if(record.depth.length>0){    //get the depth data,and set it into projectData
                    if(deepArray.length===0){
                        notification.info({
                            message: '请添加深度信息！',
                            duration: 2
                        });
                        return;
                    }else{
                        projectData.depth = deepArray;
                        setDepthArray([]);
                    }
                }
                patchMonitorNode({pk:record.id}, projectData).then((rst)=>{
                    if(rst._id){
                        notification.info({
                            message: '修改成功！',
                            duration: 2
                        });
                        getMonitorNodes({},{unit:unitProject.code}).then((rst)=>{
                            if(rst.results){
                                let nodeArray = [];
                                rst.results.map((item)=>{
                                    item.id = item._id;
                                    item.x = item.coord.x;
                                    item.y = item.coord.y;
                                    item.z = item.coord.z;
                                    item.monitorProject = item.m_type.name;
                                    item.project_part = item.project_part===null?'':item.project_part;
                                    nodeArray.push(item);
                                });
                                this.setState({nodeArray});
                            }
                        });
                    }else{
                        notification.warning({
                            message: '修改失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({setEditVisiable:false,dataSet:datas});
            }
        }); 
    }

    setAddData(){
        const {unitProject,isSurvey,currentTypeValue} = this.state;
        const {deepArray=[]} = this.props.safetyMonitor;
        const { 
            actions: { 
                postMonitorNode,
                getMonitorNodes,
                setDepthArray
            } 
        } = this.props;
        let datas = this.state.dataSet;
        let m_type = currentTypeValue.split("-")[0];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let projectData = {
                    number:values.number,
                    instrument:values.instrument,
                    coord:{
                        x:values.x,
                        y:values.y,
                        z:values.z
                    },
                    m_type:m_type,
                    created:moment(new Date()).add(8,'hours').unix(),
                }
                if(values.project_part){
                    projectData.project_part = values.project_part;
                }
                if(isSurvey===true){    //get the depth data,and set it into projectData
                    if(deepArray.length===0){
                        notification.info({
                            message: '请添加深度信息！',
                            duration: 2
                        });
                        return;
                    }else{
                        projectData.depth = deepArray;
                        setDepthArray([]);
                    }
                }
                debugger
                postMonitorNode({}, projectData).then((rst)=>{
                    if(rst._id){
                        notification.info({
                            message: '添加成功！',
                            duration: 2
                        });
                        getMonitorNodes({},{unit:unitProject.code}).then((rst)=>{
                            if(rst.results){
                                let nodeArray = [];
                                rst.results.map((item)=>{
                                    item.id = item._id;
                                    item.x = item.coord.x;
                                    item.y = item.coord.y;
                                    item.z = item.coord.z;
                                    item.monitorProject = item.m_type.name;
                                    item.project_part = item.project_part===null?'':item.project_part;
                                    nodeArray.push(item);
                                });
                                this.setState({nodeArray});
                            }
                        });
                    }else{
                        notification.warning({
                            message: '添加失败！',
                            duration: 2
                        });
                    }
                });
                this.setState({setAddVisiable:false,dataSet:datas});
            }
        }); 
    }
    onEditClick = (record,index) =>{
        const { 
            actions: { 
                setDepthArray
            } 
        } = this.props;
        let depthArray = [];
        if(record.depth.length>0){
            setDepthArray(record.depth);
            for(let i=0;i<record.depth.length;i++){
                depthArray.push({depth:record.depth[i]});
            }
        }
        this.setState({depthArray,record,newKey1: Math.random(),setEditVisiable:true});
    }

    onTypeSelect = (currentTypeValue) =>{
        const { 
            actions: { 
                getMonitorNodes
            } 
        } = this.props;
        const {unitProject} = this.state;
        if(currentTypeValue.split("-")[2]==="true"){
            this.setState({isSurvey:true,currentTypeValue});
        }else{
            this.setState({isSurvey:false,currentTypeValue});
        }
        getMonitorNodes({},{unit:unitProject.code,type:currentTypeValue.split("-")[1]}).then((rst)=>{
            if(rst.results){
                let nodeArray = [];
                rst.results.map((item)=>{
                    item.id = item._id;
                    item.x = item.coord.x;
                    item.y = item.coord.y;
                    item.z = item.coord.z;
                    item.monitorProject = item.m_type.name;
                    item.project_part = item.project_part===null?'':item.project_part;
                    nodeArray.push(item);
                });
                this.setState({nodeArray});
            }
        });
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getMonitorType,
                getMonitorNodes
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
        }else{
            return;
        }
        getMonitorType({},{unit:unitProject.code}).then((rst)=>{
            if(rst.results.length!==0){
                let typeArray = [];
                rst.results.map((item)=>{
                    typeArray.push(item);
                });
                this.setState({typeArray});
            }else{
                this.setState({typeArray:[],currentTypeValue:''});
            }
        });
        getMonitorNodes({},{unit:unitProject.code}).then((rst)=>{
            if(rst.results){
                let nodeArray = [];
                rst.results.map((item)=>{
                    item.id = item._id;
                    item.x = item.coord.x;
                    item.y = item.coord.y;
                    item.z = item.coord.z;
                    item.monitorProject = item.m_type.name;
                    item.project_part = item.project_part===null?'':item.project_part;
                    nodeArray.push(item);
                });
                this.setState({nodeArray});
            }
        });
    };

    onFileChange = (info) =>{
        const { 
            actions: { 
                getMonitorNodes,
            } 
        } = this.props;
        const {unitProject,currentTypeValue} = this.state;
        if(currentTypeValue===''){
            notification.warning({
                message: '请先选择监测项目！',
                duration: 2
            });
            return;
        }
        this.setState({loading:true});
        if(info.file.status==="done"){
            notification.warning({
                    message: '添加成功！',
                    duration: 2
                });
            let response = info.file.response;
            this.setState({nodeArray:[]});
            if(response.result==="succeed to create data in bulk"){
                getMonitorNodes({},{unit:unitProject.code}).then((rst)=>{
                    if(rst.results){
                        let nodeArray = [];
                        rst.results.map((item)=>{
                            item.id = item._id;
                            item.x = item.coord.x;
                            item.y = item.coord.y;
                            item.z = item.coord.z;
                            item.monitorProject = item.m_type.name;
                            item.project_part = item.project_part===null?'':item.project_part;
                            nodeArray.push(item);
                        });
                        this.setState({nodeArray});
                    }
                });
            }else{
                notification.warning({
                    message: '上传失败！',
                    duration: 2
                });
                return;
            }
        }
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const {nodeArray,project,unitProject,typeArray,currentTypeValue} = this.state;
        let projectName = project.name?project.name:'';
        let unitName = unitProject.name?unitProject.name:'';
        let selectValue = '';
        let m_type = '';
        if(currentTypeValue!==''){
            selectValue = currentTypeValue.split("-")[1];
            m_type = currentTypeValue.split("-")[0];
        }
        let props = {
            action:`${SAFETY_MONITOR}/monitor/nodes-import/?m_type=${m_type}`,
            showUploadList:false,
        }
        const columns = [
            {
                title:'监测点编号',
                dataIndex:'number',
                width: '10%'
            },{
                title:'检测项目',
                dataIndex:'monitorProject',
                width: '20%'
            },{
                title:'仪器',
                dataIndex:'instrument',
                width: '10%'
            },{
                title:'经度',
                dataIndex:'x',
                width: '10%'
            },{
                title:'纬度',
                dataIndex:'y',
                width: '10%'
            },{
                title:'坐标Z',
                dataIndex:'z',
                width: '10%'
            },{
                title:'工程部位',
                dataIndex:'project_part',
                width: '15%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'操作',
                dataIndex:'opt',
                width: '15%',
                render: (text,record,index) => {
                    return <div>
                              <a href="javascript:;" onClick={this.onEditClick.bind(this,record,index)}>编辑</a>
                              <span className="ant-divider" />
                                <Popconfirm
                                 placement="rightTop"
                                 title="确定删除吗？"
                                 onConfirm={this.delete.bind(this, record, index)}
                                 okText="确认"
                                 cancelText="取消">
                                 <a>删除</a>
                                </Popconfirm>
                            </div>
                }
            }
        ];
        let array = [];
        for(let i=0;i<typeArray.length;i++){
            array.push(<Option value={`${typeArray[i]._id}-${typeArray[i].name}-${typeArray[i].has_depth}`}>{typeArray[i].name}</Option>);
        }
                    
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="监测点" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>监测点</h1>
                    <Row>
                        <Col span={2} style={{width:98}}><p style={{fontSize:14}}>选择监测项目:</p></Col>
                        <Col span={3}>
                            <Select 
                             value={selectValue}
                             style={{width:120}}
                             allowClear={true}
                             onSelect={(value)=>this.onTypeSelect(value)}>
                                {array}
                            </Select>
                        </Col>
                        <Col span={16} style={{marginLeft:18}}>
                            <Upload {...props}
                                onChange = {this.onFileChange.bind(this)}
                            >
                                <Button>
                                    <Icon type="upload" /> 批量上传
                                </Button>
                            </Upload>
                            <Button 
                             icon="download" 
                             type="primary" 
                             style={{float:'right',marginLeft:6}}
                             onClick={()=>this.onAddClick("download")}
                             >
                             下载模板
                            </Button>
                            <Button 
                             icon="plus" 
                             type="primary" 
                             style={{float:'right'}}
                             onClick={()=>this.onAddClick("add")}
                             >
                             添加
                            </Button>
                        </Col>
                    </Row>
                    
                    <Table 
                     columns={columns} 
                     dataSource={nodeArray}
                     bordered
                     style={{height:380,marginTop:40}}
                     pagination = {{pageSize:10}} 
                    />
                </Content>
                <Modal
                 title={`${this.state.project.name} - ${this.state.unitProject.name}`}
                 width={760}
                 key={this.state.newKey}
                 visible={this.state.setAddVisiable}
                 onOk={this.setAddData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <AddFile props={this.props} state={this.state} />
                </Modal>
                <Modal
                 title={`${this.state.project.name} - ${this.state.unitProject.name}`}
                 width={760}
                 key={this.state.newKey1}
                 visible={this.state.setEditVisiable}
                 onOk={this.setEditData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <EditFile props={this.props} state={this.state} />
                </Modal>
                <Preview/>
            </div>
        );
    }
}
export default Form.create()(MonitorStation);