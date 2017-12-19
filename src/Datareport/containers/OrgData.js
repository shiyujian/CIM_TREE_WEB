import React, {Component} from 'react';
import {TableOrg, ToggleModal} from '../components/OrgData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/orgdata';

@connect(
	state => {
		const {platform, datareport:{orgdata,persondata}} = state;
		return {platform,...orgdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions, ...actions}, dispatch),
	}),
)
export default class OrgData extends Component {
	static propTypes = {};
	render() {
		return (
			<div>
				<DynamicTitle title="组织机构" {...this.props} />
				<Content>
					<TableOrg {...this.props} />
					<ToggleModal {...this.props}/>
				</Content>
			</div>
			)
	}
};
