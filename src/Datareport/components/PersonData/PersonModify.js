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
        console.log("modifyPer",modifyPer);
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
				console.log('recordname',record)
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
                console.log('recordorg',record)
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
                console.log('recorddepart',record)
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
			// dataIndex: 'account.person_signature_url',
			// key: 'Signature'
			render:(record) => {
	            console.log("record:",record);
	            return (
	                <img style={{width:"60px"}} src = {record.account.relative_avatar_url} />
	            )
	        }
		}]
		
		return (
            <Modal
                onCancel={this.cancel.bind(this)}
                visible={Modvisible}
                width={1280}
                footer={null}
                maskClosable={false}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>结果预览</h1>
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
                    确认变更
                </Button>
                <Row style={{marginBottom: '10px'}}>
					<Col span={2}>
						<span>变更原因：</span>
					</Col>
			    </Row>
			    <Row style={{margin: '10px 0'}}>
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

	onChange = (e) => {
	    console.log('radio checked', e.target.value);
	    this.setState({
	    	value: e.target.value,
	    });
	}

	onok() {
        const { actions: { ModifyVisible } } = this.props;
        let temp = this.state.dataSource.some((o,index) => {
            console.log('o',o)
            if(o.orgname) {
            	return o.orgname.org === ''
            }
        });
        if(temp) {
            message.info('部门不存在，无法提交')
            return
        }
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        // if(this.state.subErr === false) {
        // 	message.error('请输入正确的部门');
        //     return;
        // }
        this.props.setDataUpdate(this.state.dataSource, this.state.passer, this.state.description);
        ModifyVisible(false);
    }

    tableDataChange(index ,e ){
        const {actions: {getOrgReverse}} = this.props;
        const { dataSource } = this.state;
        dataSource[index].depart = e.target.value;
        // console.log('e',e.target.value)
        console.log('dataSource',dataSource)
        getOrgReverse({code:dataSource[index].depart}).then(rst => {
            console.log('rst',rst)
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
        console.log('dataSource1111',dataSource)
        getOrgReverse({code:dataSource[index].depart}).then(rst => {
            console.log('rst1111',rst)
            if(rst.children.length !== 0){
                dataSource[index]['orgname'] = {
                    org: rst.children[0].name
                }
                this.setState({dataSource})
            }else{
                message.info("部门不存在")
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
