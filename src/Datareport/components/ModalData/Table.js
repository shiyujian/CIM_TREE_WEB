import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input } from 'antd';
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api.js';
import Card from '_platform/components/panels/Card';
const Search = Input.Search
export default class ModalTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedRowKeys: [],
		}

	}
	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}

	async componentDidMount(){
        const {actions:{
            getScheduleDir,
            postScheduleDir,
		}} = this.props;
		// console.log('a',this.props)
		let topDir = await getScheduleDir({code:'the_only_main_code_ModalCheck'});
	
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_modaldatadoc'});
            
            if(dir.obj_type){
                if(dir.stored_documents.length>0){
                    this.generateTableData(dir.stored_documents);
                }
            }
        }
	}
	
	async generateTableData(data){
        const {actions:{
            getDocument,
        }} = this.props;
        let dataSource = [];
        
        data.map(item=>{
			
            getDocument({code:item.code}).then(single=>{
				console.log("...",single)
                let temp = { 
                    coding:single.extra_params.coding,
					modelName:single.extra_params.filename,
					project:single.extra_params.project,
					unit:single.extra_params.unit,
                    submittingUnit:single.extra_params.submittingUnit,
                    modelDescription:single.extra_params.modelDescription,
                    // file:single.basic_params.files[0],
					modeType:single.extra_params.modeType,
					fdbMode:single.basic_params.files[0],
					tdbxMode:single.basic_params.files[1],
					attributeTable:single.basic_params.files[2],
                    reportingTime:single.extra_params.reportingTime,
                    reportingName:single.extra_params.reportingName,
                    // stage:single.extra_params.stage,
                    // upPeople:single.extra_params.upPeople,
                    // wbsObject:single.extra_params.wbsObject,
                    // designObject:single.extra_params.designObject,
                }
                dataSource.push(temp);
                this.setState({dataSource});
            })
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
			dataIndex: 'numbers',
			render: (text, record, index) => {
				return index + 1
			}
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
					<a onClick={this.handlePreview.bind(this, index)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.fdbMode.a_file}`}>下载</a>
				</span>)
			}
		}, {
			title: 'tdbx模型',
			dataIndex: 'tdbxMode',
			render: (text, record, index) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, index)}>预览</a>
					<span className="ant-divider" />
					<a href={`${STATIC_DOWNLOAD_API}${record.tdbxMode.a_file}`}>下载</a>
				</span>)
			}
		}, {
			title: '属性表',
			dataIndex: 'attributeTable',
			render: (text, record, index) => {
				return (<span>
					<a onClick={this.handlePreview.bind(this, index)}>预览</a>
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
					<Button type="default" style={{ marginRight: 10 }}>模板下载</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleAddition.bind(this)} type="default" >发起填报</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleModify.bind(this)} type="default">申请变更</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleExpurgate.bind(this)} type="default">申请删除</Button>
					<Button style={{ margin: '10px' }} type="default">导出表格</Button>
					<Search
						style={{ width: "200px", marginLeft: 10 }}
						placeholder="输入搜索条件"
						onSearch={value => console.log(value)}
					/>
				</Row>
				{//<Button style={{ marginLeft: 10 }} type="primary" onClick={this.togglecheck.bind(this)}>审核</Button>
				}
				<Row>
					<Table
						size="middle"
						bordered
						columns={columns}
						rowSelection={rowSelection}
						dataSource={this.state.dataSource}
						rowKey="_id"
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
		const { actions: { changeAdditionField } } = this.props;
		console.log('a',this.props)
		changeAdditionField('visible', true)
	}
	toggleCheck() {
		const { actions: { changeCheckField } } = this.props;
		console.log(this.props)
		changeCheckField('visible', true)
	}
	toggleModify() {
		const { actions: { changeModifyField } } = this.props;
		console.log(this.props)
		changeModifyField('visible', true)
	}
	toggleExpurgate() {
		const { actions: { changeExpurgateField } } = this.props;
		console.log(this.props)
		changeExpurgateField('visible', true)
	}
}


