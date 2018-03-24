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

export default class ScheduleTotalDeal extends Component {

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
		let code = task.workflow.code;
		let name = task.current ? task.current[0].name : '';
        
		return (
			<div>
                <Row style={{ marginTop: 10 }}>
                    <Col span={24}>
                        <FormItem {...ScheduleTotalDeal.layout} label="处理意见">
                            <Input placeholder="请输入处理意见" onChange={this.changeNote.bind(this)} value={this.state.note} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button type='primary' onClick={this.handleSubmit.bind(this, task)} style={{ marginRight: 20 }}>同意</Button>
                        <Button onClick={this.handleReject.bind(this, task)}>退回</Button>
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
                putFlow,
                addSchedule
			},
		} = this.props
        let {
            note
        } = this.state

        
		const { state_id = '0' } = queryString.parse(location.search) || {};

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

		//获取流程的action名称
		let action_name = '';
		let nextStates = getNextStates(task, Number(state_id));
		for (var i = 0; i < nextStates.length; i++) {
			if (nextStates[i].action_name === '通过') {
				action_name = nextStates[i].action_name
			}
        }
        if (!note) {
			note = action_name + '。';
		}
		let state = task.current[0].id;
		let workflowData = {
			state: state,
			executor: executor,
			action: action_name,
			note: note,
			attachment: null
		}
		console.log('workflowData', workflowData)
		let data = {
			pk: task.id
        }

        //进度数据入库
        console.log('task',task)
        let subject = task.subject[0];
        let postdata = subject.postData ? JSON.parse(subject.postData) : '';
        let TreatmentData = subject.TreatmentData ? JSON.parse(subject.TreatmentData) : '';
        console.log('TreatmentData',TreatmentData)
        let items = [];
        TreatmentData.map((item)=>{
            let data = {
                fileName:item.fileName,
                file_id:item.file_id,
                file_partial_url:item.file_partial_url,
                send_time:item.send_time,
                a_file:item.a_file,
                download_url:item.download_url,
                remarks:item.remarks
            }
            items.push(data)
        })

        let filePath = JSON.stringify(items)
        
        let scheduledata = {
            DocType:'doc',
            ProgressNo:'01',
            ProgressTime:moment(postdata.upload_time).format('YYYY-MM-DD'),
            ProgressType:'总进度',
            SMS:0,
            UnitProject:subject.section?JSON.parse(subject.section):'',
            WPNo:'',
            FilePath:filePath
        }
        // 日进度入库
        addSchedule({},scheduledata).then(item=>{
            console.log('item',item)
            if(item&&item.msg){
                notification.success({
                    message:"上传数据成功",
                    duration:2
                })

                putFlow(data, workflowData).then(rst => {
                    if (rst && rst.creator) {
                        notification.success({
                            message: '流程提交成功',
                            duration: 2
                        })
                        let to = `/selfcare`;
                        me.props.history.push(to)
                    } else {
                        notification.error({
                            message: '流程提交失败',
                            duration: 2
                        })
                        return
                    }
                })

            }else{
                notification.error({
                    message:"上传数据失败",
                    duration:2
                })
            }	
        })
        
        
    }
    
    handleReject(task = {}) {
		const {
			location,
			actions: {
				putFlow
			},
		} = this.props
        let {
            note
        } = this.state

        
		const { state_id = '0' } = queryString.parse(location.search) || {};

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

		//获取流程的action名称
		let action_name = '';
		let nextStates = getNextStates(task, Number(state_id));
		for (var i = 0; i < nextStates.length; i++) {
			if (nextStates[i].action_name === '退回') {
				action_name = nextStates[i].action_name
			}
        }
        if (!note) {
			note = action_name + '。';
		}

		

		let state = task.current[0].id;
		let workflowData = {
			state: state,
			executor: executor,
			action: action_name,
			note: note,
			attachment: null
		}
		console.log('workflowData', workflowData)

		let data = {
			pk: task.id
		}

		putFlow(data, workflowData).then(rst => {
			console.log('rst', rst)
			if (rst && rst.creator) {
				notification.success({
					message: '流程退回成功',
					duration: 2
				})
				let to = `/selfcare`;
				me.props.history.push(to)
			} else {
				notification.error({
					message: '流程退回失败',
					duration: 2
				})
			}
		})
	}
}