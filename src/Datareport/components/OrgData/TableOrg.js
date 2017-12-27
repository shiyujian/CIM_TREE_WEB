import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input } from 'antd';
import style from './TableOrg.css'
const Search = Input.Search;
export default class TableOrg extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource: [],
			selectData:[],
			tempData:[],
		}
	}
	render() {
		return (
			<div>
				<div>
					<Button style={{ marginRight: "10px" }}>模板下载</Button>
					<Button className={style.button} onClick={this.send.bind(this)}>发送填报</Button>
					<Button className={style.button} onClick={this.sendCJ.bind(this)}>发送参建单位</Button>
					<Button className={style.button} onClick={this.update.bind(this)}>申请变更</Button>
					<Button className={style.button} onClick={this.delete.bind(this)}>申请删除</Button>
					<Button className={style.button}>导出表格</Button>
					<Search className={style.button} onSearch = {this.searchOrg.bind(this)} style={{ width: "200px" }} placeholder="输入搜索条件" />
				</div>
				<Table
					columns={this.columns}
					bordered={true}
					rowSelection={this.rowSelection}
					dataSource={this.state.tempData}
					rowKey = "code"
				>
				</Table>
			</div>
		)
	}
	searchOrg(value){ 
		let searchData = [];
		this.state.dataSource.map(item => {
			if (item.name.indexOf(value) != -1) {
				searchData.push(item);
			}
			if (item.children && item.children.length > 0) {
				item.children.map(it => {
					if (it.name.indexOf(value) != -1) {
						searchData.push(it);
					}
				})
			}
		})
		searchData.map((item, index)=> {
			item.index = index + 1;
		})
		this.setState({
			tempData:searchData
		})
	}
	update(){
		const { actions: { ModalVisibleUpdate, setUpdateOrg } } = this.props;
		if(this.state.selectData.length){
			setUpdateOrg(this.state.selectData);
			ModalVisibleUpdate(true)
		}else{
			message.warning("请先选中要变更的数据");
		}
	}
	send() {
		const { actions: { ModalVisible } } = this.props;
		ModalVisible(true);
	}
	sendCJ() {
		const { actions: { ModalVisibleCJ } } = this.props;
		ModalVisibleCJ(true);
	}
	delete(){
		const {actions:{setDeleteOrg,ModalVisibleDel}} = this.props;
		if(this.state.selectData.length){
			setDeleteOrg(this.state.selectData);
			ModalVisibleDel(true);
		}else{
			message.warning("请先选中要删除的数据");
		}
	}
	async componentDidMount() {
		let dataSource = [];
		const { actions: { getOrgTree } } = this.props;
		await getOrgTree().then(rst => {
			if (rst && rst.children) {
				rst.children.map((item, index) => {
					dataSource.push(...item.children);
				})
			}
		})
		console.log("dataSource:",dataSource);
		dataSource.map((item, index) => {
			item.index = index + 1
		})
		this.setState({dataSource,tempData:dataSource})
	}
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		onSelect: (record, selected, selectedRows) => {
			this.setState({
				selectData:selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			console.log(selected, selectedRows, changeRows);
			this.setState({
				selectData:selectedRows
			})
		},
	};
	
	columns = [{

	},
	{
		title: '序号',
		dataIndex: 'index',
		key: 'Index',
	}, {
		title: '组织机构编码',
		dataIndex: 'code',
		key: 'Code',
	}, {
		title: '组织机构类型',
		dataIndex: 'extra_params.org_type',
		key: 'Type',
	}, {
		title: '参建单位名称',
        dataIndex: 'extra_params.canjian',
        key: 'Canjian',
	}, {
		title: '组织机构部门',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '直属部门',
		dataIndex: 'extra_params.direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目名称',
		dataIndex: 'extra_params.project',
		key: 'Project',
	},{
		title: '负责单位工程名称',
		dataIndex: 'extra_params.unit',
		key: 'Unit'
	},{
		title: '备注',
		dataIndex: 'extra_params.remarks',
		key: 'Remarks'
	}]
}