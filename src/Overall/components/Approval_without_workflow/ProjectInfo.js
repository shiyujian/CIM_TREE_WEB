import React, {Component} from 'react';
import {Row, Col, Button, Upload, Modal, Icon} from 'antd';
import TipsRender from './TipsRender';
import {FILE_API, STATIC_DOWNLOAD_API} from '../../../_platform/api';
import ViewInfo from './ViewInfo';
import './FlowTree.less';
import {fileTypes} from '../../../_platform/store/global/file';
import Preview from '../../../_platform/components/layout/Preview';

class ProjectInfo extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			blockIndex: [
				{
					"blockId": "0",
					"docCode": null,
					"name": "立项"
				},
				{
					"blockId": "1",
					"docCode": null,
					"name": "方案设计核查-选址意见书"
				},
				{
					"blockId": "2",
					"docCode": null,
					"name": "用地预审-用地方案图"
				},
				{
					"blockId": "3",
					"docCode": null,
					"name": "用地规划许可-消防设计第三方审查"
				},
				{
					"blockId": "4",
					"docCode": null,
					"name": "施工图强审-施工图设计审查合格书"
				},
				{
					"blockId": "5",
					"docCode": null,
					"name": "开工备案"
				},
				{
					"blockId": "6",
					"docCode": null,
					"name": "施工图总预算"
				},
				{
					"blockId": "7",
					"docCode": null,
					"name": "工程规划许可"
				},
				{
					"blockId": "8",
					"docCode": null,
					"name": "消防审查"
				},
				{
					"blockId": "9",
					"docCode": null,
					"name": "环评批复"
				},
				{
					"blockId": "10",
					"docCode": null,
					"name": "施工许可"
				}
			],
			selectedUnit: [],
			blockVisible: false,
			uploadVisible: false,
			currentBlock: {},
			currentBlock: {fileInfo: {}},
			nextBlock: {},
			fileList: [],
		}
	}

	componentWillReceiveProps(nextProps){
		let { toggleBlockInfoValue = {} } = nextProps;
		if (toggleBlockInfoValue = 'close') {
			this.setState({blockVisible:false})
		}
	}

	componentDidMount = () => {
		const {
			actions: {getCurrentWp},
			selectedUnit = [],
			blockIndex = [],
		} = this.props;
		this.setState({selectedUnit});
		const code = selectedUnit[0] && selectedUnit[0].split('--')[0];
		getCurrentWp({code})
			.then(
				(rst) => {
					console.log('rst:', rst);
					const {
						extra_params: {blockIndex = []}
					} = rst;
					const {
						actions: {setBlockIndex}
					} = this.props;
					setBlockIndex(blockIndex);
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
		console.log('!!! current clicked block : \n', block);
		if (block.workStatus === 'done') {
			this.viewBlock(block);
		} else {
			this.viewUpload(block);
		}
	}

	//modal的展示与关闭
	viewBlock(block) {
		console.log('viewing block:\n', block);
		this.setState({currentBlock: block});
		this.setState({blockVisible: true});
	}

	viewUpload(block) {
		this.setState({nextBlock: block});
		this.setState({uploadVisible: true});
	}

	cancelBlockModal() {
		this.setState({blockVisible: false});
		this.setState({
			currentBlock: {
				fileInfo: {}
			}
		});
	}

	cancelUploadModal() {
		this.setState({uploadVisible: false});
		this.setState({nextBlock: {}});
		this.setState({fileList: []});
	}

	//确认上传：生成新blockindex-并更新blockindex
	okUpload() {
		const {blockIndex} = this.props;
		const {nextBlock} = this.state;

		let {blockIndex: newBlockList = []} = blockIndex.length > 1 ? this.props : this.state;

		this.setState(
			{
				nextBlock: {
					...nextBlock,
					workStatus: 'done',
					fileInfo: this.state.fileList[0].response
				}
			},

			() => {

				console.log(
					'nb:\n', this.state.nextBlock,
					'\nnbl:\n', newBlockList,
					'\nthis.state:\n', this.state,
				);

				newBlockList.splice(nextBlock.blockId, 1, this.state.nextBlock);
				this.putNewBlockIndex(newBlockList);
				this.cancelUploadModal();
			}
		);
	}

	//文件上传控件属性
	uploadProps = {
		name: 'file',
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
		onChange: this.handleChange.bind(this),
	};

	//UPLOAD控件-最多上传1个文件
	handleChange(info) {

		let fileList = info.fileList;
		fileList = fileList.slice(-1);
		this.setState({fileList: fileList});
	}

	downloadFile(a_file) {

		let downloadLink = STATIC_DOWNLOAD_API + '/media' + a_file.split('/media')[1];
		window.open(downloadLink);
	}

	render() {

		const {
			blockIndex = [],
			selectedUnit = [],
		} = this.props;

		const buttonStyle = {
			'margin': '5px',
			'dispaly': 'inline-block'
		};

		const {blockIndex: finalBlockIndex} = blockIndex.length > 1 ?
			this.props : this.state;

		const {currentBlock, currentBlock: {fileInfo}, nextBlock} = this.state;

		return (
			<div>
				当前 单元工程：{selectedUnit[0]}
				<Row style={{'padding': '20px'}}>
					<Col span='18'>
						<div className='flow-tree-approval'>
							<div className='flow-one-line' style={{height: "60px"}}>
								<div className="box-left first-box">工可研</div>
								<div className="box-right first-box">
									<div>
										<Button
											type={finalBlockIndex[0].workStatus === 'done' ? 'primary' : null}
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
											type={finalBlockIndex[1].workStatus === 'done' ? 'primary' : null}
											onClick={this.clickBlock.bind(this, finalBlockIndex[1])}

										>2、方案设计核查+3-1、选址意见书</Button>
									</div>
									<div style={{marginTop: "10px", marginLeft: "40px", position: "relative"}}>
										<Button
											type={finalBlockIndex[2].workStatus === 'done' ? 'primary' : null}
											onClick={this.clickBlock.bind(this, finalBlockIndex[2])}
										>3-2、用地预审+5、用地方案图</Button>
										<div className="line-1"></div>
										<div className="line-1-1"></div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "80px", position: "relative"}}>
										<Button
											type={finalBlockIndex[3].workStatus === 'done' ? 'primary' : null}
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
											type={finalBlockIndex[4].workStatus === 'done' ? 'primary' : null}
											onClick={this.clickBlock.bind(this, finalBlockIndex[4])}
										>11-1施工图强审-施工图设计审查合格书</Button>
										<div className="line-3"></div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "160px", overflow: "hidden"}}>
										<div style={{marginTop: "10px", display: "inline-block", float: "left"}}>
											<Button
												type={finalBlockIndex[5].workStatus === 'done' ? 'primary' : null}
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
												type={finalBlockIndex[6].workStatus === 'done' ? 'primary' : null}
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
												type={finalBlockIndex[7].workStatus === 'done' ? 'primary' : null}
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
												type={finalBlockIndex[8].workStatus === 'done' ? 'primary' : null}
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
												type={finalBlockIndex[9].workStatus === 'done' ? 'primary' : null}
												onClick={this.clickBlock.bind(this, finalBlockIndex[9])}
											>环评批复</Button>
											<div className="line-5"></div>
										</div>
									</div>
									<div style={{marginTop: "10px", marginLeft: "312px", position: "relative"}}>
										<Button
											type={finalBlockIndex[10].workStatus === 'done' ? 'primary' : null}
											onClick={this.clickBlock.bind(this, finalBlockIndex[10])}
										>11-2施工许可</Button>
										<div className="line-6"></div>
									</div>
								</div>
							</div>
						</div>
					</Col>
					<Col span='6'>
						{
							this.state.blockVisible ?
								<ViewInfo {...this.props} {...this.state} /> : <TipsRender container='请选择左侧需要操作的报批文档'/>
						}
					</Col>

					<Modal
						title={"上传批文"}
						width={800}
						visible={this.state.uploadVisible}
						onOk={this.okUpload.bind(this)}
						onCancel={this.cancelUploadModal.bind(this)}
					>
						等待上传批文：{nextBlock.name}
						<br/>
						<br/>
						<Upload
							{...this.uploadProps}
							fileList={this.state.fileList}
						>
							<Button>
								<Icon type='upload'/> 上传批文
							</Button>
						</Upload>
					</Modal>
				</Row>
				<Preview/>

			</div>
		);
	};
}

export default ProjectInfo;