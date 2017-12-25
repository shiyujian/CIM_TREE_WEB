import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input } from 'antd';
import {WORKFLOW_CODE,STATIC_DOWNLOAD_API,SOURCE_API} from '_platform/api.js';
import Card from '_platform/components/panels/Card';
const Search = Input.Search
export default class DesignTable extends Component {
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
        let topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_designdata'});
            
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
                let temp = { 
                    code:single.extra_params.code,
                    filename:single.extra_params.filename,
                    pubUnit:single.extra_params.pubUnit,
                    filetype:single.extra_params.filetype,
                    file:single.basic_params.files[0],
                    unit:single.extra_params.unit,
                    major:single.extra_params.major,
                    project:single.extra_params.project,
                    stage:single.extra_params.stage,
                    upPeople:single.extra_params.upPeople,
                    wbsObject:single.extra_params.wbsObject,
                    designObject:single.extra_params.designObject,
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
			dataIndex: 'index',
			render:(text,record,index) => {
				return index+1
			}
		}, {
			title: '文档编码',
			dataIndex: 'code'
		}, {
			title: '文档名称',
			dataIndex: 'filename'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project'
		}, {
			title: '单位工程',
			dataIndex: 'unit'
		}, {
			title: '项目阶段',
			dataIndex: 'stage'
		}, {
			title: '提交单位',
			dataIndex: 'pubUnit'
		}, {
			title: '文档类型',
			dataIndex: 'filetype'
		}, {
			title: '专业',
			dataIndex: 'major'
		}, {
			title: '描述的WBS对象',
			dataIndex: 'wbsObject'
		}, {
			title: '描述的设计对象',
			dataIndex: 'designObject'
		}, {
			title: '上传人员',
			dataIndex: 'upPeople'
		}, {
            title:'附件',
            width:'10%',
            render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,index)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
            }
        }];


		return (
			<div >
				<Row >
					<Button style={{marginRight:10}} type="default">模板下载</Button>
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
	handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
	toggleAddition() {
		const {addtion = {}, actions: { changeAdditionField } } = this.props;
		console.log(this.props)
		changeAdditionField('visible', true)
		changeAdditionField('key', addtion.key?addtion.key+1:1)
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


