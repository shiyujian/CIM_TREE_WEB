import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {InfoUploadModal,VedioInfoTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioData';
import {addSerialNumber} from '../components/VedioData/commonFunc';

@connect(
	state => {
		const {datareport: {vedioinfodata = {}} = {}, platform} = state;
		return {...vedioinfodata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)

export default class VedioInfoData extends Component {

	constructor(props){
		super(props);
		this.state={
			loading:true,
			uploadModal: false,
			dataSource: []
		}
	}

	async componentDidMount(){
        const {actions:{getScheduleDir}} = this.props;
        const topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_safety_vedioinfodata'});
            if(dir.obj_type){
                if(dir.stored_documents.length>0){
                    this.generateTableData(dir.stored_documents);
                }
            }
        }
    }

	render() {
		const {uploadModal,dataSource,loading} = this.state;

		return (<Main>
			<DynamicTitle title="影像信息" {...this.props} />
			<Content>
				<MainHeader showModal={this.showModal}/>
				<VedioInfoTable
				dataSource={dataSource}
				loading={loading}
				/>
			</Content>
			<InfoUploadModal
			 key={uploadModal}
			 uploadModal={uploadModal}
			 actions = {this.props.actions}
			 closeModal={this.closeModal}
			/>
		</Main>)
	}

	showModal = (modal)=>{
		let a = {};
		a[modal] = true;
        this.setState(a);
    }
    closeModal= ()=>{
        this.setState({uploadModal:false});
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
				let {extra_params:{projectName,ShootingDate,file}} = response;
				return {index:index+1,
					projectName,ShootingDate,file}
			})
			this.setState({dataSource,loading:false});
		})
    }
};