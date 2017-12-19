import React, {Component} from 'react';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import reducer, {actions} from '../store/approval';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ProjectTree from '../components/Approval/ProjectTree';
import ProjectInfo from '../components/Approval/ProjectInfo';
import TipsRender from '../components/Approval/TipsRender';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';


@connect(
	state => {
		const {overall:{ approval = {} }, platform} = state;
		return {platform, ...approval};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions, ...previewActions}, dispatch),
	}),
)

export default class Approval extends Component {

	static propTypes = {};

	state={

		unitType:'',

	}

	componentWillReceiveProps(nextProps){

		const {selectedUnit=[]} = nextProps;

		let unitType = selectedUnit[0] && selectedUnit[0].split('--')[1];

		this.setState({ unitType });
	}

	render() {

		// let { selectedUnit=[], blocksIndex={} } = this.props;
		
		return(
			<div>
				<DynamicTitle title="项目报批" {...this.props}/>
				<Sidebar>
					<ProjectTree {...this.props} />
				</Sidebar>

				<Content>
				{ this.state.unitType === 'C_WP_UNT' ?
					<ProjectInfo {...this.props}/> : <TipsRender container='请选择单位工程'/> }
				</Content>
			</div>
		)
	}
}
