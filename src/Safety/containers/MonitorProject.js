import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import AddFile from '../components/MonitorProject/AddProject';
import EditFile from '../components/MonitorProject/EditProject';
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
import {getUser} from '_platform/auth';
import {actions} from '../store/safetyMonitor';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {SOURCE_API, STATIC_DOWNLOAD_API,SAFETY_MONITOR} from '_platform/api';
import moment from 'moment';
import {
    SMUrl_template2,
} from '_platform/api';
import {
    Table,
    Row,
    Col,
    Form,
    Modal,
    Button,
    Input,
    Popconfirm,
    notification,
    Upload,
    Icon
} from 'antd';
const Search = Input.Search;

@connect(
    state => {
        const {platform,safety:{safetyMonitor={}} = {}} = state;
        return {platform,safetyMonitor}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class MonitorProject extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setAddVisiable:false,
            setEditVisiable:false,
            index:'-1',
            dataSet:[],
            newKey: Math.random(),
            newKey1:Math.random(),
            projectName:'',
            project:{},
            unitProject:{},
            rst:{},
            loading:false
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getMonitorType,
                getProjectTree
            } 
        } = this.props;
        const user = getUser();
        const code = user.org_code;
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                let project=rst.children;
                let unitProject = {};
                for(var i=0;i<project.length;i++){
                    if(project[i].children.length>0){
                        unitProject=project[i].children[0];
                        this.setState({
                            unitProject:unitProject,
                            project:project[i],
                        });
                        break;
                    }
                }
                getMonitorType({},{unit:unitProject.code}).then((result)=>{
                    let dataSet = [];
                    let rep = result.results;
                    if(rep.length!==0){
                        let dataSet = []; 
                        for(let i=0;i<rep.length;i++){
                            let single = {};
                            let array = [];
                            single.remark = rep[i].remark ? rep[i].remark : '';
                            single.project = rep[i].name;
                            if(rep[i].threshold_min==="负无穷"&&rep[i].threshold_max==="正无穷"){
                                single.threshold = "";
                            }else{
                                single.threshold = `${rep[i].threshold_min}-${rep[i].threshold_max}`;
                                array.push("阈值");
                                single.threshold_min = rep[i].threshold_min;
                                single.threshold_max = rep[i].threshold_max;
                            }
                            if(rep[i].variation_min==="负无穷"&&rep[i].variation_max==="正无穷"){
                                single.varthreshold = "";
                            }else{
                                single.varthreshold = `${rep[i].variation_min}-${rep[i].variation_max}`;
                                array.push("变化量阈值");
                                single.variation_min = rep[i].variation_min;
                                single.variation_max = rep[i].variation_max;
                            }
                            if(rep[i].a_variation_min==="负无穷"&&rep[i].a_variation_max==="正无穷"){
                                single.lvarthreshold = "";
                            }else{
                                single.lvarthreshold = `${rep[i].a_variation_min}-${rep[i].a_variation_max}`;
                                array.push("累计变化量阈值");
                                single.a_variation_min = rep[i].a_variation_min;
                                single.a_variation_max = rep[i].a_variation_max;
                            }
                            if(rep[i].gradient_min==="负无穷"&&rep[i].gradient_max==="正无穷"){
                                single.gradient = "";
                            }else{
                                single.gradient = `${rep[i].gradient_min}-${rep[i].gradient_max}`;
                                array.push("变化率阈值");
                                single.gradient_min = rep[i].gradient_min;
                                single.gradient_max = rep[i].gradient_max;
                            }
                            single.unit = rep[i].measure_unit;
                            single.id = rep[i]._id;
                            single.optionArray = array;
                            dataSet.push(single);
                        }
                        this.setState({dataSet});
                    }else{
                        this.setState({dataSet});
                    }
                }); 
            }
        });
    }
    onEditClick = (record,index) =>{
        this.setState({record,setEditVisiable:true,newKey1:Math.random()});

    }

    delete(record,index){
        let datas = this.state.dataSet;
        const { 
            actions: { 
                deleteMonitorType
            } 
        } = this.props;
        deleteMonitorType({pk:record.id}).then((rst)=>{
            if(rst===""){
                notification.warning({
                    message: '删除成功！',
                    duration: 2
                });
                datas.splice(index,1);
                this.setState({dataSet:datas});
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

    onAddClick(type){
        if(type==="patchadd"){

        }else if(type==="add"){
            this.setState({newKey: Math.random(),setAddVisiable:true});
        }else if(type==="download"){
            let apiGet = SMUrl_template2;
            this.createLink(this,apiGet);
        }
    }

    goCancel(){
        this.setState({setAddVisiable:false,setEditVisiable:false});
    }
    setEditData(){
        const {project,unitProject,record} = this.state;
        const { 
            actions: { 
                patchMonitorType,
                getMonitorType
            } 
        } = this.props;
        let datas = this.state.dataSet;
        this.props.form.validateFields((err,values) => {
            if(!err){
                debugger
                let postData = {
                    name:values.monitorName,
                    measure_unit:values.unit
                };
                if(values.varthreshold1&&values.varthreshold1!=="负无穷"){
                    postData.variation_min = values.varthreshold1;
                }
                if(values.varthreshold2&&values.varthreshold2!=="正无穷"){
                    postData.variation_max = values.varthreshold2;
                }
                if(values.threshold1&&values.threshold1!=="负无穷"){
                    postData.threshold_min = values.threshold1;
                }
                if(values.threshold2&&values.threshold2!=="正无穷"){
                    postData.threshold_max = values.threshold2;
                }
                if(values.lvarthreshold1&&values.lvarthreshold1!=="负无穷"){
                    postData.a_variation_min = values.lvarthreshold1;
                }
                if(values.lvarthreshold2&&values.lvarthreshold2!=="正无穷"){
                    postData.a_variation_max = values.lvarthreshold2;
                }
                if(values.gradient1&&values.gradient1!=="负无穷"){
                    postData.gradient_min = values.gradient1;
                }
                if(values.gradient2&&values.gradient2!=="正无穷"){
                    postData.gradient_max = values.gradient1;
                }
                if(values.remark){
                    postData.remark = values.remark;
                }
                patchMonitorType({pk:record.id},postData).then((rst)=>{
                    if(rst._id){
                        notification.warning({
                            message: '修改成功！',
                            duration: 2
                        });
                        getMonitorType({},{unit:unitProject.code}).then((result)=>{
                            let dataSet = [];
                            let rep = result.results;
                            if(rep.length!==0){
                                let dataSet = []; 
                                for(let i=0;i<rep.length;i++){
                                    let single = {};
                                    let array = [];
                                    single.remark = rep[i].remark ? rep[i].remark : '';
                                    single.project = rep[i].name;
                                    if(rep[i].threshold_min==="负无穷"&&rep[i].threshold_max==="正无穷"){
                                        single.threshold = "";
                                    }else{
                                        single.threshold = `${rep[i].threshold_min}-${rep[i].threshold_max}`;
                                        array.push("阈值");
                                        single.threshold_min = rep[i].threshold_min;
                                        single.threshold_max = rep[i].threshold_max;
                                    }
                                    if(rep[i].variation_min==="负无穷"&&rep[i].variation_max==="正无穷"){
                                        single.varthreshold = "";
                                    }else{
                                        single.varthreshold = `${rep[i].variation_min}-${rep[i].variation_max}`;
                                        array.push("变化量阈值");
                                        single.variation_min = rep[i].variation_min;
                                        single.variation_max = rep[i].variation_max;
                                    }
                                    if(rep[i].a_variation_min==="负无穷"&&rep[i].a_variation_max==="正无穷"){
                                        single.lvarthreshold = "";
                                    }else{
                                        single.lvarthreshold = `${rep[i].a_variation_min}-${rep[i].a_variation_max}`;
                                        array.push("累计变化量阈值");
                                        single.a_variation_min = rep[i].a_variation_min;
                                        single.a_variation_max = rep[i].a_variation_max;
                                    }
                                    if(rep[i].gradient_min==="负无穷"&&rep[i].gradient_max==="正无穷"){
                                        single.gradient = "";
                                    }else{
                                        single.gradient = `${rep[i].gradient_min}-${rep[i].gradient_max}`;
                                        array.push("变化率阈值");
                                        single.gradient_min = rep[i].gradient_min;
                                        single.gradient_max = rep[i].gradient_max;
                                    }
                                    single.unit = rep[i].measure_unit;
                                    single.id = rep[i]._id;
                                    single.optionArray = array;
                                    dataSet.push(single);
                                }
                                this.setState({dataSet});
                            }else{
                                this.setState({dataSet});
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
        const {project,unitProject} = this.state;
        const { 
            actions: { 
                postMonitorType,
                getMonitorType
            } 
        } = this.props;
        let datas = this.state.dataSet;
        this.props.form.validateFields((err,values) => {
            if(!err){
                debugger
                let postData = {
                    project:project.name,
                    unit:unitProject.code,
                    has_depth:values.type===1?false:true,
                    name:values.monitorName,
                    measure_unit:values.unit
                };
                if(values.varthreshold1&&values.varthreshold1!=="负无穷"){
                    postData.variation_min = values.varthreshold1;
                }
                if(values.varthreshold2&&values.varthreshold2!=="正无穷"){
                    postData.variation_max = values.varthreshold2;
                }
                if(values.threshold1&&values.threshold1!=="负无穷"){
                    postData.threshold_min = values.threshold1;
                }
                if(values.threshold2&&values.threshold2!=="正无穷"){
                    postData.threshold_max = values.threshold2;
                }
                if(values.lvarthreshold1&&values.lvarthreshold1!=="负无穷"){
                    postData.a_variation_min = values.lvarthreshold1;
                }
                if(values.lvarthreshold2&&values.lvarthreshold2!=="正无穷"){
                    postData.a_variation_max = values.lvarthreshold2;
                }
                if(values.gradient1&&values.gradient1!=="负无穷"){
                    postData.gradient_min = values.gradient1;
                }
                if(values.gradient2&&values.gradient2!=="正无穷"){
                    postData.gradient_max = values.gradient1;
                }
                if(values.remark){
                    postData.remark = values.remark;
                }
                postMonitorType({},postData).then((rst)=>{
                    if(rst._id){
                        notification.warning({
                            message: '添加成功！',
                            duration: 2
                        });
                        getMonitorType({},{unit:unitProject.code}).then((result)=>{
                            let dataSet = [];
                            let rep = result.results;
                            if(rep.length!==0){
                                let dataSet = []; 
                                for(let i=0;i<rep.length;i++){
                                    let single = {};
                                    let array = [];
                                    single.remark = rep[i].remark ? rep[i].remark : '';
                                    single.project = rep[i].name;
                                    if(rep[i].threshold_min==="负无穷"&&rep[i].threshold_max==="正无穷"){
                                        single.threshold = "";
                                    }else{
                                        single.threshold = `${rep[i].threshold_min}-${rep[i].threshold_max}`;
                                        array.push("阈值");
                                        single.threshold_min = rep[i].threshold_min;
                                        single.threshold_max = rep[i].threshold_max;
                                    }
                                    if(rep[i].variation_min==="负无穷"&&rep[i].variation_max==="正无穷"){
                                        single.varthreshold = "";
                                    }else{
                                        single.varthreshold = `${rep[i].variation_min}-${rep[i].variation_max}`;
                                        array.push("变化量阈值");
                                        single.variation_min = rep[i].variation_min;
                                        single.variation_max = rep[i].variation_max;
                                    }
                                    if(rep[i].a_variation_min==="负无穷"&&rep[i].a_variation_max==="正无穷"){
                                        single.lvarthreshold = "";
                                    }else{
                                        single.lvarthreshold = `${rep[i].a_variation_min}-${rep[i].a_variation_max}`;
                                        array.push("累计变化量阈值");
                                        single.a_variation_min = rep[i].a_variation_min;
                                        single.a_variation_max = rep[i].a_variation_max;
                                    }
                                    if(rep[i].gradient_min==="负无穷"&&rep[i].gradient_max==="正无穷"){
                                        single.gradient = "";
                                    }else{
                                        single.gradient = `${rep[i].gradient_min}-${rep[i].gradient_max}`;
                                        array.push("变化率阈值");
                                        single.gradient_min = rep[i].gradient_min;
                                        single.gradient_max = rep[i].gradient_max;
                                    }
                                    single.unit = rep[i].measure_unit;
                                    single.id = rep[i]._id;
                                    single.optionArray = array;
                                    dataSet.push(single);
                                }
                                this.setState({dataSet});
                            }else{
                                this.setState({dataSet});
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

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getMonitorType,
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
        }else{
            return;
        }
        getMonitorType({},{unit:unitProject.code}).then((result)=>{
            let dataSet = [];
            let rep = result.results;
            if(rep.length!==0){
                let dataSet = []; 
                for(let i=0;i<rep.length;i++){
                    let single = {};
                    let array = [];
                    single.remark = rep[i].remark ? rep[i].remark : '';
                    single.project = rep[i].name;
                    if(rep[i].threshold_min==="负无穷"&&rep[i].threshold_max==="正无穷"){
                        single.threshold = "";
                    }else{
                        single.threshold = `${rep[i].threshold_min}-${rep[i].threshold_max}`;
                        array.push("阈值");
                        single.threshold_min = rep[i].threshold_min;
                        single.threshold_max = rep[i].threshold_max;
                    }
                    if(rep[i].variation_min==="负无穷"&&rep[i].variation_max==="正无穷"){
                        single.varthreshold = "";
                    }else{
                        single.varthreshold = `${rep[i].variation_min}-${rep[i].variation_max}`;
                        array.push("变化量阈值");
                        single.variation_min = rep[i].variation_min;
                        single.variation_max = rep[i].variation_max;
                    }
                    if(rep[i].a_variation_min==="负无穷"&&rep[i].a_variation_max==="正无穷"){
                        single.lvarthreshold = "";
                    }else{
                        single.lvarthreshold = `${rep[i].a_variation_min}-${rep[i].a_variation_max}`;
                        array.push("累计变化量阈值");
                        single.a_variation_min = rep[i].a_variation_min;
                        single.a_variation_max = rep[i].a_variation_max;
                    }
                    if(rep[i].gradient_min==="负无穷"&&rep[i].gradient_max==="正无穷"){
                        single.gradient = "";
                    }else{
                        single.gradient = `${rep[i].gradient_min}-${rep[i].gradient_max}`;
                        array.push("变化率阈值");
                        single.gradient_min = rep[i].gradient_min;
                        single.gradient_max = rep[i].gradient_max;
                    }
                    single.unit = rep[i].measure_unit;
                    single.id = rep[i]._id;
                    single.optionArray = array;
                    dataSet.push(single);
                }
                this.setState({dataSet});
            }else{
                this.setState({dataSet});
            }
        }); 
    };

    onFileChange = (info) =>{
        const { 
            actions: { 
                getMonitorType,
            } 
        } = this.props;
        const {unitProject} = this.state;
        this.setState({loading:true});
        if(info.file.status==="done"){
            let response = info.file.response;
            if(response.result==="succeed to create data in bulk"){
                notification.warning({
                    message: '添加成功！',
                    duration: 2
                });
                getMonitorType({},{unit:unitProject.code}).then((result)=>{
                    let dataSet = [];
                    let rep = result.results;
                    if(rep.length!==0){
                        let dataSet = []; 
                        for(let i=0;i<rep.length;i++){
                            let single = {};
                            let array = [];
                            single.remark = rep[i].remark ? rep[i].remark : '';
                            single.project = rep[i].name;
                            if(rep[i].threshold_min==="负无穷"&&rep[i].threshold_max==="正无穷"){
                                single.threshold = "";
                            }else{
                                single.threshold = `${rep[i].threshold_min}-${rep[i].threshold_max}`;
                                array.push("阈值");
                                single.threshold_min = rep[i].threshold_min;
                                single.threshold_max = rep[i].threshold_max;
                            }
                            if(rep[i].variation_min==="负无穷"&&rep[i].variation_max==="正无穷"){
                                single.varthreshold = "";
                            }else{
                                single.varthreshold = `${rep[i].variation_min}-${rep[i].variation_max}`;
                                array.push("变化量阈值");
                                single.variation_min = rep[i].variation_min;
                                single.variation_max = rep[i].variation_max;
                            }
                            if(rep[i].a_variation_min==="负无穷"&&rep[i].a_variation_max==="正无穷"){
                                single.lvarthreshold = "";
                            }else{
                                single.lvarthreshold = `${rep[i].a_variation_min}-${rep[i].a_variation_max}`;
                                array.push("累计变化量阈值");
                                single.a_variation_min = rep[i].a_variation_min;
                                single.a_variation_max = rep[i].a_variation_max;
                            }
                            if(rep[i].gradient_min==="负无穷"&&rep[i].gradient_max==="正无穷"){
                                single.gradient = "";
                            }else{
                                single.gradient = `${rep[i].gradient_min}-${rep[i].gradient_max}`;
                                array.push("变化率阈值");
                                single.gradient_min = rep[i].gradient_min;
                                single.gradient_max = rep[i].gradient_max;
                            }
                            single.unit = rep[i].measure_unit;
                            single.id = rep[i]._id;
                            single.optionArray = array;
                            dataSet.push(single);
                        }
                        this.setState({dataSet});
                    }else{
                        this.setState({dataSet});
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
        const {dataSet,project,unitProject} = this.state;
        let props = {
            action:`${SAFETY_MONITOR}/monitor/types-import/?project=${project.name}&unit=${unitProject.code}`,
            showUploadList:false,
        }
        const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '4%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'监测项目',
                dataIndex:'project',
                width: '10%'
            },{
                title:'阈值',
                dataIndex:'threshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化量阈值',
                dataIndex:'varthreshold',
                width: '14%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量阈值',
                dataIndex:'lvarthreshold',
                width: '14%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率阈值',
                dataIndex:'gradient',
                width: '14%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'单位',
                dataIndex:'unit',
                width: '4%'
            },{
                title:'责任人',
                dataIndex:'response',
                width: '10%'
            },{
                title:'备注',
                dataIndex:'remark',
                width: '10%'
            },{
                title:'操作',
                dataIndex:'opt',
                width: '10%',
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
                    
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="监测项目" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>监测项目</h1>
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
                    <Table 
                     columns={columns} 
                     dataSource={dataSet}
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
            </div>
        );
    }
}
export default Form.create()(MonitorProject);