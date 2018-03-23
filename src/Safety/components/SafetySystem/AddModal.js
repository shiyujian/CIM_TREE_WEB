import React, { Component } from 'react';
import {FILE_API,base, SOURCE_API, DATASOURCECODE,UNITS,SERVICE_API,PROJECT_UNITS,SECTIONNAME,WORKFLOW_CODE } from '../../../_platform/api';
import {
	Form, Input, Row, Col, Modal, Upload, Button,
	Icon, message, Table, DatePicker, Progress, Select, Checkbox, Popconfirm,notification
} from 'antd';
import { getUser } from '../../../_platform/auth';
import PerSearch from '../../../_platform/components/panels/PerSearch';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getNextStates } from '../../../_platform/components/Progress/util';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const fileTypes = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword';
class AddModal extends Component {
	static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            file:'',
            projectName:'', //当前用户的项目信息
			currentSection:'',
			currentSectionName:'',
			projectName:''
        };
    }
	async componentDidMount() {
        this.getSection()
    }
	
	render() {
		
		const {
            form: { getFieldDecorator },
			addVisible,
        } = this.props;
		const { 
			currentSectionName
        } = this.state;
		const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }

		return (
			<Modal title="新增文档"
				width={920} 
				visible={addVisible}
				closable={false}
				onCancel={this.cancel.bind(this)}
                onOk={this.sendWork.bind(this)}
				maskClosable={false}>
				<Form>
					<Row>
						<Col span={24}>
							<Row>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='标段'>
										{
											getFieldDecorator('Safesection', {
												initialValue: `${currentSectionName?currentSectionName:''}`,
												rules: [
													{ required: true, message: '请选择标段' }
												]
											})
												(<Input readOnly placeholder='请输入标段' />)	
										}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='名称'>
										{
											getFieldDecorator('Safename', {
												rules: [
													{ required: true, message: '请输入名称' }
												]
											})
												(<Input placeholder='请输入名称' />)
										}
									</FormItem>
								</Col>
								
							</Row>
							<Row>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='编号'>
										{
											getFieldDecorator('Safenumbercode', {
												rules: [
													{ required: true, message: '请输入编号' }
												]
											})
												(<Input placeholder='请输入编号' />)
										}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem {...FormItemLayout} label='文档类型'>
										{
											getFieldDecorator('Safedocument', {
												rules: [
													{ required: true, message: '请选择文档类型' }
												]
											})
												(<Select placeholder='请选择文档类型' >
													<Option key={'安全管理体系'} value={'安全管理体系'}>安全管理体系</Option>
													<Option key={'安全应急预案'} value={'安全应急预案'}>安全应急预案</Option>
													<Option key={'安全专项方案'} value={'安全专项方案'}>安全专项方案</Option>
												</Select>)
										}
									</FormItem>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24} style={{ marginTop: 16, height: '160px' }}>
							<Dragger 
								{...this.uploadProps}
							>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox" />
								</p>
								<p>点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									支持 pdf、doc、docx 文件
						 		</p>
							</Dragger>
						</Col>
					</Row>
					<Row style={{ marginTop: 20}}>
						<Col span={8} offset={4}>
							<FormItem {...FormItemLayout} label='审核人'>
								{
									getFieldDecorator('SafedataReview', {
										rules: [
											{ required: true, message: '请选择审核人员' }
										]
									})
										(
										<PerSearch selectMember={this.selectMember.bind(this)} 
											// code={WORKFLOW_CODE.安全体系报批流程}
											code={WORKFLOW_CODE.总进度计划报批流程}  
											visible={addVisible}
										/>
										)
								}
							</FormItem>
						</Col>
						<Col span={8} offset={4}>
							<Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
						</Col>
					</Row>
				</Form>
			</Modal>
		)
	}

	cancel() {
		const { actions: { AddVisible } } = this.props;
		AddVisible(false);
	}
	sendWork(){
		const {
            actions: {
                createFlow,
                getWorkflowById,
				putFlow,
				AddVisible,
				getTaskSafety
            },
            location,
        } = this.props
        const {
            projectName,
            currentSectionName,
			currentSection,
			file
		} = this.state

		let me = this;
        //共有信息
		let postData = {};
		let user = getUser();//当前登录用户
        let sections = user.sections || []
        if(!sections || sections.length === 0 ){
            notification.error({
                message:'当前用户未关联标段，不能创建流程',
                duration:3
            })
            return
		}
		
		me.props.form.validateFields((err, values) => {
			if (!err) {
				postData.upload_unit = user.org ? user.org : '';
                postData.type = '安全体系';
                postData.upload_person = user.name ? user.name : user.username;
                postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                 
                const currentUser = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
					"id": parseInt(user.id),
				};
				
				let subject = [{
                    "section": JSON.stringify(currentSection),
                    "sectionName":JSON.stringify(currentSectionName),
					"projectName":JSON.stringify(projectName),
					"Safename": JSON.stringify(values.Safename),
					"dataReview": JSON.stringify(values.SafedataReview),
					"numbercode": JSON.stringify(values.Safenumbercode),
					"timedate": JSON.stringify(moment().format('YYYY-MM-DD')),
					"document": JSON.stringify(values.Safedocument),
					"postData": JSON.stringify(postData),
                    "file": JSON.stringify(file),
                    
				}];
				
				const nextUser = this.member;
                let WORKFLOW_MAP = {
                    name: "安全体系报批流程",
                    desc: "安全管理模块安全体系报批流程",
                    code: WORKFLOW_CODE.安全体系报批流程
                };
                let workflowdata = {
                    name: WORKFLOW_MAP.name,
                    description: WORKFLOW_MAP.desc,
                    subject: subject,
                    code: WORKFLOW_MAP.code,
                    creator: currentUser,
                    plan_start_time: null,
                    deadline: null,
                    "status": 2
				}
				
				createFlow({}, workflowdata).then((instance) => {
                    if (!instance.id) {
                        notification.error({
                            message: '数据提交失败',
                            duration: 2
                        })
                        return;
                    }
                    const { id, workflow: { states = [] } = {} } = instance;
                    const [{ id: state_id, actions: [action] }] = states;

                    getWorkflowById({ id: id }).then(instance => {
                        if (instance && instance.current) {
                            let currentStateId = instance.current[0].id;
                            let nextStates = getNextStates(instance, currentStateId);
                            let stateid = nextStates[0].to_state[0].id;

                            let postInfo = {
                                next_states: [{
                                    state: stateid,
                                    participants: [nextUser],
                                    deadline: null,
                                    remark: null
                                }],
                                state: instance.workflow.states[0].id,
                                executor: currentUser,
                                action: nextStates[0].action_name,
                                note: "提交",
                                attachment: null
                            }
                            let data = { pk: id };
                            //提交流程到下一步
                            putFlow(data, postInfo).then(rst => {
                                if (rst && rst.creator) {
                                    notification.success({
                                        message: '流程提交成功',
                                        duration: 2
									});
									getTaskSafety({code:WORKFLOW_CODE.安全体系报批流程})
                                    // this.gettaskSchedule();//重新更新流程列表
                                    AddVisible(false);
                                } else {
                                    notification.error({
                                        message: '流程提交失败',
                                        duration: 2
                                    });
                                    return;
                                }
                            });
                        }
                    });
                });
			}
		})
	}

	 //选择人员
	 selectMember(memberInfo) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    "username": memberValue[4],
                    "person_code": memberValue[1],
                    "person_name": memberValue[2],
                    "id": parseInt(memberValue[3]),
                    org: memberValue[5],
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            SafedataReview: this.member
        });
    }

    //上传文件
    uploadProps = {
        name: 'a_file',
        multiple: true,
        showUploadList: false,
        action: base + "/service/fileserver/api/user/files/",
        onChange: ({ file, fileList, event }) => {
			
            const status = file.status;
            const { newFileLists } = this.state;
            let newdata = [];
            if (status === 'done') {
				console.log('file',file)
				console.log('fileList',fileList)
				console.log('event',event)
				this.setState({file:file});

            }else if(status === 'error'){
				this.setState({file:null});
				notification.error({
					message: '文件上传失败',
					duration: 2
				})
				return;
			}
        },
    };
	
	changeDoc({ file, fileList, event }) {
		const {
            docs = [],
			actions: { changeDocs }
        } = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		// this.setState({
		// 	isUploading: file.status === 'done' ? false : true
		// })
		if (event) {
			let { percent } = event;
			// if (percent !== undefined)
			// 	this.setState({ progress: parseFloat(percent.toFixed(1)) });
		}
	}
	//获取当前登陆用户的标段
	getSection(){
		let user = getUser()
		
		let sections = user.sections
		let sectionSchedule = []
		let currentSectionName = ''
		let projectName = ''
		
		sections = JSON.parse(sections)
		if(sections && sections instanceof Array && sections.length>0){
			let section = sections[0]
			console.log('section',section)
			let code = section.split('-')
			if(code && code.length === 3){
				//获取当前标段的名字
				SECTIONNAME.map((item)=>{
					if(code[2] === item.code){
						currentSectionName = item.name
					}
				})
				//获取当前标段所在的项目
				PROJECT_UNITS.map((item)=>{
					if(code[0] === item.code){
						projectName = item.value
					}
				})
			}
			console.log('section',section)
			console.log('currentSectionName',currentSectionName)
			console.log('projectName',projectName)
			this.setState({
				currentSection:section,
				currentSectionName:currentSectionName,
				projectName:projectName
			})
			// sections.map((section)=>{
			//     let code = section.split('-')
			//     if(code && code.length === 3){
			//         //获取当前标段的名字
			//         SECTIONNAME.map((item)=>{
			//             if(code[2] === item.code){
			//                 sectionName = item.name
			//             }
			//         })
			//         //获取当前标段所在的项目
			//         PROJECT_UNITS.map((item)=>{
			//             if(code[0] === item.code){
			//                 projectName = item.value
			//             }
			//         })
			//     }
			//     sectionSchedule.push({
			//         value:section,
			//         name:sectionName
			//     })
			// })
			// this.setState({
			//     sectionSchedule,
			//     projectName
			// })
		}
	}

	_cpoyMsgT(){

	}
}
export default Form.create()(AddModal)