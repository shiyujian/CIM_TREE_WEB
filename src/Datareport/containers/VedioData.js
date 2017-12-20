import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {UploadModal,VedioTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioData';

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
			uploadModal: false
		}
	}

	render() {
		const {uploadModal} = this.state;

		return (<Main>
			<DynamicTitle title="视频监控" {...this.props} />
			<Content>
				<MainHeader showSendModal={this.showSendModal}/>
				<VedioTable/>
			</Content>
			<UploadModal
			 actions = {this.props.actions}
			 key={uploadModal} 
			 uploadModal={uploadModal}
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
	reduxTest = ()=>{
		const {actions:{Test}} = this.props;
		Test('test');
	}
};