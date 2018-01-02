import React, { Component } from 'react';
import { Modal, Button, Table, Icon, Popconfirm, message, Select, Input, Row, Col, Upload,Cascader,notification} from 'antd';
import {getNextStates} from '_platform/components/Progress/util';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE} from '_platform/api';
import {getUser} from '_platform/auth';
const Option = Select.Option;
const { TextArea } = Input;
var moment = require('moment');

export default class Expurgate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
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
        const {expurgate = {}} = props
        if(expurgate.key !== this.state.key) {
	        let item = expurgate.selectedDatas
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
	        this.setState({dataSource,key:expurgate.key})
        	console.log(expurgate,dataSource)
    	}
   	}

	render() {
		const {expurgate = {},common ={}} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
		}, {
			title: '文档编码',
			dataIndex: 'code'
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
			dataIndex: 'stage'
		}, {
			title: '提交单位',
			dataIndex: 'pubUnit.name'
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
			render:(text,record,index) => {
                return (<span>
                        <a onClick={this.handlePreview.bind(this,record.index-1)}>预览</a>
			        </span>)
			}
        }];

		return(
			<Modal
			 key={expurgate.key}
			 width = {1280}
			 visible = {expurgate.visible}
			 title="设计信息申请删除表"
			 maskClosable={false}
			 onCancel = {this.cancel.bind(this)}
			 footer={null}
			>
				<Row style={{margin: '20px 0', textAlign: 'center'}}>
					<h2>申请表删除页面</h2>
				</Row>
				<Row>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
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
						<Button type="default" onClick={this.onok.bind(this)}>提交申请</Button>
					</Col>
				</Row>
				<Row style={{marginBottom: '20px'}}>
					<Col span={2}>
						<span>删除原因：</span>
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
		const {expurgate = {},actions:{ createWorkflow, logWorkflowEvent,changeExpurgateField }} = this.props
		const {description = ''} = this.state;
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"设计信息批量删除",
			code:WORKFLOW_CODE["数据报送流程"],
			description:description,
			subject:[{
				data:JSON.stringify({origindata:expurgate.selectedDatas,changedata:data})
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
				changeExpurgateField('visible',false);
			})
		})
	}

	cancel() {
		const {
			actions: {changeExpurgateField}
		} = this.props;
		changeExpurgateField('visible',false);
	}
}
