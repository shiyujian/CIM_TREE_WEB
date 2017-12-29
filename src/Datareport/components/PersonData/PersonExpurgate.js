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
        const {Exvisible, deletePer, actions:{getAllUsers, getProjects}} = this.props;
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
        this.setState({
            dataSource:deletePer
        })
        console.log('dataSource',this.setState)
    }

	render() {
		const {Exvisible, deletePer} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			key: 'Index',
		}, {
			title: '人员编码',
			dataIndex: 'account.person_code',
			key: 'Code',
		}, {
			title: '姓名',
			dataIndex: 'account.person_name',
			key: 'Name',
		}, {
			title: '所在组织机构单位',
			dataIndex: 'account.organization',
			key: 'Org',
		}, {
			title: '所属部门',
			dataIndex: 'account.org_code',
			key: 'Depart',
		}, {
			title: '职务',
			dataIndex: 'job',
			key: 'Job',
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'Sex'
		}, {
			title: '手机号码',
			dataIndex: 'tel',
			key: 'Tel'
		}, {
			title: '邮箱',
			dataIndex: 'email',
			key: 'Email'
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
                title="项目删除申请表"
                visible={Exvisible}
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
        const { actions: { ExprugateVisible } } = this.props;
        if (!this.state.passer) {
            message.error('审批人未选择');
            return;
        }
        this.props.setDataDel(this.state.dataSource, this.state.passer);

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
