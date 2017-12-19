import React, {Component} from 'react';
import {Button, message, Form, Card, Row, Col, Select, DatePicker} from 'antd';
import {getUser} from '../../../_platform/auth';

const Option = Select.Option;
const FormItem = Form.Item;

class HandleInit extends Component {

	static propTypes = {};
	static checkLoop = (list, checkCode) => {
		let rst = null;
		list.find((item = {}) => {
			const {code, children = []} = item;
			if (code === checkCode) {
				rst = item;
			} else {
				const tmp = HandleInit.checkLoop(children, checkCode);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};

	//TODO 1、抄送功能的人员选择暂时未全部的users
	initFill() {
		const {
			selectedUnit, selectedProject, builders = [], packagesData = {
				extra_params: {
					instance: undefined,
				}
			},
			examines = [],
			actions: {postInstance, putInstanceUser, putInstanceStart, putPackage, getUnitTree, getPackages, postCarbonCopy},
			form: {validateFields},
		} = this.props;
		validateFields((err, fieldsValue) => {
			// console.log(fieldsValue)
			// return
			if (err) {
				return;
			}
			//结束时间
			let deadline = fieldsValue['deadline'].format('YYYY-MM-DD');
			let unitInfo = selectedUnit.split('--');
			//填报人相关信息
			let fillUserInfo = builders.filter(builder => builder.username === fieldsValue['fill_user'])[0];
			let initData = {
				name: selectedProject.name + unitInfo[2] + "施工包报审流程",
				description: selectedProject.name + unitInfo[2] + "施工包报审流程",
				subject: [
					{
						project: JSON.stringify({code: selectedProject.code, name: selectedProject.name}),
						unit: JSON.stringify({code: unitInfo[0], obj_type: unitInfo[1], name: unitInfo[2]}),
					}
				],
				code: "TEMPLATE_012",
				creator: {
					id: Number(getUser().id),
					username: getUser().username,
					person_name: getUser().name,
					person_code: getUser().code,
					organization: getUser().org
				},
				deadline: deadline,
				status: 1
			};
			postInstance({}, initData)
				.then(rst => {
					// console.log(11111, rst)
					let instanceInfo = rst;
					let userData = {
						participants: [
							{
								id: fillUserInfo.id,
								username: fillUserInfo.username,
								person_name: fillUserInfo.account.person_name,
								person_code: fillUserInfo.account.person_code,
								organization: fillUserInfo.account.organization
							}
						],
						remark: ''
					};
					putInstanceUser({ppk: instanceInfo.id, pk: instanceInfo.workflow.states[0].id}, userData)
						.then(rst => {
							// console.log(22222, rst)
							let createUser = {
								creator: {
									id: Number(getUser().id),
									username: getUser().username,
									person_name: getUser().name,
									person_code: getUser().code,
									organization: getUser().org
								}
							};
							putInstanceStart({pk: instanceInfo.id}, createUser)
								.then(rst => {
									// console.log(33333, rst)
									let changePackage = {
										version: "A",
										extra_params: Object.assign(
											packagesData.extra_params, {
												instance: "START"
											}
										)
									};
									putPackage({code: unitInfo[0]}, changePackage)
										.then(() => {
											message.success('发送流程成功！');
											//获取项目树数据
											getUnitTree();
											//获取当前工程的施工包数据
											getPackages({code: unitInfo[0]})
										})
									//流程抄送
									if (fieldsValue['listen_user'] && fieldsValue['listen_user'].length > 0) {
										let listenUsers = fieldsValue['listen_user'];
										let copyUsers = [];
										listenUsers.map(user => {
											copyUsers = copyUsers.concat(examines.filter(f => f.username === user))
										});
										console.log(111111111, copyUsers)
										const fetchCopyUsers = copyUsers.map(user => {
											let copyData = {
												state: instanceInfo.workflow.states[0].id,
												ccuser: [
													{
														id: user.id,
														username: user.username,
														person_name: user.account.person_name,
														person_code: user.account.person_code,
														organization: user.account.organization
													}
												],
												remark: '流程抄送备注'
											};
											return postCarbonCopy({pk: instanceInfo.id}, copyData);
										});
										Promise.all(fetchCopyUsers)
											.then(rst => {
												// console.log(2222222222, rst)
											})
									}


								})
						})
				})
		})
	}

	disabledDate(current) {
		return current && current.valueOf() < Date.now();
	}

	render() {
		const {
			builders = [], examines = [], selectedUnit, form: {getFieldDecorator}, selectedProject,
		} = this.props;
		let unitName = selectedUnit.split('--')[2];
		return (
			<div>
				<Card title={`${selectedProject.name}${unitName}施工包划分填报通知`} style={{width: '100%'}}>
					<Form>
						<Row>
							<Col span={23} offset={1}>
								{/*<h3 style={{color: 'red'}}>此工程暂未划分施工包</h3>*/}
								<div>请XX公司于
									<div style={{display: 'inline-block'}}>
										<FormItem
											label=""
										>
											{getFieldDecorator('deadline', {
												rules: [{type: 'object', required: true, message: '请选择结束时间！'}],
											})(
												<DatePicker
													format="YYYY-MM-DD"
													disabledDate={this.disabledDate.bind(this)}
												/>
											)}
										</FormItem>
									</div>
									前填报{selectedProject.name}{unitName}的施工包划分表。
								</div>
							</Col>
							<Col span={8}>
								<FormItem
									label="填报人："
									labelCol={{span: 6}}
									wrapperCol={{span: 16}}
								>
									{getFieldDecorator('fill_user', {
										rules: [{required: true, message: '请选择填报人！'}],
									})(
										<Select
											placeholder="请选择填报人！" allowClear
										>
											{
												builders.map((builder) => {
													return <Option value={builder.username}
																   key={builder.id}>{builder.account.person_name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem
									label="抄送人："
									labelCol={{span: 8}}
									wrapperCol={{span: 16}}
								>
									{getFieldDecorator('listen_user', {
										// rules: [{required: true, message: '请选择抄送人！'}],
									})(
										<Select
											placeholder="请选择抄送人！" allowClear mode="multiple"
										>
											{
												examines.map((builder) => {
													return <Option value={builder.username}
																   key={builder.id}>{builder.account.person_name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col span={4} offset={4}>
								<Button onClick={this.initFill.bind(this)}>提交</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			</div>
		);
	}
}

export default Form.create()(HandleInit)