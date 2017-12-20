import React, {Component} from 'react';
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {ProjectSum} from '../components/CostListData';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Row,Col,Table,Input,Button} from 'antd';
import {WORKFLOW_CODE} from '_platform/api.js'
import {getNextStates} from '_platform/components/Progress/util';
import {getUser} from '_platform/auth';

var moment = require('moment');
const Search = Input.Search;



// @connect(
// 	state => {
// 		const {platform} = state;
// 		return {platform};
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({...platformActions, }, dispatch),
// 	}),
// )




export default class WorkunitCost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addvisible:false,
		};
		this.columns = [{
			title:'序号',
			render:(text,record,index) => {
				return index+1
			}
		},{
			title: '项目/子项目',
			dataIndex: 'subproject',
		  },{
			title: '项目编码',
			dataIndex: 'projectcoding',
		  },{
			title: '项目名称',
			dataIndex: 'projectname',
		  },{
			title: '计量单位',
			dataIndex: 'company',
		  },{
			title: '数量',
			dataIndex: 'number',
		  },{
			title: '结合单价（元）',
			dataIndex: 'total',
		  },{
			title: '备注',
			dataIndex: 'remarks',
		  }];
	}
	oncancel(){
		this.setState({addvisible:false})
	}
	projectfill(){
		this.setState({addvisible:true})
	}
	// setAddVisible(){
	// 	this.setState({addvisible:true})
	// }


	render() {
		return (
			<div style={{overflow: 'hidden', padding: 20}}>
				<DynamicTitle title ="工程量结算" {...this.props} />
				<Row>
					<Button style={{margin:'10px 10px 10px 0px'}} type="default">模板下载</Button>
					<Button className="btn" type="default" onClick={this.projectfill.bind(this)}>发起填报</Button>
					<Button className="btn" type="default">申请变更</Button>
					<Button className="btn" type="default">导出表格</Button>
					<Search 
						className="btn"
						style={{width:"200px"}}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
						/>
				</Row>
				<Row >
					<Col >
						<Table columns={this.columns} dataSource={[]} rowKey="index"/>
					</Col>
				</Row>
				{
					this.state.addvisible &&
					<ProjectSum {...this.props} oncancel={this.oncancel.bind(this)} akey={Math.random()*1234} onok={this.setData.bind(this)}/>
				}
			</div>)
	}

	projectfill(){
		console.log(11111)
	}
};
