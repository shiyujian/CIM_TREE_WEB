import React, {Component, PropTypes} from 'react';
import {Main, Content, Sidebar,DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as dgnActions} from '../store/dgn';
import {Row, Col,Select, Table,Radio,Button,notification,Modal,message,Tabs} from 'antd';
import ProgressPlaybar from '../components/ProgressPlaybar';
import WorkPackageTree from '../components/WorkPackageTree';
import {SCHEDULE_DGN_NAME} from '_platform/api';
import DetailGantt from '../components/DetailGantt';
import {actions as schedulerActions} from '../store/scheduler';
import queryString from 'query-string';
import {STATIC_DOWNLOAD_API,modelDownloadAddress } from '_platform/api';
import DGN from '_platform/components/panels/DGN';
import DataService from '../../Down/components/model.js';
import './index.less'
const RadioGroup = Radio.Group;
const Option = Select.Option;

const DGN_NAME = SCHEDULE_DGN_NAME;
const $ = window.$;
const gantt = window.gantt;
let dgn = null;
const dataService = new DataService();
const TabPane = Tabs.TabPane;
window.config = window.config || {};
@connect(
	state => {
		const {platform,show={},scheduler={}} = state;
		return {platform,show,scheduler};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...dgnActions,...schedulerActions}, dispatch)
	})
)
export default class DgnDetail extends Component {
	constructor(props){
		super(props)
		this.state={
			historyVersionState:'',
			item:null,
			uploadModelFile:[],
			file:null,
			scheduleMaster:null,
			nowShowModel:'NULL-A',
			isDgnVisiable:false

		}
	}

	componentDidMount() {
		const{
			actions:{
				getProjects,
				getDocument,
				getProcessData
			},
			location={}
		}=this.props
		let me =this;

		let {unitPk='0'} = queryString.parse(location.search) || {};
		if(unitPk==='0'){
			console.log('unitPk',0)
			me.setState({
				item:null,
				uploadModelFile:[],
				file:null,
				scheduleMaster:null
			})
		}else{

			
			dgn = window.dgn;
			try {
				let v = dgn.GetOCXVersion();
				//检查IE active插件是否需要更新
				notification.info({
					message: '当前插件版本：' + v,
					duration: 2
				})
				me.getFirstModel()
			}
			catch (err) {
				me._downActiveFunc();
			}
		}
	}

	getFirstModel(){
		const{
			actions:{
				getProjects,
				getDocument,
				getProcessData
			},
			location={}
		}=this.props
		let me =this;

		let {unitPk='0'} = queryString.parse(location.search) || {};
		if(unitPk==='0'){
			console.log('unitPk',0)
			me.setState({
				item:null,
				uploadModelFile:[],
				file:null,
				scheduleMaster:null
			})
		}else{

			me.setState({
				item:unitPk
			})

			getProcessData({pk:unitPk}).then((unitProject)=>{
				if(unitProject && unitProject.code){
					let documentCode = {
						code: "schedule_" + unitProject.code
					}
					getDocument(documentCode).then((doc)=>{
						if(doc && doc.code && doc.extra_params && doc.extra_params.uploadModelFile && doc.basic_params && doc.basic_params.files && doc.extra_params.scheduleMaster){
							if(doc.basic_params.files.length>0 && doc.extra_params.scheduleMaster){

								let uploadModelFile = doc.extra_params.uploadModelFile;
								let file = doc.basic_params.files[0];
								let scheduleMaster = doc.extra_params.scheduleMaster;
								let currentState = null;
								if(uploadModelFile && uploadModelFile.length>0){
									currentState = uploadModelFile[uploadModelFile.length-1].name;
								}
								
								console.log('uploadModelFile',uploadModelFile)
								console.log('file',file)
								console.log('scheduleMaster',scheduleMaster)
								console.log('currentState',currentState)
								me.setState({
									uploadModelFile:uploadModelFile,
									file:file,
									scheduleMaster:scheduleMaster,
									historyVersionState:currentState
								},()=>{
									if(uploadModelFile && uploadModelFile.length>0){
										let historyVersion = {
											target:{
												value:null
											}
										};
										historyVersion.target.value = currentState;
										me.historyVersionChange(historyVersion)
									}
								})
							}
							
						}
					})
				}
			})
		}
	}

	_downActiveFunc(){
		let me = this;
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
						me.getFirstModel()
					});
				}).catch(() => console.log('errors!'));
			}
		});
	}
	
	render() {
		const{
			uploadModelFile,
		}=this.state
		let radio = [];
		let historyRadio = [];

		if(uploadModelFile.length>0){
			let len = uploadModelFile.length;
			radio.push(
				<Radio className='radioStyle' value={uploadModelFile[len-1].name} key={uploadModelFile[len-1].id}>{uploadModelFile[len-1].name}</Radio>
			)
			for(let i=0;i<uploadModelFile.length-1;i++){
				console.log('uploadModelFile',uploadModelFile[i])
				let model = uploadModelFile[i]
				historyRadio.push(
					<Radio className='radioStyle' value={model.name} key={model.id}>{model.name}</Radio>
				)
			}
		}
		return (
			<Main>
				<DynamicTitle title="总体进度详情" {...this.props}/>
				<Sidebar>
                    <RadioGroup onChange={this.historyVersionChange.bind(this)} value={this.state.historyVersionState}>
						{radio}
                    </RadioGroup>
                    <Row className='mb10'>
                        <Col span={24}>
                            <lable style={{minWidth: 60,display: 'inline-block'}}>{uploadModelFile&&uploadModelFile.length>1?'历史版本:':''}</lable>
                        </Col>
                    </Row>
                    <RadioGroup onChange={this.historyVersionChange.bind(this)} value={this.state.historyVersionState}>
                        {historyRadio}
                    </RadioGroup>
				</Sidebar>
				<Content>
					<Row className='mb10'>
						<Col span={24}>
							<Button 
								style={{marginRight:15}} 
								type = "primary" 
								icon="download"
								onClick={this.downModelsOfDiffVersion.bind(this)}>
								下载施工进度模型
							</Button>
							<Button 
								style={{marginRight:15}} 
								type = "primary" 
								icon="download"
								onClick={this.downExcelFrameWork.bind(this)}>
								下载总体进度表
							</Button>
						</Col>
					</Row>
					<Row>
						<Col>
							{
								this.renderDNG()
							}
						</Col>
					</Row>
					<ProgressPlaybar {...this.props} listData={listData}/>
					<DetailGantt {...this.props} {...this.state}/>
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
				   height='5px'/>
				</Content>
			</Main>
		);
	};
	handleCancel(){
		this.setState({
			visible:false
		})
	}
	//下载模型
	downModelsOfDiffVersion(){
		const{
			historyVersionState,
			uploadModelFile
		}=this.state
		if(uploadModelFile && uploadModelFile.length>0){
			let link = document.createElement("a");
			let modelFile = uploadModelFile.find((rst)=> rst.name === historyVersionState)

			link.href = STATIC_DOWNLOAD_API + modelFile.download_url;
			link.setAttribute('download', this);
			link.setAttribute('target', '_blank');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}else{
			notification.error({
				message: '填报时未上传施工模型',
				duration: 2
			})
		}
		

	}
	//下载总体进度表
	downExcelFrameWork(){
		const{
			file
		}=this.state
		console.log('下载总进度计划表');
        let link = document.createElement("a");
        if(file){
            link.href = STATIC_DOWNLOAD_API + file.download_url;
            link.setAttribute('download', this);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }else{
            notification.error({
                message: '不存在进度表',
                duration: 2
            })
            return;
        }
	}

	//选择历史版本
    historyVersionChange(historyVersion){
		const{
			uploadModelFile
		}=this.state
		console.log('选择历史版本',historyVersion.target.value);
		if(!historyVersion.target.value){
			console.log('初始化选择版本',historyVersion.target.value)
			return
		}
        this.setState({
			historyVersionState: historyVersion.target.value,
			isDgnVisiable:false,
			nowShowModel: 'NULL-A'
		});
		let me = this;
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

			dgn = window.dgn;
			try {
				let v = dgn.GetOCXVersion();
			}
			catch (err) {
				notification.error({
					message: '请先安装Web_BIM插件',
					duration: 2
				})
				return
			}
			let modelFile = uploadModelFile.find((rst)=> rst.name === historyVersion.target.value)
			//判断当前模型是否已经下载
			let iModelArray=[
				{
					"id":"zip",
					"name":modelFile.name,//使用数组内最新元素
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
			let fileName = iModelArray[0].name.substring(0,iModelArray[0].name.indexOf('.zip'));
			me.setState({dataSource: iModelArray});
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
		}
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
					modelName = modelName.substring(0,modelName.indexOf('.zip'));
					try{
						dgn.PreProcessProjectFile(encodeURI(modelName),item.url, true);
					}catch(e){
						console.log(e)
					}
					try{
						let s = dgn.ImodelDownloaded(encodeURI(modelName),item.url);
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
						<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>请选择模型版本</h2>
					</div>);
			}
			
		} else{
			return (
				<div style={{height: '400px', background: 'gray'}}>
					<h2 style={{ textAlign: 'center', marginBottom: '15px' }}>请选择ie浏览器进行模型预览</h2>
				</div>);
		}
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
		'start': '2016-10-31',
		'计划开始时间': '2016-06-9',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '2',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|17',
		'code': 'Q01V_0301-0100-015-0002',
		'描述': '2#级配层检验批',
		'Element_ID': '30248',
		'name': '2#级配层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-10',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '3',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|16',
		'code': 'Q01V_0301-0100-015-0003',
		'描述': '3#级配层检验批',
		'Element_ID': '30238',
		'name': '3#级配层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-11',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '4',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|12',
		'code': 'Q01V_0301-0100-016-0001',
		'描述': '1#水稳层检验批',
		'Element_ID': '30203',
		'name': '1#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-13',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '5',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|11',
		'code': 'Q01V_0301-0100-016-0002',
		'描述': '2#水稳层检验批',
		'Element_ID': '30198',
		'name': '2#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-14',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '6',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|10',
		'code': 'Q01V_0301-0100-016-0003',
		'描述': '3#水稳层检验批',
		'Element_ID': '30188',
		'name': '3#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-15',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '7',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|21',
		'code': 'Q01V_0301-0100-016-0004',
		'描述': '4#水稳层检验批',
		'Element_ID': '30278',
		'name': '4#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-16',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '8',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|20',
		'code': 'Q01V_0301-0100-016-0005',
		'描述': '5#水稳层检验批',
		'Element_ID': '30273',
		'name': '5#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-17',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '9',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|19',
		'code': 'Q01V_0301-0100-016-0006',
		'描述': '6#水稳层检验批',
		'Element_ID': '30263',
		'name': '6#水稳层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-18',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '10',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|9',
		'code': 'Q01V_0301-0200-017-0001',
		'描述': '1#改性乳化沥青层检验批',
		'Element_ID': '30178',
		'name': '1#改性乳化沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-21',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '11',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|8',
		'code': 'Q01V_0301-0200-017-0002',
		'描述': '2#改性乳化沥青层检验批',
		'Element_ID': '30173',
		'name': '2#改性乳化沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-22',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '12',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|7',
		'code': 'Q01V_0301-0200-017-0003',
		'描述': '3#改性乳化沥青层检验批',
		'Element_ID': '30163',
		'name': '3#改性乳化沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-06-23',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '13',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|24',
		'code': 'Q01V_0301-0200-018-0001',
		'描述': '1#粗粒式沥青层检验批',
		'Element_ID': '30303',
		'name': '1#粗粒式沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-1',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '14',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|23',
		'code': 'Q01V_0301-0200-018-0002',
		'描述': '2#粗粒式沥青层检验批',
		'Element_ID': '30298',
		'name': '2#粗粒式沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-2',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '15',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|22',
		'code': 'Q01V_0301-0200-018-0003',
		'描述': '3#粗粒式沥青层检验批',
		'Element_ID': '30288',
		'name': '3#粗粒式沥青层检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-3',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '16',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|15',
		'code': 'Q01V_0301-0200-019-0001',
		'描述': '1#细粒式沥青检验批',
		'Element_ID': '30228',
		'name': '1#细粒式沥青检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-5',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '17',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|14',
		'code': 'Q01V_0301-0200-019-0002',
		'描述': '2#细粒式沥青检验批',
		'Element_ID': '30223',
		'name': '2#细粒式沥青检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-6',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '18',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|1CXD-LQ-AC20C|13',
		'code': 'Q01V_0301-0200-019-0003',
		'描述': '3#细粒式沥青检验批',
		'Element_ID': '30213',
		'name': '3#细粒式沥青检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-7',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '19',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|6',
		'code': 'Q01V_0301-0300-020-0001',
		'描述': '1#人行道板检验批',
		'Element_ID': '30103',
		'name': '1#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-10',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '20',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|3',
		'code': 'Q01V_0301-0300-020-0002',
		'描述': '2#人行道板检验批',
		'Element_ID': '29978',
		'name': '2#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-11',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '21',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|2',
		'code': 'Q01V_0301-0300-020-0003',
		'描述': '3#人行道板检验批',
		'Element_ID': '29973',
		'name': '3#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-12',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '22',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|5',
		'code': 'Q01V_0301-0300-020-0004',
		'描述': '4#人行道板检验批',
		'Element_ID': '30098',
		'name': '4#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-13',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '23',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|4',
		'code': 'Q01V_0301-0300-020-0005',
		'描述': '5#人行道板检验批',
		'Element_ID': '30088',
		'name': '5#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-14',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '24',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|4RXD-CSTSZ|1',
		'code': 'Q01V_0301-0300-020-0006',
		'描述': '6#人行道板检验批',
		'Element_ID': '29963',
		'name': '6#人行道板检验批',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-15',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '25',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|2DLFS-HGY|16',
		'code': 'Q01V_0301-0400-021',
		'描述': '路缘石',
		'Element_ID': '30138',
		'name': '路缘石',

		'start': '2016-10-31',
		'计划开始时间': '2016-07-17',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	},
	{
		'index': '26',
		'工作包': 'ConnType=FireBird2; DataBase=C:\\Users\\chen_xj7\\Desktop\\0412\\data\\data\\枢纽一街道路.TDBX.FDB|枢纽一街道路-切分完成_i(1)枢纽一街道路|2DLFS-LHD|1',
		'code': 'Q01V_0301-0400-024',
		'描述': '绿化',
		'Element_ID': '29938',
		'name': '绿化',
		'start': '2016-10-31',
		'计划开始时间': '2016-07-20',
		'计划工程量': '2000',
		'工程量单位': 'm3',
		'数据版本': '20161206'
	}
];