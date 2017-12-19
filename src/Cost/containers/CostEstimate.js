import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, Tabs, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio, DatePicker } from 'antd';
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
export default class CostEstimate extends Component {
	constructor(props) {
		super(props);
		this.header = ['单元工程编号','单元工程名称','清册编号','清册名称','单位','合同工程量','合同单价',
						'合价','实际完成量','未完成量','已完成造价','未完成造价','完成比例','备注',]
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
	}
	static propTypes = {};
	componentWillReceiveProps(props){
		let {subsection} = props;
		this.setState({subsection});
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
	//搜索
	search(){
		let {unit1,subProject,unit,subUnits} = this.state;
		let pk = unit1;
		if(unit===''){
			message.info('请检查输入');
			return;
		}else if(unit1 === '' && subUnits.length > 0){
			message.info('请检查输入');
			return;
		}
		if(unit1 !== ''){
			pk = unit1;
		}
		const {actions:{getEstimateData}} = this.props;
		getEstimateData({pk:pk}).then(rst => {
			console.log(rst);
			let tableData = handleData(rst.children_wp);
			if(tableData.length === 0){
				message.info('暂无数据');
			}
			this.setState({tableData});
		})

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
				<DynamicTitle title="造价估算" {...this.props}/>

				<div style={{marginLeft:'22px'}}>
					{/*<Card>s
						<Row style={{marginBottom:''}}>
							<Col span={10}>
								<label style={{marginRight:'10px'}}>节点名称:</label>
								<Select style={{width:'200px',marginRight:'20px'}} defaultValue="1">
							      	<Option value="1">基坑验槽</Option>
							      	<Option value="2">水下施工验收</Option>
							      	<Option value="3">分部工程验收</Option>
							      	<Option value="4">单位工程验收</Option>
							      	<Option value="5">完工验收</Option>
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
						</Row>
					</Card>
					<Card style={{marginTop:'10px'}}>
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
							<Col span={5}>
								<Button type="primary"  onClick={this.search.bind(this)} style={{marginRight:'10px'}}>查询</Button>
								<Button type="primary"  onClick={this.getExcel.bind(this)}>导出数据</Button>
							</Col>
						</Row>
					</Card>
					<h3 style={{marginTop:'10px',marginLeft:'5px'}}>完成量统计</h3>
					<Table style={{marginTop:'10px'}} columns={columns} dataSource={this.state.tableData}/>
				</div>
			</div>
		);
	}
}
//处理表格数据
function handleData(data){
	try{
			let result = [];
			data.map(item => {
				let extra = item.extra_params;
				let temp = {...extra.constract};
				temp.done = extra.actual ? extra.actual.amount : 0;
				temp.undone = extra.actual ? extra.constract.amount - extra.actual.amount : extra.constract.amount;
				temp.donePrice = extra.actual ? extra.actual.totalPrice : 0;
				temp.undonePrice = extra.actual ? extra.constract.totalPrice - extra.actual.totalPrice : extra.constract.totalPrice;
				temp.donePercent = ((temp.done / (parseInt(temp.done) + parseInt(temp.undone)))*100).toFixed(1);
				temp.donePercent = isNaN(temp.donePercent) ? 0 : temp.donePercent;
				temp.remark = '';
				result.push(temp);
		})
		return result;
	}catch(e){
		console.log(e);
		return [];
	}

}
//表格
const columns = [{
	title:'单元工程编号',
	dataIndex:'code'
},{
	title:'单元工程名称',
	dataIndex:'name'
},{
	title:'清册编号',
	dataIndex:'code1'
},{
	title:'清册名称',
	dataIndex:'name1'
},{
	title:'单位',
	dataIndex:'unit'
},{
	title:'合同工程量',
	dataIndex:'amount'
},{
	title:'合同单价',
	dataIndex:'unitPrice'
},{
	title:'合价',
	dataIndex:'totalPrice'
},{
	title:'实际完成量',
	dataIndex:'done'
},{
	title:'未完成量',
	dataIndex:'undone'
},{
	title:'已完成造价',
	dataIndex:'donePrice'
},{
	title:'未完成造价',
	dataIndex:'undonePrice'
},{
	title:'完成比例',
	dataIndex:'donePercent'
},{
	title:'备注',
	dataIndex:'remark'
}]
