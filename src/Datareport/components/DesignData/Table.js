import React, { Component } from 'react';
import { Button, Table, Icon, Popconfirm, message, Modal, Row, Input,Progress } from 'antd';
import {STATIC_DOWNLOAD_API,SOURCE_API,NODE_FILE_EXCHANGE_API,DataReportTemplate_DesignInformation} from '_platform/api';
import Card from '_platform/components/panels/Card';
const Search = Input.Search
export default class DesignTable extends Component {
	constructor(props) {
		super(props);
		this.header = ['序号','文档编码','文档名称','项目/子项目名称','单位工程','项目阶段','提交单位',
						'文档类型','专业','描述的WBS对象','描述的设计对象','上传人员'];
		this.state = {
			selectedRowKeys: [],
			dataSource: [],
			selectedDataSource: [],
			alldatas:[],
			showDs:[],
			loading: false,
			percent: 0,
		}
	}
	onSelectChange = (selectedRowKeys) => {
		const {alldatas,dataSource} = this.state;
		const {actions: {changeModifyField,changeExpurgateField}} = this.props;
		this.setState({selectedRowKeys});
		let selectedDatas = [];
		let selectedDataSource = [];
		selectedRowKeys.forEach(key => {
			selectedDatas.push(alldatas[key-1]),
			selectedDataSource.push(dataSource[key-1])
		})
		this.setState({selectedDataSource})
		changeModifyField('selectedDatas',selectedDatas)
		changeExpurgateField('selectedDatas',selectedDatas)
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
    generateTableData(data){
        const {actions:{
            getDocument,
        }} = this.props;
        let dataSource = [];
        let all = [];
        let total = data.length;
        this.setState({loading:true,percent:0,num:0})
        data.forEach(item=>{
            all.push(getDocument({code:item.code})
            	.then(rst => {
            		let {num} = this.state;
                    num++;
                    this.setState({percent:parseFloat((num*100/total).toFixed(2)),num:num});
                    if(!rst) {
                    	message.error(`数据获取失败`)
		    			return {}
		    		} else {
                    	return rst
                    }
            	}))
        })
        Promise.all(all)
        .then(item => {
        	this.setState({loading:false,percent:100})
        	try {
				item.forEach((single,index) => {
	        		let temp = {
	        			index:index+1,
	        			num:index+1,
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
        		}) 
        	} catch(e){
        		message.error(`数据获取失败`)
        	}
            this.setState({dataSource,alldatas:item,showDs:dataSource});
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
			dataIndex: 'num',
		}, {
			title: '文档编码',
			dataIndex: 'code'
		}, {
			title: '文档名称',
			dataIndex: 'filename'
		}, {
			title: '项目/子项目名称',
			dataIndex: 'project.name'
		}, {
			title: '单位工程',
			dataIndex: 'unit.name'
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
                        <a onClick={this.handlePreview.bind(this,record.index-1)}>预览</a>
                        <span className="ant-divider" />
                        <a href={`${STATIC_DOWNLOAD_API}${record.file.a_file}`}>下载</a>
                    </span>)
            }
        }];


		return (
			<div >
				<Row >
					<Button style={{marginRight:10}} onClick={this.createLink.bind(this,'muban',`${DataReportTemplate_DesignInformation}`)} type="default">模板下载</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleAddition.bind(this)} type="default" >发起填报</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleModify.bind(this)} type="default">申请变更</Button>
					<Button style={{ margin: '10px' }} onClick={this.toggleExpurgate.bind(this)} type="default">申请删除</Button>
					<Button style={{ margin: '10px' }} onClick={this.getExcel.bind(this)} type="default">导出表格</Button>
					<Search
						style={{ width: "200px", marginLeft: 10 }}
						placeholder="输入搜索条件"
						onSearch={
							(text) => {
								let result = this.state.dataSource.filter(data=>{
									return data.filename.indexOf(text)>=0 || data.code.indexOf(text)>=0;
								});
								console.log(result);
								if(text === ''){
									result = this.state.dataSource;
								}
								this.onSelectChange([])//清空选择项
								this.setState({showDs:this.addindex(result)});
							}
						}
					/>
				</Row>
				{//<Button style={{ marginLeft: 10 }} type="primary" onClick={this.togglecheck.bind(this)}>审核</Button>
				}
				<Row>
					<Table
						bordered
						columns={columns}
						pagination={{pageSize:10,showSizeChanger:true,showQuickJumper:true}}
						rowSelection={rowSelection}
						dataSource={this.state.showDs}
						rowKey="index"
						loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
					/>
				</Row>
			</div>
		);
	}
	addindex(arr){
		arr.forEach((item,index) => {
			arr[index].num = ++index
		})
		return arr
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
	toggleModify() {
		const {modify = {}, actions: { changeModifyField } } = this.props;
		console.log(this.props,'modify.selectedDatas',modify.selectedDatas)
		if(!(modify.selectedDatas&&modify.selectedDatas.length)){
			message.warning('Nothing selected')
		} else if(!this.judge(modify.selectedDatas)) {
			message.warning('Different unit had been selected, check your selected lines please ')
		} else {
			changeModifyField('visible', true)
			changeModifyField('key', modify.key?modify.key+1:1)
		}
	}
	toggleExpurgate() {
		const {expurgate = {}, actions: { changeExpurgateField } } = this.props;
		console.log(this.props)
		if(!(expurgate.selectedDatas&&expurgate.selectedDatas.length)){
			message.warning('Nothing selected')
		} else {
			changeExpurgateField('visible', true)
			changeExpurgateField('key', expurgate.key?expurgate.key+1:1)
		}
	}
	judge(arr) {
		return arr.every(item => item.extra_params.unit.pk === arr[0].extra_params.unit.pk)
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
        const {actions:{jsonToExcel}} = this.props;
        const {selectedDataSource} = this.state;
        if(selectedDataSource.length === 0){
        	message.warning('请先选择数据再导出')
        	return
        }
        let rows = [];
        rows.push(this.header);
        this.addindex(selectedDataSource).map(item => {
            rows.push([item.num,item.code,item.filename,item.project.name,item.unit.name,item.stage,item.pubUnit,item.filetype,item.major,item.wbsObject,item.designObject,item.upPeople]);
        })
        jsonToExcel({},{rows:rows})
        .then(rst => {
            console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
}
