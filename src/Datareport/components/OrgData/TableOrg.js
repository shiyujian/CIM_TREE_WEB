import React, { Component } from 'react';
import { Table, Button, Popconfirm, notification, Input, Pagination, Spin, Progress } from 'antd';
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API, DataReportTemplate_ConstructionUnits, DataReportTemplate_Organization} from '_platform/api.js';
import './TableOrg.less'
const Search = Input.Search;
export default class TableOrg extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource: [],
			selectData:[],
			tempData:[],
			spinning:true,
			percent:0,
			excelData: []
		}
	}
	render() {
		let painationInfo = {
			showQuickJumper:true,
			showSizeChanger:true,
		}
		return (
			<div>
				<div> 
					<Button className="button" onClick={this.sendCJ.bind(this)}>新增参建单位</Button>
					<Button className="button" onClick={this.send.bind(this)}>新增部门</Button>
					<Button className="button" onClick={this.update.bind(this)}>申请变更</Button>
					<Button className="button" onClick={this.delete.bind(this)}>申请删除</Button>
					<Button className="button" onClick={this.getExcel.bind(this)}>导出表格</Button>
					<Search className="button" onSearch = {this.searchOrg.bind(this)} style={{ width: "200px" }} placeholder="输入部门编码或部门名称" />
				</div>
					<Table
						columns={this.columns}
						bordered={true}
						rowSelection={this.rowSelection}
						dataSource={this.state.tempData}
						rowKey="code"
						pagination={painationInfo}
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.spinning}}	
					>
					</Table>
			</div>
		)
	}
	searchOrg(value){ 
		let searchData = [];
		if (value === "") {
			searchData = [...this.state.dataSource];
			searchData.map((item, index) => {
				delete item.index;
				item.index = index + 1;
			})
			this.setState({
				tempData:searchData
			})
			return;
		}
		this.state.dataSource.map(item => {
			if (item.name.indexOf(value) != -1 || item.code.indexOf(value) != -1){
				searchData.push(item);
			}
			if (item.children && item.children.length > 0) {
				item.children.map(it => {
					if (it.name.indexOf(value) != -1 || it.code.indexOf(value) != -1) {
						searchData.push(it);
					}
				})
			}
		})
		searchData.map((item, index) => {
			item.index = index + 1;
		})
		this.setState({tempData:searchData}); 
	}
	update(){
		const { actions: { ModalVisibleUpdate, setUpdateOrg } } = this.props;
		if(this.state.selectData.length){
			let newArr = [];
			this.state.selectData.map(item => {
				let newItem  = {...item};
				newItem.extra_params = {...newItem.extra_params};
				newArr.push(newItem);

			});
			setUpdateOrg(newArr);
			ModalVisibleUpdate(true)
		}else{
			notification.warning({
				message:"请先选择数据！"
			});
		}
	}
	// 导出excel表格
	getExcel(){
		if (this.state.excelData.length === 0) {
			notification.warn({
				message:"请先选择数据！"
			});
			return;
		}
		let exhead = ['组织机构编码','组织机构类型','参建单位名称','组织机构部门','直属部门','负责项目/子项目名称','负责单位工程名称','备注'];
		let rows = [exhead];
		let getcoordinate = (param)=>{
			if(typeof param !=='string'){
				return'';
			}
			if((!param||param.length<=0)){
				return ''
			}else{
				return param;
			}
		}
		let excontent =this.state.excelData.map(data=>{
			return [data.code || '', data.extra_params.org_type || '', data.extra_params.canjian || '', data.name ||'', data.extra_params.direct ||'', data.extra_params.project || ''
			,data.extra_params.unit || '',data.extra_params.remarks ||''];
		});
		rows = rows.concat(excontent);
		const {actions:{jsonToExcel}} = this.props;
        jsonToExcel({},{rows:rows}).then(rst => {
            this.createLink('单位工程信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
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
			notification.warning({
				message:"请先选择数据！"
			});
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
		dataSource.map((item, index) => {
			item.index = index + 1
		})
		this.setState({
			spinning:false,
			percent:100
		})
		this.setState({dataSource,tempData:dataSource});
	}
	rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
		},
		onSelect: (record, selected, selectedRows) => {
			this.setState({
				selectData:selectedRows,
				excelData:selectedRows
			})
		},
		onSelectAll: (selected, selectedRows, changeRows) => {
			this.setState({
				selectData:selectedRows,
				excelData:selectedRows
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
		title: '编码',
		dataIndex: 'code',
		key: 'Code',
	}, {
		title: '机构类型',
		dataIndex: 'extra_params.org_type',
		key: 'Type',
	}, {
		title: '参建单位',
        dataIndex: 'extra_params.canjian',
        key: 'Canjian',
	}, {
		title: '部门',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '直属部门',
		dataIndex: 'extra_params.direct',
		key: 'Direct',
	}, {
		title: '负责项目/子项目',
		render:(text, record, index) => {
			let nodes = [];
			if (record.extra_params.project) {
				record.extra_params.project.map(item => {
					nodes.push(<p>{item}</p>);
				})
			}
			return nodes;
		}
	},{
		title: '负责单位工程名称',
		render:(text, record, index) => {
			let nodes = [];
			if (record.extra_params.unit) {
				record.extra_params.unit.map(item => {
					nodes.push(<p>{item}</p>);
				})
			}
			return nodes;
		}
	},{
		title: '备注',
		dataIndex: 'extra_params.remarks',
		key: 'Remarks'
	}]
}