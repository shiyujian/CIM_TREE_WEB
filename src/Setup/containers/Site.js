import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {getUser} from '_platform/auth';
import {actions} from '../store/site';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Spin} from 'antd';
import {SubTree,Info,Tables,ToggleModal,ImportModal} from '../components/Site';

@connect(
	state => {
		const {platform, setup: {site = {}} = {}} = state;
		return {platform, ...site};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class Site extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading:true
		}
	}
	static propTypes = {};
	componentDidMount() {
		const {actions: {getLocationAc,getProfessAc,getTemplatesAc}} = this.props;
		// 获取location信息
		getLocationAc()
		//	获取专业列表
		getProfessAc();
		//	获取模板下载地址
		getTemplatesAc()
	}
	render() {
		const {
			toggleData: toggleData = {
				type: null,
			},
			importVisible=false,
		} = this.props;
		return (
			<div>
				<DynamicTitle title="工程部位" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
					<Tables {...this.props}/>
				</Content>
				{
					toggleData.type === null ? null : <ToggleModal {...this.props}/>
				}
				{importVisible && <ImportModal {...this.props}/>}
			</div>);
	}
}
