import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input, Progress } from 'antd';
import { WORKFLOW_CODE, STATIC_DOWNLOAD_API, SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_ModalInformation } from '_platform/api.js';
import Card from '_platform/components/panels/Card';
const Search = Input.Search
export default class ModalTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedRowKeys: [],
			// dataSourceSelected: [],
			selectedDataSource: [],
			alldatas: [],
			loading: false,
			percent: 0,
		}

	}
	

	onSelectChange = (selectedRowKeys) => {
	
		const { alldatas,dataSource } = this.state;
		const { actions: { changeModifyField, changeExpurgateField } } = this.props;
		this.setState({ selectedRowKeys });
		let selectedDatas = [];
		let selectedDataSource = [];
		selectedRowKeys.forEach(key => {
			selectedDatas.push(alldatas[key - 1])
			selectedDataSource.push(dataSource[key-1])
		})
		this.setState({selectedDataSource})
	
		changeModifyField('selectedDatas', selectedDatas)
		changeExpurgateField('selectedDatas', selectedDatas)
	}

	async componentDidMount() {
		const { actions: {
            getScheduleDir,
			postScheduleDir,
		} } = this.props;
		
		let topDir = await getScheduleDir({ code: 'the_only_main_code_ModalCheck' });

		if (topDir.obj_type) {
			let dir = await getScheduleDir({ code: 'datareport_modaldatadoc' });

			if (dir.obj_type) {
				if (dir.stored_documents.length > 0) {
					this.generateTableData(dir.stored_documents);
				}
			}
		}
	}
	async generateTableData(data) {
		const { actions: {
            getDocument,
        } } = this.props;
		let dataSource = [];
		let all = [];
		let total = data.length;
		this.setState({ loading: true, percent: 0, num: 0 })
		data.forEach(item => {
			all.push(getDocument({ code: item.code })
				.then(rst => {
					let { num } = this.state;
					num++;
					this.setState({ percent: parseFloat((num * 100 / total).toFixed(2)), num: num });
					if (!rst) {
						message.error(`数据获取失败`)
						return []
					} else {
						return rst
					}
				}))
		})
		Promise.all(all)
			.then(item => {
				
				this.setState({ loading: false })
				item.forEach((single, index) => {
					let temp = {
						index: index + 1,
						coding: single.extra_params.coding,
						modelName: single.extra_params.filename,
						project: single.extra_params.project.name,
						unit: single.extra_params.unit.name,
						submittingUnit: single.extra_params.submittingUnit,
						modelDescription: single.extra_params.modelDescription,
						// file:single.basic_params.files[0],
						modeType: single.extra_params.modeType,
						fdbMode: single.basic_params.files[0],
						tdbxMode: single.basic_params.files[1],
						attributeTable: single.basic_params.files[2],
						reportingTime: single.extra_params.reportingTime,
						reportingName: single.extra_params.reportingName,

						// stage:single.extra_params.stage,
						// upPeople:single.extra_params.upPeople,
						// wbsObject:single.extra_params.wbsObject,
						// designObject:single.extra_params.designObject,
					}
					dataSource.push(temp);
				})
				this.setState({ dataSource, alldatas: item, showDs: dataSource });
			})
	}





	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};

		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '模型编码',
			dataIndex: 'coding'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project'
		}, {
			title: '单位工程',
			dataIndex: 'unit'
		}, {
			title: '模型名称',
			dataIndex: 'modelName'
		}, {
			title: '提交单位',
			dataIndex: 'submittingUnit'
		}, {
			title: '模型描述',
			dataIndex: 'modelDescription'
		}, {
			title: '模型类型',
			dataIndex: 'modeType'
		}, {
			title: 'fdb模型',
			dataIndex: 'fdbMode',
			render: (text, record, index) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, record.index-1)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.fdbMode.a_file}`}>下载</a>
				</span>)
			}
		}, {
			title: 'tdbx模型',
			dataIndex: 'tdbxMode',
			render: (text, record, index) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, record.index-1)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.tdbxMode.a_file}`}>下载</a>
				</span>)
			}
		}, {
			title: '属性表',
			dataIndex: 'attributeTable',
			render: (text, record, index) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, record.index-1)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.attributeTable.a_file}`}>下载</a>
				</span>)
			}
		}, {
			title: '上报时间',
			dataIndex: 'reportingTime'
		}, {
			title: '上报人',
			dataIndex: 'reportingName'
		}];

		return (
			<div>
				<Row >
					
					<Button style={{ margin: '10px 10px 10px 0' }} onClick={this.toggleAddition.bind(this)} type="default" >发起填报</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleModify.bind(this)} type="default">申请变更</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleExpurgate.bind(this)} type="default">申请删除</Button>
					<Button style={{ margin: '10px' }} onClick={this.getExcel.bind(this)} type="default">导出表格</Button>
					<Search
						style={{ width: "200px", marginLeft: 10 }}
						placeholder="输入搜索条件"
						onSearch={
							(text) => {
								let result = this.state.dataSource.filter(data => {
									
									return data.modelName.indexOf(text) >= 0 || data.coding.indexOf(text) >= 0|| data.modeType.indexOf(text) >= 0|| data.modelDescription.indexOf(text) >= 0
									|| data.reportingName.indexOf(text) >= 0 || data.submittingUnit.indexOf(text) >= 0;
								});
							
								if (text === '') {
									result = this.state.dataSource;
								}
								this.onSelectChange([])//清空选择项
								this.setState({ showDs: result });
							}
						}
					/>
				</Row>
				{//<Button style={{ marginLeft: 10 }} type="primary" onClick={this.togglecheck.bind(this)}>审核</Button>
				}
				<Row>
					<Table
						pagination={{pageSize:10,showSizeChanger:true,showQuickJumper:true}}
						bordered
						columns={columns}
						rowSelection={rowSelection}
						dataSource={this.state.showDs}
						rowKey="index"
						loading={{ tip: <Progress style={{ width: 200 }} percent={this.state.percent} status="active" strokeWidth={5} />, spinning: this.state.loading }}
					/>
				</Row>
			</div>
		);
	}


	//预览
	handlePreview(index) {
		const { actions: { openPreview } } = this.props;
		let f = this.state.dataSource[index].fdbMode
		let filed = {}
		filed.misc = f.misc;
		filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
		filed.name = f.name;
		filed.mime_type = f.mime_type;
		openPreview(filed);
	}
	toggleAddition() {
		const { addtion = {}, actions: { changeAdditionField } } = this.props;
	
		changeAdditionField('visible', true)
	}
	
	toggleModify() {
		const { modify = {}, actions: { changeModifyField } } = this.props;
		const {selectedDataSource} = this.state;
		if(selectedDataSource.length === 0){
        	message.warning('请先选择数据再变更')
        	return
        }
		changeModifyField('visible', true)
		changeModifyField('key', modify.key ? modify.key + 1 : 1)


	}
	toggleExpurgate() {
		const { expurgate = {}, actions: { changeExpurgateField } } = this.props;
		const {selectedDataSource} = this.state;
		if(selectedDataSource.length === 0){
        	message.warning('请先选择数据再删除')
        	return
        }
		changeExpurgateField('visible', true)
		changeExpurgateField('key', expurgate.key ? expurgate.key + 1 : 1)

	}


	//数据导出
	getExcel() {
		const { actions: { jsonToExcel } } = this.props;
		const {selectedDataSource} = this.state;
		if(selectedDataSource.length === 0){
        	message.warning('请先选择数据再导出')
        	return
        }
		let rows = [];
		rows.push(['模型编码' ,'项目/子项目名称',	'单位工程',	'模型名称',	'提交单位',	'模型描述',	'模型类型', '上报时间', '上报人']);
		selectedDataSource.map(item => {
		
			rows.push([ item.coding, item.project, item.unit,item.modelName,  item.submittingUnit, item.modelDescription, item.modeType, item.reportingTime, item.reportingName]);
		})
		jsonToExcel({}, { rows: rows })
			.then(rst => {
				this.createLink(this, NODE_FILE_EXCHANGE_API + '/api/download/' + rst.filename);
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

	
}


