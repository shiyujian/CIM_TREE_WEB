import React, {Component} from 'react';
import {Table,Button,Popconfirm,notification,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API} from '_platform/api';
import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api'
var moment = require('moment');
const Search = Input.Search;
const { Option } = Select
export default class DelModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }
    delWF(){
        const {actions:{ createWorkflow, logWorkflowEvent }} = this.props;
        let participants = this.state.passer;
		let creator = {
			id:getUser().id,
			username:getUser().username,
			person_name:getUser().person_name,
			person_code:getUser().person_code,
		}
		let postdata = {
			name:"单位工程批量删除申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"单位工程批量删除申请",
			subject:[{
				data:JSON.stringify(this.props.dataSource)
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
                    note:'发起单位工程批量删除申请',
                    executor:creator,
                    next_states:[{
                        participants:[participants],
                        remark:"",
                        state:nextStates[0].to_state[0].id,
                    }],
					attachment:null
				}).then(rst=>{
                    this.props.onCancel();
                });
		});
    }
    componentDidMount(){
        const {actions:{getAllUsers,getProjectAc}} = this.props
        getAllUsers().then(res => {
            console.log(res);
            let set = {};
            let checkers = res.map(o => {
                set[o.id] = o;
                return (
                    <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                )
            })
            this.setState({ checkers, usersSet: set });
        });
    }
    render() {
        return (
            <Modal
                onCancel={this.props.onCancel}
                onOk = {()=>{
                    if(!this.state.passer){
                        notification.warning({
                            message:"请选择审核人"
                        })
                        return;
                    }
                    this.delWF();
                }}
                visible={true}
                width={1280}
                maskClosable={false}>
                <h1 style ={{textAlign:'center',marginBottom:20}}>申请删除</h1>
                <Table
                    columns={this.columns}
                    bordered={true}
                    dataSource={this.props.dataSource || []}
                />
                <span>
                    审核人：
                    <Select style={{ width: '200px' }} className="btn" onSelect={ele => {
                        this.setState({ passer: JSON.parse(ele) })
                    }} >
                        {
                            this.state.checkers || []
                        }
                    </Select>

                </span>
            </Modal>
        )
    }

    columns = [{
        title: '单位工程编码',
        dataIndex:'code',
        key: 'Code',
      }, {
        title: '单位工程名称',
        dataIndex:'name',
        key: 'Name',
      }, 
      {
         title: '项目类型',
         dataIndex:'projType',
         key: 'Type',
      },{
        title: '项目阶段',
        dataIndex:'stage',
         key: 'Stage',
      },{
        title: '单位红线坐标',
        dataIndex :'coordinate',
        key:'coordinate'
      },{
        title: '计划开工日期',
        dataIndex :'stime',
        key:'Stime'
      },{
        title: '计划竣工日期',
        dataIndex :'etime',
        key:'Etime'
      },{
        title: '单位工程简介',
        dataIndex :'intro',
        key:'Intro'
      },{
        title: '建设单位',
        render:(record)=>{
			let ogrname = '';
			if(record.rsp_orgName && record.rsp_orgName.length>0){
				ogrname =record.rsp_orgName[0];
			}
			return (<span>{ogrname}</span>)
		},
        key:'Org'
      },{
          title:'附件',
          key:'file',
          render:(record) => (
                <a> {record.file?record.file.name:'暂无'}</a>
          )
      }]
}