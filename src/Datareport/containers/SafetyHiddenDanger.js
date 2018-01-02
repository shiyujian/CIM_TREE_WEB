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
    Progress
} from 'antd';
import {actions as safetyAcitons} from '../store/safety';
import {actions} from '../store/quality';
import {getUser} from '_platform/auth';
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_SafetyHiddenDanger} from '_platform/api.js';
import { actions as platformActions } from '_platform/store/global';
import AddFile from '../components/SafetyHiddenDanger/AddFile';
import DeleteFile from '../components/SafetyHiddenDanger/DeleteFile';
import EditFile from '../components/SafetyHiddenDanger/EditFile';
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
class SafetyHiddenDanger extends Component {
    constructor() {
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
    goCancel = () =>{
        this.setState({setAddVisiable:false,setDeleteVisiable:false,setEditVisiable:false});
    }

    async componentDidMount(){
        const {actions:{
            getScheduleDir,
            postScheduleDir,
        }} = this.props;
        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_hiddendanger_1112'});
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
                i++;
                dataSource.push(temp);
            });
        }
        this.setState({dataSource,loading:false});
    }

    setAddData = (data,participants) => {
        const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"安全隐患信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全隐患信息批量录入",
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
						this.setState({setAddVisiable:false})						
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
			name:"安全隐患信息批量删除",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全隐患信息批量删除",
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
						this.setState({setDeleteVisiable:false})						
					})
		})
    }

    onBtnClick = (type) =>{
        if(type==="add"){
            this.setState({setAddVisiable:true});
        }else if(type==="delete"){
            this.setState({setDeleteVisiable:true});
        }else if(type==="edit"){
            this.setState({setEditVisiable:true});
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
    setEditData = (data,participants) =>{
        const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"安全隐患信息批量变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"安全隐患信息批量变更",
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
						this.setState({setEditVisiable:false})						
					})
		})
    }
    
    download(){
        let apiGet = `${DataReportTemplate_SafetyHiddenDanger}`;
        this.createLink(this,apiGet);
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

    render() {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
        const columns = [
            {
                title: '编码',
                dataIndex: 'code',
                width: '8%'
            }, {
                title: '项目名称',
                dataIndex: 'projectName',
                width: '8%',
            }, {
                title: '单位工程',
                dataIndex: 'unit',
                width: '8%',
            }, {
                title: 'WBS',
                dataIndex: 'wbs',
                width: '8%',
            }, {
                title: '责任单位',
                dataIndex: 'resUnit',
                width: '8%',
            }, {
                title: '隐患类型',
                dataIndex: 'type',
                width: '5%',
            }, {
                title: '上报时间',
                dataIndex: 'upTime',
                width: '9%',
            }, {
                title: '核查时间',
                dataIndex: 'checkTime',
                width: '9%',
            }, {
                title: '整改时间',
                dataIndex: 'editTime',
                width: '9%',
            }, {
                title: '排查结果',
                dataIndex: 'result',
                width: '6%',
            }, {
                title: '整改期限',
                dataIndex: 'deadline',
                width: '8%',
            }, {
                title: '整改结果',
                dataIndex: 'editResult',
                width: '6%',
            }, {
                title:'附件',
                width:'5%',
                render:(text,record,index) => {
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,recoed)}>预览</a>
                            <span className="ant-divider" />
                            <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                        </span>)
                }
            }
        ];
        return (
            <Main>
                <DynamicTitle title="安全隐患" {...this.props} />
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
                                placeholder="请输入WBS编码"
                                onSearch={this.onSearch.bind(this)}
                                style={{ width: 200, marginLeft: "20px" }}
                            />
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                        loading={this.state.loading}
                        rowSelection={rowSelection}                        
                        style={{ height: 380, marginTop: 20 }}
                        pagination = {{showQuickJumper:true,showSizeChanger:true}} 
                    />
                </Content>
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
        const {dataSource} = this.state;
        let rows = [];
        rows.push(this.header);
        dataSource.map(item => {
            rows.push([item.code,
                item.wbs,
                item.type,
                item.upTime,
                item.checkTime,
                item.editTime,
                item.result,
                item.unit,
                item.projectName,
                item.resUnit,
                item.deadline,
                item.editResult]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
};
export default Form.create()(SafetyHiddenDanger);