import React, { Component } from 'react';
import { Table, Button, Popconfirm, message, Input, Icon } from 'antd';
import style from './TableProject.css';
import DelProj from './DelModal';
import ChangeProj from './SubmitChangeModal'

const Search = Input.Search;
export default class TableProject extends Component {
	constructor(props) {
		super(props);
		this.state = {}
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
				<div>
					<Button style={{ marginRight: "10px" }}>模板下载</Button>
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
					<Button className={style.button}>导出表格</Button>
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

			</div>
		)
	}
	send() {
		const { actions: { ModalVisibleProject } } = this.props;
		ModalVisibleProject(true);
	}
	async componentDidMount() {
		let { getProjectAc, getProjectByCode, getDocByCode } = this.props.actions;
		let projsInTree = await getProjectAc();
		let projRoot = projsInTree;
		projsInTree = projsInTree.children;

		let promises = projsInTree.map(ele => {
			return getProjectByCode({ code: ele.code });
		});
		let projects = await Promise.all(promises);
		promises = projects.map((proj, index) => {
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
		console.log(projects);
		this.setState({ dataSource: projects, projRoot, showDs: projects });
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
	}, {
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