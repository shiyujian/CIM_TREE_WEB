import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Button } from 'antd';
import {STATIC_DOWNLOAD_API,PDF_FILE_API} from '../../../_platform/api';
import {getUser} from '../../../_platform/auth';
import './style/approvalPanelStyle.less'

export default class TipRender extends Component {

	static propTypes = {
	};

	state= {
		endorseButtonLoading:false,
	}
	componentDidMount(){
		const {
			actions:{
				postLogEvent,
				getInstance,
			},
			blockMission,
			blockKey
		} = this.props;

		let missionId = blockMission[blockKey].workflowactivity.id;		
		getInstance({id:missionId});


	}

	writeToBlockInfoFromFlow() {
		const {
			actions: { putCurrentWp },
			selectedUnit = [],
			blockIndex = [],
			flowInstance,
			selectedBlock,
		} = this.props;

		let code = selectedUnit[0] && selectedUnit[0].split('--')[0];

		//-----------------更新blockIndex---------------
		let newBlockIndex = blockIndex.map(
					( block ) => {
						if( block.blockId === selectedBlock.blockId ){
							return {
								...block,
								workStatus: 'done',
								subject: flowInstance.subject[0],
								worker: flowInstance.history[0].records[0].participant.executor.person_name,
								maker: flowInstance.creator.person_name,
								uploadAt: flowInstance.history[0].records[0].log_on,
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

	//下载文件done
	downloadFile(download_url) {

		let downloadLink = STATIC_DOWNLOAD_API + '/media' + download_url.split('/media')[1]
		window.open(downloadLink);

	}

	//预览准备材料done
	previewFile(preFileInfo) {

		const {actions: {openPreview},currentBlock} = this.props;
        if(JSON.stringify(currentBlock) == "{}"){
            return
        }else {
			let _file = {
				...preFileInfo,
				a_file:  PDF_FILE_API + '/media' + preFileInfo.a_file.split('/media')[1]
			};
			openPreview(_file);
        }
	}

	//认可通过当前上报
	endorseApp() {

		const {
			actions:{
				postLogEvent,
			},
			selectedBlock,
			flowInstance,			
		} = this.props;


		const logeventData ={
			state: flowInstance.workflow.states[1].id,
			executor: {
				id: Number(getUser().id),
				username: getUser().username,
				person_name: getUser().name,
				person_code: getUser().code,
				organization: getUser().org
			},
			action: "通过",
			note: "通过文件",
		};
		this.setState({endorseButtonLoading:true});
		//通过流程
		postLogEvent( {pk:flowInstance.id}, logeventData );
		//将流程数据写入块信息，并修改块状态为 done
		this.writeToBlockInfoFromFlow(selectedBlock.blockId)
			.then(
				()=>{
					const {
						actions:{getBlockIndex,setSelectedBlock},
						selectedUnit,
					} = this.props;

					const code = selectedUnit[0] && selectedUnit[0].split('--')[0];
					setSelectedBlock('');
					getBlockIndex({code});
					this.setState({endorseButtonLoading:false});
				}
			);
	}

	//退回当前上报
	rejectApp() {
		const {
			actions:{
				postLogEvent,
			},
			selectedBlock,
			flowInstance,
		} = this.props;
		const logeventData ={
			state: flowInstance.workflow.states[1].id,
			executor: {
				id: Number(getUser().id),
				username: getUser().username,
				person_name: getUser().name,
				person_code: getUser().code,
				organization: getUser().org
			},
			action: "退回",
			note: "退回文件",
		};
		//删除subject中上传信息todo
		this.setState({endorseButtonLoading:true});
		//通过流程
		postLogEvent( {pk:flowInstance.id}, logeventData );
		//修改块状态为 wait_for_upload
		this.labelBlockStatus(selectedBlock.blockId,'wait_for_upload').then(
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
	//修改当前的状态
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
	
	getAppDocJSX(blockMessage) {
		if (blockMessage) {
			const {workflowactivity:{subject}} = blockMessage;
			const appfileList = JSON.parse(subject[0].appfileList);

		return (<div>
			{
				appfileList.map(
					(appfile)=>{
						return(
						<div>
							{appfile.name}
							<Button
								size='small'							
								onClick={this.previewFile.bind(this,appfile.response)}
							>预览</Button>
							<Button
								size='small'							
								onClick={this.downloadFile.bind(this,appfile.response.download_url)}							
							>下载</Button>							
						</div>
						)
					}
				)
			}
		</div>);
		}
	}

	getPreDocJSX(blockMessage) {
		if (blockMessage) {
			const {workflowactivity:{subject}} = blockMessage;
			const prefileList = JSON.parse(subject[0].prefileList);

		return (<div>
			{
				prefileList.map(
					(prefile)=>{
						return(
						<div>
							{prefile.name}
							<Button
								size='small'
								onClick={this.previewFile.bind(this,prefile.response)}
							>预览</Button>
							<Button
								size='small'							
								onClick={this.downloadFile.bind(this,prefile.response.download_url)}
							>下载</Button>							
						</div>
						)
					}
				)
			}
		</div>);
		}
	}
	
	render() {

		const {
			selectedBlock,
			blockMission,
			flowInstance={},
			blockKey
		} = this.props;

		const { workflowactivity: { subject = [] } = {} } = blockMission[blockKey];
		const workflowSubject = subject.length > 0 ? subject[0] : {};

		return (
			<Card title="审核批文" style={{ width: '100%' }} className='approval-panel-div'>

				<label>
					报审阶段
				</label>
				<Input readOnly defaultValue={selectedBlock.name} ></Input>

				<label>
					批复文件
				</label>
				{this.getAppDocJSX(blockMission[blockKey])}

				<label>
					计划办理时间
				</label>
				<Input readOnly defaultValue={workflowSubject.deadlineDate} ></Input>
				

				<label>
					实际办理时间
				</label>
				<Input readOnly defaultValue={workflowSubject.realDoneAt} ></Input>
				

				<label>
					办理人
				</label>
				<Input value={
					Object.keys(flowInstance).length>0?
					flowInstance.history[0]
						.records[0].participant.executor.person_name:null}></Input>

				<label>
					批文审核人
				</label>
				<Input value={
					Object.keys(flowInstance).length>0?
					flowInstance.creator.person_name:null
						}></Input>
				
				<label>
					准备材料
				</label>
				<Input readOnly defaultValue={workflowSubject.preparationHint} ></Input>
				{this.getPreDocJSX(blockMission[blockKey])}
				
				
				<label>
					文件批复部门
				</label>
				<Input readOnly defaultValue={workflowSubject.officeHint} ></Input>
				
				<label>
					联系方式
				</label>
				<Input readOnly defaultValue={workflowSubject.phoneHint} ></Input>
				
				<label>
					联系地址
				</label>
				<Input readOnly defaultValue={workflowSubject.addressHint} ></Input>

				<Button 
					type='primary'
					loading={this.state.endorseButtonLoading}
					onClick={this.endorseApp.bind(this)}>
					审核通过
				</Button>
				<Button 
				  loading={this.state.endorseButtonLoading}
				  onClick={this.rejectApp.bind(this)}
				>退回
				</Button>


			</Card>
		);
	}
}
