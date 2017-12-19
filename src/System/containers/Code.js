import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/code';
import {actions as platformActions} from '_platform/store/global';
import {Type, Info} from '../components/Code';

@connect(
	state => {
		const {system: {code = {}} = {}, platform} = state;
		return {code, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch)
	})
)
export default class Code extends Component {
	static propTypes = {};

	render() {
		return (
			<div>
				<DynamicTitle title="编码类型" {...this.props}/>
				<Sidebar>
					<Type {...this.props}/>
				</Sidebar>
				<Content>
					<Info {...this.props}/>
				</Content>
			</div>
		);
	}
}
