import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {message,Progress} from 'antd';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {UploadModal,ChangeModal,DeleteModal,VedioTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioData';
import {addSerialNumber} from '../components/VedioData/commonFunc';
import {DataReportTemplate_VideoMonitor} from '_platform/api.js';

@connect(
	state => {
		const {datareport: {vediodata = {}} = {}, platform} = state;
		return {...vediodata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)

export default class VedioData extends Component {

	constructor(props){
		super(props);
		this.state={
			loading:true,
			uploadModal: false,
			changeModal: false,
			deleteModal: false,
			dataSource: [],
			selectRows: [],
			percent: 0,
		}
		Object.assign(this,{
			originalData: [],
			num: 0
		})
	}

	async componentDidMount(){
        const {actions:{getScheduleDir}} = this.props;
        const topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_safety_vediodata'});
            if(dir.obj_type){
                if(dir.stored_documents.length>0){
                    this.generateTableData(dir.stored_documents);
                }
            }
        }
    }

	render() {
		const {uploadModal,changeModal,deleteModal,dataSource,loading,selectRows,percent} = this.state,
			{actions,actions:{jsonToExcel}} = this.props;

		return (<Main>
			<DynamicTitle title="视频监控" {...this.props} />
			<Content>
				<MainHeader
				 showModal={this.showModal}
				 selectJudge={this.selectJudge}
				 jsonToExcel={jsonToExcel}
				 deriveData={this.deriveData}
				 onSearch={this.onSearch}
				 modalDown={DataReportTemplate_VideoMonitor}
				/>
				<VedioTable
				dataSource={dataSource}
				loading={{tip:<Progress style={{width:200}} percent={percent} status="active" strokeWidth={5}/>,spinning:loading}}
				storeSelectRows={this.storeSelectRows}
				preview={true}
				/>
			</Content>
			<UploadModal
			 key={`uploadModal${uploadModal}`}
			 uploadModal={uploadModal}
			 actions = {actions}
			 closeModal={this.closeModal}
			/>
			<ChangeModal
			 key={`changeModal${changeModal}`}
			 changeModal={changeModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			 actions={actions}
			/>
			<DeleteModal
			 key={`deleteModal${deleteModal}`}
			 deleteModal={deleteModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			 actions = {actions}
			/>
		</Main>)
	}

	showModal = (modal)=>{
		let a = {};
		a[modal] = true;
        this.setState(a);
    }
    closeModal= (modal)=>{
		let a = {};
		a[modal] = false;
        this.setState(a);
	}

	generateTableData = (data)=>{
        const {actions:{
            getDocument,
		}} = this.props;
		const total = data.length;
		this.num = 0;
		const all = data.map(item=>{
			return getDocument({code:item.code}).then(rst=>{
				this.num++;		
				this.setState({percent: parseFloat( (this.num*100/total).toFixed(2) ) })
				if(!rst) {
					message.error(`数据获取失败`)
					return {}
				}else{
					return rst
				}
			})
		})
		Promise.all(all).then(item =>{
			let dataSource = [];
			try{
				dataSource = item.map((response,index)=>{
					let {extra_params:{cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode},code} = response;
					return {index:index+1,
						cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode,code};
				})
				this.originalData = dataSource;
			}catch(e){
				message.error(`数据获取失败`);
			}	
			this.setState({dataSource,loading:false,percent:100});
		})
	}
	
	storeSelectRows = (selectRows)=>{
		this.setState({selectRows});
	}

	selectJudge = ()=>{
		const {selectRows} = this.state;
		if(selectRows.length == 0){
			message.error("请选择数据");
			return false
		}
		if(!selectRows.every((data)=> data.enginner == selectRows[0].enginner )){
			message.error("请选择相同单位工程下的数据");
			return false
		}
		return true
	}

	deriveData = ()=>{
		const {dataSource} = this.state;
		return dataSource.map(item=>{
			const {index,cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode} = item;
			return [index,cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode]
		})
	}

	onSearch = (text)=>{
		const {originalData} = this;
		let result = originalData.filter(data=>{
			return String(data.cameraName).indexOf(text)>=0 || String(data.cameraId).indexOf(text)>=0;
		});
		if(text === ''){
			result = originalData;
		}
		this.setState({dataSource:addSerialNumber(result)});
	}
};