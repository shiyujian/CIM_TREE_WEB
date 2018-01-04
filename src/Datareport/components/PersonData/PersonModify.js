import React, { Component } from 'react';
import { Modal, Input, Form, Button, Notification, Table, Radio, Row, Col, Select } from 'antd';
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
            selectUnit:[],
            subErr: true,
            description: '',
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
        let modifyPersons = [...modifyPer]
        modifyPersons.map(item => {
        	item.code = item.account.person_code;
        })
        this.setState({
            dataSource:modifyPersons
        })

    }

	render() {
		const {Modvisible, actions: {getOrgReverse}} = this.props;
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
			dataIndex: 'record.account.organization',
            key: 'Org',
            render:(text, record, index) =>{
                if(record.orgname) {
                    return record.account.organization = record.orgname.org
                }else {
                    return record.account.organization = record.account.organization
                }
            }
		}, {
			title: '所属部门',
			dataIndex: 'account.org_code',
			key: 'Depart',
			render:(text, record, index) =>{
                if(record.orgname) {
                	record.account.org_code = record.depart
                	if(record.orgname.org !== '') {
                        return <Input
                            style={{width: '60px'}} 
                            value = {record.account.org_code || ""}
                            onChange={this.tableDataChange.bind(this,index)}
                            onBlur={this.fixOrg.bind(this,index)}
                        />
                	}else {
                        return <Input
                            style={{width: '60px', color: 'red'}} 
                            value = {record.account.org_code || ""}
                            onChange={this.tableDataChange.bind(this,index)}
                            onBlur={this.fixOrg.bind(this,index)}
                        />
                	}
                }else {
                	return <Input
                        style={{width: '60px'}} 
                        value = {record.account.org_code || ""}
                        onChange={this.tableDataChange.bind(this,index)}
                        onBlur={this.fixOrg.bind(this,index)}
                    />
                }
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
	            return <Select style={{width: 42}} value = {record.account.gender} onChange={ele => {
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
			// dataIndex: 'account.person_signature_url',
			// key: 'Signature'
			render:(record) => {
	            if(record.account.relative_signature_url !== '') {
                    return <img style={{width: 60}} src={record.account.relative_signature_url}/>
                }else {
                    return <span>暂无</span>
                }
	        }
		}]
		
		return (
            <Modal
                onCancel={this.cancel.bind(this)}
                visible={Modvisible}
                width={1280}
                onOk={this.onok.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>申请变更</h1>
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
		    	<TextArea rows={2} style={{margin: '10px 0'}} onChange={this.description.bind(this)} placeholder='请输入变更原因'/>
            </Modal>
        )
	}

	description(e) {
		this.setState({description:e.target.value})
	}

	onChange = (e) => {
	    this.setState({
	    	value: e.target.value,
	    });
	}

	onok() {
        const { actions: { ModifyVisible } } = this.props;
        let temp = this.state.dataSource.some((o,index) => {
            if(o.orgname) {
            	return o.orgname.org === ''
            }
        });
        if(temp) {
            Notification.Warning({
                message: '部门不存在，无法提交'
            })
            return
        }
        if (!this.state.passer) {
            Notification.Warning({
                message: '审批人未选择'
            });
            return;
        }
        this.props.setDataUpdate(this.state.dataSource, this.state.passer, this.state.description);
        ModifyVisible(false);
    }

    tableDataChange(index ,e ){
        const {actions: {getOrgReverse}} = this.props;
        const { dataSource } = this.state;
        dataSource[index].depart = e.target.value;
        getOrgReverse({code:dataSource[index].depart}).then(rst => {
            if(rst.children.length !== 0) {
                dataSource[index]['orgname'] = {
                    org: rst.children[0].name
                }
            }else {
                dataSource[index]['orgname'] = {
                    org: ''
                }
            }
            this.setState({dataSource});
        })
    }
    //校验部门
    fixOrg(index){
        const {actions: {getOrgReverse}} = this.props;
        let {dataSource} = this.state
        getOrgReverse({code:dataSource[index].depart}).then(rst => {
            if(rst.children.length !== 0){
                dataSource[index]['orgname'] = {
                    org: rst.children[0].name
                }
                this.setState({dataSource})
            }else{
                Notification.Warning("部门不存在")
            }
        })
    }

	//删除
    delete(){
        
    }

	cancel() {
        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
}
