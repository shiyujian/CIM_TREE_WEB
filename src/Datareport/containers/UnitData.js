import React, {Component} from 'react';
import {TableUnit, ToggleModal} from '../components/UnitData'
import {actions as platformActions} from '_platform/store/global';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import { actions } from '../store/unitdata';

@connect(
	state => {
		const {platform,datareport:{unitdata}} = state;
		return {platform,...unitdata};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch),
	}),
)
export default class UnitData extends Component {
	static propTypes = {};
	render() {
		return (
			<div>
				<DynamicTitle title="单位工程" {...this.props} />
				<Content>
					<TableUnit {...this.props} />
					<ToggleModal {...this.props}/>
				</Content>
			</div>
			)
	}
};
