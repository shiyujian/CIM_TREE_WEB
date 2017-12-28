import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input, Icon, Spin } from 'antd';
import style from './TableProject.css';
import DelProj from './DelModal';
import ChangeProj from './SubmitChangeModal'
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_ProjectInformation} from '_platform/api.js';
const Search = Input.Search;
export default class TableProject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			spinning:false
		}
	}
	render() {
		let rowSelection = {
			selectedRowKeys: this.state.selectedRowKeys || [],
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRowKeys, selectedRows })
			}
		};
		return (
			<div>
				<Spin spinning = {this.state.spinning}>
					<div>
						<Button 
						onClick = {this.createLink.bind(this,'项目模版',DataReportTemplate_ProjectInformation)}
						style={{ marginRight: "10px" }}>模板下载</Button>
						<Button onClick={this.send.bind(this)} className={style.button}>发起填报</Button>
						<Button className={style.button} onClick={() => {
							if (this.state.selectedRows && this.state.selectedRows.length > 0) {
								this.setState({ changing: true });
								return;
							}
							message.warning('请至少选择一条');
						}
						}>申请变更</Button>
						<Button className={style.button} onClick={() => {
							if (this.state.selectedRows && this.state.selectedRows.length > 0) {
								this.setState({ deling: true });
								return;
							}
							message.warning('请至少选择一条');
						}
						}>申请删除</Button>
						<Button onClick = {this.getExcel.bind(this)} className={style.button}>导出表格</Button>
						<Search className={style.button} style={{ width: "200px" }} placeholder="请输入内容"
							onSearch={
								(text) => {
									let result = this.state.dataSource.filter(data => {
										return data.name.indexOf(text) >= 0 || data.code.indexOf(text) >= 0;
									});
									console.log(result);
									if (text === '') {
										result = this.state.dataSource;
									}
									this.setState({ showDs: result });
								}
							}
						/>
					</div>
					<Table
						width="1280px"
						columns={this.columns}
						bordered={true}
						rowSelection={rowSelection}
						dataSource={this.state.showDs || []}
					>
					</Table>
					{
						this.state.deling &&
						<DelProj
							onCancel={() => {
								this.setState({ deling: false });
							}}
							dataSource={this.state.selectedRows}
							actions={this.props.actions}
						/>
					}
					{
						this.state.changing &&
						<ChangeProj
							onCancel={() => {
								this.setState({ changing: false });
							}}
							dataSource={this.state.selectedRows}
							actions={this.props.actions}
						/>
					}
				</Spin>
			</div>
		)
	}
	send() {
		const { actions: { ModalVisibleProject } } = this.props;
		ModalVisibleProject(true);
	}
	async componentDidMount() {
		this.setState({spinning:true});
		let { getProjectAc, getProjectByCode, getDocByCode } = this.props.actions;
		let projsInTree = await getProjectAc();
		let projRoot = projsInTree;
		projsInTree = projsInTree.children;

		let promises = projsInTree.map(ele => {
			return getProjectByCode({ code: ele.code });
		});
		let projects = await Promise.all(promises);
		promises = projects.map((proj, index) => {
			if(!proj.files){
				proj.files = [];
			}
			proj.index = index + 1;
			proj.key = index;
			proj.children = null;
			if (proj.related_documents[0]) {
				return getDocByCode({ code: proj.related_documents[0].code });
			}
			return null;
		});
		let docs = await Promise.all(promises);
		docs.forEach((doc, index) => {
			projects[index].relDoc = doc;
			if (doc) {
				projects[index] = { ...projects[index], ...doc.extra_params, ...doc.basic_params }
			}
		});
		projects.map(data => {
            data.file = data.files.find(f=>{
                return f.misc === 'file';
            });
            data.pic = data.files.find(f=>{
                return f.misc === "pic";
            });
        });
		console.log(projects);
		this.setState({ dataSource: projects, projRoot, showDs: projects,spinning:false });
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
		console.log(this.state.showDs);
		let exhead = ['项目名称','项目编码','所属区域','项目规模','项目类型','项目地址','项目红线坐标','项目投资','项目负责人','计划开工日期','计划竣工日期','简介','附件','项目图片'];
		let rows = [exhead];
		let excontent =this.state.showDs.map(data=>{
			return [data.name,data.code,data.area||'',data.range||'',data.projType||'',data.address||'',data.extra_params.coordinate||'',data.cost,
			data.response_persons[0]?data.response_persons[0].name:'',data.stime||'',data.etime||'',data.intro||'',data.file?data.file.name:'',data.pic?data.pic.name:''];
		});
		rows = rows.concat(excontent);
		const {actions:{jsonToExcel}} = this.props;
		console.log(rows)
        jsonToExcel({},{rows:rows})
        .then(rst => {
            console.log(rst);
            this.createLink('项目信息导出表',NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
	}
	dataSource = []
	columns = [{
		title: '序号',
		dataIndex: 'index',
		key: 'Index',
	}, {
		title: '项目/子项目名称',
		dataIndex: 'name',
		key: 'Name',
	}, {
		title: '所属项目',
		render: (record) => {
			return (<span>{this.state.projRoot ? this.state.projRoot.name : ''}</span>);
		},
		key: 'projRoot',
	}, {
		title: '所属区域',
		dataIndex: 'area',
		key: 'Area',
	}, {
		title: '项目规模',
		dataIndex: 'range',
		key: 'Range',
	}, {
		title: '项目类型',
		dataIndex: 'projType',
		key: 'ProjType',
	}, {
		title: '项目地址',
		dataIndex: 'address',
		key: 'Address',
	}, {
		title: '项目红线坐标',
		render: (record) => {
			return (<span>{record.extra_params.coordinate || ''}</span>);
		},
		key: 'Project',
	},  {
		title: '项目投资',
		dataIndex: 'cost',
		key: 'cost',
	},{
		title: '项目负责人',
		render: (record) => {
			return (<span>{record.response_persons[0] ? record.response_persons[0].name : ''}</span>);
		},
		key: 'Remarks'
	}, {
		title: '计划开工日期',
		dataIndex: 'stime',
		key: 'Stime'
	}, {
		title: '计划竣工日期',
		dataIndex: 'etime',
		key: 'Etime'
	}, {
		title: '简介',
		dataIndex: 'intro',
		key: 'Intro'
	}, {
		title: '附件',
		key: 'oper',
		render: (record) => (
			<span>
				附件
			</span>
		)
	}, {
		title: '项目图片',
		key: 'pic',
		render: (record) => (
			<span>
				图片
					</span>
		)
	}]
}