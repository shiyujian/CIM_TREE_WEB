import React, {Component} from 'react';
import {Table,Button,Popconfirm,message,Input,Icon,Modal,Upload,Select,Divider} from 'antd';
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
			name:"项目批量删除申请",
			code:WORKFLOW_CODE["数据报送流程"],
			description:"项目批量删除申请",
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
                    note:'发起项目批量删除申请',
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
                title="项目删除申请表"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}>
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
                <Button
                onClick = {
                    ()=>{
                        if(!this.state.passer){
                            message.error('未选择审核人');
                            return;
                        }
                        this.delWF();
                    }
                }
                type='primary' >
                    提交
                </Button>
            </Modal>
        )
    }

    columns =  [{
		title: '序号',
		dataIndex: 'index',
		key: 'Index',
	}, {
		title: '项目/子项目名称',
		dataIndex: 'name',
		key: 'Name',
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
		render:(record)=>{
			return (<span>{record.extra_params.coordinate||''}</span>);
		},
		key: 'Project',
	}, {
		title: '项目负责人',
		render:(record)=>{
			return (<span>{record.response_persons[0]?record.response_persons[0].name:''}</span>);
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
	},{
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