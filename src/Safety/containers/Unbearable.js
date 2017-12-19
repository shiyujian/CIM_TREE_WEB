import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/unbearable';
import EditData from '../components/Unbearable/EditData';
import AddData from '../components/Unbearable/AddData';
import {SERVICE_API} from '_platform/api';
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
// import ProjectTree from '../components/Treatment/ProjectTree';
import WorkPackageTree from '../components/WorkPackageTree';
import {
    Table,
    Row,
    Col,
    Popconfirm,
    Form,
    Modal,
    Button,
    message,
    Upload, 
    Icon,
    notification
} from 'antd';
import {
    SMUrl_template13
} from '_platform/api';

@connect(
    state => {
        const {safety: {unbearable = {}} = {}, platform} = state;
        return {unbearable, platform}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class Unbearable extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setEditVisiable:false,
            setAddVisiable:false,
            index:'-1',
            dataSet:[{unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'},
            {unbearable:'挑食、吃垃圾食品',mayaccident:'营养不良',warninglevel:'level-3',position:'办公室',targetControl:'加班宅男',jobControl:'按时吃食堂',rescue:'时蔬两道'}]
        }
    }

    beforeUpload = (file) =>{
        const isExcel = file.name.split('.')[1] === 'xls' || file.name.split('.')[1] === 'xlsx';
        if(!isExcel){
             message.error('You can only upload Excel file!');
        }
        const hasNoChinese = escape(file.name).indexOf("%u") < 0 ? true : false;
        if(!hasNoChinese){
            message.error('filename can not contain Chinese!');
        }
        return isExcel && hasNoChinese;
    }

    downExcelFrameWork = (e) => {
        let apiGet = SMUrl_template13;
        this.createLink(this,apiGet)
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

    onFileChange = (info) =>{
        if (info.file.status === 'done') {
            let dataList = info.file.response.Sheet1
            let scheduleMaster = [];
            for(var i=1;i<dataList.length;i++){
                scheduleMaster.push({
                    unbearable: dataList[i][0],
                    mayaccident: dataList[i][1],
                    warninglevel: dataList[i][2],
                    position: dataList[i][3],
                    targetControl: dataList[i][4],
                    jobControl: dataList[i][5],
                    rescue: dataList[i][6]
                });
            }
            this.setState({
                dataSet:scheduleMaster,
            });
            notification.success({
                message: '文件上传成功',
                duration: 2
            });
        }else if (info.file.status === 'error') {
            notification.error({
                message: '文件上传失败',
                duration: 2
            });
            return;
        }
    }

    onEditClick(record,index){
        this.setState({record:record,index:index,setEditVisiable:true})
    }

    onAddClick = () =>{
    	this.setState({setAddVisiable:true});
    }

    onConfirm = () =>{
        message.info('保存成功.');
    }

    goCancel(){
        this.setState({setEditVisiable:false,setAddVisiable:false});
    }

    setEditData(type){
        this.props.form.validateFields((err,values) => {
            if(!err){
                let datas = this.state.dataSet;
                if(type==="add"){
                	datas.push(values);
                }else if(type==="edit"){
                    datas.splice(this.state.index,1,values);
                }
                this.setState({setEditVisiable:false,dataSet:datas,setAddVisiable:false});
            }
        }); 
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const dataSet = this.state.dataSet;
        const columns = [
            {
                title:'序号',
                dataIndex:'index',
                width: '5%',
                render:(text,record,index) => {
                    return <div>{index+1}</div>
                }
            },{
                title:'不可承受风险',
                dataIndex:'unbearable',
                width: '20%'
            },{
                title:'可能导致的事故',
                dataIndex:'mayaccident',
                width: '12.5%'
            },{
                title:'风险等级',
                dataIndex:'warninglevel',
                width: '15%'
            },{
                title:'可能发生场所、活动、设备',
                dataIndex:'position',
                width: '12.5%'
            },{
                title:'控制方式',
                children:[{
                    title:'目标控制',
                    dataIndex:'targetControl',
                    key:'targetControl',
                    width: '5%'
                },{
                    title:'作业控制',
                    dataIndex:'jobControl',
                    key:'jobControl',
                    width: '5%'
                },{
                    title:'应急救援',
                    dataIndex:'rescue',
                    key:'rescue',
                    width: '5%'
                }]
            },{
                title:'操作',
                dataIndex:'opt',
                width: '5%',
                render: (text,record,index) => {
                    return <div><a href='#' onClick={this.onEditClick.bind(this,record,index)}>编辑</a></div>
                }
            }
        ];
                    
        return (
            <div className={styles.riskevaluation}>
                <DynamicTitle title="不可承受" {...this.props}/>
                <Sidebar>
                    <WorkPackageTree />
                </Sidebar>
                <Content>
                    <h1 style={{textAlign:'center'}}>不可承受风险清单</h1>
                    <Popconfirm title="确定要保存吗？" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                    <Button 
                     icon="save" 
                     type="primary" 
                     >保存</Button>
                </Popconfirm>
                <Button 
                 icon="plus" 
                 type="primary" 
                 onClick={()=>this.onAddClick()}
                 style={{float:'right',marginRight:6}}
                 >添加</Button>
                <div style={{display:'inline-block',float:'right',marginRight:6}}>
                    <Upload
                     onChange = {(info)=>this.onFileChange(info)}
                     showUploadList={false}
                     beforeUpload={(file)=>{this.beforeUpload(file)}}
                     action={`${SERVICE_API}/excel/upload-api/`}
                    >
                        <Button type="primary" >
                            <Icon type="upload" /> 文件上传
                        </Button>
                    </Upload>
                </div>
                <Button 
                 icon="download" 
                 type="primary" 
                 onClick={()=>this.downExcelFrameWork()}
                 style={{float:'right',marginRight:6}}
                 >模板下载</Button>
                    <Table 
                     columns={columns} 
                     dataSource={dataSet}
                     bordered
                     style={{height:380,marginTop:40}}
                     pagination = {{pageSize:10}} 
                    />
                </Content>
                <Modal
                 title="编辑数据"
                 width={760}
                 visible={this.state.setEditVisiable}
                 onOk={()=>{this.setEditData("edit")}}
                 onCancel={()=>{this.goCancel()}}
                >
                    <EditData props={this.props} state={this.state} />
                </Modal>
                <Modal
                 title="新建数据"
                 width={760}
                 visible={this.state.setAddVisiable}
                 onOk={()=>{this.setEditData("add")}}
                 onCancel={()=>{this.goCancel()}}
                >
                    <AddData props={this.props} state={this.state} />
                </Modal>
            </div>
        );
    }
}
export default Form.create()(Unbearable);