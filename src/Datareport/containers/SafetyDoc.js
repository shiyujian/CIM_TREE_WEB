import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
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
    Progress,
    message
} from 'antd';
import {actions as safetyAcitons} from '../store/safety';
import {actions} from '../store/quality';
import {getUser} from '_platform/auth';
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_SafetyFile} from '_platform/api.js';
import { actions as platformActions } from '_platform/store/global';
import AddFile from '../components/SafetyDoc/AddFile';
import DeleteFile from '../components/SafetyDoc/DeleteFile';
import EditFile from '../components/SafetyDoc/EditFile';
import {getNextStates} from '_platform/components/Progress/util';
import Preview from '../../_platform/components/layout/Preview';
var moment = require('moment');
const Search = Input.Search;

@connect(
	state => {
		const {datareport: {qualityData = {},safety = {}} = {}, platform} = state;
		return {...qualityData,...safety, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions,...safetyAcitons}, dispatch)
	})
)
class SafetyDoc extends Component {
	constructor(){
        super();
        this.state = {
            dataSource:[],
            dataSourceSelected:[],
            selectedRowKeys: [],
            setAddVisiable:false,
            setEditVisiable:false,
            setDeleteVisiable:false,
            loading:false,
        }
    }
    
    download(){
        let apiGet = `${DataReportTemplate_SafetyFile}`;
        this.createLink(this,apiGet);
    }
    
    async componentDidMount(){
        const {actions:{
            getScheduleDir,
            postScheduleDir,
        }} = this.props;
        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_safetydoc_1112'});
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
        this.setState({loading:true});
        let docList = await getDocumentList({},{list:codeList});
        if(docList.result){
            let i=0;
            docList.result.map((single)=>{
                let temp = { 
                    key:i,
                    code:single.extra_params.code,
                    remark:single.extra_params.remark,
                    doTime:single.extra_params.doTime,
                    filename:single.extra_params.filename,
                    pubUnit:single.extra_params.pubUnit,
                    upPeople:single.extra_params.upPeople,
                    type:single.extra_params.type,
                    file:single.basic_params.files[0],
                    unit:single.extra_params.unit,
                    projectName:single.extra_params.project,
                    docCode:single.code
                }
                i++;
                dataSource.push(temp);
            });
        }
        this.setState({dataSource,loading:false});
    }

	goCancel = () =>{
        this.setState({setAddVisiable:false,setDeleteVisiable:false,setEditVisiable:false});
    }
    onSelectChange = (selectedRowKeys) => {
        const {dataSource} = this.state;
        let dataSourceSelected = [];
        for(let i=0;i<selectedRowKeys.length;i++){
            dataSourceSelected.push(dataSource[selectedRowKeys[i]]);
        }
        this.setState({selectedRowKeys,dataSourceSelected});
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
			name:"安全管理信息批量变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全管理信息批量变更",
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
                        message.warning('发起流程成功');
						this.setState({setEditVisiable:false})						
					})
		})
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
			name:"安全管理信息批量删除",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全管理信息批量删除",
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
                        message.warning('发起流程成功');
						this.setState({setDeleteVisiable:false})						
					})
		})
    }

	setAddData = (data,participants) =>{
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"安全管理信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全管理信息批量录入",
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
                        message.warning('发起流程成功');
						this.setState({setAddVisiable:false})						
					})
		})
	}
	onBtnClick = (type) =>{
        const {dataSourceSelected} = this.state;
        if(type==="add"){
            this.setState({setAddVisiable:true});
        }else if(type==="delete" && dataSourceSelected.length!== 0){
            this.setState({setDeleteVisiable:true});
        }else if(type==="edit" && dataSourceSelected.length !== 0){
            this.setState({setEditVisiable:true});
        }else if(type!=="add" && dataSourceSelected.length===0){
            message.warning('请先选择数据');
        }
    }
    
    handlePreview(record){
        const {actions: {openPreview}} = this.props;
        let filed = {};
        filed.misc = record.file.misc;
        filed.a_file = `${SOURCE_API}` + (record.file.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (record.file.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = record.file.name;
        filed.mime_type = record.file.mime_type;
        openPreview(filed);
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
            docCode:'safetydoc',
            keys:'filename',
            values:value
        }
        let result = await searchDocument(param);
        let dataSource = [];
        if(result.result && result.result.length>0){
            if(result.result){
                result.result.map((single)=>{
                    let temp = { 
                        code:single.extra_params.code,
                        remark:single.extra_params.remark,
                        doTime:single.extra_params.doTime,
                        filename:single.extra_params.filename,
                        pubUnit:single.extra_params.pubUnit,
                        upPeople:single.extra_params.upPeople,
                        type:single.extra_params.type,
                        file:single.basic_params.files[0],
                        unit:single.extra_params.unit,
                        projectName:single.extra_params.project,
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
	
	render() {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const columns = [
            {
                title:'文档编码',
                dataIndex:'code',
                width: '10%'
            },{
                title:'项目名称',
                dataIndex:'projectName',
                width: '10%',
            },{
                title:'单位工程',
                dataIndex:'unit',
                width: '10%',
            },{
                title:'文件名称',
                dataIndex:'filename',
                width: '10%',
            },{
                title:'发布单位',
                dataIndex:'pubUnit',
                width: '10%',
            },{
                title:'版本号',
                dataIndex:'type',
                width: '10%',
            },{
                title:'实施日期',
                dataIndex:'doTime',
                width: '10%',
            },{
                title:'备注',
                dataIndex:'remark',
                width: '10%',
            },{
                title:'提交人',
                dataIndex:'upPeople',
                width: '10%',
            }, {
                title:'附件',
                width:'10%',
                render:(text,record,index) => {
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,record)}>预览</a>
                            <span className="ant-divider" />
                            <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                        </span>)
                }
            }
        ];
		return (
            <Main>
            <DynamicTitle title="安全文档" {...this.props} />
				<Content>
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
                            className="btn"
                            placeholder="请输入文件名称"
                            onSearch={this.onSearch.bind(this)}
                            style={{ width: 200, marginLeft: "20px" }}
                        />
                    </Col>
                </Row>
                
					<Table 
					 columns={columns} 
					 dataSource={this.state.dataSource}
                     bordered
                     rowSelection={rowSelection}
                     style={{height:180,marginTop:20}}
                     loading={this.state.loading}
                    //  pagination={{defaultPageSize:5}}
					 pagination = {{showQuickJumper:true,showSizeChanger:true}} 
					/>
                </Content>
                <Preview />
				{
					this.state.setAddVisiable &&
					<AddFile {...this.props} oncancel={this.goCancel.bind(this)} akey={Math.random()*1234} onok={this.setAddData.bind(this)}/>
                }
                {
                    this.state.setDeleteVisiable &&
                    <DeleteFile {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} akey={Math.random()} onok={this.setDeleteData.bind(this)} />
                }
                {
                    this.state.setEditVisiable &&
                    <EditFile {...this.props} {...this.state} oncancel={this.goCancel.bind(this)} akey={Math.random()} onok={this.setEditData.bind(this)} />
                }
			</Main>)
    }
    //下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    //数据导出
    getExcel(){
        const {actions:{jsonToExcel}} = this.props;
        const {dataSourceSelected} = this.state;
        if(dataSourceSelected.length === 0){
        	message.warning('请先选择数据再导出')
        	return
        }
        let rows = [];
        rows.push(this.header);
        dataSourceSelected.map(item => {
            rows.push([item.code,item.remark,item.doTime,item.filename,item.pubUnit,item.upPeople,item.type,item.unit,item.projectName]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
};
export default Form.create()(SafetyDoc);