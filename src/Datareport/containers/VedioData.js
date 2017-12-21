import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {UploadModal,VedioTable,MainHeader} from '../components/VedioData';
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
			uploadModal: false,
			dataSource: []
		}
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
		const {uploadModal,dataSource} = this.state,
			sourceData = addSerialNumber(dataSource);

		return (<Main>
			<DynamicTitle title="视频监控" {...this.props} />
			<Content>
				<MainHeader showSendModal={this.showSendModal}/>
				<VedioTable
				dataSource={sourceData}
				/>
			</Content>
			<UploadModal
			 uploadModal={uploadModal}			 
			 actions = {this.props.actions}
			 closeModal={this.closeModal}
			/>
		</Main>)
	}

	showSendModal = ()=>{
        this.setState({uploadModal:true});
    }
    closeModal= ()=>{
        this.setState({uploadModal:false});
	}

	generateTableData = (data)=>{
        const {actions:{
            getDocument,
        }} = this.props;
		let dataSource = []
		data.forEach(item=>{
			getDocument({code:item.code}).then(response=>{
				console.log(response);
				let {extra_params:{cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode}} = response;
				dataSource.push({cameraId,projectName,enginner,cameraName,ip,port,username,password,xAxes,yAxes,modal,uptime,wbsCode})
				this.setState({dataSource});
			})
		})
    }
};