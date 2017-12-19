import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';

@connect(
	state => {
		const {platform} = state;
		return {platform};
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions}, dispatch),
	}),
)
export default class Design extends Component {

	static propTypes = {};

	render() {
		return (
			<div>
				<DynamicTitle title="进度提醒" {...this.props}/>
			</div>
		);
	}
}
