import React, {Component, PropTypes} from 'react';
import {Main, Content, Sidebar,DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {actions as platformActions} from '_platform/store/global';
import {actions as dgnActions} from '../store/dgn';
import {actions as schedulerActions} from '../store/scheduler';

import {Tabs, Modal, Row, Col, Table, Button, message, Select, notification} from 'antd';
import ProgressPlaybar from '../components/ProgressPlaybar';
// import DGN from '../components/DGN';
import DGN from '_platform/components/panels/DGN';
import {SCHEDULE_DGN_NAME,modelDownloadAddress} from '_platform/api';
import DataService from '../../Down/components/model.js';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import DGNGantt from '../components/DGNGantt';

const DGN_NAME = SCHEDULE_DGN_NAME;
const $ = window.$;
const dataService = new DataService();
const TabPane = Tabs.TabPane;
window.config = window.config || {};
let dgn = null;
@connect(
	state => {
		const {platform,show={},scheduler={}} = state;
		return {platform,show,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...dgnActions,...schedulerActions}, dispatch)
	})
)
export default class DgnSchedule extends Component {
	constructor(props){
		super(props)
		this.state={
			project: {},
			unit: {},
			dataSource: [], loading: false, visible: false,
			canModel:false,
			item:null,
			nowShowModel:'NULL-A',
			isDgnVisiable:false
		}
	}

	componentDidMount() {
		// 打开模型
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
		}
		catch (err) {
			this._downActiveFunc();
		}

		// this.setFirstUnit();
	}

	_downActiveFunc(){
		Modal.warning({
			title: '三维模型插件下载安装',
			content: '为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。',
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
			}
		});
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
	
	selectProject = (project, unit) => {
		let me = this;
		if(unit){
			this.setState({
				unit: unit, project,
				item:{
					unitProjecte:unit,
					project:project
				}
			});
			
			me.setState({
				isDgnVisiable:false,
				nowShowModel: 'NULL-A',
			});
			const {actions:{getImodelInfoAc}}=this.props;

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
									"url":modelDownloadAddress
								}
							];
							let key=0;
							iModelArray.map((item, index) => {
								//判读模型是否已经下载 1为已经下载，未下载
								let s=0;
								//下载使用全称，即.zip之前的所有内容
								let modelName = item.name;
								modelName = modelName.substring(0,modelName.indexOf('.zip'));
								try{
									s = dgn.ImodelDownloaded(encodeURI(modelName),item.url);
								}catch(e){
									console.log('e')
								}
								
								console.log('done',s)
								if(s===0){ //未下载
									key=key+1;
								}
							});
							this.setState({dataSource: iModelArray});
							let fileName = iModelArray[0].name.substring(0,iModelArray[0].name.indexOf('.zip'));
							if (key === 0) { //模型已下载
								me.setState({
									nowShowModel: fileName.substring(0,fileName.lastIndexOf('_')),
									isDgnVisiable:true
								});
							} else { //模型未下载
								me.setState({
									isDgnVisiable:false,
									nowShowModel: 'NULL-A',
									visible:true
								});
							}
						}else{
							me.setState({
								isDgnVisiable:false,
								nowShowModel: 'NULL-A'
							});
							Modal.warning({
								title: '友情提示：',
								content: '当前项目(单位工程)暂未上传模型，无法展示模型！'
							});
						}
					} else {  //无模型
						me.setState({
							isDgnVisiable:false,
							nowShowModel: 'NULL-A'
						});
						Modal.warning({
							title: '友情提示：',
							content: '当前项目(单位工程)暂未上传模型，无法展示模型！'
						});
					}
				})
		}
		
	}

	render() {
		// this.setConfig();
		const {unit={},project={}} = this.state;
		const {name=''}=unit;
		console.log('模型名称',this.state.nowShowModel)
		return (
			<Main>
				<DynamicTitle title="进度模拟" {...this.props}/>
				<Sidebar>
					<div style={{overflow:'hidden'}} className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.selectProject} 
						// onLoad={()=>{this.setFirstUnit();}}
						/>
					</div>
				</Sidebar>
				<Content>
					{
						// this.renderDNG()
					}
					<div style={{height:'100px',marginTop:'40px'}}>
						<ProgressPlaybar {...this.props} listData={listData} style={{height:'100%'}}/>
					</div>
					<DGNGantt {...this.props} {...this.state}/>
					<div>
						<Modal title="三维模型下载" visible={this.state.visible}
						 footer={null}
						 onCancel={this.handleCancel.bind(this)}
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
								<Row>
									<Col sm={11} offset={11} style={{marginTop: '30px'}}>
										<Button type="primary" loading={this.state.loading}
												icon='download'
												onClick={this.download.bind(this)} size='large'>下载模型</Button>
									</Col>
								</Row>
							</div>
						</Modal>
						<iframe style={{position: 'relative'}}
						width='100%'
						height='100%'/>
					</div>
				</Content>
			</Main>
		);
	};

	handleCancel(){
		this.setState({
			visible:false
		})
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
					try{
						dgn.PreProcessProjectFile(encodeURI(modelName),
						item.url, true);
					}catch(e){
						console.log(e)
					}
					try{
						let s = dgn.ImodelDownloaded(encodeURI(modelName),
						item.url);
						item.done = s;
					}catch(e){
						console.log(e)
					}
				});
			}.bind(this), 200);
			setTimeout(function () {
				hide();
				let fileName = this.state.dataSource[0].name.substring(0,this.state.dataSource[0].name.indexOf('.zip'));
				this.setState({
					nowShowModel:fileName.substring(0,fileName.lastIndexOf('_')),
					loading: false,
					visible:false,
					isDgnVisiable:true
				});
				
				notification['success']({
					message: '模型下载完成。'
				});
			}.bind(this), 500);
		}
	}

	columns = [
		{
			title: '模型名称',
			dataIndex: 'name'
		}, {
			title: '状态',
			dataIndex: 'done',
			render: done => {
				return done == 1 ?
					<span style={{color: 'green'}}>已下载</span> :
					<span style={{color: 'red'}}>未下载</span>;
			}
		}
	];

	renderDNG() {
		if ($.browser != undefined && ($.browser.msie || ($.browser.mozilla && $.browser.version == '11.0'))) {
			let isdgnShow ='none';
			if(this.state.isDgnVisiable && this.state.nowShowModel!=='NULL-A' ){
				isdgnShow ='block';
				return (
					<div style={{display:isdgnShow,position:'relative',width:'99%',height:'400px',marginBottom:'20px'}}>
						<DGN
						style={{position:'relative',zIndex:'90'}}
						width='100%'
						height='90%'
						model={this.state.nowShowModel}/>
						<div className="clear-float"></div>
					</div>
				);
			}else{
				return (
					<div style={{height: '400px', background: 'gray'}}>
						<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>模型预览</h2>
					</div>);
			}
			
		} else{
			return (
				<div style={{height: '400px', background: 'gray'}}>
					<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>请选择ie浏览器进行模型预览</h2>
				</div>);
		}
	}

	selectRow(record, index) {
		const {player: {progress = 0} = {}} = this.props;
		if (index === progress) {
			return 'selected-row';
		} else {
			return '';
		}
	}

	changeItem(item) {
		const {getChildrenWorkPackages} = this.props.actions;
		getChildrenWorkPackages({code: item});
	}


};

const listData = [
	{
		'index': '1',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|18',
		'code': 'Q01V_0301-0100-015-0001',
		'描述': '1#级配层检验批',
		'Element_ID': '30253',
		'name': '1#级配层检验批',
		'start': '2017-09-25',
		'计划开始时间': '2017-09-25',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20171018'
	},
	{
		'index': '2',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|17',
		'code': 'Q01V_0301-0100-015-0002',
		'描述': '2#级配层检验批',
		'Element_ID': '30248',
		'name': '2#级配层检验批',

		'start': '2016-10-01',
		'计划开始时间': '2017-10-01',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20171018'
	},
	{
		'index': '3',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|16',
		'code': 'Q01V_0301-0100-015-0003',
		'描述': '3#级配层检验批',
		'Element_ID': '30238',
		'name': '3#级配层检验批',

		'start': '2017-10-07',
		'计划开始时间': '2017-10-07',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20171018'
	},
	{
		'index': '4',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|12',
		'code': 'Q01V_0301-0100-016-0001',
		'描述': '1#水稳层检验批',
		'Element_ID': '30203',
		'name': '1#水稳层检验批',

		'start': '2017-10-08',
		'计划开始时间': '2017-10-08',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20171018'
	},
	{
		'index': '5',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|11',
		'code': 'Q01V_0301-0100-016-0002',
		'描述': '2#水稳层检验批',
		'Element_ID': '30198',
		'name': '2#水稳层检验批',

		'start': '2017-10-14',
		'计划开始时间': '2017-10-14',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20171018'
	}
];