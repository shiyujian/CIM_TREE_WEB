import React, {Component} from 'react';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/nurseryType';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {SubTree,Info,ToggleModal} from '../components/NurseryType';

@connect(
	state => {
		const {platform, project: {nurseryType = {}} = {}} = state;
		return {platform, ...nurseryType};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class NurseryType extends Component {

	static propTypes = {};
	componentDidMount() {
		const {actions: {getFieldAc}} = this.props;
		getFieldAc()
	}
	render() {
		const {
			toggleData: toggleData = {
				type: null,
			},

		} = this.props;
		return (
			<div>
				<DynamicTitle title="类型管理" {...this.props}/>
				<Sidebar>
					<SubTree {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
				</Content>
				{
					toggleData.type === null ? null : <ToggleModal {...this.props}/>
				}
			</div>);
	}
}
