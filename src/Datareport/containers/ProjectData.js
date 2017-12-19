import React, {Component} from 'react';
import {TableProject, ToggleModal} from '../components/ProjectData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import {actions as action2} from '../store/quality';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/projectData';

@connect(
	state => {
		const {platform, datareport: {projectdata}} = state;
		return {platform,...projectdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions,...action2}, dispatch),
	}),
)
export default class ProjectData extends Component {
	render() {
		return (
			<Main>
				<DynamicTitle title="项目信息" {...this.props} />
				<Content>
					<TableProject {...this.props} />
					<ToggleModal {...this.props}/>
				</Content>
			</Main>
			)
	}
}
