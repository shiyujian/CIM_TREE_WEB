import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/quality';
import {actions as platformActions} from '_platform/store/global';
import {Row,Col,Table,Input,Button,message,Spin,Pagination} from 'antd';
import {getUser} from '_platform/auth'
import JianyanpiModal from '../components/Quality/JianyanpiModal'
import './quality.less'
import {WORKFLOW_CODE} from '_platform/api.js'
import {getNextStates} from '_platform/components/Progress/util';
import { getWorkflowDetail } from '../../Quality/store/defect';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,DataReportTemplate_SubdivisionUnitProjectAcceptance,NODE_FILE_EXCHANGE_API} from '_platform/api';
import Preview from '_platform/components/layout/Preview';
import JianyanpiDelete from '../components/Quality/JianyanpiDelete'

var moment = require('moment');
const Search = Input.Search;
@connect(
	state => {
		const {datareport: {qualityData = {}} = {}, platform} = state;
		return {...qualityData, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class JianyanpiData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible:false,
			dataSource:[],
			pagination:{
				//onChange:this.pageSizeChange.bind(this)
			},
			loading:false,
			totalData:null,
			selectedRowKeys:[],
			targetData:[],
			deletevisible:false,
		};
		this.columns = [{
            title:'序号',
            width:"5%",
			dataIndex:'key',
			render: (text,record,index) => (
				record.key + 1
			),
		},{
			title:'项目/子项目',
            dataIndex:'project',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.project ? record.project.name : '-'}
                </span>
            ),
		},{
			title:'单位工程',
            dataIndex:'unit',
            width:"13%",
            render: (text, record, index) => (
                <span>
                    {record.unit ? record.unit.name : '-'}
                </span>
            ),
		},{
			title:'WBS编码',
            dataIndex:'code',
            width:"13%",
		},{
			title:'名称',
            dataIndex:'name',
            width:"13%",
		},{
			title:'检验合格率',
            dataIndex:'rate',
            width:"8%",
            render: (text, record, index) => {
				if(record.rate){
					return (
						<span>
							{(parseFloat(record.rate)*100).toFixed(1) + '%'} 
						</span>
					)
				}else{
					return (<span>-</span>)
				}
			}
		},{
			title:'质量等级',
            dataIndex:'level',
			width:"12%",
			render:(text,record,index) => text ? text : '-'	
		},{
			title:'施工单位',
            dataIndex:'construct_unit',
            width:"12%",
            render: (text, record, index) => (
                <span>
                    {record.construct_unit ? record.construct_unit.name : "-"}
                </span>
            ),
		}, {
            title:'附件',
            width:"11%",
			render:(text,record,index) => {
				if(record.file && record.file.a_file){
					return (<span>
                        <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
				}else{
					return (<span>-</span>)
				}
			}
        }]
	}
	//预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
	componentDidMount(){
		const {actions:{getResouce,getWorkPackageDetail,getRelDoc}} = this.props
		this.setState({loading:true})
		getResouce({keyword:'_',obj_type:'C_WP_CEL'}).then(async rst => {
			let arr = rst.result
			for(let index = 0;index < 10;index++){
				let wp = await getWorkPackageDetail({code:arr[index].code})
				let rel_doc = wp.related_documents ? wp.related_documents.find(x => {
					return x.rel_type === 'many_jyp_rel'
				}) : null
				if(rel_doc){
					let doc = await getRelDoc({code:rel_doc.code})
					arr[index] = {...doc.extra_params,key:index}
					arr[index].related_documents = 	wp.related_documents					
				}else{
					let obj = await this.getInfo(wp)
					arr[index] = {...obj,key:index,file:{}}
				}
			}
			this.setState({totalData:rst.result,dataSource:arr,pagination:{	showSizeChanger:true,
				showQuickJumper:true,
				total:rst.result.length
				},loading:false})
			// Promise.all(wpActions).then(wps => {
			// 	wps.map(item => {
			// 		let rel_doc = item.related_documents ? item.related_documents.find(x => {
			// 			return x.rel_type === 'many_jyp_rel'
			// 		}) : null
			// 		if(rel_doc){
			// 			docActions.push(getRelDoc({code:rel_doc.code}))						
			// 		}
			// 		Promise.all(docActions).then(docs => {
			// 			docs.map(d => {
			// 				dataSource.push(d.extra_params)
			// 			})
			// 			this.setState({dataSource,loading:false})
			// 		})					
			// 	})
			// })
		})
	}
	//得到每条数据的信息
	//根据附件名称 也就是wbs编码获取其他信息
    async getInfo(wp){
        let res = {};
        const {actions:{getTreeRootNode}} = this.props
        res.name = wp.name
		res.code = wp.code  
        res.related_documents = wp.related_documents		
        res.pk = wp.pk
        res.obj_type = wp.obj_type
        let dwcode = ""
		let rootNode = await getTreeRootNode({code:wp.code})
		let project = rootNode.children[0]
		let danwei = project.children[0]
		console.log(rootNode.children.length + "................."+project.children.length)
        // let construct_unit = danwei.extra_params.unit.find(i => i.type === "施工单位")
        // res.construct_unit = construct_unit
        res.unit = {
            name:danwei.name,
            code:danwei.code,
            obj_type:danwei.obj_type
        }
        res.project = project
        return res
    }
	//表格分页回调
	handleChange = async(pagination, filters, sorter) => {
		const {actions:{getWorkPackageDetail,getRelDoc}} = this.props		
		this.setState({loading:true})
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		this.setState({
		  pagination: pager,
		});
		let arr = this.state.dataSource
		let pageSize = pagination.pageSize
		for(let index = (pagination.current-1)*pageSize;index < pagination.current*pageSize && index < this.state.dataSource.length;index++){
			if(arr[index].key+1){
				arr[index].key = index
				continue;
			}
			let wp = await getWorkPackageDetail({code:this.state.totalData[index].code})
			let rel_doc = wp.related_documents ? wp.related_documents.find(x => {
				return x.rel_type === 'many_jyp_rel'
			}) : null
			if(rel_doc){
				let doc = await getRelDoc({code:rel_doc.code})
				arr[index] = {...doc.extra_params,key:index}	
				arr[index].related_documents = 	wp.related_documents			
			}else{
				let obj = await this.getInfo(wp)
				arr[index] = {...obj,key:index,file:{}}
			}
		}
		this.setState({dataSource:arr,loading:false})
	}
	// async pageSizeChange(page, pageSize){
	// 	const {actions:{getWorkPackageDetail,getRelDoc}} = this.props		
	// 	this.setState({loading:true})
	// 	const pager = { ...this.state.pagination };
	// 	pager.current = pagination.current;
	// 	this.setState({
	// 	  pagination: pager,
	// 	});
	// 	let arr = this.state.dataSource
	// 	for(let index = (pagination.current-1)*10;index < pagination.current*10 && index < this.state.dataSource.length;index++){
	// 		if(arr[index].key+1){
	// 			arr[index].key = index
	// 			continue;
	// 		}
	// 		let wp = await getWorkPackageDetail({code:this.state.totalData[index].code})
	// 		let rel_doc = wp.related_documents ? wp.related_documents.find(x => {
	// 			return x.rel_type === 'many_jyp_rel'
	// 		}) : null
	// 		if(rel_doc){
	// 			let doc = await getRelDoc({code:rel_doc.code})
	// 			arr[index] = {...doc.extra_params,key:index}	
	// 			arr[index].related_documents = 	wp.related_documents			
	// 		}else{
	// 			let obj = await this.getInfo(wp)
	// 			arr[index] = {...obj,key:index,file:{}}
	// 		}
	// 	}
	// 	this.setState({dataSource:arr,loading:false})
	// }
	//批量上传回调
	setData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"检验批验收信息批量录入",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"检验批验收信息批量录入",
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
						this.setState({addvisible:false})	
						if(this.state.targetData.length){
							this.setState({targetData:[],selectedRowKeys:[]})
						}
						message.info("发起成功")					
					})
		})
	}
	//删除回调
	delData(data,participants){
		const {actions:{ createWorkflow, logWorkflowEvent }} = this.props
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"检验验收信息批量删除",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"检验验收信息批量删除",
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
                    note:'发起批量删除',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
                    attachment:null}).then(() => {
						this.setState({deletevisible:false})
						if(this.state.targetData.length){
							this.setState({targetData:[],selectedRowKeys:[]})
						}	
						message.info("发起成功")					
					})
		})
	}
	oncancel(){
		this.setState({addvisible:false,deletevisible:false,targetData:[]})
	}
	setAddVisible(){
		this.setState({targetData:[],addvisible:true})		
	}
	setEditVisible(){
		let {selectedRowKeys,targetData,dataSource} = this.state
		if(selectedRowKeys.length === 0){
			message.info('请先选择数据')
			return
		}
		selectedRowKeys.map(i => {
			targetData.push({...dataSource[i]})
		})
		this.setState({targetData,addvisible:true})
	}
	setDelVisible(){
		let {selectedRowKeys,targetData,dataSource} = this.state
		if(selectedRowKeys.length === 0){
			message.info('请先选择数据')
			return
		}
		selectedRowKeys.map(i => {
			targetData.push(dataSource[i])
		})
		this.setState({targetData,deletevisible:true})
	}
	// table row selected onchange
    onSelectChange = (selectedRowKeys,selectedRows) => {
		console.log(selectedRowKeys)
    	this.setState({selectedRowKeys})
	}
	//搜索
	async onSearch(value){
		this.setState({loading:true})
		let {totalData} = this.state
		const {actions:{getWorkPackageDetail,getRelDoc}} = this.props
		let dataSource = totalData.filter(o => {
			return (o.name.indexOf(value) > -1) || (o.code.indexOf(value) > -1)
		})
		for(let index = 0;index < 10;index++){
			if(dataSource[index].key+1){
				dataSource[index].key = index
				continue;
			}
			let wp = await getWorkPackageDetail({code:dataSource[index].code})
			let rel_doc = wp.related_documents ? wp.related_documents.find(x => {
				return x.rel_type === 'many_jyp_rel'
			}) : null
			if(rel_doc){
				let doc = await getRelDoc({code:rel_doc.code})
				dataSource[index] = {...doc.extra_params,key:index}
				dataSource[index].related_documents = 	wp.related_documents					
			}else{
				let obj = await this.getInfo(wp)
				dataSource[index] = {...obj,key:index,file:{}}
			}
		}
		this.setState({dataSource,pagination:{total:dataSource.length,current:1},loading:false})
	}
	render() {
		const { selectedRowKeys } = this.state;
    	const rowSelection = {
        	selectedRowKeys,
        	onChange: this.onSelectChange,
    	};
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title="检验批信息" {...this.props}/>
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">
						<a href={`${DataReportTemplate_SubdivisionUnitProjectAcceptance}`}>模板下载</a>
					</Button>
					<Button className="btn" type="default" onClick={this.setAddVisible.bind(this)}>发起填报</Button>
					<Button className="btn" type="default" onClick={this.setEditVisible.bind(this)}>申请变更</Button>
					<Button className="btn" type="default" onClick={this.setDelVisible.bind(this)}>申请删除</Button>
					<Button className="btn" type="default" onClick={this.getExcel.bind(this)}>导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={this.onSearch.bind(this)}
						enterButton/>
				</Row>
				<Spin spinning={this.state.loading}>
					<Row>
						<Col>
							<Table 
							 columns={this.columns} 
							 dataSource={this.state.dataSource} 
							 rowKey="key"
							 pagination={this.state.pagination}
							 onChange={this.handleChange}
							 rowSelection={rowSelection}
							/>
						</Col> 
					</Row>
					<Preview />
				</Spin>
				{
					this.state.addvisible &&
					<JianyanpiModal {...this.props} editData={this.state.targetData} oncancel={this.oncancel.bind(this)} visible={this.state.addvisible} onok={this.setData.bind(this)}/>
				}
				{
					this.state.deletevisible &&
					<JianyanpiDelete {...this.props} visible={this.state.deletevisible} deleteData={this.state.targetData} oncancel={this.oncancel.bind(this)} onok={this.delData.bind(this)}/>
				}
			</div>
		);
	}
	createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
	getExcel(){
		let { selectedRowKeys } = this.state
		if(selectedRowKeys.length === 0){
			message.info("请选择导出数据")
			return
		}
		let tableData = selectedRowKeys.map(i => {
			return this.state.dataSource[i]
		})
		let exhead = ['序号','项目/子项目','单位工程','WBS编码','名称','检验合格率','质量等级','施工单位'];
		let rows = [exhead];
		let excontent =tableData.map((data,index)=>{
			let con_name = data.construct_unit ? data.construct_unit.name : '暂无'
			return [index,data.project.name,data.unit.name,data.code,data.name,data.rate,data.level,con_name,];
		});
		rows = rows.concat(excontent);
		const {actions:{jsonToExcel}} = this.props;
        jsonToExcel({},{rows:rows}).then(rst => {
            console.log(rst);
            this.createLink('检验信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
	}
}
