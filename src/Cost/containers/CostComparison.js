import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, Tabs, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio, DatePicker } from 'antd';
import {NODE_FILE_EXCHANGE_API} from '_platform/api';
import CompareChart from '../components/CompareChart'
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
export default class CostComparison extends Component {
	constructor(props) {
		super(props);
		this.header =['分部工程编码','分部工程名称','概算价格','合同价格（元）','实际费用','概算指标（万元/M）',
						'合同指标（万元/M）','实际指标（万元/M）','指标1']
		this.state = {
			type:'0',//表示tab页的种类 0 为概算 1 为合同 2 结算
			value:undefined,
			calType:'1',//对比指标
			subsection:[],//单位工程下拉框选项
			subsubsection:[],//子单位工程下拉框选项
			subProject:'',//单位
			subProject1:'',//子单位
			tableData:[],//表格数据
		}
	}
	static propTypes = {};

    //下拉款选择变化
	handleChangeSub(value) {
	  	const {actions:{getEstimateData},type} = this.props;
	  	getEstimateData({pk:value}).then((rst) => {
	  		if(rst.children_wp.length === 0){
	  			this.setState({subProject:value,subProject1:rst.children_wp,subProject1:''});
	  		}else{
	  			if(rst.children_wp[0].obj_type_hum === '子单位工程'){
	  				this.setState({subProject:value,subsubsection:rst.children_wp,subProject1:''});
	  			}else{
	  				this.setState({subProject:value,subsubsection:[],subProject1:''});
	  			}
	  		}
	  		
	  	});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
	handleChangeSub1(value) {
	  	this.setState({subProject1:value});
	  	/*Promise.all([esti]).then(values => {
		  	console.log(values);
		});*/
	}
    typeChange(value){
    	this.setState({calType:value});
    }
    //搜索
	async search(){
		let {subProject,subProject1,subsubsection} = this.state;
		let pk = subProject;
		let indexValue = document.getElementById('index').value;
		if(subProject === ''){
			message.info('请选择单位工程');
			return;
		}else if(subProject1 === '' && subsubsection.length > 0){
			message.info('请选择子单位工程');
			return;
		}
		indexValue = parseInt(indexValue);
		if(indexValue === 0 || isNaN(indexValue)){
			message.info('请正确填写指标参数');
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
				let ctotal = 0;
				await Promise.all(arr).then((rst) => {
					for(let i = 0; i < rst.length; i++){
						let item = rst[i].children_wp;
						for(let j =0;j<item.length;j++){
							//实际
							if(!item[j].extra_params.actual){
								item[j].extra_params.actual = {};
								item[j].extra_params.actual.totalPrice = 0;
							}else{
								if(!parseInt(item[j].extra_params.actual.totalPrice)){
									item[j].extra_params.actual.totalPrice = 0;
								}
							}
							total += parseInt(item[j].extra_params.actual.totalPrice);
							//合同
							//debugger
							if(!item[j].extra_params.constract){
								item[j].extra_params.constract = {};
								item[j].extra_params.constract.totalPrice = 0;
							}else{
								if(!parseInt(item[j].extra_params.constract.totalPrice)){
									item[j].extra_params.constract.totalPrice = 0;
								}
							}
							ctotal += parseInt(item[j].extra_params.constract.totalPrice);
						}
						if(!total){
							total = 0;
						}
						if(!ctotal){
							ctotal = 0;
						}
					}		
				})
				tableData[o].actual = total; 
				tableData[o].contract = ctotal;
				tableData[o].estiIndex = (tableData[o].estimate / indexValue).toFixed(2);
				tableData[o].contIndex = (ctotal / indexValue).toFixed(2);
				tableData[o].actuIndex = (total / indexValue).toFixed(2);
				tableData[o].index = ctotal === 0 ? 0 :((tableData[o].estimate - ctotal)/ctotal).toFixed(2);
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
					temp.code = item.code;
					temp.name = item.name;
					temp.estimate = item.extra_params.estimate.price * item.extra_params.estimate.estimate * 10000;
					temp.contract = 0;
					temp.actual = 0;
					temp.estiIndex = 0;
					temp.contIndex = 0;
					temp.actuIndex = 0;
					temp.index = 0;
					temp.pk = item.pk;
					result1.push(temp);
				}	
				return result1;	
			}catch(e){
				return [];
			}
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
		const {subsubsection=[]} = this.state;
		return (
			<div>
				<DynamicTitle title="造价对比" {...this.props}/>
				<Card>
					<Card>
						<Row style={{marginBottom:''}}>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>对比指标:</label>  
								<Select style={{width:'190px',marginRight:'20px'}} value={this.state.calType} onChange={this.typeChange.bind(this)}>
							      	<Option value="1">1（概算-合同）/合同</Option>
							      	{/*<Option value="2">2（实际-合同）/合同</Option>*/}
							    </Select>
							</Col>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>指标参数:</label>  
								<Input id='index' style={{width:'190px',marginRight:'20px'}} />
							</Col>
						</Row>
					</Card>
					<Card>
						<h3 style={{marginBottom:'10px'}}>单位/子单位工程选择</h3>
						<Row>
							<Col span={9}>
								<label style={{marginRight:'10px'}}>单位工程:</label>
								<Select style={{width:'190px',marginRight:'20px'}} value={this.state.subProject}  onChange={this.handleChangeSub.bind(this)}>
						      	{
						      		subsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
							<Col span={9}>
							    <label style={{marginRight:'10px'}}>子单位工程:</label>
								<Select style={{width:'190px'}} value={this.state.subProject1} onChange={this.handleChangeSub1.bind(this)}>
						      	{
						      		subsubsection.map((item) => {
						      			return <Option value={item.pk}>{item.name}</Option>
						      		})
						      	}
						    	</Select>
							</Col>
						
							<Col span={6}>
								<Button type="primary" style={{marginRight:'10px'}} onClick={this.search.bind(this)}>查询</Button>
								<Button type="primary"  onClick={this.getExcel.bind(this)}>导出数据</Button>
							</Col>
						</Row>
					</Card>
					<h3 style={{marginTop:'10px',marginLeft:'5px'}}>造价对比统计表</h3>
					<Table style={{marginTop:'10px'}} columns={columns} dataSource={this.state.tableData}/>
					<CompareChart data={this.state.tableData}/>
				</Card>
			</div>
		);
	}
}
let arr = [];//存分项的actions
//表格
const columns = [{
	title:'分部工程编码',
	dataIndex:'code'
},{
	title:'分部工程名称',
	dataIndex:'name'
},{
	title:'概算价格',
	dataIndex:'estimate'
},{
	title:'合同价格（元）',
	dataIndex:'contract'
},{
	title:'实际费用',
	dataIndex:'actual'
},{
	title:'概算指标（万元/M）',
	dataIndex:'estiIndex'
},{
	title:'合同指标（万元/M）',
	dataIndex:'contIndex'
},{
	title:'实际指标（万元/M）',
	dataIndex:'actuIndex'
},{
	title:'指标1',
	dataIndex:'index'
}]

