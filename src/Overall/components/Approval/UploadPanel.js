import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Modal, Upload, Button, Icon, Input, message, DatePicker  } from 'antd';
import { FILE_API, STATIC_DOWNLOAD_API } from '../../../_platform/api';
import { fileTypes } from '../../../_platform/store/global/file';
import {getUser} from '../../../_platform/auth';
import './style/approvalPanelStyle.less';

const TextArea = Input.TextArea;

export default class UploadPanel extends Component {

	static propTypes = {
	};
	state = {
		appfileList: [],
		prefileList: [],
		buttonLoading: false,	
		realDoneAt: null,	
	}
	
	labelBlockStatus(targetBlockId,labelStatus) {
		const {
			actions: { putCurrentWp },
			selectedUnit = [],
			blockIndex = [],

		} = this.props;

		let code = selectedUnit[0] && selectedUnit[0].split('--')[0];

		//-----------------更新blockIndex---------------
		let newBlockIndex = blockIndex.map(
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
		//----------------格式化 for 接口----------------
		let data = {
			"extra_params": {
				"blockIndex": newBlockIndex
			},
			"version": "A"
		}
		//------------------------------------
		return putCurrentWp({ code: code }, data );
	}

	//确认上传：生成新blockindex-并更新blockindex
	okUpload() {

		//确认批复文件已经上传
		if( this.state.appfileList.length <= 0 ){
			message.error('请上传批复文件');			
			return false;
		}
		const {realDoneAt} = this.state;
		if(!realDoneAt){
			message.error('请选择实际办理时间');			
			return false;
		}

		const {
			actions:{
				postSubject,
				postLogEvent,
				getInstance,
			},
			blockMission,
			blockKey
		} = this.props;

		//生成新subject
		let	nextSubject = Object.assign(
			//原subject
			blockMission[blockKey].workflowactivity.subject[0],
			//新增部分
			{appfileList: JSON.stringify(this.state.appfileList)},
			{prefileList: JSON.stringify(this.state.prefileList)},
			{realDoneAt:this.state.realDoneAt.format('YYYY-MM-DD')},
		);

		nextSubject = [nextSubject];

		//FIXME:此处仅支持单任务，需要作出针对多任务情况的修改
		let missionId = blockMission[blockKey].workflowactivity.id;
		
		this.setState({buttonLoading:true});		
		//获取流程
		getInstance({id:missionId})
			.then(
			//修改subject			
				(wkfInst)=>{
				postSubject({pk:missionId},{subject:nextSubject})
					.then( 
					//提交流程
						(rst1)=>{
							const logeventData = { 
								next_states:[
									{
										state: wkfInst.workflow.states[1].id,
										participants: [wkfInst.creator],
										deadline: wkfInst.deadline,
										remark:'',
									}
								],
								state: wkfInst.workflow.states[0].id,
								executor: {
									id: Number(getUser().id),
									username: getUser().username,
									person_name: getUser().name,
									person_code: getUser().code,
									organization: getUser().org
								},
								action: "提交",
								note: "完成文件提交",
								attachment: null
							};
							postLogEvent(
								{pk:missionId},
								logeventData
							);
						}
					)
						.then( 
						//标记块状态
							(rst2)=>{
								let {selectedBlock} = this.props;
								this.labelBlockStatus(selectedBlock.blockId,'wait_for_endorse')
									.then(
										//刷新块图
										()=>{
											const {
												actions:{getBlockIndex,setSelectedBlock},
												selectedUnit,
											} = this.props;
					
											const code = selectedUnit[0] && selectedUnit[0].split('--')[0];
											setSelectedBlock('');
											getBlockIndex({code});
											this.setState({buttonLoading:false});
							
										}
									);
							}
						)
						
				}
			)

	}
	//准备文件
	prehandleChange(info) {
		let prefileList = info.fileList;
		this.setState({ prefileList });
	}
	//批复文件 -最多上传1个文件
	apphandleChange(info) {
		let appfileList = info.fileList;
		appfileList = appfileList.slice(-1);
		this.setState({ appfileList });
	}
	//文件上传控件属性
	preUploadProps = {
		name: 'preparefile',
		action: `${FILE_API}/api/user/files/`,
		headers: {
			authorization: 'authorization-text',
		},
		accept: fileTypes,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		onChange: this.prehandleChange.bind(this),
	};

	appUploadProps = {
		name: 'approvalfile',
		action: `${FILE_API}/api/user/files/`,
		headers: {
			authorization: 'authorization-text',
		},
		accept: fileTypes,
		data(file) {
			return {
				name: file.fileName,
				a_file: file,
			};
		},
		onChange: this.apphandleChange.bind(this),
	};

	render() {

		const {
			selectedBlock,
			blockMission,
			blockKey
		} = this.props;

		const {workflowactivity:{subject= []} = {}} = blockMission[blockKey];
		const workflowSubject = subject.length>0? subject[0]:{};

		return (
			<Card title="上传批文" style={{ width: '100%' }} className='approval-panel-div'>

				<label>
				报审阶段
				</label>
				<Input defaultValue = {selectedBlock.name} readOnly></Input>				

				<label>
				准备材料
				</label>
				<Upload 
					{...this.preUploadProps}>
					<Button type='primary' size='small' style={{ 'margin' : '0px 0px 5px 10px'}}>
						<Icon type='upload'/> 上传准备材料
					</Button>
				</Upload>
				<TextArea value= {workflowSubject.preparationHint}>
				</TextArea>

				<label>
				批复文件
				</label>
				<Upload {...this.appUploadProps}>
					<Button type='primary' size='small' style={{'margin':'0px 0px 5px 10px'}}>
						<Icon type='upload'/> 上传批复文件
					</Button>
				</Upload>
				
				<label>实际办理时间</label>
				<DatePicker
					/* value={this.state.realDoneAt} */
					onChange={(dateMoment)=>{
						this.setState({realDoneAt:dateMoment});
					}}
				>
				</DatePicker>

			{/**--------------提示展示---------------- */}
				<label>
				文件批复部门
				</label>
				<Input defaultValue = {workflowSubject.officeHint} readOnly ></Input>
				
				<label>
				联系方式
				</label>
				<Input defaultValue = {workflowSubject.phoneHint} readOnly ></Input>
				
				<label>
				联系地址
				</label>	
				<Input defaultValue = {workflowSubject.addressHint} readOnly ></Input>
			{/** */}

				<Button 
					type='primary' 
					onClick={this.okUpload.bind(this)}
					loading={this.state.buttonLoading}>
					提交批文
				</Button>



			</Card>
		);
	}
}
