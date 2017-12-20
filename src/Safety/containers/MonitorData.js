import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import AddFile from '../components/MonitorData/AddData';
import AddFile1 from '../components/MonitorData/AddData1';
import styles from './RiskEvaluation.css';
import {actions as platformActions} from '_platform/store/global';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import {actions} from '../store/safetyMonitor';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {SOURCE_API, STATIC_DOWNLOAD_API,SAFETY_MONITOR,SAFETY_MONITOR_DOWN} from '_platform/api';
import moment from 'moment';
import {
    SMUrl_template1,     //测斜项目上传
    SMUrl_template4    //一般项目上传
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
    Upload,
    Icon,
    notification,
    Select,
    DatePicker
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

class MonitorData extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setAddVisiable:false,
            dataSet:[],
            newKey: Math.random(),
            newKey1:Math.random(),
            project:{},
            unitProject:{},
            setdetailVisiable:false,
            typeArray:[],    //监测项目列表
            currentTypeValue:'',   //当前select的value
            nodeArray:[],
            currentDepthArray:[],  //当前测斜节点的深度数组
            currentNodeID:'',      //当前测斜节点的id
            dateList:[]             //已经发送过数据的时间列表
        }
    }

    componentDidMount(){
        const { 
            actions: { 
                getProjectTree,
                getMonitorType
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
                            project:project[i],
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

    onPositionSelect = (currentPositionValue) =>{
        const { 
            actions: { 
                getDateList
            } 
        } = this.props;
        const {unitProject,currentTypeValue} = this.state;
        let currentDepthArray = [];
        let currentNodeID = currentPositionValue.split('+')[0];
        currentPositionValue.split('+')[1].split(',').map(item=>{
            currentDepthArray.push({depth:item});
        });
        this.setState({currentDepthArray,currentNodeID});
        this.getDataList(unitProject,currentTypeValue,currentNodeID);
        getDateList({},{unit:unitProject.code,type:currentTypeValue.split("-")[1],node:currentNodeID}).then(rst=>{
            this.setState({dateList:rst});
        });
    }

    onTypeSelect = (currentTypeValue) =>{
        const { 
            actions: { 
                getMonitorNodes,
                getDateList
            } 
        } = this.props;
        const {unitProject} = this.state;
        this.setState({currentTypeValue});
        getMonitorNodes({},{unit:unitProject.code,type:currentTypeValue.split("-")[1]}).then((rst)=>{
            if(rst.results){
                let nodeArray = [];
                rst.results.map((item)=>{
                    nodeArray.push({number:item.number,node:item._id,depth:item.depth});
                });
                this.setState({nodeArray});
            }
        });
        getDateList({},{unit:unitProject.code,type:currentTypeValue.split("-")[1]}).then(rst=>{
            this.setState({dateList:rst});
        });
        this.setState({currentNodeID:''});   //clear it service for upload
        if(currentTypeValue.split('-')[2]==="true"){
            return;
        }
        this.getDataList(unitProject,currentTypeValue);
    }

    onAddClick(type){
        if(type==="add"){
            const {currentTypeValue} = this.state;
            if(currentTypeValue===''){
                notification.warning({
                    message: '请选择一个监测项目！',
                    duration: 2
                });
                return;
            }
            if(currentTypeValue.split('-')[2]==="true"){   //是测斜项目
                this.setState({newKey1:Math.random(),setdetailVisiable:true});
            }else{
                this.setState({newKey: Math.random(),setAddVisiable:true});
            }
        }else if(type==="download"){
            const {currentTypeValue} = this.state;
            if(currentTypeValue===''){
                notification.warning({
                    message: '请选择一个监测项目！',
                    duration: 2
                });
                return;
            }
            let apiGet = `${SAFETY_MONITOR_DOWN}/monitor/template/?m_type=${currentTypeValue.split('-')[0]}`;
            debugger
            this.createLink(this,apiGet);
        }
    }

    goCancel(){
        this.setState({setAddVisiable:false,setdetailVisiable:false});
    }

    setAddData1(){
        const {currentTypeValue,unitProject,currentNodeID} = this.state;
        const { 
            actions: { 
                postMonitorValue
            } 
        } = this.props;
        const {tableArray} = this.props.safetyMonitor;
        let dataSet = [];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = [];
                tableArray.map(item=>{
                    if(item.value){
                        let data = {
                            depth:item.depth,
                            node:currentNodeID,
                            value:item.value,
                            view_date:moment(values.date._d).add(8,'hours').unix()
                        };
                        postData.push(data);
                    }
                });
                debugger
                postMonitorValue({},postData).then(rst=>{
                    if(rst.result&&rst.result==="succeed to create data in bulk"){
                        notification.success({
                            message: '填报成功！',
                            duration: 2
                        });
                        this.getDataList(unitProject,currentTypeValue,currentNodeID);
                        this.setState({setdetailVisiable:false});
                    }else{
                        notification.warning({
                            message: '填报失败！',
                            duration: 2
                        });
                        this.setState({setdetailVisiable:false});
                    }
                });
            }
        }); 
    }

    setAddData(){
        const {currentTypeValue,unitProject} = this.state;
        const { 
            actions: { 
                postMonitorValue,
                getMonitorValues
            } 
        } = this.props;
        const {tableArray} = this.props.safetyMonitor;
        let dataSet = [];
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = [];
                tableArray.map(item=>{
                    if(item.value){
                        let data = {
                            node:item.node,
                            value:item.value,
                            view_date:moment(values.date._d).add(8,'hours').unix()
                        };
                        postData.push(data);
                    }
                });
                postMonitorValue({},postData).then(rst=>{
                    if(rst.result&&rst.result==="succeed to create data in bulk"){
                        notification.success({
                            message: '填报成功！',
                            duration: 2
                        });
                        this.getDataList(unitProject,currentTypeValue);
                        this.setState({setAddVisiable:false});
                    }else{
                        notification.warning({
                            message: '填报失败！',
                            duration: 2
                        });
                        this.setState({setAddVisiable:false});
                    }
                });
            }
        }); 
    }

    getDataList(unitProject,currentTypeValue,currentNodeID){
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let dataSet = [];
        if(currentNodeID){
            getMonitorValues({},{unit:unitProject.code,type:currentTypeValue.split("-")[1],node:currentNodeID}).then(rst=>{
                rst.results.map(item=>{
                    let data = {};
                    data.id = item._id;   //current data id
                    data.nid = item.node._id;   //monitor node id
                    data.mid = item.node.m_type._id;  //monitor type id
                    data.depth = item.depth;
                    //some base data.
                    data.number = item.node.number;
                    data.value_init = item.value_init;
                    data.value = item.value;
                    data.variation = item.variation;
                    data.a_variation = item.a_variation;
                    data.gradient = item.gradient;
                    //flag things
                    data.value_abn = item.value_abn;
                    data.variation_abn = item.variation_abn;
                    data.a_variation_abn = item.a_variation_abn;
                    data.gradient_abn = item.gradient_abn;
                    //range things
                    if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                        data.threshold = "";
                    }else{
                        data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                    }
                    if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                        data.varthreshold = "";
                    }else{
                        data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                    }
                    if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                        data.lvarthreshold = "";
                    }else{
                        data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                    }
                    if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                        data.thgradient = "";
                    }else{
                        data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                    }
                    dataSet.push(data);
                });
                this.setState({dataSet});
            });
        }else{
            getMonitorValues({},{unit:unitProject.code,type:currentTypeValue.split("-")[1]}).then(rst=>{
                rst.results.map(item=>{
                    let data = {};
                    data.id = item._id;   //current data id
                    data.nid = item.node._id;   //monitor node id
                    data.mid = item.node.m_type._id;  //monitor type id
                    //some base data.
                    data.number = item.node.number;
                    data.value_init = item.value_init;
                    data.value = item.value;
                    data.variation = item.variation;
                    data.a_variation = item.a_variation;
                    data.gradient = item.gradient;
                    //flag things
                    data.value_abn = item.value_abn;
                    data.variation_abn = item.variation_abn;
                    data.a_variation_abn = item.a_variation_abn;
                    data.gradient_abn = item.gradient_abn;
                    //range things
                    if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                        data.threshold = "";
                    }else{
                        data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                    }
                    if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                        data.varthreshold = "";
                    }else{
                        data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                    }
                    if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                        data.lvarthreshold = "";
                    }else{
                        data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                    }
                    if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                        data.thgradient = "";
                    }else{
                        data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                    }
                    dataSet.push(data);
                });
                this.setState({dataSet});
            });
        }
        
        return 0;
    }
    getDataListByTime(unitProject,currentTypeValue,dateString,currentNodeID){
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let dataSet = [];
        if(currentNodeID){
            getMonitorValues({},{unit:unitProject.code,type:currentTypeValue.split("-")[1],date:dateString,node:currentNodeID}).then(rst=>{
                rst.results.map(item=>{
                    let data = {};
                    data.id = item._id;   //current data id
                    data.nid = item.node._id;   //monitor node id
                    data.mid = item.node.m_type._id;  //monitor type id
                    data.depth = item.depth;
                    //some base data.
                    data.number = item.node.number;
                    data.value_init = item.value_init;
                    data.value = item.value;
                    data.variation = item.variation;
                    data.a_variation = item.a_variation;
                    data.gradient = item.gradient;
                    //flag things
                    data.value_abn = item.value_abn;
                    data.variation_abn = item.variation_abn;
                    data.a_variation_abn = item.a_variation_abn;
                    data.gradient_abn = item.gradient_abn;
                    //range things
                    if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                        data.threshold = "";
                    }else{
                        data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                    }
                    if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                        data.varthreshold = "";
                    }else{
                        data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                    }
                    if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                        data.lvarthreshold = "";
                    }else{
                        data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                    }
                    if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                        data.thgradient = "";
                    }else{
                        data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                    }
                    dataSet.push(data);
                });
                this.setState({dataSet});
            });
        }else{
            getMonitorValues({},{unit:unitProject.code,type:currentTypeValue.split("-")[1],date:dateString}).then(rst=>{
                rst.results.map(item=>{
                    let data = {};
                    data.id = item._id;   //current data id
                    data.nid = item.node._id;   //monitor node id
                    data.mid = item.node.m_type._id;  //monitor type id
                    //some base data.
                    data.number = item.node.number;
                    data.value_init = item.value_init;
                    data.value = item.value;
                    data.variation = item.variation;
                    data.a_variation = item.a_variation;
                    data.gradient = item.gradient;
                    //flag things
                    data.value_abn = item.value_abn;
                    data.variation_abn = item.variation_abn;
                    data.a_variation_abn = item.a_variation_abn;
                    data.gradient_abn = item.gradient_abn;
                    //range things
                    if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                        data.threshold = "";
                    }else{
                        data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                    }
                    if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                        data.varthreshold = "";
                    }else{
                        data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                    }
                    if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                        data.lvarthreshold = "";
                    }else{
                        data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                    }
                    if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                        data.thgradient = "";
                    }else{
                        data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                    }
                    dataSet.push(data);
                });
                this.setState({dataSet});
            });
        }
        
        return 0;
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getMonitorType
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
    };

    onFileChange = (info) =>{
        debugger
        const { 
            actions: { 
                getMonitorType
            } 
        } = this.props;
        const {unitProject,currentTypeValue,currentNodeID} = this.state;
        if(currentTypeValue===''){
            notification.warning({
                message: '请先选择监测项目！',
                duration: 2
            });
            return;
        }
        this.setState({loading:true});
        if(info.file.status==="done"){
            debugger
            let response = info.file.response;
            if(response.result==="succeed to create data in bulk"){
                notification.warning({
                    message: '添加成功！',
                    duration: 2
                });
                if(currentNodeID===''){
                    this.getDataList(unitProject,currentTypeValue);
                }else{
                    this.getDataList(unitProject,currentTypeValue,currentNodeID);
                }
            }else{
                notification.warning({
                    message: '上传失败！',
                    duration: 2
                });
                return;
            }
        }
    }
    disabledDate(current) {
      const {dateList} = this.state;
      if(current){
        let dada = current.format('YYYY-MM-DD');
        return current && dateList.indexOf(dada)===-1;
      }
      return current;
    }

    onPickerChange(date,dateString){
        const {currentNodeID,unitProject,currentTypeValue} = this.state;
        if(currentNodeID===''){
            this.getDataListByTime(unitProject,currentTypeValue,dateString);
        }else{
            this.getDataListByTime(unitProject,currentTypeValue,dateString,currentNodeID);
        }
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const {dataSet,project,unitProject,typeArray,currentTypeValue,nodeArray,currentPositionValue} = this.state;
        let projectName = project.name?project.name:'';
        let unitName = unitProject.name?unitProject.name:'';
        let selectValue = '';
        let selectValue1 = '';

        let m_type = '';
        if(currentTypeValue!==''){
            selectValue = currentTypeValue.split("-")[1];
            m_type = currentTypeValue.split("-")[0];
        }

        let props = {
            action:`${SAFETY_MONITOR}/monitor/values-import/?m_type=${currentTypeValue.split("-")[0]}`,
            showUploadList:false,
        }
        const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '5%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'监测点',
                dataIndex:'number',
                width: '10%'
            },{
                title:'初始值',
                dataIndex:'value_init',
                width: '10%'
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '10%',
                render:(text,record)=>{
                    if(record.value_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.value_abn===false){
                        return <p>{text}</p>
                    }
                }
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
                title:'本次变化量',
                dataIndex:'variation',
                width: '10%',
                render:(text,record)=>{
                    if(record.variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.variation_abn===false){
                        return <p>{text}</p>
                    }
                }

            },{
                title:'变化量阈值',
                dataIndex:'varthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量',
                dataIndex:'a_variation',
                width: '10%',
                render:(text,record)=>{
                    if(record.a_variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.a_variation_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量阈值',
                dataIndex:'lvarthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率',
                dataIndex:'gradient',
                width: '5%',
                render:(text,record)=>{
                    if(record.gradient_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.gradient_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率阈值',
                dataIndex:'thgradient',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },
        ];
        const columns1 = [
            {
                title:'序号',
                dataIndex:'index',
                width: '5%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'深度',
                dataIndex:'depth',
                width: '10%'
            },{
                title:'初始值',
                dataIndex:'value_init',
                width: '10%'
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '10%',
                render:(text,record)=>{
                    if(record.value_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.value_abn===false){
                        return <p>{text}</p>
                    }
                }
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
                title:'本次变化量',
                dataIndex:'variation',
                width: '10%',
                render:(text,record)=>{
                    if(record.variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.variation_abn===false){
                        return <p>{text}</p>
                    }
                }

            },{
                title:'变化量阈值',
                dataIndex:'varthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量',
                dataIndex:'a_variation',
                width: '10%',
                render:(text,record)=>{
                    if(record.a_variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.a_variation_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量阈值',
                dataIndex:'lvarthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率',
                dataIndex:'gradient',
                width: '5%',
                render:(text,record)=>{
                    if(record.gradient_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.gradient_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率阈值',
                dataIndex:'thgradient',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },
        ];
        let columns2 = columns;
        if(currentTypeValue!==''){
            if(currentTypeValue.split("-")[2]==="true"){
                columns2 = columns1;
            }
        }
        currentTypeValue.split('-')[2]
        let array = [];
        let array1 = [];
        for(let i=0;i<typeArray.length;i++){
            array.push(<Option value={`${typeArray[i]._id}-${typeArray[i].name}-${typeArray[i].has_depth}`}>{typeArray[i].name}</Option>);
        }
        for(let i=0;i<nodeArray.length;i++){
            array1.push(<Option value={`${nodeArray[i].node}+${nodeArray[i].depth}`}>{nodeArray[i].number}</Option>);
        }
        
                    
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="监测数据" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>监测数据</h1>
                    <Row style={{marginTop:10}}>
                        <Col span={3} style={{width:98}}><p style={{fontSize:14}}>选择监测项目:</p></Col>
                        <Col span={4}>
                            <Select 
                             value={selectValue}
                             style={{width:120}}
                             allowClear={true}
                             onSelect={(value)=>this.onTypeSelect(value)}>
                                {array}
                            </Select>
                        </Col>
                        {
                            currentTypeValue.split('-')[2] === "true" 
                            ?
                            <Col span={3}>
                                <Select
                                 style={{width:100}}
                                 onSelect={value=>this.onPositionSelect(value)}>
                                 {array1}
                                </Select>
                            </Col>
                            :
                            null
                        }
                        <Col span={10}>
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
                        <Col span={4}>
                            <DatePicker
                              style={{marginLeft:10}}
                              format="YYYY-MM-DD"
                              onChange={(date,dateString)=>this.onPickerChange(date,dateString)}
                              disabledDate={(value)=>this.disabledDate(value)}
                            />
                        </Col>
                    </Row>
                    <Table 
                     columns={columns2} 
                     dataSource={dataSet}
                     bordered
                     style={{height:380,marginTop:40}}
                     pagination = {{pageSize:10}} 
                    />
                </Content>
                <Modal
                 title="添加监测数据（一般）"
                 width={760}
                 key={this.state.newKey}
                 visible={this.state.setAddVisiable}
                 onOk={this.setAddData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <AddFile props={this.props} state={this.state} />
                </Modal>
                <Modal
                 title="添加监测数据（测斜）"
                 width={760}
                 key={this.state.newKey1}
                 visible={this.state.setdetailVisiable}
                 onOk={this.setAddData1.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                >
                    <AddFile1 props={this.props} state={this.state} />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(MonitorData);