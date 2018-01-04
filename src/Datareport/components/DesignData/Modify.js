import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload,Cascader,notification} from 'antd';
import {getNextStates} from '_platform/components/Progress/util';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE} from '_platform/api';
import {getUser} from '_platform/auth';
const Option = Select.Option;
const { TextArea } = Input;
var moment = require('moment');

export default class Modify extends Component {
	constructor(props) {
		super(props)
		this.state = {
			alldatas:[],
			dataSource: [],
			units:[],
			projecttrees: [],
			key: -1,
		}
	}
	componentDidMount(){
        // const {actions:{getAllUsers}} = this.props
        // getAllUsers().then(res => {
        //     let checkers = res.map((o,index) => {
        //         return (
        //             <Option key={index} value={JSON.stringify(o)}>{o.account.person_name}</Option>
        //         )
        //     })
        //     this.setState({checkers})
        // })
    }
	componentWillReceiveProps(props){
        const {modify = {}} = props
        if(modify.key !== this.state.key) {
	        let item = modify.selectedDatas
	        let dataSource = [];
	        item&&item.forEach((single,index) => {
	    		let temp = {
	    			index:index+1,
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
	        this.setState({dataSource,key:modify.key})
    	}
   	}

	render() {
		const {modify = {},common ={}, actions: {changeModifyField}} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '文档编码',
			render: (text, record, index) => (
                <Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'code')} value={this.state.dataSource[record.index-1]['code']}/>
            ),
		}, {
			title: '文档名称',
			dataIndex: 'filename'
		}, {
			title: '项目/子项目名称',
			dataIndex:'project.name'
		}, {
			title: '单位工程',
			dataIndex:'unit.name'
		}, {
			title: '项目阶段',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,record.index-1,'stage')} value={this.state.dataSource[record.index-1]['stage']}>
                    <Option value="初设阶段">初设阶段</Option>
                    <Option value="施工图阶段">施工图阶段</Option>
                    <Option value="竣工阶段">竣工阶段</Option>
                </Select>
            ),
		}, {
			title: '提交单位',
			dataIndex: 'pubUnit.name'
			// render: (text, record, index) => (
   //              <Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'pubUnit')} value={this.state.dataSource[record.index-1]['pubUnit']}/>
   //          ),
		}, {
			title: '文档类型',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,record.index-1,'filetype')} value={this.state.dataSource[record.index-1]['filetype']}>
                    <Option value="图纸">图纸</Option>
                    <Option value="报告">报告</Option>
                </Select>
            ),
		}, {
			title: '专业',
			render: (text, record, index) => (
                <Select style={{width:'120px'}} onSelect={this.handleSelect.bind(this,record.index-1,'major')} value={this.state.dataSource[record.index-1]['major']}>
                    <Option value="建筑">建筑</Option>
                    <Option value="结构">结构</Option>
                </Select>
            ),
		}, {
			title: '描述的WBS对象',
			render: (text, record, index) => (
                <Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'wbsObject')} value={this.state.dataSource[record.index-1]['wbsObject']}/>
            ),
		}, {
			title: '描述的设计对象',
			render: (text, record, index) => (
                <Input style={{width:'120px'}} onChange={this.tableDataChange.bind(this,record.index-1,'designObject')} value={this.state.dataSource[record.index-1]['designObject']}/>
            ),
		}, {
			title: '上传人员',
			dataIndex: 'upPeople'
		}, {
            title:'附件',
			render:(text,record,index) => {
				if(record.file.id){
                    return (<span>
                            <a onClick={this.handlePreview.bind(this,record.index-1)}>预览</a>
                            <span className="ant-divider" />
                            <Popconfirm
                                placement="leftTop"
                                title="确定删除吗？"
                                onConfirm={this.remove.bind(this, record.index-1)}
                                okText="确认"
                                cancelText="取消">
                                <a>删除</a>
                            </Popconfirm>
				        </span>)
                }else{
                    return (
                        <span>
                        <Upload showUploadList={false} beforeUpload={this.beforeUploadPicFile.bind(this,record.index-1)}>
                            <Button>
                                <Icon type="upload" />上传附件
                            </Button>
                        </Upload>
                    </span>
                    )
                }
			}
        }];

		return(
			<Modal
			 key={modify.key}
			 width = {1280}
			 visible = {modify.visible}
			 onOk={this.onok.bind(this)}
			 maskClosable={false}
			 onCancel = {this.cancel.bind(this)}
			 >
				<h1 style={{ textAlign: 'center', marginBottom: 20 }}>申请变更</h1>
				<Row>
					<Table 
					 bordered 
					 columns={columns}
					 rowKey='index' 
					 dataSource={this.state.dataSource}
					/>
				</Row>

				<Row style={{marginTop: '20px'}}>

					<Col>
					    <span>
                        审核人：
                        <Select style={{width:'200px'}} className="btn" onSelect={this.selectChecker.bind(this)}>
                            {
                                common.checkers
                            }
                        </Select>
                    </span> 
					
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>变更原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '20px 0'}}>
				    <Col>
				    	<TextArea rows={2} onChange={this.description.bind(this)}/>
				    </Col>
			    </Row>
			</Modal>
		)
	}
	description(e) {
		this.setState({description:e.target.value})
	}
	addindex(arr) {
		if(arr instanceof Array === false )
			 return []
        arr.forEach((item,index) => {
            arr[index].index = ++index
        })
        return arr
    }
	//table input 输入
    tableDataChange(index, key ,e ){
		let { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
	  	this.setState({dataSource});
    }
    //下拉框选择变化
    handleSelect(index,key,value){
        let {dataSource} = this.state;
		dataSource[index][key] = value;
	  	this.setState({dataSource})
    }
    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        const {dataSource} = this.state;
        let f = dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    //附件上传
	beforeUploadPicFile  = (index,file) => {
        const fileName = file.name;
        let {dataSource} = this.state;
        let temp = fileName.split(".")[0]
		// 上传到静态服务器
		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            resp = await resp.json()
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                id: filedata.id,
                name: resp.name,
                status: 'done',
                url: filedata.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type,
				isnew:true
            };
            dataSource[index]['file'] = attachment
            dataSource[index]['filename'] = fileName
            this.setState({dataSource})
		});
		return false;
    }
    //附件删除、不删除文件
    remove(index){
        let {dataSource} = this.state;
        dataSource[index].file = '';
        this.setState({dataSource})
    }
        //下拉框选择人
    selectChecker(value){
        let check = JSON.parse(value)
        this.setState({check})
    }

	onok(){
        let {dataSource} = this.state;
        if(!this.state.check){
            message.info("请选择审核人")
            return
        }
        let temp = dataSource.some((o,index) => {
            return !o.file.id
        })
        if(temp){
            message.info(`有数据未上传附件`)
            return
        }
        let {check} = this.state
        let per = {
            id:check.id,
            username:check.username,
            person_name:check.account.person_name,
            person_code:check.account.person_code,
            organization:check.account.organization
        }
		this.setData(dataSource,per)
    }
	//批量上传回调
	setData(data,participants){
		const {modify = {},actions:{ createWorkflow, logWorkflowEvent,changeModifyField }} = this.props
		const {description = ''} = this.state;
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"设计信息批量变更",
			code:WORKFLOW_CODE["数据报送流程"],
			description:description,
			subject:[{
				data:JSON.stringify({origindata:modify.selectedDatas,changedata:data})
			}],
			creator:creator,
			plan_start_time:moment(new Date()).format('YYYY-MM-DD'),
			deadline:null,
			status:"2"
		}
		createWorkflow({},postdata).then((rst) => {
			let nextStates =  getNextStates(rst,rst.current[0].id);
            logWorkflowEvent({pk:rst.id},
            {
                state:rst.current[0].id,
                action:'提交',
                note:description,
                executor:creator,
                next_states:[{
                    participants:[participants],
                    remark:"",
                    state:nextStates[0].to_state[0].id,
                }],
                attachment:null
            }).then(() => {
                message.success("成功")
				changeModifyField('visible',false);
			})
		})
	}

	covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }
	cancel() {
		const {
			actions: {changeModifyField}
		} = this.props;
		changeModifyField('visible',false);
	}
}
