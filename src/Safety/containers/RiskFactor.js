import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/riskFactor';
import {SERVICE_API} from '_platform/api';
import EditData from '../components/RiskFactor/EditData';
import AddData from '../components/RiskFactor/AddData';
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
// import ProjectTree from '../components/Treatment/ProjectTree';
import WorkPackageTree from '../components/WorkPackageTree';
import moment from 'moment';
import {
    SMUrl_template14,
} from '_platform/api';
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

@connect(
    state => {
        const {safety: {riskFactor = {}} = {}, platform} = state;
        return {riskFactor, platform}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class RiskFactor extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setEditVisiable:false,
            setAddVisiable:false,
            index:'-1',
            dataSet:[{danageSource:'清理核污染',impltime:'2020-06-20',comptime:'2018-09-20',plan:'逃跑',argument:'方案可行',chargeAppr:'审批通过',unitAppr:'审批通过',education:'可行的',date:'2030-09-20'},
            {danageSource:'清理核污染',impltime:'2020-06-20',comptime:'2018-09-20',plan:'逃跑',argument:'方案可行',chargeAppr:'审批通过',unitAppr:'审批通过',education:'可行的',date:'2030-09-20'},
            {danageSource:'清理核污染',impltime:'2020-06-20',comptime:'2018-09-20',plan:'逃跑',argument:'方案可行',chargeAppr:'审批通过',unitAppr:'审批通过',education:'可行的',date:'2030-09-20'},
            {danageSource:'清理核污染',impltime:'2020-06-20',comptime:'2018-09-20',plan:'逃跑',argument:'方案可行',chargeAppr:'审批通过',unitAppr:'审批通过',education:'可行的',date:'2030-09-20'},
            {danageSource:'清理核污染',impltime:'2020-06-20',comptime:'2018-09-20',plan:'逃跑',argument:'方案可行',chargeAppr:'审批通过',unitAppr:'审批通过',education:'可行的',date:'2030-09-20'},],
        }
    }

    onEditClick(record,index){
        this.setState({record:record,index:index,setEditVisiable:true})
    }

    onAddClick = () =>{
    	this.setState({setAddVisiable:true});
    }

    downExcelFrameWork = (e) => {
        let apiGet = SMUrl_template14;
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
                    danageSource: dataList[i][0],
                    impltime: dataList[i][1],
                    comptime: dataList[i][2],
                    plan: dataList[i][3],
                    argument: dataList[i][4],
                    chargeAppr: dataList[i][5],
                    unitAppr: dataList[i][6],
                    education: dataList[i][7],
                    date:moment().format('YYYY-MM-DD'),
                });
            }
            this.setState({
                dataSet:scheduleMaster
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
                values.impltime = moment(values.impltime._d).format('YYYY-MM-DD');
                values.comptime = moment(values.comptime._d).format('YYYY-MM-DD');
                values.date = moment().format('YYYY-MM-DD');
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
                title:'重大危险源项目',
                dataIndex:'danageSource',
                width: '18%'
            },{
                title:'工程计划实施时间',
                dataIndex:'impltime',
                width: '9%'
            },{
                title:'施工方案编制时间',
                dataIndex:'comptime',
                width: '9%'
            },{
                title:'专项应急预案',
                dataIndex:'plan',
                width: '9%'
            },{
                title:'专家论证',
                dataIndex:'argument',
                width: '9%'
            },{
                title:'施工单位技术负责人审批',
                dataIndex:'chargeAppr',
                width: '9%'
            },{
                title:'监理单位总监审批',
                dataIndex:'unitAppr',
                width: '9%'
            },{
                title:'安全教育和技术交底',
                dataIndex:'education',
                width: '9%'
            },{
                title:'上传日期',
                dataIndex:'date',
                width: '9%'
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
                <DynamicTitle title="确定因素" {...this.props}/>

                <Sidebar>
                    <WorkPackageTree />
                </Sidebar>

                <Content>
                    <h1 style={{textAlign:'center'}}>确定重大危险因素</h1>
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
export default Form.create()(RiskFactor);