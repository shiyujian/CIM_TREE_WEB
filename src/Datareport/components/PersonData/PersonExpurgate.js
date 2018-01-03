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
            selectUnit:[],
            description: '',
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
			dataIndex: 'account.title',
			key: 'Job',
		}, {
			title: '性别',
			dataIndex: 'account.gender',
			key: 'Sex'
		}, {
			title: '手机号码',
			dataIndex: 'account.person_telephone',
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
                visible={Exvisible}
                width={1280}
                onOk={this.onok.bind(this)}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>申请删除</h1>
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
                <Row style={{marginBottom: '10px'}}>
                    <Col span={2}>
                        <span>删除原因：</span>
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
	    this.setState({
	    	value: e.target.value,
	    });
	}

	onok() {
        const { actions: { ExprugateVisible } } = this.props;
        if (!this.state.passer) {
            Notification.warning({
                message:'审批人未选择'
            });
            return;
        }
        this.props.setDataDel(this.state.dataSource, this.state.passer, this.state.description);

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
