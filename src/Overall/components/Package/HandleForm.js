import React, {Component} from 'react';
import PtrTree from './PtrTree'
import ItmTree from './ItmTree'
import Tables from './Tables'
import ModalAdd from './ModalAdd'
import {Row, Col, Button, message, Form, Select, DatePicker,Icon,Upload} from 'antd';
import {getUser} from '../../../_platform/auth';
import {SERVICE_API} from '../../../_platform/api';

const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const Option = Select.Option;

/** TODO 关于流程审批的TODO问题，等任务中心完成后移植过去
 *
 * tag1:
 * 施工包划分被退回  修改施工包中的状态（备：施工包划分完成，为'END'）
 *
 let changePackage = {
		version: "A",
		extra_params: Object.assign(
			packagesData.extra_params, {
				instance: "EDIT"
			}
		)
	};
 putPackage({code: selectedUnit.split('--')[0]}, changePackage)

 tag2:新增的施工包数据的promises放在任务完成的时候

 // //分部
 // let promisePtrs = [];
 // //子分部
 // let promisePtrs_s = [];
 // ptrTreeData.map(ptr => {
		// 	promisePtrs.push(this.getObjInfo(ptr));
		// 	ptr.children.map(ptr_s => {
		// 		promisePtrs_s.push(this.getObjInfo(ptr_s))
		// 	})
		// });
 // //单元
 // let promiseItms = [];
 // itmTreeData.map(itm => {
		// 	promiseItms.push(this.getObjInfo(itm))
		// });
 // const fetchPtrs = promisePtrs.map(data => {
					// 	return postPackage({}, data);
					// });
 // const fetchPtrs_s = promisePtrs_s.map(data => {
					// 	return postPackage({}, data);
					// });
 // const fetchItms = promiseItms.map(data => {
					// 	return postPackage({}, data);
					// });
 //
 // Promise.all(fetchPtrs)
 //    .then(rst => {
			// 		console.log('aaaa', rst)
			// 		Promise.all(fetchPtrs_s)
			// 			.then(rst => {
			// 				console.log('bbbb', rst)
			// 				Promise.all(fetchItms)
			// 					.then(rst => {
			// 						console.log('cccc', rst)
			// 					})
			// 			})
			// 	})

 getObjInfo(Info) {
				let obj = {
					name: Info.name,
					code: Info.code,
					obj_type: Info.obj_type,
					version: Info.version,
					status: Info.status,
					parent: Info.parent
				};
				return obj;
			}
 tag3：审批通过
 eg：
 http://bimcd.ecidi.com:6544/service/workflow/api/instance/407/logevent/
 {
	"state": 2570,
	"executor": {
	   "username": "15989456263",
		"organization": "工程部",
		"person_code": "QTK_0204",
		"person_name": "赵启佳",
		"id": "20"
	},
	"action": "通过" || '退回',
	"note": "通过审批",
	"attachment":null
}
 * */

class HandleForm extends Component {

	static propTypes = {};

	//新增
	newUnit(type) {
		const {
			actions: {toggleModal},
			selectedPtr,
		} = this.props;
		if (type === 'C_WP_PTR_S' && selectedPtr.split('--')[1] === 'C_WP_PTR_S') {
			message.warning('请选择分部工程再新增子分部工程')
		} else {
			toggleModal({
				visible: true,
				type: type,
			})
		}
	}

	deleteEngineer(type) {
		const {
			actions: {setItmTree, setSelectedItm, setTables, setPtrTree, setSelectedPtr},
			selectedItm,
			selectedPtr,
			itmTreeData = [],
			tablesData = [],
			ptrTreeData = [],
		} = this.props;
		if (type === 'ITM') {
			if (!selectedItm) {
				message.warning('请选择要删除的分项工程')
			} else {
				setItmTree(itmTreeData.filter(f => f.code !== selectedItm.split('--')[0]))
				setSelectedItm(undefined);
				setTables(tablesData.filter(f => f.code !== selectedItm.split('--')[0]))
			}
		} else if (type === 'PTR') {
			setTables(tablesData.filter(f => f.code.indexOf(selectedPtr.split('--')[0]) < 0));
			setItmTree(itmTreeData.filter(f => f.code.indexOf(selectedPtr.split('--')[0]) < 0));
			let editPtrTreeData = ptrTreeData;
			editPtrTreeData = ptrTreeData.filter(f => f.code.indexOf(selectedPtr.split('--')[0]) < 0)
			editPtrTreeData.map((ptr, index) => {
				editPtrTreeData[index].children = ptr.children.filter(f => f.code.indexOf(selectedPtr.split('--')[0]) < 0)
			});
			setPtrTree(editPtrTreeData);
			setSelectedPtr(undefined);
			setSelectedItm(undefined);
		}
	}

	//提交施工包划分
	submitPackage() {
		const {id: instanceId} = this.props.match.params;
		const {
			ptrTreeData = [], itmTreeData = [], tablesData = [], instanceDetail, selectedUnit,
			selectedProject,examines=[],
			actions: {
				postLogEvent, postSubject, putPackage, getUnitTree, getPackages,
				setPtrTree, setItmTree, setTables, postInstance
			},
			packagesData = {
				extra_params: {
					instance: undefined,
				}
			},
			form: {validateFields},
		} = this.props;
		if (tablesData.length === 0) {
			message.warning('请先新增分项工程！');
			return
		}
		if (instanceId !== undefined) {  //根据施工包划分流程任务来的
			let states = instanceDetail.workflow.states;
			let logEventData = {
				next_states: [
					{
						state: states[1].id,
						participants: [
							instanceDetail.creator
						],
						deadline: instanceDetail.deadline,
						remark: '备注信息'
					}
				],
				state: states[0].id,
				executor: {
					id: Number(getUser().id),
					username: getUser().username,
					person_name: getUser().name,
					person_code: getUser().code,
					organization: getUser().org
				},
				action: "填报",
				note: "完成施工包填写",
				attachment: null
			};
			let subjectData = {
				subject: [
					{
						project: instanceDetail.subject[0].project,
						unit: instanceDetail.subject[0].unit,
						ptrTreeData: JSON.stringify(ptrTreeData),
						itmTreeData: JSON.stringify(itmTreeData),
						tablesData: JSON.stringify(tablesData)
					}
				]
			};
			//执行流程走下去
			postLogEvent({pk: instanceDetail.id}, logEventData)
				.then(rst => {
					console.log('提交流程后的结果', rst)
					//在subject中添加三组数据方便展示和修改施工包划分的数据
					postSubject({pk: instanceDetail.id}, subjectData)
						.then(rst => {
							console.log('修改subject的结果', rst)
						});
					//修改当前的施工包划分在审核中
					let changePackage = {
						version: "A",
						extra_params: Object.assign(
							packagesData.extra_params, {
								instance: "IN_REVIEW"
							}
						)

					};
					putPackage({code: selectedUnit.split('--')[0]}, changePackage)
						.then(() => {
							/**
							 * 判断是初始化新增施工包还是修改施工包*/
							let instanceType = packagesData.extra_params.instance;
							if (instanceType === 'START') {
								message.success('填报施工包成功，请等待审批！');
							} else if (instanceType === 'EDIT') {
								message.success('修改施工包成，请等待审批！');
							}
							getUnitTree();
							getPackages({code: selectedUnit.split('--')[0]});
							//清空数据
							setPtrTree([]);
							setItmTree([]);
							setTables([]);
							this.props.history.replace('/overall');
						})

				})
		} else {  //施工单位主动发起任务的
			validateFields((['deadline','examine_user']),(err, fieldsValue) => {
				// console.log(fieldsValue)
				if (err) {
					return;
				}
				let unitInfo = selectedUnit.split('--');
				let deadline=fieldsValue['deadline'].format('YYYY-MM-DD');
				//TODO 审批人信息 审批人暂时用的全部人员的数据
				let examineUserInfo=examines.filter(builder => builder.username === fieldsValue['examine_user'])[0];
				let initData = {
					name: selectedProject.name + unitInfo[2] + "施工包报审流程",
					description: selectedProject.name + unitInfo[2] + "施工包报审流程",
					subject: [
						{
							project: JSON.stringify({code: selectedProject.code, name: selectedProject.name}),
							unit: JSON.stringify({code: unitInfo[0], obj_type: unitInfo[1], name: unitInfo[2]}),
							ptrTreeData: JSON.stringify(ptrTreeData),
							itmTreeData: JSON.stringify(itmTreeData),
							tablesData: JSON.stringify(tablesData)
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
					status: 2
				};
				postInstance({}, initData)
					.then(rst => {
						// console.log('=++++++++++++=', rst)
						let states = rst.workflow.states;
						let logEventData = {
							next_states: [
								{
									state: states[1].id,
									participants: [
										{
											id: examineUserInfo.id,
											username: examineUserInfo.username,
											person_name: examineUserInfo.account.person_name,
											person_code: examineUserInfo.account.person_code,
											organization: examineUserInfo.account.organization
										}
									],
									deadline: rst.deadline,
									remark: '备注信息'
								}
							],
							state: states[0].id,
							executor: {
								id: Number(getUser().id),
								username: getUser().username,
								person_name: getUser().name,
								person_code: getUser().code,
								organization: getUser().org
							},
							action: "填报",
							note: "完成施工包填写",
							attachment: null
						};
						postLogEvent({pk: rst.id}, logEventData)
							.then(rst => {
								// console.log('提交流程后的结果', rst)
								//修改当前的施工包划分在审核中
								let changePackage = {
									version: "A",
									extra_params: Object.assign(
										packagesData.extra_params, {
											instance: "IN_REVIEW"
										}
									)
								};
								putPackage({code: selectedUnit.split('--')[0]}, changePackage)
									.then(() => {
										message.success('施工包划分填报成功，等待监理单位审批！');
										getUnitTree();
										getPackages({code: selectedUnit.split('--')[0]});
										//清空数据
										setPtrTree([]);
										setItmTree([]);
										setTables([]);
									})

							})
					})
			});
		}
	}

	disabledDate(current) {
		return current && current.valueOf() < Date.now();
	}
	//下载模板
	downTemplates(){
		const {actions:{getTemplates}}=this.props;
		getTemplates({})
			.then(templates=>{
				//TODO 下载文件部署问题
				// window.location.href=templates['t-plan_data'];
			})
	}

	uploadProps = {
		name: 'file',
		showUploadList: false,
		action: SERVICE_API+"/excel/upload-api/?t_code=t-01",
		onChange:({file})=>{
			const status = file.status;
			if (status === 'done') {
				console.log(1111,file)
				let {response:{
					WP,errors
				}}=file;
				console.log(222222,WP)
				console.log(333333,errors)
			}
		},
	};

	render() {
		const {
			selectedUnit,
			selectedPtr,
			selectedItm,
			examines = [],
			toggleData: toggleData = {
				visible: false
			},
			form: {getFieldDecorator},
		} = this.props;
		const {id: instanceId} = this.props.match.params;
		return (
			<div>
				<Row>
					<Col span={3} offset={1}>
						<Button onClick={this.submitPackage.bind(this)}>提交划分</Button>
					</Col>
					<Col span={15}>
						{
							instanceId === undefined ? (
								<Form>
									<Row>
										<Col span={8}>
											<FormItem
												label="结束时间"
												labelCol={{span: 12}}
												wrapperCol={{span: 12}}
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
										</Col>
										<Col span={8}>
											<FormItem
												label="审批人："
												labelCol={{span: 12}}
												wrapperCol={{span: 12}}
											>
												{getFieldDecorator('examine_user', {
													rules: [{required: true, message: '请选择审批人！'}],
												})(
													<Select
														placeholder="请选择审批人！" allowClear
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
										<Col span={8}>
											<FormItem
												label="抄送人："
												labelCol={{span: 12}}
												wrapperCol={{span: 12}}
											>
												{getFieldDecorator('listen_user', {
													rules: [{required: true, message: '请选择抄送人！'}],
												})(
													<Select
														placeholder="请选择抄送人！" allowClear
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
									</Row>
								</Form>
							) : null
						}
					</Col>
					<Col span={4} offset={1}>
						<Button onClick={this.downTemplates.bind(this)}>下载模板</Button>
						<Upload {...this.uploadProps}>
							<Button>
								<Icon type="upload" />上传表格
							</Button>
						</Upload>
					</Col>
				</Row>
				<Row>
					<Col span={7} offset={1}>
						<Row>分部/子分部编辑</Row>
						<Row>
							<ButtonGroup>
								<Button size="small"
										onClick={this.newUnit.bind(this, 'C_WP_PTR')}
										disabled={selectedUnit === undefined ? true : false}>新建分部</Button>
								<Button size="small"
										onClick={this.newUnit.bind(this, 'C_WP_PTR_S')}
										disabled={selectedPtr === undefined ? true : false}>新建子分部</Button>
								<Button size="small"
										onClick={this.deleteEngineer.bind(this, 'PTR')}
										disabled={selectedPtr === undefined ? true : false}>删除</Button>
							</ButtonGroup>
						</Row>
						<PtrTree {...this.props}/>
					</Col>
					<Col span={6}>
						<div>分项编辑</div>
						<Row>
							<ButtonGroup>
								<Button size="small"
										disabled={selectedPtr === undefined ? true : false}
										onClick={this.newUnit.bind(this, 'C_WP_ITM')}
								>新建分项</Button>
								<Button size="small"
										onClick={this.deleteEngineer.bind(this, 'ITM')}
										disabled={selectedItm === undefined ? true : false}
								>删除</Button>
							</ButtonGroup>
						</Row>
						<ItmTree {...this.props}/>
					</Col>
					<Col span={9} offset={1}>
						<Tables {...this.props}/>
					</Col>
				</Row>
				{
					toggleData.visible ? <ModalAdd {...this.props}/> : null
				}
			</div>
		);
	}
}

export default Form.create()(HandleForm)