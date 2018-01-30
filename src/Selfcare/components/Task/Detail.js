import React, { Component } from 'react';
import { Table, Input, Row, Col, Card, Select, DatePicker, Popconfirm, notification, Button, Form, message } from 'antd';
import { WORKFLOW_MAPS, WORKFLOW_CODE } from '_platform/api';
import styles from './index.css';
import moment from 'moment';
import PerSearch from '../../../Overall/components/FormManage/PerSearch';
import { getUser } from '../../../_platform/auth';
import { getNextStates } from '../../../_platform/components/Progress/util';
const FormItem = Form.Item;
export default class Detail extends Component {
	render() {
		const { platform: { task = {} } = {} } = this.props;
		if (task && task.workflow && task.workflow.code) {
			console.log('task', task)
			let code = task.workflow.code
			switch (code) {
				case WORKFLOW_CODE.总进度计划报批流程:
					return this.renderSchedule(task);
				case WORKFLOW_CODE.每日进度填报流程:
					return this.daySchedule(task);
				default:
					return <div>待定流程</div>
			}
		} else {
			return null
		}
	}

	renderSchedule(task = {}) {
		let code = task.workflow.code;
		let name = task.current ? task.current[0].name : '';
		const FormItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const { form: { getFieldDecorator } } = this.props
		let postData = {};
		let TreatmentData = [];
		let data_list = [];
		let oldReportTime = '';
		let delayReportTime = '';
		let remark = '';
		if (task.subject) {
			let subject = task.subject[0]
			postData = subject.postData ? JSON.parse(subject.postData) : '';
			TreatmentData = subject.TreatmentData ? JSON.parse(subject.TreatmentData) : '';
			data_list = subject.data_list ? JSON.parse(subject.data_list) : '';
		}
		const columns1 = [{
			title: '序号',
			dataIndex: 'index',
			key: 'index',
			width: '10%',
			render: (text, record, index) => {
				return index + 1
			}

		}, {
			title: '文件名称',
			dataIndex: 'fileName',
			key: 'fileName',
			width: '35%',
		}, {
			title: '备注',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '30%',
		}, {
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			width: '10%',
			render: (text, record, index) => {
				return <div>
					<a href='javascript:;' onClick={this.onViewClick.bind(this, record, index)}>预览</a>
					<span className="ant-divider" />
					<a onClick={this.download.bind(this, record, index)}>下载</a>
				</div>
			}
		}]
		return (
			<div>
				<Card>
					<h3>总进度计划报批流程详情</h3>
					<Form>
						<Row>
							<Col span={24}>
								<Row>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='区域'>
											{
												getFieldDecorator('totlearea', {
													initialValue: `${postData.area ? postData.area : '暂无区域'}`,
													rules: [
														{ required: false, message: '请选择区域' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='单位工程'>
											{
												getFieldDecorator('totleunit', {
													initialValue: `${postData.unit ? postData.unit : '暂无单位工程'}`,
													rules: [
														{ required: false, message: '请选择单位工程' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='编号'>
											{
												getFieldDecorator('totlenumbercode', {
													initialValue: `${postData.numbercode ? postData.numbercode : '暂无编号'}`,
													rules: [
														{ required: false, message: '请输入编号' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='审批单位'>
											{
												getFieldDecorator('totlesuperunit', {
													initialValue: `${postData.superunit ? postData.superunit : '暂无审批单位'}`,
													rules: [
														{ required: false, message: '请输入审批单位' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									{/* <Col span={8}>
										<FormItem {...FormItemLayout} label='文档类型'>
											{
												getFieldDecorator('totletype', {
													initialValue: ``,
													rules: [
														{ required: false, message: '请输入文档类型' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col> */}
									{/* <Col span={8}>
										<FormItem {...FormItemLayout} label='名称'>
											{
												getFieldDecorator('totlename', {
													initialValue: ``,
													rules: [
														{ required: false, message: '请输入名称' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col> */}
								</Row>
								<Row>

									<Table
										columns={columns1}
										pagination={true}
										dataSource={TreatmentData}
										rowKey='index'
									/>
								</Row>
								<Row>
									{
										(name == '审核' || name == '') ?
											<Col span={8}>
												<FormItem {...FormItemLayout} label='审核人'>
													{
														getFieldDecorator('dataReview', {
															initialValue: `${task.states[2].participants[0].executor.person_name}`,
															rules: [
																{ required: true, message: '请输入审核人员' }
															]
														})
															(<Input readOnly />)
													}
												</FormItem>
											</Col> :
											<Col span={8}>
												<FormItem {...FormItemLayout} label='审核人'>
													{
														getFieldDecorator('dataReview', {
															initialValue: ``,
															rules: [
																{ required: true, message: '请输入审核人员' }
															]
														})
															(<PerSearch
																selectMember={this.selectMember.bind(this)}
															/>)
													}
												</FormItem>
											</Col>

									}

								</Row>
							</Col>
						</Row>

					</Form>
				</Card>

			</div>)
	}
	daySchedule(task = {}) {
		let code = task.workflow.code;
		let name = task.current ? task.current[0].name : '';
		let typeschedule = null;
		const FormItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const { form: { getFieldDecorator } } = this.props
		let postData = {};
		let treedataSource = [];
		let oldReportTime = '';
		let delayReportTime = '';
		let remark = '';
		if (task.subject) {
			let subject = task.subject[0]
			postData = subject.postData ? JSON.parse(subject.postData) : '';
			treedataSource = subject.treedataSource ? JSON.parse(subject.treedataSource) : '';
			typeschedule = postData.type;
		}
		const columns1 = [{
			title: '序号',
			dataIndex: 'index',
			key: 'index',
			width: '10%',
			render: (text, record, index) => {
				return index + 1
			}
		}, {
			title: '项目',
			dataIndex: 'project',
			key: 'project',
		}, {
			title: '单位',
			dataIndex: 'units',
			key: 'units',
		}, {
			title: '数量',
			dataIndex: 'number',
			key: 'number',
		}];
		return (
			<div>
				<Card>
					{
						typeschedule =='每日计划进度'?<h3>每日计划进度流程详情</h3>:<h3>每日实际进度流程详情</h3>
					}
					<Form>
						<Row>
							<Col span={20}>
								<Row>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='区域'>
											{
												getFieldDecorator('dayarea', {
													initialValue: `${postData.area ? postData.area : '暂无区域'}`,
													rules: [
														{ required: false, message: '请选择区域' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='单位工程'>
											{
												getFieldDecorator('dayunit', {
													initialValue: `${postData.unit ? postData.unit : '暂无单位工程'}`,
													rules: [
														{ required: false, message: '请选择单位工程' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='编号'>
											{
												getFieldDecorator('daynumbercode', {
													initialValue: `${postData.numbercode ? postData.numbercode : '暂无编号'}`,
													rules: [
														{ required: false, message: '请输入编号' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='监理单位'>
											{
												getFieldDecorator('daysuperunit', {
													initialValue: `${postData.superunit ? postData.superunit : '监理单位'}`,
													rules: [
														{ required: false, message: '请输入监理单位' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
									<Col span={8}>
										<FormItem {...FormItemLayout} label='日期'>
											{
												getFieldDecorator('daytime', {
													initialValue: `${postData.timedate ? postData.timedate : '日期'}`,
													rules: [
														{ required: false, message: '日期' }
													]
												})
													(<Input readOnly />)
											}
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Table
										columns={columns1}
										pagination={true}
										dataSource={treedataSource}
										rowKey='index'
									/>
								</Row>
								<Row>
                                {
                                    (name == '审核' || name == '') ?
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('dataReview', {
                                                        initialValue: `${task.states[2].participants[0].executor.person_name}`,
                                                        rules: [
                                                            { required: true, message: '请输入审核人员' }
                                                        ]
                                                    })
                                                        (<Input readOnly />)
                                                }
                                            </FormItem>
                                        </Col> :
                                        <Col span={8}>
                                            <FormItem {...FormItemLayout} label='审核人'>
                                                {
                                                    getFieldDecorator('dataReview', {
                                                        initialValue: ``,
                                                        rules: [
                                                            { required: true, message: '请输入审核人员' }
                                                        ]
                                                    })
                                                        (<PerSearch
                                                            selectMember={this.selectMember.bind(this)}
                                                        />)
                                                }
                                            </FormItem>
                                        </Col>

                                }

                            </Row>
							</Col>
						</Row>
					</Form>
				</Card>
			</div>
		)
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
					"id": parseInt(memberValue[3])
				}
			}
		} else {
			this.member = null
		}

		setFieldsValue({
			dataReview: this.member
		});
		console.log('this.member', this.member)
	}
	// 预览
	onViewClick() {
		notification.info({
			message: "暂不支持预览，请等待更新！",
			duration: 2
		})
		return;
	}
	async download(record, index) {
		notification.info({
			message: "暂不支持下载，请等待更新！",
			duration: 2
		})
		return;
		// const {actions: {downloadFilesLink} } = this.props
		// try {
		// 	let link = await downloadFilesLink({ id: record.file_id }, {});
		// 	let apiGet = link.link;
		// 	console.log(record, link, apiGet)
		// 	this.createLink(this, apiGet);
		// 	const hide = message.loading('开始下载...', 0);
		// 	setTimeout(hide, 1500);
		// } catch (error) {
		// 	console.log(error)
		// }
	}

	createLink = (name, url) => {    //下载
		let link = document.createElement("a");
		link.href = url;
		link.setAttribute('download', this);
		link.setAttribute('target', '_blank');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
