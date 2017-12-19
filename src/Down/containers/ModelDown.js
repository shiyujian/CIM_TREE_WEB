/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, {Component} from 'react';
import {Modal, Row, Col, Table, Button, message, notification} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../store/modelDown';
import DataService from '../components/model.js';
import {actions as platformActions} from '_platform/store/global';
import {modelDownloadAddress} from '_platform/api';
import styles from './ModelDown.css';
const dataService = new DataService();
const $=window.$;


let dgn = null;
@connect(
    state => {
        const {modeldown: {down = {}} = {}, platform} = state;
        return {down, platform}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)
export default class ModelDown extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {dataSource: [], loading: false, visible: false};
	}

	render() {
		return (
			 <div>
				<Modal title="三维模型插件下载更新" visible={this.state.visible}
					   onOk={this.handleOk}>
				</Modal>
				<Row>
					<Col sm={12} style={{marginTop: '20px'}} offset={11}>
						<h2>模型下载</h2>
					</Col>
				</Row>
				<Row>
					<Col sm={18} offset={3}>
						<h4>模型列表:<span
							style={{color: 'red'}}>{this.state.dataSource.length}</span>条
						</h4>
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
		);
	}

	componentDidMount() {
		// 打开模型
		dgn = window.dgn;
		try {
			let v = dgn.GetOCXVersion();
			//检查IE active插件是否需要更新
	        notification.info({
	            message: '当前插件版本：'+v,
	            duration: 2
	        })
			//检查IE active插件是否需要更新
			dataService.getDGN().then((datas) => {
				
				let v1 = 0;
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
							v1 = modelName.split('_')[2].replace('.msi','')
						}else{
							let currVer = modelName.split('_')[2].replace('.msi','');
							let nextVer = name.split('_')[2].replace('.msi','');
							if(nextVer >currVer){
								v1 = nextVer
								modelName = name;
								download_url = datas[i].download_url;
							}
						}
					}
				}
				console.log('v1',v1)
				if (v1 > v) {
					Modal.confirm({
						title: '三维模型插件下载更新',
						content: (<div>
							<p>当前版本：<span style={{color: 'blue'}}>{v}</span></p>
							<p>最新版本：<span style={{color: 'green'}}>{v1}</span>
							</p>
							<p>为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。</p>
						</div>),
						okText: '确定',
						cancelText:'取消',
						maskClosable:true,
						onOk() {
							return new Promise((resolve, reject) => {
								let link = document.createElement('a');
								link.download = modelName;
								link.href = download_url;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
								link = null;
							})
							.catch(() => console.log('errors!'));
						},
						onCancel() {
							return new Promise((resolve,reject) =>{
								resolve();
							});
						},
					});
				}
			});
		}
		catch (err) {
			//未安装IE active控件，下载控件
			Modal.confirm({
				title: '三维模型插件下载安装',
				content: '为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。',
				cancelText:'取消',
				okText: '确定',
				maskClosable:true,
				onOk() {
					dataService.getDGN().then((datas)=>{
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
				onCancel(){
					return new Promise((resolve,reject) =>{
						resolve();
					});
				},
			});
		}
		let s = false;
		dataService.getModelList().then(function(data) {
			// todo  modelDownloadAddress api
			data.map((item, index) => {
				let name = item.name.substring(0, item.name.length - 4);
				//判读模型是否已经下载 1为已经下载，未下载
				try{
				s = dgn.ImodelDownloaded(encodeURI(name),
					modelDownloadAddress);
				}catch(e){
					s = false;
				}
				item.done = s;
			});
			this.setState({dataSource: data});
		}.bind(this));
	}

	download() {
		if ($.browser != undefined && ($.browser.msie ||
			($.browser.mozilla && $.browser.version == '11.0'))) {
			this.setState({loading: true});
			const hide = message.loading('正在下载模型，请耐心等待！', 0);
			setTimeout(function() {
				this.state.dataSource.map((item, index) => {
					debugger
					let name = item.name.substring(0, item.name.length - 4);
					dgn.PreProcessProjectFile(encodeURI(name),
						modelDownloadAddress, true);
					let s = dgn.ImodelDownloaded(encodeURI(name),
						modelDownloadAddress);
					item.done = s;
				});
			}.bind(this), 200);
			setTimeout(function() {
				hide();
				this.setState({loading: false});
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
			width: 100,
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			sorter: (a, b) => moment(a.create_time) - moment(b.create_time),
			width: 75,
			render: text => {
				return moment(text).format('YYYY-MM-DD HH:mm:ss');
			},
		}, {
			title: '大小',
			dataIndex: 'size',
			width: 50,
			render: text => {
				return <div><span>{text / 1024}</span><span
					style={{color: 'blue'}}> KB</span></div>;
			},
			className: `${styles['column-size']}`,
			sorter: (a, b) => a.size - b.size,
		}, {
			title: '状态',
			dataIndex: 'done',
			width: 30,
			className: `${styles['column-size']}`,
			render: done => {
				return done == 1 ?
					<span style={{color: 'green'}}>已下载</span> :
					<span style={{color: 'red'}}>未下载</span>;
			},
		}];
}
