import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/riskEvaluation';
import EditData from '../components/RiskEvaluation/EditData'
import {SERVICE_API} from '_platform/api';
import AddData from '../components/RiskEvaluation/AddData'
import {actions as platformActions} from '_platform/store/global';
import styles from './RiskEvaluation.css';
//import ProjectTree from '../components/Treatment/ProjectTree';
import WorkPackageTree from '../components/WorkPackageTree';
import moment from 'moment';
import {
    SMUrl_template12,
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
		const {safety: {riskEvaluation = {}} = {}, platform} = state;
		return {riskEvaluation, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)

class RiskEvaluation extends Component {
	static propTypes = {};
    constructor(){
        super();
        this.state = {
            record:{},
            setEditVisiable:false,
            setAddVisiable:false,
            index:'-1',
            dataSet:[{danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'},
                    {danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'},
                    {danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'},
                    {danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'},
                    {danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'},
                    {danageSource:'来自人马星球的威胁',l:'pw15',e:'de15',c:'cn15',d:'inall450',danagelevel:'level-30',danageControl:'We Fight!!',date:'2017-06-09'}],
            selectRowkeys:[],
            code:'',
            rst:''
        }
    }

    onEditClick = (record,index) => {
        this.setState({record:record,index:index,setEditVisiable:true});
    }

    onAddClick = () =>{
    	this.setState({setAddVisiable:true});
    }

    goCancel(){
        this.setState({setEditVisiable:false,setAddVisiable:false});
    }

    onConfirm = () =>{
        // const data = [];
        // const code = this.state.code;
        // const rst = this.state.rst;
        // const { 
        //     actions: { 
        //         putToWorkpackage,
        //         getWorkpackages
        //     } 
        // } = this.props;
        // if(rst.version && rst.status){
        //     getWorkpackages({code:code}).then((rst) => {
        //         if(rst.extra_param.riskEvaluation && rst.extra_param.riskEvaluation!==""){
        //             data = rst.extra_param.riskEvaluation;
        //         }
        //     });
        //     let postData0 = {};
        //     let postData1 = {};
        //     postData0.riskEvaluation = "";
        //     postData0.version = rst
        //     postData1.riskEvaluation = JSON.stringify(data);
    
        //     debugger
        //     putToWorkpackage({code:code},{})
        //     putToWorkpackage({code:code},data).then((rst) =>{
        //         if(rst.code){
        //             message.info('保存成功.');
        //         }else{
        //             message.info('保存失败.');
        //         }
        //     });
        // }else{
        //     message.info('未获取到目录树信息.');
        // }
    }

    downExcelFrameWork = (e) => {
        let apiGet = SMUrl_template12;
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
                    l: dataList[i][1],
                    e: dataList[i][2],
                    c: dataList[i][3],
                    d: dataList[i][4],
                    danagelevel: dataList[i][5],
                    danageControl: dataList[i][6],
                    date: dataList[i][7],
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

    onDeleteConfirm = () =>{
        const {selectRowkeys,dataSet} = this.state;
        let datas = [];
        for(let i=0;i<dataSet.length;i++){
            if(selectRowkeys.indexOf(i)===-1){
                datas.push(dataSet[i]);
            }
        }
        this.setState({dataSet:datas});
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

    setEditData(type){
        this.props.form.validateFields((err,values) => {
            if(!err){
                let datas = this.state.dataSet;
                values.date = moment(values.date._d).format('YYYY-MM-DD');
                if(type==="add"){
                	datas.push(values);
                }else if(type==="edit"){
                	datas.splice(this.state.index,1,values);
                }
                this.setState({setEditVisiable:false,dataSet:datas,setAddVisiable:false});
            }
        }); 
    }

    onSelectChange = (selectRowkeys) =>{
    	this.setState({selectRowkeys});
    }

	render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const {selectRowkeys} = this.state;
        const rowSelection = {
	      selectRowkeys,
	      onChange: this.onSelectChange,
	    };
        const hasSelected = selectRowkeys.length > 0;
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
                title:'危险源',
                dataIndex:'danageSource',
                width: '20%'
            },{
                title:'作业条件风险性评价法',
                children:[{
                    title:'L(事故发生的可能性)',
                    dataIndex:'l',
                    key:'l',
                    width: '5%'
                },{
                    title:'E(人员暴露于危险环境中的频繁程度)',
                    dataIndex:'e',
                    key:'e',
                    width: '5%'
                },{
                    title:'C(发生事故可能造成的后果)',
                    dataIndex:'c',
                    key:'c',
                    width: '5%'
                },{
                    title:'D(总计 D>=160)',
                    dataIndex:'d',
                    key:'d',
                    width: '10%'
                }],
            },{
                title:'风险级别',
                dataIndex:'danagelevel',
                width: '12.5%'
            },{
                title:'风险控制措施',
                dataIndex:'danageControl',
                width: '15%'
            },{
                title:'上传日期',
                dataIndex:'date',
                width: '12.5%'
            },{
                title:'操作',
                dataIndex:'opt',
                width: '5%',
                render: (text,record,index) => {
                    return <div><a href='#' onClick={()=>{this.onEditClick(record,index)}}>编辑</a></div>
                }
            }
        ];
                    
		return (
			<div className={styles.riskevaluation}>
				<DynamicTitle title="风险评价" {...this.props}/>
				<Sidebar>
                    <WorkPackageTree {...this.props}
                        onSelect={this.onSelect.bind(this)} />
				</Sidebar>

				<Content>
    				<h1 style={{textAlign:'center'}}>危险源风险评价表</h1>
                    <Popconfirm title="确定要保存吗？" okText="Yes" cancelText="No" onConfirm={()=>this.onConfirm()}>
                        <Button 
                         icon="save" 
                         type="primary" 
                         >保存</Button>
                    </Popconfirm>
                    <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={()=>this.onDeleteConfirm()}>
                        <Button 
                         icon="close" 
                         type="primary" 
                         disabled={!hasSelected}
                         style={{float:'right',marginRight:6}}
                         >删除</Button>
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
                                <Icon type="upload" /> 批量添加
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
                     rowSelection={rowSelection}
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
    onSelect(selectedKeys, e) {
        const { 
            actions: { 
                putToWorkpackage,
                getWorkpackages, 
            } 
        } = this.props;

        this.setState({
            code: selectedKeys[0],
        });
        if (!e.selected) {
            return
        }
        // getWorkpackages({code:selectedKeys[0]}).then((rst) => {
        //     if(rst.extra_param.riskEvaluation && rst.extra_param.riskEvaluation!==""){
        //         this.setState({dataSet:rst.extra_param.riskEvaluation});
        //     }
        //     this.setState({rst:rst});
        // });
    }
}
export default Form.create()(RiskEvaluation);