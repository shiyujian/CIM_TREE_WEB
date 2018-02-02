import React, { Component, Children } from 'react';
import { Row, Col, Input, Form, Spin, Icon, Button, Table, Modal, DatePicker, Progress, Upload, Select, Checkbox, notification, Popconfirm } from 'antd';
// import {UPLOAD_API} from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { WORKFLOW_CODE, base, SOURCE_API, DATASOURCECODE } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { getUser } from '../../../_platform/auth';
import PerSearch from './PerSearch';
import SearchInfo from './SearchInfo';
import queryString from 'query-string';
import DayModal from './DayModal';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
class Plan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			daydata: [
				{
					unit: '1111'
				}
			],
			selectedRowKeys: [],
			dataSourceSelected: [],
			visible: false,
			dayvisible: false,
			isCopyMsg: false, //接收人员是否发短信
			treedataSource: [],
			treetype: [],//树种
			key: 6,

		};
	}

	componentDidMount() {
		const { actions: { gettreetype } } = this.props;
		let treedata = [{
			key: 1,
			project: '便道施工',
			units: 'm',
		}, {
			key: 2,
			project: '给排水沟槽开挖',
			units: 'm',
		}, {
			key: 3,
			project: '给排水管道安装',
			units: 'm',
		}, {
			key: 4,
			project: '给排水回填',
			units: 'm',
		}, {
			key: 5,
			project: '绿地平整',
			units: '亩',
		}, {
			key: 6,
			project: '种植穴工程',
			units: '个',
		},];
		this.setState({
			treedataSource: treedata,
		})
		gettreetype({})
			.then(rst => {
				let treetype = rst.map((o, index) => {
					return (
						<Option key={index} value={JSON.stringify(o)}>{o.TreeTypeNo}</Option>
					)
				})
				this.setState({ treetype });
			})
		this.gettaskSchedule();
	}
	// 获取日计划进度流程信息
    gettaskSchedule = async ()=>{
        const { actions: { getTaskSchedule } } = this.props;
		let task = await getTaskSchedule({ code: 'TEMPLATE_003', name:'每日计划进度填报流程' });
		console.log('task',task)
        let subject = [];
        let totledata = [];
        let arrange = {};
        task.map((item,index)=>{
            let itemdata = item.workflowactivity.subject[0];
            let itempostdata = itemdata.postData?JSON.parse(itemdata.postData):null;
            let itemtreedatasource = itemdata.treedataSource ? JSON.parse(itemdata.treedataSource) : null;
            let itemarrange = {
                index:index+1,
                id:item.workflowactivity.id,
                unit: itempostdata.unit,
                type: itempostdata.type,
                numbercode:itempostdata.numbercode,
                submitperson:item.workflowactivity.creator.person_name,
                submittime:item.workflowactivity.real_start_time,
                status:item.workflowactivity.status,
				daysuperunit:itempostdata.superunit,
				timedate:itempostdata.timedate,
				TreedataSource:itemtreedatasource,
                dataReview:itempostdata.dataReview.person_name
            }
            totledata.push(itemarrange);
        })
        this.setState({
            daydata:totledata
        })
    }
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, dataSourceSelected: selectedRows });
	}
	// 操作--查看
	clickInfo(record) {
		this.setState({ dayvisible: true });
	}
	// 取消
	totleCancle() {
		this.setState({ dayvisible: false });
	}
	// 确定
	totleOk() {
		this.setState({ dayvisible: false });
	}
	// 删除
	deleteClick = () => {
		const { selectedRowKeys } = this.state
		if (selectedRowKeys.length === 0) {
			notification.warning({
				message: '请先选择数据！',
				duration: 2
			});
			return
		} else {
			alert('还未做删除功能')
		}
	}

	// 新增按钮
	addClick = () => {
		let treedata = [{
			key: 1,
			project: '便道施工',
			units: 'm',
		}, {
			key: 2,
			project: '给排水沟槽开挖',
			units: 'm',
		}, {
			key: 3,
			project: '给排水管道安装',
			units: 'm',
		}, {
			key: 4,
			project: '给排水回填',
			units: 'm',
		}, {
			key: 5,
			project: '绿地平整',
			units: '亩',
		}, {
			key: 6,
			project: '种植穴工程',
			units: '个',
		},];
		this.setState({
			visible: true,
			treedataSource: treedata
		})
		this.props.form.setFieldsValue({
			superunit: undefined,
			unit: undefined,
			dataReview: undefined,
			numbercode: undefined,
			timedate: moment().add(1, 'days').format('YYYY-MM-DD')
		})

	}
	// 关闭弹框
	closeModal() {

		this.setState({
			visible: false,
		})
	}
	// 添加树列表
	addTreeClick() {
		const { treedataSource, key } = this.state;
		let num = key + 1;
		let project = [
			<Select style={{ width: '200px' }} placeholder='请选择树种' onSelect={this.handleSelect.bind(this, key, 'project')}>
				{
					this.state.treetype
				}
			</Select>
		]
		let addtree = {
			key: num,
			project: project,
			units: '棵'
		}
		treedataSource.push(addtree);
		console.log('treedataSource', treedataSource)
		this.setState({ treedataSource, key: num })
	}
	// 删除树列表
	delTreeClick(index) {
		alert('暂时无法删除')
	}
	//下拉框选择变化
	handleSelect(index, key, value) {
		const { treedataSource } = this.state;
		value = JSON.parse(value);
		treedataSource[index][key] = value.TreeTypeNo;
		this.setState({ treedataSource });
	}

	// 短信
	_cpoyMsgT(e) {
		this.setState({
			isCopyMsg: e.target.checked,
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
				console.log('memberValue', memberValue)
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
			dataReview: this.member,
			superunit: this.member.org
		});
	}
	// 发起填报
	sendWork() {
		const {
			actions: {
				createFlow,
			getWorkflowById,
			putFlow
			},
			location,
		} = this.props
		const { treedataSource } = this.state
		let user = getUser();//当前登录用户
		let me = this;
		//共有信息
		let postData = {};
		console.log("登录用户", user)
		console.log("表格信息", treedataSource)
		me.props.form.validateFields((err, values) => {
			console.log("表单信息", values);
			if (!err) {
				// 共有信息
				for (let value in values) {
					if (value === 'unit') {
						postData.unit = values[value];
					} else if (value === 'superunit') {
						postData.superunit = values[value];
					} else if (value === 'dataReview') {
						postData.dataReview = values[value];
					} else if (value === 'numbercode') {
						postData.numbercode = values[value];
					} else if (value === 'timedate') {
						postData.timedate = values[value];
					} else {
						console.log(1111)
					}
				}
				postData.upload_unit = user.org ? user.org : '';
				postData.type = '每日计划进度';
				postData.upload_person = user.name ? user.name : user.username;
				postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');
				console.log("postData", postData)
				const currentUser = {
					"username": user.username,
					"person_code": user.code,
					"person_name": user.name,
					"id": parseInt(user.id)
				};
				let subject = [{
					//共有属性
					"postData": JSON.stringify(postData),
					//数据清单
					"treedataSource": JSON.stringify(treedataSource),
				}];
				// 准备发起流程
				const nextUser = this.member;
				let WORKFLOW_MAP = {
					name: "每日计划进度填报流程",
					desc: "综合管理模块每日计划进度填报流程",
					code: WORKFLOW_CODE.每日进度填报流程
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
				//创建流程
				createFlow({}, workflowdata).then((instance) => {
					console.log("instance", instance)
					if (!instance.id) {
						notification.error({
							message: '数据提交失败',
							duration: 2
						})
						return;
					}
					const { id, workflow: { states = [] } = {} } = instance;
					const [{ id: state_id, actions: [action] }] = states;
					//获取流程信息 
					getWorkflowById({ id: id }).then(instance => {
						if (instance && instance.current) {
							let currentStateId = instance.current[0].id;
							let nextStates = getNextStates(instance, currentStateId);
							console.log('nextStates', nextStates)
							let stateid = nextStates[0].to_state[0].id;

							let postInfo = {
								next_states: [{
									state: stateid,
									participants: [nextUser],//下一步执行人
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
									this.gettaskSchedule();
									this.setState({
										visible: false
									})
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
	render() {
		const { selectedRowKeys, } = this.state;
		const {
            form: { getFieldDecorator },
        } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const FormItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		}
		return (
			<div>
				{
					this.state.dayvisible &&
					<DayModal {...this.props}
						oncancel={this.totleCancle.bind(this)}
						onok={this.totleOk.bind(this)}
					/>
				}
				<SearchInfo {...this.props} />
				<Button onClick={this.addClick.bind(this)}>新增</Button>
				<Button onClick={this.deleteClick.bind(this)}>删除</Button>
				<Table
					columns={this.columns}
					rowSelection={rowSelection}
					dataSource={this.state.daydata}
					className='foresttable'
					bordered 
					rowKey='index'/>
				<Modal
					title="新增每日计划进度"
					width={800}
					visible={this.state.visible}
					maskClosable={false}
					onCancel={this.closeModal.bind(this)}
					onOk={this.sendWork.bind(this)}
				>
					<div>
						<Form>
							<Row>
								<Col span={24}>
									<Row>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='单位工程'>
												{
													getFieldDecorator('unit', {
														rules: [
															{ required: true, message: '请选择单位工程' }
														]
													})
														(<Select placeholder='请选择区域' allowClear>
															<Option value='单位工程一'>单位工程一</Option>
															<Option value='单位工程二'>单位工程二</Option>
															<Option value='单位工程三'>单位工程三</Option>
														</Select>)
												}
											</FormItem>
										</Col>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='编号'>
												{
													getFieldDecorator('numbercode', {
														rules: [
															{ required: true, message: '请输入编号' }
														]
													})
														(<Input placeholder='请输入编号' />)
												}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='监理单位'>
												{
													getFieldDecorator('superunit', {
														rules: [
															{ required: true, message: '请输入监理单位' }
														]
													})
														(<Input placeholder='请输入监理单位' />)
												}
											</FormItem>
										</Col>
										<Col span={8}>
											<FormItem {...FormItemLayout} label='日期'>
												{
													getFieldDecorator('timedate', {
														rules: [
															{ required: true, message: '请输入日期' }
														]
													})
														(<Input placeholder='请输入日期' />)
												}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Table
											columns={this.columns1}
											dataSource={this.state.treedataSource}
											className='foresttable'
										/>
										<Button onClick={this.addTreeClick.bind(this)} style={{ marginLeft: 20, marginRight: 10 }} type="primary" ghost>添加</Button>
									</Row>
									<Row>

										<Col span={8} offset={4}>
											<FormItem {...FormItemLayout} label='审核人'>
												{
													getFieldDecorator('dataReview', {
														rules: [
															{ required: true, message: '请选择审核人员' }
														]
													})
														(
														<PerSearch selectMember={this.selectMember.bind(this)} />
														)
												}
											</FormItem>
										</Col>
										<Col span={8} offset={4}>
											<Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
										</Col>
									</Row>
								</Col>
							</Row>

						</Form>
					</div>
				</Modal>
			</div>
		)
	}


	columns = [
		{
			title: '单位工程',
			dataIndex: 'unit',
			key: 'unit',
			width: '15%'
		}, {
			title: '进度类型',
			dataIndex: 'type',
			key: 'type',
			width: '10%'
		}, {
			title: '编号',
			dataIndex: 'numbercode',
			key: 'numbercode',
			width: '10%'
		}, {
			title: '提交人',
			dataIndex: 'submitperson',
			key: 'submitperson',
			width: '10%'
		}, {
			title: '提交时间',
			dataIndex: 'submittime',
			key: 'submittime',
			width: '10%',
			sorter: (a, b) => moment(a['submittime']).unix() - moment(b['submittime']).unix(),
			render: text => {
				return moment(text).format('YYYY-MM-DD')
			}
		}, {
			title: '流程状态',
			dataIndex: 'status',
			key: 'status',
			width: '15%',
			render:(record,index)=>{
                if(record===1){
                    return '已提交'
                }else if(record===2){
                    return '执行中'
                }else if(record===3){
                    return '已完成'
                }else{
                    return ''
                }
            }
		}, {
			title: '操作',
			render: record => {
				return (
					<span>
						<a onClick={this.clickInfo.bind(this, record, 'VIEW')}>查看</a>
					</span>
				)
			}
		},
	];

	columns1 = [{
		title: '序号',
		dataIndex: 'key',
		key: 'key',
		width: '10%',
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
		render: (text, record, index) => {
			return <Input value={record.number || ""} onChange={ele => {
				record.number = ele.target.value
				this.forceUpdate();
			}} />
		}
	}, {
		title: '操作',
		dataIndex: 'operation',
		key: 'operation',
		width: '10%',
		render: (text, record, index) => {
			if (index >= 6) {
				return <div>
					<Popconfirm
						placement="rightTop"
						title="确定删除吗？"
						onConfirm={this.delTreeClick.bind(this, record, index + 1)}
						okText="确认"
						cancelText="取消">
						<a>删除</a>
					</Popconfirm>
				</div>
			}
		}
	}
	];
}
export default Form.create()(Plan)
