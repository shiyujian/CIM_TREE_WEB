import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {getUser} from '_platform/auth';
import {actions} from '../store/section';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SubTree,Info,Tables,ToggleModal,ItmToggleModal,ImportModal} from '../components/Section';

@connect(
	state => {
		const {platform, setup: {section = {}} = {}} = state;
		return {platform, ...section};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class Section extends Component {

	static propTypes = {};
	componentDidMount() {
		const {actions: {getWbsProjectAc,getProfessAc,getTemplatesAc,getItmTypesAc}} = this.props;
		getWbsProjectAc();
		//	获取专业列表
		getProfessAc();
		//	获取模板下载地址
		getTemplatesAc();
		//	获取分项的尾码下载地址
		getItmTypesAc();
	}
	render() {
		const {
			toggleData: toggleData = {
				type: null,
			},
			createType='C_WP_ITM',
			importVisible=false,
		} = this.props;
		return (
			<div>
				<DynamicTitle title="分部分项" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
					<Tables {...this.props}/>
				</Content>
				{
					toggleData.type === null ? null : (
						createType !== "C_WP_ITM" ? <ToggleModal {...this.props}/> : <ItmToggleModal {...this.props}/>
					)
				}
				{importVisible && <ImportModal {...this.props}/>}
			</div>);
	}
}
