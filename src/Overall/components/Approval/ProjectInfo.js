import React, {Component} from 'react';
import {Row, Col, Button, Upload, Modal, Icon} from 'antd';
import TipsRender from './TipsRender';
import {FILE_API, STATIC_DOWNLOAD_API} from '../../../_platform/api';
import ViewInfo from './ViewInfo';
import MakePlanPanel from './MakePlanPanel';
import {getUser} from '../../../_platform/auth';
import './FlowTree.less';
import Preview from '../../../_platform/components/layout/Preview';
import UploadPanel from './UploadPanel';
import EndorsePanel from './EndorsePanel';


class ProjectInfo extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			blockIndex: [
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
			],
			selectedUnit: [],
			blockVisible: false,
			uploadVisible: false,
			currentBlock: {},
			currentBlock: {fileInfo: {}},
			nextBlock: {},
		}
	}

	getCurUserId() {		
		let currentUser = getUser();
		let currentUserId = parseInt(currentUser.id);
		return currentUserId;
	}
	getCurUserOrgCode() {		
		let currentUser = getUser();
		let currentUserOrgCode = currentUser.org_code + '';
		return currentUserOrgCode;
	}

	componentWillReceiveProps(nextProps){
		// let {
		// 	 toggleBlockInfoValue = {},
		// } = nextProps;
		// if (toggleBlockInfoValue = 'close') {
		// 	this.setState({blockVisible:false})
		// }
	}

	componentDidMount = () => {
		const {
			actions: {
				getCurrentWp,
				getMission,
			},
			selectedUnit = [],
			blockIndex = [],
		} = this.props;
		this.setState({selectedUnit});
		const code = selectedUnit[0] && selectedUnit[0].split('--')[0];
		getMission({executor:this.getCurUserId()});
		getCurrentWp({code})
			.then(
				(rst) => {
					const {
						extra_params: {blockIndex = []}
					} = rst;
					const {
						actions: {setBlockIndex}
					} = this.props;
					setBlockIndex(blockIndex);
					const urlHash = window.location.hash.substring(1).split("&");
					if(urlHash.length == 2  && urlHash[1]>-1 && urlHash[1]<12){
						blockIndex.forEach(data =>{
							if(data.blockId == urlHash[1]){
								this.clickBlock(data);
							}
						})
					}
				}
			);
	}

	//更新blockindex操作
	putNewBlockIndex(newBlockList) {
		const {actions: {putCurrentWp}, selectedUnit = []} = this.props;
		let code = selectedUnit[0] && selectedUnit[0].split('--')[0];
		let data = {
			"extra_params": {
				"blockIndex": newBlockList
			},
			"version": "A"
		}
		putCurrentWp({code: code}, data);
	}

	clickBlock(block) {
		const {actions:{setSelectedBlock, toggleMakePlan, 
			// toggleBlockInfo
		 }} = this.props;
		setSelectedBlock(block);
		// toggleBlockInfo('close');

		// if (block.workStatus === 'done') {
		// 	this.viewBlock(block);
		// 	return;
		// } 
		//--------------------------
		//暖风熏得游人醉，错把杭州作汴州
		//------用户判断-选择路径---------已废弃---------
			// if(false){
			// 		//todo：此处为判断用户为发起人，显示发起界面
			// 		toggleMakePlan('open');
			// }else if(false){
			// 		//todo： 此处为判断用户为填报人，则显示上传弹窗
			// 		this.viewUpload(block);
			// }else if(false){
			// 		//todo： 此处判断用户为 非业主方人员，显示未完成界面
			// }
		//----------------------------------------------
	}

	//modal的展示与关闭
	// viewBlock(block) {
	// 	const {actions:{toggleBlockInfo}} = this.props;
	// 	this.setState({currentBlock: block});
	// 	this.setState({blockVisible: true});
	// 	toggleBlockInfo('open');
	// }



	cancelBlockModal() {
		this.setState({blockVisible: false});
		this.setState({
			currentBlock: {
				fileInfo: {}
			}
		});
	}


	downloadFile(a_file) {

		let downloadLink = STATIC_DOWNLOAD_API + '/media' + a_file.split('/media')[1];
		window.open(downloadLink);
	}

	renderPanel(){
		const {
			selectedBlock,
			selectedUnit,
			blockMission=[],
		} = this.props;

		const {blockId:currentBlockId,workStatus:currentBlockWorkStatus} = selectedBlock;
		const currentUserId = this.getCurUserId();
		let blockMessage ={},blockKey = {};
		blockMission.map((data,index) =>{
			let {
				workflowactivity:{
					current:{0:{participants:{0:{executor:{ id }}}}},
					subject:{0:{ blockId, unitInfo }}
				},
				state:{ name }
			} = data;
			if(unitInfo == selectedUnit[0]){
				blockKey[blockId] = index;
				blockMessage[blockId] = {name,id,blockId};
			}	
		})

		//未选择块--------------
		if(!selectedBlock){
			return <TipsRender container='请选择所需操作的报批阶段'></TipsRender>;
		}

		//块状态---------不存在
		if(!currentBlockWorkStatus){

			//判断是否是业主单位-领导 由于目前用户缺失单位数据，当前todo，暂时id=20
			//-------------------
			if(
			//	this.getCurUserId()===window.DeathCode.OVERALL_APPROVAL_UNIT_LEADER_CODE
			this.getCurUserOrgCode().startsWith(window.DeathCode.OVERALL_APPROVAL_UNIT_CODE)
			){
				return <MakePlanPanel {...this.props}/>
			}
			//-----------------------------
			//如果不是业主单位-领导
			return <TipsRender container='还未开始计划'></TipsRender>;
		}
			
		//块状态---------------------等待上传
		if(currentBlockWorkStatus === 'wait_for_upload'){
			//判断角色是否是任务作业人
			if( blockMessage[currentBlockId] &&
				blockMessage[currentBlockId].name == '上报' &&
				blockMessage[currentBlockId].id == currentUserId
			){

				return <UploadPanel {...this.props} key={currentBlockId} blockKey={blockKey[currentBlockId]} ></UploadPanel>
			}
			//当角色不是任务作业人，提示这阶段还在等待上传
			return  <TipsRender container='计划已发出，正在等待办理人上传批文'></TipsRender>;
		}

		//块状态---------------------等待确认
		if(currentBlockWorkStatus === 'wait_for_endorse'){
			//判断角色是否是任务作业人
			if( blockMessage[currentBlockId] &&
				blockMessage[currentBlockId].name == '审批' &&
				blockMessage[currentBlockId].id == currentUserId
			){
				//TODO确认批文页面
				return  <EndorsePanel {...this.props} key={currentBlockId} blockKey={blockKey[currentBlockId]} ></EndorsePanel>;
			}
			return <TipsRender container='批文已上传，正在等待审核'></TipsRender> ;
		}

		//块状态---------------------已经完成
		if(currentBlockWorkStatus === 'done'){
			return <ViewInfo  {...this.state} {...this.props}/>
		}
		

	}

	render() {

		const {
			blockIndex = [],
			selectedUnit = [],
			selectedBlock = {},
			// toggleBlockInfoValue = {},
			toggleMakePlanValue = {},
		} = this.props;

		const buttonStyle = {
			'margin': '5px',
			'dispaly': 'inline-block'
		};

		const {blockIndex: finalBlockIndex} = blockIndex.length > 1 ?
			this.props : this.state;
		const {currentBlock, currentBlock: {fileInfo}, nextBlock} = this.state;
		let name = selectedUnit[0].split("--")[2];
		return (
			<div>
				当前 单元工程：{name}
				<Row style={{'padding': '20px'}}>
					<Col span='16'>
						<div className='flow-tree-approval'>
							<div className='flow-one-line' style={{height: "60px"}}>
								<div className="box-left first-box">工可研</div>
								<div className="box-right first-box">
									<div>
										<Button
											type={
												finalBlockIndex[0].workStatus === 'done' ? 'primary' :
											 		finalBlockIndex[0].workStatus === 'wait_for_upload'|| finalBlockIndex[0].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[0])}
										>1、立项</Button>
									</div>
								</div>
							</div>
							<div className='flow-one-line' style={{height: "120px"}}>
								<div className="box-left second-box" style={{lineHeight: "120px"}}>方案设计</div>
								<div className="box-right second-box">
									<div style={{marginTop: "10px"}}>
										<Button
											type={finalBlockIndex[1].workStatus === 'done' ? 'primary' :
												finalBlockIndex[1].workStatus === 'wait_for_upload'|| finalBlockIndex[1].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[1])}

										>2、方案设计核查+3-1、选址意见书</Button>
									</div>
									<div style={{marginTop: "10px", marginLeft: "40px", position: "relative"}}>
										<Button
											type={finalBlockIndex[2].workStatus === 'done' ? 'primary' :
												 finalBlockIndex[2].workStatus === 'wait_for_upload'|| finalBlockIndex[2].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[2])}
										>3-2、用地预审+5、用地方案图</Button>
										<div className="line-1"></div>
										<div className="line-1-1"></div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "80px", position: "relative"}}>
										<Button
											type={finalBlockIndex[3].workStatus === 'done' ? 'primary' :
												 finalBlockIndex[3].workStatus === 'wait_for_upload'|| finalBlockIndex[3].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[3])}
										>6、用地规划许可+8-1、消防设计第三方审查</Button>
										<div className="line-2"></div>
										<div className="line-2-1"></div>
									</div>
								</div>
							</div>
							<div className='flow-one-line' style={{height: "260px", borderBottom: 'none'}}>
								<div className="box-left third-box" style={{lineHeight: "260px"}}>施工图设计</div>
								<div className="box-right third-box">
									<div style={{marginTop: "10px", marginLeft: "120px", position: "relative"}}>
										<Button
											type={finalBlockIndex[4].workStatus === 'done' ? 'primary' :
												 finalBlockIndex[4].workStatus === 'wait_for_upload'|| finalBlockIndex[4].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[4])}
										>11-1施工图强审-施工图设计审查合格书</Button>
										<div className="line-3"></div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "160px", overflow: "hidden"}}>
										<div style={{marginTop: "10px", display: "inline-block", float: "left"}}>
											<Button
												type={finalBlockIndex[5].workStatus === 'done' ? 'primary' :
													 finalBlockIndex[5].workStatus === 'wait_for_upload'|| finalBlockIndex[5].workStatus === 'wait_for_endorse' ? 'danger' : null }
												onClick={this.clickBlock.bind(this, finalBlockIndex[5])}
											>11-1开工备案</Button>
										</div>
										<div style={{
											marginTop: "10px",
											marginLeft: "50px",
											display: "inline-block",
											float: "left"
										}}>
											<Button
												type={finalBlockIndex[6].workStatus === 'done' ? 'primary' :
													 finalBlockIndex[6].workStatus === 'wait_for_upload'|| finalBlockIndex[6].workStatus === 'wait_for_endorse' ? 'danger' : null }
												onClick={this.clickBlock.bind(this, finalBlockIndex[6])}
											>10施工图总预算</Button>
										</div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "160px", overflow: "hidden"}}>
										<div style={{
											marginTop: "10px",
											display: "inline-block",
											float: "left",
											position: "relative"
										}}>
											<Button
												type={finalBlockIndex[7].workStatus === 'done' ? 'primary' :
													 finalBlockIndex[7].workStatus === 'wait_for_upload'|| finalBlockIndex[7].workStatus === 'wait_for_endorse' ? 'danger' : null }
												onClick={this.clickBlock.bind(this, finalBlockIndex[7])}
											>8工程规划许可</Button>
											<div className="line-4-1"></div>
										</div>
										<div style={{
											marginTop: "10px",
											marginLeft: "40px",
											display: "inline-block",
											float: "left"
										}}>
											<Button
												type={finalBlockIndex[8].workStatus === 'done' ? 'primary' :
													 finalBlockIndex[8].workStatus === 'wait_for_upload'|| finalBlockIndex[8].workStatus === 'wait_for_endorse' ? 'danger' : null }
												onClick={this.clickBlock.bind(this, finalBlockIndex[8])}
											>消防审查</Button>
										</div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "160px", overflow: "hidden"}}>
										<div style={{
											marginTop: "10px",
											display: "inline-block",
											float: "left",
											position: "relative"
										}}>
											<Button
												type={finalBlockIndex[9].workStatus === 'done' ? 'primary' :
													 finalBlockIndex[9].workStatus === 'wait_for_upload'|| finalBlockIndex[9].workStatus === 'wait_for_endorse' ? 'danger' : null }
												onClick={this.clickBlock.bind(this, finalBlockIndex[9])}
											>环评批复</Button>
											<div className="line-5"></div>
										</div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "312px", position: "relative"}}>
										<Button
											type={finalBlockIndex[10].workStatus === 'done' ? 'primary' :
												 finalBlockIndex[10].workStatus === 'wait_for_upload'|| finalBlockIndex[10].workStatus === 'wait_for_endorse' ? 'danger' : null }
											onClick={this.clickBlock.bind(this, finalBlockIndex[10])}
										>11-2施工许可</Button>
										<div className="line-6"></div>
									</div>
								</div>
							</div>
						</div>
					</Col>
					<Col span='8'>
						{
							this.renderPanel()
						}
					</Col>


				</Row>
				<Preview/>

			</div>
		);
	};
}

export default ProjectInfo;