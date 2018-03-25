import React, { Component } from 'react';
import { Table, Spin, message,Modal,Button,Form,Row,Col,Select,Input,Icon,DatePicker,Popconfirm,Card,notification} from 'antd';
import { base, STATIC_DOWNLOAD_API,SOURCE_API,WORKFLOW_CODE } from '../../../_platform/api';
import moment from 'moment';
import Preview from '../../../_platform/components/layout/Preview';
import queryString from 'query-string';
import { getUser } from '_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
const FormItem = Form.Item;
const {RangePicker}=DatePicker;

let indexSelect='';
export default class QulityCheckDeal extends Component {

	constructor(props){
         super(props);
         this.state={
            note:''
         }
         this.member = null;
    }
    static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 16 },
	};
	
	render() {
        const { platform: {  task = {}, users = {} } = {}, location, actions } = this.props;
        const { current, history = [], transitions = [], states = [] } = task;
        console.log('sssssssssssssssssssssss',this.props)
		// let code = task.workflow.code;
		// let name = task.current ? task.current[0].name : '';
        
		return (
			<div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem {...QulityCheckDeal.layout} label="处理意见">
                            <Input placeholder="请输入处理意见" onChange={this.changeNote.bind(this)} value={this.state.note} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button type='primary' onClick={this.handleSubmit.bind(this, task)} style={{ marginRight: 20 }}>提交</Button>
                        <Button onClick={this.handleReject.bind(this, task)}>废止</Button>
                    </div>
                </Row>
            </div>
		);
    }
    
    changeNote(event) {
		this.setState({
			note: event.target.value
		})
    }
    
    handleSubmit(task = {}) {
		const {
			location,
			actions: {
				putFlow
			},
		} = this.props
        let {
            note
        } = this.state
        
		//const { state_id = '0' } = queryString.parse(location.search) || {};   //获取stateID from url,当前执行节点（审核）

		let me = this;
		//获取登陆用户信息
		const user = getUser();
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id),
			"org": user.org,
		};

        if (!note) {
			note = '通过' + '。';
		}

		let state = task.current[0].id;
		let workflowData = {
			state: state,
			executor: executor,
			action: '通过',
			note: note,
			attachment: null
		}   //这里传递的都是当前节点的信息，流程会根据action_name自动跳到下一节点
		console.log('workflowData', workflowData)

		let data = {
			pk: task.id
		}

        putFlow(data, workflowData).then(rst => {
            if (rst && rst.creator) {
                notification.success({
                    message: '流程提交成功',
                    duration: 2
                })
				let to = `/selfcare/task`;
                me.props.history.push(to)
            } else {
                notification.error({
                    message: '流程提交失败',
                    duration: 2
                })
                return
            }
        })
        
    }
    
    handleReject(task = {}) {
		const {
			location,
			actions: {
				abolishFlow
			},
		} = this.props
        let {
            note
        } = this.state

		let me = this;
		//获取登陆用户信息
		const user = getUser();
		let executor = {
			"username": user.username,
			"person_code": user.code,
			"person_name": user.name,
			"id": parseInt(user.id)
		};

		
        if (!note) {
			note = '废止' + '。';
		}

		

		let state = task.current[0].id;
		let workflowData = {
            state: state,
			// executor: executor,
			// action: '退回',
			note: note,
			// attachment: null
		}

		let data = {
			pk: task.id
		}

		abolishFlow(data, workflowData).then(rst => {
			if (rst && rst.creator) {
				notification.success({
					message: '流程废止成功',
					duration: 2
				})
				let to = `/selfcare/task`;
				me.props.history.push(to)
			} else {
				notification.error({
					message: '流程废止失败',
					duration: 2
				})
			}
		})
	}
}