/*
项目信息组件
 */
import React, {Component} from 'react';
import DGN from '_platform/components/panels/DGN';
import {bindActionCreators} from 'redux';
import {Tabs, Modal, Row, Col, Table, Button, message, notification} from 'antd';
import {connect} from 'react-redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store'
import ProjectUnitWrapper from './ProjectInfo/ProjectUnitWrapper';
import QulityInfo from './ProjectInfo/QulityInfo';
import DrawingTab from './ProjectInfo/DrawingTab';
import QulityTab from './ProjectInfo/QulityTab';
import ProgressTab from './ProjectInfo/ProgressTab';
import SafeTab from './ProjectInfo/SafeTab';
import CostTab from './ProjectInfo/CostTab';
import ProjectApprovalTab from './ProjectInfo/ProjectApprovalTab';


import './DGNProjectInfo.css';
import DataService from '../../Down/components/model.js';
// import {modelDownloadAddress} from '_platform/api';
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';


const dataService = new DataService();
const $ = window.$;

const TabPane = Tabs.TabPane;
window.config = window.config || {};
let dgn = null;

@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions,...previewActions}, dispatch),
	}),
)
class DGNProjectInfo extends Component {

	state = {
		nowShowModel: '',
		project: {},
		unit: {},
		dataSource: [], loading: false, visible: false,
		canModel:false,
	}

	componentDidMount() {
		// 打开模型
		dgn = window.dgn;
		try {
			let v = dgn.GetOCXVersion();
			//检查IE active插件是否需要更新
			notification.info({
				message: '当前插件版本：' + v,
				duration: 2
			})
			this.setState({
				canModel:true,
			})
			//检查IE active插件是否需要更新
			// dataService.getDGN().then((data) => {
			// 	let name = data[2].name.split('_')[2];
			// 	let v1 = name.substring(0, name.length - 4);
			// 	debugger
			// 	if (v1 > v) {
			// 		Modal.confirm({
			// 			title: '三维模型插件下载更新',
			// 			content: (<div>
			// 				<p>当前版本：<span style={{color: 'blue'}}>{v}</span></p>
			// 				<p>最新版本：<span style={{color: 'green'}}>{v1}</span>
			// 				</p>
			// 				<p>为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。</p>
			// 			</div>),
			// 			okText: '确定',
			// 			cancelText: '取消',
			// 			maskClosable: true,
			// 			onOk() {
			// 				return new Promise((resolve, reject) => {
			// 					let link = document.createElement('a');
			// 					link.download = data[2].name;
			// 					link.href = data[2].download_url;
			// 					document.body.appendChild(link);
			// 					link.click();
			// 					document.body.removeChild(link);
			// 				}).catch(() => console.log('errors!'));
			// 			},
			// 			onCancel() {
			// 				return new Promise((resolve, reject) => {
			// 					resolve();
			// 				});
			// 			},
			// 		});
			// 	}
			// });
		}
		catch (err) {
			//未安装IE active控件，下载控件
			// Modal.warning({
			// 	title: '三维模型插件下载安装',
			// 	content: '为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。',
			// 	okText: '确定',
			// 	maskClosable: false,
			// 	onOk() {
			// 		dataService.getDGN().then((data) => {
			// 			return new Promise((resolve, reject) => {
			// 				let link = document.createElement('a');
			// 				link.download = data[2].name;
			// 				link.href = data[2].download_url;
			// 				document.body.appendChild(link);
			// 				link.click();
			// 				document.body.removeChild(link);
			// 				link = null;
			// 			});
			// 		}).catch(() => console.log('errors!'));
			// 	},
			// 	// onCancel() {
			// 	// 	return new Promise((resolve, reject) => {
			// 	// 		resolve();
			// 	// 	});
			// 	// },
			// });
			this._downActiveFunc();
		}

		this.setFirstUnit();
	}

	callback(key) {
		console.log(key);
		//加载对应页面的数据
	}
	_downActiveFunc(){
		Modal.warning({
			title: '三维模型插件下载安装',
			content: '为了更好的体验三维模型，请点击“确定”下载最新版。',
			okText: '确定',
			maskClosable: false,
			onOk() {
				dataService.getDGN().then((datas) => {
					if(datas == null || datas.length <= 0)
						return;
					let modelName = '';
					let download_url = '';
					for(let i=0; i<datas.length; i++){
						let name = datas[i].name;
						if(name.indexOf('WebBIM_Setup') > -1 ){
							if(modelName == ''){
								modelName = name;
								download_url = datas[i].download_url;
							}else{
								let currVer = modelName.split('_')[2].replace('.msi','');
								let nextVer = name.split('_')[2].replace('.msi','');
								if(nextVer >currVer){
									modelName = name;
									download_url = datas[i].download_url;
								}
							}
						}
					}
					return new Promise((resolve, reject) => {
						let link = document.createElement('a');
						link.download = modelName;
						link.href = download_url;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						link = null;
					});
				}).catch(() => console.log('errors!'));
			},
		});
	}
	selectProject = (project, unit) => {
		if(!unit){
			unit = {
				code:0
			}
		}
		// console.log(unit);
		this.setState({unit: unit, project});
		// if(!this.state.canModel){
		// 	this._downActiveFunc();
		// 	return
		// }
		this.setState({nowShowModel: ''});
		const {actions:{getImodelInfoAc}}=this.props;
		//1062412210364
		getImodelInfoAc({pk:("schedule_" + unit.code)})
			.then((rst)=>{
				console.log('模型数据',rst)
				//查找是否上传了模型
				if (rst && rst.code) { //有模型
					const {extra_params:{uploadModelFile,uploadMD5File}}=rst;
					if(uploadModelFile !== null && uploadModelFile.length >0 ){

						if ($.browser != undefined && ($.browser.msie || ($.browser.mozilla && $.browser.version == '11.0'))){
							console.log('这是ie浏览器')
						}else{
							notification.info({
								message: '请选择ie浏览器进行模型预览',
								duration: 2,
							});
							return
						}
						//判断当前模型是否已经下载
						let iModelArray=[
							{
								"id":"zip",
								"name":uploadModelFile[uploadModelFile.length-1].name,//使用数组内最新元素
								"url":window.config.STATIC_FILE_IP+':'+window.config.STATIC_DOWNLOAD_PORT+'/media/documents/meta/',
							}/*,{
								"id":"md5",
								"name":uploadMD5File.name,
								"url":window.config.STATIC_FILE_IP+':'+window.config.STATIC_DOWNLOAD_PORT+uploadMD5File.download_url,
							}*/
						];
						let key=0;
						iModelArray.map((item, index) => {
							//判读模型是否已经下载 1为已经下载，未下载
							let s=0;
							//下载使用全称，即.zip之前的所有内容
							let modelName = item.name;
							modelName = modelName.substring(0,modelName.indexOf('.zip'));
							// try{
							s = dgn.ImodelDownloaded(encodeURI(modelName),
									item.url);
								console.log('done',s)
							if(s===0){ //未下载
								key=key+1;
							}
						});
						this.setState({dataSource: iModelArray});
						if (key === 0) { //模型已下载
							this.setState({nowShowModel: iModelArray[0]['name'].split('_')[0]});
						} else { //模型未下载
							this.setState({
								visible:true,
								// nowShowModel: ''
							});
						}
					}else{
						// this.setState({nowShowModel: ''});
						Modal.warning({
							title: '友情提示：',
							content: '当前项目(单位工程)暂未上传模型，无法展示模型！',
						});
					}
				} else {  //无模型
					this.setState({nowShowModel: ''});
					Modal.warning({
						title: '友情提示：',
						content: '当前项目(单位工程)暂未上传模型，无法展示模型！',
					});
				}
			})
	}

	setFirstUnit=()=>{
        const {
            platform:{wp:{projectTree=[]}={}}
        } = this.props;
        let project =projectTree.length?projectTree[0]:null;
        let unitProject = project && project.children.length?project.children[0]:null;
        if(unitProject){
            this.selectProject(project,unitProject);
        }
    };


	render() {
		const {unit={},project={}} = this.state;
		const {name=''}=unit;
		console.log('模型名称',this.state.nowShowModel)
		return <div style={{
			"position": "absolute",
			"top": "80px",
			"bottom": 0,
			"left": "160px",
			"right": 0,
			'zIndex': '990',
			background: '#fff'
		}}>
			<div style={{width: 200, height: '100%', float: 'left',overflow:'auto',background:'#F4F3F4'}}>
				<ProjectUnitWrapper {...this.props} onSelect={this.selectProject} onLoad={()=>{
                                    this.setFirstUnit();
                            }}></ProjectUnitWrapper>
			</div>
			<div style={{height: '100%', position: 'relative', marginLeft: 200}}>
				{
					(this.state.nowShowModel !== '') ? <DGN style={{position: 'relative'}}
						 width='100%'
						 height='40%'
						 model={this.state.nowShowModel}/> :
						 <div style={{width:'100%', height: '40%', background: 'gray'}}>
						 	<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>模型预览</h2>
					 	 </div>
				}
				<div style={{
					position: 'absolute', bottom: 0, left: 0, height: '50%', width: '100%',
					'borderTop': '1px solid #666', zIndex: 2010
				}}>
					<Tabs defaultActiveKey="0" onChange={() => {
						this.callback
					}}>
						<TabPane tab="基本信息" key="0">
							<QulityInfo unit={unit} project={project} {...this.props}></QulityInfo>
						</TabPane>
						<TabPane tab="质量信息" key="1">
							<QulityTab unit={unit} {...this.props}></QulityTab>
						</TabPane>
						<TabPane tab="进度信息" key="2">
							<ProgressTab unit={unit} {...this.props}></ProgressTab>
						</TabPane>
						<TabPane tab="安全信息" key="3">
							<SafeTab unit={unit} {...this.props}></SafeTab>
						</TabPane>
						{/*<TabPane tab="造价信息" key="4">*/}
							{/*<CostTab {...this.props}></CostTab>*/}
						{/*</TabPane>*/}
						<TabPane tab="图纸" key="5">
							<DrawingTab unit={unit} {...this.props}></DrawingTab>
						</TabPane>
						<TabPane tab="项目批文" key="6">
							<ProjectApprovalTab unit={unit} {...this.props}></ProjectApprovalTab>
						</TabPane>
					</Tabs>
				</div>
			</div>
			<div>
				<Modal title="三维模型下载" visible={this.state.visible}
					   onOk={this.download.bind(this)}
					   onCancel={this.hideModal.bind(this)}
					   footer={[
				            <Button key="back" size="large" onClick={this.hideModal}>取消</Button>,
				            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.download.bind(this)}>
				              下载
				            </Button>,
				          ]}
				>
					<div>
						<Row>
							<Col sm={12} style={{marginTop: '20px'}} offset={11}>
								<h2>模型下载</h2>
							</Col>
						</Row>
						<Row>
							<Col sm={18} offset={3}>
								<Table size='middle' columns={this.columns}
									   dataSource={this.state.dataSource} rowKey="id"
									   scroll={{y: 500}} pagination={false} bordered/>
							</Col>
						</Row>
						{/*<Row>
							<Col sm={11} offset={11} style={{marginTop: '30px'}}>
								<Button type="primary" loading={this.state.loading}
										icon='download'
										onClick={this.download.bind(this)} size='large'>下载模型</Button>
							</Col>
						</Row>*/}
					</div>
				</Modal>
				<iframe style={{position: 'relative'}}
				 width='100%'
				 height='100%'/>
			</div>
			<Preview/>
		</div>
	}

	hideModal = () => {
		this.setState({
			visible: false,
		});
	}

	download() {
		if ($.browser != undefined && ($.browser.msie ||
				($.browser.mozilla && $.browser.version == '11.0'))) {
			this.setState({loading: true});
			const hide = message.loading('正在下载模型，请耐心等待！', 0);
			setTimeout(function () {
				this.state.dataSource.map((item) => {
					//下载使用全称，即.zip之前的所有内容
					let modelName = item.name;
					// debugger
					modelName = modelName.substring(0,modelName.indexOf('.zip'));
					//let name = item.name.split('_')[0];
					// console.log(1111,modelName)
					// console.log(2222,item.url)
					dgn.PreProcessProjectFile(encodeURI(modelName),
						item.url, true);
					let s = dgn.ImodelDownloaded(encodeURI(modelName),
						item.url);
					item.done = s;
				});
			}.bind(this), 200);
			setTimeout(function () {
				hide();
				this.setState({
					nowShowModel:this.state.dataSource[0].name.split('_')[0],
					loading: false,
					// dataSource: [],
					visible:false,
				});
				notification['success']({
					message: '模型下载完成。',
				});
			}.bind(this), 500);
		}
	}

	columns = [
		{
			title: '模型名称',
			dataIndex: 'name',
		}, {
			title: '状态',
			dataIndex: 'done',
			render: done => {
				return done == 1 ?
					<span style={{color: 'green'}}>已下载</span> :
					<span style={{color: 'red'}}>未下载</span>;
			},
		}];

}

export default DGNProjectInfo;
