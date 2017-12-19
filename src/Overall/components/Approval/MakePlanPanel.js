import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Input, DatePicker, Button, message } from 'antd';
import UserTreeSelect from '../../../Design/components/UserTreeSelect.js';
import { getUser } from '../../../_platform/auth';
import moment from 'moment';
import './style/approvalPanelStyle.less';


const FormItem = Form.Item;
const TextArea = Input.TextArea;

//------接口用格式化用户对象-------
	let transUser = (user) => {
		let { account } = user;
		return {
			"id": user.id,
			"username": user.username,
			"person_name": account.person_name,
			"person_code": account.person_code,
			"organization": account.organization
		}
	}
//-------------------------------

export default class MakePlanPanel extends Component {

	static propTypes = {
	};

	constructor(props) {
		super(props);
		this.state = {
			deadlineDate: {},
			nextWorker: {},
			preparationHint: '',
			officeHint: '',
			phoneHint: '',
			addressHint: '',
			submitButtonLoading: false,
		}
	}

	componentWillReceiveProps(nextProps){
	}

	getCurUser() {
		let currentUser = getUser();
		currentUser = {
			"id": parseInt(currentUser.id),
			"username": currentUser.username,
			"person_name": currentUser.name,
			"person_code": currentUser.code,
			"organization": currentUser.org
			};
		return currentUser;
	}

	getInitialBlockIndex(){
		let initialBlockIndex =  [
			{
				"blockId": "0",
				"name": "立项"
			},
			{
				"blockId": "1",
				"name": "方案设计核查-选址意见书"
			},
			{
				"blockId": "2",
				"name": "用地预审-用地方案图"
			},
			{
				"blockId": "3",
				"name": "用地规划许可-消防设计第三方审查"
			},
			{
				"blockId": "4",
				"name": "施工图强审-施工图设计审查合格书"
			},
			{
				"blockId": "5",
				"name": "开工备案"
			},
			{
				"blockId": "6",
				"name": "施工图总预算"
			},
			{
				"blockId": "7",
				"name": "工程规划许可"
			},
			{
				"blockId": "8",
				"name": "消防审查"
			},
			{
				"blockId": "9",
				"name": "环评批复"
			},
			{
				"blockId": "10",
				"name": "施工许可"
			}
		];
		return initialBlockIndex;
	}

	labelBlockStatus(targetBlockId,labelStatus) {
		const {
			actions: { putCurrentWp },
			selectedUnit = [],
			blockIndex = [],

		} = this.props;

		let code = selectedUnit[0] && selectedUnit[0].split('--')[0];

		//-----------------更新blockIndex---------------
		let newBlockIndex = blockIndex.length !== 11?
			this.getInitialBlockIndex().map(
				( block ) => {
					if( block.blockId === targetBlockId ){
						return {
							...block, 
							workStatus: labelStatus,
						 }
					}else{
						return block;
					}
				}
			) 
				: blockIndex.map(
					( block ) => {
						if( block.blockId === targetBlockId ){
							return {
								...block, 
								workStatus: labelStatus,
							}
						}else{
							return block;
						}
					}
				);
		//----------------------------------------------
		//-----------格式化 for 接口----------------
		let data = {
			"extra_params": {
				"blockIndex": newBlockIndex
			},
			"version": "A"
		}
		//------------------------------------
		return putCurrentWp({ code: code }, data );
	}

	submitMakePlan() {

		//----------所需变量初始化----------
			const {
				selectedUnit,
				selectedBlock,
				actions: {
					postInstance,
					postLogEvent,
					addNextWorker,
					startWorkFlow,
				}
			} = this.props;

			const {
				deadlineDate,
				nextWorker,
				preparationHint,
				officeHint,
				phoneHint,
				addressHint
			} = this.state;

			const unitInfo = selectedUnit[0];
			//获得当前用户
			let curUser = this.getCurUser();
		//-----------------------------------

		//-------验证必要数据是否填写-----------
		

		if (Object.keys(selectedBlock).length === 0) {
			message.error('请选择办理阶段');
			return;
		 }

		 if (Object.keys(deadlineDate).length === 0) {
			message.error('请选择结束时间');
			return;
		 }
		 if (Object.keys(nextWorker).length === 0) {
			message.error('请选择办理人');
			return;
		 }
		 if (!preparationHint) {
			message.error('请输入要求的准备材料');
			return;
		 }
		 if (!officeHint) {
			message.error('请填写文件批复部门');
			return;
		 }
		 if (!phoneHint) {
			message.error('请填写联系方式');
			return;
		 }
		 if (!addressHint) {
			message.error('请填写联系地址');
			return;
		 }
		//-------------------------------------

		//-------------流程所需数据----------
		let workFlowInfo = {
			name: unitInfo.split('--')[2] + '--' + selectedBlock.name + "--单位工程阶段报批",
			desc: unitInfo.split('--')[2] + '--' + selectedBlock.name + "--单位工程阶段报批",
			code: 'TEMPLATE_022',
		}
		//----------------------------------
		//----------生成subject--------	
		let subject = [{

			unitInfo: unitInfo,
			blockId: selectedBlock.blockId,
			deadlineDate: deadlineDate.format('YYYY-MM-DD'),
			makePlanDate: moment().format('YYYY-MM-DD'),

			preparationHint,
			officeHint,
			phoneHint,
			addressHint,
			prepareFile: '[]',
			approvalFile: '',

		}]
		//-----------------------------

		//------------创建、初始化、分配、启动流程----------
		
		this.setState({submitButtonLoading:true},()=>{
		postInstance(
			{},
			//初始化流程信息
			{
				name: workFlowInfo.name,
				description: workFlowInfo.desc,
				code: workFlowInfo.code,
				creator: curUser,
				deadline: null,
				//创建流程同时---提交此流程status:1---启动此流程status:2
				// status: 2,
				status: 1,				
				subject,
				deadline: null,
			}
		)
			.then(
				(rst0) => {
					let workflowInstance = rst0;
					//---------分配下一个工作人-----------
					addNextWorker(
						{
							ppk: workflowInstance.id,
							pk: workflowInstance.workflow.states[0].id,
						},
						{ participants : [nextWorker] }
					)
						//----------启动流程---------
						.then(
							(rst1) => {
								startWorkFlow(
									{ pk: workflowInstance.id },
									{ creator : curUser });
							}
						)
							.then(
								(rst2) => {
									//--------------修改块状态为 workStatus:wait_for_upload-----------
									this.labelBlockStatus(selectedBlock.blockId,'wait_for_upload')
									.then(
										//刷新块图
										()=>{
											const {
												actions:{getBlockIndex,setSelectedBlock},
												selectedUnit,
											} = this.props;
											const code = selectedUnit[0] && selectedUnit[0].split('--')[0];
											getBlockIndex({code});
											setSelectedBlock('');											
											this.setState({submitButtonLoading:false});
										}
									);
								}
							)
				}
			)
						
					
			
		});

	}

	render() {

		const { selectedBlock, selectedUnit, currentWp } = this.props;

		const unitCode = selectedUnit[0] && selectedUnit[0].split('--')[0];


		//-----------------------------------------------------------------------
		//目前仅可测试 桂湾片区 单位工程，选取其他单位工程，由于unit字段不存在会引起报错
		//--目前 桂湾 也不可用了
		// const { code: ownerUnitCode = {} } = currentWp.extra_params.unit.find(
		// 	(unit_item) => { return unit_item.name === '业主单位' }
		// );
		//------------------------------------------------------------------------

		//-------------！！--测试用--！！-----------------
		const ownerUnitCode = window.DeathCode.OVERALL_APPROVAL_UNIT_CODE;
		//----------------------------------------------
		const currentUser = this.getCurUser();

		return (
			<Card title="发起计划" style={{ width: '100%' }}>
				<div className='approval-panel-div'>
					<label>当前报审阶段</label>
					<Input
						value={selectedBlock.name}
						disabled={true}
					>
					</Input>

					<label>办理截止时间</label>
					<DatePicker
						style={{'marginLeft':'10px'}}
						size='small'
						onChange={(date) => {
							this.setState({ deadlineDate: date })
						}}
					/>
					<br />
					<div>
					<label>办理人</label>
					<span style={{'marginLeft':'10px'}}>
						<UserTreeSelect
							currentUser={currentUser}
							size='small'							
							rootCode={ownerUnitCode}
							onSelect={(user) => {
								this.setState({ nextWorker: transUser(user) })
							}}
						></UserTreeSelect>
					</span>
					</div>
					
					<label>所需准备材料</label>
					<TextArea
						value={this.state.preparationHint}
						autosize={{ minRows: 3 }}
						onChange={(e) => {
							this.setState({ preparationHint: e.target.value })
						}}
					></TextArea>

					<label>文件批复部门</label>
					<Input
						size='small'
						onChange={(e) => {
							this.setState({ officeHint: e.target.value })
						}}
					>
					</Input>
					<label>联系方式</label>
					<Input
						size='small'
						onChange={(e) => {
							this.setState({ phoneHint: e.target.value })
						}}>
					</Input>
					<label>联系地址</label>
					<Input
						size='small'
						onChange={(e) => {
							this.setState({ addressHint: e.target.value })
						}}>
					</Input>

					<Button
						type='primary'
						onClick={this.submitMakePlan.bind(this)}
						loading= {this.state.submitButtonLoading}
						>发起计划
						</Button>
				</div>
			</Card>
		);
	}
}
