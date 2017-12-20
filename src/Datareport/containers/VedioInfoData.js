import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {InfoUploadModal,VedioInfoTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioInfoData';

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
			uploadModal: false
		}
	}

	render() {
		const {uploadModal} = this.state;

		return (<Main>
			<DynamicTitle title="影像信息" {...this.props} />
			<Content>
				<MainHeader showSendModal={this.showSendModal}/>
				<VedioInfoTable/>
			</Content>
			<InfoUploadModal
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
};