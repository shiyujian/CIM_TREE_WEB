import React, {Component} from 'react';
import {Table, Tabs, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio } from 'antd';
import moment from 'moment';
import {getUser} from '../../../_platform/auth';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/infoShow';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NODE_FILE_EXCHANGE_API} from '../../../_platform/api';
const TabPane = Tabs.TabPane;
const user_id = getUser().id;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;


@connect(
	state => {
		const {cost:{infoShow = {jxka:'1213'}},platform} = state;
		return {...infoShow,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions,...platformActions}, dispatch),
	}),
)

export default class InfoShowTab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type:'0',//表示tab页的种类 0 为概算 1 为合同 2 结算
			value:undefined,
			subsection:[],//单位工程下拉框选项
			subsubsection:[],//子单位工程下拉框选项
			subProject:'',//单位
			subProject1:'',//子单位
			unit:'',//分项
			unit1:'',//子分项
			units:[],//分项的下拉框选项
			subUnits:[],//子分项
			tableData:[],//表格数据
		}
		//下载excel表头
		this.estimateHeader = 
					["分部工程编号", "分部工程名称", "概算工程量项编号", "概算工程量项名称",
					 "单位", "概算工程量", "分部工程概算价格（万元）", "备注"];
		this.consHeader = 
					["单元工程编号", "单元工程名称", "合同清册编号", "合同清册名称",
					 "单位", "单价（元）", "合同工程量", "合计总价（元）", "备注"];
	}

	componentDidMount() {

	}
	//搜索
	search(){
		let {type,actions:{getEstimateData}} = this.props;
		let {subProject,unit,subProject1,unit1,subsubsection,subUnits} = this.state;
		if(type === '0'){
			let pk = subProject;
			if(subProject === ''){
				message.info('请检查输入');
				return;
			}else if(subProject1 === '' && subsubsection.length != 0){
				message.info('请检查输入');
				return;
			}
			if(subProject1 !== ''){
				pk = subProject1;
			}
			getEstimateData({pk:pk}).then(rst => {
				let tableData = dataFormat(rst.children_wp,type);
				if(tableData.length === 0){
		  			message.info('暂无数据');
		  		}
	  			this.setState({tableData});
			})
	  	}else{
	  		let pk = unit;
			if(unit === ''){
				message.info('请检查输入');
				return;
			}else if(unit1 === '' && subUnits.length != 0){
				message.info('请检查输入');
				return;
			}
			if(unit1 !== ''){
				pk = unit1;
			}
	  		getEstimateData({pk:pk}).then(rst => {
				let tableData = dataFormat(rst.children_wp,type);
				if(tableData.length === 0){
		  			message.info('暂无数据');
		  		}
	  			this.setState({tableData});
			})
	  	}
	}
	//下拉款选择变化
	handleChangeSub(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(rst.children_wp.length === 0){
	  			this.setState({subProject:value,units:rst.children_wp,subUnits:rst.children_wp,subProject1:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  		}else{
	  			if(rst.children_wp[0].obj_type_hum === '子单位工程'){
	  				this.setState({subProject:value,subsubsection:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  			}else{
	  				this.setState({subProject:value,subsubsection:[],units:rst.children_wp,subProject1:'',unit:'',unit1:''});
	  			}
	  		}
	  		
	  	});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
	handleChangeSub1(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		this.setState({subProject1:value,units:rst.children_wp,unit:'',unit1:''});
	  	});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
	handleChange(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(rst.children_wp.length === 0){
	  			this.setState({unit:value,subUnits:[],unit1:''});
	  		}else{
	  			if(rst.children_wp[0].obj_type_hum === '子分部工程'){
	  				this.setState({unit:value,subUnits:rst.children_wp,unit1:''});
	  			}else{
	  				this.setState({unit:value,subUnits:[],unit1:''});
	  			}
	  		}
	  		
	  	});
	}
	handleChange1(value) {
	  	this.setState({unit1:value});
	}
	//getExcel
	getExcel(){
		let {type,actions:{jsonToExcel}} = this.props;
		const {tableData} = this.state;
		let rows = [];
		if(type === 0){
			rows.push(this.estimateHeader);
			tableData.map(item => {
				rows.push(this.objToArray(item,column0));
			})
		}else{
			rows.push(this.consHeader);
			tableData.map(item => {
				rows.push(this.objToArray(item,column1));
			})
		}
		jsonToExcel({},{rows:rows}).then(rst => {
			console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
			this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
		})
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
	//将对象按照一定顺序转化为数组
	objToArray(o,columns){
		return columns.map(item => {
			return o[item.dataIndex];
		})
	}
	render() {
		const { type,subsection=[] } = this.props;
		const {units=[], subsubsection=[], subUnits=[]} = this.state;
		let title = titles[type];
		let tender = tenderTitle[type];
		let columns = type === '0' ? column0 : column1;
		return (
			<div style={{width:'100%',marginLeft:'22px'}}>
				<h2 style={{marginBottom:'10px'}}>{title}</h2>
				<Card>
						<h3 style={{marginBottom:'10px'}}>单位/子单位工程选择</h3>
						<Row>
							<Col span={9}>
								<label style={{marginRight:'10px'}}>单位工程名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} value={this.state.subProject}  onChange={this.handleChangeSub.bind(this)}>
						      	{
						      		subsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={9}>
							    <label style={{marginRight:'10px'}}>子单位工程名称:</label>
								<Select style={{width:'200px'}} value={this.state.subProject1} onChange={this.handleChangeSub1.bind(this)}>
						      	{
						      		subsubsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
						</Row>
					</Card>
					<Card style={{marginTop:'10px'}}>
						<h3 style={{marginBottom:'10px'}}>分部/子分部工程选择</h3>
						<Row>
							<Col span={9}>
								<label style={{marginRight:'10px'}}>分部工程名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} value={this.state.unit}  onChange={this.handleChange.bind(this)}>
						      	{
						      		units.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={9}>
							    <label style={{marginRight:'10px'}}>子分部工程名称:</label>
								<Select style={{width:'200px'}} value={this.state.unit1} onChange={this.handleChange1.bind(this)}>
						      	{
						      		subUnits.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={6}>
								<Button type="primary" style={{marginRight:'10px'}}  onClick={this.search.bind(this)}>查询</Button>
								<Button type="primary"  onClick={this.getExcel.bind(this)}>导出数据</Button>
							</Col>
						</Row>
						<Table style={{marginTop:'20px'}} columns={columns} dataSource={this.state.tableData}/>
					</Card>
			</div>
		);
	}
}
//处理table数据
function dataFormat(data,type){
	try{
		let result = [];
		data.map(item => {
			let temptype = types[type];
			let temp = {...item.extra_params[temptype],name:item.name,code:item.code};
			result.push(temp);
		})
		return result;
	}catch(e){
		return [];
	}
}
//不同的类型对应存入extra字段内不同的key
const types = {
	0:'estimate',//概算
	1:'constract',//合同
	2:'actual'//实际
}
//标题
const titles = {
	2: '合计结算量清单',
	1: '合计工程量清单',
	0: '设计概算工程量清单'
}
//b标段选择
const tenderTitle = {
	0:'',
	1:'标段合同工程量清单',
	2:'标段结算量清单'
}
//概算表格
const column0 = [{
	title:'分部工程编号',
	dataIndex:'code'
},{
	title:'分部工程名称',
	dataIndex:'name'
},{
	title:'概算工程量项编号',
	dataIndex:'code1'
},{
	title:'概算工程量项名称',
	dataIndex:'name1'
},{
	title:'单位',
	dataIndex:'unit'
},{
	title:'概算工程量',
	dataIndex:'estimate'
},{
	title:'分部工程概算价格（万元）',
	dataIndex:'price'
},{
	title:'备注',
	dataIndex:'remark'
}]
//合同表格
const column1 = [{
	title:'单元工程编号',
	dataIndex:'code'
},{
	title:'单元工程名称',
	dataIndex:'name'
},{
	title:'合同清册编号',
	dataIndex:'code1'
},{
	title:'合同清册名称',
	dataIndex:'name1'
},{
	title:'单位',
	dataIndex:'unit'
},{
	title:'单价（元）',
	dataIndex:'unitPrice'
},{
	title:'合同工程量',
	dataIndex:'amount'
},{
	title:'合计总价（元）',
	dataIndex:'totalPrice'
},{
	title:'备注',
	dataIndex:'remark'
}]
//结算表格
const column2 = [{
	title:'单元工程编号',
	dataIndex:'1'
},{
	title:'单元工程名称',
	dataIndex:'2'
},{
	title:'合同清册编号',
	dataIndex:'3'
},{
	title:'合同清册名称',
	dataIndex:'4'
},{
	title:'单位',
	dataIndex:'5'
},{
	title:'单价',
	dataIndex:'434'
},{
	title:'合同工程量',
	dataIndex:'55'
},{
	title:'合计总价',
	dataIndex:'34'
},{
	title:'备注',
	dataIndex:'54'
}]
