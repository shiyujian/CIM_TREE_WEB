import React, {Component} from 'react';
import {TablePerson, ToggleModal} from '../components/PersonData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/persondata';

@connect(
	state => {
		const {platform,datareport:{persondata}} = state;
		return {platform,...persondata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch),
	}),
)
export default class PersonData extends Component {
	static propTypes = {};
	render() {
		return (
			<div>
				<DynamicTitle title="人员信息" {...this.props} />
				{/* <Sidebar>
					<Tree {...this.props}/>
				</Sidebar> */}
				<Content>
					<TablePerson {...this.props} />
					<ToggleModal {...this.props}/>
				</Content>
			</div>
			)
	}
};
