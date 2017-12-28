import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {message} from 'antd';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {UploadModal,ChangeModal,DeleteModal,VedioTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioData';
import {addSerialNumber} from '../components/VedioData/commonFunc';

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
		}
		Object.assign(this,{
			originalData: []
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
		const {uploadModal,changeModal,deleteModal,dataSource,loading,selectRows} = this.state,
			{actions:{jsonToExcel}} = this.props;

		return (<Main>
			<DynamicTitle title="视频监控" {...this.props} />
			<Content>
				<MainHeader
				 showModal={this.showModal}
				 selectJudge={this.selectJudge}
				 jsonToExcel={jsonToExcel}
				 deriveData={this.deriveData}
				 onSearch={this.onSearch}
				/>
				<VedioTable
				dataSource={dataSource}
				loading={loading}
				storeSelectRows={this.storeSelectRows}
				/>
			</Content>
			<UploadModal
			 key={`uploadModal${uploadModal}`}
			 uploadModal={uploadModal}
			 actions = {this.props.actions}
			 closeModal={this.closeModal}
			/>
			<ChangeModal
			 key={`changeModal${changeModal}`}
			 changeModal={changeModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			/>
			<DeleteModal
			 key={`deleteModal${deleteModal}`}
			 deleteModal={deleteModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			 actions = {this.props.actions}
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
		const all = data.map(item=>{
			return getDocument({code:item.code})
		})
		Promise.all(all).then(item =>{
			const dataSource = item.map((response,index)=>{
				let {extra_params:{cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode},code} = response;
				return {index:index+1,
					cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode,code};
			})
			this.originalData = dataSource;
			this.setState({dataSource,loading:false});
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