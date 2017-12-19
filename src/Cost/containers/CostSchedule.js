import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, Tabs, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio, DatePicker } from 'antd';
import ScheduleChart from '../components/ScheduleChart'
import {NODE_FILE_EXCHANGE_API} from '_platform/api';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
@connect(
	state => {
		const {cost:{dataMaintenance = {jxka:'1213'}},platform} = state;
		return {...dataMaintenance,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions,...platformActions}, dispatch),
	}),
)
export default class CostSchedule extends Component {
	constructor(props) {
		super(props);
		this.header =['项目','概算计划完成（元）','概算执行（元）','完成比例']
		this.state = {
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
	}
	static propTypes = {};

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
	//搜索
	async search(){
		let {units,subProject,subProject1,subsubsection} = this.state;
		let pk = subProject;
		if(subProject === ''){
			message.info('请选择单位工程');
			return;
		}else if(subProject1 === '' && subsubsection.length > 0){
			message.info('请选择子单位工程');
			return;
		}
		if(subProject1 !== ''){
			pk = subProject1;
		}
		const {actions: {getEstimateData}} = this.props;
		let tempc = [];
		await getEstimateData({pk:pk}).then(rst => {
			tempc = rst.children_wp;
		})
		let tableData = [];
		await this.handleTableData(tempc).then((rst) => {
			tableData = rst;
		});
		//console.log(tableData['PromiseValue']);
		try{
			for(let o = 0;o<tableData.length;o++){
				arr = [];
				await this.preHandleData(tableData[o].pk);
				let total = 0;
				await Promise.all(arr).then((rst) => {
					for(let i = 0; i < rst.length; i++){
						let item = rst[i].children_wp;
						for(let j =0;j<item.length;j++){
							if(!item[j].extra_params.actual){
								item[j].extra_params.actual = {};
								item[j].extra_params.actual.totalPrice = 0;
							}else{
								if(!parseInt(item[j].extra_params.actual.totalPrice)){
									item[j].extra_params.actual.totalPrice = 0;
								}
							}
							total += parseInt(item[j].extra_params.actual.totalPrice);
						}
						if(!total){
							total = 0;
						}
					}		
				})
				tableData[o].execute = total; 
				tableData[o].donePercent = (tableData[o].execute / tableData[o].estimate * 100).toFixed(2) || 0;
			} 
			this.setState({tableData});
		}catch(e){
			console.log(e);
		}
		if(tableData.length === 0){
			message.info('暂无数据');
		}
	}
	//得到分项工程actions
	async preHandleData(pk){
		let data = [];
		const {actions:{getEstimateData}} = this.props;
		await getEstimateData({pk:pk}).then((rst) => {
			data = rst.children_wp;
		});
		try{
			if(data[0].obj_type_hum === '分项工程'){
				arr.push(getEstimateData({pk:pk}));
			}else{
				for(let i = 0;i<data.length;i++){
					arr.push(getEstimateData({pk:data[i].pk}));
				}
			}
		}catch(e){
			console.log(e);
		}
	}
	//处理表格数据
	async handleTableData(data){
		let result1 = [];
			try{
				for(let i = 0; i< data.length; i++){
					let item = data[i];
					let temp = {};
					temp.execute = 0;
					temp.project = item.code + ' ' + item.name;
					temp.estimate = item.extra_params.estimate.price * item.extra_params.estimate.estimate * 10000;
					//temp.donePercent = (temp.execute / temp.estimate * 100).toFixed(2) || 0;
					temp.donePercent = 0;
					temp.pk = item.pk;
					result1.push(temp);
				}	
				return result1;	
			}catch(e){
				return [];
			}
	}
	//得到某一个项目下的概算执行
	getExecute(pk){




	}
	//时间选择器
	onChange(date, dateString) {
	  console.log(date, dateString);
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
        let {actions:{jsonToExcel}} = this.props;
        const {tableData} = this.state;
        let rows = [];
        rows.push(this.header);
        tableData.map(item => {
            rows.push(this.objToArray(item,columns));
        })
        jsonToExcel({},{rows:rows}).then(rst => {
            console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
    //将对象按照一定顺序转化为数组
    objToArray(o,columns){
        return columns.map(item => {
            return o[item.dataIndex];
        })
    }
	render() {
		const { subsection=[] } = this.props;
		const {units=[], subsubsection=[], subUnits=[]} = this.state;
		return (
			<div>
				<DynamicTitle title="造价进度" {...this.props}/>
				<div style={{marginLeft:'22px'}}>
					{/*<Card>
						<Row style={{marginBottom:''}}>
							<Col span={14}>
								<label style={{marginRight:'10px'}}>节点名称:</label>
								<Select style={{width:'150px',marginRight:'20px'}} defaultValue="1" onChange={this.handleChange.bind(this)}>
							      	<Option value="1">2016年</Option>
							      	<Option value="2">2017年</Option>
							    </Select>
							    <Select style={{width:'150px',marginRight:'20px'}} defaultValue="1" onChange={this.handleChange.bind(this)}>
							      	<Option value="1">1月</Option>
							      	<Option value="2">2月</Option>
							      	<Option value="3">3月</Option>
							      	<Option value="4">4月</Option>
							      	<Option value="5">5月</Option>
							      	<Option value="6">6月</Option>
							      	<Option value="7">7月</Option>
							      	<Option svalue="8">8月</Option>
							      	<Option value="9">9月</Option>
							      	<Option value="10">10月</Option>
							      	<Option value="11">11月</Option>
							      	<Option value="12">12月</Option>
							    </Select>
							</Col>
							<Col span={10}>
							    <label style={{marginRight:'10px'}}>节点计划完成时间:</label>
							    <DatePicker style={{width:'200px'}} onChange={this.onChange.bind(this)} />
							</Col>
						</Row>
					</Card>*/}
					<Card>
						<h3 style={{marginBottom:'10px'}}>单位/子单位工程选择</h3>
						<Row>
							<Col span={10}>
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
							<Col span={5}>
								<Button type="primary" style={{marginRight:'10px'}} onClick={this.search.bind(this)}>查询</Button>
								<Button type="primary"  onClick={this.getExcel.bind(this)}>导出数据</Button>
							</Col>
						</Row>
					</Card>
					{/*<Card style={{marginTop:'10px'}}>
						<h3 style={{marginBottom:'10px'}}>分部/子分部工程选择</h3>
						<Row>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>分部工程名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} value={this.state.unit}  onChange={this.handleChange.bind(this)}>
						      	{
						      		units.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={10}>
							    <label style={{marginRight:'10px'}}>子分部工程名称:</label>
								<Select style={{width:'200px'}} value={this.state.unit1} onChange={this.handleChange1.bind(this)}>
						      	{
						      		subUnits.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							
						</Row>
					</Card>*/}
					<h3 style={{marginTop:'10px',marginLeft:'5px'}}>合同完成情况表</h3>
					<Table style={{marginTop:'10px'}} columns={columns} dataSource={this.state.tableData}/>
					<ScheduleChart data={this.state.tableData}/>
				</div>
			</div>
		);
	}
}
//aaction数组
let arr = [];//存分项的actions
let result = [];
//表格
const columns = [{
	title:'项目',
	dataIndex:'project'
},{
	title:'概算计划完成（元）',
	dataIndex:'estimate'
},{
	title:'概算执行（元）',
	dataIndex:'execute'
},{
	title:'完成比例',
	dataIndex:'donePercent'
}]
