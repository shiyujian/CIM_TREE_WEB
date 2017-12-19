import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/dict';
import {actions as platformActions} from '_platform/store/global';
import {Tree, Bitch, Table} from '../components/Encode';

@connect(
	state => {
		const {system: {dict = {}} = {}, platform} = state;
		return {...dict, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Encode extends Component {
	static propTypes = {};

	render() {
		return (
			<div>
				<DynamicTitle title="项目编码" {...this.props}/>
				<Sidebar>
					<Tree {...this.props}/>
				</Sidebar>
				<Content>
					<Bitch {...this.props}/>
					<Table {...this.props}/>
				</Content>
			</div>
		);
	}
}
