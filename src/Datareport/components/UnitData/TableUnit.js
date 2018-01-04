import React, { Component } from 'react';
import { Table, Button, Popconfirm, notification, Input, Icon ,Spin} from 'antd';
import style from './TableUnit.css';
import DelModal from './DelModal'
import ChangeUNIT from './SubmitChangeModal'
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_UnitProject} from '_platform/api.js';
const Search = Input.Search;

export default class TableUnit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deling: false,
			selectedRows:[]
		}
	}
	async componentDidMount() {
		this.setState({spinning:true});
		let { getProjectAcD3, getDocByCodeList, getDocByCodeSearcher } = this.props.actions
		let projTree = await getProjectAcD3();
		let units = projTree.children.reduce((previewArr, currentProj) => {
			currentProj.children.forEach(dw=>{
				dw.fatherName = currentProj.name;
			});
			return previewArr.concat(currentProj.children);
		}, []);
		let docSet = {};
		let docs = await getDocByCodeSearcher({ code: 'REL_DOC_DW_A' });
		docs.result.forEach(doc => {
			docSet[doc.code] = doc;
		});
		units = units.map((unit, index) => {
			unit.key = index;
			unit.children = null;
			unit.files = [];
			if (docSet[unit.code + 'REL_DOC_DW_A']) {
				return { ...unit, ...unit.extra_params, ...docSet[unit.code + 'REL_DOC_DW_A'].extra_params, ...docSet[unit.code + 'REL_DOC_DW_A'].basic_params }
			}
			return { ...unit, ...unit.extra_params };
		});
		units.map(unit => {

			unit.file = unit.files.find(f => {
				return f.misc === 'file';
			});
		});
		this.setState({ units: units, showDs: units,spinning:false });
	}
	render() {
		let painationInfo = {
			showQuickJumper:true,
			showSizeChanger:true,
		}
		let rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys || [],
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys: selectedRowKeys, selectedRows });
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			onSelect: (record, selected, selectedRows) => {
				console.log(record, selected, selectedRows);
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
				console.log(selected, selectedRows, changeRows);
			},
		};
		return (
			<div>
			<Spin spinning = {this.state.spinning}>
				<div>
					<Button className={style.button} onClick={this.send.bind(this)}>发送填报</Button>
					<Button className={style.button}
						onClick={() => {
							if (this.state.selectedRows && this.state.selectedRows.length > 0) {
								this.setState({ changing: true });
								return;
							}
							notification.warning({
								message:"请至少选择一条"
							});
						}
						}
					>申请变更</Button>
					<Button onClick={() => {
						if (this.state.selectedRows && this.state.selectedRows.length > 0) {
							this.setState({ deling: true });
							return;
						}
						notification.warning({
							message:'请至少选择一条'
						});
					}} className={style.button}>申请删除</Button>
					<Button onClick = {this.getExcel.bind(this)} className={style.button}>导出表格</Button>
					<Search className={style.button} style={{ width: "200px" }} placeholder="请输入内容"
						onSearch={
							(text) => {
								let result = this.state.units.filter(data => {
									return data.name.indexOf(text) >= 0 || data.code.indexOf(text) >= 0;
								});
								console.log(result);
								if (text === '') {
									result = this.state.units;
								}
								this.setState({ showDs: result });
							}
						}
					/>
				</div>
				<Table
					columns={this.columns}
					bordered={true}
					rowSelection={rowSelection}
					dataSource={this.state.showDs || []}
					pagination={painationInfo}
				>
				</Table>
				{
					this.state.changing &&
					<ChangeUNIT
						onCancel={() => {
							this.setState({ changing: false });
						}}
						dataSource={this.state.selectedRows}
						actions={this.props.actions}
					/>
				}
				{
					this.state.deling &&
					<DelModal
						onCancel={() => {
							this.setState({ deling: false });
						}}
						dataSource = {this.state.selectedRows}
						actions={this.props.actions}
					/>
				}
				</Spin>
			</div>
		)
	}
	send() {
		const { actions: { ModalVisibleUnit, postWorkpackages, postWorkpackagesOK }, postWorkpackagesOKp } = this.props;
		console.log(postWorkpackagesOKp)
		ModalVisibleUnit(true);

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
		if (this.state.selectedRows.length === 0) {
			notification.warning({
				message:'请至少选择一条'
			});
			return;
		}
		console.log(this.state.showDs);
		let exhead = ['单位工程编码','单位工程名称','所属项目名称','项目类型','项目阶段','单位红线坐标','计划开工日期','计划竣工日期','简介','建设单位','附件'];
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
		console.log("this.state.selectedRows:",this.state.selectedRows);
		let excontent =this.state.selectedRows.map(data=>{
			return [data.code,data.name,data.fatherName,data.projType||'',data.stage||'',getcoordinate(data.coordinate)
			,data.stime||'',data.etime||'',data.intro||'',data.rsp_orgName?data.rsp_orgName[0]:'',data.file?data.file.name:''];
		});
		rows = rows.concat(excontent);
		const {actions:{jsonToExcel}} = this.props;
		console.log(rows)
        jsonToExcel({},{rows:rows})
        .then(rst => {
            console.log(rst);
            this.createLink('单位工程信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
	}
	columns = [{
		title: '单位工程编码',
		dataIndex: 'code',
		key: 'Code',
		width:100
	}, {
		title: '单位工程名称',
		dataIndex: 'name',
		key: 'Name',
		width:100
	}, {
		title: '所属项目名称',
		dataIndex: 'fatherName',
		key: 'fatherName',
		width:100
	},
	{
		title: '项目类型',
		dataIndex: 'projType',
		key: 'Type',
		width:100
	}, {
		title: '项目阶段',
		dataIndex: 'stage',
		key: 'Stage',
		width:100
	}, {
		title: '单位红线坐标',
		dataIndex: 'coordinate',
		key: 'coordinate',
		width:100
	}, {
		title: '计划开工日期',
		dataIndex: 'stime',
		key: 'Stime',
		width:100
	}, {
		title: '计划竣工日期',
		dataIndex: 'etime',
		key: 'Etime',
		width:100
	}, {
		title: '单位工程简介',
		dataIndex: 'intro',
		key: 'Intro',
		width:100
	}, {
		title: '建设单位',
		render: (record) => {
			let ogrname = '';
			if (record.rsp_orgName && record.rsp_orgName.length > 0) {
				ogrname = record.rsp_orgName[0];
			}
			return (<span>{ogrname}</span>)
		},
		key: 'Org',
		width:100
	}, {
		title: '附件',
		key: 'file',
		render: (record) => (
			<a  onClick  = {
				()=>{
					record.file && this.createLink(record.file.name,STATIC_DOWNLOAD_API+record.file.download_url);
				}
			}> {record.file ? record.file.name : '暂无'}</a>
		),
		width:100
	}]
}