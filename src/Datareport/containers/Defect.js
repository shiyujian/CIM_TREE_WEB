import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/quality';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message,notification} from 'antd';
import {getUser} from '_platform/auth';
import DefectModal from '../components/Quality/DefectModal';
import EditFile from '../components/Quality/EditFile';
import DeleteFile from '../components/Quality/DeleteFile';
import './quality.less'
import {WORKFLOW_CODE} from '_platform/api.js';
import {getNextStates} from '_platform/components/Progress/util';
const Search = Input.Search;
var moment = require('moment');
@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Defect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource:[],
            dataSourceSelected:[],
            selectedRowKeys: [],
            setAddVisiable:false,
            setEditVisiable:false,
            setDeleteVisiable:false,
            loading:false,
		};
		this.columns = [{
				title:'序号',
				render:(text,record,index) => {
					return index+1
				}
			},{
				title:'项目/子项目名称',
				dataIndex:'projectName'
			},{
				title:'单位工程',
				dataIndex:'unit'
			},{
				title:'WBS编码',
				dataIndex:'code'
			},{
				title:'责任单位',
				dataIndex:'respon_unit'
			},{
				title:'事故类型',
				dataIndex:'acc_type'
			},{
				title:'上报时间',
				dataIndex:'uploda_date'
			},{
				title:'核查时间',
				dataIndex:'check_date'
			},{
				title:'整改时间',
				dataIndex:'do_date'
			},{
				title:'事故描述',
				dataIndex:'descrip'
			},{
				title:'排查结果',
				dataIndex:'check_result'
			},{
				title:'整改期限',
				dataIndex:'deadline'
			},{
				title:'整改结果',
				dataIndex:'result'
			}, {
				title:'附件',
				render:(text,record,index) => {
					return <span>
						<a>预览</a>
						<span className="ant-divider" />
						<a>下载</a>
					</span>
				}
		}];
	}
	goCancel = () =>{
        this.setState({setAddVisiable:false,setDeleteVisiable:false,setEditVisiable:false});
	}
	onBtnClick = (type) =>{
        const {dataSourceSelected} = this.state;
        if(type==="add"){
            this.setState({setAddVisiable:true});
        }else if(type==="delete" && dataSourceSelected.length!== 0){
            this.setState({setDeleteVisiable:true});
        }else if(type==="edit" && dataSourceSelected.length!== 0){
            this.setState({setEditVisiable:true});
        }else if(type!=="add" && dataSourceSelected.length===0){
            notification.warning({
				message: '请先选择数据',
				duration: 2
			});
        }
    }
	async componentDidMount(){
        const {actions:{
            getScheduleDir,
            postScheduleDir,
        }} = this.props;
        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_defect_bubu'});
            if(dir.obj_type){
                if(dir.stored_documents.length>0){
                    this.generateTableData(dir.stored_documents);
                }
            }
        }
	}
	async generateTableData(data){
        const {actions:{
            getDocumentList,
        }} = this.props;
        let dataSource = [];
        let codeList = [];
        data.map(item =>{
            codeList.push(item.code);
        })
        this.setState({loading:true})
        let docList = await getDocumentList({},{list:codeList});
        if(docList.result){
            let i=0;
            docList.result.map((single)=>{
                let temp = { 
                    key:i,
                    code:single.extra_params.code,
                    respon_unit:single.extra_params.respon_unit,
                    acc_type:single.extra_params.acc_type,
                    uploda_date:single.extra_params.uploda_date,
                    check_date:single.extra_params.check_date,
                    unit:single.extra_params.unit,
                    projectName:single.extra_params.project,
                    do_date:single.extra_params.do_date,
                    descrip:single.extra_params.descrip,
                    file:single.basic_params.files[0],
                    check_result:single.extra_params.check_result,
					deadline:single.extra_params.deadline,
					result:single.extra_params.result,
                    docCode:single.code
                }
				i++;
				debugger
                dataSource.push(temp);
            });
        }
        this.setState({dataSource,loading:false});
	}
	setDeleteData = (data,participants) =>{
        const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"质量缺陷信息批量删除",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"质量缺陷信息批量删除",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
                        notification.success({
							message: '发起成功！',
							duration: 2
						});		
						this.setState({setDeleteVisiable:false})						
					})
		})
    }
	setEditData = (data,participants) =>{
        const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"质量缺陷信息批量变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"质量缺陷信息批量变更",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
                        notification.success({
							message: '发起成功！',
							duration: 2
						});		
						this.setState({setEditVisiable:false})						
					})
		})
    }
	//批量上传回调
	setAddData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"质量缺陷信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"质量缺陷信息批量录入",
			subject:[{
				data:JSON.stringify(data)
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		//发起流程
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
                {
                    state:rst.current[0].id,
                    action:'提交',
                    note:'发起填报',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
						this.setState({setAddVisiable:false})	
						notification.success({
							message: '发起成功！',
							duration: 2
						});		
					})
		})
	}
	async onSearch(value){
		if(!value){
            this.componentDidMount();
            return;
        }
        const {actions:{
            searchDocument,
        }} = this.props;
        const param = {
            docCode:'hiddenDanger',
            keys:'wbs',
            values:value
        }
        let result = await searchDocument(param);
        let dataSource = [];
        if(result.result && result.result.length>0){
            if(result.result){
                result.result.map((single)=>{
                    let temp = { 
                        code:single.extra_params.code,
                        wbs:single.extra_params.wbs,
                        type:single.extra_params.type,
                        upTime:single.extra_params.upTime,
                        checkTime:single.extra_params.checkTime,
                        editTime:single.extra_params.editTime,
                        unit:single.extra_params.unit,
                        projectName:single.extra_params.project,
                        result:single.extra_params.result,
                        resUnit:single.extra_params.resUnit,
                        file:single.basic_params.files[0],
                        deadline:single.extra_params.deadline,
                        editResult:single.extra_params.editResult,
                        docCode:single.code
                    }
                    dataSource.push(temp);
                });
                this.setState({dataSource});
            }
        }else{
            this.setState({dataSource});
        }
	}
	onSelectChange = (selectedRowKeys) => {
        const {dataSource} = this.state;
        let dataSourceSelected = [];
        for(let i=0;i<selectedRowKeys.length;i++){
            dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        }
        this.setState({selectedRowKeys,dataSourceSelected});
    }
	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="质量缺陷" {...this.props}/>
				<Row style={{ marginBottom: "30px" }}>
                        <Col>
                            <Button 
                            style={{ marginRight: "30px" }}
                            onClick={()=>this.download()}
                            >模板下载</Button>
                            <Button 
                            style={{ marginRight: "30px" }}
                            onClick={()=>this.onBtnClick("add")}
                            >发起填报</Button>
                            <Button 
                            style={{ marginRight: "30px" }}
                            onClick={()=>this.onBtnClick("edit")}>申请变更</Button>
                            <Button 
                            style={{ marginRight: "30px" }}
                            onClick={()=>this.onBtnClick("delete")}>申请删除</Button>
                            <Button 
                            onClick={()=>this.getExcel()}
                            style={{ marginRight: "30px" }}>导出表格</Button>
                            <Search
                                placeholder="请输入WBS编码"
                                onSearch={this.onSearch.bind(this)}
                                style={{ width: 200, marginLeft: "20px" }}
                            />
                        </Col>
                    </Row>
				<Row >
					<Col >
						<Table 
						 columns={this.columns} 
						 dataSource={this.state.dataSource}
						 bordered
						 loading={this.state.loading}
						 rowSelection={rowSelection}  
						 pagination = {{showQuickJumper:true,showSizeChanger:true}}/>
					</Col>
				</Row>
				{
					this.state.setAddVisiable &&
					<DefectModal {...this.props} oncancel={this.goCancel.bind(this)} akey={Math.random()*1234} onok={this.setAddData.bind(this)}/>
                }
                {
                    this.state.setDeleteVisiable &&
                    <DeleteFile {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} akey={Math.random()} onok={this.setDeleteData.bind(this)} />
                }
                {
                    this.state.setEditVisiable &&
                    <EditFile {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} akey={Math.random()} onok={this.setEditData.bind(this)} />
                }
			</div>
		);
	}
}
