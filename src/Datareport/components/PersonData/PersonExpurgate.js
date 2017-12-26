import React, { Component } from 'react';
import { Modal, Input, Form, Button, message, Table, Radio, Row, Col, Select } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 
import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api'

const RadioGroup = Radio.Group;
const { TextArea } = Input;
var moment = require('moment');

export default class PersonExpurgate extends Component {
	constructor(props){
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    ExpPerson(){
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
        const {actions:{getAllUsers,getOrgList}} = this.props;
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
		const {Exvisible} = this.props;
		const columns = [ {
	        title: '人员编码',
	        dataIndex: 'code',
	        key: 'Code',
	      }, {
	        title: '姓名',
	        dataIndex: 'name',
	        key: 'Name',
	      },{
	        title: '所在组织机构单位',
	        dataIndex: 'org',
            key: 'Org',
	      },{
	         title: '所属部门',
	         dataIndex :'depart',
	         key: 'Depart',
	      },{
	        title: '职务',
	        dataIndex :'job',
	        key: 'Job',
	      },{
	        title: '性别',
	        dataIndex :'sex',
	        key:'Sex'
	      },{
	        title: '手机号码',
	        dataIndex :'tel',
	        key:'Tel'
	      },{
	        title: '邮箱',
	        dataIndex :'email',
	        key:'Email'
	      },{
	        title:'二维码',
	        key:'signature',
	        
	      },{
	        title:'编辑',
	        dataIndex:'edit',
	        render:(record) => (
	            <Popconfirm
	                placement="leftTop"
	                title="确定删除吗？"
	                onConfirm={this.delete.bind(this)}
	                okText="确认"
	                cancelText="取消"
	            >
	                <a>删除</a>
	            </Popconfirm>
	        )
	    }]
		
		return (
            <Modal
                onCancel={this.props.onCancel}
                title="项目删除申请表"
                visible={true}
                width={1280}
                footer={null}
                maskClosable={false}>
                <Table
                    columns={columns}
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
	                        this.ExpPerson();
	                    }
	                }
	                type='primary' >
                    提交
                </Button>
            </Modal>
        )
	}

	onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}

	onok() {
        console.log("datasource",this.state.dataSource);
        const { actions: { ExprugateVisible } } = this.props;
        let ok = this.state.dataSource.some(ele => {
            return !ele.signature;
        });
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setData(this.state.dataSource, JSON.parse(this.state.passer));
        ExprugateVisible(false);
    }

	//删除
    delete(){
        
    }

	cancel() {
        const { actions: { ExprugateVisible } } = this.props;
        ExprugateVisible(false);
    }
}
