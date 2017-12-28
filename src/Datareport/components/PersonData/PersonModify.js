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

export default class PersonModify extends Component {
	constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],
            defaultPro: "",
            defaultchecker: "",
            units:[],
            selectPro:[],
            selectUnit:[]
        }
    }

    componentDidMount(){
        const {Modvisible, modifyPer, actions:{getAllUsers, getProjects}} = this.props;
        getAllUsers().then(rst => {
            let users = [];
            if (rst.length) {
                let checkers = rst.map(o => {
                    return (
                        <Option value={JSON.stringify(o)}>{o.account.person_name}</Option>
                    )
                })
                this.setState({
                    checkers,
                    defaultchecker: rst[0].account.person_name
                })
            }
        });
        modifyPer.map(item => {
        	item.code = item.account.person_code;
        })
        console.log("modifyPer",modifyPer);
        this.setState({
            dataSource:modifyPer
        })

    }

	render() {
		const {Modvisible, modifyPer, actions: {getOrgReverse}} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			key: 'Index',
		}, {
			title: '人员编码',
			dataIndex: 'code',
			key: 'Code',
		}, {
			title: '姓名',
			dataIndex: 'account.person_name',
			key: 'Name',
			render:(text, record, index) =>{
	            return <Input value = {record.account.person_name || ""} onChange={ele => {
	                record.account.person_name = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '所在组织机构单位',
			dataIndex: 'account.organization',
			key: 'Org',
		}, {
			title: '所属部门',
			// dataIndex: 'account.org_code',
			key: 'Depart',
			render:(text, record, index) =>{
	            return <Input value = {record.account.org_code || ""} onChange={ele => {
	                record.account.org_code = ele.target.value
	                getOrgReverse({code: record.account.org_code}).then(rst =>{
	                	if(rst.children.length !== 0) {
	                		record.account.organization = rst.children[0].name;
	                	}else {
	                		message.warning("您输入的部门不存在");
	                	}
	                	this.forceUpdate();
	                })
	                
	            }}/>
	        }
		}, {
			title: '职务',
			dataIndex: 'account.title',
			key: 'Job',
			render:(text, record, index) =>{
	            return <Input value = {record.account.title || ""} onChange={ele => {
	                record.account.title = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '性别',
			dataIndex: 'account.gender',
			key: 'Sex',
			render:(text, record, index) =>{
	            return <Select value = {record.account.gender} onChange={ele => {
	                record.account.gender = ele
	                this.forceUpdate();
	            }}>
	            	<Option value="男">男</Option>
	            	<Option value="女">女</Option>
	            </Select>
	        }
		}, {
			title: '手机号码',
			dataIndex: 'account.person_telephone',
			key: 'Tel',
			render:(text, record, index) =>{
	            return <Input value = {record.account.person_telephone || ""} onChange={ele => {
	                record.account.person_telephone = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '邮箱',
			dataIndex: 'email',
			key: 'Email',
			render:(text, record, index) =>{
	            return <Input value = {record.email || ""} onChange={ele => {
	                record.email = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '二维码',
			dataIndex: 'account.person_signature_url',
			key: 'Signature'
		}]
		
		return (
            <Modal
                onCancel={this.cancel.bind(this)}
                title="项目变更申请表"
                visible={Modvisible}
                width={1280}
                footer={null}
                maskClosable={false}>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={this.state.dataSource}
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
                <Button onClick = {this.onok.bind(this)} type='primary' >
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
		console.log('passer', this.state.passer)
        const { actions: { ModifyVisible } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setDataUpdate(this.state.dataSource, this.state.passer);
        console.log('22222222',this.state.dataSource);
        ModifyVisible(false);
    }

	//删除
    delete(){
        
    }

	cancel() {
        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
}
